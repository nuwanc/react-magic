import React, { Component } from 'react';
import Segment from "./Segment";
import SegmentList from './SegmentList';

class Loop extends Component {
    render() {

        let elements = this.props.node.c.map((v,i)=>{
            if (v.t === "segment") {
                return <Segment node={v} key={i} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick}/>
            } else if (v.t === "loop") {
                return <Loop node={v} key={i} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick}/>
            } else if (v.t === "list"){
                return <SegmentList node={v} key={i} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick}/>
            } else if (v.t === "loop-list") {
                let loops = v.c.map((v,i)=>{
                        return <Loop node={v} key={i} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick}/>
                })
                return loops;
            } else {
                return <Segment node={v} key={i} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick}/>
            }
        })
        
        return (
            <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
                <div className="panel panel-loop">
                    <div className="panel-heading"><b></b></div>
                        <div className="panel-body">
                            {elements}
                        </div>
                    </div>
            </div>
        );
    }
}

export default Loop;