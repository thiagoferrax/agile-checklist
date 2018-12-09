module.exports = app => {
    const {existsOrError} = app.api.validation

    const get = (req, res) => {
        app.db('users').first()
            .then(user => {                
                res.json({projects: 7, evaluations: 10, comments: 6})
            })
            .catch(err => res.status(500).json({errors: [err]}))
    }

    return {get}
}