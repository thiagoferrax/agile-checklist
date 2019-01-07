module.exports = app => {
    const {existsOrError} = app.api.validation
    const get = (req, res) => {

        const summary = {projects: 0, evaluations: 0, comments: 0}
        
        app.db('users').first()
            .then(user => {                
                existsOrError(user, 'Nao ha usuarios no banco!')

                app.db('projects').where({userId:user.id}).
                then(projects => {
                    summary.projects = projects
                    app.db.select(
                        {
                            id: 'evaluations.id',
                            projectId: 'evaluations.projectId',
                            sprint: 'evaluations.sprint',
                            checklistId: 'evaluations.checklistId',
                            score: 'evaluations.score',
                            userId: 'evaluations.userId',
                            date: 'evaluations.date',
                            checklistDescription: 'checklists.description'
                        } 
                    ).from('evaluations')
                        .leftJoin('checklists', 'evaluations.checklistId', 'checklists.id').where({'evaluations.userId':user.id}).
                    then(evaluations => {
                        summary.evaluations = evaluations

                        let evaluationsPerChecklist = evaluations.reduce((lastEvaluationsPerChecklist, evaluation) => {
                            const checklistId = evaluation.checklistId
                            if(lastEvaluationsPerChecklist.hasOwnProperty(checklistId)) {
                                if(lastEvaluationsPerChecklist[checklistId].date < evaluation.date) {
                                    lastEvaluationsPerChecklist[checklistId] = evaluation
                                }
                            } else {
                                lastEvaluationsPerChecklist[checklistId] = evaluation
                            }
                            return lastEvaluationsPerChecklist
                        }, {})

                        const values = Object.values(evaluationsPerChecklist)
                        let index = 0
                        values.map(e => {
                            app.db.select(
                                {
                                    id: 'answers.id',
                                    evaluationId: 'answers.evaluationId',
                                    checklistId: 'answers.checklistId',
                                    description: 'checklists.description',
                                    parentId: 'checklists.parentId',
                                    value: 'answers.value'       
                                }
                            ).from('answers')
                                .leftJoin('checklists', 'answers.checklistId', 'checklists.id')
                                .where({ 'answers.evaluationId': e.id })
                                .then(answers => {                                        
                                        evaluationsPerChecklist[e.checklistId].answers = answers

                                        if(index == (values.length - 1)) {
                                            res.json(summary)
                                        }      

                                        index++            
                                    })
                                .catch(err => res.status(500).json({ errors: [err] }))

                        })


                    })
                })
                .catch(err => res.status(500).json({errors: [err]}))
            })
            .catch(err => {
                return res.status(500).json({errors: [err]})})
    }

    return {get}
}