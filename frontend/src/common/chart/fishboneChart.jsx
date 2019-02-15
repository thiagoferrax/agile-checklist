import React from 'react'
import FishboneChart from 'fishbone-chart'
import Grid from '../layout/grid'

export default props => {
    console.log('fishboneChart', props.data)
    if (!props.data) {
        return <React.Fragment></React.Fragment>
    }

    return (
        <Grid cols={props.cols}>
            <div className="box box-default">
                <div className="box-body">
                    <div className="chart">
                        <FishboneChart data={props.data}/>
                    </div>
                </div>
            </div>
        </Grid >
    )
}