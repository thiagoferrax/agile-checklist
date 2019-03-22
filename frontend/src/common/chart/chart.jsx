import React from 'react'
import Grid from '../layout/grid'
import If from '../operator/if'
import SummaryChart from './summaryChart'
import './chart.css'

export default props => {
    return (
        <Grid cols={props.cols}>
            <div className="box card">
                <div className="box-header with-border">
                    <i className={props.icon}></i>
                    <h3 className="box-title">{props.title}</h3>
                </div>
                <div className="box-body">
                    <If test={props.bodyTitle}>
                        <p className="text-center">
                            {props.bodyTitle}
                        </p>
                    </If>
                    <div className="chart">
                        {props.children}
                    </div>
                </div>
                <div className="card-footer">
                    <If test={props.summaryData}>
                        <SummaryChart summaryData={props.summaryData} title={props.title}/>
                    </If>
                    <If test={props.footerText}>
                        <i className="icon ion-md-information-circle-outline"></i> {props.footerText}
                    </If>
                </div>
            </div>
        </Grid >
    )
}