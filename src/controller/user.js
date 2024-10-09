const User = require('../models/user');

const profile = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const user = await User.findOne({ userId }).select('-password');
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { profile };
