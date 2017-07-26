import React, { Component } from 'react';
import Segment from './Segment';
import * as EdiHelper from '../../utils/EdiHelper';

class SegmentList extends Component {
    constructor(props) {
        super(props);
        this.onSegmentClick = this.onSegmentClick.bind(this);
    }

    onSegmentClick(segment) {
        this.props.openModal(true, { schema: true, title: 'Schema', segment: segment });
        this.props.onSegmentClick(segment.path, 0);
    }

    render() {
        let node = this.props.node;

        let segments = node.c.map((v, i) => {
            return <Segment node={v} key={i} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} />
        })
        
        return <div>{segments}</div>
    }
}

export default SegmentList;