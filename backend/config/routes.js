module.exports = app => {
    app.route('/checklists')
        .post(app.api.checklist.save)
        .get(app.api.checklist.get)

    app.route('/checklists/tree')
        .get(app.api.checklist.getTree)

    app.route('/checklists/:id')
        .put(app.api.checklist.save)
        .delete(app.api.checklist.remove)
        .get(app.api.checklist.getById)    

    app.route('/users')
        .post(app.api.user.save)
        .get(app.api.user.get)

    app.route('/users/:id')
        .put(app.api.user.save)
        .delete(app.api.user.remove)
        .get(app.api.user.getById)        
}   