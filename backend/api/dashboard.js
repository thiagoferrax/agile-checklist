const { array2map } = require('../common/mapUtil')

module.exports = app => {
    const { existsOrError } = app.api.validation

    const getProjects = (userId) => new Promise((resolve, reject) => {
        const summary = { projects: 0, evaluations: 0, number_evaluations: 0, members: 0, comments: 0 }

        app.db.select({
            id: 'projects.id',
            name: 'projects.name',
            userId: 'projects.userId',
            memberId: 'users.id'
        }).from('projects')
            .leftJoin('teams', 'teams.projectId', 'projects.id')
            .leftJoin('users', 'teams.userId', 'users.id')
            .where({ 'projects.userId': userId })
            .orWhere({ 'users.id': userId })
            .then(projects => {
                const projectsMap = array2map(projects, 'id')
                summary.projectsIds = Object.keys(projectsMap)
                summary.projects = Object.values(projectsMap)

                resolve(summary)
            })
            .catch(err => reject(err))
    })

    const getTeam = (summary) => new Promise((resolve, reject) => {
        app.db('teams').countDistinct('userId')
            .whereIn('projectId', summary.projectsIds)
            .then(members => {
                summary.members = members[0].count

                resolve(summary)
            })
            .catch(err => reject(err))
    })

    const mergeEvaluations = (evaluations) => {
        const evaluationsMap = evaluations.reduce((map, evaluation) => {
            const key = `${evaluation.projectId}_${evaluation.sprint}`
            if (map[key]) {
                map[key].score = map[key].score + evaluation.score
                map[key].qtd = map[key].qtd + 1
            } else {
                map[key] = evaluation
                map[key].qtd = 1
            }

            return map
        }, {})

        const caculatedEvaluations = Object.values(evaluationsMap)

        caculatedEvaluations.forEach(evaluation => {
            evaluation.score = (evaluation.score / evaluation.qtd).toFixed(2)
        })

        return caculatedEvaluations
    }

    const getEvaluations = (summary) => new Promise((resolve, reject) => {
        app.db.select({
            id: 'evaluations.id',
            projectId: 'evaluations.projectId',
            sprint: 'evaluations.sprint',
            checklistId: 'evaluations.checklistId',
            score: 'evaluations.score',
            userId: 'evaluations.userId',
            date: 'evaluations.date',
            checklistDescription: 'checklists.description'
        }).from('evaluations')
            .leftJoin('checklists', 'evaluations.checklistId', 'checklists.id')
            .whereIn('evaluations.projectId', summary.projectsIds)
            .then(evaluations => {
                

                summary.number_evaluations = evaluations.length
                summary.evaluations = mergeEvaluations(evaluations)

                resolve(summary)
            }).catch(err => reject(err))
    })

    const get = (req, res) => {
        const userId = req.decoded.id

        getProjects(userId)
            .then(getTeam)
            .then(getEvaluations)
            .then(summary => res.json(summary))
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    return { get }
}