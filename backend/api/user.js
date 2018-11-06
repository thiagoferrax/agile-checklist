module.exports = app => {
    const {existsOrError, notExistsOrError} = app.api.validation
    
    const save = (req, res) => {
        const user = {
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            admin: req.body.admin
        }
      
        if(req.params.id) user.id = req.params.id

        try{
            existsOrError(user.name, 'Name was not informed!')
            existsOrError(user.email, 'Email was not informed!')
            existsOrError(user.password, 'Password was not informed!')
            existsOrError(user.admin, 'Admin was not informed!')
        } catch (msg) {
            return res.status(400).send(msg)
        }        

        delete user.confirmPassword
        if(user.id) {
            app.db('users')
                .update(user)
                .where({id: user.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))     
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try{
            existsOrError(req.params.id, "User id was not informed!")

            const subusers = await app.db('users').where({email: req.params.id})

            notExistsOrError(subusers, "This user has subusers!")

            const rowsDeleted = await app.db('users').where({ id: req.params.id }).del()

            existsOrError(rowsDeleted, "user was not found!")

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('users')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('users')
        .where({ id: req.params.id })
        .first()
        .then(user => res.json(user))
        .catch(err => res.status(500).send(err))
    }

    return {save, remove, get, getById}
}