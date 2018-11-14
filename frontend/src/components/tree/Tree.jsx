import React from 'react'
import './Tree.css'
import TreeItem from './TreeItem'

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
    const getAnswers = (accumulator, childrenTree) => childrenTree.reduce(function(accumulator, checklist) {
        accumulator[checklist.id] = 0

        if(checklist.children) {
            getAnswers(accumulator, checklist.children)
        }

        return accumulator
    }, accumulator)

    return getAnswers({}, tree)
}

const getSlideBarColor = (answer) => {
    const colors = ['#dc3545', '#ffc107', '#17a2b8', '#28a745']
    let color = colors[3]
    if(answer <= 25) {
        color = colors[0]
    } else if (answer <= 50){
        color = colors[1]
    } else if (answer <= 75){
        color = colors[2]
    } 

    return color
}

const updateSlide = (event, answersList ) => {
    const slideId = event.target.id
    let answer = event.target.value

    const checklistId = slideId.split('_')[1]
    answersList[checklistId] = answer

    document.getElementById(slideId).style = `background: ${getSlideBarColor(answer)} !important`
    
    return answersList
}

export {initializeAnswers, updateSlide}