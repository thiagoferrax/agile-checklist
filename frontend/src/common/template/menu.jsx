import React from 'react'
import MenuItem from './menuItem'
import MenuTree from './menuTree'

export default props => (
    <ul className='sidebar-menu'>
        <MenuItem path='/' label='Dashboard' icon='dashboard' />
        <MenuTree label='Management' icon='gears'> 
            <MenuItem path='users'
                label='Users' icon='users' />
            <MenuItem path='projects'
                label='Projects' icon='cubes' />    
        </MenuTree>
    </ul>
)