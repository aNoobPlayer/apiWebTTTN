import pool from '../config/db.js';

export const getSanPham = async (req, res) => {
  try {
    const { page = 1, size = 10, maDM, search, all = 'false' } = req.query;

    // Validate query parameters
    const parsedPage = parseInt(page);
    const parsedSize = parseInt(size);
    if (all !== 'true' && (isNaN(parsedPage) || parsedPage < 1)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid page number. Page must be a positive integer.',
      });
    }
    if (all !== 'true' && (isNaN(parsedSize) || parsedSize < 1)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid size. Size must be a positive integer.',
      });
    }

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

    // Apply pagination only if all is not true
    const isFetchAll = all === 'true';
    if (!isFetchAll) {
      const offset = (parsedPage - 1) * parsedSize;
      query += ' LIMIT ? OFFSET ?';
      params.push(parsedSize, offset);
    }

    const [rows] = await pool.query(query, params);
    const [[{ total }]] = await pool.query(countQuery, params.slice(0, isFetchAll ? params.length : params.length - 2));

    res.status(200).json({
      status: 'success',
      data: rows,
      total,
      page: isFetchAll ? 1 : parsedPage,
      size: isFetchAll ? total : parsedSize,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch sanpham',
      errors: err.message,
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
        message: 'SanPham not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0],
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch sanpham',
      errors: err.message,
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
      size: parseInt(size),
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch danhgia',
      errors: err.message,
    });
  }
};

export const createSanPham = async (req, res) => {
  try {
    const { maSP, tenSP, maDM, loaiSP = '', gia, hinhAnh, soLuongTon, moTa } = req.body;

    if (!maSP || !tenSP || !maDM || !gia) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
      });
    }

    if (gia <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Gia must be greater than 0',
      });
    }
    const loaiSPValue = loaiSP ?? null;

    await pool.query(
      'INSERT INTO SANPHAM (MaSP, TenSP, MaDM, LoaiSP, Gia, HinhAnh, SoLuongTon, MoTa) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [maSP, tenSP, maDM, loaiSPValue, gia, hinhAnh, soLuongTon, moTa]
    );

    res.status(201).json({
      status: 'success',
      data: { maSP, tenSP, maDM, loaiSP, gia, hinhAnh, soLuongTon, moTa },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create sanpham',
      errors: err.message,
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
        message: 'Gia must be greater than 0',
      });
    }

    const [result] = await pool.query(
      'UPDATE SANPHAM SET TenSP = ?, MaDM = ?, LoaiSP = ?, Gia = ?, HinhAnh = ?, SoLuongTon = ?, MoTa = ? WHERE MaSP = ?',
      [tenSP, maDM, loaiSP, gia, hinhAnh, soLuongTon, moTa, maSP]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'SanPham not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { maSP, tenSP, maDM, loaiSP, gia, hinhAnh, soLuongTon, moTa },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update sanpham',
      errors: err.message,
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
        message: 'SanPham not found',
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'SanPham deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete sanpham',
      errors: err.message,
    });
  }
};