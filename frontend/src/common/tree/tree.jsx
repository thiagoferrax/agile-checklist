import React, { Component } from 'react'
import Grid from '../layout/grid'
import TreeItem, {toggleIcon} from './treeItem'
import './tree.css'

export default class Tree extends Component {   
    render() {
        return (
            <Grid cols='12'>
                <fieldset>
                <legend>{this.props.legend}</legend>
                {buildTree(this.props.tree, this.props.onChange)}     
                </fieldset>
            </Grid>            
        )
    }
}

const buildTree = (tree, onChange) => tree && tree.map(node => {
    const children = node.children
    const childrenTree = children.length && buildTree(children, onChange)

    return (
        <TreeItem key={`node_${node.id}`} node={node} onChange={onChange}>
            {childrenTree}
        </TreeItem>          
    )
})

export const initializeAnswers = (tree) => {
    const getAnswers = (accumulator, aTree, parentId) => aTree.reduce(function(accumulator, node) {
        node.answer = 0
        accumulator[node.id] = {answer:node.answer, parentId}

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

const updateSlide = (event, answers) => {
    const slideId = event.target.id
    let answer = event.target.value

    const nodeId = slideId.split('_')[1]
    const parentId = answers[nodeId].parentId
    const oldAnswer = answers[nodeId].answer

    answers[nodeId] = {answer, parentId}
    updateSlideBarColor(nodeId, answer)

    refreshChildrenNodes(nodeId, answers, oldAnswer)
    refreshParentNodes(nodeId, answers)

    return answers
}

const refreshChildrenNodes = (nodeId, answers, oldAnswer = 0) => {
    const MAX = 100
    const MIN = 0

    const getChildren = answers => 
        Object.getOwnPropertyNames(answers).filter(id => answers[id].parentId == nodeId)

    const refreshChildren = (delta, children) => {
        let overcome = 0
        const innerChildren = []
        children.forEach(id => {        
            let oldAnswer = Number(answers[id].answer)
            let newAnswer = oldAnswer + delta

            if(delta >= 0 && newAnswer > MAX) {
                overcome += newAnswer - MAX
                newAnswer = MAX                    
            } else if(delta < 0 && newAnswer < MIN)  {
                overcome += newAnswer - MIN
                newAnswer = MIN                                    
            }

            if(newAnswer > MIN && newAnswer < MAX) {
                innerChildren.push(id)
            }

            answers[id].answer = newAnswer
            updateSlideBarColor(id, newAnswer)            
            refreshChildrenNodes(id, answers, oldAnswer)
        })

        if(overcome && innerChildren.length > 0) {
            delta = overcome / innerChildren.length
            refreshChildren(delta, innerChildren)
        }
    }

    const newAnswer = Number(answers[nodeId].answer)
    const children = getChildren(answers)
    if(newAnswer === MIN || newAnswer === MAX) {
        children.forEach(id => {        
            const childOldAnswer = Number(answers[id].answer)
            answers[id].answer = newAnswer

            updateSlideBarColor(id, newAnswer)            
            refreshChildrenNodes(id, answers, childOldAnswer)
        })
    } else {
        const delta = newAnswer - oldAnswer    
        refreshChildren(delta, children)
    }
}

const refreshParentNodes = (nodeId, answers) => {
    const parentId = answers[nodeId].parentId
    if(parentId) {
        const brothers = Object.getOwnPropertyNames(answers).filter(id => answers[id].parentId == answers[nodeId].parentId)    
        const sum = brothers.reduce((accumulator, id) => accumulator + parseInt(answers[id].answer), 0)
        const parentAnswer = sum/(brothers.length)

        answers[parentId] = {...answers[parentId], answer: parentAnswer} 
        updateSlideBarColor(parentId, parentAnswer)    

        refreshParentNodes(parentId, answers)
    }
}