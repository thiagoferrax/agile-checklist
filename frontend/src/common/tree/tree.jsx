import React, { Component } from 'react'
import Grid from '../layout/grid'
import TreeItem, {toggleIcon} from './treeItem'
import './tree.css'

export default class Tree extends Component {  

    constructor(props) {
        super(props)
        this.state = {tree: []}
        this.handleChange = this.handleChange.bind(this)
        this.getInitialValuesMap = this.getInitialValuesMap.bind(this)
        this.getValuesMap = this.getValuesMap.bind(this)
    }

    componentWillMount() {
        this.setState({tree: this.props.tree})
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.tree != nextProps.tree) {
            this.setState({tree: nextProps.tree})
        }
    }

    refreshTree(tree, valuesMap) {        
        return tree.map(
            node => {
                const children = this.refreshTree(node.children, valuesMap)            
                return valuesMap.hasOwnProperty(node.id) ? {...node, value:valuesMap[node.id].value, children} : {...node, children}
            })
    }

    getInitialValuesMap(tree, initialMap={}) {
        return tree.reduce((map, node) => {
                map[node.id] = {value:node.value, parentId:node.parentId}
                return this.getInitialValuesMap(node.children, map)
            }, initialMap)
    }

    getValuesMap(tree, node, value) {
        const initialValuesMap = this.getInitialValuesMap(tree)      
        const valuesMap = this.refreshNodesValues(initialValuesMap, node, value)
        return valuesMap
    }

    refreshNodesValues(valuesMap, node, value) {    
        const nodeId = node.id
        const parentId = valuesMap[nodeId].parentId
        const oldValue = valuesMap[nodeId].value
    
        valuesMap[nodeId] = {value, parentId}
       
        this.refreshChildrenNodes(nodeId, valuesMap, oldValue)
        this.refreshParentNodes(nodeId, valuesMap)

        return valuesMap
    }

    refreshParentNodes(nodeId, valuesMap) {
        const parentId = valuesMap[nodeId].parentId
        if(parentId) {
            const brothers = Object.getOwnPropertyNames(valuesMap).filter(id => valuesMap[id].parentId == valuesMap[nodeId].parentId)
            const sum = brothers.reduce((accumulator, id) => accumulator + parseInt(valuesMap[id].value), 0)
            const parentValue = sum/(brothers.length)
    
            valuesMap[parentId] = {...valuesMap[parentId], value: parentValue} 
    
            this.refreshParentNodes(parentId, valuesMap)
        }
    }

    refreshChildrenNodes(nodeId, valuesMap, oldValue = 0) {
        const MAX = 10
        const MIN = 0
    
        const getChildren = valuesMap => 
            Object.getOwnPropertyNames(valuesMap).filter(id => valuesMap[id].parentId == nodeId)
    
        const refreshChildren = (delta, children) => {
            let overcome = 0
            const innerChildren = []
            children.forEach(id => {        
                let oldValue = valuesMap[id].value
                let newValue = oldValue + delta
    
                if(delta >= 0 && newValue > MAX) {
                    overcome += newValue - MAX
                    newValue = MAX                    
                } else if(delta < 0 && newValue < MIN)  {
                    overcome += newValue - MIN
                    newValue = MIN                                    
                }
    
                if(newValue > MIN && newValue < MAX) {
                    innerChildren.push(id)
                }
    
                valuesMap[id].value = newValue
                this.refreshChildrenNodes(id, valuesMap, oldValue)
            })
    
            if(overcome && innerChildren.length > 0) {
                delta = overcome / innerChildren.length
                refreshChildren(delta, innerChildren)
            }
        }
    
        const newValue = valuesMap[nodeId].value
        const children = getChildren(valuesMap)
        if(newValue === MIN || newValue === MAX) {
            children.forEach(id => {        
                const childOldAnswer = valuesMap[id].value
                valuesMap[id].value = newValue
    
                this.refreshChildrenNodes(id, valuesMap, childOldAnswer)
            })
        } else {
            const delta = newValue - oldValue    
            refreshChildren(delta, children)
        }
    }

    handleChange(value, node) {
        const {tree} = this.state
        const valuesMap = this.getValuesMap(tree, node, value)
        const refreshedTree = this.refreshTree(tree, valuesMap)

        this.setState({tree:refreshedTree}, () => {
            if (this.props.input.onChange) {
                this.props.input.onChange(tree)
            }  
        })
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