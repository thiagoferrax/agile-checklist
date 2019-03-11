import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getTimeline } from './timelinedActions'
import ContentHeader from '../common/template/contentHeader'
import Content from '../common/template/content'
import TimelineItem from '../common/template/timelineItem'

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
        const timelineData = this.props.timeline.data

        return (
            <div>
                <ContentHeader title='Timeline' small='Version 1.0' />
                <Content>
                    <ul className="timeline">
                        {this.getTimelineItems(timelineData)}
                    </ul>
                </Content>
                <br />
                <br />
            </div>
        )
    }

    projectItem({ project, user, time }) {
        return (
            <TimelineItem key={Math.random()} icon="cube" color="aqua" time={time}>
                <a href="/#/projects">{project}</a> was created by <a href="#">{user}</a>
            </TimelineItem>
        )
    }

    userItem({ user, time }) {
        return (
            <TimelineItem key={Math.random()} icon="user" color="yellow" time={time}>
                <a href="#">{user}</a> was registered in <a href="#">My Checklist</a>
            </TimelineItem>
        )
    }

    evaluationItem({ sprint, project, user, checklist, time }) {
        return (
            <TimelineItem key={Math.random()} icon="sliders" color="green" time={time}>
                <a href="/#/evaluations">Sprint {sprint}</a> of <a href="/#/projects">{project}</a> was evaluated by <a href="#">{user}</a> using <a href="/#/checklists">{checklist}</a>
            </TimelineItem>
        )
    }

    checklistItem({ checklist, user, time }) {
        return (
            <TimelineItem key={Math.random()} icon="check" color="red" time={time}>
                <a href="/#/checklists">{checklist}</a> was created by <a href="#">{user}</a>
            </TimelineItem>
        )
    }

    date(date) {
        return (
            <li key={Math.random()} className="time-label">
                <span className="bg-white">
                    {date}
                </span>
            </li>
        )
    }

    getTimelineItems(data) {
        const dates = data && Object.keys(data)

        return dates && dates.reduce((items, day) => {
            items.push(this.date(day))
            data[day].forEach(log =>  items.push(this[`${log.type}Item`](log.data)))
            return items
        }, [])
    }
}

const mapStateToProps = state => ({ timeline: state.timeline.timeline })
const mapDispatchToProps = dispatch => bindActionCreators({ getTimeline }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Timeline)