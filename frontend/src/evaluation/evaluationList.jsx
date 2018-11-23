import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, showUpdate, showDelete } from './evaluationActions'

class EvaluatonList extends Component {

    componentWillMount() {
        this.props.getList()
    }

    renderRows() {
        const list = this.props.list || []
        return list.map(evaluation => (
            <tr key={evaluation.id}>
                <td>{evaluation.projectId}</td>                
                <td>{evaluation.sprint}</td>
                <td>{evaluation.checklistId}</td>                                
                <td>{evaluation.score}</td>
                <td>{evaluation.date}</td>
                <td>
                    <button className='btn btn-warning' onClick={() => this.props.showUpdate(evaluation)}>
                        <i className='fa fa-pencil'></i>
                    </button>
                    <button className='btn btn-danger' onClick={() => this.props.showDelete(evaluation)}>
                        <i className='fa fa-trash-o'></i>
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
                            <th>Project</th>
                            <th>Sprint</th>
                            <th>Checklist</th>
                            <th>Score</th>
                            <th>Date</th>
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

const mapStateToProps = state => ({list: state.evaluation.list})
const mapDispatchToProps = dispatch => bindActionCreators({getList, showUpdate, showDelete}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(EvaluatonList)