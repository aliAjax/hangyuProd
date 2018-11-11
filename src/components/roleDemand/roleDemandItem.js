
import React, { Component } from 'react';
import { store } from './../../store/index';
// import Axios from "./../../utils/axiosInterceptors";
import emitter from '../../utils/events';
import classNames from 'classnames';
import style from './../../static/css/demandList/roleDemandItem.scss';

export default class RoleDemandItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,//需求id
            releasetime: '--',//发布时间
            demandtypeStr: '--',// 需求类型
            title: '--',//发布标题
            demandprogress: '--',//状态代码
            unreadMessageCount: 0,//未读消息数

            index: 0,
            msgCount: false,
            itemMsg: () => { },
        }
    }
    componentWillMount() {  // 将要渲染
        this.initData(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.initData(nextProps)
    }
    initData = (props) => {
        let {
            id,//需求id
            releasetime,//发布时间
            demandtypeStr,// 需求类型
            title,//发布标题
            demandprogress,//状态代码
            unreadMessageCount,//未读消息数
        } = props.demandInfo ? props.demandInfo : {};

        let itemMsg = props.itemMsg

        let index = props.index;

        let demandprogressStr = this.demandprogressStr(demandprogress);//需求类型字符串(根据状态代码前台判断)

        this.setState(() => {
            return {
                id,//需求id
                releasetime,//发布时间
                demandtypeStr,// 需求类型
                title,//发布标题
                demandprogress,//状态代码
                unreadMessageCount,//未读消息数
                demandprogressStr,

                index,
                msgCount: unreadMessageCount > 0 ? true : false,
                itemMsg
            }
        })
    }
    handleDemandItemClick(transmit) {
        let { id: demandId, index } = this.state;
        let employeeId = store.getState().role.id;
        // Axios({
        //     method: 'post',
        //     url: 'updateSystemStateByDemandIdAndEmployeeId',
        //     params: {
        //         demandId,
        //         employeeId,
        //     }
        // }).then((response) => {
        //     console.log(response)
        emitter.emit('openFrom', {
            openFrom: true,
            fromType: 3,
            fromMes: {
                tabType: 'mine',
                transmit: transmit
            }
        });
        // setTimeout(() => {
        //     this.setState({
        //         msgCount: false,
        //     })
        // }, 300);

        // })
        this.state.itemMsg(index)
        // this.setState({
        //     msgCount: false,
        // }, () => {
        //     console.log(this.state.msgCount)
        //     emitter.emit('openFrom', {
        //         openFrom: true,
        //         fromType: 3,
        //         fromMes: {
        //             tabType: 'mine',
        //             transmit: transmit
        //         }
        //     });

        // })
    }
    // 状态 代码->文字 
    demandprogressStr = (demandprogress) => {
        let str = '未获取到数据';
        switch (Number(demandprogress)) {
            case -1: str = '待支付'; break;
            case 0: str = '需求发布'; break;
            case 1: str = '意向征集'; break;
            case 2: str = '订单确认'; break;
            case 3: str = '关闭'; break;
            case 4: str = '订单完成'; break;
            case 5: str = '佣金支付'; break;
            case 6: str = '交易完成'; break;
            case 7: str = '待处理'; break;
            case 8: str = '已接受'; break;
            case 9: str = '处理中'; break;
            case 10: str = '已拒绝'; break;
            case 11: str = '草稿'; break;
            case 12: str = '审核中'; break;
        }
        return str
    }
    render() {
        let {
            id,//需求id
            releasetime,//发布时间
            demandtypeStr,// 需求类型
            title,//发布标题
            demandprogress,//状态代码
            unreadMessageCount,//未读消息数
            demandprogressStr,
            msgCount,
        } = this.state;
        // let demandprogressStr = this.demandprogressStr(demandprogress);//需求类型字符串(根据状态代码前台判断)

        // 传递数据对象
        let transmit = {
            id,
        }

        return (
            <div className={style['demandListItem']} onClick={this.handleDemandItemClick.bind(this, transmit)}>
                <div>{releasetime}</div>
                <div>{demandtypeStr}</div>
                <div title={title}>
                    <div>{title}</div>
                </div>
                <div title={demandprogressStr}>
                    <div>{demandprogressStr}</div>
                    <span className={classNames({ [style['msg-tip']]: msgCount })}></span>
                </div>
            </div>
        )
    }
}