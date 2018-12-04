import React, {Component} from 'react'
import './treeItem.css'
import If from '../operator/if'
import SlideBar from './slideBar'

export default class TreeItem extends Component {
    constructor(props) {
        super(props)  
        this.state = {hideChildren: false}
    }

    componentWillMount() {
        this.setState({...this.state, node: this.props.node})
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.node != nextProps.node) {
            this.setState({...this.state, node: nextProps.node})
        }
    }

    toggleIcon(node) { 
        this.setState ({...this.state,  hideChildren: !this.state.hideChildren})        
    }

    render() {
        return (
            <div key={`item_${this.state.node.id}`} className="node">    
                <div className={this.props.children ? 'parent' : ''}>
                    <div className="treeItem">
                        <If test={this.props.children}>
                            <a onClick={() => this.toggleIcon(this.state.node)}>
                                <i className={`fa fa-angle-${this.state.hideChildren ? 'right' : 'down'} ml-2`}/>
                            </a>
                        </If>
                        <div className="treeItemDescription">{this.state.node.description}</div> 
                        <SlideBar node={this.state.node} onChange={this.props.onChange} />
                    </div>            
                </div>
                <If test={this.props.children && !this.state.hideChildren}>
                    <div className='children'>
                        {this.props.children}
                    </div>                  
                </If>
            </div>            
        )
    }     
}
