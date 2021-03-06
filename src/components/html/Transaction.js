import React, { Component } from 'react';
import Segment from './Segment';
import Loop from './Loop'
import SegmentList from './SegmentList';

class Transaction extends Component {

    render() {
        let content = this.props.transaction.c.map((v,i)=>{
            switch (v.t) {
                case "segment":
                    return <Segment tabIndex={i} node={v} key={i} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick}/>
                case "loop":
                    return <Loop node={v} key={i} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick}/>
                case "list":
                    return <SegmentList node={v} key={i} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick}/>
                case "loop-list":
                    let loops = v.c.map((v,i)=>{
                        return <Loop node={v} key={i} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick}/>
                    })
                    return loops;
                default:
                    return <Segment node={v} key={i} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick}/>
            }
        })
        return <div className="panel-group">{content}</div>
    }
}

export default Transaction;