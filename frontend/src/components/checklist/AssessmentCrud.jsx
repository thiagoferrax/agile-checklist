import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'
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
    tree: []
}

export default class checklistCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })

        const treeUrl = baseUrl + '/tree'
        axios(treeUrl).then(resp => {
            this.setState({ tree: resp.data })
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

    renderTable() {
        return (
            <div className="checklist">
                 {this.renderChecklist()}
            </div>            
        )
    }

    renderChecklist() {
        const tree = this.state.tree

        const getChildren = node => node.children

        const buildTree = tree => tree.map(checklist => {
            
            const children = getChildren(checklist)

            return (
                <div className={children.length > 0 ? "parent" : ""}>
                    <div className="rowItem">
                        <i className="fa fa-angle-down ml-3 " hidden={children.length === 0}></i>
                        <input id={checklist.id} type="text" value={checklist.description}/>                                                                            
                    </div>
                    <div className="children">
                        {buildTree(children)} 
                    </div>
                </div>                    
            )
        })

        return buildTree(tree)
    }
    
    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}