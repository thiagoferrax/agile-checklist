import React from 'react'
import Grid from '../layout/grid'

export default props => {
    function createSelectItems() {
        let count = 0
        const options = props.list && props.list.map(element => 
            <option key={`option_${props.id}_${count++}`} value={element[props.optionValue]}>{element[props.optionLabel]}</option>
        )
        return options;
    }

    console.log(props.onChange)

    return (
    <Grid cols={props.cols}>
        <div className='form-group'>
            <label htmlFor={props.name}>{props.label}</label>
            <select {...props.input} className='form-control' readOnly={props.readOnly}>
                <option key="form-control-key" value=''>Select an option</option>
                {createSelectItems()}
                {props.children}    
            </select>                                        
        </div>
    </Grid>
)}