import pool from '../config/db.js';

export const getKhoHang = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const offset = (page - 1) * size;

    const query = 'SELECT * FROM KHOHANG LIMIT ? OFFSET ?';
    const countQuery = 'SELECT COUNT(*) as total FROM KHOHANG';

    const [rows] = await pool.query(query, [parseInt(size), parseInt(offset)]);
    const [[{ total }]] = await pool.query(countQuery);

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
      message: 'Failed to fetch khohang',
      errors: err.message
    });
  }
};

export const getKhoHangById = async (req, res) => {
  try {
    const { maKH } = req.params;
    const [rows] = await pool.query('SELECT * FROM KHOHANG WHERE MaKH = ?', [maKH]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'KhoHang not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch khohang',
      errors: err.message
    });
  }
};

export const createKhoHang = async (req, res) => {
  try {
    const { maKH, tenKH } = req.body;

    if (!maKH || !tenKH) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    await pool.query(
      'INSERT INTO KHOHANG (MaKH, TenKH) VALUES (?, ?)',
      [maKH, tenKH]
    );

    res.status(201).json({
      status: 'success',
      data: { maKH, tenKH }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create khohang',
      errors: err.message
    });
  }
};

export const updateKhoHang = async (req, res) => {
  try {
    const { maKH } = req.params;
    const { tenKH } = req.body;

    const [result] = await pool.query(
      'UPDATE KHOHANG SET TenKH = ? WHERE MaKH = ?',
      [tenKH, maKH]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'KhoHang not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { maKH, tenKH }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update khohang',
      errors: err.message
    });
  }
};

export const deleteKhoHang = async (req, res) => {
  try {
    const { maKH } = req.params;
    const [result] = await pool.query('DELETE FROM KHOHANG WHERE MaKH = ?', [maKH]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'KhoHang not found'
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'KhoHang deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete khohang',
      errors: err.message
    });
  }
};