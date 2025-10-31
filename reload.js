
        // 初始化Supabase客户端 - 请替换为你的项目URL和anon key
        const supabaseUrl = 'https://dpvqswmhxkvdsqayhklf.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwdnFzd21oeGt2ZHNxYXloa2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1Mjg3NjcsImV4cCI6MjA3MDEwNDc2N30.XZICsMMj63SCA86ZuNADz4xaoR2AfakSXttNzU0FxS0';
        const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

        // DOM元素
        const authForm = document.getElementById('authForm');
        const adSystem = document.getElementById('adSystem');
        const authStatus = document.getElementById('authStatus');
        const authMessage = document.getElementById('authMessage');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');

        // 检查用户认证状态
        async function checkUser() {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (session) {
                // 用户已登录
                showAdSystem(session.user);
            } else {
                // 用户未登录
                showAuthForm();
            }
        }

        // 显示登录/注册表单
        function showAuthForm() {
            authForm.classList.remove('hidden');
            adSystem.classList.add('hidden');
            authStatus.textContent = '未登录';
        }

        // 显示广告系统（已登录状态）
        function showAdSystem(user) {
            authForm.classList.add('hidden');
            adSystem.classList.remove('hidden');
            authStatus.innerHTML = `
                已登录: ${user.email} 
                <button id="logoutBtn" class="ml-2 text-sm text-indigo-600 hover:underline">
                    退出登录
                </button>
            `;
            
            // 绑定退出登录事件
            document.getElementById('logoutBtn').addEventListener('click', logout);
        }

        // 显示认证消息
        function showAuthMessage(text, isError = false) {
            authMessage.textContent = text;
            authMessage.className = `mt-4 text-sm text-center ${isError ? 'text-red-600' : 'text-green-600'}`;
        }

        // 注册新用户
        async function register() {
            const email = emailInput.value;
            const password = passwordInput.value;
            
            if (!email || !password) {
                showAuthMessage('请输入邮箱和密码', true);
                return;
            }
            
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });
            
            if (error) {
                showAuthMessage(`注册失败: ${error.message}`, true);
            } else {
                showAuthMessage('注册成功，请查收验证邮件');
            }
        }

        // 用户登录
        async function login() {
            const email = emailInput.value;
            const password = passwordInput.value;
            
            if (!email || !password) {
                showMessage('请输入邮箱和密码', true);
                return;
            }
            
            try {
                // 1. 常规登录（会自动检查邮箱验证状态）
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                
                if (error) {
                    // 处理邮箱未验证错误
                    if (error.message.includes('Email not confirmed')) {
                        showMessage('请先点击邮件中的链接验证您的邮箱', true);
                        // 可以在这里添加"重新发送验证邮件"的功能入口
                        return;
                    }
                    throw error;
                }
                
                // 2. 登录成功后检查管理员批准状态
                const userId = data.session.user.id;
                
                // 查询用户的approved状态
                const { data: profile, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('approved')
                    .eq('id', userId)
                    .single();
                
                if (profileError || !profile) {
                    // 如果没有用户资料记录，自动视为但提示需要等待批准
                    await supabase.auth.signOut();
                    showMessage('您的账号正在等待管理员批准', true);
                    return;
                }
                
                // 3. 根据批准状态处理
                if (!profile.approved) {
                    // 未批准，登出但保留邮箱验证状态
                    await supabase.auth.signOut();
                    showMessage('您的账号已验证，但尚未被管理员批准，请等待审核', true);
                } else {
                    // 已批准，正常进入系统
                    showMessage('登录成功，正在进入系统...', false);
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1000);
                }
                
            } catch (error) {
                showMessage(`登录失败: ${error.message}`, true);
            }
        }
        
        // 可选：重新发送验证邮件功能
        async function resendVerificationEmail() {
            const email = emailInput.value.trim();
            if (!email) {
                showMessage('请输入您的邮箱', true);
                return;
            }
            
            try {
                const { error } = await supabase.auth.resendVerificationEmail({
                    email
                });
                
                if (error) throw error;
                showMessage('验证邮件已重新发送，请查收', false);
            } catch (error) {
                showMessage(`发送失败: ${error.message}`, true);
            }
        }
        // 用户登出
        async function logout() {
            const { error } = await supabase.auth.signOut();
            if (!error) {
                checkUser(); // 重新检查用户状态
            }
        }

        // 策略选择逻辑
        document.getElementById('strategySelector').addEventListener('change', function(e) {
            const selectedValue = e.target.value;
            const container = document.getElementById('subpageContainer');
            
            container.innerHTML = '';
            
            if (selectedValue === 'strategy1') {
                loadStrategy1(container);
            } else if (selectedValue) {
                container.innerHTML = `
                    <div class="flex items-center justify-center h-[600px] text-gray-500">
                        <p>策略 ${selectedValue} 的内容即将上线</p>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="flex items-center justify-center h-[600px] text-gray-500">
                        <p>请从上方选择一个广告策略</p>
                    </div>
                `;
            }
        });



        // 绑定事件
        registerBtn.addEventListener('click', register);
        loginBtn.addEventListener('click', login);
        
        // 监听认证状态变化
        supabase.auth.onAuthStateChange((event, session) => {
            checkUser();
        });

        // 页面加载时检查认证状态
        window.addEventListener('load', checkUser);
