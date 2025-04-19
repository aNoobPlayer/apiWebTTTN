import express from 'express';
import { getKhoHang, getKhoHangById, createKhoHang, updateKhoHang, deleteKhoHang } from '../controllers/khohang.js';

const router = express.Router();

// GET /api/khohang?page=1&size=10
router.get('/', getKhoHang);

// GET /api/khohang/:maKH
router.get('/:maKH', getKhoHangById);

// POST /api/khohang
router.post('/', createKhoHang);

// PUT /api/khohang/:maKH
router.put('/:maKH', updateKhoHang);

// DELETE /api/khohang/:maKH
router.delete('/:maKH', deleteKhoHang);

export default router;