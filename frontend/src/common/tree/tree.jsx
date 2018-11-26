import React, { Component } from 'react'
import { connect } from 'react-redux'
import Grid from '../layout/grid'
import Row from '../layout/row'
import TreeItem, {toggleIcon} from './treeItem'
import './tree.css'
import SlideBar from './slideBar'
import If from '../operator/if'

class Tree extends Component {
    render() {
        return (
            <Grid cols='12'>
                <fieldset>
                <legend>{this.props.legend}</legend>
                {buildTree(this.props.tree)}     
                </fieldset>
            </Grid>            
        )
    }
}

const buildTree = tree => tree.map(node => {
    const nodeId = node.id    
    const parentId = node.parentId    
    const answer = node.answer || 0 

    const description = node.description
    const children = node.children

    const childrenTree = buildTree(children)

    return (
        <div key={nodeId} className="node">    
            <div className={children.length ? 'parent' : ''}>
                <TreeItem id={nodeId} description={description} onClick={toggleNode} iconHidden={!children.length} >
                    <SlideBar id={nodeId} value={answer} />
                </TreeItem>               
            </div>
            <If test={childrenTree}>
                <div className="children" id={`children_${nodeId}`}>
                    {childrenTree} 
                </div>                  
            </If>  
        </div>     
    )
})

const initializeAnswers = (tree) => {
    const getAnswers = (accumulator, aTree, parentId) => aTree.reduce(function(accumulator, node) {
        accumulator[node.id] = {answer:0, parentId}

        if(node.children) {
            getAnswers(accumulator, node.children, node.id)
        }

        return accumulator
    }, accumulator)

    return getAnswers({}, tree, null)
}

const toggleNode = (nodeId) => {
    const children  = document.getElementById(`children_${nodeId}`)
    children.hidden = !children.hidden        
    toggleIcon(nodeId)
}

const isGrandparent = node => node.children.reduce((accumulator, child) => {
    accumulator = accumulator || (child.children.length > 0)
    return accumulator
}, false)

const mapStateToProps = state => ({})
export default connect(mapStateToProps)(Tree)