import React, {Component} from 'react'
import Grid from '../layout/grid'
import ReactSelect from 'react-select';

export default class Select extends Component {    

    handleChange(selectedOption) {
        const {input, optionValue, inputOnChange} = this.props

        input.onChange(selectedOption[optionValue || 'value']);
        if(inputOnChange) {
            inputOnChange(selectedOption[optionValue || 'value'])
        }
    }

    getCustomStyles() {
        return {
            option: provided => ({
              ...provided,
            }),
            control: provided => ({
                ...provided,
                'min-height': 34,
                height: 34,
                'border-radius': 0,
            }),
            singleValue: provided => ({
                ...provided,            
            })
        }
    }

    getValue() {
        const {options, optionValue, input} = this.props
        return options && options.filter(opt => opt[optionValue || 'value'] == input.value)
    }

    render() {
        const {cols, name, label, optionValue, optionLabel} = this.props
        return (            
            <Grid cols={cols}>
                <div className='form-group'>
                    <label htmlFor={name}>{label}</label>
                    <ReactSelect {...this.props} 
                        styles={this.getCustomStyles()} 
                        onChange={e => this.handleChange(e)} 
                        getOptionValue={opt=>opt[optionValue || 'value']} 
                        getOptionLabel={opt=>opt[optionLabel || 'label']} 
                        value={this.getValue()}/>
                </div>
            </Grid>
        )
    }
}