// Supabase bağlantısı
const supabaseUrl = 'https://ymmfzxmvddrwkqspmptl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbWZ6eG12ZGRyd2txc3BtcHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzOTk0NTgsImV4cCI6MjA2MDk3NTQ1OH0.W4YE-T2UifvFMtERULUcNdLcIfL0mJQ4ZwQqR2xqguI';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Şifre göster/gizle
const togglePasswordBtn = document.querySelector('.toggle-password');
togglePasswordBtn?.addEventListener('click', function() {
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

// Admin giriş formu
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