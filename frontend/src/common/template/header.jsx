import React from 'react'

export default props => (
    <header className='main-header'>
        <a href='/#/' className='logo'>
            <span className='logo-mini'><b>My</b>C</span>
            <span className='logo-lg'>
                <i className='fa fa-check'></i>
                <b> My</b> Checklist
            </span>        
        </a>
        <nav className='navbar navbar-static-top'>
            <a href className='sidebar-toggle' data-toggle="push-menu"></a>
        </nav>
    </header>
)