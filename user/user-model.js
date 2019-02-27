const db = require('../database/dbConfig');

module.exports = {
  add,
  get,
  getBy,
  getById
};

function get() {
  return db('user');
}

function getBy(username) {
  return db('user')
    .where({ username })
    .first();
}

function getById(id) {
  return db('user')
    .where('user.id', id)
    .first();
}

function add(newUser) {
  return db('user').insert(newUser);

  // for production on pg
  // .then(() => db('user').then(users => users.length + 1))
  // .then(id => getById(id));
}
