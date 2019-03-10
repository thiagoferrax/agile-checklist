const { array2map } = require('../common/mapUtil')

module.exports = app => {
    const { existsOrError } = app.api.validation

    const getProjects = (userId) => new Promise((resolve, reject) => {
        const data = [
            {
                date: '10 Feb. 2014',
                logs: [{
                    type: 'evaluation',
                    data: { sprint: 'Sprint 1', project: 'Project One', user: 'Thiago Ferraz', checklist: 'Scrum', time: '10:30' }
                }, {
                    type: 'evaluation',
                    data: { sprint: 'Sprint 1', project: 'Project One', user: 'Beatriz Ferraz', checklist: 'Scrum', time: '10:27' }
                }, {
                    type: 'checklist',
                    data: { checklist: 'Scrum', user: 'Thiago Ferraz', time: '10:00' }
                }, {
                    type: 'project',
                    data: { project: 'Project One', user: 'Thiago Ferraz', time: '9:47' }
                }, {
                    type: 'user',
                    data: { user: 'Thiago Ferraz', time: '9:45' }
                }]
            }, {
                date: '09 Feb. 2014',
                logs: [
                    {
                        type: 'user',
                        data: { user: 'Beatriz Ferraz', time: '7:45' }
                    }
                ]
            }
        ]

        const timeline = { data }
        resolve(timeline) 
    })

    const get = (req, res) => {
        const userId = req.decoded.id

        getProjects(userId)
            .then(timeline => res.json(timeline))
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    return { get }
}