import React from 'react'
import Grid from '../layout/grid'
import Select from 'react-select';

export default props => {
    function createSelectItems() {
        return props.list && props.list.map(element => ({value:element[props.optionValue], label:element[props.optionLabel]}));
    }

    function handleChange (selectedOption) {        
        if(props.inputOnChange) {
            props.inputOnChange(selectedOption.value); 
        }
    }

    return (
    <Grid cols={props.cols}>
        <div className='form-group'>
            <label htmlFor={props.name}>{props.label}</label>
            <Select options={createSelectItems()}  onChange={handleChange} />                                       
        </div>
    </Grid>
    )
}