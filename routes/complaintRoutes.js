const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');

// Yeni şikayet/arz talebi oluştur
router.post('/', auth, async (req, res) => {
    try {
        const { type, category, description, image } = req.body;
        
        // Tip kontrolü
        if (!['şikayet', 'arz'].includes(type)) {
            return res.status(400).json({ message: 'Geçersiz talep tipi' });
        }

        const { data: complaint, error: insertError } = await supabase
            .from('complaints')
            .insert([
                {
                    student_id: req.user.id,
                    type,
                    category,
                    description,
                    image,
                    status: 'bekleniyor'
                }
            ])
            .select()
            .single();

        if (insertError) throw insertError;
        res.status(201).json({ 
            message: 'Talebiniz başarıyla oluşturuldu',
            complaint 
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Öğrencinin tüm taleplerini getir
router.get('/student/:studentId', auth, async (req, res) => {
    try {
        const { data: complaints, error: findError } = await supabase
            .from('complaints')
            .select('*')
            .eq('student_id', req.params.studentId)
            .order('created_at', { ascending: false });

        if (findError) throw findError;
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Tüm talepleri getir (yönetici için)
router.get('/', auth, async (req, res) => {
    try {
        const { type, category, status } = req.query;
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

        // Tip filtresi
        if (type && ['şikayet', 'arz'].includes(type)) {
            query = query.eq('type', type);
        }

        // Kategori filtresi
        if (category) {
            query = query.eq('category', category);
        }

        // Durum filtresi
        if (status && ['bekleniyor', 'ilgileniliyor', 'tamamlandı'].includes(status)) {
            query = query.eq('status', status);
        }

        const { data: complaints, error: findError } = await query;

        if (findError) throw findError;
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// Talep durumunu güncelle
router.put('/:id', auth, async (req, res) => {
    try {
        const { status, adminResponse } = req.body;
        
        // Durum kontrolü
        if (!['bekleniyor', 'ilgileniliyor', 'tamamlandı'].includes(status)) {
            return res.status(400).json({ message: 'Geçersiz durum' });
        }

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

        res.json({ 
            message: 'Talep durumu başarıyla güncellendi',
            complaint 
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

module.exports = router; 