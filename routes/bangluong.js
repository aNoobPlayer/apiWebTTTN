import express from 'express';
import { getBangLuong, getBangLuongById, createBangLuong, updateBangLuong, deleteBangLuong } from '../controllers/bangluong.js';

const router = express.Router();

// GET /api/bangluong?page=1&size=10&thang=4&nam=2025
router.get('/', getBangLuong);

// GET /api/bangluong/:maBL
router.get('/:maBL', getBangLuongById);

// POST /api/bangluong
router.post('/', createBangLuong);

// PUT /api/bangluong/:maBL
router.put('/:maBL', updateBangLuong);

// DELETE /api/bangluong/:maBL
router.delete('/:maBL', deleteBangLuong);

export default router;