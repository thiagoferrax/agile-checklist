import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'projects',
    title: 'Projects',
    subtitle: 'Projects: Insert, List, Update and Delete!'
}

const baseUrl = 'http://localhost:3001/projects'

const initialState = {
    project: { name: '', description: '', type: '', complexity: '', estimatedDuration: '', userId: null},
    list: [],
    userList: []
}

export default class ProjectCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ project: initialState.project })
    }

    save() {
        const project = this.state.project
        const method = project.id ? 'put' : 'post'
        const url = project.id ? `${baseUrl}/${project.id}` : baseUrl
        axios[method](url, project)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ project: initialState.project, list })
            })
    }

    getUpdatedList(project, add = true) {
        const list = this.state.list.filter(u => u.id !== project.id)
        if(add) list.unshift(project)
        return list
    }

    updateField(event) {
        const project = { ...this.state.project }
        project[event.target.name] = event.target.value
        this.setState({ project })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" className="form-control"
                                name="name"
                                value={this.state.project.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Write the name..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" className="form-control"
                                name="description"
                                value={this.state.project.description}
                                onChange={e => this.updateField(e)}
                                placeholder="Write the description..." />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Type</label>
                            <input type="text" className="form-control"
                                name="type"
                                value={this.state.project.type}
                                onChange={e => this.updateField(e)}
                                placeholder="Write the type..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Complexity</label>
                            <input type="text" className="form-control"
                                name="complexity"
                                value={this.state.project.complexity}
                                onChange={e => this.updateField(e)}
                                placeholder="Write the complexity..." />
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

    load(project) {
        this.setState({ project })
    }

    remove(project) {
        axios.delete(`${baseUrl}/${project.id}`).then(resp => {
            const list = this.getUpdatedList(project, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
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
        return this.state.list.map(project => {
            return (
                <tr key={project.id}>
                    <td>{project.id}</td>
                    <td>{project.name}</td>
                    <td>{project.description}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(project)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(project)}>
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