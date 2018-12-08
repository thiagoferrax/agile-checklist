import React from 'react'
import Grid from '../layout/grid'

export default props => (
    <Grid cols={props.cols}>            
        <div class="info-box">
            <span className={`info-box-icon bg-${props.color}`}><i className={`fa fa-${props.icon}`}></i></span>
            <div className="info-box-content">
                <span className="info-box-text">{props.text}</span>
                <span className="info-box-number">{props.value}</span>
            </div>
        </div>
    </Grid>
)