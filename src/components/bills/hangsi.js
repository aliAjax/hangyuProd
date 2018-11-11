// author:wangli time:2018-06-05 content:航司视角-账单模块
/* eslint-disable */
import React, { Component, Fragment } from "react";
import { Pagination, DatePicker, Input, Button, Upload, message, Spin } from "antd";
import { host as $host } from "./../../utils/port";
import Axios from "./../../utils/axiosInterceptors";
import moment from 'moment';
import style from "../../static/css/bills/billsComponent/hangsi.scss";
const { MonthPicker } = DatePicker;

export default class Hangsi extends Component {
    constructor(props) {
        super(props);
        this.accountsDueEvent = this.accountsDueEvent.bind(this);
        this.state = {
            /*
            新建账单
            数据提交和样式
            */
            addFileType: false,//是否显示弹框 false为不显示
            refreshTime: "",//账单更新时间
            refreshTimeText: "",//提交时没有时间提示
            newAccountsDue: "",//应收款
            accountsDueError: "",//输入金额格式错误
            accountsDueNull: "",//提交时没有金额提示
            adjunctName: "",//附件名称
            adjunctNameText: "",//附件提示
            fileList: [],//上传文件列表
            uploading: false,//是否有文件上传判断
            initData: [],//table渲染数据
            page: 1,//页码 必传
            pageNo: 5,//页大小 必传
            totalCount: 0,//总条数
            /*
            后台获取数据
            查询账单参数
            */
            ordersMonth: "",//时间
            accountsDue: "",//应收款
            fundsReceived: "",//已收款
            arrearage: "",//未收款
            adjunct: "",//点击后下载

            showSpin: true,//加载动画 true:显示
            noDataType: false,//无数据显示文案 true:显示
            pType: false,//翻页滚动条显示 true:显示
        }
    }

    //确认提交账单
    affirm() {
        if (this.state.refreshTime) {} else {//判断是否选择账单时间
            this.setState({
                refreshTimeText: "* 请选择账单时间"
            })
        };
        if (this.state.newAccountsDue) {} else {//判断是否输入金额
            this.setState({
                accountsDueError: "",
                accountsDueNull: "* 请输入应收款金额"
            })
        };
        let accountsDueReg = /^[0-9]*$/;
        if (this.state.refreshTime && this.state.newAccountsDue&&accountsDueReg.test(this.state.newAccountsDue)) {//提交账单
            const { fileList } = this.state;
            const formData = new FormData();
            fileList.forEach((file) => {//往formData对象中添加参数
                formData.append('file', file);
                formData.append("datebox", this.state.refreshTime);
                formData.append("file", this.state.adjunctName);
                formData.append("accountsDue", this.state.newAccountsDue);
                formData.append("demandId", this.props.data.demandId);
                formData.append("demandType", this.props.data.demandType);
                formData.append("title", this.props.data.title);
            });
            this.setState({
                uploading: true,
            });
            Axios({
                method: 'post',
                url: '/addPersonalBill',
                data: formData,
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                if (response.data.opResult == 0) {//提交成功时，刷新页面
                    Axios({
                        method: 'post',
                        url: '/findPersonalBillItemByid',
                        params: {
                            demandId: this.props.detailsId,
                            page: 1,
                            pageNo: this.state.pageNo
                        },
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        }
                    }).then((response) => {
                        if (response.data.opResult == 0 && response.data.list.list != null) {
                            let pType = true;
                            if (response.data.list.totalCount <= 5) {
                                pType = false;
                            };
                            this.setState({
                                pType,
                                noDataType: false,
                                initData: response.data.list.list,
                                totalCount: response.data.list.totalCount,
                                fileList:[],
                                newAccountsDue:"",
                                refreshTime:''

                            })
                        }
                    })
                    this.setState({
                        uploading: false,
                        addFileType: false
                    });
                    message.success('提交成功，待后台审核');
                } else {//提交失败时
                    this.setState({
                        uploading: false,
                        addFileType: false
                    });
                    message.success('提交失败');
                }
            })
        }
    }

    //取消提交账单
    cancel() {
        this.setState({
            addFileType: false,
            fileList: [],//上传文件列表
            uploading: false,//是否有文件上传判断
            refreshTime: "",//账单更新时间
            newAccountsDue: "",//应收款
            accountsDueError: "",//输入金额格式错误
            accountsDueNull: "",//提交时没有金额提示
            refreshTimeText: "",//提交时没有时间提示
        })
    }

    //建立表单弹出表单层
    bulidForm() {
        this.setState({
            addFileType: true
        })
    }

    //金额渲染方法
    changeBillStyle(num) {
        //金额判断
        let billNum = "";
        if (num.length <= 3) {//金额小于100时，无需逗点操作
            billNum = num;
        } else {
            for (let i = 0; i < parseInt(num / 3); i++) {//大于999时，每三位数加个逗点
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

    //输入账款数量
    accountsDueEvent(event) {
        let newAccountsDue = event.target.value;//获取输入值
        let accountsDueReg = /^[0-9]*$/;//正则验证规则
        if (accountsDueReg.test(newAccountsDue)) {//正则验证成功
            this.setState({
                accountsDueNull: "",
                accountsDueError: "",
                newAccountsDue
            })
        } else {//正则验证失败
            this.setState({
                newAccountsDue,
                accountsDueNull: "",
                accountsDueError: "* 请输入正确的金额"
            })
        }
    }

    //输入框焦点离开时
    accountsJudge() {
        let accountsDueReg = /^[0-9]*$/;//正则验证规则
        if (this.state.newAccountsDue != 0 && accountsDueReg.test(this.state.newAccountsDue)) {
            this.setState({
                accountsDueError: "",
                accountsDueNull: ""
            })
        } else if (this.state.accountsDueError == "") {
            this.setState({
                accountsDueNull: "* 请输入应收款金额"
            })
        }
    }

    //选择时间事件
    chooseTime(date, dateString) {//date:选择时间对象 dateString:选择时间字符串
        this.setState({
            refreshTimeText: "",
            refreshTime: dateString
        })
    }

    componentWillMount() {
        Axios({//获取账单
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
                let pType = true;
                if (response.data.list.totalCount <= 5) {
                    pType = false;
                };
                this.setState({
                    pType,
                    noDataType: false,
                    initData: response.data.list.list,
                    totalCount: response.data.list.totalCount
                })
            } else {
                this.setState({
                    pType: false,
                    noDataType: true
                })
            }
        })
    }

    //下载账单
    downLoad(id) {//id：账单id
        this.setState({
            id
        });
        setTimeout(() => {
            this.downLoadText.submit()
        }, 200)
    }

    //更改分页数事件
    changeBillPage(pageNumber) {//pageNumber：分页页码
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

    componentWillUnmount() {  // 卸载组件

    }
    render() {
        //是否显示账单列表判断
        let showType = style['hidden'];
        if (this.props.showDetailType) {
            showType = style['showDetail']
        }
        //是否显示新建账单弹框
        let addFileType = this.state.addFileType;
        let addFileStyle = style['noShow']
        if (addFileType) {
            addFileStyle = style['showPopUp']
        };
        //上传文件模块--antd组件
        const { uploading } = this.state;
        const props = {
            action: "/addPersonalBill",
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState({
                    fileList: []
                })
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                    adjunctName: file.name
                }));
                return false;
            },
            fileList: this.state.fileList,
        };
        //判断表单最后一个tr样式
        let noDate = style['noShow'];
        let page = style['noShow'];
        if (this.state.noDataType) {
            noDate = style[''];
        } else if (this.state.pType) {
            page = style['']
        };
        let refreshTimeText = null;
        if (this.state.refreshTime) {
            refreshTimeText = moment(this.state.refreshTime, "YYYY/MM")
        };
        //下载地址
        let address = "/downFileByid"
        return (
            <div className={showType}>
                <form ref={(ref) => this.downLoadText = ref} action={address} method="post" style={{ display: "none" }}>
                    <input type="text" name="id" value={this.state.id} />
                </form>
                <table className={style['table']}>
                    <thead>
                        <tr>
                            <th className={style['td']}>时间</th>
                            <th className={style['trShould']}>应收款</th>
                            <th className={style['trDid']}>已收款</th>
                            <th className={style['trWill']}>未收款</th>
                            <th className={style['trFile']}>附件</th>
                            <th className={style['trStatus']}>状态</th>
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
                                    <td className={style['trShould']}>{accountsDueText}</td>
                                    <td className={style['trDid']}>{fundsReceivedText}</td>
                                    <td className={style['trWill']}>{arrearageText}</td>
                                    <td className={style['trFile']}>{adjunctText}</td>
                                    <td className={style['trStatus']}>{allPaymentText}</td>
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
                <div className={style['newTable']}>
                    <div className={style['newTableName']}>新建账单</div>
                    <div className={style['newTableBtn']}>
                        <div className={style['addBtn']}>
                            <button onClick={this.bulidForm.bind(this)}>
                                <span className="iconfont">&#xe66f;</span>
                            </button>
                        </div>
                    </div>
                </div>
                <form ref={(ifile) => this.addFile = ifile} className={addFileStyle}>
                    <div className={style['formDiv']}>
                        <div>
                            <div className={style['formTimeBox']}>
                                <div className={style['formTimeBoxTitle']}>账单时间</div>
                                <div className={style['formTimeChoose']}>
                                    <MonthPicker onChange={this.chooseTime.bind(this)} value={refreshTimeText} placeholder="请选择收款时间" dropdownClassName={style['antd']}
                                        locale={{
                                            "lang": {
                                                "yearFormat": "YYYY" + "年",
                                                "yearSelect": "选择年份",
                                                "previousYear": "上一年 (Control + left)",
                                                "nextYear": "下一年 (Control + right)",
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <span className={style['timeText']}>{this.state.refreshTimeText}</span>
                        <div className={style['shouldGet']}>
                            <div className={style['shouldGetNum']}>应收款(元)</div>
                            <div className={style['shouldGetInput']}><Input placeholder="请填入收款金额" value={this.state.newAccountsDue} onChange={this.accountsDueEvent} onBlur={this.accountsJudge.bind(this)} /></div>
                        </div>
                        <span className={style['numText']}>{this.state.accountsDueError}</span>
                        <span className={style['numText']}>{this.state.accountsDueNull}</span>
                        <div className={style['addFile']}>
                            <div className={style['addFileName']}>附件</div>
                            <div className={style['addFileBtn']}>
                                <Upload {...props}>
                                    <Button>
                                        <span className="iconfont">&#xe6e8;</span><div>添加附件</div>
                                    </Button>
                                </Upload>
                            </div>
                        </div>
                        <span className={style['fileText']}>{this.state.adjunctNameText}</span>
                        <div className={style['eventBtn']}>
                            <Button
                                className={`upload-demo-start ${style['affirmBtn']}`}
                                type="primary"
                                onClick={this.affirm.bind(this)}
                                disabled={this.state.fileList.length === 0}
                                loading={uploading}
                            >
                                {this.state.fileList.length ? '确定' : '请上传文件'}
                            </Button>
                            <Button className={style['cancelBtn']} onClick={this.cancel.bind(this)}>取消</Button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}