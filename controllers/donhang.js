import pool from '../config/db.js';

export const getDonHang = async (req, res) => {
  try {
    const { page = 1, size = 10, maKH, ngayDat } = req.query;
    const offset = (page - 1) * size;

    let query = 'SELECT * FROM DONHANG WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM DONHANG WHERE 1=1';
    const params = [];

    if (maKH) {
      query += ' AND MaKH = ?';
      countQuery += ' AND MaKH = ?';
      params.push(maKH);
    }

    if (ngayDat) {
      query += ' AND NgayDat = ?';
      countQuery += ' AND NgayDat = ?';
      params.push(ngayDat);
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
      message: 'Failed to fetch donhang',
      errors: err.message
    });
  }
};

export const getDonHangById = async (req, res) => {
  try {
    const { maDH } = req.params;

    const [rows] = await pool.query(`
      SELECT 
        d.MaDH, d.MaKH, d.NgayDat, d.NgayGiao,
        c.MaSP, c.DonGia, c.VAT, c.SoLuong
      FROM DONHANG d
      LEFT JOIN CHITIETDONHANG c ON d.MaDH = c.MaDH
      WHERE d.MaDH = ?
    `, [maDH]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'DonHang not found'
      });
    }

    // Tách phần đơn hàng
    const { MaKH, NgayDat, NgayGiao } = rows[0];
    const chitiet = rows.map(row => ({
      MaSP: row.MaSP,
      DonGia: row.DonGia,
      VAT: row.VAT,
      SoLuong: row.SoLuong
    }));

    res.status(200).json({
      status: 'success',
      data: {
        MaDH: maDH,
        MaKH,
        NgayDat,
        NgayGiao,
        chitiet
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch donhang',
      errors: err.message
    });
  }
};


export const createDonHang = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { maDH, maKH, ngayDat, ngayGiao, chitiet } = req.body;

    if (!maDH || !maKH || !ngayDat || !chitiet || !Array.isArray(chitiet)) {
      await connection.rollback();
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields or invalid chitiet'
      });
    }

    // Kiểm tra MaKH tồn tại
    const [khachHang] = await connection.query('SELECT MaKH FROM KHACHHANG WHERE MaKH = ?', [maKH]);
    if (khachHang.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        status: 'error',
        message: 'Invalid MaKH'
      });
    }

    // Insert DONHANG
    await connection.query(
      'INSERT INTO DONHANG (MaDH, MaKH, NgayDat, NgayGiao) VALUES (?, ?, ?, ?)',
      [maDH, maKH, ngayDat, ngayGiao]
    );

    // Insert CHITIETDONHANG
    for (const item of chitiet) {
      const { maSP, donGia, vat, soLuong } = item;

      if (!maSP || !donGia || !soLuong || donGia <= 0 || soLuong < 0) {
        await connection.rollback();
        return res.status(400).json({
          status: 'error',
          message: 'Invalid chitiet data'
        });
      }

      // Kiểm tra MaSP tồn tại
      const [sanPham] = await connection.query('SELECT MaSP FROM SANPHAM WHERE MaSP = ?', [maSP]);
      if (sanPham.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          status: 'error',
          message: `Invalid MaSP: ${maSP}`
        });
      }

      await connection.query(
        'INSERT INTO CHITIETDONHANG (MaSP, MaDH, DonGia, VAT, SoLuong) VALUES (?, ?, ?, ?, ?)',
        [maSP, maDH, donGia, vat, soLuong]
      );
    }

    await connection.commit();
    res.status(201).json({
      status: 'success',
      data: { maDH, maKH, ngayDat, ngayGiao, chitiet }
    });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({
      status: 'error',
      message: 'Failed to create donhang',
      errors: err.message
    });
  } finally {
    connection.release();
  }
};

export const updateDonHang = async (req, res) => {
  try {
    const { maDH } = req.params;
    const { maKH, ngayDat, ngayGiao } = req.body;

    const [result] = await pool.query(
      'UPDATE DONHANG SET MaKH = ?, NgayDat = ?, NgayGiao = ? WHERE MaDH = ?',
      [maKH, ngayDat, ngayGiao, maDH]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'DonHang not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { maDH, maKH, ngayDat, ngayGiao }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update donhang',
      errors: err.message
    });
  }
};

export const deleteDonHang = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { maDH } = req.params;

    // Xóa CHITIETDONHANG trước
    await connection.query('DELETE FROM CHITIETDONHANG WHERE MaDH = ?', [maDH]);

    // Xóa DONHANG
    const [result] = await connection.query('DELETE FROM DONHANG WHERE MaDH = ?', [maDH]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        status: 'error',
        message: 'DonHang not found'
      });
    }

    await connection.commit();
    res.status(204).json({
      status: 'success',
      message: 'DonHang deleted successfully'
    });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete donhang',
      errors: err.message
    });
  } finally {
    connection.release();
  }
};