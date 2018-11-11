// author:wangli time:2018-05-07 content:个人中心-订单模块
/* eslint-disable */
import React, { Component, Fragment } from 'react';
import ArrangeType from "../../../components/arrangeType/arrangeType";
import { Pagination, message, Menu, Dropdown, Icon, Button, Modal, Spin } from 'antd';
import { host as $host } from "./../../../utils/port";
import Axios from "./../../../utils/axiosInterceptors";
import MyOrderItem from "./myOrderItem";
import { store } from "../../../store/index";
import style from "../../../static/css/userCenter/myOrder/myOrder.scss";
import emitter from "../../../utils/events";

export default class MyIntention extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSpin: true,
            currentNum: 1,//当前页数
            releaseTime: "Desc",//发布时间显示顺序,Desc时间逆序,Asc为升序
            showDetailsType: false,//是否合同显示详情
            showFromType: false,//是否显示表单
            showId: "",//详情显示id
            page: 1,//请求的页数
            pageNo: 7,//页大小
            totalCount: 0,//数据总数
            numPrePage: "",//返回的每条list包含数据条数
            demandType: "",//查询条件类型 “0”:航线需求、”1”:运力需求、”3”:航线委托、”4”:运力委托
            demandProgress: "",//查询的条件订单状态 ”6”:订单完成、”7”:佣金支付、”5”:交易完成、”3”:关闭
            statusName: "状态",//状态显示名字
            demandName: "需求类型",//类型显示名字
            paginationType: false,//有暂无数据的显示内容，true为有数据
            noDataType: false,//暂无数据文案是否显示
            role: "",//角色判断 0为航司，1为机场
            demandTypeList: [],//需求列表
            tableType: false,//false 为经停
            status: [
                { key: 8, name: "全部" },
                { key: 3, name: "关闭" },
                { key: 5, name: "交易完成" },
                { key: 6, name: "订单完成" },
                { key: 7, name: "佣金支付" },
            ],//状态筛选数据
            initData: [],//item渲染初始数据]
            numText: "",//保证金提示
            downType: false,//是否支持下载 false为不能
            contractList: {//合同数据列表
                jichangName: "",
                hangsiName: "",
                dptName: "",
                pstName: "",
                arrvName: "",
                dptCity: "",
                pstCity: "",
                arrvCity: "",
                dpt_time: "00:01,02:11",
                pst_time: "00:01,02:11",
                pst_time_back: "00:21,03:56",
                arrv_time: "00:01,02:11",
                days: "1/3",
                sailingTime: "2018.02.03,2018.2.4",
                quoteNumberUppercase: "",
                quote_type: "",
                quoted_price: "",
                fixed_subsidy_price: "",
                bottom_subsidy_price: "",
                quoteNumber: "",
                remark: "",
                quoteNumberUppercase: "",
                airCrftTyp: "",
            },//合同数据列表
        }
    }

    //发布时间排列顺序
    changeReleaseTimeType(data) {
        let releaseTime;
        if (data) {
            releaseTime = "Asc"
        } else {
            releaseTime = "Desc"
        };
        Axios({
            method: 'post',
            url: '/selectMyOrderList',
            params: {
                demandType: this.state.demandType,
                demandProgress: this.state.demandProgress,
                page: 1,
                pageNo: this.state.pageNo,
                releaseTime
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            this.setState({
                releaseTime
            });
            if (response.data.opResult == 0 && response.data.list.list != null) {
                let initData = response.data.list.list;
                let totalCount = parseInt(response.data.list.totalCount);
                let numPrePage = response.data.list.numPrePage;
                let paginationType = true;
                if (totalCount <= 7) {
                    paginationType = false;
                }
                this.setState(() => ({
                    page:1,
                    initData,
                    totalCount,
                    paginationType,
                    noDataType: false,
                    pageNo: numPrePage
                }))
            } else {
                let paginationType = false;
                this.setState(() => ({
                    paginationType,
                    noDataType: true,
                    pageNo: numPrePage
                }))
            }
        })
    }

    //关闭详情页面
    closeDetails() {
        this.setState({
            showDetailsType: false
        });
        emitter.emit("openFrom", { openFrom: false, fromType: "" });
    }

    //详情显示模块
    showDetails(id, type, progress) {
        // this.closeDetails();
        if (progress == 5 || progress == 6 || progress == 7) {
            Axios({
                method: 'post',
                url: '/seeSailingAgreement',
                params: {
                    id
                },
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                if (response.data.opResult == 3) {
                    message.error('未查到相关交易记录，请联系客服');
                } else if (response.data.opResult == 4) {
                    if (id == this.state.showId) {
                        this.setState({
                            showDetailsType: type,
                            showFromType: false,
                            showId: id,
                            contractList: response.data,
                            numText: "保证金数据异常，请及时联系客服",
                            downType: false
                        });
                    } else {
                        this.setState({
                            showDetailsType: true,
                            showFromType: false,
                            showId: id,
                            contractList: response.data,
                            numText: "保证金数据异常，请及时联系客服",
                            downType: false
                        })
                    }
                } else {
                    if (id == this.state.showId) {
                        this.setState({
                            showDetailsType: type,
                            showFromType: false,
                            showId: id,
                            contractList: response.data,
                            downType: true
                        })
                    } else {
                        this.setState({
                            showDetailsType: true,
                            showFromType: false,
                            showId: id,
                            contractList: response.data,
                            downType: true
                        })
                    }
                };
            })
        } else {
            let openFrom, showFromType;
            if (id == this.state.showId) {
                openFrom = type;
                showFromType = type;
            } else {
                openFrom = true;
                showFromType = true;
            };
            let o = {
                openFrom:true,//点击同一个不关闭
                // openFrom,//关闭
                fromType: 3,
                fromMes: {
                    transmit: { id }
                }
            }
            emitter.emit('openFrom', o);
            this.setState({
                showId: id,
                showFromType,
                showDetailsType: false
            })
        }
    }
    //关闭详情显示模块
    closeDetail() {
        this.setState({
            showDetailsType: false
        })
    }

    //跳转分页
    choosePage(pageNumber) {
        let page = pageNumber;
        let orderType = this.state.orderType;
        Axios({
            method: 'post',
            url: '/selectMyOrderList',
            params: {
                demandType: this.state.demandType,
                demandProgress: this.state.demandProgress,
                pageNo: this.state.pageNo,
                page,//页码 必须传 默认1
                orderType//发布时间排序类型 0-倒序 1-正序
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            if (response.data.opResult == 0 && response.data.list.list != null) {
                let initData = response.data.list.list
                this.setState(() => ({
                    initData,
                    page
                }));
            } else {
                this.setState({
                    page
                });
            }
        })
    }

    //状态筛选条件
    changeStatus(num) {
        let demandProgress = num;
        let statusName = "状态";
        switch (num) {
            case "3":
                statusName = "关闭";
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
                statusName = "全部";
                break;
            default:
                break;
        };
        this.setState({
            demandProgress,
            statusName
        });
        Axios({
            method: 'post',
            url: '/selectMyOrderList',
            params: {
                demandType: this.state.demandType,
                demandProgress,
                page: 1,
                pageNo: this.state.pageNo,
                releaseTime: this.state.releaseTime
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            if (response.data.opResult == 0 && response.data.list.list != null) {
                let paginationType = true;
                let initData = response.data.list.list;
                let totalCount = parseInt(response.data.list.totalCount);
                let numPrePage = response.data.list.numPrePage;
                if (totalCount <= 7) {
                    paginationType = false;
                };
                this.setState(() => ({
                    initData,
                    totalCount,
                    numPrePage,
                    paginationType,
                    noDataType: false,
                    page: 1
                }))
            } else {
                let paginationType = false;
                let totalCount = parseInt(response.data.list.totalCount);
                let numPrePage = response.data.list.numPrePage;
                this.setState(() => ({
                    initData: [],
                    totalCount,
                    numPrePage,
                    paginationType,
                    noDataType: true,
                    page: 1
                }));
            }
        })
    }

    //类型筛选条件
    changeDemand(num) {
        let demandType = num;
        let demandName = this.state.demandName;
        switch (num) {
            case "5":
                demandName = "全部";
                demandType = "";
                break;
            case "0":
                demandName = "航线需求";
                break;
            case "1":
                demandName = "运力投放";
                break;
            case "3":
                demandName = "航线委托";
                break;
            case "4":
                demandName = "运力委托";
                break;
            default:
                break;
        };
        this.setState({
            demandType,
            demandName
        });
        Axios({
            method: 'post',
            url: '/selectMyOrderList',
            params: {
                demandType,
                demandProgress: this.state.demandProgress,
                page: 1,
                pageNo: this.state.pageNo,
                releaseTime: this.state.releaseTime
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            if (response.data.opResult == 0 && response.data.list.list != null) {
                let paginationType = true;
                let initData = response.data.list.list;
                let totalCount = parseInt(response.data.list.totalCount);
                let numPrePage = response.data.list.numPrePage;
                if (totalCount <= 7) {
                    paginationType = false;
                };
                this.setState(() => ({
                    initData,
                    totalCount,
                    numPrePage,
                    paginationType,
                    noDataType: false,
                    page: 1
                }))
            } else {
                let paginationType = false;
                let totalCount = parseInt(response.data.list.totalCount);
                let numPrePage = response.data.list.numPrePage;
                this.setState(() => ({
                    initData: [],
                    totalCount,
                    numPrePage,
                    paginationType,
                    noDataType: true,
                    page: 1
                }))
            }
        })
    }

    //  TODO:打印事件
    printEvent() {
        console.log("----------------打印--------------------");
        // let newDom=document.body.innerHTML;
        // document.body.innerHTML=document.getElementById("printOut").innerHTML
        window.print()
        // document.body.innerHTML = newDom;
        // console.log(this.printDom)
        // this.printDom.print()
        console.log(window)
    }

    //下载
    downLoad() {
        if (this.state.downType) {
            this.downLoadText.submit();
        } else {
            Modal.warning({
                title: '警告',
                content: '保证金异常，请及时联系客服',
            });
        }
    }

    componentWillMount() {  // 将要渲染
        //判断角色类型，0是航司，1是机场
        emitter.emit("openFrom", { openFrom: false, fromType: "" });
        let role = store.getState().role.role;
        let pageNo = this.state.pageNo;
        let status = this.state.status;
        let page = this.state.page;
        let releaseTime = this.state.orderType;
        let demandTypeList = this.state.demandTypeList;
        if (role == 0) {
            status.splice(3, 4);
            demandTypeList = [
                { key: 5, name: "全部" },
                { key: 0, name: "航线需求" },
                { key: 1, name: "运力投放" },
            ]
        } else {
            demandTypeList = [
                { key: 5, name: "全部" },
                { key: 0, name: "航线需求" },
                { key: 1, name: "运力投放" },
            ]
        };
        this.setState({
            status,
            demandTypeList
        });
        Axios({
            method: 'post',
            url: '/selectMyOrderList',
            params: {
                demandType: "",
                demandProgress: "",
                page,//页码 必须传 默认1
                pageNo,
                releaseTime: "Desc"//发布时间排序类型 Desc为降序 Asc-升序
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            if (response.data.opResult == 0 && response.data.list.list != null) {
                let initData = response.data.list.list;
                let totalCount = parseInt(response.data.list.totalCount);
                let numPrePage = response.data.list.numPrePage;
                let paginationType = true;
                if (totalCount <= 7) {
                    paginationType = false;
                }
                this.setState(() => ({
                    initData,
                    totalCount,
                    numPrePage,
                    paginationType,
                    noDataType: false,
                    showSpin: false
                }));
            } else {
                let paginationType = false;
                this.setState(() => ({
                    paginationType,
                    noDataType: true,
                    showSpin: false
                }));
            }
        })
    }

    componentDidMount() {   // 加载渲染完成

    }
    componentWillReceiveProps(nextProps) {  // Props发生改变

    }
    componentWillUnmount() {  // 卸载组件
        emitter.emit("openFrom", { openFrom: false, fromType: "" });
    }
    render() {
        let _this = this;
        let initData = this.state.initData;
        let title = "发布时间";//组件类型名称
        let arrangeType;
        if (this.state.releaseTime == "Desc") {
            arrangeType = false
        } else {
            arrangeType = true
        };
        //是否有数据样式判断
        let paginationType = this.state.paginationType;
        let paginationStyle = style['my-order-page-false'];
        let paginationText = style['my-order-text-false']
        if (paginationType) {
            paginationStyle = style['my-order-page-true'];
        };
        if (this.state.noDataType) {
            paginationText = style['my-order-text-true']
        };
        //状态下拉选项
        const onClick = function ({ key }) {
            _this.changeStatus(key)
        };
        const menu = (
            <Menu onClick={onClick}>
                {
                    this.state.status.map((item, key) => {
                        return <Menu.Item key={item.key}><span>{item.name}</span></Menu.Item>
                    })
                }
            </Menu>
        );
        //类型下拉选项
        const onClickType = function ({ key }) {
            _this.changeDemand(key)
        };
        const menuType = (
            <Menu onClick={onClickType}>
                {
                    this.state.demandTypeList.map((item, key) => {
                        return <Menu.Item key={item.key}><span>{item.name}</span></Menu.Item>
                    })
                }
            </Menu>
        );
        let showDetailsType = this.state.showDetailsType;
        let detailText = style['noShow']
        if (showDetailsType) {
            detailText = style['detailBox']
        };
        //详情渲染表格样式判断
        let tableText = "";
        let contractList = this.state.contractList;
        let airType = contractList.airCrftTyp ? contractList.airCrftTyp : "暂无数据";
        if (contractList.airCrftTyp == undefined) {
            airType = "暂无数据"
        } else {
            airType = contractList.airCrftTyp
        }
        let daysText = "";
        if (contractList.days == undefined) {
            daysText = "暂无数据"
        } else {
            daysText = contractList.days.split("/").join("")
        };
        let dptText = "";
        if (contractList.dptCity == undefined) {
            dptText = "暂无数据"
        } else {
            dptText = contractList.dptCity
        };
        let arrvText = "";
        if (contractList.arrvCity == undefined) {
            arrvText = "暂无数据"
        } else {
            arrvText = contractList.arrvCity
        };
        let pstText = "";
        if (contractList.pstCity == undefined) {
            pstText = "暂无数据"
        } else {
            pstText = contractList.pstCity
        };
        let dptTime = "";
        if (contractList.dpt_time == undefined) {
            dptTime = "暂无数据"
        } else {
            dptTime = contractList.dpt_time.split(",")[0].split(":").join("")
        };
        let arrvTime = "";
        if (contractList.arrv_time == undefined) {
            arrvTime = "暂无数据"
        } else {
            arrvTime = contractList.arrv_time.split(",")[0].split(":").join("")
        };
        let dptTimeB;
        if (contractList.dpt_time == undefined || contractList.dpt_time.split(",").length < 2) {
            dptTimeB = "暂无数据"
        } else {
            dptTimeB = contractList.dpt_time.split(",")[1].split(":").join("")
        };
        let arrvTimeB;
        if (contractList.arrv_time == undefined || contractList.arrv_time.split(",").length < 2) {
            arrvTimeB = "暂无数据"
        } else {
            arrvTimeB = contractList.arrv_time.split(",")[1].split(":").join("")
        };
        let pstTimeD;
        if (contractList.pst_time == undefined) {
            pstTimeD = "暂无数据"
        } else {
            pstTimeD = contractList.pst_time.split(",")[0].split(":").join("")
        }
        let pstTimeA;
        if (contractList.pst_time == undefined || contractList.pst_time.split(",").length < 2) {
            pstTimeA = "暂无数据"
        } else {
            pstTimeA = contractList.pst_time.split(",")[1].split(":").join("")
        }
        let pstTimeBD;
        if (contractList.pst_time_back == undefined) {
            pstTimeBD = "暂无数据"
        } else {
            pstTimeBD = contractList.pst_time_back.split(",")[0].split(":").join("")
        }
        let pstTimeBA;
        if (contractList.pst_time_back == undefined || contractList.pst_time_back.split(",").length < 2) {
            pstTimeBA = "暂无数据"
        } else {
            pstTimeBA = contractList.pst_time_back.split(",")[1].split(":").join("")
        };
        if (this.state.contractList.pstName) {
            tableText = <div className={style['tableDirect']}>
                <div className={style['tableTop']}>
                    <div className={style['airType']}>机型</div>
                    <div className={style['days']}>班期</div>
                    <div className={style['tableItem']}>航站</div>
                    <div className={style['tableItem']}>起飞</div>
                    <div className={style['tableItem']}>落地</div>
                    <div className={style['tableItem']}>航点</div>
                    <div className={style['tableItem']}>起飞</div>
                    <div className={style['tableItem']}>落地</div>
                    <div className={style['tableItem']}>航站</div>
                </div>
                <div className={style['tableBottom']}>
                    <div className={style['airType']}>{airType}</div>
                    <div className={style['days']}>{daysText}</div>
                    <div className={style['tableDetail']}>
                        <div>{dptText}</div>
                        <div className={style['underLine']}>{arrvText}</div>
                    </div>
                    <div className={style['tableDetail']}>
                        <div>{dptTime}</div>
                        <div className={style['underLine']}>{arrvTimeB}</div>
                    </div>
                    <div className={style['tableDetail']}>
                        <div>{pstTimeD}</div>
                        <div className={style['underLine']}>{pstTimeA}</div>
                    </div>
                    <div className={style['tableDetail']}>
                        <div>{pstText}</div>
                        <div className={style['underLine']}>{pstText}</div>
                    </div>
                    <div className={style['tableDetail']}>
                        <div>{pstTimeBD}</div>
                        <div className={style['underLine']}>{pstTimeBA}</div>
                    </div>
                    <div className={style['tableDetail']}>
                        <div>{arrvTime}</div>
                        <div className={style['underLine']}>{dptTimeB}</div>
                    </div>
                    <div className={style['tableDetail']}>
                        <div>{arrvText}</div>
                        <div className={style['underLine']}>{dptText}</div>
                    </div>
                </div>
            </div>
        } else {
            tableText = <div className={style['tableIndirect']}>
                <div className={style['tableTop']}>
                    <div className={style['airType']}>机型</div>
                    <div className={style['days']}>班期</div>
                    <div className={style['tableItem']}>航站</div>
                    <div className={style['tableItem']}>起飞</div>
                    <div className={style['tableItem']}>落地</div>
                    <div className={style['tableItem']}>航站</div>
                </div>
                <div className={style['tableBottom']}>
                    <div className={style['airType']}>{airType}</div>
                    <div className={style['days']}>{daysText}</div>
                    <div className={style['tableDetail']}>
                        <div>{dptText}</div>
                        <div className={style['underLine']}>{arrvText}</div>
                    </div>
                    <div className={style['tableDetail']}>
                        <div>{dptTime}</div>
                        <div className={style['underLine']}>{arrvTime}</div>
                    </div>
                    <div className={style['tableDetail']}>
                        <div>{arrvTimeB}</div>
                        <div className={style['underLine']}>{dptTimeB}</div>
                    </div>
                    <div className={style['tableDetail']}>
                        <div>{arrvText}</div>
                        <div className={style['underLine']}>{dptText}</div>
                    </div>
                </div>
            </div>
        };
        //合同模块数据组装
        let pathText = "-", startTime = "---", endTime = "---";
        if (contractList.length != 0) {
            if (contractList.pstName == null && contractList.dptName != undefined && contractList.arrvName != undefined) {
                pathText = contractList.dptName + "-" + contractList.arrvName
            } else if (contractList.pstName != undefined && contractList.dptName != undefined && contractList.arrvName != undefined) {
                pathText = contractList.dptName + "-" + contractList.pstName + "-" + contractList.arrvName
            } else {
                pathText = "暂无数据"
            };
            daysText = contractList.days.split("/").join("");
            let timeList;
            if (contractList.sailingTime == undefined || contractList.sailingTime == "") {
                startTime = ["-", "-", "-"];
                endTime = ["-", "-", "-"];
            } else {
                timeList = contractList.sailingTime.split(",");
                startTime = timeList[0].split("-");
                endTime = timeList[1].split("-");
            };


        };
        let priceText, priceType;
        if (contractList.quote_type) {
            if (contractList.quote_type == "1") {
                priceText = contractList.quoted_price + "万元/班";
                priceType = "定补"
            } else {
                priceText = contractList.quoted_price + "万元/小时"
                priceType = "保底"
            }

        } else {
            priceText = "-";
            priceType = "-"
        };
        let numText = this.state.numText;
        if (contractList.quoteNumber == "" || contractList.quoteNumber == null) {
            numText = "保证金数据异常，请及时联系客服"
        } else {
            numText = contractList.quoteNumber + "(大写:" + contractList.quoteNumberUppercase + ")"
        };
        let address = "/downloadSailingAgreement"
        return (
            <div style={{ position: "relative", fontSize: "1.2rem" }}>
                <form ref={(ref) => this.downLoadText = ref} action={address} method="get" style={{ display: "none" }}>
                    <input type="text" name="id" value={this.state.showId} />
                </form>
                <div className={detailText}>
                    <div className={`${style['detailNav']} ${style['noPrint']}`}>
                        <div className={style['detailNavName']}>协议</div>
                        {/*<Button className={`iconfont ${style['print']}`} onClick={this.printEvent.bind(this)}><span className="iconfont">&#xe655;</span>打印</Button>*/}
                        <div className={style['navRight']}>
                            <Button className={`iconfont ${style['downLoad']}`} onClick={this.downLoad.bind(this)}><span className="iconfont">&#xe663;</span>下载</Button>
                            <div className={`${style['detailNavBtn']}`} onClick={this.closeDetail.bind(this)}><span className="iconfont">&#xe652;</span></div>
                        </div>
                    </div>
                    <div id="printOut">
                        <div className={style['detailTitle']}>航线开航合同协议书</div>
                        <div className={style['owner']}>甲方:{this.state.contractList.jichangName}</div>
                        <div className={style['owner']}>乙方:{this.state.contractList.hangsiName}</div>
                        <div className={style['owner']}>双方就&nbsp;<span className={style['span']}>{pathText}</span>&nbsp;航线合作事宜，商定如下:</div>
                        <div className={style['owner']} style={{ width: 500, lineHeight: "32px" }}>
                            由<span className={style['span']}>乙方</span>执飞&nbsp;<span className={style['span']}>{pathText}</span>&nbsp;航线,班期为每周<span className={style['span']}>{daysText}</span>, 合作期限自<span className={style['span']}>{startTime[0]}年{startTime[1]}月{startTime[2]}日</span>起至<span className={style['span']}>{endTime[0]}年{endTime[1]}月{endTime[2]}日</span>止。具体航信信息如下：
                            </div>
                        {tableText}
                        <div className={style['owner']}>备注:具体时刻以民航局最终批复为准</div>
                        <div className={style['owner']}>合作方式:<span className={style['span']}>{priceType}</span></div>
                        <div className={style['owner']}>价格:<span className={style['span']}>{priceText}</span></div>
                        <div className={style['owner']}>保证金:<span className={style['span']}>{numText}</span></div>
                        <div className={style['owner']} style={{ marginBottom: 100 }}>其他说明:<span className={style['span']}>{contractList.remark}</span></div>
                        <div className={style['signature']}>
                            <div className={style['signatureItem']}>
                                <div className={style['signatureName']}>甲方(签章): <span className={style['span']}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
                                <div className={style['day']}><span className={style['span']}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>年<span className={style['span']}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>月<span className={style['span']}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>日</div>
                            </div>
                            <div className={style['signatureItem']}>
                                <div className={style['signatureName']}>乙方(签章): <span className={style['span']}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
                                <div className={style['day']}><span className={style['span']}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>年<span className={style['span']}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>月<span className={style['span']}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>日</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style['my-order-nav']}>
                    <ArrangeType arrangeType={arrangeType} title={title} arrangeTypeEvent={(data) => this.changeReleaseTimeType(data)} />
                    <div className={style['my-order-nav-demand-type']}>
                        <Dropdown overlay={menuType} trigger={['click']}>
                            <a className="ant-dropdown-link" href="#" style={{ textDecoration: "none" }}>
                                {this.state.demandName} <Icon type="caret-down" />
                            </a>
                        </Dropdown>
                    </div>
                    <div className={style['my-order-nav-demand']}>需求标题</div>
                    <div className={style['my-order-nav-send']}>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <a className="ant-dropdown-link" href="#" style={{ textDecoration: "none" }}>
                                {this.state.statusName} <Icon type="caret-down" />
                            </a>
                        </Dropdown>
                    </div>
                </div>
                <div className={`${style['my-order-content']} ${style['noPrint']}`}>
                    {
                        initData.map((item, index) => {
                            let text, icon, typeText;
                            switch (item.demandProgress) {
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
                                    text = "关闭";
                                    icon = ""
                                    break;
                                case "4":
                                    text = "落选状态";
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
                            switch (item.demandType) {
                                case "0":
                                    typeText = "航线需求";
                                    break;
                                case "1":
                                    typeText = "运力投放";
                                    break;
                                default:
                                    typeText = "暂无数据";
                                    break;
                            }
                            return <MyOrderItem data={item} typeText={typeText} key={index} text={text} icon={icon} showFromType={this.state.showFromType} showDetailsType={this.state.showDetailsType} showDetailsEvent={(id, type, progress) => this.showDetails(id, type, progress)} />
                        })
                    }
                </div>
                <div className={paginationStyle}>
                    <Pagination showQuickJumper defaultPageSize={parseInt(this.state.pageNo)} current={parseInt(this.state.page)} total={parseInt(this.state.totalCount)} onChange={this.choosePage.bind(this)} />
                </div>
                <div className={paginationText}>暂无数据</div>
                {this.state.showSpin ? <Spin size="large" style={{ width: '100%', zIndex: 100 }} /> : ""}
            </div>
        )
    }
}