module.exports = app => {
    app.route('/checklists')
        .post(app.api.checklist.save)
        .get(app.api.checklist.get)

    app.route('/checklists/:id')
        .put(app.api.checklist.save)
        .delete(app.api.checklist.remove)
        .get(app.api.checklist.getById)
}   