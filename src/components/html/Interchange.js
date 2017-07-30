import React, { Component } from 'react';
import * as EdiHelper from '../../utils/EdiHelper';
import Segment from './Segment';

class Interchange extends Component {

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

        if (this.props.group) {
            
            let segment = EdiHelper.processSegment(this.props.group[0].GS || this.props.group[0].UNG);
            headers = segment.element.map((v,i)=>{
                if (segment.schema && segment.schema.element){
                    let details = EdiHelper.getSchemaDetails(segment.schema.element[i].name);
                    return <th key={i}>{details.description}</th>
                } else {
                    return <th></th>
                }
            });

            rows = this.props.group.map((v,i)=>{
                let gs = v.GS || v.UNG;
                let path = v.j;
                let tds = gs.e.map((v,i)=>{
                    if ( i === 5) {
                        return <td key={i}><a style={{cursor:"pointer"}} onClick={this.props.onCtrlNumberClick.bind(null,path)}>{v}</a></td> 
                    }
                    return <td key={i}>{v}</td>
                });
                return <tr key={i}>{tds}</tr>
            })
        }
        return (
            <div>
            <Segment tabIndex={0} node={this.props.segment} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} isHeader={true}>
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

export default Interchange;