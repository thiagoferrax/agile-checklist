import React from 'react'
import Timeline from '../../timeline/timeline'
import Grid from '../layout/grid'
import './chart.css'

export default props => {
    let today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return (
        <Grid cols={props.cols}>
            <div className="box box-primary">
                <div className="box-header with-border">
                    <i className="fa fa-calendar"></i>
                    <h3 className="box-title">&nbsp;&nbsp;TIMELINE</h3>
                </div>
                <div className="box-body box-body-timeline">
                    <div className="chart fixedBox">
                        <Timeline onlyTimelineContent={true} fromDay={today}/>
                    </div>
                </div>
                <div className="box-footer">
                    <i className="icon ion-md-information-circle-outline"></i> {'Main events of the day'}
                </div>
            </div>
        </Grid >
    )
}