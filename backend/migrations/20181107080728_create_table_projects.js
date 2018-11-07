
exports.up = function(knex, Promise) {
    return knex.schema.createTable('projects', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('description').notNull()
        table.string('type').notNull()
        table.string('complexity').notNull()
        table.float('estimatedDuration').notNull()
        table.integer('userId').references('id')
        .inTable('users').notNull()
    })  
};


exports.down = function(knex, Promise) {
    return knex.schema.dropTable('projects')
};
