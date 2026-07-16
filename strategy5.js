// 策略5模块 - 否定匹配批量创建
export const strategy5 = {
    // 存储上传的表格数据
    tableData: [],
    // 标记是否正在处理文件上传，防止重复上传
    isProcessingUpload: false,
    
    // 初始化方法：创建UI并绑定事件
    init(container) {
        // 渲染策略5的UI
        container.innerHTML = this.getHtml();
        
        // 绑定DOM元素和事件
        this.bindElements();
        this.bindEvents();
        
        // 显示初始化状态
        this.showStatus('策略5已加载，可开始配置', 'success');
    },
    
    // 生成策略5的HTML结构
    getHtml() {
        return `
            <header class="mb-6">
                <h2 class="text-xl font-bold text-gray-800">否定匹配批量创建</h2>
            </header>

            <form id="negativeForm" class="space-y-4">
                <!-- 重要提示说明 -->
                <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p class="text-sm text-yellow-800"><i class="fa fa-info-circle mr-1"></i> 请注意：Campaign ID, Ad Group ID不能自定义，必须与后台实际id一致</p>
                </div>

                <!-- 按钮组 -->
                <div class="flex flex-col sm:flex-row gap-4 pt-4">
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-2">导入数据（必须包含：Campaign ID, Ad Group ID；至少包含一项：关键词, ASIN）</label>
                        <label class="flex items-center justify-center w-full">
                            <div class="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100" id="dropArea">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <i class="fa fa-cloud-upload text-gray-400 mb-2"></i>
                                    <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">点击上传</span> 或拖放Excel文件</p>
                                    <p class="text-xs text-gray-500">支持 .xlsx 格式，首行需为标题行</p>
                                </div>
                                <input id="negativeFile" type="file" accept=".xlsx" class="hidden" />
                            </div>
                        </label>
                        <p id="fileStatus" class="mt-2 text-sm text-gray-500">未选择文件</p>
                    </div>

                    <div class="flex-1 flex items-end">
                        <button type="button" id="generateBtn" 
                            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            生成否定匹配批量上传模板
                        </button>
                    </div>
                </div>

                <!-- 状态显示区域 -->
                <div class="pt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">状态信息</label>
                    <div id="statusDisplay" class="w-full h-32 p-3 border border-gray-300 rounded-md bg-gray-50 overflow-y-auto text-sm text-gray-700"></div>
                </div>
            </form>
        `;
    },
    
    // 绑定DOM元素
    bindElements() {
        this.form = document.getElementById('negativeForm');
        this.fileInput = document.getElementById('negativeFile');
        this.fileStatus = document.getElementById('fileStatus');
        this.statusDisplay = document.getElementById('statusDisplay');
        this.generateBtn = document.getElementById('generateBtn');
        this.dropArea = document.getElementById('dropArea');
    },
    
    // 绑定事件处理函数
    bindEvents() {
        // 重置文件输入值的辅助函数，解决重复上传问题
        const resetFileInput = () => {
            this.fileInput.value = '';
            this.isProcessingUpload = false;
        };
        
        // 文件上传相关事件
        this.dropArea.addEventListener('click', () => {
            // 防止重复点击导致多次弹窗
            if (!this.isProcessingUpload) {
                this.isProcessingUpload = true;
                this.fileInput.click();
                // 超时自动重置，防止意外状态锁定
                setTimeout(resetFileInput, 5000);
            }
        });
        
        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                this.handleFile(e.target.files[0]);
            }
            resetFileInput();
        });
        
        // 拖放事件
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dropArea.addEventListener(eventName, this.preventDefaults.bind(this), false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            this.dropArea.addEventListener(eventName, this.highlight.bind(this), false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            this.dropArea.addEventListener(eventName, this.unhighlight.bind(this), false);
        });
        
        this.dropArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const file = dt.files[0];
            if (file) {
                this.handleFile(file);
            }
            resetFileInput();
        }, false);
        
        // 生成按钮事件
        this.generateBtn.addEventListener('click', () => this.generateTemplate());
    },
    
    // 拖放辅助函数
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    },
    
    highlight() {
        this.dropArea.classList.add('border-indigo-500', 'bg-blue-50');
    },
    
    unhighlight() {
        this.dropArea.classList.remove('border-indigo-500', 'bg-blue-50');
    },
    
    // 处理上传文件
    handleFile(file) {
        // 清除现有数据
        this.tableData = [];
        
        if (!file.name.endsWith('.xlsx')) {
            this.showStatus('请上传.xlsx格式的Excel文件', 'error');
            this.fileStatus.textContent = '未选择文件';
            return;
        }
        
        this.fileStatus.textContent = `正在处理: ${file.name}`;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                // 验证必要字段
                const requiredFields = ['Campaign ID', 'Ad Group ID'];
                if (jsonData.length === 0) {
                    throw new Error('Excel文件中没有数据');
                }
                
                const firstRow = jsonData[0];
                requiredFields.forEach(field => {
                    if (!(field in firstRow)) {
                        throw new Error(`Excel文件缺少必要列: ${field}`);
                    }
                });
                
                // 验证每行至少包含关键词或ASIN
                const validRows = [];
                const invalidRows = [];
                
                jsonData.forEach((row, index) => {
                    // 强制转换为字符串，即使是null/undefined也会转为"null"/"undefined"，再处理空值
                    const campaignId = String(row["Campaign ID"] || "").trim();
                    const adGroupId = String(row["Ad Group ID"] || "").trim();
                    const keyword = String(row["关键词"] || "").trim();
                    const asin = String(row["ASIN"] || "").trim();
                    
                    // 额外处理：如果转换后是"null"或"undefined"，强制设为空字符串
                    const cleanValue = (val) => val === "null" || val === "undefined" ? "" : val;
                    const cleanedCampaignId = cleanValue(campaignId);
                    const cleanedAdGroupId = cleanValue(adGroupId);
                    const cleanedKeyword = cleanValue(keyword);
                    const cleanedAsin = cleanValue(asin);
                    
                    // 验证必要字段不为空
                    if (!cleanedCampaignId || !cleanedAdGroupId) {
                        invalidRows.push(`行 ${index + 2}：Campaign ID或Ad Group ID为空`);
                        return;
                    }
                    
                    // 验证至少有一个可选字段
                    if (!cleanedKeyword && !cleanedAsin) {
                        invalidRows.push(`行 ${index + 2}：关键词和ASIN不能同时为空`);
                        return;
                    }
                    
                    validRows.push({
                        campaignId: cleanedCampaignId,
                        adGroupId: cleanedAdGroupId,
                        keyword: cleanedKeyword,
                        asin: cleanedAsin
                    });
                });
                
                // 如果有无效行，提示错误
                if (invalidRows.length > 0) {
                    let errorMessage = "发现无效数据行：\n";
                    invalidRows.forEach(err => {
                        errorMessage += `- ${err}\n`;
                    });
                    throw new Error(errorMessage);
                }
                
                // 存储有效数据
                this.tableData = validRows;
                
                this.showStatus(`成功加载 ${this.tableData.length} 条数据`, 'success');
                this.fileStatus.textContent = `已加载 ${this.tableData.length} 条数据`;
            } catch (error) {
                this.showStatus(`文件处理失败: ${error.message}`, 'error');
                this.fileStatus.textContent = '处理失败';
            }
        };
        reader.readAsArrayBuffer(file);
    },
    
    // 显示状态信息
    showStatus(message, type = 'info') {
        const statusEl = document.createElement('div');
        statusEl.className = `mb-1 ${
            type === 'error' ? 'text-red-600' : 
            type === 'success' ? 'text-green-600' : 'text-gray-700'
        }`;
        statusEl.textContent = message;
        this.statusDisplay.prepend(statusEl);
        this.statusDisplay.scrollTop = this.statusDisplay.scrollHeight;
    },
    
    // 生成广告模板
    generateTemplate() {
        try {
            // 验证数据
            if (this.tableData.length === 0) throw new Error("请先导入包含完整数据的Excel文件");
            
            // 构建CSV
            const header = [
                "Product", "Entity", "Operation", "Campaign ID", "Ad Group ID", "Portfolio ID", "Ad ID",
                "Keyword ID", "Product Targeting ID", "Campaign Name", "Ad Group Name", "Start Date",
                "End Date", "Targeting Type", "State", "Daily Budget", "SKU", "Ad Group Default Bid",
                "Bid", "Keyword Text", "Native Language Keyword", "Native Language Locale", "Match Type",
                "Bidding Strategy", "Placement", "Percentage", "Product Targeting Expression"
            ];
            const rows = [header];
            
            // 处理每行数据
            this.tableData.forEach(item => {
                // 处理ASIN（生成否定产品定向行）
                if (item.asin) {
                    rows.push([
                        "Sponsored Products", "Negative Product Targeting", "Create",
                        item.campaignId, item.adGroupId, "", "", "", "",
                        "", "", "", "", "", "enabled", "", "", "", "", "", "", "", "",
                        "", "", "", `asin="${item.asin}"`
                    ]);
                }
                
                // 处理关键词（生成否定关键词行，使用默认的negativeExact匹配类型）
                if (item.keyword) {
                    rows.push([
                        "Sponsored Products", "Negative Keyword", "Create",
                        item.campaignId, item.adGroupId, "", "", "", "",
                        "", "", "", "", "", "enabled", "", "", "", "",
                        item.keyword, "", "", "negativeExact", "", "", "", ""
                    ]);
                }
            });
            
            // 生成并下载CSV
            const csvContent = rows.map(row => 
                row.map(cell => cell.includes(',') || cell.includes('"') 
                    ? `"${cell.replace(/"/g, '""')}"` 
                    : cell
                ).join(',')
            ).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `否定匹配模板_${Date.now()}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            this.showStatus(`模板生成成功，共 ${rows.length - 1} 行数据`, 'success');
        } catch (error) {
            this.showStatus(`生成失败: ${error.message}`, 'error');
        }
    }
};

// 暴露到全局，供主页面调用
window.strategy5 = strategy5;
