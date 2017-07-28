import React, { Component } from 'react';
import * as EdiHelper from '../../utils/EdiHelper';
import * as Utilities from '../../utils/Utilities';
import Segment from './Segment';

class Group extends Component {

    constructor(props) {
        super(props);
        this.onSegmentClick = this.onSegmentClick.bind(this);
    }

    onSegmentClick(segment) {
        this.props.openModal(true, { schema: true, title: 'Schema', segment: segment });
        this.props.onSegmentClick(segment.path,0);
    }

    render() {
        let headers;
        let rows;

        if (this.props.transaction) {
            
            let segment = EdiHelper.processSegment(this.props.transaction[0].ST || this.props.transaction[0].UNH);
            headers = segment.element.map((v,i)=>{
                if (Utilities.isNotEmptyArrayOrString(segment.schema) && Utilities.isNotEmptyArrayOrString(segment.schema.element)){
                    let details = EdiHelper.getSchemaDetails(segment.schema.element[i].name);
                    return <th key={i}>{details.description}</th>
                } else {
                    return <th></th>
                }
            })

            rows = this.props.transaction.map((v,i)=>{
                let st = v.ST || v.UNH;
                let path = v.j;
                let tds = st.e.map((v,i)=>{
                    if (i === 1) {
                         return <td key={i}><a style={{cursor:"pointer"}} onClick={this.props.onCtrlNumberClick.bind(null,path)}>{v}</a></td>
                    }
                    return <td key={i}>{v}</td>
                });
                return <tr key={i}>{tds}</tr>
            })
        }
        return (
            <div>
            <Segment node={this.props.segment} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} isHeader={true}>
            <table className="table">
                <thead>
                    <tr>{headers}</tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
            </Segment>
            </div>
        )
    }
}

export default Group;