import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field, formValueSelector } from 'redux-form'

import { init } from './projectActions'
import LabelAndInput from '../common/form/labelAndInput'
import Select from '../common/form/select'

class ProjectForm extends Component {
    render() {
        const types = [
            { value: 'Research', label: 'Research' },
            { value: 'Research and development', label: 'Research and development' },
            { value: 'Development', label: 'Development' }]

        const complexities = [
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' }]


        const { handleSubmit, readOnly } = this.props
        return (
            <form role='form' onSubmit={handleSubmit}>
                <div className='box-body'>
                    <Field name='name' label='Name' cols='12 4' placeholder='Enter the name'
                        component={LabelAndInput} readOnly={readOnly} />
                    <Field name='description' label='Description' cols='12 4' placeholder='Enter the description'
                        component={LabelAndInput} readOnly={readOnly} />
                    <Field name='type' label='Type' cols='12 4'
                        component={Select} readOnly={readOnly} options={types} />
                    <Field name='complexity' label='Complexity' cols='12 4'
                        component={Select} readOnly={readOnly} options={complexities} />
                    <Field name='estimatedDuration' label='Estimated duration (months)' cols='12 4' placeholder='Enter the estimated duration'
                        component={LabelAndInput} readOnly={readOnly} />
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

ProjectForm = reduxForm({ form: 'projectForm', destroyOnUnmount: false })(ProjectForm)
const selector = formValueSelector('projectForm')

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => bindActionCreators({ init }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ProjectForm)