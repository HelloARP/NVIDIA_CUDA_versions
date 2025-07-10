// == 在NVIDIA驱动页面控制台执行此代码 ==
// 访问NVIDIA驱动页面（如https://www.nvidia.cn/drivers/lookup/），获取到psid和pfid
// 配置参数（可根据需要修改）
const config = {
    psid: 104,          // 产品系列ID (MX10笔记本) psid 129(RTX 40笔记本)psid 133(RTX 50笔记本)
    pfid: 853,          // 产品家族ID (MX 150)pfid 1007(RTX 40系列笔记本) pfid 1079(GTX5060系列)
    osID: 57,           // 操作系统ID (Windows 10 64位) osID 135 (Windows 11)
    languageCode: 2052, // 语言代码 (简体中文)
    numberOfResults: 60 // 获取的驱动数量
};

// CUDA版本与驱动版本映射表（按主版本+次版本分组）
const cudaDriverMap = [
    { version: "12.9.1", display: "12.9 Update 1", minDriver: "575.57.08", releaseDate: "2024-10", url: "https://developer.nvidia.com/cuda-12-9-1-download-archive" },
    { version: "12.9.0", display: "12.9 GA", minDriver: "575.51.03", releaseDate: "2024-09", url: "https://developer.nvidia.com/cuda-12-9-0-download-archive" },
    { version: "12.8.1", display: "12.8 Update 1", minDriver: "570.124.06", releaseDate: "2024-03", url: "https://developer.nvidia.com/cuda-12-8-1-download-archive" },
    { version: "12.8.0", display: "12.8 GA", minDriver: "570.26", releaseDate: "2024-01", url: "https://developer.nvidia.com/cuda-12-8-0-download-archive" },
    { version: "12.6.3", display: "12.6 Update 3", minDriver: "560.35.05", releaseDate: "2023-11", url: "https://developer.nvidia.com/cuda-12-6-3-download-archive" },
    { version: "12.6.2", display: "12.6 Update 2", minDriver: "560.35.03", releaseDate: "2023-10", url: "https://developer.nvidia.com/cuda-12-6-2-download-archive" },
    { version: "12.6.1", display: "12.6 Update 1", minDriver: "560.35.03", releaseDate: "2023-09", url: "https://developer.nvidia.com/cuda-12-6-1-download-archive" },
    { version: "12.6.0", display: "12.6 GA", minDriver: "560.28.03", releaseDate: "2023-08", url: "https://developer.nvidia.com/cuda-12-6-0-download-archive" },
    { version: "12.5.1", display: "12.5 Update 1", minDriver: "555.42.06", releaseDate: "2023-07", url: "https://developer.nvidia.com/cuda-12-5-1-download-archive" },
    { version: "12.5.0", display: "12.5 GA", minDriver: "555.42.02", releaseDate: "2023-06", url: "https://developer.nvidia.com/cuda-12-5-0-download-archive" },
    { version: "12.4.1", display: "12.4 Update 1", minDriver: "550.54.15", releaseDate: "2023-05", url: "https://developer.nvidia.com/cuda-12-4-1-download-archive" },
    { version: "12.4.0", display: "12.4 GA", minDriver: "550.54.14", releaseDate: "2023-04", url: "https://developer.nvidia.com/cuda-12-4-0-download-archive" },
    { version: "12.3.1", display: "12.3 Update 1", minDriver: "545.23.08", releaseDate: "2023-03", url: "https://developer.nvidia.com/cuda-12-3-1-download-archive" },
    { version: "12.3.0", display: "12.3 GA", minDriver: "545.23.06", releaseDate: "2023-02", url: "https://developer.nvidia.com/cuda-12-3-0-download-archive" },
    { version: "12.2.2", display: "12.2 Update 2", minDriver: "535.104.05", releaseDate: "2023-01", url: "https://developer.nvidia.com/cuda-12-2-2-download-archive" },
    { version: "12.2.1", display: "12.2 Update 1", minDriver: "535.86.09", releaseDate: "2022-12", url: "https://developer.nvidia.com/cuda-12-2-1-download-archive" },
    { version: "12.2.0", display: "12.2 GA", minDriver: "535.54.03", releaseDate: "2022-11", url: "https://developer.nvidia.com/cuda-12-2-0-download-archive" },
    { version: "12.1.1", display: "12.1 Update 1", minDriver: "530.30.02", releaseDate: "2022-10", url: "https://developer.nvidia.com/cuda-12-1-1-download-archive" },
    { version: "12.1.0", display: "12.1 GA", minDriver: "530.30.02", releaseDate: "2022-09", url: "https://developer.nvidia.com/cuda-12-1-0-download-archive" },
    { version: "12.0.1", display: "12.0 Update 1", minDriver: "525.85.12", releaseDate: "2022-08", url: "https://developer.nvidia.com/cuda-12-0-1-download-archive" },
    { version: "12.0.0", display: "12.0 GA", minDriver: "525.60.13", releaseDate: "2022-07", url: "https://developer.nvidia.com/cuda-12-0-0-download-archive" },
    { version: "11.8.0", display: "11.8 GA", minDriver: "520.61.05", releaseDate: "2022-06", url: "https://developer.nvidia.com/cuda-11-8-0-download-archive" },
    { version: "11.7.1", display: "11.7 Update 1", minDriver: "515.48.07", releaseDate: "2022-05", url: "https://developer.nvidia.com/cuda-11-7-1-download-archive" },
    { version: "11.7.0", display: "11.7 GA", minDriver: "515.43.04", releaseDate: "2022-04", url: "https://developer.nvidia.com/cuda-11-7-0-download-archive" },
    { version: "11.6.2", display: "11.6 Update 2", minDriver: "510.47.03", releaseDate: "2022-03", url: "https://developer.nvidia.com/cuda-11-6-2-download-archive" },
    { version: "11.6.1", display: "11.6 Update 1", minDriver: "510.47.03", releaseDate: "2022-02", url: "https://developer.nvidia.com/cuda-11-6-1-download-archive" },
    { version: "11.6.0", display: "11.6 GA", minDriver: "510.39.01", releaseDate: "2022-01", url: "https://developer.nvidia.com/cuda-11-6-0-download-archive" },
    { version: "11.5.2", display: "11.5 Update 2", minDriver: "495.29.05", releaseDate: "2021-12", url: "https://developer.nvidia.com/cuda-11-5-2-download-archive" },
    { version: "11.5.1", display: "11.5 Update 1", minDriver: "495.29.05", releaseDate: "2021-11", url: "https://developer.nvidia.com/cuda-11-5-1-download-archive" },
    { version: "11.5.0", display: "11.5 GA", minDriver: "495.29.05", releaseDate: "2021-10", url: "https://developer.nvidia.com/cuda-11-5-0-download-archive" },
    { version: "11.4.4", display: "11.4 Update 4", minDriver: "470.82.01", releaseDate: "2021-09", url: "https://developer.nvidia.com/cuda-11-4-4-download-archive" },
    { version: "11.4.3", display: "11.4 Update 3", minDriver: "470.82.01", releaseDate: "2021-08", url: "https://developer.nvidia.com/cuda-11-4-3-download-archive" },
    { version: "11.4.2", display: "11.4 Update 2", minDriver: "470.57.02", releaseDate: "2021-07", url: "https://developer.nvidia.com/cuda-11-4-2-download-archive" },
    { version: "11.4.1", display: "11.4 Update 1", minDriver: "470.57.02", releaseDate: "2021-06", url: "https://developer.nvidia.com/cuda-11-4-1-download-archive" },
    { version: "11.4.0", display: "11.4 GA", minDriver: "470.42.01", releaseDate: "2021-05", url: "https://developer.nvidia.com/cuda-11-4-0-download-archive" },
    { version: "11.3.1", display: "11.3.1", minDriver: "465.19.01", releaseDate: "2021-04", url: "https://developer.nvidia.com/cuda-11-3-1-download-archive" },
    { version: "11.3.0", display: "11.3.0", minDriver: "465.19.01", releaseDate: "2021-03", url: "https://developer.nvidia.com/cuda-11-3-0-download-archive" },
    { version: "11.2.2", display: "11.2.2", minDriver: "460.32.03", releaseDate: "2021-02", url: "https://developer.nvidia.com/cuda-11-2-2-download-archive" },
    { version: "11.2.1", display: "11.2.1", minDriver: "460.32.03", releaseDate: "2021-01", url: "https://developer.nvidia.com/cuda-11-2-1-download-archive" },
    { version: "11.2.0", display: "11.2.0", minDriver: "460.27.03", releaseDate: "2020-12", url: "https://developer.nvidia.com/cuda-11-2-0-download-archive" },
    { version: "11.1.1", display: "11.1.1", minDriver: "455.32", releaseDate: "2020-11", url: "https://developer.nvidia.com/cuda-11-1-1-download-archive" },
    { version: "11.1.0", display: "11.1 GA", minDriver: "455.23", releaseDate: "2020-10", url: "https://developer.nvidia.com/cuda-11-1-0-download-archive" },
    { version: "11.0.3", display: "11.0.3", minDriver: "450.51.06", releaseDate: "2020-09", url: "https://developer.nvidia.com/cuda-11-0-3-download-archive" },
    { version: "11.0.2", display: "11.0.2", minDriver: "450.51.05", releaseDate: "2020-08", url: "https://developer.nvidia.com/cuda-11-0-2-download-archive" },
    { version: "11.0.1", display: "11.0.1", minDriver: "450.36.06", releaseDate: "2020-07", url: "https://developer.nvidia.com/cuda-11-0-1-download-archive" },
    { version: "10.2.89", display: "10.2.89", minDriver: "440.33", releaseDate: "2020-06", url: "https://developer.nvidia.com/cuda-10-2-download-archive" },
    { version: "10.1.0", display: "10.1", minDriver: "418.39", releaseDate: "2019-05", url: "https://developer.nvidia.com/cuda-10-1-download-archive" },
    { version: "10.0.130", display: "10.0.130", minDriver: "410.48", releaseDate: "2018-09", url: "https://developer.nvidia.com/cuda-10-0-download-archive" },
    { version: "9.2.148", display: "9.2", minDriver: "396.37", releaseDate: "2018-06", url: "https://developer.nvidia.com/cuda-9-2-download-archive" },
    { version: "9.1.85", display: "9.1", minDriver: "390.46", releaseDate: "2017-12", url: "https://developer.nvidia.com/cuda-9-1-download-archive" },
    { version: "9.0.76", display: "9.0", minDriver: "384.81", releaseDate: "2017-09", url: "https://developer.nvidia.com/cuda-9-0-download-archive" },
    { version: "8.0.61", display: "8.0", minDriver: "375.26", releaseDate: "2016-09", url: "https://developer.nvidia.com/cuda-8-0-download-archive" },
    { version: "7.5.16", display: "7.5", minDriver: "352.31", releaseDate: "2015-11", url: "https://developer.nvidia.com/cuda-7-5-download-archive" },
    { version: "7.0.28", display: "7.0", minDriver: "346.46", releaseDate: "2014-07", url: "https://developer.nvidia.com/cuda-7-0-download-archive" }
].map(item => ({
    ...item,
    fullName: `CUDA ${item.display}`,
    // 提取主版本和次版本 (如 "12.5")
    minorVersion: item.version.split('.').slice(0, 2).join('.')
}));

// 获取每个次版本的最新驱动要求
const cudaMinorMap = {};
cudaDriverMap.forEach(item => {
    const minor = item.minorVersion;
    // 只保留每个次版本的最新要求
    if (!cudaMinorMap[minor] || 
        compareDriverVersions(item.minDriver, cudaMinorMap[minor].minDriver) > 0) {
        cudaMinorMap[minor] = {
            minDriver: item.minDriver,
            display: item.display,
            url: item.url,
            releaseDate: item.releaseDate
        };
    }
});

// 比较驱动版本
function compareDriverVersions(driverVersion, minVersion) {
    if (!driverVersion || !minVersion) return -1;
    
    const v1 = driverVersion.split('.').map(Number);
    const v2 = minVersion.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
        const num1 = v1[i] || 0;
        const num2 = v2[i] || 0;
        if (num1 > num2) return 1;
        if (num1 < num2) return -1;
    }
    return 0;
}

// 获取支持的CUDA版本（返回所有兼容版本）
function getSupportedCuda(driverVersion) {
    const supported = [];
    for (const item of cudaDriverMap) {
        if (compareDriverVersions(driverVersion, item.minDriver) >= 0) {
            supported.push(item.fullName);
        }
    }
    return supported;
}

// 获取最高支持的CUDA版本及其URL
function getHighestSupportedCuda(driverVersion) {
    for (const item of cudaDriverMap) {
        if (compareDriverVersions(driverVersion, item.minDriver) >= 0) {
            return {
                display: `CUDA ${item.display}`,
                url: item.url,
                minorVersion: item.minorVersion
            };
        }
    }
    return {
        display: "未知",
        url: "https://developer.nvidia.com/cuda-toolkit-archive",
        minorVersion: "0.0"
    };
}

// 获取CUDA次版本号
function getCudaMinorVersion(cudaName) {
    const match = cudaName.match(/(\d+\.\d+)/);
    return match ? match[1] : "0.0";
}

(async function getNvidiaDrivers() {
    // 构建API URL
    const apiUrl = `https://gfwsl.geforce.cn/services_toolkit/services/com/nvidia/services/AjaxDriverService.php?func=DriverManualLookup&psid=${config.psid}&pfid=${config.pfid}&osID=${config.osID}&languageCode=${config.languageCode}&isWHQL=0&beta=null&dltype=-1&dch=1&upCRD=null&qnf=0&ctk=null&sort1=1&numberOfResults=${config.numberOfResults}`;
    
    try {
        // 发送API请求
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API请求失败! 状态码: ${response.status}`);
        
        // 解析JSON响应
        const data = await response.json();
        
        // 检查是否有有效数据
        if (!data.IDS || data.IDS.length === 0) {
            throw new Error('未找到驱动数据，请检查参数配置');
        }
        
        // 提取驱动信息并添加CUDA支持信息
        const drivers = data.IDS.map(driver => {
            const di = driver.downloadInfo || {};
            const driverName = di.Name ? decodeURIComponent(di.Name) : '未知驱动';
            const driverVersion = di.Version || '未知版本';
            const highestCuda = getHighestSupportedCuda(driverVersion);
            
            return {
                version: driverVersion,
                releaseDate: di.ReleaseDateTime || '未知日期',
                name: driverName,
                downloadURL: di.DownloadURL || '#',
                fileSize: di.DownloadURLFileSize || '未知大小',
                osName: di.OSList 
                    ? di.OSList.map(os => decodeURIComponent(os.OSName).replace('64-bit', '')).join(', ') 
                    : (di.OSName ? decodeURIComponent(di.OSName) : '未知系统'),
                detailsURL: di.DetailsURL || '#',
                driverType: driverName.includes('Studio') ? 'Studio' : 'Game Ready',
                cudaSupport: highestCuda.display,
                cudaUrl: highestCuda.url,
                cudaMinorVersion: highestCuda.minorVersion,
                fullCudaSupport: getSupportedCuda(driverVersion).join(', ')
            };
        });
        
        // 创建结果展示区域
        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'nvidia-drivers-results';
        resultsDiv.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-height: 80vh;
            overflow-y: auto;
            background: white;
            padding: 20px;
            border: 1px solid #ddd;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            z-index: 9999;
            width: 1000px;
            font-family: Arial, sans-serif;
        `;        
                
        // 添加标题
        const titleDiv = document.createElement('div');
        titleDiv.style = 'font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #333;';
        titleDiv.textContent = 'NVIDIA 驱动程序列表 (含CUDA支持)';
        resultsDiv.appendChild(titleDiv);
        
        // 添加驱动类型选择器
        const driverTypeDiv = document.createElement('div');
        driverTypeDiv.style = 'display: flex; gap: 15px; margin-bottom: 15px; align-items: center;';
        
        const driverTypeLabel = document.createElement('span');
        driverTypeLabel.textContent = '驱动类型：';
        driverTypeLabel.style = 'font-weight: bold;';
        
        const gameReadyBtn = document.createElement('button');
        gameReadyBtn.textContent = 'Game Ready';
        gameReadyBtn.dataset.type = 'Game Ready';
        gameReadyBtn.style = `
            padding: 8px 16px;
            background: #76b900;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        `;
        
        const studioBtn = document.createElement('button');
        studioBtn.textContent = 'Studio';
        studioBtn.dataset.type = 'Studio';
        studioBtn.style = `
            padding: 8px 16px;
            background: #0078d7;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        
        driverTypeDiv.appendChild(driverTypeLabel);
        driverTypeDiv.appendChild(gameReadyBtn);
        driverTypeDiv.appendChild(studioBtn);
        resultsDiv.appendChild(driverTypeDiv);
        
        // 添加搜索框
        const searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.placeholder = '搜索驱动版本或CUDA版本（如12.5）...';
        searchBox.style = `
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        `;
        resultsDiv.appendChild(searchBox);
        
        // 添加搜索提示
        const searchTips = document.createElement('div');
        searchTips.style = 'color: #666; font-size: 12px; margin-top: -8px; margin-bottom: 15px;';
        searchTips.innerHTML = '提示：输入"12.5"可搜索支持CUDA 12.5及更高版本的驱动<br>双击CUDA版本可直接打开下载页面';
        resultsDiv.appendChild(searchTips);
        
        // 添加CUDA筛选器
        const cudaFilterDiv = document.createElement('div');
        cudaFilterDiv.style = 'display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;';
        
        const cudaFilterLabel = document.createElement('span');
        cudaFilterLabel.textContent = 'CUDA支持：';
        cudaFilterLabel.style = 'font-weight: bold; align-self: center;';
        cudaFilterDiv.appendChild(cudaFilterLabel);
        
        // 添加CUDA版本按钮（按次版本分组）
        const minorVersions = Object.keys(cudaMinorMap)
            .sort((a, b) => compareVersions(b, a)) // 从高到低排序
            .slice(0, 8); // 取最新的8个版本
        
        minorVersions.forEach(minor => {
            const btn = document.createElement('button');
            btn.textContent = `CUDA ${minor}`;
            btn.title = `支持 CUDA ${minor} 及以上版本 | 双击打开下载页面`;
            btn.dataset.minDriver = cudaMinorMap[minor].minDriver;
            btn.dataset.url = cudaMinorMap[minor].url;
            btn.style = `
                padding: 6px 12px;
                background: #f0f0f0;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                white-space: nowrap;
            `;
            
            // 添加双击事件
            btn.addEventListener('dblclick', () => {
                window.open(btn.dataset.url, '_blank');
            });
            
            cudaFilterDiv.appendChild(btn);
        });
        
        // 添加"所有"按钮
        const allCudaBtn = document.createElement('button');
        allCudaBtn.textContent = '所有版本';
        allCudaBtn.dataset.minDriver = 'all';
        allCudaBtn.style = `
            padding: 6px 12px;
            background: #333;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        cudaFilterDiv.appendChild(allCudaBtn);
        
        resultsDiv.appendChild(cudaFilterDiv);
        
        // 添加驱动列表（使用表格布局）
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';
        table.id = 'drivers-table';
        
        // 表头
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr style="border-bottom: 2px solid #eee; background-color: #f8f8f8;">
                <th style="padding: 10px; text-align: left; width: 8%;">类型</th>
                <th style="padding: 10px; text-align: left; width: 10%;">驱动版本</th>
                <th style="padding: 10px; text-align: left; width: 10%;">发布日期</th>
                <th style="padding: 10px; text-align: left; width: 8%;">大小</th>
                <th style="padding: 10px; text-align: left; width: 15%;">操作系统</th>
                <th style="padding: 10px; text-align: left; width: 24%;">最高CUDA支持</th>
                <th style="padding: 10px; text-align: left; width: 25%;">操作</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // 表格内容
        const tbody = document.createElement('tbody');
        tbody.id = 'drivers-body';
        
        // 添加驱动条目
        drivers.forEach(driver => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #f5f5f5';
            row.dataset.version = driver.version.toLowerCase();
            row.dataset.driverType = driver.driverType;
            row.dataset.cudaMinor = driver.cudaMinorVersion;
            row.dataset.minDriver = Object.values(cudaMinorMap)[0]?.minDriver || ''; // 存储最高CUDA要求
            
            // 根据驱动类型设置行背景色
            if (driver.driverType === 'Studio') {
                row.style.backgroundColor = '#f0f8ff'; // 浅蓝色背景
            }
            
            // 根据CUDA支持范围设置颜色
            let cudaColor = '#d2691e'; // 默认巧克力色
            const minorParts = driver.cudaMinorVersion.split('.');
            if (minorParts.length > 0) {
                const major = parseInt(minorParts[0]);
                if (major >= 12) cudaColor = '#0066cc'; // 蓝色表示新版本
                else if (major >= 11) cudaColor = '#009933'; // 绿色表示较新版本
            }
            
            row.innerHTML = `
                <td style="padding: 10px; vertical-align: top;">
                    <span style="display: inline-block; padding: 3px 8px; background: ${driver.driverType === 'Studio' ? '#0078d7' : '#76b900'}; color: white; border-radius: 4px; font-size: 12px;">
                        ${driver.driverType}
                    </span>
                </td>
                <td style="padding: 10px; vertical-align: top;"><strong>${driver.version}</strong></td>
                <td style="padding: 10px; vertical-align: top;">${driver.releaseDate}</td>
                <td style="padding: 10px; vertical-align: top;">${driver.fileSize}</td>
                <td style="padding: 10px; vertical-align: top;">${driver.osName}</td>
                <td style="padding: 10px; vertical-align: top;">
                    <div class="cuda-cell" style="color: ${cudaColor}; font-weight: bold; cursor: help; padding: 4px; border-radius: 4px;" 
                         title="支持所有CUDA版本: ${driver.fullCudaSupport}\n双击打开下载页面">
                        ${driver.cudaSupport}
                    </div>
                </td>
                <td style="padding: 10px; vertical-align: top;">
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <a href="${driver.downloadURL}" 
                           target="_blank" 
                           style="display: inline-block; padding: 6px 12px; background: #76b900; color: white; text-decoration: none; border-radius: 4px;"
                           title="${driver.name}">下载</a>
                        <a href="${driver.detailsURL}"
                           target="_blank"
                           style="display: inline-block; padding: 6px 12px; background: #0078d7; color: white; text-decoration: none; border-radius: 4px;"
                           title="查看详情">详情</a>
                        <span style="color: #666; font-size: 13px; align-self: center; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${driver.name}">${driver.name}</span>
                    </div>
                </td>
            `;
            
            // 添加双击事件
            const cudaCell = row.querySelector('.cuda-cell');
            if (driver.cudaUrl) {
                cudaCell.addEventListener('dblclick', () => {
                    window.open(driver.cudaUrl, '_blank');
                });
                // 添加悬停效果
                cudaCell.addEventListener('mouseenter', () => {
                    cudaCell.style.backgroundColor = '#f5f5f5';
                });
                cudaCell.addEventListener('mouseleave', () => {
                    cudaCell.style.backgroundColor = '';
                });
            }
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        resultsDiv.appendChild(table);
        
        // 当前选择的驱动类型和CUDA筛选
        let currentDriverType = 'Game Ready';
        let currentMinDriver = 'all';
        
        // 更新驱动类型按钮状态
        function updateDriverTypeButtons() {
            gameReadyBtn.style.fontWeight = currentDriverType === 'Game Ready' ? 'bold' : 'normal';
            studioBtn.style.fontWeight = currentDriverType === 'Studio' ? 'bold' : 'normal';
            
            gameReadyBtn.style.opacity = currentDriverType === 'Game Ready' ? '1' : '0.7';
            studioBtn.style.opacity = currentDriverType === 'Studio' ? '1' : '0.7';
        }
        
        // 比较版本号（用于排序）
        function compareVersions(a, b) {
            const aParts = a.split('.').map(Number);
            const bParts = b.split('.').map(Number);
            
            for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                const aVal = aParts[i] || 0;
                const bVal = bParts[i] || 0;
                if (aVal > bVal) return 1;
                if (aVal < bVal) return -1;
            }
            return 0;
        }
        
        // 过滤驱动列表
        function filterDrivers() {
            const searchTerm = searchBox.value.toLowerCase();
            const rows = tbody.querySelectorAll('tr');
            let visibleCount = 0;
            
            // 尝试解析CUDA版本搜索
            let cudaSearch = null;
            const cudaMatch = searchTerm.match(/(\d+\.\d+)/);
            if (cudaMatch) {
                cudaSearch = cudaMatch[1];
            }
            
            rows.forEach(row => {
                const version = row.dataset.version;
                const driverType = row.dataset.driverType;
                const minDriver = row.dataset.minDriver;
                const cudaMinor = row.dataset.cudaMinor;
                
                // 1. 匹配搜索条件
                const matchesSearch = searchTerm === '' || 
                                     version.includes(searchTerm) || 
                                     row.textContent.toLowerCase().includes(searchTerm);
                
                // 2. 匹配驱动类型
                const matchesType = currentDriverType === 'All' || driverType === currentDriverType;
                
                // 3. 匹配CUDA条件（驱动版本 >= 要求的最低驱动版本）
                let matchesCuda = true;
                if (currentMinDriver !== 'all') {
                    matchesCuda = compareDriverVersions(version, currentMinDriver) >= 0;
                }
                
                // 4. 匹配CUDA版本范围搜索
                let matchesCudaRange = true;
                if (cudaSearch) {
                    matchesCudaRange = compareVersions(cudaMinor, cudaSearch) >= 0;
                }
                
                if (matchesSearch && matchesType && matchesCuda && matchesCudaRange) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });
            
            // 更新计数
            countDiv.textContent = `显示 ${visibleCount}/${drivers.length} 个驱动版本 (${currentDriverType})`;
        }
        
        // 添加驱动类型选择事件
        gameReadyBtn.addEventListener('click', () => {
            currentDriverType = 'Game Ready';
            updateDriverTypeButtons();
            filterDrivers();
        });
        
        studioBtn.addEventListener('click', () => {
            currentDriverType = 'Studio';
            updateDriverTypeButtons();
            filterDrivers();
        });
        
        // 添加CUDA筛选事件
        cudaFilterDiv.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                currentMinDriver = btn.dataset.minDriver;
                
                // 更新按钮状态
                cudaFilterDiv.querySelectorAll('button').forEach(b => {
                    if (b === btn) {
                        b.style.background = currentMinDriver === 'all' ? '#333' : '#5e9cd3';
                        b.style.color = 'white';
                        b.style.border = 'none';
                    } else {
                        b.style.background = '#f0f0f0';
                        b.style.color = 'black';
                        b.style.border = '1px solid #ddd';
                    }
                });
                
                filterDrivers();
            });
        });
        
        // 添加搜索功能
        searchBox.addEventListener('input', filterDrivers);
        
        // 添加到页面
        document.body.appendChild(resultsDiv);
        
        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        closeBtn.title = '关闭';
        closeBtn.onclick = () => {
            document.body.removeChild(resultsDiv);
        };
        resultsDiv.appendChild(closeBtn);
        
        // 添加结果计数
        const countDiv = document.createElement('div');
        countDiv.id = 'results-count';
        countDiv.style = `
            margin-top: 10px;
            color: #666;
            font-size: 14px;
        `;
        resultsDiv.appendChild(countDiv);
        
        // 初始化UI状态
        updateDriverTypeButtons();
        filterDrivers();
        
    } catch (error) {
        console.error('获取驱动时出错:', error);
        
        // 创建错误提示
        const errorDiv = document.createElement('div');
        errorDiv.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ffdddd;
            padding: 20px;
            border: 1px solid #ff9999;
            z-index: 9999;
            width: 400px;
            font-family: Arial, sans-serif;
        `;
        errorDiv.innerHTML = `
            <h3 style="color: #d32f2f; margin-top: 0;">错误</h3>
            <p>${error.message}</p>
            <p>请检查控制台获取更多信息</p>
            <button style="margin-top: 10px; padding: 8px 16px; background: #d32f2f; color: white; border: none; cursor: pointer;">
                关闭
            </button>
        `;
        
        errorDiv.querySelector('button').onclick = () => {
            document.body.removeChild(errorDiv);
        };
        
        document.body.appendChild(errorDiv);
    }
})();
