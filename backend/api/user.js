module.exports = app => {
    const {existsOrError, notExistsOrError} = app.api.validation
    
    const save = (req, res) => {
        const user = {
            id: req.body.id,
            name: req.body.name,
            parentId: req.body.parentId
        }
      
        if(req.params.id) user.id = req.params.id

        try{
            existsOrError(user.name, 'Name was not informed!')
        } catch (msg) {
            return res.status(400).send(msg)
        }        

        if(user.id) {
            app.db('users')
                .update(user)
                .where({id: user.id})
                .then(id => res.json({...user, id:Number(user.id)}))
                .catch(err => res.status(500).send(err))     
        } else {
            app.db('users')
                .insert(user, 'id')
                .then(id => res.json({...user, id:Number(id[0])}))
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try{
            existsOrError(req.params.id, "User id was not informed!")

            const subusers = await app.db('users').where({parentId: req.params.id})

            notExistsOrError(subusers, "This user has subusers!")

            const rowsDeleted = await app.db('users').where({ id: req.params.id }).del()

            existsOrError(rowsDeleted, "user was not found!")

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const withPath = users => {
        const getParent = (users, parentId) => {
            const parent = users.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        const usersWithPath = users.map(user => {
            let path = user.name
            let parent = getParent(users, user.parentId)

            while(parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(users, parent.parentId)
            }

            return { ...user, path }
        })

        usersWithPath.sort((a, b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return usersWithPath
    }

    const get = (req, res) => {
        app.db('users')
            .then(users => res.json(withPath(users)))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('users')
        .where({ id: req.params.id })
        .first()
        .then(user => res.json(user))
        .catch(err => res.status(500).send(err))
    }

    const toTree = (users, tree) => {
        if(!tree) tree = users.filter(c => !c.parentId)
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(users, users.filter(isChild))
            return parentNode
        })
        return tree
    }

    const getTree = (req, res) => {
        app.db('users')
            .then(users => res.json(toTree(users)))
            .catch(err => res.status(500).send(err))
    }

    return {save, remove, get, getById, getTree}
}