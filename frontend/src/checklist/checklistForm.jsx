import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field } from 'redux-form'
import Tree from '../common/tree/tree'
import If from '../common/operator/if'

import { init, getList, getTree} from './checklistActions'
import LabelAndInput from '../common/form/labelAndInput'
import Select from '../common/form/select'

class ChecklistForm extends Component {
    componentWillMount() {
        this.props.getList()
        this.props.getTree()
    }   

    render() {
        const { handleSubmit, readOnly, list, description, parentId, tree} = this.props
        return (
            <form role='form' onSubmit={handleSubmit}>
                <div className='box-body'>
                    <Field name='description' value={description} component={LabelAndInput} readOnly={readOnly}
                        label='Description' cols='12 4' placeholder='Enter the description' />
                    <Field name='parentId' value={parentId} component={Select} readOnly={readOnly}
                        label='Parent path' cols='12 4' options={list} 
                        optionValue='id' optionLabel='path' />
                    <If test={!readOnly}>
                        <Field name='checklist' legend='My checklists' component={Tree} tree={tree} hideSlideBar={true} shrink={true}/>
                    </If>    
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

ChecklistForm = reduxForm({form: 'checklistForm', destroyOnUnmount: false})(ChecklistForm)

const mapStateToProps = state => ({
        description: state.checklist.description,
        parentId: state.checklist.parentId,
        list: state.checklist.list,
        tree: state.checklist.tree
})

const mapDispatchToProps = dispatch => bindActionCreators({init, getList, getTree}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ChecklistForm)