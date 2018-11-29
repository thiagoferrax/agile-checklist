import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field, formValueSelector, initialize } from 'redux-form'

import { init, selectChecklist} from './evaluationActions'
import { getList as getChecklists, getTree} from '../checklist/checklistActions'
import { getList as getProjects} from '../project/projectActions'
import { getList as getUsers} from '../user/userActions'
import Tree, {initializeAnswers} from '../common/tree/tree'

import Select from '../common/form/select'

class EvaluationForm extends Component {
    componentWillMount() {
        this.props.getChecklists()
        this.props.getTree()
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
        const { handleSubmit, readOnly, 
                selectChecklist, checklistId,
                projects, tree, checklists, users } = this.props    
        
        const selectedChecklist = getSelectedChecklist(tree, checklistId)   

        return (
            <form role='form' onSubmit={handleSubmit}>
                <div className='box-body'>
                    <Field name='projectId' label='Project' cols='12 4' 
                        component={Select} readOnly={readOnly} options={projects} optionValue='id' optionLabel='name' />
                    <Field name='sprint' label='Sprint' cols='12 4' 
                        component={Select} readOnly={readOnly}
                        options={this.getSprintList()} optionValue='id' optionLabel='name' />    
                    <Field name='checklistId' label='Checklist' cols='12 4' 
                        component={Select} readOnly={readOnly} inputOnChange={selectChecklist}
                        options={checklists.filter(u => u.parentId === null)} optionValue='id' optionLabel='description' />
                    <Field name='userId' label='User' cols='12 4' 
                        component={Select} readOnly={readOnly} options={users} optionValue='id' optionLabel='name' /> 
                    <Tree legend='My checklist' 
                        tree={selectedChecklist} 
                        answers={initializeAnswers(selectedChecklist)} 
                        shrink={true}/>
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

const getSelectedChecklist = (tree, id) => {
    let checklists = tree || []
    return checklists.filter(aChecklist => aChecklist.id === +id)
}

EvaluationForm = reduxForm({form: 'evaluationForm', destroyOnUnmount: false})(EvaluationForm)
const selector = formValueSelector('evaluationForm')

const mapStateToProps = state => ({
    projects: state.project.list, 
    checklists: state.checklist.list,
    users: state.user.list, 
    tree: state.checklist.tree,
    checklistId: state.evaluation.checklistId
})
const mapDispatchToProps = dispatch => 
    bindActionCreators({init, getChecklists, selectChecklist, getTree, getProjects, getUsers}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(EvaluationForm)