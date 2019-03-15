module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = (req, res) => {
        const evaluation = {
            id: req.body.id,
            projectId: req.body.projectId,
            sprint: req.body.sprint,
            checklistId: req.body.checklistId,
            userId: req.decoded.id,
            checklist: req.body.checklist
        }

        if (req.params.id) evaluation.id = req.params.id

        try {
            existsOrError(evaluation.projectId, 'Project was not informed!')
            existsOrError(evaluation.sprint, 'Sprint was not informed!')
            existsOrError(evaluation.checklistId, 'Checklist was not informed!')
            existsOrError(evaluation.userId, 'User was not informed!')
        } catch (msg) {
            return res.status(400).json({ errors: [msg] })
        }

        const checklist = evaluation.checklist
        delete evaluation.checklist

        if(checklist && checklist.length > 0) {
            evaluation.score = getScore(checklist)
        }   

        if (evaluation.id) {  
            evaluation.updated_at = new Date()

            app.db('evaluations')
                .update(evaluation)
                .where({ id: evaluation.id })
                .then(_ => {
                    if(checklist && checklist.length > 0) {
                        updateAnswers(evaluation.id, checklist, res)
                    } else {
                        res.status(204).send()
                    }
                })                                                                                                    
                .catch(err => res.status(500).json({ errors: [err] }))

              
        } else {

            try {
                existsOrError(checklist, 'You need to answer the checklist!')
            } catch (msg) {
                return res.status(400).json({ errors: [msg] })
            }
            evaluation.created_at = new Date()
            evaluation.updated_at = null

            const evaluationId = app.db('evaluations')
                .insert(evaluation)
                .returning('id')
                .then(evaluationId => insertAnswers(evaluationId[0], checklist, res))
                .catch(err => res.status(500).json({ errors: [err] }))
        }
    }

    const updateAnswers = (evaluationId, checklist, res) => {
        app.db('answers').where({ evaluationId: evaluationId }).del().then(
            rowsDeleted => {               
                insertAnswers(evaluationId, checklist, res)            
            }    
        )           
    }    

    const insertAnswers = (evaluationId, checklist, res) => {
        const rows = getChecklistAnswersToInsert(evaluationId, checklist)
        const chunkSize = rows.lenght
        app.db.batchInsert('answers', rows, chunkSize)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    const remove = (req, res) => {
        const evaluationId = req.params.id
        try {
            existsOrError(evaluationId, "Evaluation id was not informed!")

            app.db('answers').where({ evaluationId }).del().then(
                answersDeleted => {                                    
                    app.db('evaluations').where({ id: evaluationId }).del().then(
                        rowsDeleted => {
                            existsOrError(rowsDeleted, "Evaluation was not found!")              
                            res.status(204).send()                
                        }
                    ).catch(err => res.status(500).json({ errors: [err] }))                    
                }    
            )
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db.select(
            {
                id: 'evaluations.id',
                projectId: 'evaluations.projectId',
                sprint: 'evaluations.sprint',
                checklistId: 'evaluations.checklistId',
                score: 'evaluations.score',
                userId: 'evaluations.userId',
                date: 'evaluations.created_at',
                projectName: 'projects.name',
                checklistDescription: 'checklists.description'
            }
        ).from('evaluations')
            .leftJoin('projects', 'evaluations.projectId', 'projects.id')
            .leftJoin('checklists', 'evaluations.checklistId', 'checklists.id')
            .where({'evaluations.userId': req.decoded.id})
            .orderBy('evaluations.created_at', 'desc')
            .then(evaluations => res.json(evaluations))
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    const getById = (req, res) => {
        app.db('evaluations')
            .where({ id: req.params.id })
            .first()
            .then(evaluation => res.json(evaluation))
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    const getAnswers = (req, res) => {
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
            .where({ 'answers.evaluationId': req.params.id })
            .then(answers => res.json(answers))
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    const getChecklistAnswersToInsert = (evaluationId, checklist, initialAnswers = []) => {
        return checklist.reduce((answers, item) => {
            answers.push({evaluationId, checklistId: item.id, value: parseInt(item.value)})
            return getChecklistAnswersToInsert(evaluationId, item.children, answers)
        }, initialAnswers)
    }

    const getScore = (checklist) => parseInt(checklist[0].value)

    return { save, remove, get, getById, getAnswers }
}