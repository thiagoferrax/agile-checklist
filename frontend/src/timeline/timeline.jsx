import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getTimeline } from './timelinedActions'
import ContentHeader from '../common/template/contentHeader'
import Content from '../common/template/content'
import TimelineItem from '../common/template/timelineItem'
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
        const timelineData = this.props.timeline.data

        return (
            <div>
                <ContentHeader title='Timeline' small='Main Events' />
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

    projectItem({ project, user, formattedTime }) {
        return (
            <TimelineItem key={`projects_${formattedTime}`} icon="cube" color="aqua" time={formattedTime}>
                <a href="/#/projects">{project}</a> was created by <a href="#">{user}</a>
            </TimelineItem>
        )
    }

    userItem({ user, formattedTime }) {
        return (
            <TimelineItem key={`users_${formattedTime}`} icon="user" color="red" time={formattedTime}>
                <a href="#">{user}</a> was registered in <a href="#">My Checklist</a>
            </TimelineItem>
        )
    }

    evaluationItem({ sprint, project, user, checklist, formattedTime }) {
        return (
            <TimelineItem key={`evaluations_${formattedTime}`} icon="sliders" color="green" time={formattedTime}>
                <a href="/#/evaluations">Sprint {sprint}</a> of <a href="/#/projects">{project}</a> was evaluated by <a href="#">{user}</a> using <a href="/#/checklists">{checklist}</a>
            </TimelineItem>
        )
    }

    checklistItem({ checklist, user, formattedTime }) {
        return (
            <TimelineItem key={`checklists_${formattedTime}`} icon="check" color="yellow" time={formattedTime}>
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
        let dates = data && Object.keys(data)

        dates = dates && dates.sort((d1, d2) => new Date(d2) - new Date(d1))

        return dates && dates.reduce((items, day) => {
            items.push(this.date(day))

            const sortedData = data[day].sort((d1, d2) => new Date(d2.data.time) - new Date(d1.data.time))

            sortedData.forEach(log =>  items.push(this[`${log.type}Item`](log.data)))
            return items
        }, [])
    }
}

const mapStateToProps = state => ({ timeline: state.timeline.timeline })
const mapDispatchToProps = dispatch => bindActionCreators({ getTimeline }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Timeline)