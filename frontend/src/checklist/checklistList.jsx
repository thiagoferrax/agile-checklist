import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, showUpdate, showDelete } from './checklistActions'
import If from '../common/operator/if'

class ChecklistList extends Component {

    componentWillMount() {
        this.props.getList()
    }

    renderRows() {
        const list = this.props.list || []
        return list.map(checklist => (
            <tr key={checklist.id}>
                <td>{checklist.description}</td>
                <td>{checklist.parentPath}</td>
                <td>
                    <button className='btn btn-default' onClick={() => this.props.showUpdate(checklist)}>
                        <i className='icon ion-md-create'></i>
                    </button>
                    <button className='btn btn-danger' onClick={() => this.props.showDelete(checklist)}>
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
                            <th>Item description</th>
                            <th>Parent path</th>
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

const mapStateToProps = state => ({
    list: state.checklist.list
})
const mapDispatchToProps = dispatch => bindActionCreators({ getList, showUpdate, showDelete }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ChecklistList)