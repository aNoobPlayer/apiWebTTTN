import express from 'express';
import { getNhapKho, getNhapKhoById, createNhapKho, updateNhapKho, deleteNhapKho } from '../controllers/nhapkho.js';

const router = express.Router();

// GET /api/nhapkho?page=1&size=10&ngayNK=2025-03-25
router.get('/', getNhapKho);

// GET /api/nhapkho/:maNK
router.get('/:maNK', getNhapKhoById);

// POST /api/nhapkho
router.post('/', createNhapKho);

// PUT /api/nhapkho/:maNK
router.put('/:maNK', updateNhapKho);

// DELETE /api/nhapkho/:maNK
router.delete('/:maNK', deleteNhapKho);

export default router;