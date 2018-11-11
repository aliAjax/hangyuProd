import React, { Component } from 'react';
import Axios from "./../../utils/axiosInterceptors";
import { store } from './../../store/index';
import emitter from '../../utils/events';
import { Spin, Alert, Pagination } from 'antd';
import { assemblyAction as an } from "../../utils/assemblyAction";

import style from './../../static/css/popup/information.scss';
import slice from './../../static/img/Slice.png';


export default class Information extends Component {
    constructor(popup) {
        super(popup)
        this.state = {
            informationsLoading: true,//基本信息加载动画
            earningLoading: true,//收益数据加载动画
            iata: '',//机场三字码
            airpostName: '--',//机场名字
            radioValue: 0,//单选框类型,0:月,1:季,2年
            showTip: false,

            list: [],//请求到的数据列表
            pageNo: 1,//当前页
            pageSize: 50,//每页显示数据数

            air_ele: "--",//机场标高
            airfieldLvl: "--",//飞行区等级
            runwayArticleNumber: "--",//跑道数量
            domestic: "--",//在飞航点
            passengerThroughput: "--",//吞吐量
            year: "--",//年份
            iATA: "--",
            icao: "--",

            passenger: '--',//综合客座率
            punctuality: '--',//机场准点率
            exceptionFlag: '--',

        }
    }
    componentWillMount() {
        let iata = this.props.popupMes ? this.props.popupMes.transmit.iata : false;
        if (iata) {
            // 请求基本信息
            Axios({
                url: 'getAirportSimpleInfoByCode',
                method: 'post',
                params: {
                    iata,
                },
            }).then((response) => {
                this.setState({
                    iata: iata,
                    informationsLoading: false,
                    airpostName: this.findCityCd(iata),
                    ...response.data.list[0],
                }, () => {
                    this.getEarning();
                })
            })
            // 请求背景图片
            Axios({
                url: 'loadBackgroudBycode',
                method: 'post',
                params: {
                    iata,
                },
            }).then((response) => {
                let background = response.data.background;
                this.setState({
                    background: background || slice,
                }, () => {
                })
            })
            // 超过时间关闭加载动画
            setTimeout(() => {
                this.setState({
                    informationsLoading: false,
                })
            }, 8000);
        }
    }
    // 请求收益数据
    getEarning = () => {
        let { radioValue:type, iata, pageNo, pageSize } = this.state;
        if (!iata) return;

        Axios({
            url: 'getAirlineRevenueInformationByCode',
            method: 'post',
            params: {
                iata,
                type,
                pageNo,
                pageSize,
            },
        }).then((response) => {
            clearInterval(this.timer)

            let showTip = response.data.list && response.data.list.length ? false : true;//是否显示提示

            this.setState(() => {
                return {
                    earningLoading: false,
                    showTip,
                    ...response.data,
                }
            })
        })
    }
    // 类型切换
    onChange = (pageNumber) => {
        this.setState({
            pageNo: pageNumber,
            earningLoading: true,
            list: [],
        }, () => {
            this.getEarning()
        })
    }
    // 改变状态,
    reportRadioChange(value) {
        this.setState({
            radioValue: value,
            earningLoading: true,
            pageNo: 1,
            list: [],
        }, () => {
            this.getEarning();
        })
    }

    // 寻找城市名
    findCityCd(iata) {
        let airList = store.getState().allAirList;
        let name = '';
        for (let i = 0; i < airList.length; i++) {
            if (airList[i].iata == iata) {
                name = airList[i].airlnCd;
                break;
            }
        }
        return name;
    }
    // 机场城市
    findName = (arr) => {
        let [dpt, pst, arrv] = arr;
        let airList = store.getState().allAirList;
        let temp = {};
        airList.filter((value) => {
            if (value.iata == dpt) {
                temp.dptNm = value.city;
            } else if (value.iata == pst) {
                temp.pstNm = value.city;
            } else if (value.iata == arrv) {
                temp.arrvNm = value.city;
            }
        })
        return temp;
    }
    //关闭popup层
    closePopup = () => {
        emitter.emit('openPopup', {
            popupType: 0,
            popupMes: '',
        })
    }
    closeForm = () => {
        emitter.emit('openFrom', {
            openFrom: false,
        });
    }

    //跳转到详情页面
    toDetail = () => {
        let data = {
            mes: this.state.iata,
            type: 'airport'
        };
        store.dispatch(an('SEARCHINFO', data));
        sessionStorage.setItem('search_info', JSON.stringify(data));
        window.location.href = '#/airport';
        this.closePopup();
        this.closeForm();
    }

    //查找航点,返回航线
    findAirline = (key) => {
        let arr = [];
        if (key.match(/^[a-zA-Z]+$/)) {
            for (let i = 0; i < key.length; i++) {
                if (i % 3 == 0) {
                    arr.push(key.slice(i, i + 3))
                }
            }
        } else {
            arr = key.split('-');
        }

        let [one, two, three] = arr;
        let newArr = arr.length == 2 ? [one, null, two] : [one, two, three];
        let { dptNm, pstNm, arrvNm } = this.findName(newArr);
        let airline = `${dptNm ? dptNm : ''}-${pstNm ? pstNm + '-' : ''}${arrvNm ? arrvNm : ''}`;
        return airline;
    }
    //机场收益图表
    earningItem = () => {
        let list = this.state.list;
        if (list.length) {
            return list.map((item, index) => {
                let key = item.name.split(',')[0];
                let value = item.value;

                let airline = this.findAirline(key);
                let res = value.map((tItem, index) => {
                    let kName = tItem.name;
                    let { zglsr, tdkl, pjzk, tdsr, kzl, stzkl, bc, stzsr } = tItem.value; //bc,班次;zglsr,平均座公里收入;pjzk,平均折扣;kzl,客座率;

                    let kairline = this.findAirline(kName);
                    return (
                        <div className={style['earning-item-detail']} key={index}>
                            <div>{kairline}</div>
                            <div>{bc}</div>
                            <div>{kzl}</div>
                            <div>{pjzk}</div>
                            <div>{zglsr}</div>
                        </div>
                    )
                })
                return (
                    <div className={style['earning-item']} key={index}>
                        <div>{airline}</div>
                        <div>{res}</div>
                    </div>
                )
            })
        } else {
            return '';
        }
    }
    render() {
        return (
            <div className={style['information-container']}>
                <div className={style['shade']} style={{ display: this.state.informationsLoading ? '' : 'none' }}>
                    <Spin tip='loading...' spinning={this.state.informationsLoading} />
                </div>
                <div className={style['i-header']} style={{ backgroundImage: this.state.background ? 'url(' + this.state.background + ')' : 'none' }}>
                    <div className={style['name']}>{this.state.airpostName}机场</div>
                    <div className={style['close-btn']}><span className={'iconfont'} onClick={this.closePopup}>&#xe652;</span></div>
                </div>
                <div className={style['i-content']}>

                    <div className={`${style['com-between']} ${style['c-title']}`}>
                        <div className={style['c-title-text']}>
                            <span>{this.state.airpostName}机场</span><span>{this.state.iATA}/{this.state.icao}</span>
                        </div>
                        <div>
                            <a onClick={this.toDetail}>航行信息及更多相关></a>
                        </div>
                    </div>
                    <div className={style['scale']}>
                        <div className={`${style['com-flex-start']} ${style['scale-item']}`}>
                            <div className={style['com-item']}><span>飞行等级</span><span>{this.state.airfieldLvl}</span></div>
                            <div className={style['com-item']}><span>跑道数量</span><span>{this.state.runwayArticleNumber}</span></div>
                            <div className={style['com-item']}><span>在飞航点(个)</span><span>{this.state.domestic}</span></div>
                            <div className={style['com-item']}><span>机场标高</span><span>{this.state.air_ele}</span></div>
                        </div>
                        <div className={`${style['com-flex-start']} ${style['scale-item']}`}>
                            <div className={style['com-item']}><span>旅客吞吐量（人）</span><span>{this.state.passengerThroughput}({this.state.year})</span></div>
                        </div>
                    </div>
                    <div className={`${style['com-flex-start']} ${style['visitor']}`}>
                        <div className={style['com-item']}><span>综合客座率</span><span>{this.state.passenger}</span></div>
                        <div className={style['com-item']}><span>机场准点率</span><span>{this.state.punctuality}</span></div>
                    </div>
                    <div className={`${style['com-between']} ${style['c-earnings-title']}`}>
                        <div>
                            <span>机场航班收益</span><span>{this.state.iATA}/{this.state.icao}</span><span>(*数据仅供参考)
</span>
                        </div>
                        <div>
                            <div className={style['report-btn-container']}>
                                <input type="radio" name='report' value='1' defaultChecked={this.state.radioValue == 0 ? true : false} onChange={this.reportRadioChange.bind(this, 0)} />
                                <input type="radio" name='report' value='2' defaultChecked={this.state.radioValue == 1 ? true : false} onChange={this.reportRadioChange.bind(this, 1)} />
                                <input type="radio" name='report' value='3' defaultChecked={this.state.radioValue == 2 ? true : false} onChange={this.reportRadioChange.bind(this, 2)} />
                            </div>
                        </div>
                    </div>

                    <div className={style['c-earning-content']}>
                        <div className={style['earning-item']}>
                            <div> 航线 </div>
                            <div>
                                <div className={style['earning-item-detail']}>
                                    <div>航段</div>
                                    <div>班次</div>
                                    <div>平均客座率</div>
                                    <div>平均折扣</div>
                                    <div>平均座公里收入(元)</div>
                                </div>
                            </div>
                        </div>
                        <div className={style['earning-loading']} style={{ display: this.state.earningLoading ? '' : 'none' }}>
                            <Spin tip='loading...' spinning={this.state.earningLoading} />
                        </div>

                        {this.earningItem()}
                        {
                            this.state.list && this.state.list.length ? <div className={style['page_con']}>
                                <Pagination showQuickJumper current={this.state.pageNo} pageSize={this.state.pageSize} total={parseInt(this.state.totalNum)} onChange={this.onChange} />
                            </div> : ''
                        }
                        {
                            this.state.showTip ? <div className={style['no-date-word']}>暂无数据</div> : ''
                        }

                        {/* <div className={style['earning-item']}>
                            <div>通辽-上海</div>
                            <div>
                                <div className={style['earning-item-detail']}>
                                    <div>通辽-上海</div>
                                    <div>12</div>
                                    <div>46.12</div>
                                    <div>41.02</div>
                                    <div>0.16</div>
                                </div>
                            </div>
                        </div>
                        <div className={style['earning-item']}>
                            <div>通辽-上海</div>
                            <div>
                                <div className={style['earning-item-detail']}>
                                    <div>通辽-上海</div>
                                    <div>12</div>
                                    <div>46.12</div>
                                    <div>41.02</div>
                                    <div>0.16</div>
                                </div>
                                <div className={style['earning-item-detail']}>
                                    <div>通辽-上海</div>
                                    <div>12</div>
                                    <div>46.12</div>
                                    <div>41.02</div>
                                    <div>0.16</div>
                                </div>
                                <div className={style['earning-item-detail']}>
                                    <div>通辽-上海</div>
                                    <div>12</div>
                                    <div>46.12</div>
                                    <div>41.02</div>
                                    <div>0.16</div>
                                </div>
                            </div>
                        </div> */}

                    </div>
                </div>
            </div>
        )
    }
}