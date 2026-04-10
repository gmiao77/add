const CORRECT_PASSWORD = "amz2025";  


const errorMessages = [
    "未通过", "口令不正确", "再试一次", "不对", "请重新输入",
    "差一点", "无此权限", "敲错了", "无效口令", "再想想",
    "不对哦", "✗", "认证失败", "请重试"
];

function getRandomErrorMsg() {
    return errorMessages[Math.floor(Math.random() * errorMessages.length)];
}


const isAuthenticated = localStorage.getItem('amz_auth') === 'true';


function showMainContent() {
    const mainDiv = document.getElementById('adSystem');
    if (mainDiv) mainDiv.classList.remove('hidden-system');
}

if (isAuthenticated) {
    showMainContent();
} else {
    createPasswordModal();
}


function createPasswordModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const container = document.createElement('div');
    container.className = 'modal-container';
    
    const title = document.createElement('h2');
    title.className = 'modal-title';
    title.innerText = '访问口令';
    
    const input = document.createElement('input');
    input.type = 'password';
    input.placeholder = '';
    input.className = 'modal-input';
    input.autofocus = true;
    
    const button = document.createElement('button');
    button.className = 'modal-button';
    button.innerText = '确认';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-msg';
    
    container.appendChild(title);
    container.appendChild(input);
    container.appendChild(button);
    container.appendChild(errorDiv);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
    
    const showError = () => {
        const randomMsg = getRandomErrorMsg();
        errorDiv.textContent = randomMsg;
        errorDiv.classList.remove('show');
        void errorDiv.offsetWidth; // 强制重绘
        errorDiv.classList.add('show');
        container.classList.add('shake');
        setTimeout(() => {
            container.classList.remove('shake');
        }, 300);
        input.value = '';
        input.focus();
    };
    
    const verify = () => {
        const entered = input.value.trim();
        if (entered === CORRECT_PASSWORD) {
            localStorage.setItem('amz_auth', 'true');
            overlay.remove();
            showMainContent();
        } else {
            showError();
        }
    };
    
    button.addEventListener('click', verify);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verify();
    });
}