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
    tree: [],
    answerList: {}
}

export default class checklistCrud extends Component {

    state = { ...initialState }

    initializeAnswers(tree) {
        const getAnswers = (accumulator, childrenTree) => childrenTree.reduce(function(accumulator, checklist) {
            accumulator[checklist.id] = 0

            if(checklist.children) {
                getAnswers(accumulator, checklist.children)
            }

            return accumulator
        }, accumulator)

        return getAnswers({}, tree)
    }


    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })

        const treeUrl = baseUrl + '/tree'
        axios(treeUrl).then(resp => {
            this.setState({ tree: resp.data, answerList: this.initializeAnswers(resp.data) })            
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

    updateSlideBar(event) {
        const colors = ['#dc3545', '#ffc107', '#17a2b8', '#28a745']

        const slideId = event.target.id
        const checklistId = slideId.split('_')[1]

        const answer = event.target.value

        console.log(colors[answer])
        console.log(document.getElementById(slideId).style)
        document.getElementById(slideId).style = `background: ${colors[answer]} !important`


        const answersList = this.state.answerList
        answersList[checklistId] = answer

        this.setState({ answersList })
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

    closeNode(checklistId) {
        const children  = document.getElementById(checklistId)
        children.hidden = !children.hidden        

        const link  = document.getElementById(`link_${checklistId}`)
        if(link.className === "fa fa-angle-down ml-2") {
            link.className = "fa fa-angle-right ml-2"
        } else {
            link.className = "fa fa-angle-down ml-2"
        }
    }

    renderChecklist() {
        const tree = this.state.tree

        const getChildren = node => node.children

        const buildTree = tree => tree.map(checklist => {
            
            const children = getChildren(checklist)

            return (
                <div key={checklist.id} className={children.length > 0 ? "parent" : ""}>
                    <div className="rowItem">
                        <a onClick={() => this.closeNode(checklist.id)}><i id={`link_${checklist.id}`} className="fa fa-angle-down ml-2" hidden={children.length === 0}></i></a>
                        <div className="ml-2">{checklist.description}</div> 
                        <div className="slidecontainer">
                            <input type="range" min="0" max="3" value="0" className="slider" id={`slide_${checklist.id}`} value={this.state.answerList[checklist.id]}  onChange={e => this.updateSlideBar(e)}/>
                        </div>
                    </div>
                    <div className="children" id={checklist.id}>
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