import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import Tree from '../common/tree/tree'
import If from '../common/operator/if'


import { init, getList, getTree, showDelete } from './checklistActions'
import LabelAndInput from '../common/form/labelAndInput'
import Select from '../common/form/select'
import Grid from '../common/layout/grid'

class ChecklistForm extends Component {
    constructor(props) {
        super(props)

        this.cleanOrRemove = this.cleanOrRemove.bind(this)
    }

    componentWillMount() {
        this.props.getList()
        this.props.getTree()
    }

    cleanOrRemove() {
        this.props.init()
    }

    render() {
        const { handleSubmit, readOnly, list, description, parentId, tree } = this.props
        return (
            <form role='form' onSubmit={handleSubmit}>
                <div className='box-body'>
                    <Field name='description' value={description} component={LabelAndInput} readOnly={readOnly}
                        label='Item description' cols='12 4' placeholder='Enter the item description' />

                    <Field name='parentId' value={parentId} component={Select} readOnly={readOnly}
                        label='Parent path' cols='12 6' options={list}
                        optionValue='id' optionLabel='path' />
                                        
                    <Grid cols='12 2'>
                        <div className='buttons_checklist_form'></div>
                        <button type='submit' className='btn btn-success'>
                            <i className="icon ion-md-add"></i>
                        </button>
                        <button type='button' className='btn btn-warning'
                            onClick={() => { }}>
                            <i className="icon ion-md-copy"></i>
                        </button>
                        <button type='button' className='btn btn-danger'
                            onClick={this.cleanOrRemove}>
                            <i className="icon ion-md-trash"></i>
                        </button>
                    </Grid>                   
                </div>
                <div className='box-footer'>
                    <If test={!readOnly}>
                        <Field name='checklist' legend='My checklists' component={Tree} tree={tree} hideSlideBar={true} shrink={true} />
                    </If>
                </div>
            </form>
        )
    }
}

ChecklistForm = reduxForm({ form: 'checklistForm', destroyOnUnmount: false })(ChecklistForm)
const selector = formValueSelector('checklistForm')

const mapStateToProps = state => ({
    description: state.checklist.description,
    parentId: state.checklist.parentId,
    list: state.checklist.list,
    tree: state.checklist.tree
})

const mapDispatchToProps = dispatch => bindActionCreators({ init, getList, getTree, showDelete }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ChecklistForm)