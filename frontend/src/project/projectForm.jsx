import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field } from 'redux-form'

import { init } from './projectActions'
import LabelAndInput from '../common/form/labelAndInput'
import Select from '../common/form/select'

import { getList as getUserList } from '../user/userActions'

class ProjectForm extends Component {
    componentWillMount() {
        this.props.getUserList()
    }

    render() {
        const { handleSubmit, readOnly, userList } = this.props
        return (
            <form role='form' onSubmit={handleSubmit}>
                <div className='box-body'>
                    <Field name='name' label='Name' cols='12 4' placeholder='Enter the name'
                        component={LabelAndInput} readOnly={readOnly} autoFocus={true} />
                    <Field name='team' label='Team' cols='12 4'
                        component={Select} readOnly={readOnly} options={userList} optionValue='id' optionLabel='name' isMulti={true} />
                </div>
                <div className='box-footer text-right'>
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

const mapStateToProps = state => ({ userList: state.user.list })
const mapDispatchToProps = dispatch => bindActionCreators({ init, getUserList }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ProjectForm)