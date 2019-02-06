exports.up = function(knex, Promise) {
    return knex.schema.createTable('teams', table => {
        table.increments('id').primary()
        table.integer('projectId').references('id').inTable('projects').notNull()
        table.integer('userId').references('id').inTable('users').notNull()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('teams')
};