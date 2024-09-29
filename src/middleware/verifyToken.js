import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - Token is missing',
    });
  }

  try {
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      decoded = undefined;
    }

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Token is invalid',
      });
    }

    req.userId = decoded.userId;

    next();
  } catch (err) {
    console.log('Error in verify token: ', err);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later',
    });
  }
};
