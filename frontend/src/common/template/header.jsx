import React from 'react'
import './header.css'
import Navbar from './navbar'

export default props => (
    <header className='main-header'>
        <a href='/#/' className='logo'>
            <span className='logo-mini'>
                <i className='icon ion-md-checkbox-outline'></i>
            </span>
            <span className='logo-lg'>
                <i className='icon ion-md-checkbox-outline'></i>
                &nbsp;&nbsp;My Checklist
            </span>
        </a>
        <nav className='navbar navbar-static-top'>
            <a href="javascript:;" className='sidebar-toggle' data-toggle="push-menu"></a>
            <Navbar />
        </nav>
    </header>
)