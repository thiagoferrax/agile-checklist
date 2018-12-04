module.exports = app => {
    const {existsOrError, notExistsOrError, equalsOrError, isValidEmail} = app.api.validation
    
    const save = (req, res) => {
        const evaluation = {
            id: req.body.id,
            projectId: req.body.projectId,
            sprint: req.body.sprint,
            checklistId: req.body.checklistId,
            userId: req.body.userId,
            date: req.body.date,
            checklist: req.body.checklist
        }
      
        console.log('evaluation.checklist', evaluation.checklist)

        if(req.params.id) evaluation.id = req.params.id

        try{
            existsOrError(evaluation.projectId, 'Project was not informed!')
            existsOrError(evaluation.sprint, 'Sprint was not informed!')
            existsOrError(evaluation.checklistId, 'Checklist was not informed!')
            existsOrError(evaluation.userId, 'Checklist was not informed!')
        } catch (msg) {
            return res.status(400).json({errors: [msg]})
        }        

        delete evaluation.checklist
        if(evaluation.id) {
            app.db('evaluations')
                .update(evaluation)
                .where({id: evaluation.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).json({errors: [err]}))
            } else {
            app.db('evaluations')
                .insert(evaluation)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).json({errors: [err]}))
        }
    }

    const remove = async (req, res) => {
        try{
            existsOrError(req.params.id, "Evaluation id was not informed!")

            const rowsDeleted = await app.db('evaluations').where({ id: req.params.id }).del()

            existsOrError(rowsDeleted, "evaluation was not found!")

            res.status(204).send()
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
                userId: 'evaluations.userId',
                date: 'evaluations.date',
                projectName: 'projects.name',
                checklistDescription: 'checklists.description' 
            }
        ).from('evaluations')
            .leftJoin('projects','evaluations.projectId','projects.id')
            .leftJoin('checklists','evaluations.checklistId','checklists.id')
            .then(evaluations => res.json(evaluations))
            .catch(err => res.status(500).json({errors: [err]}))
    }

    const getById = (req, res) => {
        app.db('evaluations')
        .where({ id: req.params.id })
        .first()
        .then(evaluation => res.json(evaluation))
        .catch(err => res.status(500).json({errors: [err]}))
    }

    return {save, remove, get, getById}
}