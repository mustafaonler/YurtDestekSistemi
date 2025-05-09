// Supabase bağlantısı
const supabaseUrl = 'https://ymmfzxmvddrwkqspmptl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbWZ6eG12ZGRyd2txc3BtcHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzOTk0NTgsImV4cCI6MjA2MDk3NTQ1OH0.W4YE-T2UifvFMtERULUcNdLcIfL0mJQ4ZwQqR2xqguI';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Modal ve butonlar
const authModal = document.getElementById('auth-modal');
const adminAuthModal = document.getElementById('admin-auth-modal');
const studentLoginBtn = document.getElementById('student-login-btn');
const adminLoginBtn = document.getElementById('admin-login-btn');
const openComplaintBtn = document.getElementById('open-complaint-modal');
const closeAuthModal = document.getElementById('close-auth-modal');
const closeAdminAuthModal = document.getElementById('close-admin-auth-modal');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

// Öğrenci giriş butonuna tıklanınca öğrenci giriş/kayıt sayfasına yönlendir
studentLoginBtn?.addEventListener('click', () => {
    window.location.href = 'student-login.html';
});

// Admin giriş butonuna tıklanınca admin giriş sayfasına yönlendir
adminLoginBtn?.addEventListener('click', () => {
    window.location.href = 'admin-login.html';
});

// Şikayet butonu da öğrenci giriş modalını açar
openComplaintBtn?.addEventListener('click', () => {
    authModal.style.display = 'flex';
    authTabs.forEach(tab => tab.classList.remove('active'));
    authForms.forEach(form => form.classList.remove('active'));
    document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
    document.getElementById('login-form-modal').classList.add('active');
});

// Modal kapatma
closeAuthModal?.addEventListener('click', () => {
    authModal.style.display = 'none';
});
closeAdminAuthModal?.addEventListener('click', () => {
    adminAuthModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === authModal) authModal.style.display = 'none';
    if (e.target === adminAuthModal) adminAuthModal.style.display = 'none';
});

// Tab geçişleri
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + '-form-modal').classList.add('active');
    });
});

// Şifre göster/gizle
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

// Öğrenci Giriş formu gönderimi
const loginFormModal = document.getElementById('login-form-modal');
loginFormModal?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tcNo = document.getElementById('login-tc-modal').value;
    const studentNo = document.getElementById('login-student-no-modal').value;
    const password = document.getElementById('login-password-modal').value;
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

// Öğrenci Kayıt formu gönderimi
const registerFormModal = document.getElementById('register-form-modal');
registerFormModal?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        tc_no: document.getElementById('register-tc-modal').value,
        student_no: document.getElementById('register-student-no-modal').value,
        name: document.getElementById('register-name-modal').value,
        surname: document.getElementById('register-surname-modal').value,
        room: document.getElementById('register-room-modal').value,
        password: document.getElementById('register-password-modal').value
    };
    try {
        const { data, error } = await supabase
            .from('students')
            .insert([formData]);
        if (error) throw error;
        alert('Kayıt başarılı! Giriş yapabilirsiniz.');
        document.querySelector('.auth-tab[data-tab="login"]').click();
        registerFormModal.reset();
    } catch (error) {
        alert('Kayıt olurken bir hata oluştu!');
    }
});

// Admin Giriş formu gönderimi
const adminLoginForm = document.getElementById('admin-login-form');
adminLoginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    try {
        const { data, error } = await supabase
            .from('admins')
            .select('*')
            .eq('username', username)
            .single();
        if (error) throw error;
        if (data && data.password === password) {
            localStorage.setItem('admin', JSON.stringify(data));
            window.location.href = 'admin-panel.html';
        } else {
            alert('Admin giriş bilgileri hatalı!');
        }
    } catch (error) {
        alert('Admin girişi yapılırken bir hata oluştu!');
    }
});

// Oturum kontrolü
window.addEventListener('DOMContentLoaded', () => {
    const student = localStorage.getItem('student');
    const admin = localStorage.getItem('admin');
    if (student) {
        window.location.href = 'student-panel.html';
    } else if (admin) {
        window.location.href = 'admin-panel.html';
    }
});

