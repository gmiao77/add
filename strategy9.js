// 策略9模块 - Amazon自动广告批量创建
export const strategy9 = {
    // 存储数据
    data: [],
    importedData: null, // 存储导入的表格数据
    
    // 初始化方法：创建UI并绑定事件
    init(container) {
        // 渲染策略9的UI
        container.innerHTML = this.getHtml();
        
        // 绑定DOM元素和事件
        this.bindElements();
        this.bindEvents();
        
        // 显示初始化状态
        this.showStatus('策略9已加载，可开始配置', 'success');
    },
    
    // 生成策略9的HTML结构
    getHtml() {
        return `
            <header class="mb-6">
                <h2 class="text-xl font-bold text-gray-800">自动广告批量创建-受众群体</h2>
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
                        <input type="text" name="匹配类型" required placeholder="0-7的数字，多个用逗号分隔"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">Audience ID</label>
                        <input type="text" name="AudienceID" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">受众百分比</label>
                        <input type="text" name="ShopperCohortPercentage"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">复制次数（不复制则填0）</label>
                        <input type="number" name="复制次数" required min="1" max="100" value="1"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                </div>

                <!-- 表格导入区域 -->
                <div class="space-y-2 pt-2">
                    <label class="block text-sm font-medium text-gray-700">导入数据表格</label>
                    <input type="file" id="fileImport" accept=".csv,.xlsx,.xls"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <p class="text-xs text-gray-500">支持CSV、Excel格式，需包含"Audience ID","SKU","Campaign Name","Ad Group Name","Daily Budget","Bid"列</p>
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
                    <div class="flex-1 flex items-end">
                        <button type="button" id="generateBtn" 
                            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            生成广告批量上传模板
                        </button>
                    </div>
                </div>

                <!-- 状态显示区域 -->
                <div class="pt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">参数说明与状态信息</label>
                    <div id="statusDisplay" class="w-full h-32 p-3 border border-gray-300 rounded-md bg-gray-50 overflow-y-auto text-sm text-gray-700">
                        <p>需要同时创建多个bid或者匹配类型的，用英文逗号隔开</p>
                        <p>匹配类型：0紧密匹配，同类商品，1同类商品，互补商品，2紧密匹配，宽泛匹配，3所有匹配，4紧密匹配，5宽泛匹配，6同类商品，7互补商品</p>
                    </div>
                </div>
            </form>
        `;
    },
    
    // 绑定DOM元素
    bindElements() {
        this.form = document.getElementById('adForm');
        this.statusDisplay = document.getElementById('statusDisplay');
        this.generateBtn = document.getElementById('generateBtn');
        this.fileImport = document.getElementById('fileImport');
    },
    
    // 绑定事件处理函数
    bindEvents() {
        // 生成按钮事件
        this.generateBtn.addEventListener('click', () => this.generateTemplate());
        // 文件导入事件
        this.fileImport.addEventListener('change', (e) => this.handleFileImport(e));
    },
    
    // 处理文件导入
    handleFileImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // 简单处理，实际项目中可能需要使用xlsx库解析Excel文件
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                // 假设是CSV文件，实际项目中需根据文件类型处理
                const content = event.target.result;
                const lines = content.split('\n').filter(line => line.trim());
                if (lines.length < 2) throw new Error('导入的文件内容为空或格式不正确');
                
                // 解析表头
                const headers = lines[0].split(',').map(header => header.trim());
                const requiredHeaders = ["Audience ID", "SKU", "Campaign Name", "Ad Group Name", "Daily Budget", "Bid"];
                const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
                
                if (missingHeaders.length > 0) {
                    throw new Error(`导入的表格缺少必要列：${missingHeaders.join(', ')}`);
                }
                
                // 解析数据行
                this.importedData = [];
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',');
                    const row = {};
                    headers.forEach((header, index) => {
                        row[header] = values[index]?.trim() || '';
                    });
                    this.importedData.push(row);
                }
                
                this.showStatus(`表格导入成功，共 ${this.importedData.length} 行数据`, 'success');
            } catch (error) {
                this.showStatus(`文件导入失败: ${error.message}`, 'error');
                this.importedData = null;
            }
        };
        
        // 读取文件内容（CSV为文本，Excel需二进制处理）
        if (file.name.endsWith('.csv')) {
            reader.readAsText(file);
        } else {
            this.showStatus('暂不支持Excel格式，请使用CSV格式', 'error');
        }
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
    
    // 获取数据，优先使用导入的数据
    getResolvedData(baseData, sku = null, bid = null, mType = null) {
        if (!this.importedData) return baseData;
        
        // 尝试根据SKU、bid、mType匹配导入的数据
        let matchedData = this.importedData;
        if (sku) matchedData = matchedData.filter(item => item.SKU === sku);
        if (bid) matchedData = matchedData.filter(item => item.Bid === bid);
        
        // 返回匹配的第一条数据或基础数据
        return matchedData.length > 0 ? {
            ...baseData,
            "广告活动名称": matchedData[0]["Campaign Name"] || baseData["广告活动名称"],
            "广告组名称": matchedData[0]["Ad Group Name"] || baseData["广告组名称"],
            "预算": matchedData[0]["Daily Budget"] || baseData["预算"],
            "AudienceID": matchedData[0]["Audience ID"] || baseData["AudienceID"],
            "bid": matchedData[0]["Bid"] || baseData["bid"],
            "SKU": matchedData[0]["SKU"] || baseData["SKU"]
        } : baseData;
    },
    
    // 生成广告模板
    generateTemplate() {
        try {
            // 获取表单数据
            const formData = new FormData(this.form);
            const inputs = {};
            formData.forEach((value, key) => inputs[key] = value);
            inputs.sku_independent = formData.has('sku_independent');
            inputs.AudienceID = formData.get('AudienceID');
            inputs.ShopperCohortPercentage = formData.get('ShopperCohortPercentage') || '';
            inputs.ShopperCohortType = formData.get('ShopperCohortType') || '';
            inputs.SegmentName = formData.get('SegmentName') || '';
            
            // 验证必填项
            const required = ["广告活动名称", "广告组名称", "SKU", "预算", "bid", "匹配类型", "AudienceID"];
            required.forEach(field => {
                if (!inputs[field]) throw new Error(`${field} 不能为空`);
            });
            
            // 处理参数
            const copyCount = Math.min(100, Math.max(0, parseInt(inputs["复制次数"]) || 0));
            const skus = inputs["SKU"].split(",").map(s => s.trim()).filter(s => s);
            const bids = inputs["bid"].split(",").map(b => b.trim()).filter(b => b);
            
            if (skus.length === 0) throw new Error("请输入有效SKU");
            if (bids.length === 0) throw new Error("请输入有效bid");
            
            // 处理匹配类型
            const matchingTypesInput = inputs["匹配类型"].trim();
            const matchingTypes = [];
            for (const item of matchingTypesInput.split(",")) {
                const trimmedItem = item.trim();
                if (trimmedItem && ["0", "1", "2", "3", "4", "5", "6", "7"].includes(trimmedItem)) {
                    matchingTypes.push(trimmedItem);
                } else {
                    throw new Error("匹配类型必须是 0-7 的数字组合，多种匹配全开，数字间用逗号隔开");
                }
            }
            
            if (matchingTypes.length === 0) throw new Error("请输入有效匹配类型");
            
            // 获取当前日期
            const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            
            // 构建CSV表头（保留竞价策略列，增加新列，移除竞价位置相关列）
            const header = [
                "Product", "Entity", "Operation", "Campaign ID", "Ad Group ID", "Portfolio ID", "Ad ID",
                "Keyword ID", "Product Targeting ID", "Campaign Name", "Ad Group Name", "Start Date",
                "End Date", "Targeting Type", "State", "Daily Budget", "SKU", "Ad Group Default Bid",
                "Bid", "Keyword Text", "Native Language Keyword", "Native Language Locale", "Match Type",
                "Bidding Strategy", "Placement", "Percentage", "Product Targeting Expression",
                "Audience ID", "Shopper Cohort Percentage", "Shopper Cohort Type", "Segment Name" // 新增列
            ];
            const rows = [header];
            
            // 生成数据行（核心逻辑）
            const totalCopies = copyCount || 1; // 处理0次复制的情况
            for (let n = 0; n < totalCopies; n++) {
                // 仅当复制次数>1时添加后缀
                const suffix = copyCount > 1 ? `${n + 1}号` : '';
                
                if (inputs.sku_independent) {
                    // 所有SKU放进同一广告活动
                    bids.forEach(bid => {
                        matchingTypes.forEach(m_type => {
                            // 解析数据，优先使用导入的数据
                            const resolvedData = this.getResolvedData(inputs, null, bid, m_type);
                            
                            // 构建活动和广告组名称（处理后缀）
                            const baseCampaignName = `${resolvedData["广告活动名称"]}_${bid}_${m_type}${suffix ? '_' + suffix : ''}`;
                            const baseAdGroupName = `${resolvedData["广告组名称"]}_${bid}_${m_type}${suffix ? '_' + suffix : ''}`;
                            
                            // 广告活动行（包含新列，竞价策略列固定为"Fixed bid"）
                            rows.push([
                                "Sponsored Products", "Campaign", "Create", baseCampaignName, "",
                                "", "", "", "", baseCampaignName, "", today, "", "Auto",
                                "enabled", resolvedData["预算"], "", "", "", "", "", "", "", 
                                "Fixed bid", "", "", "", "", "", "", ""
                            ]);
                            
                            // 竞价调整行（按新要求修改）
                                rows.push([
                                    "Sponsored Products", "Bidding Adjustment", "Create", campaignNameWithSuffix, "", "", "", "", "", 
                                    "", "", "", "", "", "", "", 
                                    "", "", "", "", "", "","", 
                                    "Fixed bid", "", "","", resolvedData.AudienceID, resolvedData.ShopperCohortPercentage, "AUDIENCE_SEGMENT", ""
                                ]);
                            
                            // 广告组行（竞价策略列固定为"Fixed bid"）
                            rows.push([
                                "Sponsored Products", "Ad Group", "Create", baseCampaignName, baseAdGroupName, "", "", "", "", 
                                "", baseAdGroupName, "", "", "", "enabled", "", 
                                "", bid, "", "", "", "", "", "", "", "", "", "", "", "", ""
                            ]);
                            
                            // 为每个SKU生成产品广告行（竞价策略列固定为"Fixed bid"）
                            skus.forEach(sku => {
                                const skuResolvedData = this.getResolvedData(resolvedData, sku);
                                rows.push([
                                    "Sponsored Products", "Product Ad", "Create", baseCampaignName, baseAdGroupName, "", "", "", "", 
                                    "", "", "", "", "", "enabled", "", 
                                    skuResolvedData.SKU, "", "", "", "", "", "", "", "", "", "", "", "", "", ""
                                ]);
                            });
                            
                            // 产品定位行（补全所有匹配类型，竞价策略列固定为"Fixed bid"）
                            let targetingTypes = ["close-match", "substitutes", "loose-match", "complements"];
                            let rowStatus;
                            
                            switch(m_type) {
                                case "0":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = ["close-match", "substitutes"].includes(targetingType) ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(
                                            baseCampaignName, baseAdGroupName, bid, rowStatus, targetingType,
                                            resolvedData
                                        ));
                                    });
                                    break;
                                case "1":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = ["substitutes", "complements"].includes(targetingType) ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(
                                            baseCampaignName, baseAdGroupName, bid, rowStatus, targetingType,
                                            resolvedData
                                        ));
                                    });
                                    break;
                                case "2":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = ["close-match", "loose-match"].includes(targetingType) ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(
                                            baseCampaignName, baseAdGroupName, bid, rowStatus, targetingType,
                                            resolvedData
                                        ));
                                    });
                                    break;
                                case "3":
                                    targetingTypes.forEach(targetingType => {
                                        rows.push(this.createProductTargetingRow(
                                            baseCampaignName, baseAdGroupName, bid, "enabled", targetingType,
                                            resolvedData
                                        ));
                                    });
                                    break;
                                case "4":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = targetingType === "close-match" ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(
                                            baseCampaignName, baseAdGroupName, bid, rowStatus, targetingType,
                                            resolvedData
                                        ));
                                    });
                                    break;
                                case "5":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = targetingType === "loose-match" ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(
                                            baseCampaignName, baseAdGroupName, bid, rowStatus, targetingType,
                                            resolvedData
                                        ));
                                    });
                                    break;
                                case "6":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = targetingType === "substitutes" ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(
                                            baseCampaignName, baseAdGroupName, bid, rowStatus, targetingType,
                                            resolvedData
                                        ));
                                    });
                                    break;
                                case "7":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = targetingType === "complements" ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(
                                            baseCampaignName, baseAdGroupName, bid, rowStatus, targetingType,
                                            resolvedData
                                        ));
                                    });
                                    break;
                            }
                        });
                    });
                } else {
                    // 每个SKU独立广告活动
                    skus.forEach(sku => {
                        bids.forEach(bid => {
                            matchingTypes.forEach(m_type => {
                                // 解析数据，优先使用导入的数据
                                const resolvedData = this.getResolvedData(inputs, sku, bid, m_type);
                                
                                // 构建活动和广告组名称（包含SKU和后缀）
                                const campaignNameWithSuffix = `${resolvedData["广告活动名称"]}_${bid}_${m_type}_${sku}${suffix ? '_' + suffix : ''}`;
                                const adGroupNameWithSuffix = `${resolvedData["广告组名称"]}_${bid}_${m_type}_${sku}${suffix ? '_' + suffix : ''}`;
                                
                                // 广告活动行（竞价策略列固定为"Fixed bid"）
                                rows.push([
                                    "Sponsored Products", "Campaign", "Create", campaignNameWithSuffix, "",
                                    "", "", "", "", campaignNameWithSuffix, "", today, "", "Auto",
                                    "enabled", resolvedData["预算"], "", "", "", "", "", "", "", 
                                    "Fixed bid", "", "", "", "", "", "", ""
                                ]);
                                
                                // 竞价调整行（按新要求修改）
                                rows.push([
                                    "Sponsored Products", "Bidding Adjustment", "Create", campaignNameWithSuffix, "", "", "", "", "", 
                                    "", "", "", "", "", "", "", 
                                    "", "", "", "", "", "","", 
                                    "Fixed bid", "", "","", resolvedData.AudienceID, resolvedData.ShopperCohortPercentage, "AUDIENCE_SEGMENT", ""
                                ]);
                                
                                // 广告组行（竞价策略列固定为"Fixed bid"）
                                rows.push([
                                    "Sponsored Products", "Ad Group", "Create", campaignNameWithSuffix, adGroupNameWithSuffix, "", "", "", "", 
                                    "", adGroupNameWithSuffix, "", "", "", "enabled", "", 
                                    "", bid, "", "", "", "", "", "", "", "", "", "", "", "", ""
                                ]);
                                
                                // 产品广告行（竞价策略列固定为"Fixed bid"）
                                rows.push([
                                    "Sponsored Products", "Product Ad", "Create", campaignNameWithSuffix, adGroupNameWithSuffix, "", "", "", "", 
                                    "", "", "", "", "", "enabled", "", 
                                    resolvedData.SKU, "", "", "", "", "", "", "", "", "", "", "", "", "", ""
                                ]);
                                
                                // 产品定位行（竞价策略列固定为"Fixed bid"）
                                let targetingTypes = ["close-match", "substitutes", "loose-match", "complements"];
                                let rowStatus;
                                
                                switch(m_type) {
                                    case "0":
                                        targetingTypes.forEach(targetingType => {
                                            rowStatus = ["close-match", "substitutes"].includes(targetingType) ? "enabled" : "paused";
                                            rows.push(this.createProductTargetingRow(
                                                campaignNameWithSuffix, adGroupNameWithSuffix, bid, rowStatus, targetingType,
                                                resolvedData
                                            ));
                                        });
                                        break;
                                    case "1":
                                        targetingTypes.forEach(targetingType => {
                                            rowStatus = ["substitutes", "complements"].includes(targetingType) ? "enabled" : "paused";
                                            rows.push(this.createProductTargetingRow(
                                                campaignNameWithSuffix, adGroupNameWithSuffix, bid, rowStatus, targetingType,
                                                resolvedData
                                            ));
                                        });
                                        break;
                                    case "2":
                                        targetingTypes.forEach(targetingType => {
                                            rowStatus = ["close-match", "loose-match"].includes(targetingType) ? "enabled" : "paused";
                                            rows.push(this.createProductTargetingRow(
                                                campaignNameWithSuffix, adGroupNameWithSuffix, bid, rowStatus, targetingType,
                                                resolvedData
                                            ));
                                        });
                                        break;
                                    case "3":
                                        targetingTypes.forEach(targetingType => {
                                            rows.push(this.createProductTargetingRow(
                                                campaignNameWithSuffix, adGroupNameWithSuffix, bid, "enabled", targetingType,
                                                resolvedData
                                            ));
                                        });
                                        break;
                                    case "4":
                                        targetingTypes.forEach(targetingType => {
                                            rowStatus = targetingType === "close-match" ? "enabled" : "paused";
                                            rows.push(this.createProductTargetingRow(
                                                campaignNameWithSuffix, adGroupNameWithSuffix, bid, rowStatus, targetingType,
                                                resolvedData
                                            ));
                                        });
                                        break;
                                    case "5":
                                        targetingTypes.forEach(targetingType => {
                                            rowStatus = targetingType === "loose-match" ? "enabled" : "paused";
                                            rows.push(this.createProductTargetingRow(
                                                campaignNameWithSuffix, adGroupNameWithSuffix, bid, rowStatus, targetingType,
                                                resolvedData
                                            ));
                                        });
                                        break;
                                    case "6":
                                        targetingTypes.forEach(targetingType => {
                                            rowStatus = targetingType === "substitutes" ? "enabled" : "paused";
                                            rows.push(this.createProductTargetingRow(
                                                campaignNameWithSuffix, adGroupNameWithSuffix, bid, rowStatus, targetingType,
                                                resolvedData
                                            ));
                                        });
                                        break;
                                    case "7":
                                        targetingTypes.forEach(targetingType => {
                                            rowStatus = targetingType === "complements" ? "enabled" : "paused";
                                            rows.push(this.createProductTargetingRow(
                                                campaignNameWithSuffix, adGroupNameWithSuffix, bid, rowStatus, targetingType,
                                                resolvedData
                                            ));
                                        });
                                        break;
                                }
                            });
                        });
                    });
                }
            }
            
            // 生成并下载CSV
            const csvContent = rows.map(row => row.map(cell => {
                // 处理包含逗号或双引号的单元格
                if (cell && (cell.includes(',') || cell.includes('"'))) {
                    return `"${cell.replace(/"/g, '""')}"`;
                }
                return cell || ''; // 确保空单元格正确处理
            }).join(',')).join('\n');
            
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
    },
    
    // 辅助方法：创建产品定位行（包含新列，竞价策略列固定为"Fixed bid"）
    createProductTargetingRow(campaignName, adGroupName, bid, status, targetingType, resolvedData) {
        return [
            "Sponsored Products", "Product Targeting", "Create", campaignName, adGroupName, "", "", "", "", 
            "", "", "", "", "", status, "", 
            "", "", bid, "", "", "", "", "", "", targetingType, "", "", "", ""
        ];
    }
};

// 暴露到全局，供主页面调用
window.strategy9 = strategy9;
