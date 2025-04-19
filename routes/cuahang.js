import express from 'express';
import { getCuaHang, getCuaHangById, createCuaHang, updateCuaHang, deleteCuaHang } from '../controllers/cuahang.js';

const router = express.Router();

// GET /api/cuahang?page=1&size=10&quyMo=Lớn
router.get('/', getCuaHang);

// GET /api/cuahang/:maCH
router.get('/:maCH', getCuaHangById);

// POST /api/cuahang
router.post('/', createCuaHang);

// PUT /api/cuahang/:maCH
router.put('/:maCH', updateCuaHang);

// DELETE /api/cuahang/:maCH
router.delete('/:maCH', deleteCuaHang);

export default router;