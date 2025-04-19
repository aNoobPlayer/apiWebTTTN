import express from 'express';
import { getXuatKho, getXuatKhoById, createXuatKho, updateXuatKho, deleteXuatKho } from '../controllers/xuatkho.js';

const router = express.Router();

// GET /api/xuatkho?page=1&size=10&ngayXuat=2025-04-01
router.get('/', getXuatKho);

// GET /api/xuatkho/:maXK
router.get('/:maXK', getXuatKhoById);

// POST /api/xuatkho
router.post('/', createXuatKho);

// PUT /api/xuatkho/:maXK
router.put('/:maXK', updateXuatKho);

// DELETE /api/xuatkho/:maXK
router.delete('/:maXK', deleteXuatKho);

export default router;