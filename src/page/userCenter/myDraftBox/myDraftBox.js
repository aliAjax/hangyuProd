import React, { Component } from 'react';
import { Menu, Dropdown, Pagination, Spin } from 'antd';
import Axios from "./../../../utils/axiosInterceptors";
import emitter from "../../../utils/events";
import {store} from '../../../store/index'
import styles from '../../../static/css/userCenter/myDraftBox/myDraftBox.scss'
import ArrangeType from "../../../components/arrangeType/arrangeType";

export default class MyDraftBox extends Component{
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
        }else {
            this.state.demandType = key;  // 查询需求类型 可以不传 默认空字符串
        }
        this.reqData();
    }

    closeFormBox() {  // 关闭formBox
        let obj = {};
        obj.openFrom = false;
        obj.fromType = '';
        obj.fromMe = '';
        emitter.emit('openFrom', obj);
    }

    showFormBoxClickFn(val) {  // 显示formBox详情
        let obj = {};
        let transmit = {};
        transmit.demandId = val.id;
        transmit.caogaoxiang = true;
        obj.openFrom = true;
        if(store.getState().role.role == 1) {  // 1 机场  0 航司
            obj.fromType = 0;
        }else {
            obj.fromType = 1;
        }
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
        let typeMenu;
        if(Number(store.getState().role.role) === 0) {  // 0: 航司，1: 机场
            typeMenu = this.state.airlineType;
        }else if(Number(store.getState().role.role) === 1) {
            typeMenu = this.state.airportType;
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
    reqData() {  // Ajax请求,获取数据并绑定
        this.setState({
            spinShow: true,
        }, ()=>{
            Axios({
                method: 'post',
                url: '/getTheDraftsDemandOfMine',
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
    componentWillMount(){  // 将要渲染

    }
    componentDidMount() {   // 加载渲染完成
        this.initData();
        this.renewCaogaoxiang = emitter.addEventListener('renewCaogaoxiang', ()=>{
            this.initData();
        })
    }
    componentWillReceiveProps(nextProps){  // Props发生改变

    }
    componentWillUnmount(){  // 卸载组件
        emitter.removeEventListener(this.renewCaogaoxiang);
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
        let item = <div>
            {
                this.state.listData.map((val, index) => {
                    return (
                        <div className={`${styles['item']} ${styles['row']}`} key={index} style={{cursor: 'pointer'}} onClick={this.showFormBoxClickFn.bind(this, val)}>
                            <div>{val.releasetime}</div>
                            <div>{val.demandtypeStr}</div>
                            <div className={styles['a-tag']} >{val.title}</div>
                            <div>
                                查看详情
                                <span className={'iconfont'} style={{height: '20px', color: '#597EC2', fontSize: '1.4rem'}}>&#xe686;</span>
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
                        <ArrangeType style={{margin: '0'}} arrangeType={arrangeType} title={'保存时间'} arrangeTypeEvent={(data)=>this.orderTypeClickFn(data)}/>
                    </div>
                    <div>
                        <Dropdown overlay={demandTypeMenu} trigger={['click']}>
                            <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                                <div>{this.state.demandtypeStr}</div>
                                <span className={'iconfont'} style={{fontSize: '1.8rem'}}>&#xe605;</span>
                            </div>
                        </Dropdown>
                    </div>
                    <div>草稿标题</div>
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