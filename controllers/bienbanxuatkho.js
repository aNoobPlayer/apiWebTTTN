import pool from '../config/db.js';

// Placeholder for logging (e.g., using winston or console)
const logAction = (action, maBB, userId) => {
  console.log(`${action} BienBanXuatKho ${maBB} by user ${userId || 'unknown'} at ${new Date().toISOString()}`);
};

export const getBienBanXuatKho = async (req, res) => {
  try {
    const { page = 1, size = 10, trinhTrang } = req.query;
    const offset = (page - 1) * size;

    let query = 'SELECT * FROM BIENBANXUATKHO WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM BIENBANXUATKHO WHERE 1=1';
    const params = [];

    if (trinhTrang) {
      query += ' AND TrinhTrang = ?';
      countQuery += ' AND TrinhTrang = ?';
      params.push(trinhTrang);
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
      message: 'Failed to fetch bienbanxuatkho',
      errors: err.message
    });
  }
};

export const getBienBanXuatKhoById = async (req, res) => {
  try {
    const { maBB } = req.params;
    const [rows] = await pool.query('SELECT * FROM BIENBANXUATKHO WHERE MaBB = ?', [maBB]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'BienBanXuatKho not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch bienbanxuatkho',
      errors: err.message
    });
  }
};

export const createBienBanXuatKho = async (req, res) => {
  try {
    const { maBB, nguoiLap, ngayLap, tenHH, nhanVienGiaoHang, soLuong, trinhTrang } = req.body;

    if (!maBB || !nguoiLap || !ngayLap || !tenHH || !nhanVienGiaoHang || !soLuong || !trinhTrang) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    if (soLuong <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'SoLuong must be greater than 0'
      });
    }

    // Validate NguoiLap and NhanVienGiaoHang exist in NHANVIEN
    const [nguoiLapCheck] = await pool.query('SELECT MaNV FROM NHANVIEN WHERE MaNV = ?', [nguoiLap]);
    if (nguoiLapCheck.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid NguoiLap'
      });
    }

    const [nhanVienCheck] = await pool.query('SELECT MaNV FROM NHANVIEN WHERE MaNV = ?', [nhanVienGiaoHang]);
    if (nhanVienCheck.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid NhanVienGiaoHang'
      });
    }

    await pool.query(
      'INSERT INTO BIENBANXUATKHO (MaBB, NguoiLap, NgayLap, TenHH, NhanVienGiaoHang, SoLuong, TrinhTrang) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [maBB, nguoiLap, ngayLap, tenHH, nhanVienGiaoHang, soLuong, trinhTrang]
    );

    logAction('CREATE', maBB, req.user?.id);

    res.status(201).json({
      status: 'success',
      data: { maBB, nguoiLap, ngayLap, tenHH, nhanVienGiaoHang, soLuong, trinhTrang }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create bienbanxuatkho',
      errors: err.message
    });
  }
};

export const updateBienBanXuatKho = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { maBB } = req.params;
    const { nguoiLap, ngayLap, tenHH, nhanVienGiaoHang, soLuong, trinhTrang } = req.body;

    // Check if BienBanXuatKho exists
    const [existing] = await connection.query('SELECT MaBB FROM BIENBANXUATKHO WHERE MaBB = ?', [maBB]);
    if (existing.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        status: 'error',
        message: 'BienBanXuatKho not found'
      });
    }

    // Validate inputs if provided
    if (soLuong && soLuong <= 0) {
      await connection.rollback();
      return res.status(400).json({
        status: 'error',
        message: 'SoLuong must be greater than 0'
      });
    }

    if (nguoiLap) {
      const [nguoiLapCheck] = await connection.query('SELECT MaNV FROM NHANVIEN WHERE MaNV = ?', [nguoiLap]);
      if (nguoiLapCheck.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          status: 'error',
          message: 'Invalid NguoiLap'
        });
      }
    }

    if (nhanVienGiaoHang) {
      const [nhanVienCheck] = await connection.query('SELECT MaNV FROM NHANVIEN WHERE MaNV = ?', [nhanVienGiaoHang]);
      if (nhanVienCheck.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          status: 'error',
          message: 'Invalid NhanVienGiaoHang'
        });
      }
    }

    // Update only provided fields
    const updates = {};
    if (nguoiLap) updates.NguoiLap = nguoiLap;
    if (ngayLap) updates.NgayLap = ngayLap;
    if (tenHH) updates.TenHH = tenHH;
    if (nhanVienGiaoHang) updates.NhanVienGiaoHang = nhanVienGiaoHang;
    if (soLuong) updates.SoLuong = soLuong;
    if (trinhTrang) updates.TrinhTrang = trinhTrang;

    if (Object.keys(updates).length === 0) {
      await connection.rollback();
      return res.status(400).json({
        status: 'error',
        message: 'No fields provided for update'
      });
    }

    const [result] = await connection.query(
      'UPDATE BIENBANXUATKHO SET ? WHERE MaBB = ?',
      [updates, maBB]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        status: 'error',
        message: 'BienBanXuatKho not found'
      });
    }

    logAction('UPDATE', maBB, req.user?.id);

    await connection.commit();
    res.status(200).json({
      status: 'success',
      data: { maBB, ...updates }
    });
  } catch (err) {
    await connection.rollback();
    let errorMessage = 'Failed to update bienbanxuatkho';
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      errorMessage = 'Invalid foreign key reference';
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      errorMessage = 'Database access denied';
    }

    res.status(500).json({
      status: 'error',
      message: errorMessage,
      errors: err.message
    });
  } finally {
    connection.release();
  }
};

export const deleteBienBanXuatKho = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { maBB } = req.params;

    // Check if BienBanXuatKho exists
    const [existing] = await connection.query('SELECT MaBB FROM BIENBANXUATKHO WHERE MaBB = ?', [maBB]);
    if (existing.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        status: 'error',
        message: 'BienBanXuatKho not found'
      });
    }

    // Perform deletion
    const [result] = await connection.query('DELETE FROM BIENBANXUATKHO WHERE MaBB = ?', [maBB]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        status: 'error',
        message: 'BienBanXuatKho not found'
      });
    }

    logAction('DELETE', maBB, req.user?.id);

    await connection.commit();
    res.status(204).json({
      status: 'success',
      message: 'BienBanXuatKho deleted successfully'
    });
  } catch (err) {
    await connection.rollback();
    let errorMessage = 'Failed to delete bienbanxuatkho';
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      errorMessage = 'Cannot delete BienBanXuatKho due to foreign key constraints';
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      errorMessage = 'Database access denied';
    }

    res.status(500).json({
      status: 'error',
      message: errorMessage,
      errors: err.message
    });
  } finally {
    connection.release();
  }
};