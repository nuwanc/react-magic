import React, { Component } from 'react';
import Segment from "./Segment";
import SegmentList from './SegmentList';
import * as EdiHelper from '../../utils/EdiHelper';
import * as Utilities from '../../utils/Utilities';
import Store from '../../utils/Store';

class Loop extends Component {
    constructor(props) {
        super(props);
        this.onSegmentClick = this.onSegmentClick.bind(this);
    }

    onSegmentClick(segment) {
        //this.props.openModal(true, { schema: true, title: 'Schema', segment: segment });
        this.props.openModal(true, { segment : segment , index : 0, cIndex : 0 });
        this.props.onSegmentClick(segment.path, 0);
    }

    render() {
        let firstSegment;
        let segment;

        let elements = this.props.node.c.map((v, i) => {
            if (i === 0) {
                //first  segment details.
                segment = EdiHelper.processSegment(v, false);
                firstSegment = segment.element.map((v, i) => {
                if (Utilities.isNotEmptyArrayOrString(segment.schema) && Utilities.isNotEmptyArrayOrString(segment.schema.element) && Utilities.isNotEmptyArrayOrString(v)) {
                        let details = EdiHelper.getSchemaDetails(segment.schema.element[i].name);
                        if (details.name.startsWith("code")) {
                            if (Utilities.isNotEmptyArrayOrString(details.value)) {
                                let code = {};
                                for (let i = 0, length = details.value.length; i < length; i++) {
                                    let el = details.value[i];
                                    if (el.value === v) {
                                        code = el;
                                        break;
                                    }
                                }
                                return <div key={i}><span><b>{details.description}</b></span><span>: </span><span title={code.value}>{code.description}</span></div>
                            } else {
                                return <div key={i}><span><b>{details.description}</b></span><span>: </span><span>{v}</span></div>
                            }
                        } else {
                            return <div key={i}><span><b>{details.description}</b></span><span>: </span><span>{v}</span></div>
                        }
                    } else {
                        return null;
                    }
                })
                return firstSegment;
            } else {
                if (v.t === "segment") {
                    return <Segment node={v} key={i} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} />
                } else if (v.t === "loop") {
                    return <Loop node={v} key={i} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} />
                } else if (v.t === "list") {
                    return <SegmentList node={v} key={i} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} />
                } else if (v.t === "loop-list") {
                    let loops = v.c.map((v, i) => {
                        return <Loop node={v} key={i} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} />
                    })
                    return loops;
                } else {
                    return <Segment node={v} key={i} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} />
                }
            }

        })

        let error = Store.lookupErrorSegment(segment.path);

        return (
            <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                <div className="panel panel-loop">
                    <div className="panel-heading pointer" onClick={this.onSegmentClick.bind(null,segment)}>{error !== null ? <span className="glyphicon glyphicon-remove text-danger" title={error.text}></span> : null}<b>{segment.name} - {segment.schema.description}</b></div>
                    <div className="panel-body">
                        {elements}
                    </div>
                </div>
            </div>
        );
    }
}

export default Loop;