/* eslint-disable */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { store } from "../../store/index";
import { host as $host} from "./../../utils/port";
import {assemblyAction as an} from "../../utils/assemblyAction";
import style from './../../static/css/InformationQuery/InformationQuery.scss'

export default class InformationQuery extends Component{
    constructor(props){
        super(props);
        this.state = {
            airportArr: [
                {
                    img: '/images/airport/pek.jpg',
                    name: '北京首都国际机场',
                    iata: 'PEK',  // 三字码
                    icao: 'ZBAA',  // 四字码
                    num: 100000,  // 吞吐量
                },{
                    img: '/images/airport/ctu.jpg',
                    name: '成都双流国际机场',
                    iata: 'CTU',  // 三字码
                    icao: 'ZUUU',  // 四字码
                    num: 100000,
                },{
                    img: '/images/airport/can.jpg',
                    name: '广州白云国际机场',
                    iata: 'CAN',  // 三字码
                    icao: 'ZGGG',  // 四字码
                    num: 100000,
                },{
                    img: '/images/airport/pvg.jpg',
                    name: '上海浦东国际机场',
                    iata: 'PVG',  // 三字码
                    icao: 'ZSPD',  // 四字码
                    num: 100000,
                },
            ],
            airlineArr: [
                {
                    icon: 'icon-zhongguohangkongwenzi_CA',
                    companyName: '中国国际航空',
                    companyIata: 'CA',  // 二字码
                    companyIcao: 'CCA',  // 三字码
                    num: 10000,  // 客机数量
                },{
                    icon: 'icon-dongfanghangkongwenzi_MU',
                    companyName: '中国东方航空',
                    companyIata: 'MU',  // 二字码
                    companyIcao: 'CES',  // 三字码
                    num: 10000,  // 客机数量
                },{
                    icon: 'icon-hainanhangkongwenzi_HU',
                    companyName: '海南航空',
                    companyIata: 'HU',  // 二字码
                    companyIcao: 'CHH',  // 三字码
                    num: 10000,  // 客机数量
                },{
                    icon: 'icon-nanfanghangkongwenzi_CZ',
                    companyName: '中国南方航空',
                    companyIata: 'CZ',  // 二字码
                    companyIcao: 'CSN',  // 三字码
                    num: 10000,  // 客机数量
                },
            ],
            cityArr: [
                {
                    img: '/images/city/beijing.jpg',
                    cityName: '北京',
                    airportpinyin: 'beijing',
                    num: 2,
                },{
                    img: '/images/city/shanghai.jpg',
                    cityName: '上海',
                    airportpinyin: 'shanghai',
                    num: 2,
                },{
                    img: '/images/city/guangzhou.jpg',
                    cityName: '广州',
                    airportpinyin: 'guangzhou',
                    num: 2,
                },{
                    img: '/images/city/chengdu.jpg',
                    cityName: '成都',
                    airportpinyin: 'chengdu',
                    num: 2,
                },
            ]
        }
    }
    getInfo(val, type) {  // 传递搜索信息 type: airport、airline、city
        let data = {};
        if(type == 'airport') {
            data.mes = val.iata;   // 机场的三字码
            data.type = 'airport';    // 类型：airline、airport、city
            this.sessionStorageFn(data);
            window.location.href = '#/airport';
        }else if(type == 'airline') {
            data.mes = val.companyIcao;   // 航司的三字码
            data.type = 'airline';    // 类型：airline、airport、city
            this.sessionStorageFn(data);
            window.location.href = '#/airline';
        }else if(type == 'city') {
            data.mes = val.cityName;   // 城市的名称
            data.type = 'city';    // 类型：airline、airport、city
            this.sessionStorageFn(data);
            window.location.href = '#/city';
        }
    }
    sessionStorageFn(data) {
        store.dispatch(an('SEARCHINFO', data));
        sessionStorage.removeItem('search_info');
        sessionStorage.setItem('search_info', JSON.stringify(data));
    }
    componentWillMount(){  // 将要渲染

    }
    componentDidMount() {   // 加载渲染完成

    }
    componentWillReceiveProps(nextProps){  // Props发生改变

    }
    componentWillUnmount(){  // 卸载组件

    }
    render(){
        return(
            <div className={`router-context ${style['bg-img']}`} style={{ overflowY: 'scroll' }}>
                <div className={style['container']}>
                    <div className={style['item']}>
                        <div>
                            <div>热门机场</div>
                            <div>
                                <a href="#/allAirport">
                                    查看所有机场
                                    <span className={'iconfont'}>&#xe686;</span>
                                </a>
                            </div>
                        </div>
                        <div>
                            {
                                this.state.airportArr.map((val, index) => {
                                    return (
                                        <div className={style['figure']} key={index} onClick={this.getInfo.bind(this, val, 'airport')}>
                                            <div className={style['img']}>
                                                <img src={`${val.img}`} alt={val.name} />
                                            </div>
                                            <div>
                                                <div>{val.name}</div>
                                                <div>{val.iata}/{val.icao}</div>
                                                {/*<div className={style['tip']}>吞吐量{val.num}万</div>*/}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className={style['item']}>
                        <div>
                            <div>热门航司</div>
                            <div>
                                <a href="#/allAirline">
                                    查看所有航司
                                    <span className={'iconfont'}>&#xe686;</span>
                                </a>
                            </div>
                        </div>
                        <div>
                            {
                                this.state.airlineArr.map((val, index) => {
                                    return (
                                        <div className={style['figure']} key={index} onClick={this.getInfo.bind(this, val, 'airline')}>
                                            <div className={style['icon-wrapper']}>
                                                <svg className={`${style['icon']} ${style['svg-logo']}`} aria-hidden="true">
                                                    <use xlinkHref={`#${val.icon}`}></use>
                                                </svg>
                                            </div>
                                            <div style={{background: '#efefef'}}>
                                                <div>{val.companyName}</div>
                                                <div>{val.companyIata}/{val.companyIcao}</div>
                                                {/*<div className={style['tip']} style={{padding: '0 21px 0 9px'}}>客机{val.num}架</div>*/}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className={style['item']}>
                        <div>
                            <div>热门城市</div>
                            <div>
                                <a href="#/allCity">
                                    查看所有城市
                                    <span className={'iconfont'}>&#xe686;</span>
                                </a>
                            </div>
                        </div>
                        <div>
                            {
                                this.state.cityArr.map((val, index) => {
                                    return (
                                        <div className={style['figure']} key={index} onClick={this.getInfo.bind(this, val, 'city')}>
                                            <div className={style['img']}>
                                                <img src={`${val.img}`} alt={val.cityName} />
                                            </div>
                                            <div>
                                                <div>{val.cityName}</div>
                                                <div><span className={'iconfont'}>&#xe644;</span>{val.airportpinyin}</div>
                                                {/*<div className={style['tip']} style={{padding: '0 18px 0 19px'}}>机场{val.num}座</div>*/}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}