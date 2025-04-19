import express from 'express';
import { getBienBanXuatKho, getBienBanXuatKhoById, createBienBanXuatKho, updateBienBanXuatKho, deleteBienBanXuatKho } from '../controllers/bienbanxuatkho.js';

const router = express.Router();

// GET /api/bienbanxuatkho?page=1&size=10&trinhTrang=APPROVED
router.get('/', getBienBanXuatKho);

// GET /api/bienbanxuatkho/:maBB
router.get('/:maBB', getBienBanXuatKhoById);

// POST /api/bienbanxuatkho
router.post('/', createBienBanXuatKho);

// PUT /api/bienbanxuatkho/:maBB
router.put('/:maBB', updateBienBanXuatKho);

// DELETE /api/bienbanxuatkho/:maBB
router.delete('/:maBB', deleteBienBanXuatKho);

export default router;