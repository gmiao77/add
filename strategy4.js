// 策略4模块 - 常规批量
export const strategy4 = {
    // 存储关键词数据（包含完整信息）
    keywordsData: [],
    
    // 初始化方法：创建UI并绑定事件
    init(container) {
        // 渲染策略4的UI
        container.innerHTML = this.getHtml();
        
        // 绑定DOM元素和事件
        this.bindElements();
        this.bindEvents();
        
        // 显示初始化状态
        this.showStatus('策略4已加载，可开始配置', 'success');
    },
    
    // 生成策略4的HTML结构
    getHtml() {
        return `
            <header class="mb-6">
                <h2 class="text-xl font-bold text-gray-800">常规批量</h2>
            </header>

            <form id="adForm" class="space-y-4">
                <!-- 输入字段组 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">匹配类型</label>
                        <select name="匹配类型" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="broad">broad</option>
                            <option value="phrase">phrase</option>
                            <option value="exact">exact</option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">竞价策略</label>
                        <select name="竞价策略" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="Fixed bid">Fixed bid</option>
                            <option value="Dynamic bids - down only">Dynamic bids - down only</option>
                            <option value="Dynamic bids - up and down">Dynamic bids - up and down</option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">竞价位置</label>
                        <select name="竞价位置"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">请选择</option>
                            <option value="placementTop">placementTop</option>
                            <option value="placementRestOfSearch">placementRestOfSearch</option>
                            <option value="placementProductPage">placementProductPage</option>
                        </select>
                    </div>
                </div>

                <!-- 按钮组 -->
                <div class="flex flex-col sm:flex-row gap-4 pt-4">
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-2">导入数据（从Excel导入，需包含：关键词,SKU,BID,广告活动名称,广告组名称,预算,百分比）</label>
                        <label class="flex items-center justify-center w-full">
                            <div class="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100" id="dropArea">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <i class="fa fa-cloud-upload text-gray-400 mb-2"></i>
                                    <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">点击上传</span> 或拖放Excel文件</p>
                                    <p class="text-xs text-gray-500">支持 .xlsx 格式，首行需为标题行</p>
                                </div>
                                <input id="keywordFile" type="file" accept=".xlsx" class="hidden" />
                            </div>
                        </label>
                        <p id="keywordStatus" class="mt-2 text-sm text-gray-500">未选择文件</p>
                    </div>

                    <div class="flex-1 flex items-end">
                        <button type="button" id="generateBtn" 
                            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            生成广告批量上传模板
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
        this.form = document.getElementById('adForm');
        this.keywordFileInput = document.getElementById('keywordFile');
        this.keywordStatus = document.getElementById('keywordStatus');
        this.statusDisplay = document.getElementById('statusDisplay');
        this.generateBtn = document.getElementById('generateBtn');
        this.dropArea = document.getElementById('dropArea');
    },
    
    // 绑定事件处理函数
    bindEvents() {
        // 文件上传相关事件
        this.dropArea.addEventListener('click', () => this.keywordFileInput.click());
        this.keywordFileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
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
        this.dropArea.addEventListener('drop', (e) => this.handleDrop(e), false);
        
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
    
    // 处理文件选择
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) this.handleKeywordFile(file);
    },
    
    // 处理拖放文件
    handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        if (file) this.handleKeywordFile(file);
    },
    
    // 处理关键词文件（现在包含完整数据）
    handleKeywordFile(file) {
        if (!file.name.endsWith('.xlsx')) {
            this.showStatus('请上传.xlsx格式的Excel文件', 'error');
            return;
        }
        
        this.keywordStatus.textContent = `正在处理: ${file.name}`;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                // 验证必要字段，新增了预算和百分比
                const requiredFields = ['关键词', 'SKU', 'BID', '广告活动名称', '广告组名称', '预算', '百分比'];
                if (jsonData.length === 0) {
                    throw new Error('Excel文件中没有数据');
                }
                
                const firstRow = jsonData[0];
                requiredFields.forEach(field => {
                    if (!(field in firstRow)) {
                        throw new Error(`Excel文件缺少必要列: ${field}`);
                    }
                });
                
                // 存储完整数据
                this.keywordsData = jsonData.filter(row => 
                    row.关键词 && row.SKU && row.BID && row.广告活动名称 && 
                    row.广告组名称 && row.预算 && row.百分比
                );
                
                if (this.keywordsData.length === 0) {
                    this.showStatus('未找到有效数据行，请检查数据完整性', 'error');
                    this.keywordStatus.textContent = '未找到有效数据';
                } else {
                    this.showStatus(`成功加载 ${this.keywordsData.length} 条数据`, 'success');
                    this.keywordStatus.textContent = `已加载 ${this.keywordsData.length} 条数据`;
                }
            } catch (error) {
                this.showStatus(`文件处理失败: ${error.message}`, 'error');
                this.keywordStatus.textContent = '处理失败';
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
            // 获取表单数据
            const formData = new FormData(this.form);
            const inputs = {};
            formData.forEach((value, key) => inputs[key] = value);
            
            // 验证必填项
            const required = ["匹配类型", "竞价策略"];
            required.forEach(field => {
                if (!inputs[field]) throw new Error(`${field} 不能为空`);
            });
            
            // 验证数据
            if (this.keywordsData.length === 0) throw new Error("请先导入包含完整数据的Excel文件");
            
            const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            
            // 构建CSV
            const header = [
                "Product", "Entity", "Operation", "Campaign ID", "Ad Group ID", "Portfolio ID", "Ad ID",
                "Keyword ID", "Product Targeting ID", "Campaign Name", "Ad Group Name", "Start Date",
                "End Date", "Targeting Type", "State", "Daily Budget", "SKU", "Ad Group Default Bid",
                "Bid", "Keyword Text", "Native Language Keyword", "Native Language Locale", "Match Type",
                "Bidding Strategy", "Placement", "Percentage", "Product Targeting Expression"
            ];
            const rows = [header];
            
            // 跟踪已创建的活动和广告组，避免重复
            const createdCampaigns = new Set();
            const createdAdGroups = new Set();
            
            // 生成数据行（基于导入的表格数据）
            this.keywordsData.forEach(item => {
                // 从表格数据获取所有信息，包括预算和百分比
                const campaignName = item["广告活动名称"].trim();
                const adGroupName = item["广告组名称"].trim();
                const sku = item["SKU"].trim();
                const bid = item["BID"].toString().trim();
                const keyword = item["关键词"].trim();
                const budget = item["预算"].toString().trim();
                const percentage = item["百分比"].toString().trim();
                
                // 广告活动ID（唯一标识）
                const campaignId = `${campaignName}_${percentage}`;
                
                // 广告活动行（仅创建一次）
                if (!createdCampaigns.has(campaignId)) {
                    rows.push([
                        "Sponsored Products", "Campaign", "Create", campaignId, "", "", "", "", "",
                        campaignName, "", today, "", "MANUAL", "enabled", budget, 
                        "", "", "", "", "", "", "", inputs["竞价策略"], "", "", ""
                    ]);
                    
                    // 竞价调整行
                    if (inputs["竞价位置"]) {
                        rows.push([
                            "Sponsored Products", "Bidding Adjustment", "Create", campaignId, "", "", "", "", "",
                            "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                            inputs["竞价策略"], inputs["竞价位置"], percentage, ""
                        ]);
                    }
                    
                    createdCampaigns.add(campaignId);
                }
                
                // 广告组ID（唯一标识）
                const adGroupId = `${campaignId}_${adGroupName}`;
                
                // 广告组行（仅创建一次）
                if (!createdAdGroups.has(adGroupId)) {
                    rows.push([
                        "Sponsored Products", "Ad Group", "Create", campaignId, adGroupId, "", "", "", "",
                        "", adGroupName, "", "", "", "enabled", "", "", bid, "", "", "", "", "", "", "", ""
                    ]);
                    
                    // 产品广告行
                    rows.push([
                        "Sponsored Products", "Product Ad", "Create", campaignId, adGroupId, "", "", "", "",
                        "", "", "", "", "", "enabled", "", sku, "", "", "", "", "", "", "", "", ""
                    ]);
                    
                    createdAdGroups.add(adGroupId);
                }
                
                // 关键词行
                rows.push([
                    "Sponsored Products", "Keyword", "Create", campaignId, adGroupId, "", "", "", "",
                    "", "", "", "", "", "enabled", "", "", "", bid, keyword, "", "", 
                    inputs["匹配类型"], "", "", ""
                ]);
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
            a.download = `Amazon广告模板_${Date.now()}.csv`;
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
window.strategy4 = strategy4;
