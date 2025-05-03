// Supabase bağlantısı
const supabaseUrl = 'https://ymmfzxmvddrwkqspmptl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbWZ6eG12ZGRyd2txc3BtcHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzOTk0NTgsImV4cCI6MjA2MDk3NTQ1OH0.W4YE-T2UifvFMtERULUcNdLcIfL0mJQ4ZwQqR2xqguI';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const adminAuthContainer = document.getElementById('admin-auth-container');
const adminPanel = document.getElementById('admin-panel');
const adminLoginForm = document.getElementById('admin-login-form');
const adminLogoutBtn = document.getElementById('admin-logout-btn');
const filterBtn = document.getElementById('filter-btn');
const adminComplaintsContainer = document.getElementById('admin-complaints-container');

// Yönetici Girişi
adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    try {
        // Önce kullanıcı adını kontrol edelim
        const { data: userData, error: userError } = await supabaseClient
            .from('admins')
            .select('*')
            .eq('username', username)
            .single();

        if (userError) {
            if (userError.code === 'PGRST116') {
                showNotification('Kullanıcı adı veya şifre hatalı!', 'error');
            } else {
                console.error('Veritabanı hatası:', userError);
                showNotification('Bir hata oluştu! Lütfen tekrar deneyin.', 'error');
            }
            return;
        }

        // Şifreyi kontrol edelim
        if (userData && userData.password === password) {
            localStorage.setItem('admin', JSON.stringify(userData));
            showAdminPanel();
            loadComplaints();
            showNotification('Giriş başarılı!', 'success');
        } else {
            showNotification('Kullanıcı adı veya şifre hatalı!', 'error');
        }
    } catch (error) {
        console.error('Giriş sırasında hata:', error);
        showNotification('Giriş sırasında bir hata oluştu! Lütfen tekrar deneyin.', 'error');
    }
});

// Talepleri yükleme fonksiyonu
async function loadComplaints() {
    try {
        const typeFilter = document.getElementById('typeFilter').value;
        const categoryFilter = document.getElementById('categoryFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        let query = supabaseClient
            .from('complaints')
            .select(`
                *,
                student:students (
                    name,
                    surname,
                    tc_no,
                    room_no
                )
            `)
            .order('created_at', { ascending: false });

        // Tüm filtreleri uygula (AND mantığı)
        if (typeFilter !== 'all') {
            query = query.eq('type', typeFilter);
        }

        if (categoryFilter !== 'all') {
            query = query.eq('category', categoryFilter);
        }

        if (statusFilter !== 'all') {
            query = query.eq('status', statusFilter);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Yurt istatistiklerini güncelle
        updateDormStats(data);

        const complaintsList = document.getElementById('admin-complaints-container');
        complaintsList.innerHTML = '';

        if (!data || data.length === 0) {
            complaintsList.innerHTML = '<p class="no-complaints">Gösterilecek talep bulunamadı.</p>';
            return;
        }

        // Filtreleme sonuç mesajını güncelle
        const resultMessage = document.getElementById('filter-result-message');
        if (resultMessage) {
            let filterText = [];
            if (typeFilter !== 'all') filterText.push(`Talep Türü: ${getTypeText(typeFilter)}`);
            if (categoryFilter !== 'all') filterText.push(`Kategori: ${getCategoryText(categoryFilter)}`);
            if (statusFilter !== 'all') filterText.push(`Durum: ${getStatusText(statusFilter)}`);
            
            if (filterText.length > 0) {
                resultMessage.textContent = `Filtreler: ${filterText.join(', ')} - Toplam ${data.length} talep gösteriliyor.`;
            } else {
                resultMessage.textContent = `Tüm talepler gösteriliyor. Toplam ${data.length} talep.`;
            }
        }

        data.forEach(complaint => {
            const complaintElement = document.createElement('div');
            // Kart türüne göre class ekle
            complaintElement.className = 'complaint-card type-' + complaint.type;

            // Tür badge'i
            let typeBadge = '';
            if (complaint.type === 'şikayet') {
                typeBadge = '<span class="complaint-type-badge şikayet">Şikayet</span>';
            } else if (complaint.type === 'arz') {
                typeBadge = '<span class="complaint-type-badge arz">Arz</span>';
            }

            // Fotoğraf URL'sini al
            let imageHtml = '';
            if (complaint.image) {
                imageHtml = `
                    <div class="complaint-image">
                        <img src="${complaint.image}" alt="Talep fotoğrafı" onclick="openImageInNewTab('${complaint.image}')">
                    </div>`;
            }

            const studentInfo = complaint.student || {};

            complaintElement.innerHTML = `
                <div class="complaint-header">
                    <h3>${typeBadge}${complaint.title || 'Başlıksız Talep'}</h3>
                    <div class="complaint-badges">
                        <span class="complaint-type">${getTypeText(complaint.type)}</span>
                        <span class="complaint-category">${getCategoryText(complaint.category)}</span>
                        <span class="complaint-status ${complaint.status}">${getStatusText(complaint.status)}</span>
                    </div>
                </div>
                <div class="complaint-body">
                    <div class="complaint-content">
                        <div class="complaint-user-info">
                            <h4>Gönderen Bilgileri</h4>
                            <p><strong>İsim:</strong> ${studentInfo.name || 'İsimsiz'} ${studentInfo.surname || ''}</p>
                            <p><strong>TC Kimlik No:</strong> ${studentInfo.tc_no || 'Belirtilmemiş'}</p>
                            <p><strong>Oda Numarası:</strong> ${studentInfo.room_no || 'Belirtilmemiş'}</p>
                        </div>
                        <div class="complaint-details">
                            <h4>Talep Detayları</h4>
                            <p><strong>Talep Türü:</strong> ${getTypeText(complaint.type)}</p>
                            <p><strong>Kategori:</strong> ${getCategoryText(complaint.category)}</p>
                            <p><strong>Açıklama:</strong> ${complaint.description || 'Açıklama yok'}</p>
                        </div>
                        ${imageHtml}
                    </div>
                    <div class="complaint-meta">
                        <span><i class="fas fa-calendar"></i> ${new Date(complaint.created_at).toLocaleString('tr-TR')}</span>
                        <span><i class="fas fa-tag"></i> ${complaint.category}</span>
                    </div>
                </div>
                <div class="complaint-actions">
                    <select onchange="updateStatus('${complaint.id}', this.value)" class="status-select">
                        <option value="bekleniyor" ${complaint.status === 'bekleniyor' ? 'selected' : ''}>Bekleniyor</option>
                        <option value="ilgileniliyor" ${complaint.status === 'ilgileniliyor' ? 'selected' : ''}>İlgileniliyor</option>
                        <option value="tamamlandı" ${complaint.status === 'tamamlandı' ? 'selected' : ''}>Tamamlandı</option>
                    </select>
                    <button onclick="deleteComplaint('${complaint.id}')" class="delete-btn">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                </div>
            `;
            complaintsList.appendChild(complaintElement);
        });
    } catch (error) {
        console.error('Talepler yüklenirken hata:', error);
        showNotification('Talepler yüklenirken bir hata oluştu', 'error');
    }
}

// Yurt istatistiklerini güncelleyen fonksiyon
function updateDormStats(complaints) {
    // Toplam talep
    const total = complaints.length;
    document.getElementById('total-complaints').textContent = total;
    // Durumlara göre sayılar
    const bekleniyor = complaints.filter(c => c.status === 'bekleniyor').length;
    const ilgileniliyor = complaints.filter(c => c.status === 'ilgileniliyor').length;
    const tamamlandi = complaints.filter(c => c.status === 'tamamlandı').length;
    document.getElementById('stat-bekleniyor').textContent = bekleniyor;
    document.getElementById('stat-ilgileniliyor').textContent = ilgileniliyor;
    document.getElementById('stat-tamamlandı').textContent = tamamlandi;
}

// Yardımcı fonksiyonlar
function getTypeText(type) {
    const types = {
        'şikayet': 'Şikayet',
        'arz': 'Arz'
    };
    return types[type] || type;
}

function getCategoryText(category) {
    const categories = {
        'su': 'Su',
        'elektrik': 'Elektrik',
        'temizlik': 'Temizlik',
        'guvenlik': 'Güvenlik',
        'diger': 'Diğer'
    };
    return categories[category] || category;
}

function getStatusText(status) {
    const statuses = {
        'bekleniyor': 'Bekleniyor',
        'ilgileniliyor': 'İlgileniliyor',
        'tamamlandı': 'Tamamlandı'
    };
    return statuses[status] || status;
}

// Filtreleme fonksiyonu
function filterComplaints() {
    // Aktif filtreleri vurgula
    highlightActiveFilters();
    
    // Talepleri yükle
    loadComplaints();
    
    // Bildirim göster
    const typeFilter = document.getElementById('typeFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filterCount = 0;
    if (typeFilter !== 'all') filterCount++;
    if (categoryFilter !== 'all') filterCount++;
    if (statusFilter !== 'all') filterCount++;
    
    if (filterCount > 0) {
        showNotification(`${filterCount} filtre uygulandı`, 'info');
    }
}

// Aktif filtreleri vurgulama
function highlightActiveFilters() {
    const filters = [
        { id: 'typeFilter', label: 'Talep Türü' },
        { id: 'categoryFilter', label: 'Kategori' },
        { id: 'statusFilter', label: 'Durum' }
    ];
    
    filters.forEach(filter => {
        const element = document.getElementById(filter.id);
        if (element.value !== 'all') {
            element.classList.add('active-filter');
        } else {
            element.classList.remove('active-filter');
        }
    });
}

// Filtreleme butonuna event listener ekle
document.getElementById('filter-btn').addEventListener('click', filterComplaints);

// Yönetici Paneli Göster
function showAdminPanel() {
    console.log('Admin paneli gösteriliyor');
    if (adminAuthContainer && adminPanel) {
        adminAuthContainer.style.display = 'none';
        adminPanel.style.display = 'block';
    } else {
        console.error('Admin paneli elementleri bulunamadı');
    }
}

// Çıkış Yap
adminLogoutBtn.addEventListener('click', () => {
    console.log('Çıkış yapılıyor');
    localStorage.removeItem('admin');
    if (adminAuthContainer && adminPanel) {
        adminAuthContainer.style.display = 'flex';
        adminPanel.style.display = 'none';
        // Form alanlarını temizle
        document.getElementById('admin-username').value = '';
        document.getElementById('admin-password').value = '';
    }
});

// Sayfa yüklendiğinde talepleri yükle
document.addEventListener('DOMContentLoaded', () => {
    // Admin girişi kontrolü
    const admin = localStorage.getItem('admin');
    if (admin) {
        showAdminPanel();
        loadComplaints();
    }
});

// Talep durumunu güncelleme fonksiyonu
async function updateStatus(complaintId, newStatus) {
    try {
        // Durum kontrolü
        if (!['bekleniyor', 'ilgileniliyor', 'tamamlandı'].includes(newStatus)) {
            showNotification('Geçersiz durum değeri', 'error');
            return;
        }

        const { error } = await supabaseClient
            .from('complaints')
            .update({ status: newStatus })
            .eq('id', complaintId);

        if (error) throw error;

        showNotification('Talep durumu başarıyla güncellendi', 'success');
        loadComplaints();
    } catch (error) {
        console.error('Durum güncellenirken hata:', error);
        showNotification('Durum güncellenirken bir hata oluştu', 'error');
    }
}

// Talep silme fonksiyonu
async function deleteComplaint(id) {
    if (!confirm('Bu talebi silmek istediğinizden emin misiniz?')) {
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('complaints')
            .delete()
            .eq('id', id);

        if (error) throw error;

        showNotification('Talep başarıyla silindi', 'success');
        loadComplaints(); // Listeyi yenile
    } catch (error) {
        console.error('Talep silme hatası:', error);
        showNotification('Talep silinirken bir hata oluştu', 'error');
    }
}

// Fotoğrafı yeni sekmede açma fonksiyonu
function openImageInNewTab(imageUrl) {
    if (imageUrl) {
        window.open(imageUrl, '_blank');
    }
}

// CSS ekleyelim
const style = document.createElement('style');
style.textContent = `
    .complaint-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
        overflow: hidden;
    }

    .complaint-header {
        padding: 15px 20px;
        border-bottom: 1px solid #eee;
        background: #f8f9fa;
    }

    .complaint-header h3 {
        margin: 0 0 10px 0;
        color: #1e3c72;
        font-size: 1.2rem;
    }

    .complaint-badges {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    .complaint-badges span {
        padding: 5px 12px;
        border-radius: 15px;
        font-size: 0.85rem;
        font-weight: 500;
    }

    .complaint-type {
        background: #e3f2fd;
        color: #1976d2;
    }

    .complaint-category {
        background: #f3e5f5;
        color: #7b1fa2;
    }

    .complaint-status {
        background: #fff3e0;
        color: #e65100;
    }

    .complaint-status.bekleniyor {
        background: #fff3cd;
        color: #856404;
    }

    .complaint-status.ilgileniliyor {
        background: #cce5ff;
        color: #004085;
    }

    .complaint-status.tamamlandı {
        background: #d4edda;
        color: #155724;
    }

    .complaint-body {
        padding: 20px;
    }

    .complaint-content {
        margin-bottom: 20px;
    }

    .complaint-user-info,
    .complaint-details {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
    }

    .complaint-user-info h4,
    .complaint-details h4 {
        margin: 0 0 10px 0;
        color:rgb(255, 255, 255);
        font-size: 1rem;
    }

    .complaint-content p {
        margin: 5px 0;
        line-height: 1.6;
        color: #333;
    }

    .complaint-image {
        margin: 15px 0;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        border: 1px solid #eee;
    }

    .complaint-image img {
        width: 100%;
        max-height: 300px;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .complaint-image img:hover {
        transform: scale(1.02);
    }

    .complaint-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #eee;
        font-size: 0.9rem;
        color: #666;
    }

    .complaint-actions {
        padding: 15px 20px;
        background:rgb(88, 100, 113);
        border-top: 1px solid #eee;
        display: flex;
        gap: 10px;
        justify-content: flex-end;
    }

    .status-select {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        background: white;
        color: #333;
        font-size: 0.9rem;
    }

    .delete-btn {
        padding: 8px 16px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.2s;
    }

    .delete-btn:hover {
        background: #c82333;
    }

    .no-complaints {
        text-align: center;
        padding: 40px;
        color: #666;
        font-size: 1.1rem;
    }

    .active-filter {
        border-color: #1e3c72 !important;
        background-color: #f0f4ff !important;
        font-weight: 500;
    }
`;
document.head.appendChild(style);

// Bildirim gösterme fonksiyonu
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // 3 saniye sonra bildirimi kaldır
    setTimeout(() => {
        notification.remove();
    }, 3000);
} 