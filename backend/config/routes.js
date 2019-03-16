const express = require('express')
const auth = require('./auth')

module.exports = app => {
    /*
     * Rotas protegidas por Token JWT
     */
    const protectedApi = express.Router()
    app.use('/api', protectedApi)

    protectedApi.use(auth)

    protectedApi.post('/checklists', app.api.checklist.save)
    protectedApi.get('/checklists', app.api.checklist.get)
    protectedApi.post('/checklists/clone', app.api.checklist.clone)       
    protectedApi.get('/checklists/tree', app.api.checklist.getTree)
    protectedApi.put('/checklists/:id', app.api.checklist.save)
    protectedApi.delete('/checklists/:id', app.api.checklist.remove)
    protectedApi.get('/checklists/:id', app.api.checklist.getById)

    protectedApi.post('/projects', app.api.project.save)
    protectedApi.get('/projects', app.api.project.get)
    protectedApi.put('/projects/:id', app.api.project.save)
    protectedApi.delete('/projects/:id', app.api.project.remove)
    protectedApi.get('/projects/:id', app.api.project.getById)

    protectedApi.post('/evaluations', app.api.evaluation.save)
    protectedApi.get('/evaluations', app.api.evaluation.get)
    protectedApi.put('/evaluations/:id', app.api.evaluation.save)
    protectedApi.delete('/evaluations/:id', app.api.evaluation.remove)
    protectedApi.get('/evaluations/:id', app.api.evaluation.getById)
    protectedApi.get('/evaluations/:id/answers', app.api.evaluation.getAnswers)

    protectedApi.get('/dashboard/summary', app.api.dashboard.get)

    protectedApi.get('/timelines', app.api.timeline.get)

    protectedApi.get('/users', app.api.user.get)

    /*
     * Rotas abertas
     */
    const openApi = express.Router()
    app.use('/oapi', openApi)
    openApi.post('/signup', app.api.user.save)
    openApi.post('/signin', app.api.user.signin)
    openApi.post('/validateToken', app.api.user.validateToken)
}