
exports.up = function (knex, Promise) {
    return knex.schema.createTable('projects', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.integer('userId').references('id').inTable('users').notNull()
        table.timestamps() 
    })
};


exports.down = function (knex, Promise) {
    return knex.schema.dropTable('projects')
};
