const { array2map } = require('../common/mapUtil')

module.exports = app => {
    const { existsOrError } = app.api.validation
    
    const get = (req, res) => {

        const summary = { projects: 0, evaluations: 0, number_evaluations: 0, members: 0, comments: 0 }

        const userId = req.decoded.id

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
            .where({ 'projects.userId': userId }).orWhere({ 'users.id': userId })
            .then(projects => {
                const projectsMap = array2map(projects, 'id')
                
                summary.projects = Object.values(projectsMap)

                app.db('teams').countDistinct('userId').whereIn('projectId', Object.keys(projectsMap))
                    
                    .then(
                        members => {
                            summary.members = members[0].count

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
                                .whereIn('evaluations.projectId', Object.keys(projectsMap))
                                .then(evaluations => {

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

                                    summary.number_evaluations = evaluations.length
                                    summary.evaluations = caculatedEvaluations

                                    res.json(summary)
                                })
                        })
            })
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    return { get }
}