import React from 'react'
import FishboneChart from 'fishbone-chart'
import Grid from '../layout/grid'

export default props => {
    if (!props.data) {
        return <React.Fragment></React.Fragment>
    }

    return (
        <Grid cols={props.cols}>
            <div className="box box-primary">
                <div className="box-header with-border">
                <i className="fa fa-lightbulb-o"></i>
                    <h3 className="box-title">&nbsp;&nbsp;&nbsp;CAUSE AND EFFECT - {props.project}</h3>

                    <div className="box-tools pull-right">
                        <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i>
                        </button>
                    </div>
                </div>
                <div className="box-body">
                    <div className="chart">
                        <FishboneChart data={props.data} />
                    </div>
                </div>
            </div>
        </Grid >
    )
}