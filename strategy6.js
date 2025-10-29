// 策略6模块 - SBV批量创建
export const strategy6 = {
    // 存储关键词数据（包含完整信息）
    keywordsData: [],
    // 标记是否正在处理文件上传，防止重复上传
    isProcessingUpload: false,
    
    // 初始化方法：创建UI并绑定事件
    init(container) {
        // 渲染策略6的UI
        container.innerHTML = this.getHtml();
        
        // 绑定DOM元素和事件
        this.bindElements();
        this.bindEvents();
        
        // 显示初始化状态
        this.showStatus('策略6已加载，可开始配置', 'success');
    },
    
    // 生成策略6的HTML结构
    getHtml() {
        return `
            <header class="mb-6">
                <h2 class="text-xl font-bold text-gray-800">SBV广告批量创建</h2>
            </header>

            <form id="adForm" class="space-y-4">
                <!-- 输入字段组 - 仅作为表格中没有对应列时的备用选项 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">匹配类型（表格中存在时将被忽略）</label>
                        <select name="匹配类型" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="broad">broad</option>
                            <option value="phrase">phrase</option>
                            <option value="exact">exact</option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">投放位置（表格中存在时将被忽略）</label>
                        <select name="投放位置"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">请选择</option>
                            <option value="Home">Home</option>
                            <option value="Detail Page">Detail Page</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <!-- 按钮组 -->
                <div class="flex flex-col sm:flex-row gap-4 pt-4">
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-2">导入数据（必须包含：关键词,ASIN,BID,广告活动名称,广告组名称,预算,匹配类型,Video Asset IDs,广告名称,品牌id，可选：百分比,投放位置,广告组合名称）</label>
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
        // 重置文件输入值的辅助函数，解决重复上传问题
        const resetFileInput = () => {
            this.keywordFileInput.value = '';
            this.isProcessingUpload = false;
        };
        
        // 文件上传相关事件
        this.dropArea.addEventListener('click', () => {
            // 防止重复点击导致多次弹窗
            if (!this.isProcessingUpload) {
                this.isProcessingUpload = true;
                this.keywordFileInput.click();
                // 超时自动重置，防止意外状态锁定
                setTimeout(resetFileInput, 5000);
            }
        });
        
        this.keywordFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                this.handleKeywordFile(e.target.files[0]);
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
                this.handleKeywordFile(file);
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
    
    // 处理关键词文件
    handleKeywordFile(file) {
        // 清除现有数据，支持上传新文件而无需刷新页面
        this.keywordsData = [];
        
        if (!file.name.endsWith('.xlsx')) {
            this.showStatus('请上传.xlsx格式的Excel文件', 'error');
            this.keywordStatus.textContent = '未选择文件';
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
                
                // 验证必要字段（新增品牌id）
                const requiredFields = [
                    '关键词', 'ASIN', 'BID', '广告活动名称', 
                    '广告组名称', '预算', '匹配类型', 'Video Asset IDs', '广告名称', '品牌id'
                ];
                if (jsonData.length === 0) {
                    throw new Error('Excel文件中没有数据');
                }
                
                const firstRow = jsonData[0];
                requiredFields.forEach(field => {
                    if (!(field in firstRow)) {
                        throw new Error(`Excel文件缺少必要列: ${field}`);
                    }
                });
                
                // 检查可选列
                const hasPercentage = '百分比' in firstRow;
                const hasPlacement = '投放位置' in firstRow;
                const hasPortfolio = '广告组合名称' in firstRow;
                
                if (hasPercentage) {
                    this.showStatus(`检测到表格中包含百分比列`, 'info');
                }
                if (hasPlacement) {
                    this.showStatus(`检测到表格中包含投放位置列`, 'info');
                }
                if (hasPortfolio) {
                    this.showStatus(`检测到表格中包含广告组合名称列`, 'info');
                }
                
                // 存储完整数据（包含带+号的关键词和品牌id）
                this.keywordsData = jsonData.filter(row => 
                    row.关键词 && row.ASIN && row.BID && row.广告活动名称 && 
                    row.广告组名称 && row.预算 && row.匹配类型 && row['Video Asset IDs'] && 
                    row['广告名称'] && row['品牌id']
                ).map(row => ({
                    ...row,
                    百分比: hasPercentage ? (row.百分比 || row.百分比 === 0 ? row.百分比.toString().trim() : "") : "",
                    hasPlacement: hasPlacement,
                    投放位置: hasPlacement ? (row.投放位置 ? row.投放位置.trim() : "") : "",
                    videoAssetId: row['Video Asset IDs'] ? row['Video Asset IDs'].toString().trim() : "",
                    adName: row['广告名称'] ? row['广告名称'].trim() : "",
                    portfolioName: hasPortfolio ? (row['广告组合名称'] ? row['广告组合名称'].trim() : "") : "",
                    brandEntityId: row['品牌id'] ? row['品牌id'].toString().trim() : "" // 存储品牌id
                }));
                
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
            // 验证数据
            if (this.keywordsData.length === 0) throw new Error("请先导入包含完整数据的Excel文件");
            
            const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            
            // 构建CSV - 使用新的表格格式
            const header = [
                "Product", "Entity", "Operation", "Campaign ID", "Portfolio ID", "Ad Group ID", 
                "Ad ID", "Keyword ID", "Product Targeting ID", "Campaign Name", "Ad Group Name", 
                "Ad Name", "Start Date", "End Date", "State", "Brand Entity ID", "Budget Type", 
                "Budget", "Bid Optimization", "Product Location", "Bid", "Placement", "Percentage", 
                "Keyword Text", "Match Type", "Native Language Keyword", "Native Language Locale", 
                "Product Targeting Expression", "Landing Page URL", "Landing Page ASINs", 
                "Landing Page Type", "Brand Name", "Consent To Translate", "Brand Logo Asset ID", 
                "Brand Logo Crop", "Custom Images", "Creative Headline", "Creative ASINs", 
                "Video Asset IDs", "Subpages"
            ];
            const rows = [header];
            
            // 数据结构设计：保留带+号的关键词作为不同关键词
            const campaignStructure = {};
            
            // 第一步：构建完整的广告活动结构
            this.keywordsData.forEach(item => {
                const campaignName = item["广告活动名称"].trim();
                const adGroupName = item["广告组名称"].trim();
                const asin = item["ASIN"].trim();
                const bid = item["BID"].toString().trim();
                const keywordText = item["关键词"].trim(); // 保留原始关键词（包含+号）
                const budget = item["预算"].toString().trim();
                const videoAssetId = item.videoAssetId;
                const adName = item.adName;
                const portfolioName = item.portfolioName;
                const brandEntityId = item.brandEntityId; // 获取品牌id
                
                // 从表格获取所有配置
                const percentage = item["百分比"] || "";
                const matchType = item["匹配类型"].trim();
                const placement = item["投放位置"] || "";
                
                // 生成广告活动ID
                const campaignId = `SBV-${campaignName.replace(/\s+/g, '_')}`;
                const adGroupId = `${campaignId}-${adGroupName.replace(/\s+/g, '_')}`;
                const adId = `${adGroupId}`;
                // 使用原始关键词（含+号）生成去重键，确保"+baby pillow"和"baby pillow"视为不同关键词
                const keywordKey = `${adGroupId}_${keywordText}_${matchType}`;
                
                // 初始化广告活动（包含品牌id）
                if (!campaignStructure[campaignId]) {
                    campaignStructure[campaignId] = {
                        id: campaignId,
                        name: campaignName,
                        budget: budget,
                        portfolioName: portfolioName,
                        brandEntityId: brandEntityId, // 存储品牌id
                        placementCombinations: new Set(),
                        adGroups: {}
                    };
                }
                
                const campaign = campaignStructure[campaignId];
                
                // 添加位置竞价组合
                if (percentage || placement) {
                    const combinationKey = `${percentage}|${placement}`;
                    campaign.placementCombinations.add(combinationKey);
                }
                
                // 初始化广告组
                if (!campaign.adGroups[adGroupId]) {
                    campaign.adGroups[adGroupId] = {
                        id: adGroupId,
                        name: adGroupName,
                        adId: adId,
                        productAds: new Map(), 
                        keywords: new Map()
                    };
                }
                
                const adGroup = campaign.adGroups[adGroupId];
                
                // 添加产品广告
                if (!adGroup.productAds.has(asin)) {
                    adGroup.productAds.set(asin, {
                        videoAssetId: videoAssetId,
                        adName: adName
                    });
                }
                
                // 添加关键词（使用原始带+号的关键词进行去重）
                if (!adGroup.keywords.has(keywordKey)) {
                    adGroup.keywords.set(keywordKey, {
                        text: keywordText, 
                        bid: bid,
                        matchType: matchType
                    });
                }
            });
            
            // 第二步：生成CSV行
            Object.values(campaignStructure).forEach(campaign => {
                // 1. 广告活动行 - 填充Brand Entity ID字段
                rows.push([
                    "Sponsored Brands", "Campaign", "Create", campaign.id, 
                    campaign.portfolioName, "", "", "", "", campaign.name, "", "", today, "", "enabled", 
                    campaign.brandEntityId, 
                    "Daily", campaign.budget, "FALSE", "", "", "", "", "", "", "", "", "", "", 
                    "", "", "", "", "", "", "", "", "", "", ""
                ]);
                
                // 2. 位置竞价调整行
                if (campaign.placementCombinations.size > 0) {
                    campaign.placementCombinations.forEach(combinationKey => {
                        const [percentage, placement] = combinationKey.split('|');
                        rows.push([
                            "Sponsored Brands", "Bidding adjustment by placement", "Create", 
                            campaign.id, "", "", "", "", "", "", "", "", "", "", "enabled", "",
                            "", "", "", "", "", placement, percentage, "", "", "", "", "", "", "", 
                            "", "", "", "", "", "", "", "", ""
                        ]);
                    });
                }
                
                // 3. 处理广告组
                Object.values(campaign.adGroups).forEach(adGroup => {
                    // 3.1 广告组行
                    rows.push([
                        "Sponsored Brands", "Ad group", "Create", campaign.id, "", adGroup.id, 
                        adGroup.adId, "", "", "", adGroup.name, "", "", "", "enabled", "",
                        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
                    ]);
                    
                    // 3.2 视频广告行
                    Array.from(adGroup.productAds.entries()).forEach(([ASIN, adInfo]) => {
                        rows.push([
                            "Sponsored Brands", "Video Ad", "Create", campaign.id, "", adGroup.id, 
                            adGroup.adId, "", "", "", "", adInfo.adName, 
                            "", "", "enabled", "",
                            "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", 
                            ASIN, adInfo.videoAssetId, ""
                        ]);
                    });
                    
                    // 3.3 关键词行 - 保留带+号的关键词
                    Array.from(adGroup.keywords.values()).forEach(keyword => {
                        rows.push([
                            "Sponsored Brands", "Keyword", "Create", campaign.id, "", adGroup.id, 
                            adGroup.adId, "", "", "", "", "", "", "", "enabled", "",
                            "", "", "", "", keyword.bid, "", "", keyword.text, keyword.matchType, "", "", "", 
                            "", "", "", "", "", "", "", "", "", ""
                        ]);
                    });
                });
            });
            
            // 生成并下载CSV，确保特殊字符正确处理
            const csvContent = rows.map(row => 
                row.map(cell => {
                    // 处理包含逗号、引号或+号的单元格，统一用双引号包裹
                    if (cell.includes(',') || cell.includes('"') || cell.includes('+')) {
                        // 替换双引号为两个双引号（CSV转义规则）
                        return `"${cell.replace(/"/g, '""')}"`;
                    }
                    return cell;
                }).join(',')
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
window.strategy6 = strategy6;
