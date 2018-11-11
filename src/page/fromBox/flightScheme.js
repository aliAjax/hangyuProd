import React, { Component } from 'react';
import { store } from './../../store/index';
import emitter from '../../utils/events';


import { Switch } from 'antd';
import style from './../../static/css/from/flightScheme.scss';


const chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
const chnUnitChar = ["", "十", "百", "千"];
export default class FlightScheme extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentWillUnmount() {
        this.showLines({
            v: null,
            t: false
        });
    }
    componentWillReceiveProps() {
        this.showLines({
            v: null,
            t: false
        });
        
    }
    SectionToChinese = (section) => {
        var strIns = '', chnStr = '';
        var unitPos = 0;
        var zero = true;
        while (section > 0) {
            var v = section % 10;
            if (v === 0) {
                if (!zero) {
                    zero = true;
                    chnStr = chnNumChar[v] + chnStr;
                }
            } else {
                zero = false;
                strIns = chnNumChar[v];
                strIns += chnUnitChar[unitPos];
                chnStr = strIns + chnStr;
            }
            unitPos++;
            section = Math.floor(section / 10);
        }
        return chnStr;
    }
    NumberToChinese = (num) => {
        var unitPos = 0;
        var strIns = '', chnStr = '';
        var needZero = false;

        if (num === 0) {
            return chnNumChar[0];
        }

        while (num > 0) {
            var section = num % 10000;
            if (needZero) {
                chnStr = chnNumChar[0] + chnStr;
            }
            strIns = this.SectionToChinese(section);
            strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
            chnStr = strIns + chnStr;
            needZero = (section < 1000) && (section > 0);
            num = Math.floor(num / 10000);
            unitPos++;
        }

        return chnStr;
    }
    showLines(v, t) {
        emitter.emit("addLines", { v, t });
    }
    handlePoint = (iata) => {
        let transmit = {
            iata,
        }
        emitter.emit('openPopup', {
            popupType: 5,
            popupMes: {
                transmit,
            }
        })
    }
    checkInternal = (dpt, pst, arrv) => {
        let airList = store.getState().allAirList;
        let res = { a: false, b: false, c: false };
        let city = airList.filter((value) => {
            if (value.iata == dpt) {
                res.a = value.international === "0" ? false : true;//国内航线:'0',
            } else if (value.iata == pst) {
                res.b = value.international === "0" ? false : true;
            } else if (value.iata == arrv) {
                res.c = value.international === "0" ? false : true;
            }
        })
        if (res.a === true || res.b === true || res.c === true) {//国际航线
            return true;
        } else {//国内航线
            return false;
        }
    }
    createScheme = () => {
        if (!this.props.scheme) return '';

        // let roleCode = store.getState().role.airlineretrievalcondition;
        let _this = this;
        let ele = this.props.scheme.map((value, index) => {
            let {
                dpt, //始发代码
                dptNm, //始发地名
                pst, //经停代码
                pstNm, //经停地点
                arrv, //到达代码
                arrvNm, //到达地名
                quoteType, //补贴类型
                quotedPrice, //补贴报价
                demandId,//需求id
                id, //此方案id
                state, //??这是干嘛的
                releaseDemandAirport, //发布需求机场
            } = value;

            let internal = this.checkInternal(dpt, pst, arrv);

            let createEle = function (iata, name) {
                return releaseDemandAirport == iata ? (
                    <span className={style['light']}
                        style={{ cursor: 'pointer' }}
                        onClick={_this.handlePoint.bind(_this, iata)}>{name}</span>
                ) : (
                        <span>{name}</span>
                    )
            }
            let date = new Date();

            let path = window.location.hash.search(/userCenter/) > 0 ? true : false;
            
            return (
                <div className={style['flight-course-item']} key={id + index + '' + date.getTime()}>
                    <div className={style['title']}>
                        <span>方案{this.NumberToChinese(index + 1)}</span>
                        {
                            internal || path ? '' : (
                                <span>
                                    <span>显示航路</span>
                                    <Switch key={value.id} size="small" onChange={this.showLines.bind(this, value)} checkedChildren="On" unCheckedChildren="Off" />
                                </span>
                            )
                        }
                    </div>
                    <div className={style['course-info']}>
                        <div className={style['air-point']}>
                            <span>始发</span>
                            {createEle(dpt, dptNm)}
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
                                        {createEle(pst, pstNm)}
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
                            {createEle(arrv, arrvNm)}
                        </div>
                        <div className={style['air-price']}>
                            <span>报价</span>
                            <span>
                                {quoteType === '0' ? '待议' : ''}
                                {quoteType === "1" ? (<span>定补<span className={style['light']}>{quotedPrice}万/班</span></span>) : ''}
                                {quoteType === "2" ? (<span>保底<span className={style['light']}>{quotedPrice}万/时</span></span>) : ''}
                            </span>
                        </div>
                    </div>
                </div>
            )
        })
        return ele;
    }
    render() {
        return (
            <div className={style['flight-course']}>
                {this.createScheme()}
            </div>
        )
    }
}