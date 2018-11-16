import React from 'react'
import './Tree.css'
import TreeItem, {toggleIcon}from './TreeItem'
import SlideBar, {updateSlideBarColor} from './SlideBar';

export default props => {
  
    const toggleNode = (nodeId) => {
        const children  = document.getElementById(`children_${nodeId}`)
        children.hidden = !children.hidden        

        toggleIcon(nodeId)
    }

    const buildTree = tree => tree.map(node => {
        const nodeId = node.id    
        const description = node.description
        const children = node.children
        const answer = props.answers[nodeId].answer

        return (
            <div className="node">    
                <div key={nodeId} className={children.length ? 'parent' : ''}>
                    <TreeItem id={nodeId} description={description} onClick={toggleNode} 
                        iconHidden={!children.length}>
                        <SlideBar id={nodeId} value={answer} answers={props.answers} 
                            onChange={props.updateSlideBar}/>
                    </TreeItem>    
                    <div className="children" id={`children_${nodeId}`}>
                        {buildTree(children)} 
                    </div>
                </div>                   
            </div>     
        )
    })
    
    return buildTree(props.tree)
}

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

const refreshChildrenNodes = (nodeId, answers) => {
    Object.getOwnPropertyNames(answers).forEach(id => {        
        if(answers[id].parentId == nodeId) {
            const parentAnswer = answers[nodeId].answer

            const child = answers[id]
            child.answer = parentAnswer

            updateSlideBarColor(id, child.answer)

            refreshChildrenNodes(id, answers)
        }
    }) 
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

const updateSlide = (event, answers) => {
    const slideId = event.target.id
    let answer = event.target.value

    const nodeId = slideId.split('_')[1]
    const parentId = answers[nodeId].parentId

    answers[nodeId] = {answer, parentId}
    updateSlideBarColor(nodeId, answer)

    refreshChildrenNodes(nodeId, answers)
    refreshParentNodes(nodeId, answers)

    return answers
}

export {initializeAnswers, updateSlide}