document.addEventListener('DOMContentLoaded', function() {
    // Supabase bağlantısı
    const supabaseUrl = 'https://ymmfzxmvddrwkqspmptl.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbWZ6eG12ZGRyd2txc3BtcHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzOTk0NTgsImV4cCI6MjA2MDk3NTQ1OH0.W4YE-T2UifvFMtERULUcNdLcIfL0mJQ4ZwQqR2xqguI';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    // Kayıt modalı aç/kapat
    const openRegisterModal = document.getElementById('open-register-modal');
    const registerModal = document.getElementById('register-modal');
    const closeRegisterModal = document.getElementById('close-register-modal');
    openRegisterModal?.addEventListener('click', () => {
        registerModal.style.display = 'flex';
    });
    closeRegisterModal?.addEventListener('click', () => {
        registerModal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === registerModal) registerModal.style.display = 'none';
    });

    // Tab geçişleri
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab + '-form').classList.add('active');
        });
    });

    // Şifre göster/gizle (hem giriş hem kayıt)
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    });

    // Giriş formu
    const loginForm = document.getElementById('login-form');
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tcNo = document.getElementById('login-tc').value;
        const studentNo = document.getElementById('login-student-no').value;
        const password = document.getElementById('login-password').value;
        try {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('tc_no', tcNo)
                .eq('student_no', studentNo)
                .single();
            if (error) throw error;
            if (data && data.password === password) {
                localStorage.setItem('student', JSON.stringify(data));
                window.location.href = 'student-panel.html';
            } else {
                alert('Giriş bilgileri hatalı!');
            }
        } catch (error) {
            alert('Giriş yapılırken bir hata oluştu!');
        }
    });

    // Kayıt formu
    const registerForm = document.getElementById('register-form');
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            tc_no: document.getElementById('register-tc').value,
            student_no: document.getElementById('register-student-no').value,
            name: document.getElementById('register-name').value,
            surname: document.getElementById('register-surname').value,
            room_no: document.getElementById('register-room').value,
            password: document.getElementById('register-password').value,
            created_at: new Date().toISOString()
        };
        try {
            const { data, error } = await supabase
                .from('students')
                .insert([formData]);
            if (error) throw error;
            alert('Kayıt başarılı! Giriş yapabilirsiniz.');
            registerModal.style.display = 'none';
            registerForm.reset();
        } catch (error) {
            alert('Kayıt olurken bir hata oluştu!');
        }
    });
}); 