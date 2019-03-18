const { array2map } = require('../common/mapUtil')

module.exports = app => {
    const { existsOrError } = app.api.validation

    const getProjects = (userId) => new Promise((resolve, reject) => {
        const summary = { projects: 0, evaluations: 0, number_evaluations: 0, members: 0, comments: 0, userId }

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
        app.db('teams').distinct('userId')
            .whereIn('projectId', summary.projectsIds)
            .then(members => {
                summary.members = members.map(member => ({
                    userId: member.userId,
                    projectId: member.projectId
                }
                ))

                resolve(summary)
            })
            .catch(err => reject(err))
    })

    const getNumberChecklists = (summary) => new Promise((resolve, reject) => {
        let members = summary.members.map(member => member.userId)
        if (!members.length) {
            members = [summary.userId]
        }

        app.db('checklists').countDistinct('id')
            .whereIn('userId', members)
            .where('parentId', null)
            .then(number_checklists => {
                summary.number_checklists = number_checklists[0].count
                resolve(summary)
            }).catch(err => reject(err))
    })

    const mergeEvaluations = (evaluations) => {
        const evaluationsMap = evaluations.reduce((map, evaluation) => {
            const key = `${evaluation.projectId}_${evaluation.sprint}_${evaluation.checklistId}`
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
            date: 'evaluations.created_at',
            checklistDescription: 'checklists.description'
        }).from('evaluations')
            .leftJoin('checklists', 'evaluations.checklistId', 'checklists.id')
            .whereIn('evaluations.projectId', summary.projectsIds)
            .then(evaluations => {
                summary.pureEvaluations = evaluations
                summary.number_evaluations = evaluations.length
                summary.evaluations = mergeEvaluations(evaluations)

                resolve(summary)
            }).catch(err => reject(err))
    })

    const hasChild = (evaluation, evaluations) => {
        return evaluations.filter(e => e.parentId == evaluation.checklistId).length > 0
    }

    const getProjectEvaluations = (summary) => new Promise((resolve, reject) => {

        app.db.select({
            projectId: 'evaluations.projectId',
            sprint: 'evaluations.sprint',
            checklistDescription: 'checklists.description',
            checklistId: 'answers.checklistId',
            parentId: 'checklists.parentId',
            score: 'answers.value'
        }).from('evaluations')
            .leftJoin('answers', 'answers.evaluationId', 'evaluations.id')
            .leftJoin('checklists', 'answers.checklistId', 'checklists.id')
            .whereIn('evaluations.projectId', summary.projectsIds)
            .orderBy('evaluations.sprint', 'desc')
            .orderBy('answers.checklistId', 'asc')
            .then(evaluations => {
                summary.projectEvaluations = mergeEvaluations(evaluations).reduce((projectEvaluations, evaluation) => {
                    const key = `${evaluation.projectId}`
                    if (projectEvaluations[key]) {
                        projectEvaluations[key].push(evaluation)
                    } else {
                        projectEvaluations[key] = [evaluation]
                    }
                    return projectEvaluations
                }, {})

                resolve(summary)
            }).catch(err => reject(err))
    })

    const getSprintEvaluations = (summary) => new Promise((resolve, reject) => {
        if (summary.projectEvaluations) {

            const projects = Object.keys(summary.projectEvaluations)

            summary.sprintEvaluations = projects.reduce((sprintEvaluations, project) => {
                const evaluations = summary.projectEvaluations[project]
                sprintEvaluations[project] = evaluations.filter(evaluation => (!evaluation.parentId || hasChild(evaluation, evaluations)))
                return sprintEvaluations
            }, {})

            resolve(summary)
        }
    })

    const getRootCauses = (evaluation, evaluations) => {
        return evaluations && evaluations.reduce((causes, e) => {
            if (e.parentId === evaluation.checklistId && e.sprint === evaluation.sprint && e.score <= 5) {
                if (!hasChild(e, evaluations)) {
                    causes.push(`${e.checklistDescription} | ${parseFloat(e.score).toFixed(1)}`)
                }
            }
            return causes
        }, [])
    }

    const getFishboneData = (summary) => new Promise((resolve, reject) => {
        if (summary.sprintEvaluations) {
            const projects = Object.keys(summary.sprintEvaluations)

            summary.fishboneData = projects.reduce((fishboneData, projectId) => {

                fishboneData[projectId] = summary.sprintEvaluations[projectId].reduce((causeAndEffect, evaluation) => {
                    const sprint = `Sprint ${evaluation.sprint}`

                    if (!causeAndEffect[sprint]) {
                        causeAndEffect[sprint] = {}
                    }

                    const rootCauses = getRootCauses(evaluation, summary.projectEvaluations[projectId])
                    if (rootCauses.length > 0) {
                        causeAndEffect[sprint][evaluation.checklistDescription] = getRootCauses(evaluation, summary.projectEvaluations[projectId])
                    } else {
                        delete causeAndEffect[sprint][evaluation.checklistDescription]
                    }


                    return causeAndEffect
                }, {})

                return fishboneData
            }, {})

            resolve(summary)
        } else {
            reject('No evaluations found')
        }
    })


    const getParetoData = (summary) => new Promise((resolve, reject) => {
        if (summary.sprintEvaluations) {
            const projects = Object.keys(summary.sprintEvaluations)

            summary.paretoData = projects.reduce((paretoData, projectId) => {

                paretoData[projectId] = summary.sprintEvaluations[projectId].reduce((data, evaluation) => {
                    const sprint = `Sprint ${evaluation.sprint}`

                    if (!data[sprint]) {
                        data[sprint] = {}
                    }

                    const rootCauses = getRootCauses(evaluation, summary.projectEvaluations[projectId])
                    if (rootCauses.length > 0) {
                        data[sprint][evaluation.checklistDescription] = rootCauses.length
                    } else {
                        delete data[sprint][evaluation.checklistDescription]
                    }

                    return data
                }, {})

                return paretoData
            }, {})

            resolve(summary)
        } else {
            reject('No evaluations found')
        }
    })

    const format = value => parseFloat(value).toFixed(1)

    const average = array => format(array.reduce((a, b) => a + b, 0) / array.length)

    const getTeamParticipation = (projectId, sprint, checklist, members, pureEvaluations) => {
        const projectMembers = members.filter(m => m.projectId = projectId).map(m => m.userId)

        const membersThatEvaluated = pureEvaluations.filter(
            e => (e.sprint === sprint
                && e.projectId === projectId
                && e.checklistId === checklist)).map(e => e.userId)

        let nMembers = 0
        projectMembers.forEach(member => {
            if(membersThatEvaluated.includes(member)) {
                nMembers++
            }
        })

        return format(100 * nMembers / projectMembers.length)
    }

    const getEvaluationsByChecklist = (evaluations, members, pureEvaluations) => {
        const projectsIds = [... new Set(evaluations.map(e => +e.projectId))]

        return projectsIds.reduce((evaluationsMap, projectId) => {
            const projectEvaluations = evaluations.filter(e => e.projectId === projectId)
            const checklists = [... new Set(projectEvaluations.map(e => +e.checklistId))]

            checklists.map(checklist => {

                const evaluationsChecklist = projectEvaluations.filter(e => e.checklistId === checklist).sort((a, b) => a.sprint - b.sprint)

                const scores = evaluationsChecklist.map(e => +e.score)

                const min = Math.min(...scores)
                const minIndex = scores.indexOf(min)
                const minEvaluation = evaluationsChecklist[minIndex]

                const max = Math.max(...scores)
                const maxIndex = scores.indexOf(max)
                const maxEvaluation = evaluationsChecklist[maxIndex]

                const currentEvaluation =
                    evaluationsChecklist[evaluationsChecklist.length - 1]

                const teamParticipation = getTeamParticipation(projectId, currentEvaluation.sprint, checklist, members, pureEvaluations)

                const totalAverage = average(scores)

                if (!evaluationsMap.hasOwnProperty(projectId)) {
                    evaluationsMap[projectId] = []
                }
                evaluationsMap[projectId].push({
                    checklist: minEvaluation.checklistDescription,
                    checklistId: minEvaluation.checklistId,
                    currentScore: {
                        value: format(currentEvaluation.score),
                        percentage: 17,
                        percentageDirection: 'up'
                    },
                    teamParticipation: {
                        value: teamParticipation,
                        percentage: 13,
                        percentageDirection: 'up'
                    },
                    minimumScore: {
                        value: format(minEvaluation.score),
                        sprint: minEvaluation.sprint
                    },
                    maximumScore: {
                        value: format(maxEvaluation.score),
                        sprint: maxEvaluation.sprint
                    },
                    totalAverage: {
                        value: totalAverage,
                        percentage: 16,
                        percentageDirection: 'up'
                    }
                })
            })
            return evaluationsMap

        }, {})
    }

    const calculatePercentage = (before, current) => {
        let percentage = 0
        if (current !== 0) {
            percentage = (current - before) * 100 / current
        }
        return format(percentage)
    }

    const getPercentageDirection = (percentage) => {
        let percentageDirection = 'right'
        if (percentage > 0) {
            percentageDirection = 'up'
        } else if (percentage < 0) {
            percentageDirection = 'down'
        }
        return percentageDirection
    }

    const updateSummaryDataPercentages = (beforeProjectsMap, currentProjectsMap) => {
        const projects = Object.keys(currentProjectsMap)

        projects.forEach(project => {
            const before = beforeProjectsMap[project]
            const current = currentProjectsMap[project]

            current.forEach(map => {
                const beforeMap = before.filter(beforeMap => beforeMap.checklistId === map.checklistId)
                if (beforeMap.length > 0) {
                    map.currentScore.percentage = calculatePercentage(beforeMap[0].currentScore.value, map.currentScore.value)
                    map.currentScore.percentageDirection = getPercentageDirection(map.currentScore.percentage)
                    map.currentScore.percentage *= Math.sign(map.currentScore.percentage)

                    map.teamParticipation.percentage = calculatePercentage(beforeMap[0].teamParticipation.value, map.teamParticipation.value)
                    map.teamParticipation.percentageDirection = getPercentageDirection(map.teamParticipation.percentage)
                    map.teamParticipation.percentage *= Math.sign(map.teamParticipation.percentage)

                    map.totalAverage.percentage = calculatePercentage(beforeMap[0].totalAverage.value, map.totalAverage.value)
                    map.totalAverage.percentageDirection = getPercentageDirection(map.totalAverage.percentage)
                    map.totalAverage.percentage *= Math.sign(map.totalAverage.percentage)
                }
            })

        })
        return currentProjectsMap
    }

    const getSummaryData = (summary) => new Promise((resolve, reject) => {
        let evaluations = [...summary.evaluations].sort((a, b) => a.sprint - b.sprint)        

        if (evaluations.length > 1) {
            const checklistsIds = evaluations.reduce((checklistsIds, evaluation) => {
                if (!checklistsIds[evaluation.checklistId]) {
                    checklistsIds[evaluation.checklistId] = 1
                } else {
                    checklistsIds[evaluation.checklistId]++
                }
                return checklistsIds
            }, {})

            Object.keys(checklistsIds).map(checklistId => {
                if (checklistsIds[checklistId] > 1) {
                    checklistsIds[checklistId] = 0
                }
            })

            let index = evaluations.length - 1

            while (Object.values(checklistsIds).includes(0)) {
                const checklistId = evaluations[index].checklistId
                if (!checklistsIds[checklistId]) {
                    delete evaluations[index]
                    checklistsIds[checklistId] = 1
                }
                index--
            }
        }

        const members = summary.members
        const pureEvaluations = summary.pureEvaluations

        const before = getEvaluationsByChecklist(evaluations, members, pureEvaluations)
        const current = getEvaluationsByChecklist(summary.evaluations, members, pureEvaluations)
        const summaryData = updateSummaryDataPercentages(before, current)

        summary.summaryData = summaryData
        resolve(summary)
    })

    const get = (req, res) => {
        const userId = req.decoded.id

        getProjects(userId)
            .then(getTeam)
            .then(getNumberChecklists)
            .then(getEvaluations)
            .then(getProjectEvaluations)
            .then(getSprintEvaluations)
            .then(getFishboneData)
            .then(getParetoData)
            .then(getSummaryData)
            .then(summary => res.json(summary))
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    return { get }
}