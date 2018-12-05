import React from 'react'
import Grid from '../layout/grid'
import './checkbox.css'

export default props => (
    <Grid cols={props.cols}>
        <div className='form-group'>
            <label htmlFor={props.name}>{props.label}</label>
            <input {...props.input} readOnly={props.readOnly} type='checkbox' className='form-checklist-control' checked={props.input.value}/>
        </div>
    </Grid>
)