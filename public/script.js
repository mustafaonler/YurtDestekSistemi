// DOM Elements
const authContainer = document.querySelector('.auth-container');
const mainContainer = document.querySelector('.main-container');
const tabBtns = document.querySelectorAll('.tab-btn');
const forms = document.querySelectorAll('.form');
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const complaintForm = document.querySelector('#complaint-form');
const complaintsList = document.querySelector('.complaints-list');
const logoutBtn = document.querySelector('#logout-btn');
const complaintTypeSelector = document.querySelector('.complaint-type-selector');
const complaintTypeBtns = document.querySelectorAll('.complaint-type-btn');

// Supabase bağlantısı
const supabaseUrl = 'https://ymmfzxmvddrwkqspmptl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbWZ6eG12ZGRyd2txc3BtcHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzOTk0NTgsImV4cCI6MjA2MDk3NTQ1OH0.W4YE-T2UifvFMtERULUcNdLcIfL0mJQ4ZwQqR2xqguI';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Tab Switching
function switchForm(formId) {
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    forms.forEach(form => {
        form.classList.remove('active');
        form.style.display = 'none';
    });
    
    const selectedTab = document.querySelector(`[data-form="${formId}"]`);
    const selectedForm = document.getElementById(formId);
    
    if (selectedTab && selectedForm) {
        selectedTab.classList.add('active');
        selectedForm.classList.add('active');
        selectedForm.style.display = 'block';
    }
}

// Event Listeners
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const formId = btn.getAttribute('data-form');
        switchForm(formId);
    });
});

document.querySelector('.switch-to-register')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchForm('register-form');
});

document.querySelector('.switch-to-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchForm('login-form');
});

// Password Toggle
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const passwordInput = toggle.previousElementSibling;
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        toggle.innerHTML = type === 'password' ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
    });
});

// TC Kimlik No Kontrolü
function validateTC(tcNo) {
    if (!tcNo || tcNo.length !== 11 || !/^\d{11}$/.test(tcNo)) {
        return false;
    }
    return true;
}

// Login Form Submit
loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const tcNo = document.querySelector('#login-tc').value;
    const studentNo = document.querySelector('#login-student-no').value;
    const password = document.querySelector('#login-password').value;

    if (!validateTC(tcNo)) {
        alert('Geçerli bir TC Kimlik No giriniz!');
        return;
    }

    if (!studentNo || !password) {
        alert('Tüm alanları doldurunuz!');
        return;
    }

    try {
        // Önce öğrenciyi TC ve öğrenci numarasına göre ara
        const { data: students, error: queryError } = await supabaseClient
            .from('students')
            .select('*')
            .eq('tc_no', tcNo)
            .eq('student_no', studentNo)
            .single();

        if (queryError) {
            console.error('Veritabanı hatası:', queryError);
            if (queryError.code === 'PGRST116') {
                alert('Öğrenci bulunamadı! Lütfen bilgilerinizi kontrol edin.');
            } else {
                alert('Veritabanına bağlanırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            }
            return;
        }

        if (!students) {
            alert('Öğrenci bulunamadı! Lütfen bilgilerinizi kontrol edin.');
            return;
        }

        // Şifre kontrolü
        if (students.password !== password) {
            alert('Şifre hatalı! Lütfen şifrenizi kontrol edin.');
            return;
        }

        // Giriş başarılı
        localStorage.setItem('student', JSON.stringify(students));
        
        // Ana sayfayı göster
        authContainer.style.display = 'none';
        mainContainer.style.display = 'block';
        
        // Talepleri yükle
        await loadComplaints();
        
    } catch (err) {
        console.error('Giriş hatası:', err);
        alert('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
});

// Register Form Submit
registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const tcNo = document.querySelector('#register-tc').value;
    const studentNo = document.querySelector('#register-student-no').value;
    const name = document.querySelector('#register-name').value;
    const surname = document.querySelector('#register-surname').value;
    const room = document.querySelector('#register-room').value;
    const password = document.querySelector('#register-password').value;

    if (!validateTC(tcNo)) {
        alert('Geçerli bir TC Kimlik No giriniz!');
        return;
    }

    try {
        const { data: existingStudent } = await supabaseClient
            .from('students')
            .select('*')
            .or(`tc_no.eq.${tcNo},student_no.eq.${studentNo}`)
            .maybeSingle();

        if (existingStudent) {
            alert('Bu TC Kimlik No veya Öğrenci No ile daha önce kayıt yapılmış!');
            return;
        }

        const { data, error } = await supabaseClient
            .from('students')
            .insert([{
                tc_no: tcNo,
                student_no: studentNo,
                name: name,
                surname: surname,
                room_no: room,
                password: password
            }])
            .select();

        if (error) throw error;

        alert('Kayıt başarılı! Giriş yapabilirsiniz.');
        registerForm.reset();
        switchForm('login-form');
    } catch (error) {
        console.error('Kayıt hatası:', error);
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
});

// Complaint Form Submit
if (complaintForm) {
    complaintForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const student = JSON.parse(localStorage.getItem('student'));
        if (!student) {
            alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
            return;
        }

        const formData = new FormData(complaintForm);
        const type = document.querySelector('#complaint-type').value;
        const category = formData.get('category');
        const description = formData.get('description');

        if (!category) {
            alert('Lütfen bir kategori seçin.');
            return;
        }

        if (!description) {
            alert('Lütfen bir açıklama girin.');
            return;
        }

        const complaint = {
            student_id: student.id,
            type: type,
            category: category,
            description: description,
            status: 'beklemede',
            created_at: new Date().toISOString()
        };

        const imageFile = formData.get('image');
        if (imageFile && imageFile.size > 0) {
            if (imageFile.size > 5 * 1024 * 1024) {
                alert('Fotoğraf boyutu 5MB\'dan büyük olamaz.');
                return;
            }

            try {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    complaint.image = e.target.result;
                    await submitComplaint(complaint);
                };
                reader.readAsDataURL(imageFile);
            } catch (error) {
                console.error('Resim yükleme hatası:', error);
                alert('Resim yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } else {
            await submitComplaint(complaint);
        }
    });
}

// Submit Complaint
async function submitComplaint(complaint) {
    try {
        const { data, error } = await supabaseClient
            .from('complaints')
            .insert([complaint])
            .select();

        if (error) {
            console.error('Talep gönderme hatası:', error);
            alert('Talep gönderilemedi. Lütfen tekrar deneyin.');
            return;
        }

        alert('Talebiniz başarıyla gönderildi.');
        complaintForm.reset();
        
        const imagePreview = document.querySelector('#image-preview');
        if (imagePreview) {
            imagePreview.innerHTML = '';
            imagePreview.classList.remove('active');
        }
        
        await loadComplaints();
    } catch (error) {
        console.error('Talep gönderme hatası:', error);
        alert('Talep gönderilemedi. Lütfen tekrar deneyin.');
    }
}

// Şikayet tipi seçimi
document.querySelectorAll('.complaint-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.complaint-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelector('#complaint-type').value = btn.dataset.type;
    });
});

// Şikayetleri yükle
async function loadComplaints() {
    try {
        const student = JSON.parse(localStorage.getItem('student'));
        if (!student) return;

        const { data: complaints, error } = await supabaseClient
            .from('complaints')
            .select('*')
            .eq('student_id', student.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Şikayetler yüklenirken hata:', error);
            return;
        }

        displayComplaints(complaints || []);
    } catch (error) {
        console.error('Şikayetler yüklenirken hata:', error);
    }
}

// Şikayetleri göster
function displayComplaints(complaints) {
    if (!complaintsList) return;

    if (complaints.length === 0) {
        complaintsList.innerHTML = `
            <div class="no-complaints">
                <i class="bi bi-info-circle"></i>
                <p>Henüz hiç talep oluşturmadınız.</p>
                <button class="btn-primary" onclick="document.querySelector('.complaint-form').scrollIntoView()">
                    <i class="bi bi-plus-circle"></i> Yeni Talep Oluştur
                </button>
            </div>
        `;
        return;
    }

    complaintsList.innerHTML = complaints.map(complaint => `
        <div class="complaint-card type-${complaint.type}">
            <div class="complaint-header">
                <span class="complaint-type-badge ${complaint.type}">
                    ${complaint.type === 'şikayet' ? 'Şikayet' : 'Arz/Talep'}
                </span>
                <span class="complaint-status ${complaint.status}">
                    ${getStatusText(complaint.status)}
                </span>
            </div>
            <div class="complaint-content">
                <h3>${complaint.category}</h3>
                <p class="complaint-description">${complaint.description}</p>
                ${complaint.image ? `
                    <div class="complaint-image">
                        <img src="${complaint.image}" alt="Şikayet görseli">
                    </div>
                ` : ''}
                <div class="complaint-meta">
                    <span><i class="bi bi-calendar"></i> ${new Date(complaint.created_at).toLocaleDateString('tr-TR')}</span>
                    <span><i class="bi bi-clock"></i> ${new Date(complaint.created_at).toLocaleTimeString('tr-TR')}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Helper Functions
function getStatusText(status) {
    const statusMap = {
        'beklemede': 'Beklemede',
        'işleniyor': 'İşleniyor',
        'tamamlandı': 'Tamamlandı',
        'reddedildi': 'Reddedildi'
    };
    return statusMap[status?.toLowerCase()] || 'Beklemede';
}

// Check Authentication on Load
document.addEventListener('DOMContentLoaded', () => {
    const student = localStorage.getItem('student');
    if (student) {
        mainContainer.style.display = 'block';
        authContainer.style.display = 'none';
        loadComplaints();
    } else {
        mainContainer.style.display = 'none';
        authContainer.style.display = 'flex';
    }
});

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('student');
        location.reload();
    });
}

// Image Preview
document.querySelector('#complaint-image')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const preview = document.querySelector('#image-preview');

    reader.onload = function(e) {
        preview.innerHTML = `<img src="${e.target.result}" alt="Seçilen görsel">`;
        preview.classList.add('active');
    };

    reader.readAsDataURL(file);
});

