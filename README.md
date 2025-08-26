<div align="center">
  <img src="images/logo.png" alt="Proje Logosu" width="150" />
  <h1>Yurt Destek Sistemi</h1>
  <p>Öğrenciler için şikayet ve arz bildirimi, yöneticiler için ise tüm talepleri yönetme paneli.</p>
  
  [![GitHub Yıldızı](https://img.shields.io/github/stars/mustafaonler/YurtDestekSistemi?style=social)](https://github.com/KULLANICI_ADINIZ/YurtDestekSistemi/stargazers)
  [![Lisans](https://img.shields.io/github/license/KULLANICI_ADINIZ/YurtDestekSistemi)](https://github.com/KULLANICI_ADINIZ/YurtDestekSistemi/blob/main/LICENSE)
</div>

---

## ✨ Proje Hakkında

Bu proje, öğrencilerin yurt yönetimine kolayca şikayet ve arz bildirimleri oluşturmasını, yöneticilerin ise bu talepleri tek bir panelden etkin bir şekilde yönetmesini sağlayan kapsamlı bir web uygulamasıdır. Sistem, şikayetlerin durum takibini kolaylaştırırken, duyurular aracılığıyla iletişimi güçlendirmeyi amaçlar.

---

## 📸 Uygulama Ekran Görüntüleri

Uygulamanın arayüzünü daha iyi anlamanız için bazı ekran görüntülerini aşağıda bulabilirsiniz.

### 🏡 Anasayfa & Giriş Ekranları
Uygulamanın ana sayfası ve öğrenci/admin giriş modülleri.
![Anasayfa](images/anasayfa.png)

### 🧑‍🎓 Öğrenci Paneli
Öğrencilerin kendi taleplerini oluşturduğu ve görüntülediği ekran.
![Öğrenci Paneli](images/ogrenci_paneli.png)

### 👨‍💼 Admin Paneli: Talepleri Yönetme
Yöneticilerin tüm talepleri filtreleyip yönettiği ana kontrol paneli.
![Admin Paneli](images/admin_paneli.png)

### 📢 Duyuru Yönetimi
Admin panelinde duyuru ekleme ve silme işlemleri.
![Duyuru Yönetimi](images/duyuru_yonetimi.png)

### 🗳️ Kamu Arzları & Oylama
Public arzların oylama sonuçlarının görselleştirilmesi.
![Kamu Arzları Oylama](images/kamu_arzları.png)

### ✅ Durum Güncelleme
Admin panelinde bir talebin durumunu güncelleme.
![Durum Güncelleme](images/durum_guncelleme.png)

---

## 🛠️ Teknoloji Yığını

Proje, modern ve hafif bir teknoloji yığını ile geliştirilmiştir.

**Frontend:** HTML5, CSS3, JavaScript, [Supabase JS v2](https://supabase.com/docs/guides/client)
**Backend:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) (statik dosya sunumu için)
**Veritabanı:** [Supabase](https://supabase.com/): PostgreSQL veritabanı ve API hizmetleri

---

## 🚀 Projeyi Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### Ön Koşullar
- [Node.js](https://nodejs.org/en/download/) (v14 veya üzeri)
- [Supabase Projesi](https://supabase.com/)
- Vercel CLI (İsteğe bağlı, yerel sunucu için)

### Adım Adım Kurulum
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

4.  Projeyi başlatın:
    ```bash
    npm start
    ```
5.  Tarayıcınızda `http://localhost:3000` adresine giderek uygulamaya erişebilirsiniz.

---

## 🤝 Katkıda Bulunma

Projenin gelişimine katkıda bulunmak için pull request'lerinizi memnuniyetle kabul ederiz. Lütfen katkıda bulunmadan önce var olan sorunları ve özellikleri kontrol edin.

---

## 📜 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına göz atın.
