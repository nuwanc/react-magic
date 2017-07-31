import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Store from '../../utils/Store';
import * as EdiHelper from '../../utils/EdiHelper';
import * as Utilities from '../../utils/Utilities';

class Segment extends Component {

    constructor(props) {
        super(props);
        this.onSegmentClick = this.onSegmentClick.bind(this);
        this.onElementClick = this.onElementClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    /*shouldComponentUpdate(nextProps, nextState) {
        return this.props.selectedSegment !== nextProps.selectedSegment
    }*/

    componentDidUpdate() {
        if (this.props.selectedSegment && this.props.scrollIntoView === true) {
            ReactDOM.findDOMNode(this).tabIndex = 0;
            ReactDOM.findDOMNode(this).focus();
            ReactDOM.findDOMNode(this).scrollIntoView(true);
        } else if (this.props.selectedSegment) {
            ReactDOM.findDOMNode(this).tabIndex = 0;
            ReactDOM.findDOMNode(this).focus();
            //ReactDOM.findDOMNode(this).scrollIntoView(false);
        } else {
            ReactDOM.findDOMNode(this).tabIndex = -1;
        }
        if (this.props.resetTabIndex) {
             ReactDOM.findDOMNode(this).tabIndex = -1;
        }
        
    }

    componentDidMount() {
        if (this.props.selectedSegment && this.props.scrollIntoView === true) {
            ReactDOM.findDOMNode(this).tabIndex = 0;
            ReactDOM.findDOMNode(this).focus();
            ReactDOM.findDOMNode(this).scrollIntoView(true);
        } else if (this.props.selectedSegment) {
            ReactDOM.findDOMNode(this).tabIndex = 0;
            ReactDOM.findDOMNode(this).focus();
            //ReactDOM.findDOMNode(this).scrollIntoView(false);
        } else {
            ReactDOM.findDOMNode(this).tabIndex = -1;
        }
        if (this.props.resetTabIndex) {
             ReactDOM.findDOMNode(this).tabIndex = -1;
        }
    }

    onSegmentClick(segment) {
        //this.props.openModal(true, { schema: true, title: 'Schema', segment: segment });
        this.props.onSegmentClick(segment.path,1);
        ReactDOM.findDOMNode(this).tabIndex = 0;
    }

    onElementClick(segment,index,compositeIndex) {
        this.props.openModal(true, { segment : segment , index : index, cIndex : compositeIndex });
        this.props.onSegmentClick(segment.path,1);
        ReactDOM.findDOMNode(this).tabIndex = 0;
    }

    handleKeyPress(event,segment) {
        if (event.key === 'Enter') {
            this.props.openModal(true, { segment : segment , index : 0, cIndex : 0 });
            this.props.onSegmentClick(segment.path,1);
        } else if (event.keyCode === 40) {
            this.props.onKeyMove(event.keyCode,this.props.segment.path);
        } else if (event.keyCode === 38) {
            this.props.onKeyMove(event.keyCode,this.props.segment.path);
        }
    }

    render() {
        if (this.props.type === 1) {
            let name,icon;
            let schema = this.props.segment.schema
            let error = Store.lookupErrorSegment(this.props.segment.path);
            if (error !== null) {
                icon = <span><span className="glyphicon glyphicon-remove text-danger" title={error.text}></span><span className="glyphicon glyphicon-edit pointer" style={{marginRight:'10px'}} onClick={this.onElementClick.bind(null, this.props.segment,0,-1)}></span></span>
                name = <span title={schema && schema.description}>{this.props.segment.name}</span>
            } else {
                icon = <span className="glyphicon glyphicon-edit pointer" style={{marginLeft:'15px', marginRight:'10px'}} onClick={this.onElementClick.bind(null, this.props.segment,0,-1)}></span>
                name = <span title={schema && schema.description}>{this.props.segment.name}</span>
            }
            const elements = this.props.segment && this.props.segment.element.map((v, i) => {

                let title = '';
                let codeDesc = '';

                if (!Array.isArray(v)) {
                    if (Utilities.isNotEmptyArrayOrString(schema) && Utilities.isNotEmptyArrayOrString(schema.element) && Utilities.isNotEmptyArrayOrString(schema.element)) {
                        
                        let details = EdiHelper.getSchemaDetails(schema.element[i].name);
                        if (details.name.startsWith("code") || details.name.startsWith("mpcode")) {
                            if (Utilities.isNotEmptyArrayOrString(details.value)) {
                                //not working in ie
                                /*for (let el of details.value) {
                                    if (el.value === v) {
                                        codeDesc = v + "=" + el.description;
                                        break;
                                    }
                                }*/
                                for (let i = 0, length = details.value; i < length; i++) {
                                    let el = details.value[i];
                                    if (el.value === v) {
                                        codeDesc = v + "=" + el.description;
                                        break;
                                    }
                                }
                            } else if (Utilities.isNotEmptyArrayOrString(details.parts)) {
                                let len = details.parts.length;
                                for (let i = 0; i < len; i++) {
                                    let codes = details.parts[i];
                                    //not working in ie
                                    /*for (let el of codes) {
                                        if (el.value === v) {
                                            codeDesc = v + "=" + el.description;
                                            break;
                                        }
                                    }*/
                                    for (let i = 0, length = codes.length; i < length; i++) {
                                        let el = codes[i];
                                        if (el.value === v) {
                                            codeDesc = v + "=" + el.description;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        title = details && details.description;
                        title = title + '\n' + codeDesc
                    }
                    let delimiter = Store.delimiters[1];
                    return <span key={i}><span>{delimiter}</span><span title={title}>{v}</span></span>
                } else {
                    //composite
                    let composite = [];
                    let details = null;
                    if (Utilities.isNotEmptyArrayOrString(schema) && Utilities.isNotEmptyArrayOrString(schema.element) && Utilities.isNotEmptyArrayOrString(schema.element)) {
                        details = EdiHelper.getSchemaDetails(schema.element[i].name);
                    }

                    v.forEach((c, ci) => {
                        let key = i + "_" + ci;
                        let element;

                        if (Utilities.isNotEmptyArrayOrString(details) && Utilities.isNotEmptyArrayOrString(details.element)) {
                            element = details.element[ci];
                            let  cDetails = EdiHelper.getSchemaDetails(element.name);

                            if (cDetails.name.startsWith("code") || cDetails.name.startsWith("mpcode")) {
                                if (Utilities.isNotEmptyArrayOrString(cDetails.value)) {
                                    //not working in ie
                                    /*for (let el of cDetails.value) {
                                        if (el.value === c) {
                                            codeDesc = c + "=" + el.description;
                                            break;
                                        }
                                    }*/
                                    for (let i = 0, length = cDetails.value.length; i < length; i++){
                                        let el = cDetails.value[i];
                                        if (el.value === c) {
                                            codeDesc = c + "=" + el.description;
                                            break;
                                        }
                                    }
                                } else if (Utilities.isNotEmptyArrayOrString(cDetails.parts)) {
                                    let len = cDetails.parts.length;
                                    for (let i = 0; i < len; i++) {
                                        let codes = cDetails.parts[i];
                                        //not working in ie
                                        /*for (let el of codes) {
                                            if (el.value === c) {
                                                codeDesc = c + "=" + el.description;
                                                break;
                                            }
                                        }*/
                                        for (let i = 0, length = codes.length; i < length; i++){
                                            let el = codes[i];
                                            if (el.value === c) {
                                                codeDesc = c + "=" + el.description;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            title = cDetails && cDetails.description;
                            title = title + '\n' + codeDesc
                        }

                        if (ci === 0) {
                            let delimiter = Store.delimiters[1];
                            composite.push(<span key={key}><span>{delimiter}</span><span title={title} >{c}</span></span>);
                        } else {
                            let delimiter = Store.delimiters[2];
                            composite.push(<span key={key}><span>{delimiter}</span><span title={title} >{c}</span></span>);
                        }
                    })

                    return composite;
                }


            })
            if (this.props.selectedSegment) {
                return <div className="edit-segment" onKeyPress={(e)=>{this.handleKeyPress(e,this.props.segment)}} onKeyDown={(e)=>{this.handleKeyPress(e,this.props.segment)}}>{icon}<span className="highlight" onClick={this.onSegmentClick.bind(null,this.props.segment)}>{name}{elements}</span></div>
            } else {
                return <div className="edit-segment" onKeyPress={(e)=>{this.handleKeyPress(e,this.props.segment)}} onKeyDown={(e)=>{this.handleKeyPress(e,this.props.segment)}}>{icon}<span onClick={this.onSegmentClick.bind(null,this.props.segment)}>{name}{elements}</span></div>
            }

        } else {
            return <div></div>;
        }
    }
}

export default Segment;