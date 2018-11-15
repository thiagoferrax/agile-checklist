import React from 'react'
import './Tree.css'
import TreeItem, {updateSlideBarColor} from './TreeItem'

export default props => {
  
    const closeNode = (checklistId) => {
        const children  = document.getElementById(`children_${checklistId}`)
        const link  = document.getElementById(`link_${checklistId}`)

        children.hidden = !children.hidden        
        link.className = link.className === 'fa fa-angle-down ml-2' ? 'fa fa-angle-right ml-2' : 'fa fa-angle-down ml-2'
    }

    const buildTree = tree => tree.map(checklist => {
        
        const getChildren = node => node.children

        const children = getChildren(checklist)

        return (
            <div className="checklist">    
                <div key={checklist.id} className={children.length > 0 ? "parent" : ""}>
                    <TreeItem id={checklist.id} description={checklist.description} onClick={closeNode} hidden={children.length === 0} updateSlideBar={props.updateSlideBar} answerList={props.answerList} />
                    <div className="children" id={`children_${checklist.id}`}>
                        {buildTree(children)} 
                    </div>
                </div>                   
            </div>     
        )
    })
    
    return buildTree(props.tree)
}

const initializeAnswers = (tree) => {
    const getAnswers = (accumulator, aTree, parentId) => aTree.reduce(function(accumulator, checklist) {
        accumulator[checklist.id] = {answer:0, parentId}

        if(checklist.children) {
            getAnswers(accumulator, checklist.children, checklist.id)
        }

        return accumulator
    }, accumulator)

    return getAnswers({}, tree, null)
}

const refreshChildrenNodes = (checklistId, answersList) => {
    Object.getOwnPropertyNames(answersList).forEach(id => {        
        if(answersList[id].parentId == checklistId) {
            const parentAnswer = answersList[checklistId].answer

            const child = answersList[id]
            child.answer = parentAnswer

            updateSlideBarColor(id, child.answer)

            refreshChildrenNodes(id, answersList)
        }
    }) 
}

const refreshParentNodes = (checklistId, answersList) => {
    const parentId = answersList[checklistId].parentId
    if(parentId) {
        const brothers = Object.getOwnPropertyNames(answersList).filter(id => answersList[id].parentId == answersList[checklistId].parentId)    
        const sum = brothers.reduce((accumulator, id) => accumulator + parseInt(answersList[id].answer), 0)

        const parentAnswer = sum/(brothers.length)

        answersList[parentId] = {...answersList[parentId], answer: parentAnswer} 

        updateSlideBarColor(parentId, parentAnswer)    

        refreshParentNodes(parentId, answersList)
    }
}

const updateSlide = (event, answersList) => {
    const slideId = event.target.id
    let answer = event.target.value

    const checklistId = slideId.split('_')[1]
    const parentId = answersList[checklistId].parentId

    answersList[checklistId] = {answer, parentId}

    updateSlideBarColor(checklistId, answer)

    refreshChildrenNodes(checklistId, answersList)
    refreshParentNodes(checklistId, answersList)

    return answersList
}

export {initializeAnswers, updateSlide}