const { array2map } = require('../common/mapUtil')

module.exports = app => {
    const { existsOrError } = app.api.validation

    const buildTimeline = (timelineData, type, entities) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

        return entities.reduce((data, entity) => {
            const time = entity.time
            const date = time.toLocaleDateString('en-US', options)
            if (!data[date]) {
                data[date] = []
            }
            data[date].push({
                type,
                data: { ...entity, 
                        time, 
                        formattedTime: time.toLocaleTimeString('en-US') 
                    }
            })
            return data
        }, timelineData)
    }

    const buildUserName = (entityMap, usersMap) => {
        const ids = Object.keys(entityMap)
        ids.forEach(id => {
            const user = usersMap[entityMap[id].userId].user
            entityMap[id] = { ...entityMap[id], user }
        })
    }

    const getProjectsIds = (userId) => new Promise((resolve, reject) => {
        const summary = { timeline: { data: {} }, userId }

        app.db.select({
            id: 'projects.id',
        }).from('projects')
            .leftJoin('teams', 'teams.projectId', 'projects.id')
            .leftJoin('users', 'teams.userId', 'users.id')
            .where({ 'projects.userId': userId })
            .orWhere({ 'users.id': userId })
            .then(projects => {
                const projectsMap = array2map(projects, 'id')
                summary.projectsIds = Object.keys(projectsMap)
                resolve(summary)
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

    const getProjects = (summary) => new Promise((resolve, reject) => {
        app.db.select({
            id: 'projects.id',
            project: 'projects.name',
            userId: 'projects.userId',
            time: 'projects.created_at',
            memberId: 'users.id',
            memberName: 'users.name',
            memberTime: 'users.created_at'
        }).from('projects')
            .leftJoin('teams', 'teams.projectId', 'projects.id')
            .leftJoin('users', 'teams.userId', 'users.id')
            .whereIn('projects.id', summary.projectsIds)
            .then(projects => {
                summary.team = getTeam(projects)
                summary.timeline.data = buildTimeline(summary.timeline.data, 'user', summary.team)

                summary.usersMap = array2map(summary.team, 'userId')
                summary.membersIds = Object.keys(summary.usersMap)

                const projectsMap = array2map(projects, 'id')
                buildUserName(projectsMap, summary.usersMap)

                summary.projectsIds = Object.keys(projectsMap)
                summary.projects = Object.values(projectsMap)
                summary.timeline.data = buildTimeline(summary.timeline.data, 'project', summary.projects)
                resolve(summary)
            })
            .catch(err => reject(err))
    })

    const getChecklists = (summary) => new Promise((resolve, reject) => {
        app.db.select({
            id: 'checklists.id',
            checklist: 'checklists.description',
            user: 'users.name',
            time: 'checklists.created_at',
        }).from('checklists')
            .leftJoin('users', 'checklists.userId', 'users.id')
            .whereIn('checklists.userId', summary.membersIds)
            .where('checklists.parentId', null)
            .then(checklists => {
                summary.timeline.data = buildTimeline(summary.timeline.data, 'checklist', checklists)
                resolve(summary)
            }).catch(err => reject(err))
    })

    const getEvaluations = (summary) => new Promise((resolve, reject) => {
        app.db.select({
            id: 'evaluations.id',
            project: 'projects.name',
            sprint: 'evaluations.sprint',
            checklist: 'checklists.description',
            score: 'evaluations.score',
            user: 'users.name',
            time: 'evaluations.created_at',
        }).from('evaluations')
            .leftJoin('projects', 'evaluations.projectId', 'projects.id')
            .leftJoin('checklists', 'evaluations.checklistId', 'checklists.id')
            .leftJoin('users', 'evaluations.userId', 'users.id')
            .whereIn('evaluations.projectId', summary.projectsIds)
            .then(evaluations => {
                summary.timeline.data = buildTimeline(summary.timeline.data, 'evaluation', evaluations)
                resolve(summary)
            }).catch(err => reject(err))
    })

    const getSingleUser = (summary) => new Promise((resolve, reject) => {
        if (Object.keys(summary.timeline.data).length < 1) {
            app.db.select({
                id: 'users.id',
                user: 'users.name',
                time: 'users.created_at'
            }).from('users')
                .where('users.id', summary.userId)
                .first()
                .then(user => {
                    summary.timeline.data = buildTimeline(summary.timeline.data, 'user', [user])
                    resolve(summary)
                }).catch(err => reject(err))
        } else {
            resolve(summary)
        }
    })

    const get = (req, res) => {
        getProjectsIds(req.decoded.id)
            .then(getProjects)
            .then(getChecklists)
            .then(getEvaluations)
            .then(getSingleUser)
            .then(summary => res.json(summary.timeline))
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    return { get }
}