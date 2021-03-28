const admin = require('../firebase');
const User = require('../models/user');

exports.authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    req.user = firebaseUser;
    next();
  } catch (error) {
    console.log({ error });
    // res.status(401).json({ err: 'Invalid or expired token' });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email });
    if (user.role !== 'admin') {
      res.status(403).json({ err: 'Admin resource. Access not allow' });
    } else {
      next();
    }
  } catch (error) {
    console.log({ error });
  }
};
