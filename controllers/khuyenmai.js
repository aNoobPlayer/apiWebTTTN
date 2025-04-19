import pool from '../config/db.js';

export const getKhuyenMai = async (req, res) => {
  try {
    const { page = 1, size = 10, loaiKM, ngayBatDau } = req.query;
    const offset = (page - 1) * size;

    let query = 'SELECT * FROM KHUYENMAI WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM KHUYENMAI WHERE 1=1';
    const params = [];

    if (loaiKM) {
      query += ' AND LoaiKM = ?';
      countQuery += ' AND LoaiKM = ?';
      params.push(loaiKM);
    }

    if (ngayBatDau) {
      query += ' AND NgayBatDau <= ?';
      countQuery += ' AND NgayBatDau <= ?';
      params.push(ngayBatDau);
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
      message: 'Failed to fetch khuyenmai',
      errors: err.message
    });
  }
};

export const getKhuyenMaiById = async (req, res) => {
  try {
    const { maKM } = req.params;
    const [rows] = await pool.query('SELECT * FROM KHUYENMAI WHERE MaKM = ?', [maKM]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'KhuyenMai not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch khuyenmai',
      errors: err.message
    });
  }
};

export const createKhuyenMai = async (req, res) => {
  try {
    const { maKM, tenKM, soLuongSuDung, giaTriDonHangToiThieu, loaiKM, ngayKetThuc, ngayBatDau, soLanToiDa, moTa } = req.body;

    if (!maKM || !tenKM || !soLuongSuDung || !giaTriDonHangToiThieu || !loaiKM || !ngayKetThuc || !ngayBatDau || !soLanToiDa) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    if (soLuongSuDung < 0 || giaTriDonHangToiThieu < 0 || soLanToiDa <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid numeric values'
      });
    }

    if (new Date(ngayBatDau) >= new Date(ngayKetThuc)) {
      return res.status(400).json({
        status: 'error',
        message: 'NgayBatDau must be before NgayKetThuc'
      });
    }

    await pool.query(
      'INSERT INTO KHUYENMAI (MaKM, TenKM, SoLuongSuDung, GiaTriDonHangToiThieu, LoaiKM, NgayKetThuc, NgayBatDau, SoLanToiDa, MoTa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [maKM, tenKM, soLuongSuDung, giaTriDonHangToiThieu, loaiKM, ngayKetThuc, ngayBatDau, soLanToiDa, moTa]
    );

    res.status(201).json({
      status: 'success',
      data: { maKM, tenKM, soLuongSuDung, giaTriDonHangToiThieu, loaiKM, ngayKetThuc, ngayBatDau, soLanToiDa, moTa }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create khuyenmai',
      errors: err.message
    });
  }
};

export const updateKhuyenMai = async (req, res) => {
  try {
    const { maKM } = req.params;
    const { tenKM, soLuongSuDung, giaTriDonHangToiThieu, loaiKM, ngayKetThuc, ngayBatDau, soLanToiDa, moTa } = req.body;

    if (soLuongSuDung && soLuongSuDung < 0 || giaTriDonHangToiThieu && giaTriDonHangToiThieu < 0 || soLanToiDa && soLanToiDa <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid numeric values'
      });
    }

    if (ngayBatDau && ngayKetThuc && new Date(ngayBatDau) >= new Date(ngayKetThuc)) {
      return res.status(400).json({
        status: 'error',
        message: 'NgayBatDau must be before NgayKetThuc'
      });
    }

    const [result] = await pool.query(
      'UPDATE KHUYENMAI SET TenKM = ?, SoLuongSuDung = ?, GiaTriDonHangToiThieu = ?, LoaiKM = ?, NgayKetThuc = ?, NgayBatDau = ?, SoLanToiDa = ?, MoTa = ? WHERE MaKM = ?',
      [tenKM, soLuongSuDung, giaTriDonHangToiThieu, loaiKM, ngayKetThuc, ngayBatDau, soLanToiDa, moTa, maKM]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'KhuyenMai not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { maKM, tenKM, soLuongSuDung, giaTriDonHangToiThieu, loaiKM, ngayKetThuc, ngayBatDau, soLanToiDa, moTa }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update khuyenmai',
      errors: err.message
    });
  }
};

export const deleteKhuyenMai = async (req, res) => {
  try {
    const { maKM } = req.params;
    const [result] = await pool.query('DELETE FROM KHUYENMAI WHERE MaKM = ?', [maKM]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'KhuyenMai not found'
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'KhuyenMai deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete khuyenmai',
      errors: err.message
    });
  }
};