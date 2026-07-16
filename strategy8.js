// 策略8模块 - Amazon自动广告批量批量创建-群友自定义（1活动多广告组）
export const strategy8 = {
    // 存储数据
    data: [],
    
    // 初始化方法：创建UI并绑定事件
    init(container) {
        // 渲染策略8的UI
        container.innerHTML = this.getHtml();
        
        // 绑定DOM元素和事件
        this.bindElements();
        this.bindEvents();
        
        // 显示初始化状态
        this.showStatus('策略8已加载，可开始配置', 'success');
    },
    
    // 生成策略8的HTML结构
    getHtml() {
        return `
            <header class="mb-6">
                <h2 class="text-xl font-bold text-gray-800">自动广告批量创建-1活动多广告组</h2>
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

                    <!-- 竞价位置改为多复选框 -->
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">竞价位置（至少勾选1个）</label>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <label class="flex items-center space-x-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                                <input type="checkbox" name="竞价位置" value="placementTop" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                                <span class="text-sm">搜索顶部</span>
                            </label>
                            <label class="flex items-center space-x-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                                <input type="checkbox" name="竞价位置" value="placementRestOfSearch" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                                <span class="text-sm">其他搜索位置</span>
                            </label>
                            <label class="flex items-center space-x-2 p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                                <input type="checkbox" name="竞价位置" value="placementProductPage" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                                <span class="text-sm">商品页面</span>
                            </label>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">百分比</label>
                        <input type="text" name="百分比" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="所有勾选位置共用该百分比">
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">复制次数</label>
                        <input type="number" name="复制次数" required min="1" max="100" value="1"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
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
                        <p>竞价位置支持多选，所有勾选的位置共用同一个百分比设置</p>
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
        // 绑定竞价位置复选框
        this.placementCheckboxes = document.querySelectorAll('input[name="竞价位置"]');
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
    generateTemplate() {
        try {
            // 获取表单数据
            const formData = new FormData(this.form);
            const inputs = {};
            formData.forEach((value, key) => {
                // 处理竞价位置多复选框（收集所有勾选的值）
                if (key === "竞价位置") {
                    if (!inputs[key]) inputs[key] = [];
                    inputs[key].push(value);
                } else {
                    inputs[key] = value;
                }
            });
            
            // 验证必填项
            const required = ["广告活动名称", "广告组名称", "SKU", "预算", "bid", "匹配类型", "百分比"];
            required.forEach(field => {
                if (!inputs[field]) throw new Error(`${field} 不能为空`);
            });
            
            // 验证竞价位置至少勾选1个
            const selectedPlacements = inputs["竞价位置"] || [];
            if (selectedPlacements.length === 0) {
                throw new Error("竞价位置至少需要勾选1个");
            }
            
            // 处理参数
            const copyCount = Math.min(100, Math.max(0, parseInt(inputs["复制次数"]) || 0));
            const skus = inputs["SKU"].split(",").map(s => s.trim()).filter(s => s);
            const bids = inputs["bid"].split(",").map(b => b.trim()).filter(b => b);
            const percentage = inputs["百分比"].trim();
            
            if (skus.length === 0) throw new Error("请输入有效SKU");
            if (bids.length === 0) throw new Error("请输入有效bid");
            if (!/^\d+(\.\d+)?$/.test(percentage)) throw new Error("百分比必须是有效数字");
            
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
            const totalCopies = copyCount || 1; // 处理0次复制的情况
            for (let n = 0; n < totalCopies; n++) {
                // 仅当复制次数>1时添加后缀
                const suffix = copyCount > 1 ? `${n + 1}号` : '';
                
                // 使用用户输入的广告活动名称，不添加额外后缀
                const campaignName = `${inputs["广告活动名称"]}${suffix ? '_' + suffix : ''}`;
                
                // 广告活动行（每个复制周期只创建一个广告活动）
                rows.push([
                    "Sponsored Products", "Campaign", "Create", campaignName, "",
                    "", "", "", "", campaignName, "", today, "", "Auto",
                    "enabled", inputs["预算"], "", "", "", "", "", "", "", inputs["竞价策略"],
                    "", "", ""
                ]);
                
                // 竞价调整行：为每个勾选的竞价位置生成一行
                selectedPlacements.forEach(placement => {
                    rows.push([
                        "Sponsored Products", "Bidding Adjustment", "Create", campaignName, "", "", "", "", "", 
                        "", "", "", "", "", "", "", 
                        "", "", "", "", "", "","", inputs["竞价策略"], placement, percentage, ""
                    ]);
                });
                
                // 为每个SKU、bid和匹配类型组合创建广告组
                skus.forEach(sku => {
                    bids.forEach(bid => {
                        matchingTypes.forEach(m_type => {
                            // 构建广告组名称（包含SKU、bid、匹配类型和后缀）
                            const adGroupName = `${inputs["广告组名称"]}_${sku}_${bid}_${m_type}${suffix ? '_' + suffix : ''}`;
                            
                            // 广告组行
                            rows.push([
                                "Sponsored Products", "Ad Group", "Create", campaignName, adGroupName, "", "", "", "", 
                                "", adGroupName, "", "", "", "enabled", "", 
                                "", bid, "", "", "", "", "", "", "", "", ""
                            ]);
                            
                            // 产品广告行
                            rows.push([
                                "Sponsored Products", "Product Ad", "Create", campaignName, adGroupName, "", "", "", "", 
                                "", "", "", "", "", "enabled", "", 
                                sku, "", "", "", "", "", "", "", "", "", ""
                            ]);
                            
                            // 产品定位行
                            let targetingTypes = ["close-match", "substitutes", "loose-match", "complements"];
                            let rowStatus;
                            
                            switch(m_type) {
                                case "0":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = ["close-match", "substitutes"].includes(targetingType) ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(campaignName, adGroupName, bid, rowStatus, targetingType));
                                    });
                                    break;
                                case "1":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = ["substitutes", "complements"].includes(targetingType) ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(campaignName, adGroupName, bid, rowStatus, targetingType));
                                    });
                                    break;
                                case "2":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = ["close-match", "loose-match"].includes(targetingType) ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(campaignName, adGroupName, bid, rowStatus, targetingType));
                                    });
                                    break;
                                case "3":
                                    targetingTypes.forEach(targetingType => {
                                        rows.push(this.createProductTargetingRow(campaignName, adGroupName, bid, "enabled", targetingType));
                                    });
                                    break;
                                case "4":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = targetingType === "close-match" ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(campaignName, adGroupName, bid, rowStatus, targetingType));
                                    });
                                    break;
                                case "5":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = targetingType === "loose-match" ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(campaignName, adGroupName, bid, rowStatus, targetingType));
                                    });
                                    break;
                                case "6":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = targetingType === "substitutes" ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(campaignName, adGroupName, bid, rowStatus, targetingType));
                                    });
                                    break;
                                case "7":
                                    targetingTypes.forEach(targetingType => {
                                        rowStatus = targetingType === "complements" ? "enabled" : "paused";
                                        rows.push(this.createProductTargetingRow(campaignName, adGroupName, bid, rowStatus, targetingType));
                                    });
                                    break;
                            }
                        });
                    });
                });
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
            
            this.showStatus(`模板生成成功，共 ${rows.length - 1} 行数据（包含 ${selectedPlacements.length} 个竞价位置配置）`, 'success');
        } catch (error) {
            this.showStatus(`生成失败: ${error.message}`, 'error');
        }
    },
    
    // 辅助方法：创建产品定位行（确保字段数量正确）
    createProductTargetingRow(campaignName, adGroupName, bid, status, targetingType) {
        return [
            "Sponsored Products", "Product Targeting", "Create", campaignName, adGroupName, "", "", "", "", 
            "", "", "", "", "", status, "", 
            "", "", bid, "", "", "", "", "", "", "", targetingType
        ];
    }
};

// 暴露到全局，供主页面调用
window.strategy8 = strategy8;
