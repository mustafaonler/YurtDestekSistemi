# Yurt Destek Sistemi

Bu proje, öğrencilerin yurt yönetimine kolayca şikayet ve arz bildirimleri oluşturmasını, yöneticilerin ise bu talepleri tek bir panelden etkin bir şekilde yönetmesini sağlayan kapsamlı bir web uygulamasıdır. Sistem, şikayetlerin durum takibini kolaylaştırırken, duyurular aracılığıyla iletişimi güçlendirmeyi amaçlar.

---

## 📸 Uygulama Ekran Görüntüleri

Uygulamanın arayüzünü daha iyi anlamanız için bazı ekran görüntülerini aşağıda bulabilirsiniz.

### Anasayfa ve Giriş Ekranları
Uygulamanın ana sayfası ve öğrenci/admin giriş modülleri.
![Anasayfa](images/anasayfa.png)

### Öğrenci Paneli
Öğrencilerin kendi taleplerini oluşturduğu ve görüntülediği ekran.
![Öğrenci Paneli](images/ogrenci_paneli.png)

### Admin Paneli: Talepleri Yönetme
Yöneticilerin tüm talepleri filtreleyip yönettiği ana kontrol paneli.
![Admin Paneli](images/admin_paneli.png)

### Duyuru Yönetimi
Admin panelinde duyuru ekleme ve silme işlemleri.
![Duyuru Yönetimi](images/duyuru_yonetimi.png)

### Kamu Arzları ve Oylama
Public arzların oylama sonuçlarının görselleştirilmesi.
![Kamu Arzları Oylama](images/kamu_arzları.png)

### Durum Güncelleme
Admin panelinde bir talebin durumunu güncelleme.
![Durum Güncelleme](images/durum_guncelleme.gesi)

---

## 🎯 Temel Özellikler

### Öğrenci İşlemleri
- **Kayıt ve Giriş:** TC, öğrenci numarası ve şifre ile güvenli kayıt ve giriş.
- **Talep Oluşturma:** Açıklama, kategori ve tür belirterek (şikayet/arz) talep oluşturma. İsteğe bağlı görsel yükleme imkanı.
- **Talepleri Görüntüleme:** Oluşturulan tüm talepleri tarih sırasına göre listeleme ve durum takibi.

### Yönetici (Admin) Paneli
- **Giriş:** Yetkili kullanıcılar için güvenli giriş paneli.
- **Talepleri Yönetme:** Tüm öğrenci taleplerini tür (şikayet/arz), kategori ve durum bazlı filtreleme.
- **Durum Güncelleme:** Taleplerin durumunu (**bekleniyor**, **ilgileniliyor**, **tamamlandı**) kolayca güncelleme.
- **Talep Silme:** Gereksiz veya hatalı talepleri sistemden kaldırma.
- **Duyuru Yönetimi:** Yeni duyurular ekleme, mevcut duyuruları listeleme ve silme.

### Ortak Özellikler
- **Public/Private Arzlar:** Public arzlar için oylama sonuçlarının görselleştirilmesi, private arzların gizli tutulması.
- **Modern Arayüz:** Kullanıcı dostu ve modern arayüz bileşenleri ile zenginleştirilmiş tasarım.
- **Anasayfa:** Kullanıcıları öğrenci ve admin giriş sayfalarına yönlendiren temiz ve bilgilendirici bir ana sayfa.

---

## ⚙️ Teknoloji Yığını

Proje, modern ve hafif bir teknoloji yığını ile geliştirilmiştir.

- **Frontend:**
  - HTML5, CSS3, JavaScript
  - [Supabase JS v2](https://supabase.com/docs/guides/client)
- **Backend:**
  - [Node.js](https://nodejs.org/) ve [Express.js](https://expressjs.com/) (statik dosya sunumu için)
- **Veritabanı:**
  - [Supabase](https://supabase.com/): PostgreSQL veritabanı ve API hizmetleri

---

## 📂 Veritabanı Şeması

Proje verileri, Supabase'deki aşağıdaki tablolarda organize edilmiştir:

| Tablo Adı      | Açıklama                                       |
|----------------|------------------------------------------------|
| `students`     | Öğrenci kayıt bilgileri                        |
| `admins`       | Yönetici kullanıcı bilgileri                   |
| `complaints`   | Öğrenciler tarafından oluşturulan talepler     |
| `announcements`| Yöneticiler tarafından yayınlanan duyurular    |
| `votes`        | Public arzlar için oylama verileri             |

> **Güvenlik Notu:** Veritabanı güvenliği için **Row Level Security (RLS)** kuralları uygulanmalıdır. Aksi takdirde, Supabase `anon` anahtarı ile verilere herkes erişebilir.

---

## 🚀 Projeyi Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### Ön Koşullar

- [Node.js](https://nodejs.org/en/download/) (v14 veya üzeri)
- [Supabase Projesi](https://supabase.com/)
- Vercel CLI (İsteğe bağlı, yerel sunucu için)

### Kurulum Adımları

1.  Bu depoyu klonlayın:
    ```bash
    git clone [https://github.com/KULLANICI_ADINIZ/YurtDestekSistemi.git](https://github.com/KULLANICI_ADINIZ/YurtDestekSistemi.git)
    cd YurtDestekSistemi
    ```

2.  Gerekli bağımlılıkları yükleyin:
    ```bash
    npm install
    ```

3.  Bir `.env` dosyası oluşturun ve Supabase kimlik bilgilerinizi ekleyin:
    ```env
    VITE_SUPABASE_URL="SUPABASE_PROJE_URL'NİZ"
    VITE_SUPABASE_ANON_KEY="SUPABASE_ANON_KEY'İNİZ"
    ```
    (Not: Değişken adları projenizdeki isimlendirmeye göre değişebilir.)

4.  Projeyi başlatın:
    ```bash
    npm start
    ```
    Bu komut, statik dosyalarınızı servis etmek için bir Node.js sunucusu başlatacaktır.

5.  Tarayıcınızda `http://localhost:3000` adresine giderek uygulamaya erişebilirsiniz.

---

## 🤝 Katkıda Bulunma

Projenin gelişimine katkıda bulunmak için pull request'lerinizi memnuniyetle kabul ederiz. Lütfen katkıda bulunmadan önce var olan sorunları ve özellikleri kontrol edin.

---

## 📄 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına göz atın.
