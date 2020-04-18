import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Grid from '../layout/grid'
import If from '../operator/if'

const INITIAL_STATE = { index: 0, animation: false }

export default class SimpleSummaryChart extends Component {
    constructor(props) {
        super(props)
        this.state = INITIAL_STATE
    }

    nextChecklist(step) {
        let index = this.state.index
        index += step

        if (!this.props.summaryData[index]) {
            index = step > 0 ? 0 : this.props.summaryData.length - 1
        }
        this.setState({ index, animation: true })
    }

    getPercentageColor = percentageDirection => {
        let color = 'yellow'
        if (percentageDirection === 'up') {
            color = 'green'
        } else if (percentageDirection === 'down') {
            color = 'red'
        }
        return color
    }

    render() {
        if (!this.props.summaryData) {
            return <React.Fragment></React.Fragment>
        }
        
        let grids = ['12 12']
        if (this.props.summaryData.length > 1) {
            grids = ['11 10']
        }

        return (
            <div className="row">
                <If test={this.props.summaryData.length > 1} >
                    <Grid cols='1'>
                        <div className="simple-description-block simple_carousel_controller">
                            <a href="javascript:;" onClick={() => this.nextChecklist(-1)}>
                                <span className="fa fa-angle-left fa-2x"></span>
                            </a>
                        </div>
                    </Grid>
                </If>
                <ReactCSSTransitionGroup key={`animation_${this.props.title}_${this.state.index}`}
                    transitionName="animation"
                    transitionAppear={true}
                    transitionAppearTimeout={250} 
                    transitionEnterTimeout={250} 
                    transitionLeaveTimeout={250} 
                    transitionEnter={true}
                    transitionLeave={true} >
                    <Grid cols={grids[0]}>
                        <div className="description-block carousel-inner">
                            <h5 className="description-header">{this.props.summaryData[this.state.index].checklist}</h5>
                        </div>
                    </Grid>                    
                </ReactCSSTransitionGroup >
                <If test={this.props.summaryData.length > 1} >
                    <Grid cols='1'>
                        <div className="simple_carousel_controller">
                            <a href="javascript:;" onClick={() => this.nextChecklist(1)}>
                                <span className="fa fa-angle-right fa-2x"></span>
                            </a>
                        </div>
                    </Grid>
                </If>
            </div>

        )
    }
}