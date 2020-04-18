import React from 'react'
import './header.css'
import Navbar from './navbar'

export default props => (
    <header className='main-header'>
        <a href='/#/' className='logo'>
            <span className='logo-mini'><b>M</b>y<b>C</b></span>
            <span className='logo-lg'>
                <i className='icon ion-md-checkbox-outline'></i>
                &nbsp;&nbsp;<b>M</b>y <b>C</b>hecklist
            </span>        
        </a>
        <nav className='navbar navbar-static-top'>
            <a href="javascript:;" className='sidebar-toggle' data-toggle="push-menu"></a>
            <Navbar /> 
        </nav>
    </header>
)