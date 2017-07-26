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
                    return <div key={i}><span><b>{details.description}</b></span><span>: </span><span>{v}</span></div>
                }
            } else {
                return null;
            }
        })

        return (
            <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
                <div className="panel panel-segment">
                    <div className="panel-heading"><b>{segment.schema.description}</b><span className="glyphicon glyphicon-link pull-right pointer" onClick={this.onSegmentClick.bind(null,segment)}></span></div>
                        <div className="panel-body">
                            {elements}
                        </div>
                    </div>
            </div>
        );
    }
}

export default Segment;