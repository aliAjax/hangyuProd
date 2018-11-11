// author:wangli time:2018-05-09 content:个人中心-意向模块
import React, { Component, Fragment } from 'react';
import ArrangeType from "../../../components/arrangeType/arrangeType";
import { Pagination, Spin } from 'antd';
import Axios from "./../../../utils/axiosInterceptors";
import MyIntentionItem from "./myIntentionItem";
import { store } from "../../../store/index";
import { Menu, Dropdown, Icon, message } from 'antd';
import style from "../../../static/css/userCenter/myIntention/myIntention.scss";
import emitter from "../../../utils/events";

export default class MyIntention extends Component {
    constructor(props) {
        super(props);
        this.showDetails=this.showDetails.bind(this);
        this.state = {
            spinShow: true,//加载中
            currentNum: 1,//当前页数
            orderType: 0,//发布时间显示顺序,0时间逆序
            showDetailsType: false,//是否显示详情
            showId: "",//详情显示id
            page: 1,//请求的页数
            pageNo: 7,//每页显示条数
            totalCount: 0,//数据总数
            numPrePage: "",//返回的每条list包含数据条数
            responseProgress: "",//状态条件
            statusName: "状态",//状态显示名字
            paginationType: false,//有无数据的显示内容，true为有数据
            noDataType: false,
            role: "",//角色判断 0为航司，1为机场
            status: [
                { key: 8, name: "全部" },
                { key: -1, name: "待支付" },
                { key: 0, name: "意向征集" },
                { key: 1, name: "订单确认" },
                { key: 2, name: "已撤回" },
                { key: 3, name: "需求关闭" },
                { key: 4, name: "落选" },
                { key: 5, name: "交易完成" },
                { key: 6, name: "订单完成" },
                { key: 7, name: "佣金支付" }
            ],//状态筛选数据
            initData: [],
            showChatBoxList: [],//洽谈框是否显示数据框
            showChatData: [],//方案列表
        }
    }

    //发布时间排列顺序
    changeReleaseTimeType(data) {
        let orderType;
        if (data) {
            orderType = 1;
        } else {
            orderType = 0;
        };
        Axios({
            method: 'post',
            url: '/getResponseListOfMine',
            params: {
                responseProgress: this.state.responseProgress,
                page: 1,//页码 必须传 默认1
                pageNo: this.state.pageNo,
                orderType//发布时间排序类型 0-倒序 1-正序
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            if (response.data.opResult == 0) {
                let initData = response.data.list.list;
                let totalCount = parseInt(response.data.list.totalCount);
                let numPrePage = response.data.list.numPrePage;
                let showChatBoxList = [];
                for (let i = 0; i < initData.length; i++) {
                    showChatBoxList.push({
                        responseId: initData[i].id,
                        type: false
                    })
                };
                this.setState(() => ({
                    totalCount,
                    numPrePage,
                    showChatBoxList,
                    initData,
                    orderType,
                    page: 1
                }));
            } else {
                this.setState({
                    orderType
                });
            }
        });
    }

    //关闭详情页面
    closeDetails() {
        this.setState({
            showDetailsType: false
        })
        emitter.emit("openFrom", { openFrom: false })
    }

    //详情显示模块
    showDetails(id, type) {
        let openFrom, showDetailsType;
        if (id == this.state.showId) {
            openFrom = type;
            showDetailsType = type;
        } else {
            openFrom = true;
            showDetailsType = true;
        };
        let o = {
            openFrom:true,//点击同一个不关闭
            // openFrom,//关闭
            fromType: 3,
            fromMes: {
                transmit: {
                    id
                }
            }
        };
        emitter.emit('openFrom', o);
        this.setState({
            showDetailsType,
            showId: id
        });
    }

    //洽谈事件
    chatEvent(id) {
        let showChatBoxList = this.state.showChatBoxList;
        for (let i = 0; i < showChatBoxList.length; i++) {
            if (showChatBoxList[i].responseId == id) {
                showChatBoxList[i].type = !showChatBoxList[i].type;
            } else {
                showChatBoxList[i].type = false;
            }
        };
        Axios({
            method: 'post',
            url: '/getPlanListOfMine',
            params: {
                responseId: id
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            if (response.data.opResult == 0) {
                this.setState({
                    showChatData: response.data.list
                })
            } else {
                message.error("数据错误，请联系客服")
            }
        })
        this.setState({
            showChatBoxList
        });
    }
    //跳转分页
    choosePage(pageNumber) {
        let page = pageNumber;
        let orderType = this.state.orderType;
        console.log(page)
        Axios({
            method: 'post',
            url: '/getResponseListOfMine',
            params: {
                responseProgress: this.state.responseProgress,
                page,//页码 必须传 默认1
                pageNo: this.state.pageNo,
                orderType//发布时间排序类型 0-倒序 1-正序
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            if (response.data.opResult == 0) {
                let initData = response.data.list.list;
                let totalCount = parseInt(response.data.list.totalCount);
                let numPrePage = response.data.list.numPrePage;
                let showChatBoxList = [];
                for (let i = 0; i < initData.length; i++) {
                    showChatBoxList.push({
                        responseId: initData[i].id,
                        type: false
                    })
                };
                this.setState({
                    page,
                    initData,
                    totalCount,
                    numPrePage,
                    paginationType: true,
                    noDataType: false,
                    showChatBoxList
                });
            } else {
                this.setState({
                    page,
                    paginationType: false,
                    noDataType: true
                });
            }
        })
    }

    //状态筛选条件
    changeStatus(num) {
        let statusName = "全部";
        switch (num) {
            case "-1":
                statusName = "待支付";
                break;
            case "0":
                statusName = "意向征集";
                break;
            case "1":
                statusName = "订单确认";
                break;
            case "2":
                statusName = "已撤回";
                break;
            case "3":
                statusName = "需求关闭";
                break;
            case "4":
                statusName = "落选";
                break;
            case "5":
                statusName = "交易完成";
                break;
            case "6":
                statusName = "订单完成";
                break;
            case "7":
                statusName = "佣金支付";
                break;
            case "8":
                num = "";
                break;
            default:
                break;
        };
        Axios({
            method: 'post',
            url: '/getResponseListOfMine',
            params: {
                responseProgress: num,
                page: 1,//页码 必须传 默认1
                pageNo: this.state.pageNo,
                orderType: 0//发布时间排序类型 0-倒序 1-正序
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            if (response.data.opResult == 0) {
                let initData = response.data.list.list;
                let totalCount = parseInt(response.data.list.totalCount);
                let numPrePage = response.data.list.numPrePage;
                let showChatBoxList = [];
                for (let i = 0; i < initData.length; i++) {
                    showChatBoxList.push({
                        responseId: initData[i].id,
                        type: false
                    });
                };
                let paginationType = true;
                if (totalCount <= 7) {
                    paginationType = false;
                }
                this.setState({
                    initData,
                    totalCount,
                    numPrePage,
                    responseProgress: num,
                    statusName,
                    paginationType,
                    noDataType: false,
                    showChatBoxList,
                    page: 1
                })
            } else {
                this.setState(() => ({
                    initData: [],
                    totalCount: 0,
                    numPrePage: 1,
                    responseProgress: num,
                    statusName,
                    paginationType: false,
                    noDataType: true,
                    page: 1
                }))
            }
        })
    }

    componentWillMount() {  // 将要渲染
        //判断角色类型，0是航司，1是机场
        emitter.emit("openFrom", { openFrom: false, fromType: "" });
        let role = store.getState().role.role;
        let status = this.state.status;
        let page = this.state.page;
        let orderType = this.state.orderType;
        if (role == 0) {
            status.splice(8, 9);
            status.splice(1, 1)
        };
        Axios({
            method: 'post',
            url: '/getResponseListOfMine',
            params: {
                responseProgress: "",
                page,//页码 必须传 默认1
                orderType,//发布时间排序类型 0-倒序 1-正序
                pageNo: this.state.pageNo
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            if (response.data.opResult == 0) {
                let initData = response.data.list.list;
                let totalCount = parseInt(response.data.list.totalCount);
                let numPrePage = response.data.list.numPrePage;
                let showChatBoxList = [];
                for (let i = 0; i < initData.length; i++) {
                    showChatBoxList.push({
                        responseId: initData[i].id,
                        type: false
                    });
                };
                let paginationType = true;
                if (totalCount <= 7) {
                    paginationType = false;
                }
                this.setState(() => ({
                    initData,
                    totalCount,
                    numPrePage,
                    status,
                    paginationType,
                    noDataType: false,
                    showChatBoxList,
                    spinShow: false
                }));
            } else {
                let paginationType = false;
                this.setState(() => ({
                    paginationType,
                    noDataType: true,
                    spinShow: false
                }));
            }
        })
    }

    componentWillUnmount() {  // 卸载组件
        emitter.emit("openFrom", { openFrom: false, fromType: "" });
    }

    render() {
        let _this = this;
        let initData = this.state.initData;
        let title = "发布时间";//组件类型名称
        let arrangeType;
        if (this.state.orderType == 0) {
            arrangeType = false
        } else {
            arrangeType = true
        };
        //是否有数据样式判断
        let paginationType = this.state.paginationType;
        let paginationStyle = style['my-intention-page-false'];
        let paginationText = style['my-intention-text-false']
        if (paginationType) {
            paginationStyle = style['my-intention-page-true'];
        };
        if (this.state.noDataType) {
            paginationText = style['my-intention-text-true']
        };
        const onClick = function ({ key }) {
            _this.changeStatus(key)
        };
        //下拉选项
        const menu = (
            <Menu onClick={onClick}>
                {
                    this.state.status.map((item, key) => {
                        return <Menu.Item key={item.key}><span>{item.name}</span></Menu.Item>
                    })
                }
            </Menu>
        );
        return (
            <div style={{ fontSize: "1.2rem", position: "relative" }}>
                <div className={style['my-intention-nav']}>
                    <ArrangeType arrangeType={arrangeType} title={title} arrangeTypeEvent={(data) => this.changeReleaseTimeType(data)} />
                    <div className={style['my-intention-nav-demand']}>需求标题</div>
                    <div className={style['my-intention-nav-send']}>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <a className="ant-dropdown-link" href="#" style={{ textDecoration: "none" }}>
                                {this.state.statusName} <Icon type="caret-down" />
                            </a>
                        </Dropdown>
                    </div>
                </div>
                <div className={style['my-intention-content']}>
                    {
                        initData.map((item, index) => {
                            let text, icon;
                            switch (item.responseProgress) {
                                case "-1":
                                    text = "待支付"
                                    icon = "";
                                    break;
                                case "0":
                                    text = "意向征集";
                                    icon = "&#xe602;";
                                    break;
                                case "1":
                                    text = "订单确认";
                                    icon = "&#xe602;"
                                    break;
                                case "2":
                                    text = "已撤回";
                                    icon = "";
                                    break;
                                case "3":
                                case "-2":
                                    text = "需求关闭";
                                    icon = ""
                                    break;
                                case "4":
                                    text = "落选";
                                    icon = "";
                                    break;
                                case "5":
                                    text = "交易完成";
                                    icon = "";
                                    break;
                                case "6":
                                    text = "订单完成";
                                    icon = "";
                                    break;
                                case "7":
                                    text = "佣金支付";
                                    icon = "";
                                    break;
                                default:
                                    text = "暂无数据";
                                    icon = "";
                                    break;
                            }
                            return <MyIntentionItem data={item} showData={this.state.showChatData} chatBoxType={this.state.showChatBoxList[index].type} key={index} text={text} icon={icon} showDetailsType={this.state.showDetailsType} chatEvent={(id) => this.chatEvent(id)}
                                                    showDetailsEvent={(id,type) => this.showDetails(id,type)}
                                    />
                        })
                    }
                </div>
                <div className={paginationStyle}>
                    <Pagination showQuickJumper defaultPageSize={7} current={parseInt(this.state.page)} total={parseInt(this.state.totalCount)} onChange={this.choosePage.bind(this)} />
                </div>
                <div className={paginationText}>暂无数据</div>
                {this.state.spinShow ? <Spin size="large" style={{ width: '100%', zIndex: 100 }} /> : ""}
            </div>
        )
    }
}