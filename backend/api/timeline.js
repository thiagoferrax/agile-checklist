const { array2map } = require('../common/mapUtil')

module.exports = app => {
    const { existsOrError } = app.api.validation

    const getProjects = (userId) => new Promise((resolve, reject) => {
        const summary = { timeline: { data: {} } }

        app.db.select({
            id: 'projects.id',
            project: 'projects.name',
            userId: 'projects.userId',
            user: 'users.name',
            memberId: 'users.id',
            time: 'projects.created_at'
        }).from('projects')
            .leftJoin('teams', 'teams.projectId', 'projects.id')
            .leftJoin('users', 'teams.userId', 'users.id')
            .where({ 'projects.userId': userId })
            .orWhere({ 'users.id': userId })
            .orderBy('projects.created_at', 'desc')
            .then(projects => {
                const projectsMap = array2map(projects, 'id')
                summary.projectsIds = Object.keys(projectsMap)
                summary.projects = Object.values(projectsMap)
                resolve(summary)
            })
            .catch(err => reject(err))
    })

    const getTimeline = (summary) => new Promise((resolve, reject) => {
        
        summary.timeline.data = summary.projects.reduce((timelineData, project) => {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const date = project.time.toLocaleDateString('en-US', options)
            if (!timelineData[date]) {
                timelineData[date] = []
            }
            timelineData[date].push({
                type: 'project',
                data: { ...project, time: project.time.toLocaleTimeString('en-US') }
            })
            return timelineData
        }, summary.timeline.data)

        resolve(summary)
    })

    const get = (req, res) => {
        const userId = req.decoded.id

        getProjects(userId)
            .then(getTimeline)
            .then(summary => res.json(summary.timeline))
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    return { get }
}