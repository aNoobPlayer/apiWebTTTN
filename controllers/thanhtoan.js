import pool from '../config/db.js';

export const getThanhToan = async (req, res) => {
  try {
    const { page = 1, size = 10, maDH, trangThai } = req.query;
    const offset = (page - 1) * size;

    let query = 'SELECT * FROM THANHTOAN WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM THANHTOAN WHERE 1=1';
    const params = [];

    if (maDH) {
      query += ' AND MaDH = ?';
      countQuery += ' AND MaDH = ?';
      params.push(maDH);
    }

    if (trangThai) {
      query += ' AND TrangThai = ?';
      countQuery += ' AND TrangThai = ?';
      params.push(trangThai);
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
      message: 'Failed to fetch thanhtoan',
      errors: err.message
    });
  }
};

export const getThanhToanById = async (req, res) => {
  try {
    const { maTT } = req.params;
    const [rows] = await pool.query('SELECT * FROM THANHTOAN WHERE MaTT = ?', [maTT]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'ThanhToan not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch thanhtoan',
      errors: err.message
    });
  }
};

export const createThanhToan = async (req, res) => {
  try {
    const { maTT, maDH, ngayThanhToan, phuongThuc, trangThai, soTien } = req.body;

    if (!maTT || !maDH || !ngayThanhToan || !phuongThuc || !trangThai || !soTien) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    if (soTien <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'SoTien must be greater than 0'
      });
    }

    // Kiểm tra MaDH tồn tại
    const [donHang] = await pool.query('SELECT MaDH FROM DONHANG WHERE MaDH = ?', [maDH]);
    if (donHang.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid MaDH'
      });
    }

    await pool.query(
      'INSERT INTO THANHTOAN (MaTT, MaDH, NgayThanhToan, PhuongThuc, TrangThai, SoTien) VALUES (?, ?, ?, ?, ?, ?)',
      [maTT, maDH, ngayThanhToan, phuongThuc, trangThai, soTien]
    );

    res.status(201).json({
      status: 'success',
      data: { maTT, maDH, ngayThanhToan, phuongThuc, trangThai, soTien }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create thanhtoan',
      errors: err.message
    });
  }
};

export const updateThanhToan = async (req, res) => {
  try {
    const { maTT } = req.params;
    const { maDH, ngayThanhToan, phuongThuc, trangThai, soTien } = req.body;

    if (soTien && soTien <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'SoTien must be greater than 0'
      });
    }

    const [result] = await pool.query(
      'UPDATE THANHTOAN SET MaDH = ?, NgayThanhToan = ?, PhuongThuc = ?, TrangThai = ?, SoTien = ? WHERE MaTT = ?',
      [maDH, ngayThanhToan, phuongThuc, trangThai, soTien, maTT]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'ThanhToan not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { maTT, maDH, ngayThanhToan, phuongThuc, trangThai, soTien }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update thanhtoan',
      errors: err.message
    });
  }
};

export const deleteThanhToan = async (req, res) => {
  try {
    const { maTT } = req.params;
    const [result] = await pool.query('DELETE FROM THANHTOAN WHERE MaTT = ?', [maTT]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'ThanhToan not found'
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'ThanhToan deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete thanhtoan',
      errors: err.message
    });
  }
};