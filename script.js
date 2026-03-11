// 班级积分管理系统

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
    
    // 绑定加分按钮事件
    document.querySelectorAll('.score-add').forEach(button => {
        button.addEventListener('click', function() {
            const group = this.closest('.score-group').dataset.group;
            scoreData.groups[group] = (scoreData.groups[group] || 0) + 1;
            saveData(scoreData);
            
            // 更新页面显示
            const scoreElement = this.closest('.score-group').querySelector('.score-value');
            const inputElement = this.closest('.score-group').querySelector('.score-input');
            if (scoreElement) {
                scoreElement.textContent = scoreData.groups[group];
                addFeedback(scoreElement);
            }
            if (inputElement) inputElement.value = scoreData.groups[group];
        });
    });
    
    // 绑定减分按钮事件
    document.querySelectorAll('.score-subtract').forEach(button => {
        button.addEventListener('click', function() {
            const group = this.closest('.score-group').dataset.group;
            scoreData.groups[group] = Math.max(0, (scoreData.groups[group] || 0) - 1);
            saveData(scoreData);
            
            // 更新页面显示
            const scoreElement = this.closest('.score-group').querySelector('.score-value');
            const inputElement = this.closest('.score-group').querySelector('.score-input');
            if (scoreElement) {
                scoreElement.textContent = scoreData.groups[group];
                addFeedback(scoreElement);
            }
            if (inputElement) inputElement.value = scoreData.groups[group];
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

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);