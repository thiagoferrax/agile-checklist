import React from 'react'
import FishboneChart from 'fishbone-chart'
import Grid from '../layout/grid'
import './chart.css'

export default props => {
    if (!props.data) {
        return <React.Fragment></React.Fragment>
    }

    return (
        <Grid cols={props.cols}>
            <div className="fishbone_chart">
                <FishboneChart data={props.data} />
            </div>
        </Grid >
    )
}