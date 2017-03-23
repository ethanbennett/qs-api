exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE foods RESTART IDENTITY')
  .then(() => {
    return Promise.all([
      knex.raw(
        'INSERT INTO foods (food_name, calories, created_at) VALUES (?, ?, ?)',
        ["potatoes", "400", new Date]
      ),
      knex.raw(
        'INSERT INTO foods (food_name, calories, created_at) VALUES (?, ?, ?)',
        ["beets", "3", new Date]
      ),
      knex.raw(
        'INSERT INTO foods (food_name, calories, created_at) VALUES (?, ?, ?)',
        ["poison", "0", new Date]
      )
    ]);
  });
};