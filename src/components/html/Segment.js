import React, { Component } from 'react';
import * as EdiHelper from '../../utils/EdiHelper';
import * as Utilities from '../../utils/Utilities';

class Segment extends Component {

    constructor(props) {
        super(props);
        this.onSegmentClick = this.onSegmentClick.bind(this);
    }

    onSegmentClick(segment) {
        this.props.openModal(true, { schema: true, title: 'Schema', segment: segment });
        this.props.onSegmentClick(segment.path, 0);
    }

    render() {
        let segment = EdiHelper.processSegment(this.props.node, false);

        let elements = segment.element.map((v, i) => {
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
                    if (Array.isArray(v)) {
                        let composite = v.map((val, i) => {
                            let element = details.element[i];
                            let elementDetail = EdiHelper.getSchemaDetails(element.name);
                            if (elementDetail.name.startsWith("code")) {
                                if (Utilities.isNotEmptyArrayOrString(val)) {
                                    let code = {};
                                    for (let i = 0, length = elementDetail.value.length; i < length; i++) {
                                        let el = elementDetail.value[i];
                                        if (el.value === val) {
                                            code = el;
                                            break;
                                        }
                                    }
                                    return <div key={i}><span><b>{elementDetail.description}</b></span><span>: </span><span title={code.value}>{code.description}</span></div>
                                } else {
                                    return <div key={i}><span><b>{elementDetail.description}</b></span><span>: </span><span>{val}</span></div>
                                }
                            } else {
                                return <div key={i}><span><b>{elementDetail.description}</b></span><span>: </span><span>{val}</span></div>
                            }
                        })
                        return (
                            <div key={i} style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                                <div className="panel panel-composite">
                                    <div className="panel-heading pointer"><b>{details.description}</b></div>
                                    <div className="panel-body">
                                        {composite}
                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        return <div key={i}><span><b>{details.description}</b></span><span>: </span><span>{v}</span></div>
                    }

                }
            } else {
                return null;
            }
        })

        return (
            <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                <div className="panel panel-segment">
                    <div className="panel-heading pointer" onClick={this.onSegmentClick.bind(null, segment)}><b>{segment.schema.description}</b></div>
                    <div className="panel-body">
                        {elements}
                    </div>
                </div>
            </div>
        );
    }
}

export default Segment;