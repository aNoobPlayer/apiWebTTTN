import express from 'express';
import { getTaiKhoan, getTaiKhoanById, createTaiKhoan, updateTaiKhoan, deleteTaiKhoan } from '../controllers/taikhoan.js';

const router = express.Router();

// GET /api/taikhoan?page=1&size=10&trinhTrang=ACTIVE&search=tenTK
router.get('/', getTaiKhoan);

// GET /api/taikhoan/:maTK
router.get('/:maTK', getTaiKhoanById);

// POST /api/taikhoan
router.post('/', createTaiKhoan);

// PUT /api/taikhoan/:maTK
router.put('/:maTK', updateTaiKhoan);

// DELETE /api/taikhoan/:maTK
router.delete('/:maTK', deleteTaiKhoan);

export default router;