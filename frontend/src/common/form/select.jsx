import React, {Component} from 'react'
import Grid from '../layout/grid'
import ReactSelect from 'react-select';

export default class Select extends Component {    

    handleChange(selectedOption) {
        const {input, optionValue, inputOnChange} = this.props

        if (Array.isArray(selectedOption)) {
            let values = []
                selectedOption.forEach(option => values.push(option[optionValue || 'value']))

            input.onChange(values)
            if(inputOnChange) {
                inputOnChange(values)
            }
        } else {
            input.onChange(selectedOption[optionValue || 'value'])
            if(inputOnChange) {
                inputOnChange(selectedOption[optionValue || 'value'])
            }
        }
    }

    getCustomStyles() {
        const {input} = this.props

        let customStyles = {
            'min-height': 34, 
            height: 34,
            'border-radius': 0}

        if(Array.isArray(input.value) && input.value.length > 1) {
            delete customStyles.height
        }

        return {
            option: provided => ({
              ...provided,
            }),
            control: provided => ({
                ...provided, ...customStyles                
            }),
            singleValue: provided => ({
                ...provided,            
            })
        }
    }

    getValue() {
        const {options, optionValue, input} = this.props

        if (Array.isArray(input.value)) {
            return options && options.filter(opt => {
                for(let i=0; i < input.value.length; i++) {
                    if(input.value[i] == opt[optionValue || 'value']) {
                        return true
                    }
                }
                return false
            })
        } else {
            return options && options.filter(opt => opt[optionValue || 'value'] == input.value)
        }
    }

    render() {
        const {cols, name, label, optionValue, optionLabel, autoFocus, readOnly} = this.props
        return (            
            <Grid cols={cols}>
                <div className='form-group'>
                    <label htmlFor={name}>{label}</label>
                    <ReactSelect {...this.props} 
                        styles={this.getCustomStyles()} 
                        onChange={e => this.handleChange(e)} 
                        getOptionValue={opt=>opt[optionValue || 'value']} 
                        getOptionLabel={opt=>opt[optionLabel || 'label']} 
                        value={this.getValue()} autoFocus={autoFocus} readOnly={readOnly}/>
                </div>
            </Grid>
        )
    }
}