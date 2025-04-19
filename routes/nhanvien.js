import express from 'express';
import { getNhanVien, getNhanVienById, createNhanVien, updateNhanVien, deleteNhanVien } from '../controllers/nhanvien.js';

const router = express.Router();

// GET /api/nhanvien?page=1&size=10&trangThaiLamViec=DangLam&search=Nguyen
router.get('/', getNhanVien);

// GET /api/nhanvien/:maNV
router.get('/:maNV', getNhanVienById);

// POST /api/nhanvien
router.post('/', createNhanVien);

// PUT /api/nhanvien/:maNV
router.put('/:maNV', updateNhanVien);

// DELETE /api/nhanvien/:maNV
router.delete('/:maNV', deleteNhanVien);

export default router;