import pool from '../config/db.js';

export const getCuaHang = async (req, res) => {
  try {
    const { page = 1, size = 10, quyMo } = req.query;
    const offset = (page - 1) * size;

    let query = 'SELECT * FROM CUAHANG WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM CUAHANG WHERE 1=1';
    const params = [];

    if (quyMo) {
      query += ' AND QuyMo = ?';
      countQuery += ' AND QuyMo = ?';
      params.push(quyMo);
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
      message: 'Failed to fetch cuahang',
      errors: err.message
    });
  }
};

export const getCuaHangById = async (req, res) => {
  try {
    const { maCH } = req.params;
    const [rows] = await pool.query('SELECT * FROM CUAHANG WHERE MaCH = ?', [maCH]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'CuaHang not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch cuahang',
      errors: err.message
    });
  }
};

export const createCuaHang = async (req, res) => {
  try {
    const { maCH, quyMo, sdt, soNV, cuaHangTruong, diaChi, gioLamViec } = req.body;

    if (!maCH || !quyMo || !sdt || !soNV || !cuaHangTruong || !diaChi || !gioLamViec) {
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

    if (soNV < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'SoNV must be greater than or equal to 0'
      });
    }

    await pool.query(
      'INSERT INTO CUAHANG (MaCH, QuyMo, SDT, SoNV, CuaHangTruong, DiaChi, GioLamViec) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [maCH, quyMo, sdt, soNV, cuaHangTruong, diaChi, gioLamViec]
    );

    res.status(201).json({
      status: 'success',
      data: { maCH, quyMo, sdt, soNV, cuaHangTruong, diaChi, gioLamViec }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create cuahang',
      errors: err.message
    });
  }
};

export const updateCuaHang = async (req, res) => {
  try {
    const { maCH } = req.params;
    const { quyMo, sdt, soNV, cuaHangTruong, diaChi, gioLamViec } = req.body;

    if (sdt && !/^\d{10}$/.test(sdt)) {
      return res.status(400).json({
        status: 'error',
        message: 'SDT must be 10 digits'
      });
    }

    if (soNV && soNV < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'SoNV must be greater than or equal to 0'
      });
    }

    const [result] = await pool.query(
      'UPDATE CUAHANG SET QuyMo = ?, SDT = ?, SoNV = ?, CuaHangTruong = ?, DiaChi = ?, GioLamViec = ? WHERE MaCH = ?',
      [quyMo, sdt, soNV, cuaHangTruong, diaChi, gioLamViec, maCH]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'CuaHang not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { maCH, quyMo, sdt, soNV, cuaHangTruong, diaChi, gioLamViec }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update cuahang',
      errors: err.message
    });
  }
};

export const deleteCuaHang = async (req, res) => {
  try {
    const { maCH } = req.params;
    const [result] = await pool.query('DELETE FROM CUAHANG WHERE MaCH = ?', [maCH]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'CuaHang not found'
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'CuaHang deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete cuahang',
      errors: err.message
    });
  }
};