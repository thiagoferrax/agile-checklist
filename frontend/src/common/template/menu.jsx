import React from 'react'
import MenuItem from './menuItem'
import MenuTree from './menuTree'

export default props => (
    <ul className='sidebar-menu' data-widget="tree">
        <MenuItem path='/' label='Dashboard' icon='stats' />
        <MenuTree label='Management' icon='rocket'> 
            <MenuItem path='projects' label='Projects' icon='cube' />    
            <MenuItem path='checklists' label='Checklists' icon='checkbox-outline' />     
            <MenuItem path='timeline' label='Timeline' icon='calendar' />
        </MenuTree>
        <MenuItem path='evaluations' label='Evaluations' icon='options' />        
    </ul>
)