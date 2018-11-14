import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'
import Tree, {initializeAnswers, updateSlide} from '../tree/Tree'
import './AssessmentCrud.css'

const headerProps = {
    icon: 'check-square',
    title: 'Assessment',
    subtitle: 'Assessment: Insert, List, Update and Delete!!'
}

const baseUrl = 'http://localhost:3001/checklists'

const initialState = {
    checklist: { description: '', parentId: '' },
    list: [],
    tree: [],
    answerList: {}
}

export default class checklistCrud extends Component {
    constructor(props) {
        super(props)
        this.updateSlideBar = this.updateSlideBar.bind(this)
    }

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })

        const treeUrl = baseUrl + '/tree'
        axios(treeUrl).then(resp => {
            this.setState({ tree: resp.data, answerList: initializeAnswers(resp.data) })            
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
        const checklist = { ...this.state.checklist }
        checklist[event.target.name] = event.target.value
        this.setState({ checklist })
    }

    updateSlideBar(event, answersList) {
        this.setState({ answersList: updateSlide(event, answersList)})
    }

    createSelectItems() {
        const list = this.state.list.filter(u => u.parentId === null)
        let items = []         
        for (let i = 0; i < list.length; i++) {             
             items.push(<option key={i} value={list[i].id}>{list[i].path}</option>);   
        }
        return items;
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Project</label>
                            <input type="text" className="form-control"
                                name="description"
                                value={this.state.checklist.description}
                                onChange={e => this.updateField(e)}
                                placeholder="Write the project..." />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Checklist</label>
                            <select  className="form-control"
                                name="parentId"
                                onChange={e => this.updateField(e)}>
                                <option key="-1" value="-1">Select one option</option>
                                {this.createSelectItems()}
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
        return (<Tree tree={this.state.tree} answerList={this.state.answerList} updateSlideBar={this.updateSlideBar}/>)
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