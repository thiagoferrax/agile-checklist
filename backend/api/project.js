module.exports = app => {
    const {existsOrError, notExistsOrError} = app.api.validation
    
    const save = (req, res) => {
        const project = {
            id: req.body.id,
            name: req.body.name,
            team: req.body.team,
            userId: req.decoded.id
        }        

        if(req.params.id) project.id = req.params.id

        try{
            existsOrError(project.name, 'Name was not informed!')
            existsOrError(project.userId, 'User was not informed!')
            existsOrError(project.team, 'Team was not informed!')
        } catch (msg) {
            return res.status(400).json({errors: [msg]})
        }        
        
        const team = project.team
        delete project.team

        if(project.id) {            
            app.db('projects')
                .update(project)
                .where({id: project.id})
                .then(_ => {
                    if(team && team.length > 0) {
                        updateTeam(project.id, team, res)
                    } else {
                        res.status(204).send()
                    }
                })
                .catch(err => res.status(500).json({errors: [err]}))     
        } else {
            app.db('projects')
                .insert(project)
                .returning('id')
            .then(projectId => insertTeam(projectId[0], team, res))
                .catch(err => res.status(500).json({errors: [err]}))
        }
    }

    const updateTeam = (projectId, team, res) => {
        app.db('teams').where({ projectId: projectId }).del().then(
            rowsDeleted => {               
                insertTeam(projectId, team, res)            
            }    
        )           
    }    

    const insertTeam = (projectId, team, res) => {
        const rows = getTeamToInsert(projectId, team)

        const chunkSize = rows.lenght
        app.db.batchInsert('teams', rows, chunkSize)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    const getTeamToInsert = (projectId, team, initialTeam = []) => {
        return team.reduce((users, userId) => {
            users.push({projectId, userId})
            return users
        }, initialTeam)
    }

    const remove = (req, res) => {
        const projectId = req.params.id

        try{
            existsOrError(projectId, "Project id was not informed!")

            app.db('teams').where({ projectId }).del().then(
                teamDeleted => {   
                    
                    const rowsDeleted = app.db('projects').where({ id: projectId }).del()
                    
                    existsOrError(rowsDeleted, "Project was not found!")
                    res.status(204).send()
                }    
            )
        } catch (msg) {
            res.status(400).json({errors: [msg]})
        }
    }

    const get = (req, res) => {        
        const userId = req.decoded.id

        app.db.select(
            {
                id: 'projects.id',
                name: 'projects.name',
                userId: 'projects.userId',
            }
        ).from('projects')
            .leftJoin('teams', 'teams.projectId', 'projects.id')
            .leftJoin('users', 'teams.userId', 'users.id')
            .where({ 'projects.userId': userId }).orWhere({ 'users.id': userId })
            .then(projects => {

                const projectsMap = projects.reduce((map, project) => {
                    map[project.id] = project
                    return map
                }, {})

                res.json(Object.values(projectsMap))          
            })
            .catch(err => res.status(500).json({ errors: [err] }))       
    }

    const getById = (req, res) => {
        app.db.select(
            {
                id: 'projects.id',
                name: 'projects.name',
                userId: 'projects.userId',
                memberId: 'users.id'
            }
        ).from('projects')
            .leftJoin('teams', 'teams.projectId', 'projects.id')
            .leftJoin('users', 'teams.userId', 'users.id')
            .where({ 'projects.id': req.params.id })
            .then(projectTeam => {
                    let project = {
                            id: projectTeam[0].id,
                            name: projectTeam[0].name,
                            userId: projectTeam[0].userId,
                            team: []
                        }

                    project.team = projectTeam.reduce((team, member) => {
                        team.push(member.memberId)     
                        return team
                    }, [])

                    res.json(project)
                })
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    return {save, remove, get, getById}
}