import React from 'react'
import Grid from '../layout/grid'

export default props => (
    <Grid cols={props.cols}>
        <div className={`info-box bg-${props.color}`}>
            <span className="info-box-icon"><i className={`fa fa-${props.icon}`}></i></span>
            <div className="info-box-content">
                <span className="info-box-text">{props.text}</span>
                <span className="info-box-number">{props.value}</span>
                <div className="progress">
                    <div className="progress-bar" style={{ width: props.progress }}></div>
                </div>
                <span className="progress-description">
                    {props.description}
                </span>
            </div>
        </div>
    </Grid>
)