import pool from '../config/db.js';

export const getNhapKho = async (req, res) => {
  try {
    const { page = 1, size = 10, ngayNK } = req.query;
    const offset = (page - 1) * size;

    let query = 'SELECT * FROM NHAPKHO WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM NHAPKHO WHERE 1=1';
    const params = [];

    if (ngayNK) {
      query += ' AND NgayNK = ?';
      countQuery += ' AND NgayNK = ?';
      params.push(ngayNK);
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
      message: 'Failed to fetch nhapkho',
      errors: err.message
    });
  }
};

export const getNhapKhoById = async (req, res) => {
  try {
    const { maNK } = req.params;
    const [rows] = await pool.query('SELECT * FROM NHAPKHO WHERE MaNK = ?', [maNK]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'NhapKho not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch nhapkho',
      errors: err.message
    });
  }
};

export const createNhapKho = async (req, res) => {
  try {
    const { maNK, ngayNK, maNV, tongSL } = req.body;

    if (!maNK || !ngayNK || !maNV || !tongSL) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    if (tongSL < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'TongSL must be greater than or equal to 0'
      });
    }

    // Kiểm tra MaNV tồn tại
    const [nhanVien] = await pool.query('SELECT MaNV FROM NHANVIEN WHERE MaNV = ?', [maNV]);
    if (nhanVien.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid MaNV'
      });
    }

    await pool.query(
      'INSERT INTO NHAPKHO (MaNK, NgayNK, MaNV, TongSL) VALUES (?, ?, ?, ?)',
      [maNK, ngayNK, maNV, tongSL]
    );

    res.status(201).json({
      status: 'success',
      data: { maNK, ngayNK, maNV, tongSL }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create nhapkho',
      errors: err.message
    });
  }
};

export const updateNhapKho = async (req, res) => {
  try {
    const { maNK } = req.params;
    const { ngayNK, maNV, tongSL } = req.body;

    if (tongSL && tongSL < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'TongSL must be greater than or equal to 0'
      });
    }

    const [result] = await pool.query(
      'UPDATE NHAPKHO SET NgayNK = ?, MaNV = ?, TongSL = ? WHERE MaNK = ?',
      [ngayNK, maNV, tongSL, maNK]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'NhapKho not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { maNK, ngayNK, maNV, tongSL }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update nhapkho',
      errors: err.message
    });
  }
};

export const deleteNhapKho = async (req, res) => {
  try {
    const { maNK } = req.params;
    const [result] = await pool.query('DELETE FROM NHAPKHO WHERE MaNK = ?', [maNK]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'NhapKho not found'
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'NhapKho deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete nhapkho',
      errors: err.message
    });
  }
};