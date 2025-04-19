import pool from '../config/db.js';

export const getDanhGia = async (req, res) => {
  try {
    const { page = 1, size = 10, maKH, maSP } = req.query;
    const offset = (page - 1) * size;

    let query = 'SELECT * FROM DANHGIA WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM DANHGIA WHERE 1=1';
    const params = [];

    if (maKH) {
      query += ' AND MaKH = ?';
      countQuery += ' AND MaKH = ?';
      params.push(maKH);
    }

    if (maSP) {
      query += ' AND MaSP = ?';
      countQuery += ' AND MaSP = ?';
      params.push(maSP);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(size), parseInt(offset));

    const [rows] = await pool.query(query, params);
    const [[{ total }]] = await pool.query(countQuery, params.slice(0, params.length - 2));

    res.status(200).json({
      status: 'success',
      data: rows,
      total,
      page: parseInt(page),
      size: parseInt(size)
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch danhgia',
      errors: err.message
    });
  }
};

export const getDanhGiaById = async (req, res) => {
  try {
    const { maDG } = req.params;
    const [rows] = await pool.query('SELECT * FROM DANHGIA WHERE MaDG = ?', [maDG]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'DanhGia not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch danhgia',
      errors: err.message
    });
  }
};

export const createDanhGia = async (req, res) => {
  try {
    const { maDG, maKH, maSP, maDH, ngayDanhGia, noiDung, tieuDe, soSao, hinhAnh, phanHoiCuaHang } = req.body;

    if (!maDG || !maKH || !maSP || !maDH || !ngayDanhGia || !soSao) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    if (soSao < 1 || soSao > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'SoSao must be between 1 and 5'
      });
    }

    // Kiểm tra khóa ngoại
    const [khachHang] = await pool.query('SELECT MaKH FROM KHACHHANG WHERE MaKH = ?', [maKH]);
    const [sanPham] = await pool.query('SELECT MaSP FROM SANPHAM WHERE MaSP = ?', [maSP]);
    const [donHang] = await pool.query('SELECT MaDH FROM DONHANG WHERE MaDH = ?', [maDH]);

    if (khachHang.length === 0 || sanPham.length === 0 || donHang.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid foreign key'
      });
    }

    await pool.query(
      'INSERT INTO DANHGIA (MaDG, MaKH, MaSP, MaDH, NgayDanhGia, NoiDung, TieuDe, SoSao, HinhAnh, PhanHoiCuaHang) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [maDG, maKH, maSP, maDH, ngayDanhGia, noiDung, tieuDe, soSao, hinhAnh, phanHoiCuaHang]
    );

    res.status(201).json({
      status: 'success',
      data: { maDG, maKH, maSP, maDH, ngayDanhGia, noiDung, tieuDe, soSao, hinhAnh, phanHoiCuaHang }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create danhgia',
      errors: err.message
    });
  }
};

export const updateDanhGia = async (req, res) => {
  try {
    const { maDG } = req.params;
    const { noiDung, tieuDe, soSao, hinhAnh, phanHoiCuaHang } = req.body;

    if (soSao && (soSao < 1 || soSao > 5)) {
      return res.status(400).json({
        status: 'error',
        message: 'SoSao must be between 1 and 5'
      });
    }

    const [result] = await pool.query(
      'UPDATE DANHGIA SET NoiDung = ?, TieuDe = ?, SoSao = ?, HinhAnh = ?, PhanHoiCuaHang = ? WHERE MaDG = ?',
      [noiDung, tieuDe, soSao, hinhAnh, phanHoiCuaHang, maDG]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'DanhGia not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { maDG, noiDung, tieuDe, soSao, hinhAnh, phanHoiCuaHang }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update danhgia',
      errors: err.message
    });
  }
};

export const deleteDanhGia = async (req, res) => {
  try {
    const { maDG } = req.params;
    const [result] = await pool.query('DELETE FROM DANHGIA WHERE MaDG = ?', [maDG]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'DanhGia not found'
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'DanhGia deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete danhgia',
      errors: err.message
    });
  }
};