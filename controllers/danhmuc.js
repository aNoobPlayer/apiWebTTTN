import pool from '../config/db.js';

export const getDanhMuc = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const offset = (page - 1) * size;

    const query = 'SELECT * FROM DANHMUC LIMIT ? OFFSET ?';
    const countQuery = 'SELECT COUNT(*) as total FROM DANHMUC';

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
      message: 'Failed to fetch danhmuc',
      errors: err.message
    });
  }
};

export const getDanhMucById = async (req, res) => {
  try {
    const { maDM } = req.params;
    const [rows] = await pool.query('SELECT * FROM DANHMUC WHERE MaDM = ?', [maDM]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'DanhMuc not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch danhmuc',
      errors: err.message
    });
  }
};

export const createDanhMuc = async (req, res) => {
  try {
    const { maDM, tenDM } = req.body;

    if (!maDM || !tenDM) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    await pool.query(
      'INSERT INTO DANHMUC (MaDM, TenDM) VALUES (?, ?)',
      [maDM, tenDM]
    );

    res.status(201).json({
      status: 'success',
      data: { maDM, tenDM }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create danhmuc',
      errors: err.message
    });
  }
};

export const updateDanhMuc = async (req, res) => {
  try {
    const { maDM } = req.params;
    const { tenDM } = req.body;

    const [result] = await pool.query(
      'UPDATE DANHMUC SET TenDM = ? WHERE MaDM = ?',
      [tenDM, maDM]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'DanhMuc not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { maDM, tenDM }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update danhmuc',
      errors: err.message
    });
  }
};

export const deleteDanhMuc = async (req, res) => {
  try {
    const { maDM } = req.params;
    const [result] = await pool.query('DELETE FROM DANHMUC WHERE MaDM = ?', [maDM]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'DanhMuc not found'
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'DanhMuc deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete danhmuc',
      errors: err.message
    });
  }
};