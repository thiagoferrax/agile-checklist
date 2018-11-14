import React from 'react'
import './Tree.css'

export default props => {
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

    const updateSlideBar = (event) => {
        const slideId = event.target.id
        const checklistId = slideId.split('_')[1]

        let answer = event.target.value

        document.getElementById(slideId).style = `background: ${this.getSlideBarColor(answer)} !important`

        const answersList = this.state.answerList
        answersList[checklistId] = answer

        this.setState({ answersList })
    }

    const closeNode = (checklistId) => {
        const children  = document.getElementById(checklistId)
        const link  = document.getElementById(`link_${checklistId}`)

        children.hidden = !children.hidden        
        link.className = link.className === 'fa fa-angle-down ml-2' ? 'a fa-angle-right ml-2' : 'fa fa-angle-down ml-2'
    }

    const buildTree = tree => tree.map(checklist => {
        
        const getChildren = node => node.children

        const children = getChildren(checklist)

        return (
            <div key={checklist.id} className={children.length > 0 ? "parent" : ""}>
                <div className="rowItem">
                    <a onClick={() => this.closeNode(checklist.id)}><i id={`link_${checklist.id}`} className="fa fa-angle-down ml-2" hidden={children.length === 0}></i></a>
                    <div className="ml-2">{checklist.description}</div> 
                    <div className="slidecontainer">
                        <input type="range" min="0" max="100" value="0" className="slider" id={`slide_${checklist.id}`} value={this.state.answerList[checklist.id]}  onChange={e => this.updateSlideBar(e)}/>
                    </div>
                </div>
                <div className="children" id={checklist.id}>
                    {buildTree(children)} 
                </div>
            </div>                    
        )
    })
    
    return buildTree(props.tree)
}