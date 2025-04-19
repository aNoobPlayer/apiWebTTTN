import pool from '../config/db.js';

export const getNhanVien = async (req, res) => {
  try {
    const { page = 1, size = 10, trangThaiLamViec, search } = req.query;
    const offset = (page - 1) * size;

    let query = 'SELECT * FROM NHANVIEN WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM NHANVIEN WHERE 1=1';
    const params = [];

    if (trangThaiLamViec) {
      query += ' AND TrangThaiLamViec = ?';
      countQuery += ' AND TrangThaiLamViec = ?';
      params.push(trangThaiLamViec);
    }

    if (search) {
      query += ' AND (TenNV LIKE ? OR Email LIKE ?)';
      countQuery += ' AND (TenNV LIKE ? OR Email LIKE ?)';
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
      message: 'Failed to fetch nhanvien',
      errors: err.message
    });
  }
};

export const getNhanVienById = async (req, res) => {
  try {
    const { maNV } = req.params;
    const [rows] = await pool.query('SELECT * FROM NHANVIEN WHERE MaNV = ?', [maNV]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'NhanVien not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch nhanvien',
      errors: err.message
    });
  }
};

export const createNhanVien = async (req, res) => {
  try {
    const { maNV, tenNV, sdt, trangThaiLamViec, ngaySinh, diaChi, chucVu, caLamViec, email } = req.body;

    if (!maNV || !tenNV || !sdt || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    await pool.query(
      'INSERT INTO NHANVIEN (MaNV, TenNV, SDT, TrangThaiLamViec, NgaySinh, DiaChi, ChucVu, CaLamViec, Email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [maNV, tenNV, sdt, trangThaiLamViec, ngaySinh, diaChi, chucVu, caLamViec, email]
    );

    res.status(201).json({
      status: 'success',
      data: { maNV, tenNV, sdt, trangThaiLamViec, ngaySinh, diaChi, chucVu, caLamViec, email }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create nhanvien',
      errors: err.message
    });
  }
};

export const updateNhanVien = async (req, res) => {
  try {
    const { maNV } = req.params;
    const { tenNV, sdt, trangThaiLamViec, ngaySinh, diaChi, chucVu, caLamViec, email } = req.body;

    const [result] = await pool.query(
      'UPDATE NHANVIEN SET TenNV = ?, SDT = ?, TrangThaiLamViec = ?, NgaySinh = ?, DiaChi = ?, ChucVu = ?, CaLamViec = ?, Email = ? WHERE MaNV = ?',
      [tenNV, sdt, trangThaiLamViec, ngaySinh, diaChi, chucVu, caLamViec, email, maNV]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'NhanVien not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { maNV, tenNV, sdt, trangThaiLamViec, ngaySinh, diaChi, chucVu, caLamViec, email }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update nhanvien',
      errors: err.message
    });
  }
};

export const deleteNhanVien = async (req, res) => {
  try {
    const { maNV } = req.params;
    const [result] = await pool.query('DELETE FROM NHANVIEN WHERE MaNV = ?', [maNV]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'NhanVien not found'
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'NhanVien deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete nhanvien',
      errors: err.message
    });
  }
};