const { array2map } = require('../common/mapUtil')

module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const checklist = {
            id: req.body.id,
            description: req.body.description,
            parentId: req.body.parentId,
            userId: req.decoded.id
        }

        if (req.params.id) checklist.id = req.params.id

        try {
            existsOrError(checklist.description, 'Item description was not informed!')
            existsOrError(checklist.userId, 'User was not informed!')

        } catch (msg) {
            return res.status(400).json({ errors: [msg] })
        }

        if (checklist.id) {
            if (checklist.parentId) {
                if (+checklist.id === +checklist.parentId) {
                    res.status(400).json({ errors: ['Circular reference is not permitted!'] })
                } else {
                    app.db('checklists').then(checklists => withPath(checklists)).then(tree => {
                        const parentIds = tree.filter(c => c.id === checklist.parentId)[0].parentPathIds
                        if (parentIds.includes(+checklist.id)) {
                            res.status(400).json({ errors: ['Circular reference is not permitted!'] })
                        } else {
                            update(req, res)
                        }
                    })
                }
            } else {
                update(req, res)
            }
        } else {
            checklist.created_at = new Date()
            checklist.updated_at = null

            app.db('checklists')
                .insert(checklist, 'id')
                .then(id => res.json({ ...checklist, id: Number(id[0]) }))
                .catch(err => res.status(500).json({ errors: [err] }))
        }
    }

    const update = (req, res) => {
        const checklist = {
            id: req.body.id,
            description: req.body.description,
            parentId: req.body.parentId,
        }

        if (req.params.id) checklist.id = req.params.id

        checklist.updated_at = new Date()

        app.db('checklists')
            .update(checklist)
            .where({ id: checklist.id })
            .then(id => res.json({ ...checklist, id: Number(checklist.id) }))
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, "Checklist id was not informed!")

            const subChecklists = await app.db('checklists').where({ parentId: req.params.id })

            notExistsOrError(subChecklists, "This checklist has items!")

            const evaluations = await app.db('evaluations').where({ checklistId: req.params.id })

            notExistsOrError(evaluations, "There are evaluations with this checklist!")

            const rowsDeleted = await app.db('checklists').where({ id: req.params.id }).del()

            existsOrError(rowsDeleted, "Checklist was not found!")

            res.status(204).send()
        } catch (msg) {
            res.status(400).json({ errors: [msg] })
        }
    }

    const withPath = checklists => {
        const getParent = (checklists, parentId) => {
            const parent = checklists.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        const checklistsWithPath = checklists.map(checklist => {
            let path = checklist.description
            const parentPathIds = []
            let parentPath = ''
            let parent = getParent(checklists, checklist.parentId)

            while (parent) {
                path = `${parent.description} > ${path}`
                parentPath = parentPath ? `${parent.description} > ${parentPath}` : parent.description
                parentPathIds.push(parent.id)
                parent = getParent(checklists, parent.parentId)
            }

            return { ...checklist, path, parentPath, parentPathIds }
        })

        checklistsWithPath.sort((a, b) => {
            if (a.path < b.path) return -1
            if (a.path > b.path) return 1
            return 0
        })
        return checklistsWithPath
    }

    const getProjectsIds = (userId) => new Promise((resolve, reject) => {
        let projectsIds = []
        app.db.select({
            id: 'projects.id',
        }).from('projects')
            .leftJoin('teams', 'teams.projectId', 'projects.id')
            .leftJoin('users', 'teams.userId', 'users.id')
            .where({ 'projects.userId': userId })
            .orWhere({ 'users.id': userId })
            .then(projects => {
                if (projects.length > 0) {
                    const projectsMap = array2map(projects, 'id')
                    projectsIds = Object.keys(projectsMap)
                }
                resolve({ userId, projectsIds })
            })
            .catch(err => reject(err))
    })

    const getTeam = projects => {
        const distinctUsers = {}
        return projects && projects.reduce((users, member) => {
            if (!distinctUsers[member.memberId]) {
                distinctUsers[member.memberId] = 1
                users.push({ userId: member.memberId, user: member.memberName, time: member.memberTime })
            }
            return users
        }, [])
    }

    const getMembersIds = ({ userId, projectsIds }) => new Promise((resolve, reject) => {
        let membersIds = [userId]
        if (projectsIds.length === 0) {
            resolve(membersIds)
        } else {
            app.db.select({
                id: 'projects.id',
                memberId: 'users.id',
                memberName: 'users.name',
                memberTime: 'users.created_at'
            }).from('projects')
                .leftJoin('teams', 'teams.projectId', 'projects.id')
                .leftJoin('users', 'teams.userId', 'users.id')
                .whereIn('projects.id', projectsIds)
                .then(projects => {
                    if (projects.length > 0) {
                        const team = getTeam(projects)
                        const usersMap = array2map(team, 'userId')
                        membersIds = Object.keys(usersMap)
                    }

                    resolve(membersIds)
                })
                .catch(err => reject(err))
        }

    })

    const getChecklists = (membersIds) => new Promise((resolve, reject) => {
        app.db('checklists')
            .whereIn('checklists.userId', membersIds)
            .then(checklists => resolve(withPath(checklists)))
            .catch(err => reject(err))
    })

    const removeItemsWithoutRoot = (checklists) => new Promise((resolve, reject) => {
        const getNewList = (tree, initialList = []) => {
            return tree && tree.reduce((newList, checklist) => {
                newList.push(checklist)
                return getNewList(checklist.children, newList)
            }, initialList)
        }

        const itemsWithRoot = toTree(checklists)
        const newList = getNewList(itemsWithRoot)

        resolve(newList)
    })

    const get = (req, res) => {
        return getProjectsIds(req.decoded.id)
            .then(getMembersIds)
            .then(getChecklists)
            .then(removeItemsWithoutRoot)
            .then(checklists => res.json(withPath(checklists)))
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    const getById = (req, res) => {
        app.db('checklists')
            .where({ id: req.params.id })
            .first()
            .then(checklist => res.json(checklist))
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    const toTree = (checklists, tree) => {
        if (!tree) tree = checklists.filter(c => !c.parentId)
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId === parentNode.id
            parentNode.children = toTree(checklists, checklists.filter(isChild))
            return parentNode
        })
        return tree
    }

    const getTree = (req, res) => {
        return getProjectsIds(req.decoded.id)
            .then(getMembersIds)
            .then(getChecklists)
            .then(checklists => res.json(toTree(checklists)))
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    const clone = (req, res) => {
        const checklist = req.body.checklist

        try {
            existsOrError(checklist, 'Parent path was not informed!')

            checklist.description += ' (NEW)'
            saveChecklist(checklist, checklist.parentId, res)

            res.status(204).send()
        } catch (msg) {
            res.status(400).json({ errors: [msg] })
        }
    }

    const saveChecklist = (item, parentId, res) => {

        item.parentId = parentId

        const children = item.children

        delete item.id
        delete item.children

        app.db('checklists').insert(item, 'id').then(newId => {
            if (children) {
                children.forEach(child => {
                    saveChecklist(child, newId[0], res)
                })
            }
        })
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    const getChecklistsToInsert = (checklist, initialChecklists = []) => {
        return checklist.reduce((checklists, item) => {
            checklists.push({ description: item.description, parentId: item.parentId })
            return getChecklistsToInsert(item.children, checklists)
        }, initialChecklists)
    }

    return { save, remove, get, getById, getTree, clone }
}