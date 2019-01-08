module.exports = app => {
    app.route('/signup').post(app.api.user.save)
    app.route('/signin').post(app.api.auth.signin)
    app.route('/validateToken').post(app.api.auth.validateToken)

    app.route('/checklists')
        .post(app.api.checklist.save)
        .get(app.api.checklist.get)

    app.route('/checklists/clone')
        .post(app.api.checklist.clone)        

    app.route('/checklists/tree')
        .get(app.api.checklist.getTree)

    app.route('/checklists/:id')
        .put(app.api.checklist.save)
        .delete(app.api.checklist.remove)
        .get(app.api.checklist.getById)      

    app.route('/projects')
        .post(app.api.project.save)
        .get(app.api.project.get)

    app.route('/projects/:id')
        .put(app.api.project.save)
        .delete(app.api.project.remove)
        .get(app.api.project.getById)  

    app.route('/evaluations')
        .post(app.api.evaluation.save)
        .get(app.api.evaluation.get)

    app.route('/evaluations/:id')
        .put(app.api.evaluation.save)
        .delete(app.api.evaluation.remove)
        .get(app.api.evaluation.getById)  
        
    app.route('/evaluations/:id/answers')
        .get(app.api.evaluation.getAnswers)

    app.route('/dashboard/summary')
        .get(app.api.dashboard.get)
}   