import React, { Component } from 'react';
import { Menu, Dropdown, Pagination, Spin } from 'antd';
import Axios from "./../../../utils/axiosInterceptors";
import emitter from "../../../utils/events";
import {store} from '../../../store/index'
import styles from '../../../static/css/userCenter/myRelease/myRelease.scss'
import ArrangeType from "../../../components/arrangeType/arrangeType";

export default class MyRelease extends Component{
    constructor(props){
        super(props);
        this.state = {
            spinShow: true,  // 加载中是否展示
            chatListData: null,  // 聊天列表数据
            demandtypeStr: '需求类型',  // 需求类型
            demandprogressStr: '状态',  // 状态
            listData: [],   // 获取的列表数据
            numPrePage: '',  // 单页条数
            totalCount: '',  // 总条数
            typeMenu: [],  // 显示的需求类型
            airlineType: [  // 航司需求类型
                {key: '-2', value: '需求类型'},
                {key: '1', value: '运力投放'},
                {key: '4', value: '运力委托'},
            ],
            airportType: [  // 机场需求类型
                {key: '-2', value: '需求类型'},
                {key: '0', value: '航线需求'},
                {key: '3', value: '航线委托'},
                {key: '2', value: '运营托管'}
            ],
            // TODO: 状态（7种）
            progressMenu: [],  // 显示的状态
            airportProgress: [  // 机场所有状态
                {key: '1', index: '-2', value: '状态'},
                {key: '2', index: '-1', value: '待支付'},
                {key: '3', index: '0', value: '需求发布'},
                {key: '4', index: '1', value: '意向征集'},
                {key: '5', index: '2', value: '订单确认'},
                {key: '6', index: '4', value: '订单完成'},
                {key: '7', index: '5', value: '佣金支付'},
                {key: '8', index: '6', value: '交易完成'},
                {key: '9', index: '3', value: '关闭'},
                {key: '10', index: '9', value: '处理中'},
                // {key: '11', index: '6', value: '已完成'},
                {key: '12', index: '7', value: '待处理'},
                {key: '13', index: '9', value: '测评中'},
                {key: '14', index: '8', value: '已接受'},
                {key: '15', index: '10', value: '已拒绝'},
                {key: '17', index: '12', value: '审核中'},
            ],
            airportProgress1: [  // 机场-航线需求对应的状态
                {key: '-2', value: '状态'},
                {key: '-1', value: '待支付'},
                {key: '0', value: '需求发布'},
                {key: '1', value: '意向征集'},
                {key: '2', value: '订单确认'},
                {key: '4', value: '订单完成'},
                {key: '5', value: '佣金支付'},
                {key: '6', value: '交易完成'},
                {key: '3', value: '关闭'},
                {key: '12', value: '审核中'},
            ],
            airportProgress2: [  // 机场-委托航线需求对应的状态
                {key: '-2', value: '状态'},
                {key: '7', value: '待处理'},
                {key: '9', value: '处理中'},
                {key: '10', value: '已拒绝'},
                {key: '6', value: '交易完成'},
                {key: '3', value: '关闭'},
            ],
            airportProgress3: [  // 机场-运营托管对应的状态
                {key: '-2', value: '状态'},
                {key: '7', value: '待处理'},
                {key: '9', value: '测评中'},
                {key: '8', value: '已接受'},
                {key: '10', value: '已拒绝'},
                {key: '3', value: '关闭'},
            ],

            airlineProgress: [  // 航司所有状态
                {key: '1', index: '-2', value: '状态'},
                {key: '2', index: '0', value: '需求发布'},
                {key: '3', index: '1', value: '意向征集'},
                {key: '4', index: '2', value: '订单确认'},
                {key: '5', index: '6', value: '交易完成'},
                {key: '6', index: '3', value: '关闭'},
                {key: '7', index: '7', value: '待处理'},
                {key: '8', index: '9', value: '处理中'},
                {key: '9', index: '10', value: '已拒绝'},
                // {key: '10', index: '6', value: '已完成'},
                {key: '12', index: '12', value: '审核中'},
            ],
            airlineProgress1: [  // 航司-运力需求所有状态
                {key: '-2', value: '状态'},
                {key: '0', value: '需求发布'},
                {key: '1', value: '意向征集'},
                {key: '2', value: '订单确认'},
                {key: '6', value: '交易完成'},
                {key: '3', value: '关闭'},
                {key: '12', value: '审核中'},
            ],
            airlineProgress2: [  // 航司-运力委托所有状态
                {key: '-2', value: '状态'},
                {key: '7', value: '待处理'},
                {key: '9', value: '处理中'},
                {key: '10', value: '已拒绝'},
                {key: '6', value: '交易完成'},
                {key: '3', value: '关闭'},
            ],

            //TODO: Ajax传递的参数
            demandType: '',  // 查询需求类型 可以不传 默认空字符串
            demandprogress: '',  // 状态类型 可以不传 默认空字符串
            page: 1,    // 页码 必须传 默认1
            orderType: 0,  // 发布时间排序类型 0-倒序 1-正序
            pageCount: '',  // 总页数
        }
    }

    orderTypeClickFn() {  // 点击发布时间
        this.state.orderType = this.state.orderType === 0 ? 1 : 0;
        this.state.page = 1;
        this.reqData();
    }
    progressMenuFn(key) {
        if(key == '1') {  // 运力投放
            this.setState((prev) => {
                return {progressMenu: prev.airlineProgress1}
            })
        }else if(key == '4') {  // 运力委托
            this.setState((prev) => {
                return {progressMenu: prev.airlineProgress2}
            })
        }else if(key == '0') {  // 航线需求
            this.setState((prev) => {
                return {progressMenu: prev.airportProgress1}
            })
        }else if(key == '3') {  // 航线委托
            this.setState((prev) => {
                return {progressMenu: prev.airportProgress2}
            })
        }else if(key == '2') {  // 运营托管
            this.setState((prev) => {
                return {progressMenu: prev.airportProgress3}
            })
        }else {
            if(store.getState().role.role == 1) {  // 机场
                this.setState((prev) => {
                    return {progressMenu: prev.airportProgress}
                })
            }else {  // 航司
                this.setState((prev) => {
                    return {progressMenu: prev.airlineProgress}
                })
            }
        }
    }
    demandTypeClickFn({key}) {  // 点击需求类型
        this.state.typeMenu.forEach((val) => {
            if(val.key == key) {
                this.setState({
                    demandtypeStr: val.value,
                    page: 1,
                })
            }
        });
        if(key == '-2') {  // 需求类型
            this.state.demandType = '';
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
        }else {
            this.state.demandType = key;  // 查询需求类型 可以不传 默认空字符串
            this.progressMenuFn(key);
        }
        this.reqData();
    }
    demandProgressClickFn({key}) {  // 点击状态
        let demandprogress = '', demandprogressStr = '状态';
        this.state.progressMenu.forEach((val) => {
            if(val.key == key) {
                demandprogressStr = val.value;
            }
        });
        if(this.state.demandType === '') {  // 需求类型为“”时，数组中有index
            this.state.progressMenu.forEach((val) => {
                if(val.key == key) {
                    if(key == 1) {
                        demandprogress = '';
                    }else {
                        demandprogress = val.index;
                    }
                }
            })
        }else {
            if(key == '-2') {
                demandprogress = '';
            }else {
                demandprogress = key;
            }
        }
        this.setState({
            demandprogress,
            demandprogressStr,
            page: 1,
        }, ()=>{
            this.reqData();
        })
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
            tabType: 'mine'
        };
        emitter.emit('openFrom', obj);
    }
    onChange(pageNumber) {  // 分页点击事件
        this.state.page = pageNumber;
        this.reqData();
    }
    talkShowFn(item) {  // 列表中的交谈按钮是否显示
        if(store.getState().role.role == '1'){  // 1：机场   0:已缴纳,1:未缴纳
            if(item.wetherResponse == false
                || item.intentionMoneyState == 1
                || item.demandprogress == '订单完成'
                || item.demandprogress == '交易完成'
                || item.demandprogress == '佣金支付'
                || item.demandprogress == '关闭' ){  // 订单完成、交易完成、佣金支付、关闭 不能聊天
                return false
            }else {
                return true
            }
        }else{  // 0：航司
            if(item.wetherResponse == false
                || item.demandprogress == '订单完成'
                || item.demandprogress == '交易完成'
                || item.demandprogress == '佣金支付'
                || item.demandprogress == '关闭'){
                return false
            }else {
                return true
            }
        }
    }
    initData() {  // 判断需求类型、状态显示的内容
        let typeMenu, progressMenu;
        if(Number(store.getState().role.role) === 0) {  // 0: 航司，1: 机场
            typeMenu = this.state.airlineType;
            this.progressMenuFn(this.state.demandType);
        }else if(Number(store.getState().role.role) === 1) {
            typeMenu = this.state.airportType;
            this.progressMenuFn(this.state.demandType);
        }
        this.setState({
            typeMenu: typeMenu,
        })
        if(this.props.type !== '') {
            typeMenu.forEach((val)=>{
                if(val.key == this.props.type) {
                    this.setState({
                        demandtypeStr: val.value,
                        demandType: this.props.type,
                    }, ()=>{
                        this.reqData()
                    })
                }
            })
        }else {
            this.reqData()
        }
    }
    /*onclick(item, {key}) {  //{item, key, keyPath}
        let v = item.responseEmployees[key];
        this.talkMenuClickFn(item, v);
    }
    talkMenuClickFn(item, v) {  // 点击交谈对象
        let chatObj = {};
        chatObj.fromNameId = store.getState().role.id;
        chatObj.responsePlanId = item.id;
        chatObj.toNameId = v.id;
        emitter.emit('openChat', chatObj);
    }*/
    reqData() {  // Ajax请求,获取数据并绑定
        this.setState({
            spinShow: true,
        }, ()=>{
            Axios({
                method: 'post',
                url: '/getTheReleaseDemandOfMine',
                params:{  // 一起发送的URL参数
                    demandType: this.state.demandType,  // 查询需求类型 可以不传 默认空字符串
                    demandprogress: this.state.demandprogress,  // 状态类型 可以不传 默认空字符串
                    page: this.state.page,    // 页码 必须传 默认1
                    orderType: this.state.orderType,  // 发布时间排序类型 0-倒序 1-正序
                    pageNo: 7,
                },
                // data: JSON.stringify(demand),
                dataType:'json',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then((response)=>{
                if(Number(response.data.opResult) === 0) {
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
            })
        })
    }
    chatClickFn(val, { key }) {  // 点击列表
        let chatObj = {};
        chatObj.fromNameId = store.getState().role.id;
        chatObj.responsePlanId = this.state.chatListData[key].id;
        chatObj.toNameId = this.state.chatListData[key].employee_id;
        emitter.emit('openChat', chatObj);
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
                    isMyRelease: 1,
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
    componentWillMount(){  // 将要渲染

    }
    componentDidMount() {   // 加载渲染完成
        try {
            this.initData();
            this.renewWodefabu = emitter.addEventListener('renewWodefabu', ()=>{
                this.initData();
            })
        } catch (e) {

        }
    }
    componentWillReceiveProps(nextProps){  // Props发生改变

    }
    componentWillUnmount(){  // 卸载组件
        emitter.removeEventListener(this.renewWodefabu);
        this.closeFormBox();
    }
    render(){
        let that = this;
        // 0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托
        const demandTypeMenu = (  // 需求类型
            <Menu onClick={this.demandTypeClickFn.bind(this)}>
                {
                    this.state.typeMenu.map((v) => {
                        return (
                            <Menu.Item key={v.key}>{v.value}</Menu.Item>
                        )
                    })
                }
            </Menu>
        );
        const demandprogressMenu =(  // 状态
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
        /*function talkMenu (item) {
            return (
                <Menu className={'scroll'}
                      style={{maxHeight: '300px', overflowY: 'scroll'}} onClick={that.onclick.bind(that, item)} >
                    {
                        item.responseEmployees.map((v, i) => {
                            return (
                                <Menu.Item key={i}>{v.nickName}</Menu.Item>
                            )
                        })
                    }
                </Menu>
            )
        }*/
        let item = <div>
            {
                this.state.listData.map((val, index) => {
                    return (
                        <div className={`${styles['item']} ${styles['row']}`} key={index} style={{cursor: 'pointer'}} onClick={this.showFormBoxClickFn.bind(this, val)}>
                            <div>{val.releasetime}</div>
                            <div>{val.demandtypeStr}</div>
                            <div className={styles['a-tag']} >{val.title}</div>
                            <div>
                                {val.demandprogress}
                                <span onClick={(e)=>{e.stopPropagation()}}>
                                    {
                                        this.talkShowFn(val) && (<Dropdown overlay={chatMenu(val)} trigger={['click']}>
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
        if(this.state.orderType==0){
            arrangeType=false
        }else {
            arrangeType=true
        };
        return(
            <div style={{fontSize: '1.2rem'}}>
                <div className={`${styles['top']} ${styles['row']}`}>
                    <div>
                        <ArrangeType style={{margin: '0'}} arrangeType={arrangeType} title={'发布时间'} arrangeTypeEvent={(data)=>this.orderTypeClickFn(data)}/>
                    </div>
                    <div>
                        <Dropdown overlay={demandTypeMenu} trigger={['click']}>
                            <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                                <div>{this.state.demandtypeStr}</div>
                                <span className={'iconfont'} style={{fontSize: '1.8rem'}}>&#xe605;</span>
                            </div>
                        </Dropdown>
                    </div>
                    <div>发布标题</div>
                    <div>
                        <Dropdown overlay={demandprogressMenu} trigger={['click']}>
                            <div className={styles['demand-progress']}>{this.state.demandprogressStr}
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