import React, {Component} from 'react'
import Grid from '../layout/grid'
import ReactSelect from 'react-select';

export default class Select extends Component {

    constructor(props) {
        super(props)
        this.state = { selectedOption: null }
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {
        const {list, optionValue, optionLabel, input} = this.props
        const options = this.getOptions(list, optionValue, optionLabel)
        const selectedOption = this.getSelectedOption(options, input.value)
    
        this.setState({ options, selectedOption })
    }

    componentWillReceiveProps(nextProps) {
		if ((nextProps.input.value != this.props.input.value) || (nextProps.list != this.props.list)) {
            const {list, optionValue, optionLabel, input} = nextProps
            const options = this.getOptions(list, optionValue, optionLabel)
            const selectedOption = this.getSelectedOption(options, input.value)

            this.setState({ options, selectedOption })
        }
    }
    
    getSelectedOption(options, value) {
        return options && options.filter(o => o.value == value)
    }

    getOptions(list, optionValue, optionLabel) {
        return list && list.map(e => ({value:e[optionValue || 'value'], label:e[optionLabel || 'label']}));
    }

    handleChange(selectedOption) {        
        this.props.input.onChange(selectedOption.value);

        if(this.props.inputOnChange) {
            this.props.inputOnChange(selectedOption.value)
        }
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
                    <ReactSelect {...this.props.input} value={this.state.selectedOption} styles={customStyles} options={this.state.options} onChange={this.handleChange} onBlur={() => {}}/>
                </div>
            </Grid>
        )
    }
}