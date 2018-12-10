module.exports = app => {
    const {existsOrError} = app.api.validation
    const get = (req, res) => {

        const summary = {projects: 0, evaluations: 0, comments: 0}
        
        app.db('users').first()
            .then(user => {                
                app.db('projects').where({userId:user.id}).
                then(projects => {
                    summary.projects = projects
                    app.db('evaluations').where({userId:user.id}).
                    then(evaluations => {
                        summary.evaluations = evaluations.length
                        res.json(summary)
                    })
                })
                .catch(err => res.status(500).json({errors: [err]}))
            })
            .catch(err => res.status(500).json({errors: [err]}))
    }

    return {get}
}