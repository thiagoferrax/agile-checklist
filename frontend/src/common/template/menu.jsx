import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import MenuItem from './menuItem'
import MenuTree from './menuTree'
import If from '../operator/if'

import { setProjectId } from '../../dashboard/dashboardActions'

class Menu extends Component {
    renderProjects(projects) {
        if(!projects) {
            return
        }

        projects.sort((a, b) => a.id - b.id)

        return projects.map(
            project => {
                return (<MenuItem path='/' label={project.name} icon='checkmark' onItemClick={() => this.props.setProjectId(project.id)}/>)
            }
        )
    }

    render() {
        let projects = this.props.projects
        return (
            <ul className='sidebar-menu' data-widget="tree">
                <If test={!projects || projects.length <= 1}>
                    <MenuItem path='/' label='Dashboard' icon='stats' />
                </If>
                <If test={projects && projects.length > 1}>
                    <MenuTree label='Dashboard' icon='stats'> 
                        {this.renderProjects(projects)}
                    </MenuTree>
                </If>
                <MenuItem path='projects' label='Projects' icon='cube' />    
                <MenuItem path='checklists' label='Checklists' icon='checkbox-outline' />     
                <MenuItem path='evaluations' label='Evaluations' icon='options' />  
                <MenuItem path='timeline' label='Timeline' icon='calendar' />      
            </ul>
        )
    }


}

const mapStateToProps = state => ({projects: state.project.list})
const mapDispatchToProps = dispatch => bindActionCreators({setProjectId}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Menu)