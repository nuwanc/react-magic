import React, { Component } from 'react';
import * as Api from '../../utils/HttpService';
import Store from '../../utils/Store';
import Loading from '../ui/Loading';

class ErrorViewer extends Component {
    static DISPLAY_LIST_SIZE = 1000;

    constructor(props) {
        super(props);
        this.state = {
            ulHeight : null,
            selected : null,
            loading : false
        }
        this.onErrorViewerClick = this.onErrorViewerClick.bind(this);
        this.handleValidateClick = this.handleValidateClick.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        this.updateDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        let parentHeight = document.getElementById("rightPane").firstChild.clientHeight;
        if (this.props.viewerHeight) {
            let ulHeight = parentHeight - this.props.viewerHeight;
            this.setState(()=>{
                return {
                    ulHeight : ulHeight - 130
                }
            })
        } else {
            let viewerHeight = document.getElementById("docPane").clientHeight - 44
            let ulHeight = parentHeight - viewerHeight;
            this.setState(()=>{
                return {
                    ulHeight : ulHeight - 130
                }
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.viewerHeight !== nextProps.viewerHeight) {
            let parentHeight = document.getElementById("rightPane").firstChild.clientHeight;
            let ulHeight = parentHeight - nextProps.viewerHeight;
            this.setState(()=>{
                return {
                    ulHeight : ulHeight - 130
                }
            })
        }
    }


    handleValidateClick() {
        this.setState(()=>{
            return {
                loading : true,
                selected : null
            }
        });

        Api.fetchErrorData(this.props.messageId).then((errors) => {
            Store.errors = errors;
            this.props.onValidateClick(true);
            this.setState(()=>{
                return {
                    loading : false
                }
            })
        })
    }

    onErrorViewerClick(path) {
        let paths = path.split("/");
        if (isNaN(paths[paths.length - 1])) {
            this.props.onViewerClick(path, 1);
        } else {
            this.props.onViewerClick(path.substring(0,path.lastIndexOf('/')), 1);
        }
        
        this.setState(()=>{
            return {
                selected : path
            }
        });
    }

    render() {
        let ulStyle = {
            height: this.state.ulHeight || 90
        }
        
        let content = null;
        let message = null

        if (this.state.loading) {
            content = <Loading textAlign={'center'} height={ulStyle.height} text={'Validating the message'}/>
        } else {
            if (Store.errors !== null) {
                content = Store.getErrorList(1000,this.props.selectedServerNode).map((v,i)=>{
                    return <ErrorResult key={v.location + i} node={v} onClickResult={this.onErrorViewerClick} selected={this.state.selected === v.location}/>
                })
                if (Store.totalErrors > ErrorViewer.DISPLAY_LIST_SIZE) {
                    message = `Showing first ${ErrorViewer.DISPLAY_LIST_SIZE} of ${Store.totalErrors} Validation Errors.`;
                } else {
                    message = `${Store.totalErrors} Validation Errors.`;
                }
                if (Store.totalErrors === 0) {
                    message = `No Validation Errors.`;
                }
            }
        }

        return (
            <div>
                <span style={{marginLeft:'10px'}}><button onClick={this.handleValidateClick}>Validate</button><span style={{marginLeft:'10px'}}>{message}</span></span>
                <ol className="results" style={ulStyle}>
                    {content}
                </ol>
            </div>
        );
    }
}

class ErrorResult extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(path) {
        this.props.onClickResult(path);
    }

    render () {
        return <li><span className={ this.props.selected ? "highlight" : "" }><a className="pointer" onClick={this.handleClick.bind(null,this.props.node.location)}>{this.props.node.location}</a> -> {this.props.node.message}</span></li>
    }
}

export default ErrorViewer;