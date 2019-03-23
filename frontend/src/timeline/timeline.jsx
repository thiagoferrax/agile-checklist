import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getTimeline } from './timelinedActions'

import TimelineChart from '../common/template/timeline'

import './timeline.css'

class Timeline extends Component {
    componentWillMount() {
        this.props.getTimeline()
    }

    componentDidMount() {
        this.interval = setInterval(() => this.props.getTimeline(), 5000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }
    render() {
        return (
            <TimelineChart data={this.props.timeline.data}/>
        )
    }
}

const mapStateToProps = state => ({ timeline: state.timeline.timeline })
const mapDispatchToProps = dispatch => bindActionCreators({ getTimeline }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Timeline)