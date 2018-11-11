// author:wangli time:2018-05-09 content:个人中心-意向-单条数据
import React, { Component, Fragment } from 'react';
import { store } from "../../../store/index";
import emitter from "../../../utils/events";
import { Modal} from 'antd';
import style from "../../../static/css/userCenter/myIntention/myIntention.scss";

export default class MyIntentionItem extends Component {
    constructor(props) {
        super(props);
        this.contactPartner = this.contactPartner.bind(this);
        this.chatEvent = this.chatEvent.bind(this);
    }
    //点击显示详情事件
    returnData() {
        if(this.props.data.demandProgress==12){
            Modal.error({
                title: '信息提示：',
                content: '该需求正在重新编辑，请在编辑完成后重试。',
                className: ""
            });
        }else {
            let showDetailsType = this.props.showDetailsType;
            showDetailsType = !showDetailsType;
            let id = this.props.data.demandId;
            this.props.showDetailsEvent(id, showDetailsType);
        }
    };

    //点击洽谈
    contactPartner(e) {
        e.stopPropagation();
        this.props.chatEvent(this.props.data.id);
    };

    //具体洽谈事件
    chatEvent(e, id, employee_id) {
        e.stopPropagation();
        let o = {
            fromNameId: store.getState().role.id,
            toNameId: employee_id,
            responsePlanId: id
        };
        emitter.emit("openChat", o);
        this.props.chatEvent(this.props.data.id);
    };

    //鼠标离开时，关闭方案框
    closeShow() {
        this.setState({
            showChat: false
        })
    };

    render() {
        const { data, text, icon } = this.props;
        if (data.title == null) {
            data.title = "返回无数据"
        };
        return (
            <div className={style['my-intention-nav-item']} onClick={this.returnData.bind(this)}>
                <div className={style['my-intention-nav-item-date']}>{data.releasetime}</div>
                <div className={style['my-intention-nav-item-tittle']}><span >{data.title}</span></div>
                <div className={style['my-intention-nav-item-state']}>
                    {text}
                    <div className={style['my-intention-nav-item-hover-div']}>
                        <span dangerouslySetInnerHTML={{ __html: icon }} className={'iconfont'} onClick={(e) => this.contactPartner(e)}></span>
                    </div>
                    <div className={this.props.chatBoxType ? style['chatItem'] : style['noShow']}>
                        {
                            this.props.showData.map((item, index) => {
                                return <div key={index} onClick={(e) => this.chatEvent(e, item.id, item.employee_id)}>{item.route}</div>
                            })
                        }
                    </div>
                </div>
                <div className={style['my-intention-nav-item-details']} >
                    查看详情
                    <span className={`iconfont`}>&#xe686;</span>
                </div>
            </div>
        )
    }
}
