
import React, { Component, Fragment } from 'react';
import { store } from './../../store/index';
import Axios from "./../../utils/axiosInterceptors";

import { Menu, Dropdown, Spin } from 'antd';
import classNames from 'classnames';

import style from './../../static/css/demandList/roleDemand.scss';
import RoleDemandItem from '../../components/roleDemand/roleDemandItem';
import emitter from "../../utils/events";
import { changeConfirmLocale } from 'antd/lib/modal/locale';
import { relative } from 'upath';

export default class RoleDemand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,//默认第一页
            pageCount: 0,
            code: "",
            data: [],
            queryNum: props.queryNum,//市场需求条数
            time: 1,
            tip: false,//提示信息
            roleDemandLoading: true,//加载动画
            orderType: 0,//排序类型
            nued: 0,//我的需求条数
            cancel: () => { },
            validDemandCount: 0,  // 有效条数
        }
    }
    componentWillMount() {  // 将要渲染
        this.initData();
    }
    componentWillReceiveProps(data) {
        let code = "";
        if (data.searchMes !== '') {
            if (data.searchMes.code === this.state.code) {
                return;
            }
            code = data.searchMes.code;
        } else {
            if (this.state.code === "") {
                return;
            }
        }
        console.log(code)
        this.setState({
            page: 1,
            code,
            data: [],
        }, () => {
            this.initData();
        });
    }
    componentWillUnmount() {
        this.state.cancel()
    }
    showLoading = () => {
        this.setState(() => {
            return {
                roleDemandLoading: true,
            }
        })
    }
    hideLoading = () => {
        this.setState(() => {
            return {
                roleDemandLoading: false,
            }
        })
    }
    hideTip = () => {
        this.setState(() => {
            return {
                tip: false,
            }
        })
    }
    initData() {
        this.state.cancel()
        this.hideTip();
        this.showLoading();
        if (store.getState().role.airlineretrievalcondition) {
            let { page = 1, orderType = 0, code:itia } = this.state;

            let CancelToken = Axios.CancelToken;
            let c;
            let _this = this;

            Axios({
                method: 'post',
                url: 'getDemandsByCurrentCheckedAirportForEmployee',
                params: {
                    page,//页码
                    itia,//三字码
                    orderType,
                },
                cancelToken: new CancelToken(function (cancel) {
                    c = cancel
                    _this.setState(() => {
                        return {
                            cancel,
                        }
                    })
                })
            }).then((response) => {

                this.hideLoading();

                if (response.data.opResult === '0') {
                    let { page = 1, data = [] } = this.state;

                    let mydemandList = response.data.list;//包含列表数据,以及其他数据

                    let { list = [], numPrePage = 0, pageCount = 1, pageNo = 1, totalCount = 1, unReadMessageTotalCount = 0 } = mydemandList || {}

                    list = list&&list.length ? list : [];

                    //TODO:还是有些问题

                    this.setState(() => ({
                        tip: list && list.length ? false : true,
                        pageCount,
                        validDemandCount: Number(mydemandList.validDemandCount),
                        data: page === 1 ? list : [...data, ...list]
                    }), () => {
                        this.props.queryNum(this.state.data.length ? this.state.data.length : 0);
                        this.props.queryMes(0);//this.state.nued //暂时注释功能待定
                    });

                } else {
                    this.props.queryNum(0);
                    this.props.queryMes(0);
                }
                this.setState(() => {
                    return {
                        cancel: c,
                    }
                })
            }).catch((error) => {
                console.log(error)
            })
        }
    }
    orderTypeChange = () => {
        let { orderType, cancel } = this.state;
        this.setState(() => {
            return {
                data: [],
                orderType: orderType ? 0 : 1,
            }
        }, () => {
            cancel()
            this.initData();
        })
    }
    itemMsg = (index) => {
        // console.log(index)
        let { data } = this.state;
        data[index].unreadMessageCount = 0;
        this.setState(() => {
            return {
                data
            }
        })
    }
    createItem = () => {
        let data = this.state.data;
        let msgCount = 0;
        if (data && data.length) {
            let items = data.map((value, index) => {
                value.unreadMessageCount > 0 ? msgCount++ : msgCount;

                return <RoleDemandItem key={index} demandInfo={value} itemMsg={this.itemMsg} index={index} />
            });
            this.state.nued = msgCount;
            return items;
        } else {
            return '';
        }
    }
    scroll(e) {
        return
        // if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
        //     if (this.state.page < this.state.pageCount) {
        //         this.setState({
        //             page: this.state.page + 1
        //         }, () => {
        //             this.initData();
        //         });
        //     }
        // }
    }
    jichangPublish() {  // 流程提示-机场-发布
        let fromData = {
            openFrom:true,
            fromType:store.getState().role.role == '1' ? 0 : 1,
            fromMes: {
                transmit: {
                    bianjiAgain: false,
                }
            }
        };
        emitter.emit('openFrom',fromData)
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    运力投放
                </Menu.Item>
                <Menu.Item key="1">
                    运力委托
                </Menu.Item>
                <Menu.Item key="3">全部需求</Menu.Item>
            </Menu>
        );
        return (
            <div className={style['roleDemand']} ref="">
                {/* <div className={style['demand-filter']} style={{display:'none'}}>
                    <div className={style['filter-item']}>
                        <span>发布时间</span>
                        <span>
                            <span className={'iconfont'}>&#xe605;</span>
                            <span className={'iconfont'}>&#xe605;</span>
                        </span>
                    </div>
                    <div className={style['filter-item']}>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span>全部需求</span>
                                <span className={'iconfont'} style={{ fontSize: '18px' }}>&#xe605;</span>
                            </div>
                        </Dropdown>
                    </div>
                    <div className={style['filter-item']}>
                        发布标题
                    </div>
                    <div className={style['filter-item']}>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span>状态</span>
                                <span className={'iconfont'} style={{ fontSize: '18px' }}>&#xe605;</span>
                            </div>
                        </Dropdown>
                    </div>
                </div> */}
                <div className={style['demand-content']}>
                    <div className={`${style['demand-list']} scroll`} onScroll={this.scroll.bind(this)}>
                        <div className={style['demand-filtrate']}>
                            <div className={style['filtrate-con']}>
                                <div className={classNames({ [style['active']]: !this.state.orderType })} onClick={this.orderTypeChange}>按时间排序</div>
                                <div className={classNames({ [style['active']]: this.state.orderType })} onClick={this.orderTypeChange}>按状态排序</div>
                            </div>
                        </div>
                        {
                            this.state.code ? <Fragment>
                                <div className={style['roleDemand-tip']} style={this.state.tip ? {} : { display: 'none' }}>
                                    您在
                                    {store.getState().role.role == 1 ? '本航点是否有航线还未开通？' : '此航点有运力还未消化？'}
                                    赶紧
                                    <a onClick={this.jichangPublish.bind(this)}>发布</a>
                                    一条吧！
                                </div>
                                {
                                    (this.state.data !== null && this.state.data.length !== 0 && this.state.validDemandCount === 0)
                                    && <div className={style['roleDemand-tip']}>
                                        太棒了！
                                        {store.getState().role.role == 1 ? '本航点航线需求' : '当前航点运力信息'}
                                        都已处理完毕，赶紧
                                        <a onClick={this.jichangPublish.bind(this)}>发布</a>
                                        一条新的
                                        {store.getState().role.role == 1 ? '航线需求' : '运力信息'}
                                        吧！
                                    </div>
                                }
                            </Fragment> : <Fragment>
                                <div className={style['roleDemand-tip']} style={this.state.tip ? {} : { display: 'none' }}>
                                    您是否有
                                    {store.getState().role.role == 1 ? '航线还未开通？' : '运力还未消化？'}
                                    赶紧
                                    <a onClick={this.jichangPublish.bind(this)}>发布</a>
                                    一条吧！
                                </div>
                                {
                                    (this.state.data !== null && this.state.data.length !== 0 && this.state.validDemandCount === 0)
                                    && <div className={style['roleDemand-tip']}>
                                        太棒了！您所有
                                        {store.getState().role.role == 1 ? '航线需求' : '运力信息'}
                                        都已处理完毕，赶紧
                                        <a onClick={this.jichangPublish.bind(this)}>发布</a>
                                        一条新的
                                        {store.getState().role.role == 1 ? '航线需求' : '运力信息'}
                                        吧！
                                    </div>
                                }
                            </Fragment>
                        }
                        <div className={style['roleDemand-loading']} style={this.state.roleDemandLoading ? {} : { display: 'none' }}>
                            <Spin spinning={this.state.roleDemandLoading} />
                        </div>
                        <div className={style['roleDemand-body']}>
                            <div className={style['content']}>
                                {this.createItem()}
                            </div>
                        </div>
                    </div>
                    {/* <div className={style['load-data']}>加载数据</div> */}
                </div>
            </div >
        )
    }
}