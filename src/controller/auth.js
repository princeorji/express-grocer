const User = require('../models/user');
const argon = require('argon2');
const env = require('../utils/setEnv');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Parameters missing' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await argon.hash(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // exclude password in response
    user.password = undefined;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Parameters missing' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await argon.verify(user.password, password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // generate access token
    const accessToken = jwt.sign({ _id: user._id }, env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
};
