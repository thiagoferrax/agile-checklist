import React, { Component } from 'react'
import Grid from '../layout/grid'
import TreeItem, {toggleIcon} from './treeItem'
import './tree.css'

export default class Tree extends Component {  

    constructor(props) {
        super(props)
        this.state = {tree: []}
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {
        this.setState({tree: this.props.tree})
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.tree != nextProps.tree) {
            this.setState({tree: nextProps.tree})
        }
    }

    refreshTree(tree, id, value) {        
        return tree.map(
            node => {
                const children = this.refreshTree(node.children, id, value)            
                return (node.id == id) ? {...node, value, children} : {...node, children}
            }) 
    }

    handleChange(value, node) {
        const tree = this.refreshTree(this.state.tree, node.id, value)
        this.setState({tree})

        if (this.props.input.onChange) {
            this.props.input.onChange(this.state.tree)
        }
    }

    render() {
        return (
            <Grid cols='12'>
                <fieldset>
                <legend>{this.props.legend}</legend>
                {buildTree(this.state.tree, this.handleChange)}
                </fieldset>
            </Grid>
        )
    }
}

const buildTree = (tree, onChange) => tree && tree.map(node => {
    const children = node.children
    const childrenTree = children.length && buildTree(children, onChange)
    return (
        <TreeItem key={`node_${node.id}`} node={node} onChange={onChange} >
            {childrenTree}
        </TreeItem>          
    )
})