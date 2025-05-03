const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
require('dotenv').config();

async function createAdmin() {
    try {
        // MongoDB bağlantısı
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yurt-destek', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Yönetici bilgileri
        const adminData = {
            username: 'admin',
            password: 'admin123',
            name: 'Yönetici'
        };

        // Şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        adminData.password = await bcrypt.hash(adminData.password, salt);

        // Yöneticiyi oluştur
        const admin = new Admin(adminData);
        await admin.save();

        console.log('Yönetici hesabı başarıyla oluşturuldu:');
        console.log('Kullanıcı adı: admin');
        console.log('Şifre: admin123');

        process.exit();
    } catch (error) {
        console.error('Hata:', error);
        process.exit(1);
    }
}

createAdmin(); 