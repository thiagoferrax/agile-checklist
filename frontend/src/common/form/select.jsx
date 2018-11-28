import React, {Component} from 'react'
import Grid from '../layout/grid'
import ReactSelect from 'react-select';

export default class Select extends Component {

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {

        console.log('componentWillMount', this.props)

        const {list, optionValue, optionLabel, input} = this.props

        const options = list &&  list.map(element => ({value:element[optionValue || 'value'], label:element[optionLabel || 'label']}))
        const selectedOption = options && options.filter(o => o.value == input.value)
        this.setState({ selectedOption })
        console.log('Selected Option', selectedOption)
    }

    componentWillReceiveProps(nextProps) {
		if (nextProps.value2 != this.props.value2) {
            console.log('Entrou 2:', nextProps.input)
            const {list, optionValue, optionLabel} = nextProps
            const options = list &&  list.map(element => ({value:element[optionValue || 'value'], label:element[optionLabel || 'label']}))
            const selectedOption = options && options.filter(o => o.value == nextProps.value2)
            this.setState({ selectedOption })
            console.log('Selected Option', selectedOption)
        }
	}

    handleChange(selectedOption) {
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
                    <ReactSelect id={this.props.name} {...this.props.input} styles={customStyles} value={this.state.selectedOption} options={this.createSelectItems()} onChange={this.handleChange} />
                </div>
            </Grid>
        )
    }
}