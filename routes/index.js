import express from 'express';
import nhanvienRoutes from './nhanvien.js';
import khachhangRoutes from './khachhang.js';
import sanphamRoutes from './sanpham.js';
import donhangRoutes from './donhang.js';
import danhgiaRoutes from './danhgia.js';
import khohangRoutes from './khohang.js';
import danhmucRoutes from './danhmuc.js';
import thanhtoanRoutes from './thanhtoan.js';
import nhapkhoRoutes from './nhapkho.js';
import xuatkhoRoutes from './xuatkho.js';
import bienbanxuatkhoRoutes from './bienbanxuatkho.js';
import taikhoanRoutes from './taikhoan.js';
import khuyenmaiRoutes from './khuyenmai.js';
import cuahangRoutes from './cuahang.js';
import bangluongRoutes from './bangluong.js';

const router = express.Router();

router.use('/nhanvien', nhanvienRoutes);
router.use('/khachhang', khachhangRoutes);
router.use('/sanpham', sanphamRoutes);
router.use('/donhang', donhangRoutes);
router.use('/danhgia', danhgiaRoutes);
router.use('/khohang', khohangRoutes);
router.use('/danhmuc', danhmucRoutes);
router.use('/thanhtoan', thanhtoanRoutes);
router.use('/nhapkho', nhapkhoRoutes);
router.use('/xuatkho', xuatkhoRoutes);
router.use('/bienbanxuatkho', bienbanxuatkhoRoutes);
router.use('/taikhoan', taikhoanRoutes);
router.use('/khuyenmai', khuyenmaiRoutes);
router.use('/cuahang', cuahangRoutes);
router.use('/bangluong', bangluongRoutes);

export default router;