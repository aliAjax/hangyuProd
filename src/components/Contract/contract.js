// author:wangli time:2018-07-19 content:合同模块
import React,{Component,Fragment} from "react";
import { Button,message} from "antd";
import style from "../../static/css/contract/contract.scss";
import Axios from "../../utils/axiosInterceptors";
import emitter from "../../utils/events";

export default class Contract extends Component{

    constructor(props){
        super(props);
        this.state = {
            showId:"",//合同id
            downType:false,//是否支持下载 false为不支持
            contractList:{//合同数据
                jichangName: "",
                hangsiName: "",
                dptName: "",
                pstName: "",
                arrvName: "",
                dptCity: "",
                pstCity: "",
                arrvCity: "",
                dpt_time: "",
                pst_time: "",
                pst_time_back: "",
                arrv_time: "",
                days: "",
                sailingTime: "",
                quoteNumberUppercase: "",
                quote_type: "",
                quoted_price: "",
                fixed_subsidy_price: "",
                bottom_subsidy_price: "",
                quoteNumber: "",
                remark: "",
                airCrftTyp: "",
            }
        }
    }

    //设置更新数据
    reData(data){//父组件传递过来的props
        this.setState({
            // contractList:data.contractList,
            showId:data.showId,
            downType:data.downType
        });
    }

    //点击获取合同数据
    showWorkEvent(id) {//data:是否支持下载 id：合同id
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
                        showId: id,
                        contractList: response.data,
                        numText: "保证金数据异常，请及时联系客服"
                    });
                } else {
                    this.setState({
                        showId: id,
                        contractList: response.data,
                        numText: "保证金数据异常，请及时联系客服"
                    });
                };
            } else {
                    this.setState({
                        showId: id,
                        contractList: response.data,
                        downType: true
                    });
            };
        })
    }

    componentWillMount(){
        this.showWorkEvent(this.props.showId);
        // console.log(this.props)
        this.reData(this.props);
    }

    componentWillReceiveProps(nextProps){
        this.showWorkEvent(nextProps.showId);
        this.reData(nextProps)
    }


    //下载合同
    downLoad() {
        if (this.state.downType) {
            this.downLoadText.submit();
        }
    }

    //关闭
    closeDetail(){
        if(window.screen.width<=1366){
			emitter.emit('changeBoxLocation');
        };
        this.props.closeDetail();
    }

    render(){
        //详情渲染表格样式判断
        let tableText = "";
        let contractList = this.state.contractList;
        let airType = contractList.airCrftTyp ? contractList.airCrftTyp : "暂无数据";
        if (!contractList.airCrftTyp) {//机型数据
            airType = "暂无数据"
        } else {
            airType = contractList.airCrftTyp;
            airType=airType.split("/");
            if(airType.length>2){
                airType[2]="<br/>"+airType[2];
            };
            airType=airType.join("/");
        }
        let daysText = "";
        if (contractList.days == undefined) {//班期数据
            daysText = "暂无数据"
        } else {
            daysText = contractList.days.split("/").join("")
        };
        let dptText = "";
        if (contractList.dptCity == undefined) {//出发航站
            dptText = "暂无数据"
        } else {
            dptText = contractList.dptCity
        };
        let arrvText = "";
        if (contractList.arrvCity == undefined) {//到达航站
            arrvText = "暂无数据"
        } else {
            arrvText = contractList.arrvCity
        };
        let pstText = "";
        if (contractList.pstCity == undefined) {//经停航站
            pstText = "暂无数据"
        } else {
            pstText = contractList.pstCity
        };
        let dptTime = "";
        if (contractList.dpt_time == undefined) {//出发时间
            dptTime = "暂无数据"
        } else {
            // dptTime = contractList.dpt_time.split(",")[0].split(":").join("");
            dptTime = contractList.dpt_time.split(",")[0];
        };
        let arrvTime = "";
        if (contractList.arrv_time == undefined) {//到达时间
            arrvTime = "暂无数据"
        } else {
            // arrvTime = contractList.arrv_time.split(",")[0].split(":").join("")
            arrvTime = contractList.arrv_time.split(",")[1];
        };
        let dptTimeB;
        if (contractList.dpt_time == undefined || contractList.dpt_time.split(",").length < 2) {//返航出发时间
            dptTimeB = "暂无数据"
        } else {
            // dptTimeB = contractList.dpt_time.split(",")[1].split(":").join("");
            dptTimeB = contractList.dpt_time.split(",")[1];
        };
        let arrvTimeB;
        if (contractList.arrv_time == undefined || contractList.arrv_time.split(",").length < 2) {//返航到达时间
            arrvTimeB = "暂无数据"
        } else {
            // arrvTimeB = contractList.arrv_time.split(",")[1].split(":").join("");
            arrvTimeB = contractList.arrv_time.split(",")[0];
        };
        let pstTimeD;
        if (contractList.pst_time == undefined) {//经停出发时间
            pstTimeD = "暂无数据"
        } else {
            // pstTimeD = contractList.pst_time.split(",")[0].split(":").join("");
            pstTimeD = contractList.pst_time.split(",")[0];
        }
        let pstTimeA;
        if (contractList.pst_time == undefined || contractList.pst_time.split(",").length < 2) {//经停到达时间
            pstTimeA = "暂无数据"
        } else {
            // pstTimeA = contractList.pst_time.split(",")[1].split(":").join("");
            pstTimeA = contractList.pst_time.split(",")[1];
        }
        let pstTimeBD;
        if (contractList.pst_time_back == undefined) {//返回经停出发时间
            pstTimeBD = "暂无数据"
        } else {
            // pstTimeBD = contractList.pst_time_back.split(",")[0].split(":").join("");
            pstTimeBD = contractList.pst_time_back.split(",")[0];
        }
        let pstTimeBA;
        if (contractList.pst_time_back == undefined || contractList.pst_time_back.split(",").length < 2) {//返回经停到达时间
            pstTimeBA = "暂无数据"
        } else {
            // pstTimeBA = contractList.pst_time_back.split(",")[1].split(":").join("");
            pstTimeBA = contractList.pst_time_back.split(",")[1];
        };
        if (this.state.contractList.pstName) {//表格样式数据
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
                    <div className={style['airType']} dangerouslySetInnerHTML={{__html:airType}}></div>
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
                        <div>{pstTimeA}</div>
                        <div className={style['underLine']}>{pstTimeBA}</div>
                    </div>
                    <div className={style['tableDetail']}>
                        <div>{pstText}</div>
                        <div className={style['underLine']}>{pstText}</div>
                    </div>
                    <div className={style['tableDetail']}>
                        <div>{pstTimeD}</div>
                        <div className={style['underLine']}>{pstTimeBD}</div>
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
                    {/*<div className={style['airType']}>{airType}</div>*/}
                    <div className={style['airType']} dangerouslySetInnerHTML={{__html:airType}}></div>
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
                        <div>{arrvTime}</div>
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
        let deadlineText="";
        if (contractList.length != 0){//航线数据
            if (contractList.pstName == null && contractList.dptName != undefined && contractList.arrvName != undefined) {
                pathText = contractList.dptName + "-" + contractList.arrvName
            } else if (contractList.pstName != undefined && contractList.dptName != undefined && contractList.arrvName != undefined) {
                pathText = contractList.dptName + "-" + contractList.pstName + "-" + contractList.arrvName
            } else {
                pathText = "暂无数据"
            };
            daysText = contractList.days?contractList.days.split("/").join(""):daysText;
            let timeList;//合同期限数据
            if (contractList.sailingTime == undefined || contractList.sailingTime == "") {
                startTime = ["-", "-", "-"];
                endTime = ["-", "-", "-"];
            } else {
                switch (contractList.sailingTime) {
                    case "整年":
                        deadlineText="为下一年度(含冬春航季和夏秋航季)";
                        break;
                    case "冬春航季":
                        deadlineText='为下一个冬春航季';
                        break;
                    case "夏秋航季":
                        deadlineText="为下一个夏秋航季";
                        break;
                    default:
                        timeList = contractList.sailingTime.split(",");
                        startTime = timeList[0].split("-");
                        endTime = timeList[1].split("-");
                        break
                }
            };
        };
        let priceText='', priceType;
        if (contractList.quote_type){//价格数据组装
            if (contractList.quote_type == "1") {
                if(contractList.quoted_price){
                    priceText = contractList.quoted_price + "万元/班";
                }
                priceType = "定补";
            } else if(contractList.quote_type == "2") {
                if(contractList.quoted_price){
                    priceText = contractList.quoted_price + "万元/小时";
                }
                priceType = "保底";
            } else {
                priceType = "待议";
                priceText = "待议";
            }

        } else {
            priceText = "-";
            priceType = "-";
        };
        let numText = this.state.numText;
        if (contractList.quoteNumber == "" || contractList.quoteNumber == null) {
            numText = "保证金数据异常，请及时联系客服";
        } else {
            numText = contractList.quoteNumber + "(大写:" + contractList.quoteNumberUppercase + ")";
        };
        //下载的地址
        let address = "/downloadSailingAgreement";
        //样式传入
        let {contractStyle={}}=this.props;
        return(
            <div className={style['contractBox']} style={contractStyle}>
                <form id="downLoad" ref={(ref) => this.downLoadText = ref} action={address} method="get" style={{ display: "none" }}>
                    <input type="text" name="id" value={this.state.showId}  readOnly="readonly"/>
                </form>
                <div className={style['detailBox']}>
                    <div className={`${style['detailNav']} ${style['noPrint']}`}>
                        <div className={style['detailNavName']}>协议</div>
                        {/*<Button className={`iconfont ${style['print']}`} onClick={this.printEvent.bind(this)}><span className="iconfont">&#xe655;</span>打印</Button>*/}
                        <div className={style['navRight']}>
                            <Button className={`iconfont ${style['downLoad']}`} onClick={this.downLoad.bind(this)}><span className="iconfont">&#xe663;</span>下载</Button>
                            <div className={`${style['detailNavBtn']}`} onClick={this.closeDetail.bind(this)}><span className={`iconfont ${style['close-icon']}`}>&#xe652;</span></div>
                        </div>
                    </div>
                    <div id="printOut">
                        <div className={style['detailTitle']}>航线开航合作协议书</div>
                        <div className={style['owner']}>甲方:{this.state.contractList.jichangName}</div>
                        <div className={style['owner']}>乙方:{this.state.contractList.hangsiName}</div>
                        <div className={style['owner']}>双方就&nbsp;&nbsp;<span className={style['span']}>{pathText}</span>&nbsp;&nbsp;航线合作事宜，商定如下:</div>
                        <div className={style['owner']} style={{ width: 500, lineHeight: "32px" }}>
                            由<span className={style['span']}>乙方</span>执飞&nbsp;<span className={style['span']}>{pathText}</span>&nbsp;航线,班期为每周<span className={style['span']}>{daysText}</span>, 合作期限{deadlineText?deadlineText:<span>自<span className={style['span']}>{startTime[0]}年{startTime[1]}月{startTime[2]}日</span>起至<span className={style['span']}>{endTime[0]}年{endTime[1]}月{endTime[2]}日</span>止</span>}。具体航线信息如下：
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
            </div>
        )
    }
}