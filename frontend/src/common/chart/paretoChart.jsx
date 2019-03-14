import React from 'react'
import ParetoChart from 'pareto-chart';
import Grid from '../layout/grid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'

export default props => {
    if (!props.data) {
        return <React.Fragment></React.Fragment>
    }

    const sprints = Object.values(props.data)
    const checklists = Object.values(sprints)
    let hasData = false
    checklists.forEach(data => {
        if(Object.values(data).length > 0) {
            hasData = true
        }
    })

    if(!hasData) {
        return <React.Fragment></React.Fragment>
    }
    
    return (
        <Grid cols={props.cols}>
            <div className="box box-primary">
                <div className="box-header with-border">
                    <FontAwesomeIcon icon={faChartLine} />
                    <h3 className="box-title">&nbsp;&nbsp;PARETO - {props.project}</h3>

                    <div className="box-tools pull-right">
                        <button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i>
                        </button>
                    </div>
                </div>
                <div className="box-body">
                    <p class="text-center">
                        {'Items that scored <= 5.0 by category'}
                    </p>
                    <div className="chart">
                        <ParetoChart
                            width={100}
                            height={20}
                            data={props.data} />
                    </div>
                </div>
            </div>
        </Grid >
    )
}