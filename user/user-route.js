// env access
require('dotenv').config();

// package imports
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// router extension
const router = express.Router();

// data imports
const users = require('./user-model');

// middleware
const { auth } = require('../auth/auth');
const { checkRole } = require('../auth/checkRole');

// from env
const secret = process.env.SECRET;

// incoming /api

// generate token
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
    // additional information here
  };
  const options = {
    expiresIn: '1d'
  };

  return jwt.sign(payload, secret, options);
}

// register user, send token and user id
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const newUser = req.body;

  const hash = bcrypt.hashSync(newUser.password, 5);
  newUser.password = hash;

  if ((!username, !password)) {
    res.status(400).json({ message: 'Username and password required.' });
  }

  users
    .add(newUser)
    .then(user => {
      const token = generateToken(user);
      res
        .status(200)
        .json({ message: 'Registration successful', userId: user.id, token });
    })
    .catch(err => res.status(500).json(err));
});

// login user, send token and user id
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if ((!username, !password)) {
    // no username or password
    res.status(400).json({ message: 'Username and password required.' });
  }

  users
    .getBy(username)
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res
          .status(200)
          .json({ message: 'Login successful', userId: user.id, token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    })
    .catch(err => res.status(500).json(err));
});

// protected route, admin access only
router.get('/users', auth, (req, res) => {
  users
    .get()
    .then(users => {
      res.json({ users });
    })
    .catch(err => res.send(err));
});

// logout handles on client side, must destroy token
module.exports = router;
