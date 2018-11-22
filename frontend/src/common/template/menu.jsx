import React from 'react'
import MenuItem from './menuItem'
import MenuTree from './menuTree'

export default props => (
    <ul className='sidebar-menu'>
        <MenuItem path='/' label='Dashboard' icon='dashboard' />
        <MenuTree label='Register' icon='edit'> 
            <MenuItem path='users'
                label='Users' icon='users' />
        </MenuTree>
    </ul>
)