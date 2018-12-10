import React from 'react'
import MenuItem from './menuItem'
import MenuTree from './menuTree'

export default props => (
    <ul className='sidebar-menu' data-widget="tree">
        <MenuItem path='/' label='Dashboard' icon='stats' />
        <MenuTree label='Management' icon='construct'> 
            <MenuItem path='users' label='Users' icon='people' />
            <MenuItem path='projects' label='Projects' icon='cube' />    
            <MenuItem path='checklists' label='Checklists' icon='checkbox-outline' />     
        </MenuTree>
        <MenuItem path='evaluations' label='Evaluations' icon='options' />        
    </ul>
)