import pool from '../config/db.js';

export const getSanPham = async (req, res) => {
  try {
    const { page = 1, size = 10, maDM, search } = req.query;
    const offset = (page - 1) * size;

    let query = 'SELECT * FROM SANPHAM WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM SANPHAM WHERE 1=1';
    const params = [];

    if (maDM) {
      query += ' AND MaDM = ?';
      countQuery += ' AND MaDM = ?';
      params.push(maDM);
    }

    if (search) {
      query += ' AND TenSP LIKE ?';
      countQuery += ' AND TenSP LIKE ?';
      params.push(`%${search}%`);
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
      message: 'Failed to fetch sanpham',
      errors: err.message
    });
  }
};

export const getSanPhamById = async (req, res) => {
  try {
    const { maSP } = req.params;
    const [rows] = await pool.query('SELECT * FROM SANPHAM WHERE MaSP = ?', [maSP]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'SanPham not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch sanpham',
      errors: err.message
    });
  }
};

export const getDanhGiaBySanPham = async (req, res) => {
  try {
    const { maSP } = req.params;
    const { page = 1, size = 10 } = req.query;
    const offset = (page - 1) * size;

    const query = 'SELECT * FROM DANHGIA WHERE MaSP = ? LIMIT ? OFFSET ?';
    const countQuery = 'SELECT COUNT(*) as total FROM DANHGIA WHERE MaSP = ?';

    const [rows] = await pool.query(query, [maSP, parseInt(size), parseInt(offset)]);
    const [[{ total }]] = await pool.query(countQuery, [maSP]);

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

export const createSanPham = async (req, res) => {
  try {
    const { maSP, tenSP, maDM, loaiSP ='', gia, hinhAnh, soLuongTon, moTa } = req.body;

    if (!maSP || !tenSP || !maDM || !gia) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    if (gia <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Gia must be greater than 0'
      });
    }

    await pool.query(
      'INSERT INTO SANPHAM (MaSP, TenSP, MaDM, LoaiSP, Gia, HinhAnh, SoLuongTon, MoTa) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [maSP, tenSP, maDM, loaiSP, gia, hinhAnh, soLuongTon, moTa]
    );

    res.status(201).json({
      status: 'success',
      data: { maSP, tenSP, maDM, loaiSP, gia, hinhAnh, soLuongTon, moTa }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create sanpham',
      errors: err.message
    });
  }
};

export const updateSanPham = async (req, res) => {
  try {
    const { maSP } = req.params;
    const { tenSP, maDM, loaiSP, gia, hinhAnh, soLuongTon, moTa } = req.body;

    if (gia && gia <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Gia must be greater than 0'
      });
    }

    const [result] = await pool.query(
      'UPDATE SANPHAM SET TenSP = ?, MaDM = ?, LoaiSP = ?, Gia = ?, HinhAnh = ?, SoLuongTon = ?, MoTa = ? WHERE MaSP = ?',
      [tenSP, maDM, loaiSP, gia, hinhAnh, soLuongTon, moTa, maSP]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'SanPham not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { maSP, tenSP, maDM, loaiSP, gia, hinhAnh, soLuongTon, moTa }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update sanpham',
      errors: err.message
    });
  }
};

export const deleteSanPham = async (req, res) => {
  try {
    const { maSP } = req.params;
    const [result] = await pool.query('DELETE FROM SANPHAM WHERE MaSP = ?', [maSP]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'SanPham not found'
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'SanPham deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete sanpham',
      errors: err.message
    });
  }
};