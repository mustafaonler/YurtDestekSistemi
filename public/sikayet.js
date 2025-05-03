// Supabase bağlantısı
const supabaseClient = createClient(
    'SUPABASE_URL',
    'SUPABASE_KEY'
);

// Öğrenci bilgilerini kontrol et
const currentStudent = JSON.parse(localStorage.getItem('currentStudent'));
if (!currentStudent) {
    window.location.href = '/index.html';
}

// Form elementi
const complaintForm = document.getElementById('complaint-form');
const previousComplaints = document.getElementById('previous-complaints');

// Önceki şikayetleri yükle
async function loadComplaints() {
    try {
        const { data: complaints, error } = await supabaseClient
            .from('complaints')
            .select('*')
            .eq('student_id', currentStudent.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        previousComplaints.innerHTML = complaints.map(complaint => `
            <div class="complaint-item">
                <h4>${complaint.subject}</h4>
                <p><strong>Tür:</strong> ${complaint.type}</p>
                <p>${complaint.details}</p>
                <small>Tarih: ${new Date(complaint.created_at).toLocaleString('tr-TR')}</small>
            </div>
        `).join('');
    } catch (err) {
        console.error('Şikayetler yüklenirken hata:', err);
        alert('Şikayetler yüklenirken bir hata oluştu.');
    }
}

// Form gönderimi
complaintForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const type = document.getElementById('complaint-type').value;
    const subject = document.getElementById('complaint-subject').value;
    const details = document.getElementById('complaint-details').value;

    try {
        const { data, error } = await supabaseClient
            .from('complaints')
            .insert([
                {
                    student_id: currentStudent.id,
                    type,
                    subject,
                    details,
                    status: 'beklemede'
                }
            ]);

        if (error) throw error;

        alert('Talebiniz başarıyla gönderildi!');
        complaintForm.reset();
        await loadComplaints();
    } catch (err) {
        console.error('Şikayet gönderilirken hata:', err);
        alert('Şikayet gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
});

// Çıkış yapma fonksiyonu
function logout() {
    localStorage.removeItem('currentStudent');
    window.location.href = '/index.html';
}

// Sayfa yüklendiğinde şikayetleri göster
loadComplaints(); 