
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import { Checkbox } from 'antd';
import { store } from './../../store/index';

import ScreenBtn from './../../components/screenBtn/screenBtn'
import DemandSearch from './demandSearch'



import style from './../../static/css/demandList/demandList.scss'
import emitter from "../../utils/events";

import RoleDemand from './roleDemand'
import MarketDemand from "./marketDemand";


export default class DemandList extends Component {
    constructor(props) {
        super(props);
        this.closeScreenBtnFn = this.closeScreenBtnFn.bind(this);
        this.state = {
            set: true,
            showScreenBtn: false,
            mac: false,   //TODO: 只看与我匹配的
            res: false,   //TODO: 我响应过的需求
            searchMes: "",  //TODO: 搜索框的内容
            conditions: {},//筛选条件
            num: 0,     // 需求数量
            nueD:0
        }
    }
    initBox = data => {
        let pcH = document.body.clientWidth <= 1366 ? 50 :65;
        this.setState({
            style: {
                height: `${document.body.clientHeight - pcH}px`
            }
        });
    };
    componentWillMount() {
        this.listener = emitter.addEventListener('changeWindow', (value) => {  // 添加监听
            this.initBox();
        });
        this.initBox();
    }
    componentDidMount() {

        // TODO:开发使用
        // emitter.emit('openPopup', {
        //     popupType: 1,
        //     popupMes: {
        //         transmit:{},
        //     }
        // })
    }
    componentWillUnmount() {
    }

    changeList(type) {
        this.setState({
            set: type
        }, function () {
            emitter.emit("marketRelease", type);
        });
    }
    screenClickFn() {  // 点击“筛选”，显示筛选组件
        this.setState((prev) => {
            return {
                showScreenBtn: !prev.showScreenBtn
            }
        })
    }
    closeScreenBtnFn(data) { // 关闭筛选组件
        if (data) {  // true：查询， false：取消
            this.setState({
                showScreenBtn: false,
                conditions: store.getState().demandList
            })
        } else {
            this.setState({
                showScreenBtn: false
            })
        }
    }
    // TODO: 接受搜索组件 + 历史组件传来的数据
    resSearchData(data) {
        this.setState(() => ({
            searchMes: data
        }));
    }
    // 与我匹配
    andIMatching(type, e) {
        switch (type) {
            case 0:
                this.setState({
                    mac: e.target.checked
                });
                break;
            case 1:
                this.setState({
                    res: e.target.checked
                });
                break;
        }
    }
    /**
     * 获取需求数量
     * */
    queryNum(num = 0) {
        this.setState({
            num
        });
    }
    queryMes(nueD = 0){
        this.setState({
            nueD
        });
    }
    render() {
        let set = this.state.set;
        let demo = set ? <MarketDemand queryNum={this.queryNum.bind(this)}
            mac={this.state.mac}
            res={this.state.res}
            searchMes={this.state.searchMes}
            conditions={this.state.conditions} />
            : <RoleDemand queryMes={this.queryMes.bind(this)} queryNum={this.queryNum.bind(this)}
                searchMes={this.state.searchMes} />;
        let headName = {
            hed1: store.getState().role.role == '1' ? '市场运力信息' : '市场航线需求',
            hed2: store.getState().role.role == '1' ? '我的航线需求' : '我的运力信息'
        };
        let searchStyle = {
            position: 'relative',
        };
        return (
            <div className={style['demand-box']} style={{ height: this.state.style.height }}>
                <ul className={'clear-both'}>
                    <li onClick={this.changeList.bind(this, true)} className={style['demand-list-head']} style={!set ? headStyle.setHead : {}}>
                        <span style={headStyle.icon} className={'iconfont'}>&#xe7f6;</span>{headName.hed1}
                    </li>
                    <li onClick={this.changeList.bind(this, false)} className={style['demand-list-head']} style={set ? headStyle.setHead : {}}>
                        <span style={headStyle.icon} className={'iconfont'}>&#xe638;</span>{headName.hed2}
                        {
                            this.state.nueD > 0 ? <span style={headStyle.tip}>{this.state.nueD > 99 ? "99+" : this.state.nueD}</span> :''
                        }
                    </li>
                </ul>
                {set
                    ? <div className={style['match-box']}>
                        <div className={style['match-num']}>
                            为您找到<span style={{ color: "#4077fc", fontWeight: 'bold' }}>{this.state.num}</span>需求对象
                        </div>
                        <ul className={style['match-box']}>
                            <li>
                                <Checkbox checked={this.state.mac} onChange={this.andIMatching.bind(this, 0)} className='cover-ant-checkbox-wrapper'>与我匹配的</Checkbox>
                            </li>
                            <li>
                                <Checkbox checked={this.state.res} onChange={this.andIMatching.bind(this, 1)} className='cover-ant-checkbox-wrapper'>响应过的需求</Checkbox>
                            </li>
                        </ul>
                    </div>
                    : <div className={style['match-box']}>
                        <div className={style['match-num']}>
                            已发布<span style={{ color: "#4077fc", fontWeight: 'bold' }}>{this.state.num}</span>需求对象
                        </div>
                    </div>
                }
                <div className={`box-show ${style['demand-screen-box']}`} style={{ boxShadow: `0px 9px 14px 0px rgba(143, 143, 143, 0.21)` }}>
                    <div>
                        <DemandSearch searchStyle={searchStyle} resSearchData={this.resSearchData.bind(this)} />
                    </div>
                    {
                        this.state.set && (<div>
                            <div onClick={this.screenClickFn.bind(this)} className={style['screen-toggle']}>
                                <span className={'iconfont'}>&#xe6a7;</span>筛选
                            </div>
                            {
                                this.state.showScreenBtn && <ScreenBtn closeScreenBtn={(data) => this.closeScreenBtnFn(data)} />
                            }
                        </div>)
                    }
                </div>
                {demo}
            </div>
        )
    }
}

let headStyle = {
    setHead: {
        backgroundColor: "#203b7e",
        color: "white"
    },
    icon: {
        fontSize: "2.6rem",
        fontWeight: "normal"
    },
    tip:{
        width: "16px",
        height: "16px",
        lineHeight: "16px",
        position: "absolute",
        zIndex:10,
        right:"11px",
        top:"20px",
        borderRadius:"50%",
        background:"red",
        color:"white",
        fontSize:"1.2rem"
    }
};