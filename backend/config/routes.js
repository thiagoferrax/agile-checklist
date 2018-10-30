module.exports = app => {
    app.route('/checklists').post(app.api.checklist.save)
}   