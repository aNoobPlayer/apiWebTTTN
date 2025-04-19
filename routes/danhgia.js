import express from 'express';
import { getDanhGia, getDanhGiaById, createDanhGia, updateDanhGia, deleteDanhGia } from '../controllers/danhgia.js';

const router = express.Router();

// GET /api/danhgia?page=1&size=10&maKH=KH001&maSP=SP001
router.get('/', getDanhGia);

// GET /api/danhgia/:maDG
router.get('/:maDG', getDanhGiaById);

// POST /api/danhgia
router.post('/', createDanhGia);

// PUT /api/danhgia/:maDG
router.put('/:maDG', updateDanhGia);

// DELETE /api/danhgia/:maDG
router.delete('/:maDG', deleteDanhGia);

export default router;