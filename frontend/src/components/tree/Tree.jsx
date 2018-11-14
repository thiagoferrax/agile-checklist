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

    const colors = ['#FF0000', '#FF3300', '#ff6600', '#ff9900', '#FFCC00', '#FFFF00', '#ccff00', '#ccff00', '#99ff00', '#66ff00', '#33ff00'] 
    
    let color = colors[9]
    if(answer<=10) {
        color = colors[0]
    } else if(answer<=20) {
        color = colors[1]
    } else if(answer<=30) {
        color = colors[2]
    } else if(answer<=40) {
        color = colors[3]
    } else if(answer<=50) {
        color = colors[4]
    } else if(answer<=60) {
        color = colors[5]
    } else if(answer<=70) {
        color = colors[6]
    } else if(answer<=80) {
        color = colors[7]
    } else if(answer<=90) {
        color = colors[8]
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