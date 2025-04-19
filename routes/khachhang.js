import express from 'express';
import { getKhachHang, getKhachHangById, createKhachHang, updateKhachHang, deleteKhachHang } from '../controllers/khachhang.js';

const router = express.Router();

// GET /api/khachhang?page=1&size=10&loaiKH=VIP&search=Nguyen
router.get('/', getKhachHang);

// GET /api/khachhang/:maKH
router.get('/:maKH', getKhachHangById);

// POST /api/khachhang
router.post('/', createKhachHang);

// PUT /api/khachhang/:maKH
router.put('/:maKH', updateKhachHang);

// DELETE /api/khachhang/:maKH
router.delete('/:maKH', deleteKhachHang);

export default router;