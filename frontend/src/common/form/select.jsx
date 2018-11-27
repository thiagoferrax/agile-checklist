import React, {Component} from 'react'
import Grid from '../layout/grid'
import ReactSelect from 'react-select';

export default class Select extends Component {
    constructor(props) {
        super(props)

        this.state = { selectedOption: null }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(selectedOption) {
        console.log('selectedOption ' + selectedOption.value)
        this.setState({selectedOption})

        if(this.props.inputOnChange) {
            this.props.inputOnChange(selectedOption.value); 
        }
    }

    createSelectItems() {
        return this.props.list && 
            this.props.list.map(
                element => 
                    ({  value:element[this.props.optionValue || 'value'], 
                        label:element[this.props.optionLabel || 'label']
                    })
            );
    }

    render() {
        const customStyles = {
            option: (provided, state) => ({
              ...provided,
            }),
            control: (provided, state) => ({
                ...provided,
                'min-height': 34,
                height: 34,
                'border-radius': 0,
            }),
            singleValue: (provided, state) => ({
                ...provided,            
            })
        }

        return (            
            <Grid cols={this.props.cols}>
                <div className='form-group'>
                    <label htmlFor={this.props.name}>{this.props.label}</label>
                    <ReactSelect {...this.props} value={this.state.selectedOption} options={this.createSelectItems()}  onChange={this.handleChange} styles={customStyles} />                                       
                </div>
            </Grid>
        )
    }
}