import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field, formValueSelector } from 'redux-form'

import { init, getList, selectParent } from './checklistActions'
import LabelAndInput from '../common/form/labelAndInput'
import Select from '../common/form/select'

class ChecklistForm extends Component {
    componentWillMount() {
        this.props.getList()
    }    

    render() {
        const { handleSubmit, readOnly, list, description, parentId, selectParent} = this.props
        console.log('Parent ID Render', parentId)
        return (
            <form role='form' onSubmit={handleSubmit}>
                <div className='box-body'>
                    <Field name='description' value={description} component={LabelAndInput} readOnly={readOnly}
                        label='Description' cols='12 4' placeholder='Enter the description' />
                    <Field name='parentId' value={parentId} component={Select} readOnly={readOnly}
                        label='Parent path' cols='12 4' list={list} optionValue="id" optionLabel="path" inputOnChange={selectParent}/>
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
const selector = formValueSelector('checklistForm')

const mapStateToProps = state => ({
        description: state.checklist.description,
        parentId: state.checklist.parentId,
        list: state.checklist.list
})

const mapDispatchToProps = dispatch => bindActionCreators({init, getList, selectParent}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ChecklistForm)