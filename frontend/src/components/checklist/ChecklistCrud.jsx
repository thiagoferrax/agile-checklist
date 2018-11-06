import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'check-square',
    title: 'Checklists',
    subtitle: 'Checklists: Insert, List, Update and Delete!!'
}

const baseUrl = 'http://localhost:3001/checklists'

const initialState = {
    checklist: { description: '', parentId: '' },
    list: []
}

export default class checklistCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
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
        let items = []         
        for (let i = 0; i < this.state.list.length; i++) {             
             items.push(<option key={i} value={this.state.list[i].id}>{this.state.list[i].path}</option>);   
        }
        return items;
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Description</label>
                            <input type="text" className="form-control"
                                name="description"
                                value={this.state.checklist.description}
                                onChange={e => this.updateField(e)}
                                placeholder="Write the description..." />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Parent</label>
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
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>ParentId</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(checklist => {
            return (
                <tr key={checklist.id}>
                    <td>{checklist.id}</td>
                    <td>{checklist.description}</td>
                    <td>{checklist.parentId}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(checklist)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(checklist)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
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