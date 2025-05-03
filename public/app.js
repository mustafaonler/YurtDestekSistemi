// API URL
const API_URL = 'http://localhost:5000/api';

// DOM Elements
const authContainer = document.getElementById('auth-container');
const mainContainer = document.getElementById('main-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const complaintForm = document.getElementById('complaint-form');
const complaintsContainer = document.getElementById('complaints-container');
const logoutBtn = document.getElementById('logout-btn');
const tabButtons = document.querySelectorAll('.tab-btn');

// Fotoğraf Önizleme
const imageInput = document.getElementById('complaint-image');
const imagePreview = document.getElementById('image-preview');

imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Önizleme">`;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = '';
        imagePreview.style.display = 'none';
    }
});

// TC Kimlik No Kontrolü
function validateTC(tcNo) {
    if (!tcNo || tcNo.length !== 11 || !/^\d+$/.test(tcNo)) {
        return false;
    }
    return true;
}

// Tab switching
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        document.querySelectorAll('.form').forEach(form => form.classList.remove('active'));
        document.getElementById(`${tab}-form`).classList.add('active');
    });
});

// Supabase bağlantısı
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Şifre göster/gizle işlevi
document.querySelectorAll('.password-toggle').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.dataset.target;
        const passwordInput = document.getElementById(targetId);
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Öğrenci Kayıt
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const tcNo = document.getElementById('register-tc').value;
    if (!validateTC(tcNo)) {
        alert('TC Kimlik numarası 11 haneli olmalıdır!');
        return;
    }

    const studentData = {
        tc_no: tcNo,
        student_no: document.getElementById('register-student-no').value,
        name: document.getElementById('register-name').value,
        surname: document.getElementById('register-surname').value,
        room_no: document.getElementById('register-room').value,
        password: document.getElementById('register-password').value,
        created_at: new Date().toISOString()
    };

    try {
        // Önce TC ve öğrenci numarasının benzersiz olduğunu kontrol et
        const { data: existingStudent, error: checkError } = await supabase
            .from('students')
            .select()
            .or(`tc_no.eq.${tcNo},student_no.eq.${document.getElementById('register-student-no').value}`)
            .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116: no rows returned
            throw checkError;
        }

        if (existingStudent) {
            alert('Bu TC Kimlik No veya Öğrenci No zaten kayıtlı!');
            return;
        }

        const { data, error } = await supabase
            .from('students')
            .insert([studentData])
            .select()
            .single();

        if (error) {
            console.error('Kayıt hatası:', error);
            throw error;
        }

        if (data) {
            localStorage.setItem('student', JSON.stringify(data));
            showMainPage();
            loadComplaints();
            alert('Kayıt başarıyla tamamlandı!');
        }
    } catch (error) {
        console.error('Hata:', error.message);
        alert('Kayıt sırasında bir hata oluştu! Lütfen bilgilerinizi kontrol edin.');
    }
});

// Öğrenci Girişi
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const tcNo = document.getElementById('login-tc').value;
    if (!validateTC(tcNo)) {
        alert('TC Kimlik numarası 11 haneli olmalıdır!');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('students')
            .select()
            .eq('tc_no', tcNo)
            .eq('student_no', document.getElementById('login-student-no').value)
            .eq('password', document.getElementById('login-password').value)
            .single();

        if (error) {
            console.error('Giriş hatası:', error);
            throw error;
        }

        if (data) {
            localStorage.setItem('student', JSON.stringify(data));
            showMainPage();
            loadComplaints();
            alert('Giriş başarılı!');
        } else {
            alert('Giriş bilgileri hatalı! Lütfen bilgilerinizi kontrol edin.');
        }
    } catch (error) {
        console.error('Hata:', error.message);
        alert('Giriş sırasında bir hata oluştu! Lütfen tekrar deneyin.');
    }
});

// Yeni Talep Oluşturma
complaintForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const student = JSON.parse(localStorage.getItem('student'));
    if (!student) {
        alert('Lütfen önce giriş yapın!');
        return;
    }

    const complaintData = {
        student_id: student.id,
        type: document.getElementById('complaint-type').value,
        category: document.getElementById('complaint-category').value,
        description: document.getElementById('complaint-description').value,
        status: 'bekleniyor'
    };

    // Fotoğraf varsa ekle
    const imageFile = imageInput.files[0];
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            complaintData.image = e.target.result;
            await saveComplaint(complaintData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        await saveComplaint(complaintData);
    }
});

// Talebi Kaydet
async function saveComplaint(complaintData) {
    try {
        console.log('Kaydedilecek talep:', complaintData);
        const { data, error } = await supabase
            .from('complaints')
            .insert([complaintData]);

        if (error) {
            console.error('Talep kaydetme hatası:', error);
            throw error;
        }

        console.log('Kaydedilen talep:', data);
        alert('Talebiniz başarıyla oluşturuldu');
        complaintForm.reset();
        imagePreview.innerHTML = '';
        imagePreview.style.display = 'none';
        loadComplaints();
    } catch (error) {
        console.error('Hata:', error.message);
        alert('Talep oluşturulurken bir hata oluştu!');
    }
}

// Talepleri Yükle
async function loadComplaints() {
    const student = JSON.parse(localStorage.getItem('student'));
    if (!student) {
        console.error('Öğrenci bilgisi bulunamadı');
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('complaints')
            .select('*')
            .eq('student_id', student.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Talepler yüklenirken hata:', error);
            throw error;
        }

        console.log('Yüklenen talepler:', data);
        displayComplaints(data);
    } catch (error) {
        console.error('Hata:', error.message);
        alert('Talepler yüklenirken bir hata oluştu!');
    }
}

// Talepleri Görüntüle
function displayComplaints(complaints) {
    console.log('Talepler görüntüleniyor:', complaints);
    complaintsContainer.innerHTML = '';
    
    if (!complaints || complaints.length === 0) {
        complaintsContainer.innerHTML = '<p class="no-complaints">Henüz talep oluşturmadınız.</p>';
        return;
    }
    
    complaints.forEach(complaint => {
        const complaintCard = document.createElement('div');
        complaintCard.className = 'complaint-card';
        
        const statusClass = {
            'bekleniyor': 'bekleniyor',
            'ilgileniliyor': 'ilgileniliyor',
            'tamamlandı': 'tamamlandı'
        }[complaint.status];
        
        complaintCard.innerHTML = `
            <h3>${complaint.type === 'şikayet' ? 'Şikayet' : 'Arz'}</h3>
            <p><strong>Kategori:</strong> ${complaint.category}</p>
            <p><strong>Açıklama:</strong> ${complaint.description}</p>
            ${complaint.image ? `<img src="${complaint.image}" alt="Şikayet Fotoğrafı" class="complaint-image">` : ''}
            <p><strong>Tarih:</strong> ${new Date(complaint.created_at).toLocaleString()}</p>
            <span class="status ${statusClass}">${complaint.status}</span>
            ${complaint.admin_response ? `<p><strong>Yanıt:</strong> ${complaint.admin_response}</p>` : ''}
        `;
        
        complaintsContainer.appendChild(complaintCard);
    });
}

// Ana Sayfayı Göster
function showMainPage() {
    authContainer.style.display = 'none';
    mainContainer.style.display = 'block';
}

// Giriş Sayfasını Göster
function showAuthPage() {
    authContainer.style.display = 'block';
    mainContainer.style.display = 'none';
}

// Çıkış Yap
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('student');
    showAuthPage();
    location.reload();
});

// Sayfa Yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    const student = localStorage.getItem('student');
    if (student) {
        showMainPage();
        loadComplaints();
    } else {
        showAuthPage();
    }
}); 