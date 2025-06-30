const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {findByEmail,createUser} = require('../models/user.model')

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await findByEmail(email);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    let redirectUrl = '';
    switch (user.role) {
      case 'admin':
        redirectUrl = '/admin/dashboard'; //template
        break;
      case 'user':
        redirectUrl = '/user/dashboard'; //template
        break;
      default:
        redirectUrl = '/';
    }

    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      redirect: redirectUrl,
    });
  } catch (error) {
    console.error('Lỗi login:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existing = await findByEmail(email);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser(name, email, hashedPassword, role || 'user');

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    console.error('Lỗi đăng ký:', error.message);
    res.status(500).json({ error: 'Lỗi server' });
  }
};