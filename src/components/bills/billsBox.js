// author:wangli time:2018-06-05 content:账单模块
import React, { Component, Fragment } from "react";
import BillsItem from "./billsItem";
import Airport from "./airport";
import Hangsi from "./hangsi";
export default class BillsBox extends Component {
    constructor(props) {
        super(props);
    }
    //返回是否显示子组件内容
    showDetailEvent(data, id) {
        this.props.showDetailEvent(data, id);
    }

    //返回是否显示合同内容
    showWorkEvent(data, id) {
        this.props.showWorkEvent(data, id);
    }

    render() {
        let detailsId = this.props.detailsId;
        //根据角色渲染不同的详情组件
        let detailType = "";
        if (this.props.showDetailType) {
            if (this.props.role == 0) {
                detailType = <Hangsi detailsId={detailsId} data={this.props.data} showDetailType={this.props.showDetailType} />
            } else {
                detailType = <Airport detailsId={detailsId} showDetailType={this.props.showDetailType} />
            };
        };
        return (
            <div style={{ marginBottom: 10 }}>
                <BillsItem showDetailType={this.props.showDetailType} tableType={this.props.tableType} detailsId={detailsId} data={this.props.data} showWorkEvent={(data, id) => this.showWorkEvent(data, id)} showDetailEvent={(data, id) => this.showDetailEvent(data, id)} />
                {detailType}
            </div>
        )
    }
}