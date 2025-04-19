import express from 'express';
import { getDonHang, getDonHangById, createDonHang, updateDonHang, deleteDonHang } from '../controllers/donhang.js';

const router = express.Router();

// GET /api/donhang?page=1&size=10&maKH=KH001&ngayDat=2025-04-01
router.get('/', getDonHang);

// GET /api/donhang/:maDH
router.get('/:maDH', getDonHangById);

// POST /api/donhang
router.post('/', createDonHang);

// PUT /api/donhang/:maDH
router.put('/:maDH', updateDonHang);

// DELETE /api/donhang/:maDH
router.delete('/:maDH', deleteDonHang);

export default router;