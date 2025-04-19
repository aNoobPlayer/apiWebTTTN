import pool from '../config/db.js';

export const getKhachHang = async (req, res) => {
  try {
    const { page = 1, size = 10, loaiKH, search } = req.query;
    const offset = (page - 1) * size;

    let query = 'SELECT * FROM KHACHHANG WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM KHACHHANG WHERE 1=1';
    const params = [];

    if (loaiKH) {
      query += ' AND LoaiKH = ?';
      countQuery += ' AND LoaiKH = ?';
      params.push(loaiKH);
    }

    if (search) {
      query += ' AND (TenKH LIKE ? OR Email LIKE ?)';
      countQuery += ' AND (TenKH LIKE ? OR Email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
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
      message: 'Failed to fetch khachhang',
      errors: err.message
    });
  }
};

export const getKhachHangById = async (req, res) => {
  try {
    const { maKH } = req.params;
    const [rows] = await pool.query('SELECT * FROM KHACHHANG WHERE MaKH = ?', [maKH]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'KhachHang not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch khachhang',
      errors: err.message
    });
  }
};

export const createKhachHang = async (req, res) => {
  try {
    const { maKH, tenKH, sdt, diaChi, loaiKH, email } = req.body;

    if (!maKH || !tenKH || !sdt || !diaChi || !loaiKH || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    if (!/^\d{10}$/.test(sdt)) {
      return res.status(400).json({
        status: 'error',
        message: 'SDT must be 10 digits'
      });
    }

    await pool.query(
      'INSERT INTO KHACHHANG (MaKH, TenKH, SDT, DiaChi, LoaiKH, Email) VALUES (?, ?, ?, ?, ?, ?)',
      [maKH, tenKH, sdt, diaChi, loaiKH, email]
    );

    res.status(201).json({
      status: 'success',
      data: { maKH, tenKH, sdt, diaChi, loaiKH, email }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create khachhang',
      errors: err.message
    });
  }
};

export const updateKhachHang = async (req, res) => {
  try {
    const { maKH } = req.params;
    const { tenKH, sdt, diaChi, loaiKH, email } = req.body;

    if (sdt && !/^\d{10}$/.test(sdt)) {
      return res.status(400).json({
        status: 'error',
        message: 'SDT must be 10 digits'
      });
    }

    const [result] = await pool.query(
      'UPDATE KHACHHANG SET TenKH = ?, SDT = ?, DiaChi = ?, LoaiKH = ?, Email = ? WHERE MaKH = ?',
      [tenKH, sdt, diaChi, loaiKH, email, maKH]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'KhachHang not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { maKH, tenKH, sdt, diaChi, loaiKH, email }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update khachhang',
      errors: err.message
    });
  }
};

export const deleteKhachHang = async (req, res) => {
  try {
    const { maKH } = req.params;
    const [result] = await pool.query('DELETE FROM KHACHHANG WHERE MaKH = ?', [maKH]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'KhachHang not found'
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'KhachHang deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete khachhang',
      errors: err.message
    });
  }
};