// 班级积分管理系统

// 版本号
const CURRENT_VERSION = '1.0.2';

// 存储键名
const STORAGE_KEY = 'classScoreSystem';

// 初始化数据
function initData() {
    // 检查localStorage中是否已有数据
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (existingData) {
        return JSON.parse(existingData);
    }
    // 初始化默认数据
    const defaultData = {
        groups: {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
            '6': 0,
            '7': 0
        }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
}

// 保存数据到localStorage
function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 加载数据到页面
function loadDataToPage(data) {
    for (let i = 1; i <= 7; i++) {
        const groupScore = data.groups[i.toString()] || 0;
        const scoreElement = document.querySelector(`.score-group[data-group="${i}"] .score-value`);
        const inputElement = document.querySelector(`.score-group[data-group="${i}"] .score-input`);
        if (scoreElement) scoreElement.textContent = groupScore;
        if (inputElement) inputElement.value = groupScore;
    }
}

// 添加操作反馈
function addFeedback(element) {
    element.classList.add('updated');
    setTimeout(() => {
        element.classList.remove('updated');
    }, 500);
}

// 主函数
function init() {
    // 初始化数据
    let scoreData = initData();
    
    // 加载数据到页面
    loadDataToPage(scoreData);
    
    // 创建弹出层
    function createPopup(type, group) {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        
        // 创建弹出框
        const popup = document.createElement('div');
        popup.className = 'popup';
        
        // 创建标题
        const title = document.createElement('h3');
        title.textContent = type === 'add' ? '选择加分值' : '选择减分值';
        popup.appendChild(title);
        
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'popup-buttons';
        
        // 创建按钮
        const values = type === 'add' ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4];
        values.forEach(value => {
            const button = document.createElement('button');
            button.className = 'popup-button';
            button.textContent = type === 'add' ? `+${value}` : `-${value}`;
            button.addEventListener('click', function() {
                if (type === 'add') {
                    scoreData.groups[group] = (scoreData.groups[group] || 0) + value;
                } else {
                    scoreData.groups[group] = Math.max(0, (scoreData.groups[group] || 0) - value);
                }
                saveData(scoreData);
                
                // 更新页面显示
                const scoreElement = document.querySelector(`.score-group[data-group="${group}"] .score-value`);
                const inputElement = document.querySelector(`.score-group[data-group="${group}"] .score-input`);
                if (scoreElement) {
                    scoreElement.textContent = scoreData.groups[group];
                    addFeedback(scoreElement);
                }
                if (inputElement) inputElement.value = scoreData.groups[group];
                
                // 移除弹出层
                document.body.removeChild(overlay);
            });
            buttonContainer.appendChild(button);
        });
        
        // 创建取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.className = 'popup-cancel';
        cancelButton.textContent = '取消';
        cancelButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
        
        popup.appendChild(buttonContainer);
        popup.appendChild(cancelButton);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    }
    
    // 绑定加分按钮事件
    document.querySelectorAll('.score-add').forEach(button => {
        button.addEventListener('click', function() {
            const group = this.closest('.score-group').dataset.group;
            createPopup('add', group);
        });
    });
    
    // 绑定减分按钮事件
    document.querySelectorAll('.score-subtract').forEach(button => {
        button.addEventListener('click', function() {
            const group = this.closest('.score-group').dataset.group;
            createPopup('subtract', group);
        });
    });
    
    // 绑定单组重置按钮事件
    document.querySelectorAll('.score-reset').forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('确定要重置该小组的积分吗？')) {
                const group = this.closest('.score-group').dataset.group;
                scoreData.groups[group] = 0;
                saveData(scoreData);
                
                // 更新页面显示
                const scoreElement = this.closest('.score-group').querySelector('.score-value');
                const inputElement = this.closest('.score-group').querySelector('.score-input');
                if (scoreElement) {
                    scoreElement.textContent = '0';
                    addFeedback(scoreElement);
                }
                if (inputElement) inputElement.value = '0';
            }
        });
    });
    
    // 绑定全部重置按钮事件
    document.querySelector('.reset-all').addEventListener('click', function() {
        if (confirm('确定要重置所有小组的积分吗？')) {
            for (let i = 1; i <= 7; i++) {
                scoreData.groups[i.toString()] = 0;
            }
            saveData(scoreData);
            
            // 更新页面显示
            document.querySelectorAll('.score-value').forEach(element => {
                element.textContent = '0';
                addFeedback(element);
            });
            document.querySelectorAll('.score-input').forEach(element => {
                element.value = '0';
            });
        }
    });
    
    // 绑定全员增加按钮事件
    document.querySelector('.add-all').addEventListener('click', function() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        
        // 创建弹出框
        const popup = document.createElement('div');
        popup.className = 'popup';
        
        // 创建标题
        const title = document.createElement('h3');
        title.textContent = '选择加分值';
        popup.appendChild(title);
        
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'popup-buttons';
        
        // 创建按钮
        const values = [1, 2, 3, 4, 5, 6];
        values.forEach(value => {
            const button = document.createElement('button');
            button.className = 'popup-button';
            button.textContent = `+${value}`;
            button.addEventListener('click', function() {
                // 为所有小组增加分数
                for (let i = 1; i <= 7; i++) {
                    scoreData.groups[i.toString()] = (scoreData.groups[i.toString()] || 0) + value;
                }
                saveData(scoreData);
                
                // 更新页面显示
                for (let i = 1; i <= 7; i++) {
                    const scoreElement = document.querySelector(`.score-group[data-group="${i}"] .score-value`);
                    const inputElement = document.querySelector(`.score-group[data-group="${i}"] .score-input`);
                    if (scoreElement) {
                        scoreElement.textContent = scoreData.groups[i.toString()];
                        addFeedback(scoreElement);
                    }
                    if (inputElement) inputElement.value = scoreData.groups[i.toString()];
                }
                
                // 移除弹出层
                document.body.removeChild(overlay);
            });
            buttonContainer.appendChild(button);
        });
        
        // 创建取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.className = 'popup-cancel';
        cancelButton.textContent = '取消';
        cancelButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
        
        popup.appendChild(buttonContainer);
        popup.appendChild(cancelButton);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    });
    
    // 绑定全员减少按钮事件
    document.querySelector('.subtract-all').addEventListener('click', function() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        
        // 创建弹出框
        const popup = document.createElement('div');
        popup.className = 'popup';
        
        // 创建标题
        const title = document.createElement('h3');
        title.textContent = '选择减分值';
        popup.appendChild(title);
        
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'popup-buttons';
        
        // 创建按钮
        const values = [1, 2, 3, 4];
        values.forEach(value => {
            const button = document.createElement('button');
            button.className = 'popup-button';
            button.textContent = `-${value}`;
            button.addEventListener('click', function() {
                // 为所有小组减少分数
                for (let i = 1; i <= 7; i++) {
                    scoreData.groups[i.toString()] = Math.max(0, (scoreData.groups[i.toString()] || 0) - value);
                }
                saveData(scoreData);
                
                // 更新页面显示
                for (let i = 1; i <= 7; i++) {
                    const scoreElement = document.querySelector(`.score-group[data-group="${i}"] .score-value`);
                    const inputElement = document.querySelector(`.score-group[data-group="${i}"] .score-input`);
                    if (scoreElement) {
                        scoreElement.textContent = scoreData.groups[i.toString()];
                        addFeedback(scoreElement);
                    }
                    if (inputElement) inputElement.value = scoreData.groups[i.toString()];
                }
                
                // 移除弹出层
                document.body.removeChild(overlay);
            });
            buttonContainer.appendChild(button);
        });
        
        // 创建取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.className = 'popup-cancel';
        cancelButton.textContent = '取消';
        cancelButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
        
        popup.appendChild(buttonContainer);
        popup.appendChild(cancelButton);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    });
    
    // 绑定设置按钮事件
    document.querySelector('.settings').addEventListener('click', function() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        
        // 创建弹出框
        const popup = document.createElement('div');
        popup.className = 'popup';
        
        // 创建标题
        const title = document.createElement('h3');
        title.textContent = '设置';
        popup.appendChild(title);
        
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'popup-buttons';
        
        // 创建导出JSON按钮
        const exportButton = document.createElement('button');
        exportButton.className = 'popup-button';
        exportButton.textContent = '导出JSON';
        exportButton.addEventListener('click', function() {
            // 导出JSON文件
            const dataStr = JSON.stringify(scoreData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'class-score-data.json';
            link.click();
            URL.revokeObjectURL(url);
            
            // 移除弹出层
            document.body.removeChild(overlay);
        });
        buttonContainer.appendChild(exportButton);
        
        // 创建导入JSON按钮
        const importButton = document.createElement('button');
        importButton.className = 'popup-button';
        importButton.textContent = '导入JSON';
        importButton.addEventListener('click', function() {
            // 创建文件输入元素
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            
            // 监听文件选择
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        
                        // 验证数据结构
                        if (importedData && importedData.groups) {
                            // 更新数据
                            scoreData = importedData;
                            saveData(scoreData);
                            
                            // 更新页面显示
                            loadDataToPage(scoreData);
                            
                            alert('导入成功！');
                        } else {
                            alert('无效的JSON文件格式！');
                        }
                    } catch (error) {
                        alert('JSON文件解析失败！');
                    }
                    
                    // 移除弹出层
                    document.body.removeChild(overlay);
                };
                
                reader.readAsText(file);
            });
            
            // 触发文件选择
            fileInput.click();
        });
        buttonContainer.appendChild(importButton);
        
        // 创建更新功能区域
        const updateSection = document.createElement('div');
        updateSection.className = 'update-section';
        
        const updateTitle = document.createElement('h4');
        updateTitle.textContent = '更新设置';
        updateSection.appendChild(updateTitle);
        
        // 预设更新服务器URL
        const defaultUpdateUrl = 'https://jiangwanzhengchouyv.github.io/PointOS/updates';
        
        // 显示当前更新服务器URL
        const urlDisplay = document.createElement('p');
        urlDisplay.textContent = `当前更新服务器: ${defaultUpdateUrl}`;
        urlDisplay.style.marginBottom = '15px';
        updateSection.appendChild(urlDisplay);
        
        const checkUpdateButton = document.createElement('button');
        checkUpdateButton.className = 'popup-button';
        checkUpdateButton.textContent = '检查更新';
        checkUpdateButton.addEventListener('click', function() {
            const serverUrl = defaultUpdateUrl;
            
            // 显示加载状态
            checkUpdateButton.disabled = true;
            checkUpdateButton.textContent = '检查中...';
            
            // 实际从服务器获取更新说明
            fetch(`${serverUrl}/update-info.json?${Date.now()}`) // 添加时间戳防止缓存
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`网络错误: ${response.status}`);
                    }
                    return response.json();
                })
                .then(updateInfo => {
                    // 验证更新信息格式
                    if (!updateInfo.version || !updateInfo.changes) {
                        throw new Error('更新说明文件格式错误');
                    }
                    
                    // 比较版本号
                    if (updateInfo.version > CURRENT_VERSION) {
                        // 显示更新提示
                        const updateNotice = document.createElement('div');
                        updateNotice.className = 'update-notice';
                        updateNotice.innerHTML = `
                            <h4>发现新版本 ${updateInfo.version}</h4>
                            <p>当前版本: ${CURRENT_VERSION}</p>
                            <p>更新日期: ${updateInfo.date || '未知'}</p>
                            <p>重要程度: ${updateInfo.importance === 'high' ? '高' : '中'}</p>
                            <h5>更新内容:</h5>
                            <ul>
                                ${updateInfo.changes.map(change => `<li>${change}</li>`).join('')}
                            </ul>
                            <div class="update-actions">
                                <button class="update-now">立即更新</button>
                                <button class="update-later">稍后更新</button>
                            </div>
                        `;
                        
                        // 替换检查更新按钮
                        updateSection.removeChild(checkUpdateButton);
                        updateSection.appendChild(updateNotice);
                        
                        // 立即更新按钮事件
                        updateNotice.querySelector('.update-now').addEventListener('click', function() {
                            // 显示下载进度
                            const progressContainer = document.createElement('div');
                            progressContainer.className = 'update-progress';
                            progressContainer.innerHTML = `
                                <p>正在下载更新...</p>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 0%"></div>
                                </div>
                                <p class="progress-text">0%</p>
                                <button class="update-cancel">取消</button>
                            `;
                            
                            updateNotice.innerHTML = '';
                            updateNotice.appendChild(progressContainer);
                            
                            // 取消按钮事件
                            let isCancelled = false;
                            progressContainer.querySelector('.update-cancel').addEventListener('click', function() {
                                isCancelled = true;
                                alert('更新已取消');
                                document.body.removeChild(overlay);
                            });
                            
                            // 添加超时机制
                            const timeoutId = setTimeout(() => {
                                if (!isCancelled) {
                                    isCancelled = true;
                                    alert('更新超时，请检查网络连接后重试');
                                    document.body.removeChild(overlay);
                                }
                            }, 30000); // 30秒超时
                            
                            // 下载更新文件
                            const filesToDownload = [
                                { url: `${serverUrl}/积分.html?t=${Date.now()}`, name: '积分.html' },
                                { url: `${serverUrl}/style.css?t=${Date.now()}`, name: 'style.css' },
                                { url: `${serverUrl}/script.js?t=${Date.now()}`, name: 'script.js' }
                            ];
                            let downloadedFiles = 0;
                            let downloadPromises = [];
                            
                            filesToDownload.forEach((fileInfo, index) => {
                                const downloadPromise = fetch(fileInfo.url, {
                                    timeout: 10000 // 每个文件10秒超时
                                })
                                    .then(response => {
                                        if (isCancelled) throw new Error('更新已取消');
                                        if (!response.ok) {
                                            throw new Error(`下载文件失败: ${fileInfo.url} (${response.status})`);
                                        }
                                        return response.text();
                                    })
                                    .then(content => {
                                        if (isCancelled) throw new Error('更新已取消');
                                        
                                        // 尝试使用File System Access API保存文件
                                        if (window.showSaveFilePicker) {
                                            return window.showSaveFilePicker({
                                                suggestedName: fileInfo.name,
                                                types: [{
                                                    description: 'Text file',
                                                    accept: { 'text/*': ['.html', '.css', '.js'] }
                                                }]
                                            })
                                            .then(handle => handle.createWritable())
                                            .then(writable => {
                                                writable.write(content);
                                                return writable.close();
                                            });
                                        } else {
                                            // 降级方案：使用Blob下载
                                            const blob = new Blob([content], { type: 'text/plain' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = fileInfo.name;
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                            URL.revokeObjectURL(url);
                                            return Promise.resolve();
                                        }
                                    })
                                    .then(() => {
                                        if (isCancelled) throw new Error('更新已取消');
                                        downloadedFiles++;
                                        
                                        // 更新进度
                                        const progress = Math.round((downloadedFiles / filesToDownload.length) * 100);
                                        progressContainer.querySelector('.progress-fill').style.width = `${progress}%`;
                                        progressContainer.querySelector('.progress-text').textContent = `${progress}%`;
                                    })
                                    .catch(error => {
                                        if (isCancelled) throw error;
                                        console.error(`下载 ${fileInfo.name} 失败:`, error);
                                        throw new Error(`下载 ${fileInfo.name} 失败: ${error.message}。请检查文件权限或手动下载更新。`);
                                    });
                                
                                downloadPromises.push(downloadPromise);
                            });
                            
                            // 等待所有文件下载完成
                            Promise.all(downloadPromises)
                                .then(() => {
                                    if (isCancelled) return;
                                    
                                    // 清除超时
                                    clearTimeout(timeoutId);
                                    
                                    progressContainer.innerHTML = '<p>下载完成，正在应用更新...</p>';
                                    
                                    // 简化更新流程，直接刷新页面
                                    setTimeout(() => {
                                        alert('更新成功！正在应用更新...');
                                        document.body.removeChild(overlay);
                                        // 强制刷新页面，确保加载最新文件
                                        setTimeout(() => {
                                            location.reload(true);
                                        }, 500);
                                    }, 1000);
                                })
                                .catch(error => {
                                    // 清除超时
                                    clearTimeout(timeoutId);
                                    
                                    if (!isCancelled) {
                                        alert('更新失败：' + error.message);
                                        document.body.removeChild(overlay);
                                    }
                                });
                        });
                        
                        // 稍后更新按钮事件
                        updateNotice.querySelector('.update-later').addEventListener('click', function() {
                            document.body.removeChild(overlay);
                        });
                    } else {
                        alert('当前已是最新版本！');
                        checkUpdateButton.disabled = false;
                        checkUpdateButton.textContent = '检查更新';
                    }
                })
                .catch(error => {
                    alert('检查更新失败：' + error.message);
                    checkUpdateButton.disabled = false;
                    checkUpdateButton.textContent = '检查更新';
                });
        });
        updateSection.appendChild(checkUpdateButton);
        
        popup.appendChild(updateSection);
        
        // 创建取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.className = 'popup-cancel';
        cancelButton.textContent = '取消';
        cancelButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
        
        popup.appendChild(buttonContainer);
        popup.appendChild(cancelButton);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    });
    
    // 绑定评比按钮事件
    document.querySelector('.evaluate').addEventListener('click', function() {
        // 找出分数最高的小组
        let maxScore = -1;
        let winningGroup = '';
        
        for (let i = 1; i <= 7; i++) {
            const score = scoreData.groups[i.toString()] || 0;
            if (score > maxScore) {
                maxScore = score;
                winningGroup = i;
            }
        }
        
        // 显示获胜小组
        if (winningGroup) {
            alert(`评比结果：小组 ${winningGroup} 得分最高，分数为 ${maxScore}！`);
            
            // 清空所有小组的比分
            for (let i = 1; i <= 7; i++) {
                scoreData.groups[i.toString()] = 0;
            }
            saveData(scoreData);
            
            // 更新页面显示
            document.querySelectorAll('.score-value').forEach(element => {
                element.textContent = '0';
                addFeedback(element);
            });
            document.querySelectorAll('.score-input').forEach(element => {
                element.value = '0';
            });
            
            // 跳转到指定URL
            setTimeout(() => {
                window.location.href = 'https://bjcwy.rxtw666.cn/login';
            }, 1000);
        } else {
            alert('没有可评比的分数！');
        }
    });
    
    // 绑定保存按钮事件
    document.querySelectorAll('.score-save').forEach(button => {
        button.addEventListener('click', function() {
            const group = this.closest('.score-group').dataset.group;
            const inputElement = this.closest('.score-group').querySelector('.score-input');
            const scoreValue = parseInt(inputElement.value);
            
            // 输入验证
            if (isNaN(scoreValue) || scoreValue < 0) {
                alert('请输入有效的非负整数！');
                inputElement.value = scoreData.groups[group] || 0;
                return;
            }
            
            scoreData.groups[group] = scoreValue;
            saveData(scoreData);
            
            // 更新页面显示
            const scoreElement = this.closest('.score-group').querySelector('.score-value');
            if (scoreElement) {
                scoreElement.textContent = scoreValue;
                addFeedback(scoreElement);
            }
        });
    });
}

// 注册Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// 监听Service Worker消息
navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_UPDATED') {
    alert('更新成功！请刷新页面以应用更新。');
    location.reload(true);
  }
});

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);