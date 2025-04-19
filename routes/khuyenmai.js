import express from 'express';
import { getKhuyenMai, getKhuyenMaiById, createKhuyenMai, updateKhuyenMai, deleteKhuyenMai } from '../controllers/khuyenmai.js';

const router = express.Router();

// GET /api/khuyenmai?page=1&size=10&loaiKM=GIAM_GIA&ngayBatDau=2025-04-01
router.get('/', getKhuyenMai);

// GET /api/khuyenmai/:maKM
router.get('/:maKM', getKhuyenMaiById);

// POST /api/khuyenmai
router.post('/', createKhuyenMai);

// PUT /api/khuyenmai/:maKM
router.put('/:maKM', updateKhuyenMai);

// DELETE /api/khuyenmai/:maKM
router.delete('/:maKM', deleteKhuyenMai);

export default router;