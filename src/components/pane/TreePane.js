import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SimpleTree from '../tree/SimpleTree';
import Loading from '../ui/Loading';
import Store from '../../utils/Store';

class TreePane extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            tree: null
        };
        this.onTreeNodeSelect = this.onTreeNodeSelect.bind(this);

    }

    componentWillMount() {
        if (Store.message) {
            let tree = {};
            tree.childNodes = [];
            let count = 0;
            
            Store.processDelimiters();

            Store.message["interchange"].forEach((v,i)=>{
                let isa = {};
                if (v.ISA) {
                    let element = v.ISA.e;
                    isa.title = element[4]+'/'+element[5]+'<span class="glyphicon glyphicon-arrow-right"></span>'+element[6]+'/'+element[7];//+', Ctrl = '+element[12];
                } else {
                    isa.title = v.n;
                }
                isa.path = v.j;
                isa.spath = v.p;
                isa.icon = "glyphicon glyphicon-envelope glyphicon-stack-1x";
                isa.childNodes = [];

                v["group"].forEach((v1,i1)=>{
                    let gs = {};
                    if (v1.GS) {
                        let element = v1.GS.e;
                        gs.title = element[1] +'<span class="glyphicon glyphicon-arrow-right"></span>' + element[2];// + ', Ctrl='+ element[5]
                    } else {
                        gs.title = v1.n; 
                    }
                    gs.path = v1.j;
                    gs.spath = v1.p;
                    gs.icon = "glyphicon glyphicon-folder-open glyphicon-stack-1x";
                    gs.childNodes = [];

                    v1["transaction"].forEach((v2,i2)=>{
                        let st = {};
                        if (v2.ST) {
                            let element = v2.ST.e;
                            st.title = element[0]+"-"+element[1];
                        } else {
                            st.title = v2.n;
                        }
                        st.path = v2.j;
                        st.spath = v2.p;
                        st.icon = "glyphicon glyphicon-file glyphicon-stack-1x";
                        gs.childNodes.push(st);
                        count ++;
                    })
                    isa.childNodes.push(gs);
                })
                tree.childNodes.push(isa);
            })
            this.setState(() => {
                return {
                    tree: tree
                }
            },()=>{
                Store.large = (count > 50);
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.selected !== nextProps.selectNode) {
            this.setState(()=>{
                return {
                    selected : nextProps.selectNode
                }
            });
        } 
    }

    componentDidMount() {
        let content = document.getElementById('content');
        let outerDiv = document.getElementById('outer');
        if (content && outerDiv) {
            outerDiv.innerHTML = content.innerHTML;
            content.parentNode.removeChild(content);
        }
    }

    onTreeNodeSelect(node,snode) {
        this.setState(() => {
            return {
                selected: node
            };
        });
        this.props.onTreeNodeClick(node,snode);
    }

    render() {
        let maxHeight = '90vh';
        if (!this.props.showOuter) {
            maxHeight = '100vh';
        }
        let divStyle = {
            maxHeight: this.props.treeHeight || maxHeight
        }

        return (
            <div className="tree" style={divStyle}>
                {!this.state.tree ? <Loading /> : <SimpleTree node={this.state.tree} selected={this.state.selected} onTreeNodeSelect={this.onTreeNodeSelect} validate={this.props.validate} scrollIntoView={this.props.scrollIntoView}/>}
            </div>
        )
    }
}

TreePane.propTypes = {
    onTreeNodeClick : PropTypes.func.isRequired
}

export default TreePane;