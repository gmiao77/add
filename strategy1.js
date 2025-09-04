// 策略1模块 - Amazon关键词广告批量创建
export const strategy1 = {
    // 存储关键词数据
    keywords: [],
    
    // 初始化方法：创建UI并绑定事件
    init(container) {
        // 渲染策略1的UI
        container.innerHTML = this.getHtml();
        
        // 绑定DOM元素和事件
        this.bindElements();
        this.bindEvents();
        
        // 显示初始化状态
        this.showStatus('策略1已加载，可开始配置', 'success');
    },
    
    // 生成策略1的HTML结构
    getHtml() {
        return `
            <header class="mb-6">
                <h2 class="text-xl font-bold text-gray-800">Amazon关键词广告批量创建1.3</h2>
            </header>

            <form id="adForm" class="space-y-4">
                <!-- 输入字段组 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">广告活动名称</label>
                        <input type="text" name="广告活动名称" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">广告组名称</label>
                        <input type="text" name="广告组名称" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">SKU</label>
                        <input type="text" name="SKU" required placeholder="多个SKU用逗号分隔"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">预算</label>
                        <input type="text" name="预算" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">bid</label>
                        <input type="text" name="bid" required placeholder="多个bid用逗号分隔"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>

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

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">百分比</label>
                        <input type="text" name="百分比" placeholder="多个百分比用逗号分隔"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">关键词分组数量</label>
                        <input type="number" name="关键词分组数量" required min="1" value="1"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">复制次数</label>
                        <input type="number" name="复制次数" required min="1" max="100" value="1"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                </div>

                <!-- 复选框 -->
                <div class="pt-2">
                    <label class="inline-flex items-center">
                        <input type="checkbox" name="sku_independent" 
                            class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        <span class="ml-2 text-sm text-gray-700">所有SKU放进同一广告活动</span>
                    </label>
                </div>

                <!-- 按钮组 -->
                <div class="flex flex-col sm:flex-row gap-4 pt-4">
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-2">导入关键词（从Excel导入）</label>
                        <label class="flex items-center justify-center w-full">
                            <div class="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100" id="dropArea">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <i class="fa fa-cloud-upload text-gray-400 mb-2"></i>
                                    <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">点击上传</span> 或拖放Excel文件</p>
                                    <p class="text-xs text-gray-500">支持 .xlsx 格式</p>
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
    
    // 处理关键词文件
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
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                // 提取关键词
                this.keywords = [];
                jsonData.forEach(row => {
                    const value = row[0];
                    if (value && typeof value === 'string' && value.trim()) {
                        this.keywords.push(value.trim());
                    }
                });
                
                if (this.keywords.length === 0) {
                    this.showStatus('未找到有效关键词', 'error');
                    this.keywordStatus.textContent = '未找到关键词';
                } else {
                    this.showStatus(`成功加载 ${this.keywords.length} 个关键词`, 'success');
                    this.keywordStatus.textContent = `已加载 ${this.keywords.length} 个关键词`;
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
    
    // 关键词分组
    splitKeywordsIntoGroups(groupCount) {
        const groups = [];
        const groupSize = Math.floor(this.keywords.length / groupCount);
        const remainder = this.keywords.length % groupCount;
        let start = 0;
        
        for (let i = 0; i < groupCount; i++) {
            const end = start + groupSize + (i < remainder ? 1 : 0);
            groups.push(this.keywords.slice(start, end));
            start = end;
        }
        return groups;
    },
    
    // 生成广告模板
    generateTemplate() {
        try {
            // 获取表单数据
            const formData = new FormData(this.form);
            const inputs = {};
            formData.forEach((value, key) => inputs[key] = value);
            inputs.sku_independent = formData.has('sku_independent');
            
            // 验证必填项
            const required = ["广告活动名称", "广告组名称", "SKU", "预算", "bid"];
            required.forEach(field => {
                if (!inputs[field]) throw new Error(`${field} 不能为空`);
            });
            
            // 验证关键词
            if (this.keywords.length === 0) throw new Error("请先导入关键词");
            
            // 处理参数
            const copyCount = Math.min(100, Math.max(1, parseInt(inputs["复制次数"]) || 1));
            const groupCount = Math.max(1, parseInt(inputs["关键词分组数量"]) || 1);
            const skus = inputs["SKU"].split(",").map(s => s.trim()).filter(s => s);
            const bids = inputs["bid"].split(",").map(b => b.trim()).filter(b => b);
            const percentages = inputs["百分比"] ? 
                inputs["百分比"].split(",").map(p => p.trim()).filter(p => p) : ["0"];
            
            if (skus.length === 0) throw new Error("请输入有效SKU");
            if (bids.length === 0) throw new Error("请输入有效bid");
            
            // 分组关键词
            const groupedKeywords = this.splitKeywordsIntoGroups(groupCount);
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
            
            // 生成数据行（核心逻辑）
            for (let n = 0; n < copyCount; n++) {
                const suffix = `复制组${n + 1}`;
                
                if (inputs.sku_independent) {
                    // 所有SKU同一活动
                    bids.forEach(bid => {
                        groupedKeywords.forEach((group, gIdx) => {
                            const gSuffix = `A${gIdx + 1}`;
                            percentages.forEach(percent => {
                                // 广告活动行
                                const campaignId = `${inputs['广告活动名称']}_${gSuffix}_${bid}_${percent}_${suffix}`;
                                rows.push([
                                    "Sponsored Products", "Campaign", "Create", campaignId, "", "", "", "", "",
                                    campaignId, "", today, "", "MANUAL", "enabled", inputs["预算"], 
                                    "", "", "", "", "", "", "", inputs["竞价策略"], "", "", ""
                                ]);
                                
                                // 竞价调整行
                                if (inputs["竞价位置"]) {
                                    rows.push([
                                        "Sponsored Products", "Bidding Adjustment", "Create", campaignId, "", "", "", "", "",
                                        "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                                        inputs["竞价策略"], inputs["竞价位置"], percent, ""
                                    ]);
                                }
                                
                                // 广告组行
                                const adGroupId = `${inputs['广告组名称']}_${gSuffix}_${bid}_${percent}_${suffix}`;
                                rows.push([
                                    "Sponsored Products", "Ad Group", "Create", campaignId, adGroupId, "", "", "", "",
                                    "", adGroupId, "", "", "", "enabled", "", "", bid, "", "", "", "", "", "", "", ""
                                ]);
                                
                                // 产品广告行
                                skus.forEach(sku => {
                                    rows.push([
                                        "Sponsored Products", "Product Ad", "Create", campaignId, adGroupId, "", "", "", "",
                                        "", "", "", "", "", "enabled", "", sku, "", "", "", "", "", "", "", "", ""
                                    ]);
                                });
                                
                                // 关键词行
                                group.forEach(keyword => {
                                    rows.push([
                                        "Sponsored Products", "Keyword", "Create", campaignId, adGroupId, "", "", "", "",
                                        "", "", "", "", "", "enabled", "", "", "", bid, keyword, "", "", 
                                        inputs["匹配类型"], "", "", ""
                                    ]);
                                });
                            });
                        });
                    });
                } else {
                    // 每个SKU独立活动（略，与原逻辑一致）
                    skus.forEach(sku => {
                        bids.forEach(bid => {
                            groupedKeywords.forEach((group, gIdx) => {
                                const gSuffix = `A${gIdx + 1}`;
                                const adGroupId = `${inputs['广告活动名称']}_${sku}_${gSuffix}_${bid}_${suffix}`;
                                
                                percentages.forEach(percent => {
                                    // 广告活动行
                                    const campaignId = `${inputs['广告活动名称']}_${sku}_${gSuffix}_${bid}_${percent}_${suffix}`;
                                    rows.push([
                                        "Sponsored Products", "Campaign", "Create", campaignId, "", "", "", "", "",
                                        campaignId, "", today, "", "MANUAL", "enabled", inputs["预算"], 
                                        "", "", "", "", "", "", "", inputs["竞价策略"], "", "", ""
                                    ]);
                    
                                    // 广告组行
                                    rows.push([
                                        "Sponsored Products", "Ad Group", "Create", adGroupId, "", campaignId, "", "", "",
                                        adGroupId, sku, "", "", "", "enabled", "", bid, "", "", "", "", "", "", "", "", ""
                                    ]);
                    
                                    // 关键词行（遍历分组关键词）
                                    group.forEach(keyword => {
                                        const adjustedBid = (parseFloat(bid) * (percent / 100)).toFixed(2);
                                        rows.push([
                                            "Sponsored Products", "Keyword", "Create", `${adGroupId}_${keyword}`, keyword,
                                            adGroupId, campaignId, "Broad", "enabled", adjustedBid, "", "", "", "", "", "", "", "",
                                            "", "", "", "", "", "", "", ""
                                        ]);
                                    });
                    
                                    // 商品推广行
                                    rows.push([
                                        "Sponsored Products", "Product Ad", "Create", `${adGroupId}_product_${sku}`,
                                        sku, adGroupId, campaignId, "enabled", "", "", "", "", "", "", "", "", "", "", "", "", "",
                                        "", "", "", "", ""
                                    ]);
                                });
                            });
                        });
                    });
                }
            }
            
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
window.strategy1 = strategy1;
