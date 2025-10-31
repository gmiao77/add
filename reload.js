
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
        // 用户登录函数
        async function login() {
            const email = emailInput.value;
            const password = passwordInput.value;
            
            if (!email || !password) {
                showAuthMessage('请输入邮箱和密码', true);
                return;
            }
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) {
                // 检查是否是邮箱未验证错误
                if (error.message.includes('Email not confirmed')) {
                    showAuthMessage('账号未激活，请联系管理员', true);
                } else {
                    // 其他错误保持原始提示
                    showAuthMessage(`登录失败: ${error.message}`, true);
                }
            } else {
                // 登录成功后检查管理员批准状态
                const userId = data.session.user.id;
                
                // 查询用户的approved状态
                const { data: profile, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('approved')
                    .eq('id', userId)
                    .single();
                
                // 处理查询错误或未找到用户资料的情况
                if (profileError || !profile) {
                    await supabase.auth.signOut();
                    showAuthMessage('您的账号体验已过期，请联系管理员激活', true);
                    return;
                }
                
                // 检查批准状态
                if (!profile.approved) {
                    await supabase.auth.signOut();
                    showAuthMessage('您的账号已激活，但尚未被管理员批准，请等待审核', true);
                } else {
                    // 已批准，触发状态更新（假设checkUser()会处理后续页面跳转等）
                    showAuthMessage('登录成功', false);
                    checkUser();
                }
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
