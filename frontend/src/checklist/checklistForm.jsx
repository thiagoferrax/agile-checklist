import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field } from 'redux-form'
import Tree from 'tree-slide-bar'
import If from '../common/operator/if'
import PropTypes from 'prop-types'

import { init, getTree, showDelete, clone, showUpdate, selectParent } from './checklistActions'
import LabelAndInput from '../common/form/labelAndInput'
import Select from '../common/form/select'
import Grid from '../common/layout/grid'

class ChecklistForm extends Component {
    constructor(props) {
        super(props)
        this.cloneChecklist = this.cloneChecklist.bind(this)
    }

    static contextTypes = {
        store: PropTypes.object
    }

    componentWillMount() {
        this.props.getTree()
    }

    getChecklistById(tree, checklistId, found = null) {
        return tree.reduce((found, checklist) => {
            if (checklist.id === checklistId) {
                found = checklist
            } else if (checklist.children) {
                const foundInChildren = this.getChecklistById(checklist.children, checklistId)
                if (foundInChildren) {
                    found = foundInChildren
                }
            }
            return found
        }, found)
    }

    cloneChecklist() {
        const { tree, parentId } = this.props
        const checklist = this.getChecklistById(tree || [], parentId)
        this.props.clone(checklist)
    }

    getChecklists(tree) {
        const { showDelete, showUpdate } = this.props
        let cols = '12 12 12 6'
        if(tree && tree.length == 1) {
            cols = '12'
        }

        return tree && tree.map(checklist => {
            console.log('checklist', checklist)
            return (
                <Grid cols={cols}>
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <i className="fa fa-check"></i>
                            <h3 className="box-title">&nbsp;&nbsp;MY CHECKLIST - {checklist.description}</h3>

                            <div className="box-tools pull-right">
                                <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i>
                                </button>
                            </div>
                        </div>
                        <div className="box-body">
                            <Field
                                key={`checklist_${Math.random()}`}
                                name={`checklist_${Math.random()}`}
                                component={Tree}
                                tree={[checklist]}
                                hideSlideBar={true}
                                onEdit={showUpdate}
                                onDelete={showDelete} />
                        </div>
                    </div>
                </Grid >
            )
        })
    }

    render() {
        const { handleSubmit, readOnly, list, description, parentId, tree, init } = this.props
        return (
            <form role='form' onSubmit={handleSubmit}>
                <div className='box-body'>
                    <Field name='description' value={description} component={LabelAndInput} readOnly={readOnly}
                        label='Item description' cols='12 4' placeholder='Enter the item description' />

                    <Field name='parentId' value={parentId} component={Select} readOnly={readOnly}
                        label='Parent path' cols='12 6' options={list}
                        optionValue='id' optionLabel='path' inputOnChange={this.props.selectParent} />

                    <Grid cols='12 2'>
                        <If test={readOnly}>
                            <div className='buttons_checklist_form'>
                                <button type='submit' className='btn btn-danger'>
                                    <i className="icon ion-md-trash"></i>
                                </button>
                                <button type='button' className='btn btn-default'
                                    onClick={init}>
                                    <i className="icon ion-md-close"></i>
                                </button>
                            </div>
                        </If>
                        <If test={!readOnly}>
                            <div className='buttons_checklist_form'>
                                <button type='submit' className='btn btn-success'>
                                    <i className="icon ion-md-checkmark"></i>
                                </button>
                                <button type='button' className='btn btn-warning' onClick={this.cloneChecklist}>
                                    <i className="icon ion-md-copy"></i>
                                </button>
                                <button type='button' className='btn btn-default'
                                    onClick={init}>
                                    <i className="icon ion-md-close"></i>
                                </button>
                            </div>
                        </If>
                    </Grid>
                    <If test={!readOnly}>
                        {this.getChecklists(tree)}
                    </If>
                </div>
                <div className='box-footer'>                    
                </div>
            </form>
        )
    }
}

ChecklistForm = reduxForm({ form: 'checklistForm', destroyOnUnmount: false })(ChecklistForm)

const mapStateToProps = state => ({
    description: state.checklist.description,
    parentId: state.checklist.parentId,
    list: state.checklist.list,
    tree: state.checklist.tree
})

const mapDispatchToProps = dispatch => bindActionCreators({ init, getTree, showDelete, showUpdate, clone, selectParent }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ChecklistForm)