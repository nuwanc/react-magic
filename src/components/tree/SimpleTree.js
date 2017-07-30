import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Store from '../../utils/Store';

class SimpleTree extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: true
        };
        this.toggle = this.toggle.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.selected !== nextProps.selected) || (nextProps.validate !== this.props.validate)
    }

    componentDidUpdate() {
        if (this.props.selected === this.props.node.path && this.props.scrollIntoView === true) {
            ReactDOM.findDOMNode(this).scrollIntoView(true);
        }
    }

    toggle() {
        this.setState({ visible: !this.state.visible });
    }

    handleKeyPress(event){
        if (event.key === 'Enter') {
            this.props.onTreeNodeSelect(this.props.node.path,this.props.node.spath);
        }
    }

    render() {
        let childNodes;
        let classObj;
        let selectedObj;

        if (this.props.node.childNodes != null) {
            childNodes = this.props.node.childNodes.map((node, index) => {
                return <li key={index}><SimpleTree node={node} selected={this.props.selected} onTreeNodeSelect={this.props.onTreeNodeSelect} validate={this.props.validate} scrollIntoView={this.props.scrollIntoView}/></li>
            });

            classObj = {
                "minus": this.state.visible,
                "plus": !this.state.visible
            };

        }

        let style;
        if (!this.state.visible) {
            style = { display: "none" };
        }

        selectedObj = {
            "node": true,
            "selected": this.props.selected === this.props.node.path
            
        }
        
        let error;
        if (this.props.validate === false) {
            error = '';
        } else {
            error = Store.lookupErrorPath(this.props.node.spath) ? 'glyphicon glyphicon-remove glyphicon-stack-1x text-danger' : 'glyphicon glyphicon-ok glyphicon-stack-1x text-success';
        }
        
        let root;
        let icon;
        if (this.props.node.title) {
            root = <span onClick={this.toggle} className={classNames(classObj)}></span>;
            icon = <span className="glyphicon-stack"><i className={this.props.node.icon}></i><i className={error}></i></span>;
        } else {
            root = '';
            icon = '';
        }

        return (
            <div>
                {root}
                {icon}
                <span  className={classNames(selectedObj)} onKeyPress={this.handleKeyPress} onClick={this.props.onTreeNodeSelect.bind(null,this.props.node.path,this.props.node.spath)} dangerouslySetInnerHTML={{__html:this.props.node.title}}></span>
                <ul className='SimpleTree' style={style}>
                    {childNodes}
                </ul>
            </div>
        );
    }

}

SimpleTree.propTypes = {
    node: PropTypes.object.isRequired,
    onTreeNodeSelect : PropTypes.func.isRequired
}

export default SimpleTree;