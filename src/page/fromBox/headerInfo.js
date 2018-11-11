import React, { Component } from 'react';
import emitter from '../../utils/events';
import { store } from './../../store/index';

import style from './../../static/css/from/headerInfo.scss';


export default class DetailTopInfo extends Component {
    constructor(props) {
        super(props);
    }
    // 关闭
    closeItemDetailForm() {
        emitter.emit("addLines", { v: null, t: false });
        let o = {
            openFrom: false,
        }
        emitter.emit('openFrom', o);
    }
    componentWillMount() { }
    componentWillReceiveProps(nextProps) {
    }
    // 创建节点
    headerFun = () => {
        if (this.props.headerTitle) {
            let { browsingVolume, demandprogress, recivedResponseCount, releasetime } = this.props.headerTitle;
            let demandprogressStr = '';
            switch (Number(demandprogress)) {
                case -1: demandprogressStr = '待支付'; break;
                case 0: demandprogressStr = '需求发布'; break;
                case 1: demandprogressStr = '意向征集'; break;
                case 2: demandprogressStr = '订单确认'; break;
                case 3: demandprogressStr = '关闭'; break;
                case 4: demandprogressStr = '订单完成'; break;
                case 5: demandprogressStr = '佣金支付'; break;
                case 6: demandprogressStr = '交易完成'; break;
                case 7: demandprogressStr = '待处理'; break;
                case 8: demandprogressStr = '已接受'; break;
                case 9: demandprogressStr = '处理中'; break;
                case 10: demandprogressStr = '已拒绝'; break;
                case 11: demandprogressStr = '草稿'; break;
                case 12: demandprogressStr = '审核中'; break;
                default:
                    demandprogressStr = '--';
            }
            return (
                <div className={style['detail-top-info']}>
                    <div className={style['detail-top-info-item']}>
                        <div>
                            <span>发布时间</span>
                            <span>
                                {releasetime}
                            </span>
                        </div>
                        <div>
                            <span>状态:</span>
                            <span>
                                {demandprogressStr}
                            </span>
                        </div>
                    </div>
                    <div className={style['detail-top-info-item']}>
                        <div>
                            <i className={'iconfont'}>&#xe629;</i>
                            <span>浏览量</span>
                            <span>
                                {browsingVolume}
                            </span>
                        </div>
                        <div>
                            <i className={'iconfont'}>&#xe629;</i>
                            <span>响应方案</span>
                            <span>
                                {recivedResponseCount}
                            </span>
                        </div>
                        <div className={style['close-btn']} onClick={this.closeItemDetailForm}>
                            <i className={'iconfont'}>&#xe62c;</i>
                        </div>
                    </div>
                </div>
            )
        } else {
            return '';
        }
    }
    render() {
        return this.headerFun();
    }
}