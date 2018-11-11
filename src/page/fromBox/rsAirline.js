import React, { Component } from 'react';
import Axios from './../../utils/axiosInterceptors'
import emitter from './../../utils/events';

import style from './../../static/css/from/rsAirline.scss';

import ApplyMeasuringChen from '../../components/applyMeasuring/applyMeasuringChen'


export default class RsAirline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applyMeasuringData: {},  // 向“申请测算”组件传递的数据
            showApplyMeasuring: false,  // 申请测算是否显示
        }
    }
    measuringFn() {  // 点击“申请测算”
        console.info(this.props.rs);
        // this.props.updateDetail();
        // return ;
        Axios({
            method: 'post',
            url: '/selectOnceSailingMeasurePrice',
            /*params:{  // 一起发送的URL参数
                page:1
            },*/
            // data: JSON.stringify(demand),
            dataType: 'json',
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        }).then((response) => {
            if (response.data.opResult == 0) {
                let data = {};
                data.OnceSailingMeasurePrice = response.data.singleSailingMeasurePrice;
                // TODO: 传递的数据
                data.demandId = this.props.rs.demandId;
                data.responsePlanId = this.props.rs.id;
                this.setState({
                    applyMeasuringData: data,
                    showApplyMeasuring: true
                })
            } else {
                alert('申请测算失败！');
            }
        });
    }
    closeMeasuringFn(i) {  // 关闭申请测算  1:成功  2：失败
        if(i == 1) {
            this.props.updateDetail();
        }
        this.setState({
            showApplyMeasuring: false,
        })
    }
    componentDidMount() {
        emitter.addEventListener('rsAirlineApply', (data) => {
            console.info(data);
        })
    }
    componentWillMount() {

    }
    calculateEle = () => {
        let { calculationId, calculationRoute, calculationState, responseProgress} = this.props.rs;
        
        if (!this.props.calculate) {
            return '';
        } else if (calculationState === '0') {
            return <a style={{ 'background': '#8b93ae', color: '#ffffff', cursor: 'default' }}>测算中</a>
        } else if (calculationState === '1') {
            return <a href={`/downloadCalculationsRecord?id=${calculationId}`} title={calculationRoute+'测算报告.pdf'}>测算完成，点击下载</a>
        } else if (responseProgress == '-1' || responseProgress == '0' || responseProgress == '1' || responseProgress == '8') {
            return <a onClick={this.measuringFn.bind(this)}>申请测算</a>
        }else{
            return '';
        }
    }
    // cityFun = (iata, name)=>{
    //     return releaseDemandAirport == iata ? (
    //         <span className={style['light']}
    //             style={{ cursor: 'pointer' }}
    //             onClick={_this.handlePoint.bind(_this, dpt)}>{name}</span>
    //     ) : (
    //         <span>{name}</span>
    //     )
    // }
    render() {
        let scheme = this.props.rs;
        let { id, dpt, dptNm, pst, pstNm, arrv, arrvNm, price } = scheme ? scheme : {};
        // 接受数据
        return (
            <div className={style['re-scheme-con']}>
                {
                    this.state.showApplyMeasuring && <ApplyMeasuringChen
                        data={this.state.applyMeasuringData}
                        close={this.closeMeasuringFn.bind(this)} />
                }
                <div className={style['title']}>
                    <span className={style['detail-text']}>方案详情</span>
                    {this.calculateEle()}
                    {/* {this.props.calculate ? <span className={style['user-act-btn']} onClick={this.measuringFn.bind(this)}>申请测算</span> : ''} */}
                </div>
                <div className={style['course-info']}>
                    <div className={style['air-point']}>
                        <span>始发</span>
                        <span>{dptNm}</span>
                        {/* {createEle(dpt, dptNm)} */}
                    </div>
                    {/* pst 决定是否显示经停点 */}
                    {
                        pst ? (
                            <React.Fragment>
                                <div className={style['air-icon']}>
                                    <i className={'iconfont'}>&#xe62d;</i>
                                </div>
                                <div className={style['air-point']}>
                                    <span>经停</span>
                                    {/* {createEle(pst, pstNm)} */}
                                    <span>{pstNm}</span>
                                </div>
                                <div className={style['air-icon']}>
                                    <i className={'iconfont'}>&#xe62d;</i>
                                </div>
                            </React.Fragment>
                        ) : (
                                <div className={style['air-icon']}>
                                    <i className={'iconfont'}>&#xe62d;</i>
                                </div>
                            )
                    }
                    <div className={style['air-point']}>
                        <span>到达</span>
                        <span>{arrvNm}</span>
                        {/* {createEle(arrv, arrvNm)} */}
                    </div>
                    <div className={style['air-price']}>
                        <span>报价</span>
                        <span>
                            {price}
                            {/* {quoteType === '0' ? '其他' : ''}
                            {quoteType === "1" ? (<span>定补<span className={style['light']}>{quotedPrice}万/班</span></span>) : ''}
                            {quoteType === "2" ? (<span>保底<span className={style['light']}>{quotedPrice}万/h</span></span>) : ''} */}
                        </span>
                    </div>
                </div>

            </div>
        )
    }
}