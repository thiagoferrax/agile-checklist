const { array2map } = require('../common/mapUtil')

module.exports = app => {
    const { existsOrError } = app.api.validation

    const buildTimeline = (timelineData, type, entities) => {
        return entities.reduce((data, entity) => {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
            const date = entity.time.toLocaleDateString('en-US', options)
            if (!data[date]) {
                data[date] = []
            }
            data[date].push({
                type,
                data: { ...entity, time: entity.time.toLocaleTimeString('en-US') }
            })
            return data
        }, timelineData)
    }

    const getProjects = (userId) => new Promise((resolve, reject) => {
        const summary = { timeline: { data: {} } }

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
            .where({ 'projects.userId': userId })
            .orWhere({ 'users.id': userId })
            .then(projects => {
                summary.team = projects && projects.reduce((users, member) => {
                    users.push({ userId: member.memberId, user: member.memberName, time: member.memberTime })
                    return users
                }, [])
                summary.timeline.data = buildTimeline(summary.timeline.data, 'user', summary.team)             

                const usersMap = array2map(summary.team, 'userId')

                let projectsMap = array2map(projects, 'id')
                const projectIds = Object.keys(projectsMap)
                projectIds.forEach(id => {                    
                    const user = usersMap[projectsMap[id].userId].user
                    projectsMap[id] = {...projectsMap[id], user}
                })
                            
                summary.projects = Object.values(projectsMap)
                summary.timeline.data = buildTimeline(summary.timeline.data, 'project', summary.projects)
                resolve(summary)
            })
            .catch(err => reject(err))
    })

    const get = (req, res) => {
        const userId = req.decoded.id

        getProjects(userId)
            .then(summary => res.json(summary.timeline))
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    return { get }
}