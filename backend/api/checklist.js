module.exports = app => {
    const {existsOrError, notExistsOrError} = app.api.validation
    
    const save = (req, res) => {
        const checklist = {...req.body}

        if(req.params.id) checklist.id = req.params.id

        try{
            existsOrError(checklist.description, 'Description was not informed!')
        } catch (msg) {
            return res.status(400).send(msg)
        }        

        if(checklist.id) {
            app.db('checklists')
                .update(checklist)
                .where({id: checklist.id})
                .then(_ => res.status(204).send(msg))
                .catch(err => res.status(500).send(err))
        } else {
            app.db('checklists')
                .insert(checklist)
                .then(_ => res.status(204).send(msg))
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try{
            existsOrError(req.params.id, "Checklist id was not informed!")

            const subChecklists = await app.db('checklists').where({parentId: req.params.id})

            notExistsOrError(subChecklists, "This checklist has subchecklists!")

            const rowsDeleted = await app.db('checklists').where({parentId: req.params.id}).del()

            existsOrError(rowsDeleted, "Checklist was not found!")

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        res.json('get')
    }

    const getById = (req, res) => {
        res.json('getById')
    }

    return {save, remove, get, getById}
}