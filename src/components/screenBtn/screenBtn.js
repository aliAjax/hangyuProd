import React, { Component } from 'react';
import {hot} from 'react-hot-loader';
import emitter from '../../utils/events';
import styles from '../../static/css/demandList/screenBtn.scss'
import Check from './check'
import Check1 from './check1'
import CitySearch from '../search/citySearch'
import {store} from "../../store/index";
import {assemblyAction as an} from "../../utils/assemblyAction";
import {airMes,cityMes,companyMes} from '../../static/js/airMes'
import {conversions,conversionsCity,conversionsCompany} from '../../static/js/conversions';
import { Radio } from 'antd'

export default class ScreenBtn extends Component{
    constructor(props){
        super(props);
        this.state = {
            searchText: '',
            showCitySearch: false,
        }
    }
    // 点击‘差号’
    closeScreenFn() {
        this.props.closeScreenBtn(false);
    }
    cityDataFn(data){
        this.setState({
            searchText: data.name,
            showCitySearch: false
        });
        store.dispatch(an('SETCITY',{v:data.code,t:true}))
    }
    // 输入框点击事件
    searchTextClickFn(e) {
        e.stopPropagation();
    }
    // 输入框改变事件
    searchTextChangeFn(e) {
        let target = e.target;
        this.setState({
            searchText: target.value
        });
    }
    // 输入框焦点事件
    inputClickFn(e) {
        e.stopPropagation();
        this.setState({
            showCitySearch: true
        })
    }
    //input失焦事件
    inputBlurFn() {
        let that = this;
        setTimeout(() => {
            that.setState(() => {
                return {
                    showCitySearch: false,
                }
            })
        }, 150)
    }
    removeCity(key) {
        store.dispatch(an('SETCITY', {v: key.cityIcao, t: false}))
        this.forceUpdate();
    }
    cancleFn() {
        store.dispatch(an('SETCITY', {v: '$&', t: false}));
        this.props.closeScreenBtn(false);
    }
    sureFn() {
        this.props.closeScreenBtn(true);
    }
    radioChangeFn(e) {
        let target = e.target;
        store.dispatch(an('LINETYPE', target.value));
    }
    radioChange2Fn(e) {
        let target = e.target;
        store.dispatch(an('PORTTYPE', target.value));
    }
    componentDidMount() {
        this.closeFloatingLayer = emitter.addEventListener('closeFloatingLayer', (message) => {
            // 监听浮沉关闭
            this.setState({
                showCitySearch: false,
            })
        });
    }
    componentWillUnmount() {
        emitter.removeEventListener(this.closeFloatingLayer);
    }
    render(){
        const RadioGroup = Radio.Group;
        let axis = {
            position: 'absolute',
            top: '30px',
            left: '30px',
            maxHeight: '220px',
            overflowY: 'scroll',
            background: 'white',
            fontSize: '1.2rem',
            zIndex: 22,
            boxShadow: '0 2px 11px rgba(85,85,85,0.1)'
        };
        let cityList = conversionsCity(store.getState().cityList); // 模拟数据
        let cityCuped = [];
        store.getState().demandList.conditions.city.s.forEach((v) => {
            cityCuped.push(cityMes(cityList, v));
        });
        return(
            <div className={`scroll ${styles['screen-container']}`}>
                <div className={styles['top']}>
                    筛选
                    <span className={`${'iconfont'} ${styles['closeIcon']}`}
                          onClick={this.closeScreenFn.bind(this)}>&#xe62c;</span>
                </div>
                {/*<div className={`${styles['item-flex']} ${styles['fir']}`}>
                    <div>
                        <div className={styles['city-search']}>
                            <div>
                                <span className={'iconfont'}>&#xe608;</span>
                                城市
                            </div>
                            <input type="text" maxLength="20" placeholder="输入城市名进行搜索"
                                   value={this.state.searchText}
                                   onChange={this.searchTextChangeFn.bind(this)}
                                   onClick={this.inputClickFn.bind(this)}
                                   onBlur={this.inputBlurFn.bind(this)} />
                            {
                                this.state.showCitySearch && <CitySearch axis={axis}
                                                                         resData={this.cityDataFn.bind(this)}
                                                                         searchText={this.state.searchText} />
                            }
                        </div>
                        {
                            cityCuped.length != 0
                            && <div className={styles['sc-grade-x']}>
                                {
                                    cityCuped.map((key, index) => {
                                        return (
                                            <div className={styles['city-item']} key={index}>
                                                <span>{key.cityName}</span>
                                                <span className={`btn-w ${styles['search-ed']}`}
                                                      onClick={this.removeCity.bind(this, key)}>&#xe62c;</span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>
                </div>*/}
                {/*<div className={`${styles['item-flex']} ${styles['sec']}`}>
                    <div>
                        <span className={'iconfont'}>&#xe648;</span>
                        飞行等级
                    </div>
                    <div>
                        <Check />
                    </div>
                </div>*/}
                <div className={`${styles['item-flex']} ${styles['third']}`}>
                    <div>
                        <span className={'iconfont'}>&#xe648;</span>
                        补贴
                    </div>
                    <div>
                        <Check1 />
                    </div>
                </div>
                {/*<div className={`${styles['item-flex']} ${styles['fourth']}`}>
                    <div style={{marginBottom: '10px'}}>
                        <span className={'iconfont'}>&#xe604;</span>
                        航线类型
                    </div>
                    <div>
                        <RadioGroup name="radiogroup" defaultValue={store.getState().demandList.conditions.airType} onChange={this.radioChangeFn.bind(this)}>
                            <Radio value={''} style={{fontSize: '1.2rem'}}>全部</Radio>
                            <Radio value={1} style={{fontSize: '1.2rem'}}>国内航线</Radio>
                            <Radio value={2} style={{fontSize: '1.2rem'}}>国际航线</Radio>
                        </RadioGroup>
                    </div>
                </div>*/}
                <div className={`${styles['item-flex']} ${styles['fourth']}`}>
                    <div style={{marginBottom: '10px'}}>
                        <span className={'iconfont'}>&#xe604;</span>
                        {
                            store.getState().role.role == 0 ? '航线类型' : '航司类型'
                        }
                    </div>
                    <div>
                        {
                            store.getState().role.role == 0 ?
                                <RadioGroup name="radiogroup" defaultValue={store.getState().demandList.conditions.airType} onChange={this.radioChangeFn.bind(this)}>
                                    <Radio value={""} style={{fontSize: '1.2rem'}}>全部</Radio>
                                    <Radio value={1} style={{fontSize: '1.2rem'}}>国内航线</Radio>
                                    <Radio value={2} style={{fontSize: '1.2rem'}}>国际航线</Radio>
                                </RadioGroup> :
                                <RadioGroup name="radiogroup" defaultValue={store.getState().demandList.conditions.airportType} onChange={this.radioChange2Fn.bind(this)}>
                                    <Radio value={0} style={{fontSize: '1.2rem'}}>全服务航空</Radio>
                                    <Radio value={1} style={{fontSize: '1.2rem'}}>低成本航空</Radio>
                                    <Radio value={""} style={{fontSize: '1.2rem'}}>都接受</Radio>
                                </RadioGroup>
                        }
                    </div>
                </div>
                <div className={`${styles['item-flex']} ${styles['btn-box']}`}>
                    <div className={'btn-w'} onClick={this.cancleFn.bind(this)}>取消</div>
                    <div className={'btn-b'} onClick={this.sureFn.bind(this)}>查询</div>
                </div>
            </div>
        )
    }
}
