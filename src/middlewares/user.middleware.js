const { body } = require('express-validator');

exports.validateUser = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),

  body('email')
    .optional()
    .isEmail().withMessage('Invalid email address'),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Role must be either user or admin'),

  body('phone')
    .optional()
    .isMobilePhone().withMessage('Invalid phone number'),

  body('name')
    .optional()
    .isLength({ max: 50 }).withMessage('Name must be under 50 characters'),
];
