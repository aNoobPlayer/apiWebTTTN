import express from 'express';
import { getSanPham, getSanPhamById, createSanPham, updateSanPham, deleteSanPham, getDanhGiaBySanPham } from '../controllers/sanpham.js';

const router = express.Router();

// GET /api/sanpham?page=1&size=10&maDM=DM001&search=SanPham
router.get('/', getSanPham);

// GET /api/sanpham/:maSP
router.get('/:maSP', getSanPhamById);

// GET /api/sanpham/:maSP/danhgia?page=1&size=10
router.get('/:maSP/danhgia', getDanhGiaBySanPham);

// POST /api/sanpham
router.post('/', createSanPham);

// PUT /api/sanpham/:maSP
router.put('/:maSP', updateSanPham);

// DELETE /api/sanpham/:maSP
router.delete('/:maSP', deleteSanPham);

export default router;