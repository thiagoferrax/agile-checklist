
exports.up = function(knex, Promise) {
    return knex.schema.createTable('evaluations', table => {
        table.increments('id').primary()
        table.integer('projectId').references('id').inTable('projects').notNull()
        table.string('sprint').notNull()
        table.integer('checklistId').references('id').inTable('checklists').notNull()
        table.integer('userId').references('id').inTable('users').notNull()
        table.date('date').notNull().defaultTo(Date.now().date)        
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('evaluations')
};
