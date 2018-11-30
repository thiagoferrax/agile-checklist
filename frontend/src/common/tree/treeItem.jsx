import React, {Component} from 'react'
import './treeItem.css'
import If from '../operator/if'
import SlideBar from './slideBar'

export default class TreeItem extends Component {
    constructor(props) {
        super(props)  
        this.state = {
            hideChildren: false
        }      
    }

    toggleIcon(node) { 
        console.log('node', node)
        console.log('hideChildren', this.state.hideChildren)
        this.setState ({
            hideChildren: !this.state.hideChildren
        })        
    }

    render() {
        return (
            <div key={`item_${this.props.node.id}`} className="node">    
                <div className={this.props.children ? 'parent' : ''}>
                    <div className="treeItem">
                        <If test={this.props.children}>
                            <a onClick={() => this.toggleIcon(this.props.node)}>
                                <i className={`fa fa-angle-${this.state.hideChildren ? 'right' : 'down'} ml-2`}/>
                            </a>
                        </If>
                        <div className="treeItemDescription">{this.props.node.description}</div> 
                        <SlideBar node={this.props.node} onChange={this.props.onChange}/>
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
