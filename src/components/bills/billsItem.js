// author:wangli time:2018-06-05 content:个人中心-账单-单条数据
import React, { Component,Fragment } from "react";
import style from "../../static/css/bills/billsComponent/billsItems.scss";
import { Icon } from "antd";

export default class BillsItem extends Component {
    constructor(props) {
        super(props);
        this.detail = this.detail.bind(this);
    }

    //点击显示账单详情事件
    changeDirection() {
        if(this.props.data.billState=="2"){

        }else {
			//双击同一个账单关闭下拉框
			let showDetailType = this.props.showDetailType;
			showDetailType = !showDetailType;
			//向父组件返回是否显示合同和合同id
			this.props.showDetailEvent(showDetailType, this.props.detailsId);
        }
    }

    //点击显示需求详情事件
    detail(e) {
        //阻止冒泡
        e.stopPropagation();
        let tableType = this.props.tableType;
        tableType = !tableType;
        this.props.showWorkEvent(tableType, this.props.detailsId);
    }

    render() {
        //查看详情方向样式判断
        let showIcon = <Icon type="up" style={{ marginLeft: 7 }} />;
        if (this.props.showDetailType) {
            showIcon = <Icon type="down" style={{ marginLeft: 7 }} />
        };
        //绑定数据
        let data = this.props.data;
        let demandText, billText;
        //需求类型显示判断
        switch (data.demandType) { //data.demandType:需求类型参数
            case "0":
                demandText = "航线需求";
                break;
            case "1":
                demandText = "运力投放";
                break;
            case "3":
                demandText = "航线委托";
                break;
            case "4":
                demandText = "运力委托";
                break;
            default:
                demandText = "暂无数据"
        };
        //状态显示文字判断
        switch (data.billState) { //data.billState:账单状态参数
            case "1":
                billText = <span style={{ color: "red" }}>未结清</span>;
                break;
            case "0":
                billText = "已结清";
                break;
            case "2":
                billText = "已融资";
                break;
            default:
                billText = "-";
                break;
        };
        //金额判断
        let accountsDue = data.accountsDue;
        let billNum = "";
        //金额重组
        if (accountsDue == null) {//无金额时
            billNum = "-"
        } else {
            if (accountsDue.length <= 3) {//金额小于100时，不需加逗点
                billNum = accountsDue;
            } else {
                for (let i = 0; i < parseInt(accountsDue / 3); i++) {//每三个数字加个逗点
                    billNum = "," + accountsDue.slice(-3) + billNum;
                    accountsDue = accountsDue.slice(0, accountsDue.length - 3);
                    if (accountsDue.length <= 3) {
                        break;
                    }
                };
                billNum = accountsDue + billNum;
            };
        }
        return (
            <div className={style['box']} onClick={this.changeDirection.bind(this)}>
                <div className={style['time']}>{data.refreshTime}</div>
                <div className={style['type']}>{demandText}</div>
                <div className={style['title']}><span onClick={(e) => this.detail(e)}>{data.title}</span></div>
                <div className={style['pay']}>{billNum}</div>
                <div className={style['state']}>{billText}</div>
                <div className={style['showMore']} >{
                    this.props.data.billState==2 ? "" : <Fragment>查看详情{showIcon}</Fragment>
                }</div>
            </div>
        )
    }
}