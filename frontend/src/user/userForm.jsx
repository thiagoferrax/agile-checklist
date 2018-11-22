import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field, formValueSelector } from 'redux-form'

import { init } from './userActions'
import LabelAndInput from '../common/form/labelAndInput'
import Checkbox from '../common/form/checkbox'
const  { DOM: { input, select, textarea } } = React
import ItemList from './itemList'
import Summary from './summary'

class UserForm extends Component {

    render() {
        const { handleSubmit, readOnly, credits, debts } = this.props        
        return (
            <form role='form' onSubmit={handleSubmit}>
                <div className='box-body'>
                    <Field name='name' component={LabelAndInput} readOnly={readOnly}
                        label='Name' cols='12 4' placeholder='Enter the name' />
                    <Field name='email' component={LabelAndInput} readOnly={readOnly}
                        label='Email' cols='12 4' placeholder='Enter the email' />
                    <Field name='admin' component={Checkbox} readOnly={readOnly} 
                        label='Administrator' cols='12 4'/>    
                    <Field name='password' component={LabelAndInput} readOnly={readOnly}
                        label='Password' cols='12 4' placeholder='Enter the password' />
                    <Field name='confirmPassword' component={LabelAndInput} readOnly={readOnly}
                        label='Confirm the password' cols='12 4' placeholder='Confirm the password' />    
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

UserForm = reduxForm({form: 'userForm', destroyOnUnmount: false})(UserForm)
const selector = formValueSelector('userForm')
const mapStateToProps = state => ({
    credits: selector(state, 'credits'),
    debts: selector(state, 'debts')
})
const mapDispatchToProps = dispatch => bindActionCreators({init}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(UserForm)