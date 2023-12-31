// api/index.js
const express = require('express');
const apiRouter = express.Router();
require('dotenv').config()
const {requireUser} = require('../api/utils.cjs')

const jwt = require('jsonwebtoken');
const { getUserById } = require('../db/index.cjs');
const { JWT_SECRET } = process.env;

// set `req.user` if possible
apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  if (!auth) {
    // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      if (id) {
        req.user = await getUserById(id);
        requireUser(req.user.name)
        next();
      } else {
        next({
          name: 'AuthorizationHeaderError',
          message: 'Authorization token malformed',
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log('User is set:', req.user.name);
  }

  next();
});

const usersRouter = require('./users.cjs');
apiRouter.use('/users', usersRouter);

const postsRouter = require('./posts.cjs');
apiRouter.use('/posts', postsRouter);

const tagsRouter = require('./tags.cjs');
apiRouter.use('/tags', tagsRouter);

apiRouter.use((error, req, res, next) => {
  res.send(error);
});

module.exports = apiRouter;
