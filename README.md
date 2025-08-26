<div align="center">
  <img src="images/logo.png" alt="Proje Logosu" width="150" />
  <h1>Yurt Destek Sistemi</h1>
  <p>Öğrenciler için şikayet ve arz bildirimi, yöneticiler için ise tüm talepleri yönetme paneli.</p>
  
  [![GitHub Yıldızı](https://img.shields.io/github/stars/mustafaonler/YurtDestekSistemi?style=social)](https://github.com/mustafaonler/YurtDestekSistemi/stargazers)
  [![Lisans](https://img.shields.io/github/license/mustafaonler/YurtDestekSistemi)](https://github.com/mustafaonler/YurtDestekSistemi/blob/main/LICENSE)
</div>

<div align="center">
  <h3>🚀 Canlı Demo</h3>
  <a href="https://yurt-destek-sistemi.vercel.app/" target="_blank">
    <h4>yurt-destek-sistemi.vercel.app</h4>
  </a>
</div>

---

## ✨ Proje Hakkında

Bu proje, öğrencilerin yurt yönetimine kolayca şikayet ve arz bildirimleri oluşturmasını, yöneticilerin ise bu talepleri tek bir panelden etkin bir şekilde yönetmesini sağlayan kapsamlı bir web uygulamasıdır. Sistem, şikayetlerin durum takibini kolaylaştırırken, duyurular aracılığıyla iletişimi güçlendirmeyi amaçlar.

---

## 📸 Uygulama Ekran Görüntüleri

Uygulamanın arayüzünü daha iyi anlamanız için bazı ekran görüntülerini aşağıda bulabilirsiniz.

### 🏡 Anasayfa & Giriş Ekranları
Uygulamanın ana sayfası ve öğrenci/admin giriş modülleri.
<div align="center">
  <img src="https://github.com/user-attachments/assets/b75ef824-2c41-44e5-85d8-ebf2c69dfee1" alt="Anasayfa ve Giriş" width="800">
</div>

### 🧑‍🎓 Öğrenci Paneli
Öğrencilerin kendi taleplerini oluşturduğu ve görüntülediği ekran.
<div align="center">
  <img src="https://github.com/user-attachments/assets/0dbdd701-9027-4e6b-a96d-b8703a55f091" alt="Öğrenci Paneli" width="800">
</div>

### 👨‍💼 Admin Paneli: Talepleri Yönetme
Yöneticilerin tüm talepleri filtreleyip yönettiği ana kontrol paneli.
<div align="center">
  <img src="https://github.com/user-attachments/assets/549634fe-e9e3-4bc4-8972-313433e2535c" alt="Admin Paneli" width="800">
</div>

### 📢 Duyuru Yönetimi
Admin panelinde duyuru ekleme ve silme işlemleri.
<div align="center">
  <img src="https://github.com/user-attachments/assets/8fc646e4-13e5-4805-bcae-78a41eaf74e6" alt="Duyuru Yönetimi" width="800">
</div>

### 🗳️ Kamu Arzları & Oylama
Public arzların oylama sonuçlarının görselleştirilmesi.
<div align="center">
  <img src="https://github.com/user-attachments/assets/45ce31b7-3f53-4b3b-95ec-0ba73b662f9c" alt="Kamu Arzları" width="800">
</div>

### ✅ Durum Güncelleme
Admin panelinde bir talebin durumunu güncelleme.
<div align="center">
  <img src="https://github.com/user-attachments/assets/10d0978b-5df5-48cd-b72b-16a8c12c9383" alt="Durum Güncelleme" width="800">
</div>

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
    git clone [https://github.com/mustafaonler/YurtDestekSistemi.git](https://github.com/mustafaonler/YurtDestekSistemi.git)
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
