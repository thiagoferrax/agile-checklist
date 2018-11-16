import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'
import Tree, {initializeAnswers, updateSlide} from '../tree/Tree'
import './AssessmentCrud.css'
import {baseUrl} from '../../Global'

const headerProps = {
    icon: 'check-square',
    title: 'Assessment',
    subtitle: 'Assessment: Insert, List, Update and Delete!!'
} 

const initialState = {
    checklist: { description: '', parentId: '' },
    assessment: { projectId: '', checklistId: '',  answers: {}},
    list: [],
    tree: [],
    answers: {},
    projects: []
}

export default class checklistCrud extends Component {
    constructor(props) {
        super(props)
        this.updateSlideBar = this.updateSlideBar.bind(this)
    }

    state = { ...initialState }

    componentWillMount() {
        const checklistsUrl = baseUrl + '/checklists'
        axios(checklistsUrl).then(resp => {
            this.setState({ list: resp.data })
        })

        const treeUrl = checklistsUrl + '/tree'
        axios(treeUrl).then(resp => {
            this.setState({ tree: resp.data, answers: initializeAnswers(resp.data) })            
        })

        const projectUrl = baseUrl + '/projects'
        axios(projectUrl).then(resp => {

            this.setState({ projects: resp.data })            
        })
    }

    clear() {
        this.setState({ checklist: initialState.checklist })
    }

    save() {
        const checklist = this.state.checklist
        const method = checklist.id ? 'put' : 'post'
        const url = checklist.id ? `${baseUrl}/${checklist.id}` : baseUrl
        axios[method](url, checklist)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ checklist: initialState.checklist, list })
            })
    }

    getUpdatedList(checklist, add = true) {
        const list = this.state.list.filter(u => u.id !== checklist.id)
        if(add) list.unshift(checklist)
        return list
    }

    updateField(event) {
        const answers = this.state.answers
        const assessment = { ...this.state.assessment }
        assessment[event.target.name] = event.target.value
        this.setState({ assessment, answers})
    }

    updateSlideBar(event, answersList) {
        this.setState({ answersList: updateSlide(event, answersList)})
    }

    getProjects() {
        let projects = this.state.projects.reduce((items, project, index) => {   
            items.push(<option key={`projects_${index}`} value={project.id}>{project.name}</option>);   
            return items
        }, [])

        return projects;
    }

    getChecklists() {
        const checklistsWithoutParent = this.state.list.filter(u => u.parentId === null)

        let checklists = checklistsWithoutParent.reduce((items, checklist, index) => {   
            items.push(<option key={`checklists_${index}`} value={checklist.id}>{checklist.path}</option>);   
            return items
        }, [])

        return checklists;
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Project</label>
                            <select  className="form-control"
                                name="projectId"
                                onChange={e => this.updateField(e)}>
                                <option key="-1" value="-1">Select one option</option>
                                {this.getProjects()}
                            </select>                              
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Checklist</label>
                            <select  className="form-control"
                                name="checklistId"
                                onChange={e => this.updateField(e)}>
                                <option key="-1" value="-1">Select one option</option>
                                {this.getChecklists()}
                            </select>                            
                        </div>
                    </div>
                </div>

                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Save
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(checklist) {
        this.setState({ checklist })
    }

    remove(checklist) {
        axios.delete(`${baseUrl}/${checklist.id}`).then(resp => {
            const list = this.getUpdatedList(checklist, false)
            this.setState({ list })
        })
    }

    renderTree() {
        const selectedTree = this.state.tree.filter(checklist => checklist.id == this.state.assessment.checklistId)
        return (<Tree tree={selectedTree} answers={this.state.answers} updateSlideBar={this.updateSlideBar} shrink={true}/>)
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTree()}
            </Main>
        )
    }
}