// Update with your config settings.

module.exports = {
    client: 'postgresql',
    connection: {
      host: 'database',
      db: 'agile_checklist',
      user:     'postgres',
      password: 'postgres'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
};
