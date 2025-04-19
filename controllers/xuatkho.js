import pool from '../config/db.js';

export const getXuatKho = async (req, res) => {
  try {
    const { page = 1, size = 10, ngayXuat } = req.query;
    const offset = (page - 1) * size;

    let query = 'SELECT * FROM XUATKHO WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM XUATKHO WHERE 1=1';
    const params = [];

    if (ngayXuat) {
      query += ' AND NgayXuat = ?';
      countQuery += ' AND NgayXuat = ?';
      params.push(ngayXuat);
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
      message: 'Failed to fetch xuatkho',
      errors: err.message
    });
  }
};

export const getXuatKhoById = async (req, res) => {
  try {
    const { maXK } = req.params;
    const [rows] = await pool.query('SELECT * FROM XUATKHO WHERE MaXK = ?', [maXK]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'XuatKho not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch xuatkho',
      errors: err.message
    });
  }
};

export const createXuatKho = async (req, res) => {
  try {
    const { maXK, ngayXuat, maCH, maNV } = req.body;

    if (!maXK || !ngayXuat || !maCH || !maNV) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    // Kiểm tra MaCH và MaNV tồn tại
    const [cuaHang] = await pool.query('SELECT MaCH FROM CUAHANG WHERE MaCH = ?', [maCH]);
    const [nhanVien] = await pool.query('SELECT MaNV FROM NHANVIEN WHERE MaNV = ?', [maNV]);

    if (cuaHang.length === 0 || nhanVien.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid MaCH or MaNV'
      });
    }

    await pool.query(
      'INSERT INTO XUATKHO (MaXK, NgayXuat, MaCH, MaNV) VALUES (?, ?, ?, ?)',
      [maXK, ngayXuat, maCH, maNV]
    );

    res.status(201).json({
      status: 'success',
      data: { maXK, ngayXuat, maCH, maNV }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create xuatkho',
      errors: err.message
    });
  }
};

export const updateXuatKho = async (req, res) => {
  try {
    const { maXK } = req.params;
    const { ngayXuat, maCH, maNV } = req.body;

    const [result] = await pool.query(
      'UPDATE XUATKHO SET NgayXuat = ?, MaCH = ?, MaNV = ? WHERE MaXK = ?',
      [ngayXuat, maCH, maNV, maXK]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'XuatKho not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { maXK, ngayXuat, maCH, maNV }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update xuatkho',
      errors: err.message
    });
  }
};

export const deleteXuatKho = async (req, res) => {
  try {
    const { maXK } = req.params;
    const [result] = await pool.query('DELETE FROM XUATKHO WHERE MaXK = ?', [maXK]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'XuatKho not found'
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'XuatKho deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete xuatkho',
      errors: err.message
    });
  }
};