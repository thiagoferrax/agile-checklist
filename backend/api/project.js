module.exports = app => {
    const {existsOrError, notExistsOrError} = app.api.validation
    
    const save = (req, res) => {
        const project = {
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            type: req.body.type,
            complexity: req.body.complexity,
            estimatedDuration: req.body.estimatedDuration,            
            userId: req.body.userId, 
        }
      
        if(req.params.id) project.id = req.params.id

        try{
            existsOrError(project.name, 'Name was not informed!')
            existsOrError(project.description, 'Description was not informed!')
            existsOrError(project.type, 'Type was not informed!')
            existsOrError(project.complexity, 'Complexity was not informed!')
            existsOrError(project.estimatedDuration, 'Estimated Duration was not informed!')
            existsOrError(project.userId, 'User was not informed!')
        } catch (msg) {
            return res.status(400).send(msg)
        }        

        if(project.id) {
            app.db('projects')
                .update(project)
                .where({id: project.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))     
        } else {
            app.db('projects')
                .insert(project)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try{
            existsOrError(req.params.id, "Project id was not informed!")

            const subprojects = await app.db('projects').where({description: req.params.id})

            notExistsOrError(subprojects, "This project has subprojects!")

            const rowsDeleted = await app.db('projects').where({ id: req.params.id }).del()

            existsOrError(rowsDeleted, "Project was not found!")

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('projects')
            .then(projects => res.json(projects))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('projects')
        .where({ id: req.params.id })
        .first()
        .then(project => res.json(project))
        .catch(err => res.status(500).send(err))
    }

    return {save, remove, get, getById}
}