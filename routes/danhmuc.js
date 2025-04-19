import express from 'express';
import { getDanhMuc, getDanhMucById, createDanhMuc, updateDanhMuc, deleteDanhMuc } from '../controllers/danhmuc.js';

const router = express.Router();

// GET /api/danhmuc?page=1&size=10
router.get('/', getDanhMuc);

// GET /api/danhmuc/:maDM
router.get('/:maDM', getDanhMucById);

// POST /api/danhmuc
router.post('/', createDanhMuc);

// PUT /api/danhmuc/:maDM
router.put('/:maDM', updateDanhMuc);

// DELETE /api/danhmuc/:maDM
router.delete('/:maDM', deleteDanhMuc);

export default router;