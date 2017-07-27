import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import * as EdiHelper from '../../utils/EdiHelper';
import Store from '../../utils/Store';
import * as Utilities from '../../utils/Utilities';
import LazyLoadTree from '../tree/LazyLoadTree';

class SegmentTab extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedElement : 0
        };
        this.onElementClick = this.onElementClick.bind(this);
        this.selectTab = this.selectTab.bind(this);
    }

    renderOption(option) {
        return option.value + "=" + option.description;
    }

    onElementClick(i) {
        this.setState(()=>{
            return {
                selectedElement : i
            }
        });
    }

    selectTab(tabIndex) {
        this.setState(()=>{
            return {
                selectedElement : tabIndex
            }
        });
    }

    componentDidMount() {
        this.setState(()=>{
            return {
                selectedElement : this.props.index
            }
        });
    }
    

    render() {
        let node = this.props.segment.schema;
        let cIndex = this.props.cIndex;
        if (isNaN(cIndex)){
            cIndex = 0;
        }
        let tabs = [];
        let tabPanels = [];
        let innerTabs = [];
        let innerTabPanels = [];

        node.element.forEach((v, i) => {
            let details = EdiHelper.getSchemaDetails(v.name);
            let select;
            let isComposite = false;
            if (details.name.startsWith("code")) {
                let options = [];
                options = details.value.map((v, i) => {
                    return <option key={i + 1} value={v.value}>{v.value} = {v.description}</option>
                })
                options.unshift(<option value="" key={0}>[empty]</option>);
                select = <select defaultValue={this.props.segment.element[i]} style={{ width: '400px' }}>{options}</select>
            } else {

                if (details.name.startsWith("composite")) {
                    isComposite = true;
                    let compositeValue = this.props.segment.element[i] || [];
                    details.element.forEach((v, i1) => {
                        let details = EdiHelper.getSchemaDetails(v.name);
                        let innerSelect;
                        if (details.name.startsWith("code")) {
                            let options = [];
                            options = details.value.map((v, i) => {
                                return <option key={i + 1} value={v.value}>{v.value} = {v.description}</option>
                            })
                            options.unshift(<option value="" key={0}>[empty]</option>);
                            innerSelect = <select defaultValue={compositeValue[i1]} style={{ width: '400px' }}>{options}</select>
                        } else {
                            if (compositeValue[i1]) {
                                innerSelect = <span>{compositeValue[i1]}</span>
                            } else {
                                innerSelect = <span>[empty]</span>
                            }
                        }
                        innerTabs.push(<Tab key={this.props.segment.name + (i + 1) + (i1 + 1)}><b>{this.props.segment.name + (i + 1) + (i1 + 1)}</b></Tab>)
                        innerTabPanels.push(
                            <TabPanel key={this.props.segment.name + (i + 1) + (i1 + 1)} className="tab-panel">
                                <div><b>Value</b>: {innerSelect}</div>
                                <div><b>Specification</b>: Element ID {details.name.split(":")[1]} {details.dataType} {details.minLength}/{details.maxLength}</div>
                                <div><b>Description</b>: {details.description} ({v.requirementType})</div>
                            </TabPanel>
                        )
                        select = <Tabs defaultIndex={cIndex}><TabList>{innerTabs}</TabList>{innerTabPanels}</Tabs>
                    })
                } else {
                    if (this.props.segment.element[i]) {
                        select = <span>{this.props.segment.element[i]}</span>
                    } else {
                        select = <span>[empty]</span>
                    }
                }
                
            }
            tabs.push(<Tab key={this.props.segment.name + (i + 1)}><b>{this.props.segment.name + (i + 1)}</b></Tab>);
           
            if (isComposite) {
               tabPanels.push(
                <TabPanel key={this.props.segment.name + (i + 1)} className="tab-panel">
                    <div><b>Description</b>: {details.description} ({v.requirementType})</div>
                    <br></br>
                    {select}
                </TabPanel>); 
            } else {
                tabPanels.push(
                <TabPanel key={this.props.segment.name + (i + 1)} className="tab-panel">
                    <div><div><b>Value</b>: {select}</div><div><b>Specification</b>: Element ID {details.name.split(":")[1]} {details.dataType} {details.minLength}/{details.maxLength}</div></div>
                    <div><b>Description</b>: {details.description} ({v.requirementType})</div>
                </TabPanel>);
            }
        })

        let elements = this.props.segment.element.map((v, i) => {
            if (!Array.isArray(v)) {
                let delimiter = Store.delimiters[1];
                if (Utilities.isNotEmptyString(v) ) {
                    return <span key={i}><span>{delimiter}</span><span onClick={this.onElementClick.bind(null,i)} className={ this.state.selectedElement === i ? "highlight pointer" : "pointer"}>{v}</span></span>
                } else {
                    return <span key={i}><span>{delimiter}</span><span onClick={this.onElementClick.bind(null,i)} className={ this.state.selectedElement === i ? "highlight pointer" : "pointer"}><span className="glyphicon glyphicon-eye-open"></span></span></span>
                }
                
            } else {
                let composite = [];
                v.forEach((c,ci)=>{
                    let key = i+"_"+ci;
                    if ( ci === 0) {
                        let delimiter = Store.delimiters[1];
                        composite.push(<span key={key}><span>{delimiter}</span><span onClick={this.onElementClick.bind(null,i)} className={ this.state.selectedElement === i ? "highlight pointer" : "pointer"}>{c}</span></span>)
                    } else {
                        let delimiter = Store.delimiters[2];
                        composite.push(<span className="pointer" key={key}><span>{delimiter}</span>{c}</span>)
                    }
                })
                return composite;
            }
        });

        return (
            <div>
                <p><b>Location</b>: {this.props.segment.path}</p>
                <p><b>Content</b>: {this.props.segment.name}{elements}</p>
                <div><LazyLoadTree node={node} root={false} toggleOnLoad={true} selectedElement={this.state.selectedElement}/></div>
                <br></br>
                <div><Tabs selectedIndex={this.state.selectedElement} onSelect={this.selectTab}><TabList>{tabs}</TabList>{tabPanels}</Tabs></div>
            </div>
        )
    }
}

export default SegmentTab;