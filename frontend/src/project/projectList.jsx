import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, prepareToShow, showUpdate, showDelete } from './projectActions'

class ProjectList extends Component {

    componentWillMount() {
        this.props.getList()
    }
    
    getFormatedDate(isoDate) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        
        const date = new Date(isoDate)
        return `${date.toLocaleDateString('en-US', options)} at ${date.toLocaleTimeString('en-US')}`
    }

    renderRows() {
        const list = this.props.list || []
        return list.map(project => (
            <tr key={project.id}>
                <td>{project.name}</td>
                <td>{this.getFormatedDate(project.date)}</td>
                <td>
                    <button className='btn btn-default' onClick={() => this.props.prepareToShow(project.id, showUpdate)}>
                        <i className='icon ion-md-create'></i>
                    </button>
                    <button className='btn btn-danger' onClick={() => this.props.prepareToShow(project.id, showDelete)}>
                        <i className='icon ion-md-trash'></i>
                    </button>
                </td>
            </tr>
        ))
    }

    render() {
        return (
            <div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Created at</th>
                            <th className='table-actions'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = state => ({list: state.project.list})
const mapDispatchToProps = dispatch => bindActionCreators({getList, prepareToShow, showUpdate, showDelete}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ProjectList)