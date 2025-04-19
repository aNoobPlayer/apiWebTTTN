import pool from '../config/db.js';

export const getBangLuong = async (req, res) => {
  try {
    const { page = 1, size = 10, thang, nam } = req.query;
    const offset = (page - 1) * size;

    let query = 'SELECT * FROM BANGLUONG WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM BANGLUONG WHERE 1=1';
    const params = [];

    if (thang) {
      query += ' AND Thang = ?';
      countQuery += ' AND Thang = ?';
      params.push(parseInt(thang));
    }

    if (nam) {
      query += ' AND Nam = ?';
      countQuery += ' AND Nam = ?';
      params.push(parseInt(nam));
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
      message: 'Failed to fetch bangluong',
      errors: err.message
    });
  }
};

export const getBangLuongById = async (req, res) => {
  try {
    const { maBL } = req.params;
    const [rows] = await pool.query('SELECT * FROM BANGLUONG WHERE MaBL = ?', [maBL]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'BangLuong not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch bangluong',
      errors: err.message
    });
  }
};

export const createBangLuong = async (req, res) => {
  try {
    const { maBL, maNV, thang, nam, luongCoBan, soNgayLamViec, soNgayNghi, luongThuong, luongPhat, luongTong, baoHiem } = req.body;

    if (!maBL || !maNV || !thang || !nam || !luongCoBan || !soNgayLamViec || !soNgayNghi || !luongTong) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    if (thang < 1 || thang > 12) {
      return res.status(400).json({
        status: 'error',
        message: 'Thang must be between 1 and 12'
      });
    }

    if (nam < 2000) {
      return res.status(400).json({
        status: 'error',
        message: 'Nam must be greater than or equal to 2000'
      });
    }

    if (luongCoBan < 0 || soNgayLamViec < 0 || soNgayNghi < 0 || luongThuong < 0 || luongPhat < 0 || luongTong < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Numeric values must be greater than or equal to 0'
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
      'INSERT INTO BANGLUONG (MaBL, MaNV, Thang, Nam, LuongCoBan, SoNgayLamViec, SoNgayNghi, LuongThuong, LuongPhat, LuongTong, BaoHiem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [maBL, maNV, thang, nam, luongCoBan, soNgayLamViec, soNgayNghi, luongThuong, luongPhat, luongTong, baoHiem]
    );

    res.status(201).json({
      status: 'success',
      data: { maBL, maNV, thang, nam, luongCoBan, soNgayLamViec, soNgayNghi, luongThuong, luongPhat, luongTong, baoHiem }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create bangluong',
      errors: err.message
    });
  }
};

export const updateBangLuong = async (req, res) => {
  try {
    const { maBL } = req.params;
    const { maNV, thang, nam, luongCoBan, soNgayLamViec, soNgayNghi, luongThuong, luongPhat, luongTong, baoHiem } = req.body;

    if (thang && (thang < 1 || thang > 12)) {
      return res.status(400).json({
        status: 'error',
        message: 'Thang must be between 1 and 12'
      });
    }

    if (nam && nam < 2000) {
      return res.status(400).json({
        status: 'error',
        message: 'Nam must be greater than or equal to 2000'
      });
    }

    if (luongCoBan && luongCoBan < 0 || soNgayLamViec && soNgayLamViec < 0 || soNgayNghi && soNgayNghi < 0 || luongThuong && luongThuong < 0 || luongPhat && luongPhat < 0 || luongTong && luongTong < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Numeric values must be greater than or equal to 0'
      });
    }

    if (maNV) {
      const [nhanVien] = await pool.query('SELECT MaNV FROM NHANVIEN WHERE MaNV = ?', [maNV]);
      if (nhanVien.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid MaNV'
        });
      }
    }

    const [result] = await pool.query(
      'UPDATE BANGLUONG SET MaNV = ?, Thang = ?, Nam = ?, LuongCoBan = ?, SoNgayLamViec = ?, SoNgayNghi = ?, LuongThuong = ?, LuongPhat = ?, LuongTong = ?, BaoHiem = ? WHERE MaBL = ?',
      [maNV, thang, nam, luongCoBan, soNgayLamViec, soNgayNghi, luongThuong, luongPhat, luongTong, baoHiem, maBL]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'BangLuong not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { maBL, maNV, thang, nam, luongCoBan, soNgayLamViec, soNgayNghi, luongThuong, luongPhat, luongTong, baoHiem }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update bangluong',
      errors: err.message
    });
  }
};

export const deleteBangLuong = async (req, res) => {
  try {
    const { maBL } = req.params;
    const [result] = await pool.query('DELETE FROM BANGLUONG WHERE MaBL = ?', [maBL]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'BangLuong not found'
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'BangLuong deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete bangluong',
      errors: err.message
    });
  }
};