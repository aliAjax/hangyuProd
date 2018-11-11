import React, { Component } from 'react';
import { Menu, Dropdown, Pagination, Spin } from 'antd';
import Axios from "./../../../utils/axiosInterceptors";
import emitter from "../../../utils/events";
import {store} from '../../../store/index'
import styles from '../../../static/css/userCenter/myCollection/myCollection.scss'
import ArrangeType from "../../../components/arrangeType/arrangeType";

export default class MyRelease extends Component{
    constructor(props){
        super(props);
        this.state = {
            spinShow: true,  // 加载中是否展示
            chatListData: null,  // 聊天列表数据
            showTalkBtn: true,  // 聊天按钮是否显示
            demandProgressStr: '状态',  // 状态
            listData: [],   // 获取的列表数据
            numPrePage: '',  // 单页条数
            totalCount: '',  // 总条数
            // TODO: 状态（7种）
            progressMenu: [],  // 显示的状态
            airportProgress: [  // 机场状态
                {key: '1', index: '-2', value: '状态'},
                {key: '3', index: '0', value: '需求发布'},
                {key: '4', index: '1', value: '意向征集'},
                {key: '5', index: '2', value: '订单确认'},
                {key: '6', index: '4', value: '订单完成'},
                {key: '7', index: '5', value: '佣金支付'},
                {key: '8', index: '6', value: '交易完成'},
                {key: '9', index: '3', value: '关闭'},
            ],
            airlineProgress: [  // 航司状态
                {key: '1', index: '-2', value: '状态'},
                {key: '2', index: '0', value: '需求发布'},
                {key: '3', index: '1', value: '意向征集'},
                {key: '4', index: '2', value: '订单确认'},
                {key: '5', index: '4', value: '交易完成'},
                {key: '6', index: '3', value: '关闭'},
            ],
            //TODO: Ajax传递的参数
            demandType: '',  // 查询需求类型 可以不传 默认空字符串
            demandProgress: '',  // 状态类型 可以不传 默认空字符串
            page: 1,    // 页码 必须传 默认1
            pageNo: 7,  // 页大小，首次传，建议传7
            pageCount: '',  // 总页数
            releaseTime: 'Desc',  // 时间排序 两个值”Desc”:降序，”Asc”:升序，不传为降序
        }
    }

    releaseTimeClickFn() {  // 点击发布时间
        this.state.releaseTime = this.state.releaseTime === 'Desc' ? 'Asc' : 'Desc';  // 时间排序 两个值”Desc”:降序，”Asc”:升序，不传为降序
        this.state.page = 1;
        this.reqData();
    }
    demandProgressClickFn({key}) {  // 点击状态
        this.state.progressMenu.forEach((val) => {
            if(val.key == key) {
                if(key == 1) {
                    this.state.demandProgress = '';
                }else {
                    this.state.demandProgress = val.index;
                }
                this.setState({
                    demandProgressStr: val.value,
                    page: 1,
                }, ()=>{
                    this.reqData();
                })
            }
        });
    }

    closeFormBox() {  // 关闭formBox
        let obj = {};
        obj.openFrom = false;
        obj.fromType = '';
        obj.fromMe = '';
        emitter.emit('openFrom', obj);
    }

    showFormBoxClickFn(val) {  // 显示formBox详情
        let id = val.id;
        let obj = {};
        let transmit = {};
        transmit.id = id;
        obj.openFrom = true;
        obj.fromType = 3;
        obj.fromMes = {
            transmit: transmit,
        };
        emitter.emit('openFrom', obj);
    }
    onChange(pageNumber) {  // 分页点击事件
        this.state.page = pageNumber;
        this.reqData();
    }
    initData() {  // 判断需求类型、状态显示的内容
        if(Number(store.getState().role.role) === 0) {  // 0: 航司，1: 机场
            this.setState((prev) => {
                return {
                    progressMenu: prev.airlineProgress
                }
            })
        }else if(Number(store.getState().role.role) === 1) {
            this.setState((prev) => {
                return {
                    progressMenu: prev.airportProgress
                }
            })
        }
    }
    getChatData(val) {
        this.setState({
            chatListData: null,
        },()=>{
            Axios({
                method: 'post',
                url: '/getPlanListOfMyCollect',
                params:{  // 一起发送的URL参数
                    id: val.id,
                    isMyRelease: 0,
                },
                // data: JSON.stringify(demand),
                dataType:'json',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then((response)=>{
                if(Number(response.data.opResult) === 0 && response.data.list != null && response.data.list.length != '') {
                    this.setState({
                        chatListData: response.data.list
                    })
                }else {
                    this.setState({
                        chatListData: null,
                    })
                }
            })
        });
    }
    chatClickFn(val, { key }) {  // 点击列表
        let chatObj = {};
        chatObj.fromNameId = store.getState().role.id;
        chatObj.responsePlanId = this.state.chatListData[key].id;
        chatObj.toNameId = val.demandEmployeeId;
        emitter.emit('openChat', chatObj);
    }
    reqData() {  // Ajax请求, 刷新数据
        this.setState({
            spinShow: true,
        }, ()=>{
            Axios({
                method: 'post',
                url: '/selectCollectList',
                params:{  // 一起发送的URL参数
                    demandType: this.state.demandType,  // 查询需求类型 可以不传 默认空字符串
                    demandProgress: this.state.demandProgress,  // 状态类型 可以不传 默认空字符串
                    page: this.state.page,    // 页码 必须传 默认1
                    pageNo: 7,  // 页大小，默认7条
                    releaseTime: this.state.releaseTime,  // 发布时间排序类型 0-倒序 1-正序
                },
                // data: JSON.stringify(demand),
                dataType:'json',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then((response)=>{
                if(Number(response.data.opResult) === 0) {
                    if(response.data.list.list) {
                        this.setState({
                            listData: response.data.list.list,
                            numPrePage: response.data.list.numPrePage,  // 单页条数
                            totalCount: response.data.list.totalCount,  // 总条数
                            pageCount: response.data.list.pageCount,  // 总页数
                            spinShow: false,
                        })
                    }else {
                        this.setState({
                            listData: [],
                            spinShow: false,
                        })
                    }
                }else {
                    this.setState({
                        listData: [],
                        spinShow: false,
                    })
                }
            })
        })
    }
    talkShowFn(val) {
        if(val.wetherResponse
            && val.demandProgress != 4
            && val.demandProgress != 6
            && val.demandProgress != 5
            && val.demandProgress != 3) { // 订单完成、交易完成、佣金支付、关闭 不能聊天
            return true;
        }else {
            return false;
        }
    }
    componentDidMount() {   // 加载渲染完成
        this.initData();
        this.reqData();
        this.renewData = emitter.addEventListener('renewDataFn', (i)=>{
            this.reqData();
        })
    }
    componentWillUnmount() {
        emitter.removeEventListener(this.reqData);
        this.closeFormBox();
    }
    render(){
        // 0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托
        const demandProgressMenu =(  // 状态
            <Menu className={'scroll'}
                  style={{maxHeight: '300px', overflowY: 'scroll'}}
                  onClick={this.demandProgressClickFn.bind(this)}>
                {
                    this.state.progressMenu.map((v) => {
                        return (
                            <Menu.Item key={v.key}>{v.value}</Menu.Item>
                        )
                    })
                }
            </Menu>
        );
        function transition(n) {
            switch (n){
                case "0":
                    return "需求发布";
                    break;
                case "1":
                    return "意向征集";
                    break;
                case "2":
                    return "订单确认";
                    break;
                case "3":
                    return "关闭";
                    break;
                case "4":
                    if(Number(store.getState().role.role) === 1) {
                        return "订单完成";
                    }else if(Number(store.getState().role.role) === 0) {
                        return "交易完成";
                    }
                    break;
                case "5":
                    return "佣金支付";
                    break;
                case "6":
                    return "交易完成";
                    break;
            }
        }
        let that = this;
        function chatMenu(val) {
            return (  // 聊天列表
                <Menu className={'scroll'}
                      style={{maxHeight: '300px', overflowY: 'scroll'}}
                      onClick={that.chatClickFn.bind(that, val)}>
                    {
                        (that.state.chatListData && that.state.chatListData.length != 0) && that.state.chatListData.map((v, index) => {
                            return (
                                <Menu.Item key={index}>{v.route}</Menu.Item>
                            )
                        })
                    }
                </Menu>
            )
        };
        let item = <div>
            {
                this.state.listData.map((val, index) => {
                    return (
                        <div className={`${styles['item']} ${styles['row']}`} key={index} style={{cursor: 'pointer'}} onClick={this.showFormBoxClickFn.bind(this, val)}>
                            <div>{val.releaseTime}</div>
                            <div className={styles['a-tag']} >{val.title}</div>
                            <div>
                                {transition(val.demandProgress)}
                                <span onClick={(e)=>{e.stopPropagation()}}>
                                    {
                                        this.talkShowFn(val)
                                        && (<Dropdown overlay={chatMenu(val)} trigger={['click']}>
                                            <div className={styles['demand-progress']}>
                                                <span className={'iconfont'}
                                                      style={{fontSize: '2.4rem', cursor: 'pointer'}}
                                                      onClick={this.getChatData.bind(this, val)}>&#xe602;</span>
                                            </div>
                                        </Dropdown>)
                                    }
                                </span>
                            </div>
                            <div>
                                查看详情
                                <span className={'iconfont'} style={{height: '20px', color: '#597EC2'}}>&#xe686;</span>
                            </div>
                        </div>
                    )
                })
            }
            {
                this.state.pageCount > 1 && <div className={styles['page']}>
                    <Pagination showQuickJumper
                                defaultPageSize={this.state.numPrePage}
                                defaultCurrent={1}
                                current={this.state.page}
                                total={this.state.totalCount} onChange={this.onChange.bind(this)} />
                </div>
            }
        </div>;
        const noData = <div style={{marginTop: '183px', padding: '0 40px', fontSize: '2.4rem', color: '#939298', textAlign: 'center'}}>暂无数据</div>;
        let arrangeType;
        if(this.state.releaseTime == 'Desc'){
            arrangeType=false
        }else {
            arrangeType=true
        };
        return(
            <div style={{fontSize: '1.2rem'}}>
                <div className={`${styles['top']} ${styles['row']}`}>
                    <div>
                        <ArrangeType style={{margin: '0'}} arrangeType={arrangeType} title={'发布时间'} arrangeTypeEvent={(data)=>this.releaseTimeClickFn(data)}/>
                    </div>
                    <div>发布标题</div>
                    <div>
                        <Dropdown overlay={demandProgressMenu} trigger={['click']}>
                            <div className={styles['demand-progress']}>{this.state.demandProgressStr}
                                <span className={'iconfont'} style={{fontSize: '1.8rem'}}>&#xe605;</span>
                            </div>
                        </Dropdown>
                    </div>
                </div>
                <div className={styles['items']} style={{fontSize: '1.4rem'}}>
                    {
                        this.state.spinShow && <Spin size="large" style={{width: '100%', zIndex: 100}} />
                    }
                    {
                        !this.state.spinShow && ((this.state.listData == null || this.state.listData.length == 0) ? noData : item)
                    }
                </div>
            </div>
        )
    }
}