import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field, formValueSelector } from 'redux-form'

import { init} from './evaluationActions'
import { getList as getChecklists} from '../checklist/checklistActions'
import { getList as getProjects} from '../project/projectActions'
import { getList as getUsers} from '../user/userActions'

import LabelAndInput from '../common/form/labelAndInput'

import Select from '../common/form/select'

class EvaluationForm extends Component {
    componentWillMount() {
        this.props.getChecklists()
        this.props.getProjects()
        this.props.getUsers()
    }

    getSprintList() {
        const sprints = []
        for(let i = 0; i < 20; i++) {
            sprints.push({id:i+1, name:`Sprint ${i+1}`})
        }
        return sprints
    }

    render() {
        const { handleSubmit, readOnly} = this.props        
        return (
            <form role='form' onSubmit={handleSubmit}>
                <div className='box-body'>
                    <Field name='projectId' component={Select} readOnly={readOnly}
                        label='Project' cols='12 4' list={this.props.projects} optionValue="id" optionLabel="name" />
                    <Field name='sprint' component={Select} readOnly={readOnly}
                        label='Sprint' cols='12 4' list={this.getSprintList()} optionValue="id" optionLabel="name" />    
                    <Field name='checklistId' component={Select} readOnly={readOnly}
                        label='Checklist' cols='12 4' list={this.props.checklists.filter(u => u.parentId === null)} optionValue="id" optionLabel="description" />                            
                    <Field name='userId' component={Select} readOnly={readOnly}
                        label='User' cols='12 4' list={this.props.users} optionValue="id" optionLabel="name" /> 

                </div>
                <div className='box-footer'>
                    <button type='submit' className={`btn btn-${this.props.submitClass}`}>
                        {this.props.submitLabel}
                    </button>
                    <button type='button' className='btn btn-default'
                        onClick={this.props.init}>Cancel</button>
                </div>
            </form>
        )
    }
}

EvaluationForm = reduxForm({form: 'evaluationForm', destroyOnUnmount: false})(EvaluationForm)
const selector = formValueSelector('evaluationForm')

const mapStateToProps = state => ({
    projects: state.project.list, 
    checklists: state.checklist.list,
    users: state.user.list, 
})
const mapDispatchToProps = dispatch => bindActionCreators({init, getChecklists, getProjects, getUsers}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(EvaluationForm)