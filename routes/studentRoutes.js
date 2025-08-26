const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

// Öğrenci Kayıt
router.post('/register', async (req, res) => {
    try {
        const { tcNo, studentNo, name, surname, roomNo, password } = req.body;

        // Gerekli alanların kontrolü
        if (!tcNo || !studentNo || !name || !surname || !roomNo || !password) {
            return res.status(400).json({ message: 'Tüm alanları doldurunuz' });
        }

        // TC Kimlik No kontrolü
        if (tcNo.length !== 11 || !/^\d+$/.test(tcNo)) {
            return res.status(400).json({ message: 'Geçersiz TC Kimlik numarası' });
        }

        // Öğrenci zaten var mı kontrol et
        const { data: existingStudent, error: checkError } = await supabase
            .from('students')
            .select('*')
            .or(`tcNo.eq.${tcNo},studentNo.eq.${studentNo}`)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }

        if (existingStudent) {
            if (existingStudent.tcNo === tcNo) {
                return res.status(400).json({ message: 'Bu TC Kimlik numarası zaten kayıtlı' });
            }
            if (existingStudent.studentNo === studentNo) {
                return res.status(400).json({ message: 'Bu öğrenci numarası zaten kayıtlı' });
            }
        }

        // Şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Yeni öğrenci oluştur
        const { data: student, error: insertError } = await supabase
            .from('students')
            .insert([
                {
                    tcNo,
                    studentNo,
                    name,
                    surname,
                    roomNo,
                    password: hashedPassword
                }
            ])
            .select()
            .single();

        if (insertError) throw insertError;

        // JWT token oluştur
        const token = jwt.sign(
            { id: student.id },
            process.env.JWT_SECRET || 'gizli-anahtar',
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'Öğrenci başarıyla kaydedildi',
            token,
            student: {
                id: student.id,
                name: student.name,
                surname: student.surname,
                roomNo: student.roomNo
            }
        });
    } catch (error) {
        console.error('Kayıt hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Öğrenci Girişi
router.post('/login', async (req, res) => {
    try {
        const { tcNo, studentNo, password } = req.body;

        // Gerekli alanların kontrolü
        if (!tcNo || !studentNo || !password) {
            return res.status(400).json({ message: 'Tüm alanları doldurunuz' });
        }

        // Öğrenciyi bul
        const { data: student, error: findError } = await supabase
            .from('students')
            .select('*')
            .eq('tc_no', tcNo)
            .eq('student_no', studentNo)
            .single();

        if (findError) {
            console.error('Öğrenci bulma hatası:', findError);
            return res.status(400).json({ message: 'Giriş bilgileri hatalı' });
        }

        if (!student) {
            return res.status(400).json({ message: 'Giriş bilgileri hatalı' });
        }

        // Şifreyi kontrol et
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Giriş bilgileri hatalı' });
        }

        // JWT token oluştur
        const token = jwt.sign(
            { id: student.id },
            process.env.JWT_SECRET || 'gizli-anahtar',
            { expiresIn: '1h' }
        );

        res.json({
            token,
            student: {
                id: student.id,
                name: student.name,
                surname: student.surname,
                room_no: student.room_no
            }
        });
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

module.exports = router; 