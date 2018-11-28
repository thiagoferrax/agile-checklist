import React, {Component} from 'react'
import Grid from '../layout/grid'
import ReactSelect from 'react-select';

export default class Select extends Component {
    constructor(props) {
        super(props)

        const options  = this.createSelectItems()
        const initialOption = options && options.filter(o => o.value === props.value) || {}

        this.state = { selectedOption: initialOption}
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(selectedOption) {
        this.setState({selectedOption})

        if(this.props.inputOnChange) {
            this.props.inputOnChange(selectedOption.value); 
        }
    }

    createSelectItems() {
        const {list, optionValue, optionLabel} = this.props
        return list &&  list.map(
            element => ({value:element[optionValue || 'value'], label:element[optionLabel || 'label']}));
    }

    render() {
        const customStyles = {
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

        return (            
            <Grid cols={this.props.cols}>
                <div className='form-group'>
                    <label htmlFor={this.props.name}>{this.props.label}</label>
                    <ReactSelect id={this.props.name} {...this.props.input} styles={customStyles} value={this.state.selectedOption} 
                        options={this.createSelectItems()} onChange={this.handleChange} 
                        onBlur={() => this.props.input.onBlur(this.props.input.value)}/>                                       
                </div>
            </Grid>
        )
    }
}