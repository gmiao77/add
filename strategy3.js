// 策略3模块 - Amazon自动广告批量创建
export const strategy3 = {
    // 存储数据
    data: [],
    
    // 初始化方法：创建UI并绑定事件
    init(container) {
        // 渲染策略3的UI
        container.innerHTML = this.getHtml();
        
        // 绑定DOM元素和事件
        this.bindElements();
        this.bindEvents();
        
        // 显示初始化状态
        this.showStatus('策略3已加载，可开始配置', 'success');
    },
    
    // 生成策略3的HTML结构
    getHtml() {
        return `
            <header class="mb-6">
                <h2 class="text-xl font-bold text-gray-800">自动广告批量创建</h2>
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
                            <option value="placementTop">placementTop</option>
                            <option value="placementRestOfSearch">placementRestOfSearch</option>
                            <option value="placementProductPage">placementProductPage</option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">百分比</label>
                        <input type="text" name="百分比"
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
    },
    
    // 绑定事件处理函数
    bindEvents() {
        // 生成按钮事件
        this.generateBtn.addEventListener('click', () => this.generateTemplate());
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
// 生成广告模板
generateTemplate() {
    try {
        // 获取表单数据（保持不变）
        const formData = new FormData(this.form);
        const inputs = {};
        formData.forEach((value, key) => inputs[key] = value);
        inputs.sku_independent = formData.has('sku_independent');
        
        // 验证必填项（保持不变）
        const required = ["广告活动名称", "广告组名称", "SKU", "预算", "bid", "匹配类型"];
        required.forEach(field => {
            if (!inputs[field]) throw new Error(`${field} 不能为空`);
        });
        
        // 处理参数（保持不变）
        const copyCount = Math.min(100, Math.max(1, parseInt(inputs["复制次数"]) || 1));
        const skus = inputs["SKU"].split(",").map(s => s.trim()).filter(s => s);
        const bids = inputs["bid"].split(",").map(b => b.trim()).filter(b => b);
        
        if (skus.length === 0) throw new Error("请输入有效SKU");
        if (bids.length === 0) throw new Error("请输入有效bid");
        
        // 处理匹配类型（保持不变）
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
        
        // 获取当前日期（保持不变）
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        
        // 构建CSV（保持不变）
        const header = [
            "Product", "Entity", "Operation", "Campaign ID", "Ad Group ID", "Portfolio ID", "Ad ID",
            "Keyword ID", "Product Targeting ID", "Campaign Name", "Ad Group Name", "Start Date",
            "End Date", "Targeting Type", "State", "Daily Budget", "SKU", "Ad Group Default Bid",
            "Bid", "Keyword Text", "Native Language Keyword", "Native Language Locale", "Match Type",
            "Bidding Strategy", "Placement", "Percentage", "Product Targeting Expression"
        ];
        const rows = [header];
        
        // 生成数据行（修改核心逻辑）
        for (let n = 0; n < copyCount; n++) {
            const suffix = `${n + 1}号`;
            
            if (inputs.sku_independent) {
                // 所有SKU放进同一广告活动（对应Python的checkbox_checked逻辑）
                bids.forEach(bid => {
                    matchingTypes.forEach(m_type => {
                        // 构建活动和广告组名称（添加SKU相关逻辑）
                        const baseCampaignName = `${inputs["广告活动名称"]}_${bid}_${m_type}_${suffix}`;
                        const baseAdGroupName = `${inputs["广告组名称"]}_${bid}_${m_type}_${suffix}`;
                        
                        // 广告活动行
                        rows.push([
                            "Sponsored Products", "Campaign", "Create", baseCampaignName, "",
                            "", "", "", "", baseCampaignName, "", today, "", "Auto",
                            "Enabled", inputs["预算"], "", "", "", "", "", "", "", inputs["竞价策略"],
                            "", "", ""
                        ]);
                        
                        // 竞价调整行
                        if (inputs["竞价位置"] && inputs["百分比"]) {
                            rows.push([
                                "Sponsored Products", "Bidding Adjustment", "Create", baseCampaignName, "", "", "", "", "", 
                                "", "", "", "", "", "", "", 
                                "", "", "", "", "", "","", inputs["竞价策略"], inputs["竞价位置"], inputs["百分比"], ""
                            ]);
                        }
                        
                        // 广告组行
                        rows.push([
                            "Sponsored Products", "Ad Group", "Create", baseCampaignName, baseAdGroupName, "", "", "", "", 
                            "", baseAdGroupName, "", "", "", "Enabled", "", 
                            "", bid, "", "", "", "", "", "", "", "", ""
                        ]);
                        
                        // 为每个SKU生成产品广告行
                        skus.forEach(sku => {
                            rows.push([
                                "Sponsored Products", "Product Ad", "Create", baseCampaignName, baseAdGroupName, "", "", "", "", 
                                "", "", "", "", "", "Enabled", "", 
                                sku, "", "", "", "", "", "", "", "", "", ""
                            ]);
                        });
                        
                        // 根据匹配类型生成产品定位行（补全所有m_type处理）
                        let targetingTypes = ["close-match", "substitutes", "loose-match", "complements"];
                        let rowStatus;
                        
                        switch(m_type) {
                            case "0":
                                targetingTypes.forEach(targetingType => {
                                    rowStatus = ["close-match", "substitutes"].includes(targetingType) ? "enabled" : "paused";
                                    rows.push(this.createProductTargetingRow(baseCampaignName, baseAdGroupName, bid, rowStatus, targetingType));
                                });
                                break;
                            case "1":
                                targetingTypes.forEach(targetingType => {
                                    rowStatus = ["substitutes", "complements"].includes(targetingType) ? "enabled" : "paused";
                                    rows.push(this.createProductTargetingRow(baseCampaignName, baseAdGroupName, bid, rowStatus, targetingType));
                                });
                                break;
                            case "2":
                                targetingTypes.forEach(targetingType => {
                                    rowStatus = ["close-match", "loose-match"].includes(targetingType) ? "enabled" : "paused";
                                    rows.push(this.createProductTargetingRow(baseCampaignName, baseAdGroupName, bid, rowStatus, targetingType));
                                });
                                break;
                            case "3":
                                targetingTypes.forEach(targetingType => {
                                    rows.push(this.createProductTargetingRow(baseCampaignName, baseAdGroupName, bid, "enabled", targetingType));
                                });
                                break;
                            case "4":
                                targetingTypes.forEach(targetingType => {
                                    rowStatus = targetingType === "close-match" ? "enabled" : "paused";
                                    rows.push(this.createProductTargetingRow(baseCampaignName, baseAdGroupName, bid, rowStatus, targetingType));
                                });
                                break;
                            case "5":
                                targetingTypes.forEach(targetingType => {
                                    rowStatus = targetingType === "loose-match" ? "enabled" : "paused";
                                    rows.push(this.createProductTargetingRow(baseCampaignName, baseAdGroupName, bid, rowStatus, targetingType));
                                });
                                break;
                            case "6":
                                targetingTypes.forEach(targetingType => {
                                    rowStatus = targetingType === "substitutes" ? "enabled" : "paused";
                                    rows.push(this.createProductTargetingRow(baseCampaignName, baseAdGroupName, bid, rowStatus, targetingType));
                                });
                                break;
                            case "7":
                                targetingTypes.forEach(targetingType => {
                                    rowStatus = targetingType === "complements" ? "enabled" : "paused";
                                    rows.push(this.createProductTargetingRow(baseCampaignName, baseAdGroupName, bid, rowStatus, targetingType));
                                });
                                break;
                        }
                    });
                });
            } else {
                // 每个SKU独立广告活动（对应Python的not checkbox_checked逻辑）
                skus.forEach(sku => {
                    bids.forEach(bid => {
                        matchingTypes.forEach(m_type => {
                            // 构建活动和广告组名称（包含SKU）
                            const campaignNameWithSuffix = `${inputs["广告活动名称"]}_${bid}_${m_type}_${sku}_${suffix}`;
                            const adGroupNameWithSuffix = `${inputs["广告组名称"]}_${bid}_${m_type}_${sku}_${suffix}`;
                            
                            // 广告活动行
                            rows.push([
                                "Sponsored Products", "Campaign", "Create", campaignNameWithSuffix, "",
                                "", "", "", "", campaignNameWithSuffix, "", today, "", "Auto",
                                "Enabled", inputs["预算"], "", "", "", "", "", "", "", inputs["竞价策略"],
                                "", "", ""
                            ]);
                            
                            // 竞价调整行
                            if (inputs["竞价位置"] && inputs["百分比"]) {
                                rows.push([
                                    "Sponsored Products", "Bidding Adjustment", "Create", campaignNameWithSuffix, "", "", "", "", "", 
                                    "", "", "", "", "", "", "", 
                                    "", "", "", "", "", "","", inputs["竞价策略"], inputs["竞价位置"], inputs["百分比"], ""
                                ]);
                            }
                            
                            // 广告组行
                            rows.push([
                                "Sponsored Products", "Ad Group", "Create", campaignNameWithSuffix, adGroupNameWithSuffix, "", "", "", "", 
                                "", adGroupNameWithSuffix, "", "", "", "Enabled", "", 
                                "", bid, "", "", "", "", "", "", "", "", ""
                            ]);
                            
                            // 产品广告行
                            rows.push([
                                "Sponsored Products", "Product Ad", "Create", campaignNameWithSuffix, adGroupNameWithSuffix, "", "", "", "", 
                                "", "", "", "", "", "Enabled", "", 
                                sku, "", "", "", "", "", "", "", "", "", ""
                            ]);
                            
                            // 产品定位行（复用上面的匹配类型处理逻辑）
                            let targetingTypes = ["close-match", "substitutes", "loose-match", "complements"];
                            let rowStatus;
                            
                            switch(m_type) {
                                case "0":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = ["close-match", "substitutes"].includes(targetingType) ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(campaignNameWithSuffix, adGroupNameWithSuffix, bid, rowStatus, targetingType));
                                    });
                                    break;
                                case "1":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = ["substitutes", "complements"].includes(targetingType) ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(campaignNameWithSuffix, adGroupNameWithSuffix, bid, rowStatus, targetingType));
                                    });
                                    break;
                                case "2":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = ["close-match", "loose-match"].includes(targetingType) ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(campaignNameWithSuffix, adGroupNameWithSuffix, bid, rowStatus, targetingType));
                                    });
                                    break;
                                case "3":
                                    targetingTypes.forEach(targetingType => {
                                        rows.push(this.createProductTargetingRow(campaignNameWithSuffix, adGroupNameWithSuffix, bid, "enabled", targetingType));
                                    });
                                    break;
                                case "4":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = targetingType === "close-match" ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(campaignNameWithSuffix, adGroupNameWithSuffix, bid, rowStatus, targetingType));
                                    });
                                    break;
                                case "5":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = targetingType === "loose-match" ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(campaignNameWithSuffix, adGroupNameWithSuffix, bid, rowStatus, targetingType));
                                    });
                                    break;
                                case "6":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = targetingType === "substitutes" ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(campaignNameWithSuffix, adGroupNameWithSuffix, bid, rowStatus, targetingType));
                                    });
                                    break;
                                case "7":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = targetingType === "complements" ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(campaignNameWithSuffix, adGroupNameWithSuffix, bid, rowStatus, targetingType));
                                    });
                                    break;
                            }
                        });
                    });
                });
            }
        }
        
        // 生成并下载CSV（保持不变）
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
},

// 新增辅助方法：创建产品定位行
createProductTargetingRow(campaignName, adGroupName, bid, status, targetingType) {
    return [
        "Sponsored Products", "Product Targeting", "Create", campaignName, adGroupName, "", "", "", "", 
        "", "", "", "", "", status, "", 
        "", "", bid, "", "", "", "", "", "", "", targetingType
    ];
}

// 暴露到全局，供主页面调用
window.strategy3 = strategy3;


