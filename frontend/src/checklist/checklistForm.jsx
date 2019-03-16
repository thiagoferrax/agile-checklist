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
        let { tree, parentId } = this.props

        if(!parentId) {
            parentId = undefined
        }

        const checklist = this.getChecklistById(tree || [], parentId)
            this.props.clone(checklist)
    }

    getChecklists(tree) {
        const { showDelete, showUpdate } = this.props
        return tree && tree.map(checklist => {
            return (
                <Grid key={`checklist_${checklist.id}`} cols='12'>
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <i className="fa fa-check"></i>
                            <h3 className="box-title">&nbsp;&nbsp;MY CHECKLIST - {checklist.description}</h3>
                        </div>
                        <div className="box-body">
                            <Field
                                name={`checklist_${checklist.id}`}
                                component={Tree}
                                tree={[checklist]}
                                hideSlideBar={true}
                                onEdit={showUpdate}
                                onDelete={showDelete} 
                                shrink={true}/>
                        </div>
                    </div>
                </Grid >
            )
        })
    }

    render() {
        const { handleSubmit, readOnly, myChecklists, description, parentId, tree, init } = this.props
        return (
            <form role='form' onSubmit={handleSubmit}>
                <div className='box-body'>
                    <Field name='description' value={description} component={LabelAndInput} readOnly={readOnly}
                        label='Item description' cols='12 4' placeholder='Enter the item description' autoFocus={true} />

                    <Field name='parentId' value={parentId} component={Select} readOnly={readOnly}
                        label='Parent path' cols='12 6' options={myChecklists}
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
                                <button type='submit' className='btn btn-primary' title="Save">
                                    <i className="fa fa-check"></i>
                                </button>
                                <button type='button' className='btn btn-warning' onClick={this.cloneChecklist} title="Clone Parent path">
                                    <i className="fa fa-copy"></i>
                                </button>
                                <button type='button' className='btn btn-default'
                                    onClick={init} title="Clear">
                                    <i className="icon ion-md-close"></i>
                                </button>
                            </div>
                        </If>
                    </Grid>
                </div>
                <div className='box-footer'>
                    <If test={!readOnly}>
                        {this.getChecklists(tree)}
                    </If>
                </div>
            </form>
        )
    }
}

ChecklistForm = reduxForm({ form: 'checklistForm', destroyOnUnmount: false })(ChecklistForm)

const mapStateToProps = state => ({
    description: state.checklist.description,
    parentId: state.checklist.parentId,
    myChecklists: state.checklist.myChecklists,
    tree: state.checklist.tree
})

const mapDispatchToProps = dispatch => bindActionCreators({ init, getTree, showDelete, showUpdate, clone, selectParent }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ChecklistForm)