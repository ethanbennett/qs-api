exports.up = function(knex, Promise) {
  let createQuery = `CREATE TABLE foods(
    id SERIAL PRIMARY KEY NOT NULL,
    food_name TEXT,
    calories TEXT,
    created_at TIMESTAMP
  )`;
  return knex.raw(createQuery);
};

exports.down = function(knex, Promise) {
  let dropQuery = `DROP TABLE foods`;
  return knex.raw(dropQuery);
};