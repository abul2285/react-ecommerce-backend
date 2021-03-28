const User = require('../models/user');

exports.createOrUpdateUser = async (req, res) => {
  const { email, name, picture } = req.user;
  const user = await User.findOneAndUpdate(
    { email },
    { name, picture },
    { new: true }
  );

  if (user) {
    res.json(user);
  } else {
    console.log('user created');
    const newUser = await new User({ name, email, picture }).save();
    res.json(newUser);
  }
};

exports.currentUser = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  if (user) {
    return res.json(user);
  }

  return res.json({ err: 'user not found' });
};
