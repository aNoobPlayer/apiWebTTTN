import pool from '../config/db.js';

export const getTaiKhoan = async (req, res) => {
  try {
    const { page = 1, size = 10, tinhTrang, search } = req.query;
    const offset = (page - 1) * size;

    let query = 'SELECT MaTK, MaKH, TenTK, tinhTrang, NgayTao FROM TAIKHOAN WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM TAIKHOAN WHERE 1=1';
    const params = [];

    if (tinhTrang) {
      query += ' AND TinhTrang = ?';
      countQuery += ' AND TinhTrang = ?';
      params.push(tinhTrang);
    }

    if (search) {
      query += ' AND TenTK LIKE ?';
      countQuery += ' AND TenTK LIKE ?';
      params.push(`%${search}%`);
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
      message: 'Failed to fetch taikhoan',
      errors: err.message
    });
  }
};

export const getTaiKhoanById = async (req, res) => {
  try {
    const { maTK } = req.params;
    const [rows] = await pool.query('SELECT MaTK, MaKH, TenTK, TinhTrang, NgayTao FROM TAIKHOAN WHERE MaTK = ?', [maTK]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'TaiKhoan not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch taikhoan',
      errors: err.message
    });
  }
};
// In controllers/taikhoan.js
export const getPassword = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Unauthorized' });
  const taiKhoan = await TaiKhoan.findOne({ maTK: req.params.maTK }).select('password');
  if (!taiKhoan) return res.status(404).json({ message: 'Account not found' });
  res.json({ password: taiKhoan.password });
};

export const createTaiKhoan = async (req, res) => {
  try {
    const { maTK, maKH, tenTK, tinhTrang, ngayTao, matKhau } = req.body;

    if (!maTK || !maKH || !tenTK || !tinhTrang || !ngayTao || !matKhau) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    // Kiểm tra MaKH tồn tại
    const [khachHang] = await pool.query('SELECT MaKH FROM KHACHHANG WHERE MaKH = ?', [maKH]);
    if (khachHang.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid MaKH'
      });
    }

    // Kiểm tra TenTK duy nhất
    const [existingTenTK] = await pool.query('SELECT TenTK FROM TAIKHOAN WHERE TenTK = ?', [tenTK]);
    if (existingTenTK.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'TenTK already exists'
      });
    }

    // Trong thực tế, bạn nên băm mật khẩu ở đây (ví dụ: sử dụng bcrypt)
    // const hashedPassword = await bcrypt.hash(matKhau, 10);

    await pool.query(
      'INSERT INTO TAIKHOAN (MaTK, MaKH, TenTK, TinhTrang, NgayTao, MatKhau) VALUES (?, ?, ?, ?, ?, ?)',
      [maTK, maKH, tenTK, tinhTrang, ngayTao, matKhau] // Thay matKhau bằng hashedPassword nếu băm
    );

    res.status(201).json({
      status: 'success',
      data: { maTK, maKH, tenTK, tinhTrang, ngayTao }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create taikhoan',
      errors: err.message
    });
  }
};

export const updateTaiKhoan = async (req, res) => {
  try {
    const { maTK } = req.params;
    const { maKH, tenTK, tinhTrang, ngayTao, matKhau } = req.body;

    // Kiểm tra MaKH nếu có
    if (maKH) {
      const [khachHang] = await pool.query('SELECT MaKH FROM KHACHHANG WHERE MaKH = ?', [maKH]);
      if (khachHang.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid MaKH'
        });
      }
    }

    // Kiểm tra TenTK duy nhất nếu thay đổi
    if (tenTK) {
      const [existingTenTK] = await pool.query('SELECT TenTK FROM TAIKHOAN WHERE TenTK = ? AND MaTK != ?', [tenTK, maTK]);
      if (existingTenTK.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'TenTK already exists'
        });
      }
    }

    // Nếu cập nhật mật khẩu, băm lại (ví dụ: sử dụng bcrypt)
    // let hashedPassword = matKhau;
    // if (matKhau) {
    //   hashedPassword = await bcrypt.hash(matKhau, 10);
    // }

    const [result] = await pool.query(
      'UPDATE TAIKHOAN SET MaKH = ?, TenTK = ?, tinhTrang = ?, NgayTao = ?, MatKhau = ? WHERE MaTK = ?',
      [maKH, tenTK, tinhTrang, ngayTao, matKhau, maTK] // Thay matKhau bằng hashedPassword nếu băm
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'TaiKhoan not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { maTK, maKH, tenTK, tinhTrang, ngayTao }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update taikhoan',
      errors: err.message
    });
  }
};

export const deleteTaiKhoan = async (req, res) => {
  try {
    const { maTK } = req.params;
    const [result] = await pool.query('DELETE FROM TAIKHOAN WHERE MaTK = ?', [maTK]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'TaiKhoan not found'
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'TaiKhoan deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete taikhoan',
      errors: err.message
    });
  }
};