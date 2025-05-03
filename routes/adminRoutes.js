const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');

// Yönetici Girişi
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Yöneticiyi bul
        const { data: admin, error: findError } = await supabase
            .from('admins')
            .select('*')
            .eq('username', username)
            .single();

        if (findError) throw findError;

        if (!admin) {
            return res.status(400).json({ message: 'Geçersiz kullanıcı adı' });
        }

        // Şifreyi kontrol et
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Geçersiz şifre' });
        }

        // JWT token oluştur
        const token = jwt.sign(
            { id: admin.id },
            process.env.JWT_SECRET || 'gizli-anahtar',
            { expiresIn: '1h' }
        );

        res.json({
            token,
            admin: {
                id: admin.id,
                name: admin.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Tüm talepleri getir
router.get('/complaints', auth, async (req, res) => {
    try {
        const { category, status } = req.query;
        let query = supabase
            .from('complaints')
            .select(`
                *,
                student:students (
                    name,
                    surname,
                    roomNo,
                    tcNo
                )
            `)
            .order('created_at', { ascending: false });

        if (category) query = query.eq('category', category);
        if (status) query = query.eq('status', status);

        const { data: complaints, error: findError } = await query;

        if (findError) throw findError;
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Talep durumunu güncelle
router.put('/complaints/:id', auth, async (req, res) => {
    try {
        const { status, adminResponse } = req.body;
        
        const { data: complaint, error: updateError } = await supabase
            .from('complaints')
            .update({ status, adminResponse })
            .eq('id', req.params.id)
            .select(`
                *,
                student:students (
                    name,
                    surname,
                    roomNo,
                    tcNo
                )
            `)
            .single();

        if (updateError) throw updateError;

        if (!complaint) {
            return res.status(404).json({ message: 'Talep bulunamadı' });
        }

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

module.exports = router; 