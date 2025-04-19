import express from 'express';
import { getThanhToan, getThanhToanById, createThanhToan, updateThanhToan, deleteThanhToan } from '../controllers/thanhtoan.js';

const router = express.Router();

// GET /api/thanhtoan?page=1&size=10&maDH=DH001&trangThai=COMPLETED
router.get('/', getThanhToan);

// GET /api/thanhtoan/:maTT
router.get('/:maTT', getThanhToanById);

// POST /api/thanhtoan
router.post('/', createThanhToan);

// PUT /api/thanhtoan/:maTT
router.put('/:maTT', updateThanhToan);

// DELETE /api/thanhtoan/:maTT
router.delete('/:maTT', deleteThanhToan);

export default router;