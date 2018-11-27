import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field, formValueSelector } from 'redux-form'

import { init } from './projectActions'
import { getList as getUserList } from '../user/userActions'
import LabelAndInput from '../common/form/labelAndInput'
import Select from '../common/form/select'

class ProjectForm extends Component {
    componentWillMount() {
        this.props.getUserList()
    }

    render() {
        const types = [
            {value: 'Research', label: 'Research'},
            {value: 'Research and development', label: 'Research and development'},
            {value: 'Development', label: 'Development'}]

        const complexities = [
            {value: 'Low', label: 'Low'},
            {value: 'Medium', label: 'Medium'},
            {value: 'High', label: 'High'}]
        

        const { handleSubmit, readOnly} = this.props        
        return (
            <form role='form' onSubmit={handleSubmit}>
                <div className='box-body'>
                    <Field name='name' component={LabelAndInput} readOnly={readOnly}
                        label='Name' cols='12 4' placeholder='Enter the name' />
                    <Field name='description' component={LabelAndInput} readOnly={readOnly}
                        label='Description' cols='12 4' placeholder='Enter the description' />
                    <Field name='type' component={Select} readOnly={readOnly}
                        label='Type' cols='12 4' list={types}/>
                    <Field name='complexity' component={Select} readOnly={readOnly}
                        label='Complexity' cols='12 4' list={complexities} />                                                
                    <Field name='estimatedDuration' component={LabelAndInput} readOnly={readOnly}
                        label='Estimated duration (months)' cols='12 4' placeholder='Enter the estimated duration' />
                    <Field name='userId' component={Select} readOnly={readOnly}
                        label='User' cols='12 4' list={this.props.userList} optionValue="id" optionLabel="name" />                            
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

ProjectForm = reduxForm({form: 'projectForm', destroyOnUnmount: false})(ProjectForm)
const selector = formValueSelector('projectForm')

const mapStateToProps = state => ({userList: state.user.list})
const mapDispatchToProps = dispatch => bindActionCreators({init, getUserList}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ProjectForm)