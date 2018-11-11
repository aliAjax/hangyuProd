// author:wangli time:2018-06-05 content:机场账单
/* eslint-disable */
import React,{ Component,Fragment } from "react";
import Axios from "./../../utils/axiosInterceptors";
import { host as $host} from "./../../utils/port";
import {Pagination,Spin} from "antd";
import style from "../../static/css/bills/billsComponent/airport.scss";
export default class Airport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showSpin:true,//加载组件是否显示 true：显示
            noDataType:false,//无数据文案是否显示 false:不显示
            pType:false,//翻页滚动条是否显示 false：不显示
            ordersMonth: "",//时间
            accountsDue: "",//应收款
            fundsReceived: "",//已收款
            arrearage: "",//未收款
            adjunctName: "",//附件名称
            adjunct: "",//点击后下载
            initData: [],//渲染数据
            page: 1,//页码 必传
            pageNo: 5,//页大小 必传
            totalCount: 0,//总条数
            id: ""//下载携带的参数
        }
    }

    componentWillMount() {
        Axios({
            method: 'post',
            url: '/findPersonalBillItemByid',
            params: {
                demandId: this.props.detailsId,
                page: this.state.page,
                pageNo: this.state.pageNo
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            if (response.data.opResult == 0 && response.data.list.list != null) {
                let pType=true;
                if(response.data.list.totalCount<=5){
                    pType=false;
                };
                this.setState({
                    pType,
                    noDataType:false,
                    initData: response.data.list.list,
                    totalCount: response.data.list.totalCount
                })
            }else {
                this.setState({
                    pType:false,
                    noDataType:true,
                })
            }
        })
    }

    //下载表格
    downLoad(id) {//id:下载表格的id
        this.setState({
            id
        });
        setTimeout(() => {
            this.downLoadText.submit()
        }, 200)
    }

    //更改分页数事件
    changeBillPage(pageNumber) {//pageNumber 修改的页码
        this.setState({
            page: pageNumber
        });
        Axios({
            method: 'post',
            url: '/findPersonalBillItemByid',
            params: {
                demandId: this.props.detailsId,
                page: pageNumber,
                pageNo: this.state.pageNo
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            if (response.data.opResult == 0 && response.data.list.list != null) {
                this.setState({
                    initData: response.data.list.list,
                    totalCount: response.data.list.totalCount
                })
            }
        })
    }

    //金额渲染方法
    changeBillStyle(num) {//num 传入的金额数
        //金额判断
        let billNum = "";
        if (num.length <= 3) {//num<100时，不需要加逗点
            billNum = num;
        } else {
            for (let i = 0; i < parseInt(num / 3); i++) {//每三个数字中间加逗点
                billNum = "," + num.slice(-3) + billNum;
                num = num.slice(0, num.length - 3);
                if (num.length <= 3) {
                    break;
                }
            };
            billNum = num + billNum;
        };
        return billNum;
    }

    render() {
        let showType = style['hidden'];
        if (this.props.showDetailType) {
            showType = style['showDetail']
        };
        //判断表单最后一个tr样式
        let noDate = style['noShow'];
        let page = style['noShow'];
        if (this.state.noDataType) {
             noDate= style[''];
        } else if(this.state.pType){
            page = style['']
        };
        //表格下载地址
        let address = "/downFileByid";
        return (
            <div className={showType}>
                <form ref={(ref) => this.downLoadText = ref} action={address} method="post" style={{ display: "none" }}>
                    <input type="text" name="id" value={this.state.id} />
                </form>
                <table className={style['airTabel']}>
                    <thead className={style['airThead']}>
                        <tr>
                            <th className={style['td']}>时间</th>
                            <th className={style['should']}>应付款</th>
                            <th className={style['did']}>已付款</th>
                            <th className={style['will']}>未付款</th>
                            <th className={style['file']}>附件</th>
                            <th className={style['state']}>状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.initData.map((item, index) => {
                                let fundsReceivedText = "-";
                                let arrearageText = "-";
                                let adjunctText = "-";
                                let allPaymentText = "-";
                                let accountsDueText = this.changeBillStyle(item.accountsDue);
                                if (item.fundsReceived != null && item.fundsReceived != "") {
                                    if (item.fundsReceived == "0") {
                                        fundsReceivedText = "0"
                                    } else {
                                        fundsReceivedText = this.changeBillStyle(item.fundsReceived);
                                    }
                                };
                                if (item.arrearage != null && item.arrearage != "") {
                                    if (item.arrearage == "0") {
                                        arrearageText = "0"
                                    } else {
                                        arrearageText = this.changeBillStyle(item.arrearage);
                                    }
                                };
                                if (item.adjunctName != null) {
                                    adjunctText = <span style={{ color: "#5086ff", textDecoration: "underline" }} onClick={this.downLoad.bind(this, item.id)}>{item.adjunctName}</span>
                                };
                                if (item.ordersState == 0) {
                                    allPaymentText = <span style={{ color: "red" }}>待审核</span>
                                } else {
                                    if (item.allPayment == 0) {
                                        allPaymentText = "已结清"
                                    } else if (item.allPayment == 1) {
                                        allPaymentText = <span style={{ color: "red" }}>未结清</span>
                                    } else {
                                        allPaymentText = "暂无数据"
                                    };
                                }
                                return <tr key={index}>
                                    <td className={style['td']}>{item.ordersMonth}</td>
                                    <td className={style['should']}>{accountsDueText}</td>
                                    <td className={style['did']}>{fundsReceivedText}</td>
                                    <td className={style['will']}>{arrearageText}</td>
                                    <td className={style['file']}>{adjunctText}</td>
                                    <td className={style['state']}>{allPaymentText}</td>
                                </tr>
                            })
                        }
                        <tr className={page}>
                            <td colSpan="6">
                                <div className={style['tabelPage']}>
                                    <Pagination showQuickJumper defaultPageSize={5} value={parseInt(this.state.page)} onChange={this.changeBillPage.bind(this)} total={parseInt(this.state.totalCount)} />
                                </div>
                            </td>
                        </tr>
                        <tr className={noDate}>
                            <td colSpan="6">
                                <div className={style['noDate']}>
                                    暂无数据
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}