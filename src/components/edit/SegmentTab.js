import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import * as EdiHelper from '../../utils/EdiHelper';

class SegmentTab extends Component {

    renderOption(option) {
        return option.value + "=" + option.description;
    }

    render() {
        let node = this.props.segment.schema;
        let index = this.props.index;
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
                                <div><b>Standard</b>: Element ID {details.name.split(":")[1]} {details.dataType} {details.minLength}/{details.maxLength}</div>
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
            /*let dataSection = [];
            if (isComposite) {
                dataSection.push(<div><b>Description</b>: {details.description} ({v.requirementType})</div>);
                dataSection.push(select);
            } else {
               dataSection.push(<div><div><b>Value</b>: {select}</div><div><b>Standard</b>: Element ID {details.name.split(":")[1]} {details.dataType} {details.minLength}/{details.maxLength}</div></div>);
               dataSection.push(<div><b>Description</b>: {details.description} ({v.requirementType})</div>);
            }*/
            if (isComposite) {
               tabPanels.push(
                <TabPanel key={this.props.segment.name + (i + 1)} className="tab-panel">
                    <div><b>Description</b>: {details.description} ({v.requirementType})</div>
                    {select}
                </TabPanel>); 
            } else {
                tabPanels.push(
                <TabPanel key={this.props.segment.name + (i + 1)} className="tab-panel">
                    <div><div><b>Value</b>: {select}</div><div><b>Standard</b>: Element ID {details.name.split(":")[1]} {details.dataType} {details.minLength}/{details.maxLength}</div></div>
                    <div><b>Description</b>: {details.description} ({v.requirementType})</div>
                </TabPanel>);
            }
        })
        return <Tabs defaultIndex={index}><TabList>{tabs}</TabList>{tabPanels}</Tabs>
    }
}

export default SegmentTab;