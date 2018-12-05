module.exports = app => {
    const {existsOrError, notExistsOrError} = app.api.validation
    
    const save = (req, res) => {
        const checklist = {
            id: req.body.id,
            description: req.body.description,
            parentId: req.body.parentId
        }  
        
        if(req.params.id) checklist.id = req.params.id

        try{
            existsOrError(checklist.description, 'Description was not informed!')
        } catch (msg) {
            return res.status(400).json({errors: [msg]})
        }        

        if(checklist.id) {
            app.db('checklists')
                .update(checklist)
                .where({id: checklist.id})
                .then(id => res.json({...checklist, id:Number(checklist.id)}))
                .catch(err => res.status(500).json({errors: [err]}))     
        } else {
            app.db('checklists')
                .insert(checklist, 'id')
                .then(id => res.json({...checklist, id:Number(id[0])}))
                .catch(err => res.status(500).json({errors: [err]}))
        }
    }

    const remove = async (req, res) => {
        try{
            existsOrError(req.params.id, "Checklist id was not informed!")

            const subChecklists = await app.db('checklists').where({parentId: req.params.id})

            notExistsOrError(subChecklists, "This checklist has subchecklists!")

            const rowsDeleted = await app.db('checklists').where({ id: req.params.id }).del()

            existsOrError(rowsDeleted, "Checklist was not found!")

            res.status(204).send()
        } catch (msg) {
            res.status(400).json({errors: [msg]})
        }
    }

    const withPath = checklists => {
        const getParent = (checklists, parentId) => {
            const parent = checklists.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        const checklistsWithPath = checklists.map(checklist => {
            let path = checklist.description
            let parent = getParent(checklists, checklist.parentId)

            while(parent) {
                path = `${parent.description} > ${path}`
                parent = getParent(checklists, parent.parentId)
            }

            return { ...checklist, path }
        })

        checklistsWithPath.sort((a, b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return checklistsWithPath
    }

    const get = (req, res) => {
        app.db('checklists')
            .then(checklists => res.json(withPath(checklists)))
            .catch(err => res.status(500).json({errors: [err]}))
    }

    const getById = (req, res) => {
        app.db('checklists')
        .where({ id: req.params.id })
        .first()
        .then(checklist => res.json(checklist))
        .catch(err => res.status(500).json({errors: [err]}))
    }

    const toTree = (checklists, tree) => {
        if(!tree) tree = checklists.filter(c => !c.parentId)
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(checklists, checklists.filter(isChild))
            parentNode.value = 0
            return parentNode
        })
        return tree
    }

    const getTree = (req, res) => {
        app.db('checklists')
            .then(checklists => res.json(toTree(checklists)))
            .catch(err => res.status(500).json({errors: [err]}))
    }

    return {save, remove, get, getById, getTree}
}