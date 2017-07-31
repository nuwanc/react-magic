import React, { Component } from 'react';
import Store from '../../utils/Store';
import * as EdiHelper from '../../utils/EdiHelper';
import JSPath from 'jspath';
import Modal from '../ui/Modal'
import Segment from '../edit/Segment';
import Loading from '../ui/Loading';


class EditViewer extends Component {
    // 1 - up, 2 - down
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            isModalOpen: true,
            viewerHeight: null,
            path: null,
            move: 0,
            isKeyMove: false
        }
        this.updateDimensions = this.updateDimensions.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.keyMove = this.keyMove.bind(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        this.updateDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        this.setState(() => {
            return {
                viewerHeight: document.getElementById("docPane").clientHeight - 44
            }
        });
    }

    closeModal() {
        this.setState(() => {
            return {
                isModalOpen: false
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedNode !== this.props.selectedNode) {
            this.setState(() => {
                return {
                    isModalOpen: true,
                    path: null,
                    move: 0,
                    isKeyMove: false
                }
            });
        }
        if (nextProps.selectedSegment !== this.props.selectedSegment) {
           this.setState(() => {
                return {
                    path: null,
                    move: 0,
                    isKeyMove: false
                }
            }); 
        }
        if (this.props.fromFindOrError === true) {
            this.setState(() => {
                return {
                    path: null,
                    move: 0,
                    isKeyMove: false
                }
            }); 
        }
    }

    keyMove(keyCode, path) {
        if (keyCode === 40) {
            this.setState(() => {
                return {
                    path: path,
                    move: 2,
                    isKeyMove: true
                }
            });
        } else if (keyCode === 38) {
            this.setState(() => {
                return {
                    path: path,
                    move: 1,
                    isKeyMove: true
                }
            });
        }
    }


    render() {
        let json = '';
        let segments = null;
        let popup = null;

        let divStyle = {
            maxHeight: this.props.viewerHeight || this.state.viewerHeight
        }

        if (this.props.schemaLoading) {
            return <Loading textAlign={'center'} height={divStyle.maxHeight} text={'Initializing the Edit Viewer'} />
        } else {
            if (this.props.selectedNode && this.props.docType === 1) {
                Store.lookupErrorList(this.props.selectedServerNode);
                let foundIndex = -1;
                let currentItem = null, changeItem = null;
                if (this.props.selectedNode.split('.').length > 3 || !Store.large) {
                    json = JSPath.apply(this.props.selectedNode, Store.message);
                    segments = EdiHelper.getSegments(json, false).map((v, i, a) => {
                        if (v.path === this.state.path) {
                            foundIndex = i;
                            currentItem = a[i];
                            if (this.state.move === 1) {
                                if (i > 0) {
                                    changeItem = a[i - 1];
                                }
                            } else if (this.state.move === 2) {
                                if (i < a.length) {
                                    changeItem = a[i + 1];
                                }
                            }
                        }
                        if (this.props.selectedSegment === null && i === 0 && !this.state.isKeyMove) {
                            return <Segment key={v.path} segment={v} type={this.props.docType} selectedSegment={true} validate={this.props.validate} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} scrollIntoView={this.props.scrollIntoView} onKeyMove={this.keyMove} />
                        } else {
                            if (this.props.fromFindOrError === true && !this.state.isKeyMove) {
                                return <Segment key={v.path} segment={v} type={this.props.docType} selectedSegment={v.path === this.props.selectedSegment} validate={this.props.validate} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} scrollIntoView={this.props.scrollIntoView} onKeyMove={this.keyMove} />
                            } else {
                                if (this.state.isKeyMove) {
                                    return <Segment key={v.path} segment={v} type={this.props.docType} selectedSegment={false} validate={this.props.validate} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} scrollIntoView={this.props.scrollIntoView} onKeyMove={this.keyMove} />
                                } else {
                                    return <Segment key={v.path} segment={v} type={this.props.docType} selectedSegment={v.path === this.props.selectedSegment} validate={this.props.validate} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} scrollIntoView={this.props.scrollIntoView} onKeyMove={this.keyMove} />
                                }
                            }
                        }

                    })
                } else {
                    json = JSPath.apply(this.props.selectedNode, Store.message);
                    segments = EdiHelper.getSegments(json, true).map((v, i, a) => {
                        if (v.path === this.state.path) {
                            foundIndex = i;
                            currentItem = a[i];
                            if (this.state.move === 1) {
                                if (i > 0) {
                                    changeItem = a[i - 1];
                                }
                            } else if (this.state.move === 2) {
                                if (i < a.length) {
                                    changeItem = a[i + 1];
                                }
                            }
                        }
                        if (this.props.selectedSegment === null && i === 0 && !this.state.isKeyMove) {
                            return <Segment key={v.path} segment={v} type={this.props.docType} selectedSegment={true} validate={this.props.validate} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} scrollIntoView={this.props.scrollIntoView} onKeyMove={this.keyMove} />
                        } else {
                            if (this.props.fromFindOrError === true && !this.state.isKeyMove) {
                                return <Segment key={v.path} segment={v} type={this.props.docType} selectedSegment={v.path === this.props.selectedSegment} validate={this.props.validate} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} scrollIntoView={this.props.scrollIntoView} onKeyMove={this.keyMove}/>
                            } else {
                                if (this.state.isKeyMove) {
                                    return <Segment key={v.path} segment={v} type={this.props.docType} selectedSegment={false} validate={this.props.validate} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} scrollIntoView={this.props.scrollIntoView} onKeyMove={this.keyMove} />
                                } else {
                                    return <Segment key={v.path} segment={v} type={this.props.docType} selectedSegment={v.path === this.props.selectedSegment} validate={this.props.validate} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} scrollIntoView={this.props.scrollIntoView} onKeyMove={this.keyMove} />
                                }
                            }
                        }
                    })
                    popup = <Modal isOpen={this.state.isModalOpen} onClose={() => this.closeModal()} params={{ msg: "Too many transaction to display. Please select individual transaction." }}></Modal>
                }
                if (foundIndex > -1) {
                    if (this.state.move === 1) {
                        //up.
                        segments[foundIndex] = <Segment key={currentItem.path} segment={currentItem} type={this.props.docType} selectedSegment={false} validate={this.props.validate} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} scrollIntoView={this.props.scrollIntoView} onKeyMove={this.keyMove} resetTabIndex={true} />
                        if (changeItem != null) {
                            segments[foundIndex - 1] = <Segment key={changeItem.path} segment={changeItem} type={this.props.docType} selectedSegment={true} validate={this.props.validate} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} scrollIntoView={this.props.scrollIntoView} onKeyMove={this.keyMove} />
                        }
                    } else if (this.state.move === 2) {
                        //down
                        segments[foundIndex] = <Segment key={currentItem.path} segment={currentItem} type={this.props.docType} selectedSegment={false} validate={this.props.validate} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} scrollIntoView={this.props.scrollIntoView} onKeyMove={this.keyMove} resetTabIndex={true} />
                        if (changeItem != null) {
                            segments[foundIndex + 1] = <Segment key={changeItem.path} segment={changeItem} type={this.props.docType} selectedSegment={true} validate={this.props.validate} openModal={this.props.openModal} onSegmentClick={this.props.onSegmentClick} scrollIntoView={this.props.scrollIntoView} onKeyMove={this.keyMove} />
                        }
                    }
                }
            }
        }

        return (
            <div className="doc" style={divStyle}>
                {segments}
                {popup}
            </div>
        )
    }
}


export default EditViewer;