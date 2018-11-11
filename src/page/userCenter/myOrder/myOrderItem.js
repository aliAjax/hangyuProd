// author:wangli time:2018-05-07 content:每条订单
import React, { Component, Fragment } from 'react';
import style from "../../../static/css/userCenter/myOrder/myOrder.scss";

export default class MyIntentionItem extends Component {
    constructor(props) {
        super(props);
        this.returnData = this.returnData.bind(this);
    }
    //点击显示合同详情事件
    returnData(e) {
        e.stopPropagation();
        let showDetailsType = this.props.showDetailsType;
        showDetailsType = !showDetailsType;
        let id = this.props.data.id;
        let progress = this.props.data.demandProgress;
        this.props.showDetailsEvent(id, showDetailsType, progress);
    }

    //点击显示详情事件
    detailEvent() {
        let showDetailsType = this.props.showFromType;
        showDetailsType = !showDetailsType;
        console.log(showDetailsType)
        let id = this.props.data.id;
        let progress = 1;
        this.props.showDetailsEvent(id, showDetailsType, progress);
    }

    render() {
        const { data, text, icon, typeText } = this.props;
        if (data.title == null) {
            data.title = "返回无数据"
        };
        return (
            <div className={style['my-order-nav-item']} onClick={this.detailEvent.bind(this)}>
                <div className={style['my-order-nav-item-date']}>{data.releaseTime}</div>
                <div className={style['my-order-nav-item-demand']}>{typeText}</div>
                <div className={style['my-order-nav-item-tittle']}>
                    {/*<span onClick={(e) => this.returnData(e)}>{data.title}</span>*/}
                    <span>{data.title}</span>
                </div>
                <div className={style['my-order-nav-item-state']}>
                    {text}
                    <div className={style['my-order-nav-item-hover-div']}>
                        <span dangerouslySetInnerHTML={{ __html: icon }} className={'iconfont'}></span>
                        {/*<span className={style['my-order-nav-item-hover']}>洽谈</span>*/}
                    </div>
                </div>
                <div className={style['my-order-nav-item-details']}>
                    查看详情
                    <span className={`iconfont`}>&#xe686;</span>
                </div>
            </div>
        )
    }
}
