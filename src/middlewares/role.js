const checkRole = (roleRequired) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== roleRequired) {
      return res.status(403).json({ message: 'Forbidden - not enough permission' });
    }
    next();
  };
};

module.exports = checkRole;
