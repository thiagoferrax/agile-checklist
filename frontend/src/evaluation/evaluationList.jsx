import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, showUpdate, showDelete } from './evaluationActions'

class EvaluatonList extends Component {

    componentWillMount() {
        this.props.getList()
    }

    getFormatedDate(isoDate) {
        const date = new Date(isoDate)
        return `${date.getMonth()}/${date.getDay()}/${date.getFullYear()} `
    }

    renderRows() {
        const list = this.props.list || []
        return list.map(evaluation => (
            <tr key={evaluation.id}>
                <td>{evaluation.projectName}</td>                
                <td>{`Sprint ${evaluation.sprint}`}</td>
                <td>{evaluation.checklistDescription}</td>                                
                <td>{evaluation.score ? parseFloat(evaluation.score).toFixed(2) : '0.0'}</td>
                <td>{this.getFormatedDate(evaluation.date)}</td>
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