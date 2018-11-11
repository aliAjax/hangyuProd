// author:wangli time:2018-05-27 content:具体机场时刻展示模块
/* eslint-disable */
import React, { Component } from 'react';
import { Select,Button,Pagination,Spin, Breadcrumb } from 'antd';
import { host as $host} from "./../../utils/port";
import {store} from "../../store/index";
import Axios from "./../../utils/axiosInterceptors";
import ArrangeType from "../../components/arrangeType/arrangeType";
import style from "../../static/css/timeDistribution/timeDistributionAirport.scss";
const Option = Select.Option;

export default class TimeDistributionAirport extends Component{
    constructor(props){
        super(props);
        this.state = {
            iata:"",//机场三字码
            getTime:"",//数据更新时间
            orderField:"",//排序字段 dpt_time_sort:出发时间 arr_time_sort:到达时间  flt_nbr_sort:航班号
            orderType:"-1",//排序方式 -1:倒序
            airportName:"",//机场名称
            timeTableList:[],//时刻表数据
            timeList:[],//数据更新时间列表
            imgUrl:null,//图片地址
            timeDistributeList:[//表格数据
                {
                    name:"周一",
                    six:0,
                    seven:0,
                    eight:0,
                    nine:0,
                    ten:0,
                    eleven:0,
                    twelve:0,
                    thirteen:0,
                    fourteen:0,
                    fifteen:0,
                    sixteen:0,
                    seventeen:0,
                    eighteen:0,
                    nineteen:0,
                    twenty:0,
                    twentyOne:0,
                    twentyTwo:0,
                    twentyThree:0,
                    other:0
                },
                {
                    name:"周二",
                    six:0,
                    seven:0,
                    eight:0,
                    nine:0,
                    ten:0,
                    eleven:0,
                    twelve:0,
                    thirteen:0,
                    fourteen:0,
                    fifteen:0,
                    sixteen:0,
                    seventeen:0,
                    eighteen:0,
                    nineteen:0,
                    twenty:0,
                    twentyOne:0,
                    twentyTwo:0,
                    twentyThree:0,
                    other:0
                },
                {
                    name:"周三",
                    six:0,
                    seven:0,
                    eight:0,
                    nine:0,
                    ten:0,
                    eleven:0,
                    twelve:0,
                    thirteen:0,
                    fourteen:0,
                    fifteen:0,
                    sixteen:0,
                    seventeen:0,
                    eighteen:0,
                    nineteen:0,
                    twenty:0,
                    twentyOne:0,
                    twentyTwo:0,
                    twentyThree:0,
                    other:0
                },
                {
                    name:"周四",
                    six:0,
                    seven:0,
                    eight:0,
                    nine:0,
                    ten:0,
                    eleven:0,
                    twelve:0,
                    thirteen:0,
                    fourteen:0,
                    fifteen:0,
                    sixteen:0,
                    seventeen:0,
                    eighteen:0,
                    nineteen:0,
                    twenty:0,
                    twentyOne:0,
                    twentyTwo:0,
                    twentyThree:0,
                    other:0
                },
                {
                    name:"周五",
                    six:0,
                    seven:0,
                    eight:0,
                    nine:0,
                    ten:0,
                    eleven:0,
                    twelve:0,
                    thirteen:0,
                    fourteen:0,
                    fifteen:0,
                    sixteen:0,
                    seventeen:0,
                    eighteen:0,
                    nineteen:0,
                    twenty:0,
                    twentyOne:0,
                    twentyTwo:0,
                    twentyThree:0,
                    other:0
                },
                {
                    name:"周六",
                    six:0,
                    seven:0,
                    eight:0,
                    nine:0,
                    ten:0,
                    eleven:0,
                    twelve:0,
                    thirteen:0,
                    fourteen:0,
                    fifteen:0,
                    sixteen:0,
                    seventeen:0,
                    eighteen:0,
                    nineteen:0,
                    twenty:0,
                    twentyOne:0,
                    twentyTwo:0,
                    twentyThree:0,
                    other:0
                },
                {
                    name:"周日",
                    six:0,
                    seven:0,
                    eight:0,
                    nine:0,
                    ten:0,
                    eleven:0,
                    twelve:0,
                    thirteen:0,
                    fourteen:0,
                    fifteen:0,
                    sixteen:0,
                    seventeen:0,
                    eighteen:0,
                    nineteen:0,
                    twenty:0,
                    twentyOne:0,
                    twentyTwo:0,
                    twentyThree:0,
                    other:0
                }
            ],//时刻分布数据
            offset:1,//分页当前数
            totalCount:0,//数据总条数
            spinType:true,//加载样式 false为不显示
            maodianStyle:false,//锚点样式 false为时刻表
            left: '',
            orderTypeList:[//排列方式
                {
                    name:"flt",
                    type:false
                },{
                    name:"dpt",
                    type:false
                },{
                    name:"arrv",
                    type:false
                }
            ]
        }
    }

    componentWillMount(){  // 将要渲染
        let iata=this.props.match.params.iata.split(",")[0];
        let airportName=this.props.match.params.iata.split(",")[1];
		let airList=store.getState().airList;
		var imgUrl={
		    url:"../../static/img/Slice.png",
            type:false
        };
		for(let i=0;i<airList.length;i++){
            if(airList[i].iata==iata){
			  if(airList[i].navBackground){
			      imgUrl={
			          url:airList[i].navBackground,
                      type:true
                  };
              };
			  break;
            };
		};
		this.setState({
            iata,
            airportName,
            imgUrl
        });
        //请求机场时刻表数据
        let pageNum=(parseInt(this.state.offset)-1)*10;
        Axios({
            method: 'post',
            url: '/getAirportTimeInfo',
            params:{
                itia:iata,
                offset:pageNum
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response)=>{
            if(response.data.opResult==0){
                let firstTime=response.data.timeList[0]
                this.setState({
                    totalCount:response.data.count,
                    timeTableList:response.data.list,
                    timeList:response.data.timeList,
                    getTime:response.data.timeList[0]
                });
                //请求机场时刻分布数据
                Axios({
                    method: 'post',
                    url: '/getAirportTimeDistribution',
                    params:{
                        itia:iata,
                        getTime:firstTime
                    },
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    }
                }).then((response)=>{
                    this.setState({
                        spinType:false
                    })
                    if(response.data.opResult==0){
                        let list=response.data.list;
                        this.dataRegroup(list)
                    }
                });
            }
        });

    }
    //超链接位置设定
    getLeft() {
        if(this.refs.content) {
            let a = this.refs.content.getBoundingClientRect().left;
            this.setState({
                left: `${a + 1100}px`
            }, ()=>{
                // console.info(this.state.left)
            });
        }
    }
    componentDidMount() {   // 加载渲染完成
        if(this.scroll){
            this.getLeft();
            this.scroll.addEventListener('scroll',this.scrollEvent.bind(this));
        }
    }
    componentWillReceiveProps(nextProps){  // Props发生改变
        let iata=nextProps.match.params.iata.split(",")[0];
        let airportName=nextProps.match.params.iata.split(",")[1];
        this.setState({
            iata,
            airportName
        });
        //请求机场时刻表数据
        let pageNum=(parseInt(this.state.offset)-1)*10;
        if(iata!=this.state.iata){
            this.setState({
                timeDistributeList:[
                    {
                        name:"周一",
                        six:0,
                        seven:0,
                        eight:0,
                        nine:0,
                        ten:0,
                        eleven:0,
                        twelve:0,
                        thirteen:0,
                        fourteen:0,
                        fifteen:0,
                        sixteen:0,
                        seventeen:0,
                        eighteen:0,
                        nineteen:0,
                        twenty:0,
                        twentyOne:0,
                        twentyTwo:0,
                        twentyThree:0,
                        other:0
                    },
                    {
                        name:"周二",
                        six:0,
                        seven:0,
                        eight:0,
                        nine:0,
                        ten:0,
                        eleven:0,
                        twelve:0,
                        thirteen:0,
                        fourteen:0,
                        fifteen:0,
                        sixteen:0,
                        seventeen:0,
                        eighteen:0,
                        nineteen:0,
                        twenty:0,
                        twentyOne:0,
                        twentyTwo:0,
                        twentyThree:0,
                        other:0
                    },
                    {
                        name:"周三",
                        six:0,
                        seven:0,
                        eight:0,
                        nine:0,
                        ten:0,
                        eleven:0,
                        twelve:0,
                        thirteen:0,
                        fourteen:0,
                        fifteen:0,
                        sixteen:0,
                        seventeen:0,
                        eighteen:0,
                        nineteen:0,
                        twenty:0,
                        twentyOne:0,
                        twentyTwo:0,
                        twentyThree:0,
                        other:0
                    },
                    {
                        name:"周四",
                        six:0,
                        seven:0,
                        eight:0,
                        nine:0,
                        ten:0,
                        eleven:0,
                        twelve:0,
                        thirteen:0,
                        fourteen:0,
                        fifteen:0,
                        sixteen:0,
                        seventeen:0,
                        eighteen:0,
                        nineteen:0,
                        twenty:0,
                        twentyOne:0,
                        twentyTwo:0,
                        twentyThree:0,
                        other:0
                    },
                    {
                        name:"周五",
                        six:0,
                        seven:0,
                        eight:0,
                        nine:0,
                        ten:0,
                        eleven:0,
                        twelve:0,
                        thirteen:0,
                        fourteen:0,
                        fifteen:0,
                        sixteen:0,
                        seventeen:0,
                        eighteen:0,
                        nineteen:0,
                        twenty:0,
                        twentyOne:0,
                        twentyTwo:0,
                        twentyThree:0,
                        other:0
                    },
                    {
                        name:"周六",
                        six:0,
                        seven:0,
                        eight:0,
                        nine:0,
                        ten:0,
                        eleven:0,
                        twelve:0,
                        thirteen:0,
                        fourteen:0,
                        fifteen:0,
                        sixteen:0,
                        seventeen:0,
                        eighteen:0,
                        nineteen:0,
                        twenty:0,
                        twentyOne:0,
                        twentyTwo:0,
                        twentyThree:0,
                        other:0
                    },
                    {
                        name:"周日",
                        six:0,
                        seven:0,
                        eight:0,
                        nine:0,
                        ten:0,
                        eleven:0,
                        twelve:0,
                        thirteen:0,
                        fourteen:0,
                        fifteen:0,
                        sixteen:0,
                        seventeen:0,
                        eighteen:0,
                        nineteen:0,
                        twenty:0,
                        twentyOne:0,
                        twentyTwo:0,
                        twentyThree:0,
                        other:0
                    }
                ],//时刻分布数据
                offset:1,//分页当前数
                totalCount:0,//数据总条数
                spinType:true,//加载样式 false为不显示
                maodianStyle:false,//锚点样式 false为时刻表
            });
            Axios({
                method: 'post',
                url: '/getAirportTimeInfo',
                params:{
                    itia:iata,
                    offset:pageNum
                },
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }).then((response)=>{
                if(response.data.opResult==0){
                    let firstTime=response.data.timeList[0]
                    this.setState({
                        totalCount:response.data.count,
                        timeTableList:response.data.list,
                        timeList:response.data.timeList,
                        getTime:response.data.timeList[0]
                    });
                    //请求机场时刻分布数据
                    Axios({
                        method: 'post',
                        url: '/getAirportTimeDistribution',
                        params:{
                            itia:iata,
                            getTime:firstTime
                        },
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        }
                    }).then((response)=>{
                        this.setState({
                            spinType:false
                        })
                        if(response.data.opResult==0){
                            let list=response.data.list;
                            this.dataRegroup(list)
                        }
                    });
                }
            });
        }

    }
    componentWillUnmount(){  // 卸载组件

    }

    //返回时刻分布数据处理
    dataRegroup(list){
        //数据重新处理
        //1.分类,正常时刻和红眼航班区分
        let normalList=[];//正常时刻数据列别
        let abnormalityList=[];//红眼时刻数据列表
        for(let i=0;i<list.length;i++){
            if(parseInt(list[i].time)<6){
                abnormalityList.push(list[i])
            }else {
                normalList.push(list[i])
            }
        };
        //2.红眼时刻数据组装
        let monCnt=0,tuesCnt=0,wedCnt=0,thursCnt=0,friCnt=0,staCnt=0,sunCnt=0;
        for(let i=0;i<abnormalityList.length;i++){
            monCnt=parseInt(abnormalityList[i].monCnt)+monCnt;
            tuesCnt=parseInt(abnormalityList[i].tuesCnt)+tuesCnt;
            wedCnt=parseInt(abnormalityList[i].wedCnt)+wedCnt;
            thursCnt=parseInt(abnormalityList[i].thursCnt)+thursCnt;
            friCnt=parseInt(abnormalityList[i].friCnt)+friCnt;
            staCnt=parseInt(abnormalityList[i].staCnt)+staCnt;
            sunCnt=parseInt(abnormalityList[i].sunCnt)+sunCnt;
        };
        //3.正常时刻数据重构
        let timeDistributeList =this.state.timeDistributeList;
        for(let i=0;i<timeDistributeList.length;i++){
            for(let j=0;j<normalList.length;j++){
                switch (i){
                    case 0:
                        switch (normalList[j].time){
                            case "06":
                                timeDistributeList[i].six=normalList[j].monCnt
                                break;
                            case "07":
                                timeDistributeList[i].seven=normalList[j].monCnt
                                break;
                            case "08":
                                timeDistributeList[i].eight=normalList[j].monCnt
                                break;
                            case "09":
                                timeDistributeList[i].nine=normalList[j].monCnt
                                break;
                            case "10":
                                timeDistributeList[i].ten=normalList[j].monCnt
                                break;
                            case "11":
                                timeDistributeList[i].eleven=normalList[j].monCnt
                                break;
                            case "12":
                                timeDistributeList[i].twelve=normalList[j].monCnt
                                break;
                            case "13":
                                timeDistributeList[i].thirteen=normalList[j].monCnt
                                break;
                            case "14":
                                timeDistributeList[i].fourteen=normalList[j].monCnt
                                break;
                            case "15":
                                timeDistributeList[i].fifteen=normalList[j].monCnt
                                break;
                            case "16":
                                timeDistributeList[i].sixteen=normalList[j].monCnt
                                break;
                            case "17":
                                timeDistributeList[i].seventeen=normalList[j].monCnt
                                break;
                            case "18":
                                timeDistributeList[i].eighteen=normalList[j].monCnt
                                break;
                            case "19":
                                timeDistributeList[i].nineteen=normalList[j].monCnt
                                break;
                            case "20":
                                timeDistributeList[i].twenty=normalList[j].monCnt
                                break;
                            case "21":
                                timeDistributeList[i].twentyOne=normalList[j].monCnt
                                break;
                            case "22":
                                timeDistributeList[i].twentyTwo=normalList[j].monCnt
                                break;
                            case "23":
                                timeDistributeList[i].twentyThree=normalList[j].monCnt
                                break;
                            default:
                                timeDistributeList[i].other=monCnt
                                break;
                        }
                        break;
                    case 1:
                        switch (normalList[j].time){
                            case "06":
                                timeDistributeList[i].six=normalList[j].tuesCnt
                                break;
                            case "07":
                                timeDistributeList[i].seven=normalList[j].tuesCnt
                                break;
                            case "08":
                                timeDistributeList[i].eight=normalList[j].tuesCnt
                                break;
                            case "09":
                                timeDistributeList[i].nine=normalList[j].tuesCnt
                                break;
                            case "10":
                                timeDistributeList[i].ten=normalList[j].tuesCnt
                                break;
                            case "11":
                                timeDistributeList[i].eleven=normalList[j].tuesCnt
                                break;
                            case "12":
                                timeDistributeList[i].twelve=normalList[j].tuesCnt
                                break;
                            case "13":
                                timeDistributeList[i].thirteen=normalList[j].tuesCnt
                                break;
                            case "14":
                                timeDistributeList[i].fourteen=normalList[j].tuesCnt
                                break;
                            case "15":
                                timeDistributeList[i].fifteen=normalList[j].tuesCnt
                                break;
                            case "16":
                                timeDistributeList[i].sixteen=normalList[j].tuesCnt
                                break;
                            case "17":
                                timeDistributeList[i].seventeen=normalList[j].tuesCnt
                                break;
                            case "18":
                                timeDistributeList[i].eighteen=normalList[j].tuesCnt
                                break;
                            case "19":
                                timeDistributeList[i].nineteen=normalList[j].tuesCnt
                                break;
                            case "20":
                                timeDistributeList[i].twenty=normalList[j].tuesCnt
                                break;
                            case "21":
                                timeDistributeList[i].twentyOne=normalList[j].tuesCnt
                                break;
                            case "22":
                                timeDistributeList[i].twentyTwo=normalList[j].tuesCnt
                                break;
                            case "23":
                                timeDistributeList[i].twentyThree=normalList[j].tuesCnt
                                break;
                            default:
                                timeDistributeList[i].other=tuesCnt
                                break;
                        }
                        break;
                    case 2:
                        switch (normalList[j].time){
                            case "06":
                                timeDistributeList[i].six=normalList[j].wedCnt
                                break;
                            case "07":
                                timeDistributeList[i].seven=normalList[j].wedCnt
                                break;
                            case "08":
                                timeDistributeList[i].eight=normalList[j].wedCnt
                                break;
                            case "09":
                                timeDistributeList[i].nine=normalList[j].wedCnt
                                break;
                            case "10":
                                timeDistributeList[i].ten=normalList[j].wedCnt
                                break;
                            case "11":
                                timeDistributeList[i].eleven=normalList[j].wedCnt
                                break;
                            case "12":
                                timeDistributeList[i].twelve=normalList[j].wedCnt
                                break;
                            case "13":
                                timeDistributeList[i].thirteen=normalList[j].wedCnt
                                break;
                            case "14":
                                timeDistributeList[i].fourteen=normalList[j].wedCnt
                                break;
                            case "15":
                                timeDistributeList[i].fifteen=normalList[j].wedCnt
                                break;
                            case "16":
                                timeDistributeList[i].sixteen=normalList[j].wedCnt
                                break;
                            case "17":
                                timeDistributeList[i].seventeen=normalList[j].wedCnt
                                break;
                            case "18":
                                timeDistributeList[i].eighteen=normalList[j].wedCnt
                                break;
                            case "19":
                                timeDistributeList[i].nineteen=normalList[j].wedCnt
                                break;
                            case "20":
                                timeDistributeList[i].twenty=normalList[j].wedCnt
                                break;
                            case "21":
                                timeDistributeList[i].twentyOne=normalList[j].wedCnt
                                break;
                            case "22":
                                timeDistributeList[i].twentyTwo=normalList[j].wedCnt
                                break;
                            case "23":
                                timeDistributeList[i].twentyThree=normalList[j].wedCnt
                                break;
                            default:
                                timeDistributeList[i].other=wedCnt
                                break;
                        }
                        break;
                    case 3:
                        switch (normalList[j].time){
                            case "06":
                                timeDistributeList[i].six=normalList[j].thursCnt
                                break;
                            case "07":
                                timeDistributeList[i].seven=normalList[j].thursCnt
                                break;
                            case "08":
                                timeDistributeList[i].eight=normalList[j].thursCnt
                                break;
                            case "09":
                                timeDistributeList[i].nine=normalList[j].thursCnt
                                break;
                            case "10":
                                timeDistributeList[i].ten=normalList[j].thursCnt
                                break;
                            case "11":
                                timeDistributeList[i].eleven=normalList[j].thursCnt
                                break;
                            case "12":
                                timeDistributeList[i].twelve=normalList[j].thursCnt
                                break;
                            case "13":
                                timeDistributeList[i].thirteen=normalList[j].thursCnt
                                break;
                            case "14":
                                timeDistributeList[i].fourteen=normalList[j].thursCnt
                                break;
                            case "15":
                                timeDistributeList[i].fifteen=normalList[j].thursCnt
                                break;
                            case "16":
                                timeDistributeList[i].sixteen=normalList[j].thursCnt
                                break;
                            case "17":
                                timeDistributeList[i].seventeen=normalList[j].thursCnt
                                break;
                            case "18":
                                timeDistributeList[i].eighteen=normalList[j].thursCnt
                                break;
                            case "19":
                                timeDistributeList[i].nineteen=normalList[j].thursCnt
                                break;
                            case "20":
                                timeDistributeList[i].twenty=normalList[j].thursCnt
                                break;
                            case "21":
                                timeDistributeList[i].twentyOne=normalList[j].thursCnt
                                break;
                            case "22":
                                timeDistributeList[i].twentyTwo=normalList[j].thursCnt
                                break;
                            case "23":
                                timeDistributeList[i].twentyThree=normalList[j].thursCnt
                                break;
                            default:
                                timeDistributeList[i].other=thursCnt
                                break;
                        }
                        break;
                    case 4:
                        switch (normalList[j].time){
                            case "06":
                                timeDistributeList[i].six=normalList[j].friCnt
                                break;
                            case "07":
                                timeDistributeList[i].seven=normalList[j].friCnt
                                break;
                            case "08":
                                timeDistributeList[i].eight=normalList[j].friCnt
                                break;
                            case "09":
                                timeDistributeList[i].nine=normalList[j].friCnt
                                break;
                            case "10":
                                timeDistributeList[i].ten=normalList[j].friCnt
                                break;
                            case "11":
                                timeDistributeList[i].eleven=normalList[j].friCnt
                                break;
                            case "12":
                                timeDistributeList[i].twelve=normalList[j].friCnt
                                break;
                            case "13":
                                timeDistributeList[i].thirteen=normalList[j].friCnt
                                break;
                            case "14":
                                timeDistributeList[i].fourteen=normalList[j].friCnt
                                break;
                            case "15":
                                timeDistributeList[i].fifteen=normalList[j].friCnt
                                break;
                            case "16":
                                timeDistributeList[i].sixteen=normalList[j].friCnt
                                break;
                            case "17":
                                timeDistributeList[i].seventeen=normalList[j].friCnt
                                break;
                            case "18":
                                timeDistributeList[i].eighteen=normalList[j].friCnt
                                break;
                            case "19":
                                timeDistributeList[i].nineteen=normalList[j].friCnt
                                break;
                            case "20":
                                timeDistributeList[i].twenty=normalList[j].friCnt
                                break;
                            case "21":
                                timeDistributeList[i].twentyOne=normalList[j].friCnt
                                break;
                            case "22":
                                timeDistributeList[i].twentyTwo=normalList[j].friCnt
                                break;
                            case "23":
                                timeDistributeList[i].twentyThree=normalList[j].friCnt
                                break;
                            default:
                                timeDistributeList[i].other=friCnt;
                                break;
                        }
                        break;
                    case 5:
                        switch (normalList[j].time){
                            case "06":
                                timeDistributeList[i].six=normalList[j].staCnt
                                break;
                            case "07":
                                timeDistributeList[i].seven=normalList[j].staCnt
                                break;
                            case "08":
                                timeDistributeList[i].eight=normalList[j].staCnt
                                break;
                            case "09":
                                timeDistributeList[i].nine=normalList[j].staCnt
                                break;
                            case "10":
                                timeDistributeList[i].ten=normalList[j].staCnt
                                break;
                            case "11":
                                timeDistributeList[i].eleven=normalList[j].staCnt
                                break;
                            case "12":
                                timeDistributeList[i].twelve=normalList[j].staCnt
                                break;
                            case "13":
                                timeDistributeList[i].thirteen=normalList[j].staCnt
                                break;
                            case "14":
                                timeDistributeList[i].fourteen=normalList[j].staCnt
                                break;
                            case "15":
                                timeDistributeList[i].fifteen=normalList[j].staCnt
                                break;
                            case "16":
                                timeDistributeList[i].sixteen=normalList[j].staCnt
                                break;
                            case "17":
                                timeDistributeList[i].seventeen=normalList[j].staCnt
                                break;
                            case "18":
                                timeDistributeList[i].eighteen=normalList[j].staCnt
                                break;
                            case "19":
                                timeDistributeList[i].nineteen=normalList[j].staCnt
                                break;
                            case "20":
                                timeDistributeList[i].twenty=normalList[j].staCnt
                                break;
                            case "21":
                                timeDistributeList[i].twentyOne=normalList[j].staCnt
                                break;
                            case "22":
                                timeDistributeList[i].twentyTwo=normalList[j].staCnt
                                break;
                            case "23":
                                timeDistributeList[i].twentyThree=normalList[j].staCnt
                                break;
                            default:
                                timeDistributeList[i].other=staCnt;
                                break;
                        }
                        break;
                    case 6:
                        switch (normalList[j].time){
                            case "06":
                                timeDistributeList[i].six=normalList[j].sunCnt
                                break;
                            case "07":
                                timeDistributeList[i].seven=normalList[j].sunCnt
                                break;
                            case "08":
                                timeDistributeList[i].eight=normalList[j].sunCnt
                                break;
                            case "09":
                                timeDistributeList[i].nine=normalList[j].sunCnt
                                break;
                            case "10":
                                timeDistributeList[i].ten=normalList[j].sunCnt
                                break;
                            case "11":
                                timeDistributeList[i].eleven=normalList[j].sunCnt
                                break;
                            case "12":
                                timeDistributeList[i].twelve=normalList[j].sunCnt
                                break;
                            case "13":
                                timeDistributeList[i].thirteen=normalList[j].sunCnt
                                break;
                            case "14":
                                timeDistributeList[i].fourteen=normalList[j].sunCnt
                                break;
                            case "15":
                                timeDistributeList[i].fifteen=normalList[j].sunCnt
                                break;
                            case "16":
                                timeDistributeList[i].sixteen=normalList[j].sunCnt
                                break;
                            case "17":
                                timeDistributeList[i].seventeen=normalList[j].sunCnt
                                break;
                            case "18":
                                timeDistributeList[i].eighteen=normalList[j].sunCnt
                                break;
                            case "19":
                                timeDistributeList[i].nineteen=normalList[j].sunCnt
                                break;
                            case "20":
                                timeDistributeList[i].twenty=normalList[j].sunCnt
                                break;
                            case "21":
                                timeDistributeList[i].twentyOne=normalList[j].sunCnt
                                break;
                            case "22":
                                timeDistributeList[i].twentyTwo=normalList[j].sunCnt
                                break;
                            case "23":
                                timeDistributeList[i].twentyThree=normalList[j].sunCnt
                                break;
                            default:
                                timeDistributeList[i].other=sunCnt;
                                break;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        this.setState({
            timeDistributeList
        })
    }

    //跳转回时刻查询首页
    timeDistribution(){
        window.location.href = "#/timeDistribution";
    }

    //选择更新时间
    handleChange(value){
        this.setState({
            getTime:value,
            spinType:true
        });
        Axios({
            method: 'post',
            url: '/getAirportTimeInfo',
            params:{
                itia:this.state.iata,
                offset:0,
                getTime:value,
                orderField:this.state.orderField,
                orderType:this.state.orderType
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response)=> {
            console.log(response)
            if(response.data.opResult==0){
                this.setState({
                    totalCount:response.data.count,
                    timeTableList:response.data.list,
                    orderTypeList:[
                        {
                            name:"flt",
                            type:false
                        },{
                            name:"dpt",
                            type:false
                        },{
                            name:"arrv",
                            type:false
                        }
                    ]
                });
                //请求机场时刻分布数据
                Axios({
                    method: 'post',
                    url: '/getAirportTimeDistribution',
                    params:{
                        itia:this.state.iata,
                        getTime:value
                    },
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    }
                }).then((response)=>{
                    this.setState({
                        spinType:false
                    })
                    if(response.data.opResult==0){
                        let list=response.data.list;
                       this.dataRegroup(list);
                    }
                });
            }
        })
    }

    //更改分页页数
    choosePage(pageNumber){
        this.setState({
            offset:parseInt(pageNumber),
            spinType:true
        });
        let offset=(parseInt(pageNumber)-1)*10
        Axios({
            method: 'post',
            url: '/getAirportTimeInfo',
            params:{
                itia:this.state.iata,
                offset,
                getTime:this.state.getTime,
                orderField:this.state.orderField,
                orderType:this.state.orderType
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response)=> {
            if(response.data.opResult==0){
                this.setState({
                    timeTableList:response.data.list,
                    spinType:false
                });
            }
        })
    }

    //航班号排序
    changeDaysType(data){//data:排序类型
        let orderField="flt_nbr_sort";
        let orderType="-1";
        let orderTypeList=this.state.orderTypeList;
        orderTypeList[0].type=data;
        if(this.state.orderTypeList[0].type){
                orderType="1"
        };
        this.setState({
            spinType:true
        });
        Axios({
            method: 'post',
            url: '/getAirportTimeInfo',
            params:{
                itia:this.state.iata,
                offset:"0",
                getTime:this.state.getTime,
                orderField,
                orderType
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response)=> {
            console.log(response)
            if(response.data.opResult==0){
                this.setState({
                    totalCount:response.data.count,
                    timeTableList:response.data.list,
                    orderTypeList,
                    orderType,
                    offset:1,
                    spinType:false
                });
            }
        })
    }

    //出发时间
    changeDptTimeType(data){//data:排序类型
        let orderField="dpt_time_sort";
        let orderType="-1";
        let orderTypeList=this.state.orderTypeList;
        orderTypeList[1].type=data;
        if(this.state.orderTypeList[1].type){
            orderType="1"
        };
        this.setState({
            spinType:true
        });
        Axios({
            method: 'post',
            url: '/getAirportTimeInfo',
            params:{
                itia:this.state.iata,
                offset:"0",
                getTime:this.state.getTime,
                orderField,
                orderType
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response)=> {
            if(response.data.opResult==0){
                this.setState({
                    totalCount:response.data.count,
                    timeTableList:response.data.list,
                    orderTypeList,
                    orderType,
                    offset:1,
                    spinType:false
                });
            }
        })
    }

    //到达时间
    changeArrvTimeType(data){//data:排序类型
        let orderField="arr_time_sort";
        let orderType="-1";
        let orderTypeList=this.state.orderTypeList;
        orderTypeList[2].type=data;
        if(this.state.orderTypeList[2].type){
            orderType="1"
        };
        this.setState({
            spinType:true
        });
        Axios({
            method: 'post',
            url: '/getAirportTimeInfo',
            params:{
                itia:this.state.iata,
                offset:"0",
                getTime:this.state.getTime,
                orderField,
                orderType
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response)=> {
            console.log(response)
            if(response.data.opResult==0){
                this.setState({
                    totalCount:response.data.count,
                    timeTableList:response.data.list,
                    orderTypeList,
                    orderType,
                    offset:1,
                    spinType:false
                });
            }
        })
    }

    //锚点事件
    scrollEvent(event){
        if(event.target.scrollTop>=596){
            this.setState({
                maodianStyle:true
            })
        }else{
            this.setState({
                maodianStyle:false
            })
        }
    }

    //回到顶部
    toTop(){
        this.scroll.scrollTop=0
    }

    //到底部
    toBottom(){
        this.scroll.scrollTop=596
    }

    //导出表格
    deriveEvent(){
        this.downLoad.submit()
    }

    render(){
        let totalCount=this.state.totalCount;
        let imgUrl=this.state.imgUrl.url.toString();
        console.info(imgUrl);
        let imgType=this.state.imgUrl.type;
        let paginationStyle,paginationText;
        let spinType=style['noShow'];
        if(totalCount!=0){
            paginationStyle=style['paginationStyle']
            paginationText=style['noShow']
        }else {
            paginationStyle=style['noShow']
            paginationText=style['paginationStyle']
        };
        if(this.state.spinType){
            spinType=style['spin']
        };
        let maoTimeStyle=style['timeTable']
        let maoDistributionStyle=style['timeDistribute']
        if(this.state.maodianStyle){
            maoTimeStyle=style['timeDistribute']
            maoDistributionStyle=style['timeTable']
        };
        let address="/jxlExcel";
        return(
            <div ref={(data)=>this.scroll=data} className={`router-context scroll ${style['allBox']}`} style={{backgroundColor:"#f8f8f8",color:"#605e7c"}}>
                <div className={spinType}>
                {/*<div className={style['spin']}>*/}
                    <Spin tip="数据加载中"/>
                </div>
                <form ref={(ref)=>this.downLoad=ref} method="post" action={address} style={{display:"none"}}>
                    <input type="text" name="itia" value={this.state.iata}/>
                    <input type="text" name="getTime" value={this.state.getTime}/>
                    <input type="text" name="orderField" value={this.state.orderField}/>
                    <input type="text" name="orderType" value={this.state.orderType}/>
                </form>
                <div className={style['content']} ref={'content'}>
                    <Breadcrumb separator="》" style={{position: 'absolute', top: '-50px', left: '0', fontSize: '1.6rem'}}>
                        <Breadcrumb.Item href="#/timeDistribution">时刻查询</Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.airportName}</Breadcrumb.Item>
                    </Breadcrumb>
                        {/*<span onClick={this.timeDistribution.bind(this)}>时刻查询</span>》<span>{this.state.airportName}</span>*/}
                    <div className={style['contentBox']}>
                        <div className={style['leftBox']}>
                            <div className={style['imgBox']}>
								{
									imgType ? <img src={imgUrl} alt=""/> : <img src={require("../../static/img/Slice.png")} alt=""/>
								}
                                <div className={style['showTitle']}>{this.state.airportName}</div>
                            </div>
                            <div className={style['timeTableBox']}>
                                <div className={style['timeTableTitleBox']}>
                                    <div className={style['alarm']}><span className="iconfont">&#xe741;</span>时刻表</div>
                                    <div className={style['refreshTime']}>
                                        数据更新时间
                                        <Select value={this.state.getTime} style={{ width: 110 }} onChange={this.handleChange.bind(this)}>
                                            {
                                                this.state.timeList.map((item,index)=>{
                                                    return <Option key={index} value={item}>{item}</Option>
                                                })
                                            }
                                        </Select>
                                    </div>
                                </div>
                                <div className={style['schedule']}>
                                    <div className={style['scheduleTitle']}>
                                        <div className={style['scheduleName']}>{this.state.airportName}班期时刻分布表</div>
                                        <Button className={style['scheduleOut']} onClick={this.deriveEvent.bind(this)}><span className="iconfont">&#xe650;</span>导出</Button>
                                    </div>
                                    <div className={style['scheduleTable']}>
                                        <div className={style['dpt']}>出发地</div>
                                        <div className={style['arrv']}>到达地</div>
                                        <div>
                                            <ArrangeType arrangeType={this.state.orderTypeList[0].type} title={'航班号'} arrangeTypeEvent={(data)=>this.changeDaysType(data)}/>
                                        </div>
                                        <div className={style['aircrftTyp']}>机型</div>
                                        <div>
                                            <ArrangeType arrangeType={this.state.orderTypeList[1].type} title={'出发时间'} arrangeTypeEvent={(data)=>this.changeDptTimeType(data)}/>
                                        </div>
                                        <div className={style['startAirport']}>出发机场</div>
                                        <div>
                                            <ArrangeType arrangeType={this.state.orderTypeList[2].type} title={'到达时间'} arrangeTypeEvent={(data)=>this.changeArrvTimeType(data)}/>
                                        </div>
                                        <div className={style['endAirport']}>到达机场</div>
                                        <div className={style['days']}>班期</div>
                                    </div>
                                    {
                                        this.state.timeTableList.slice(0,9).map((item,index)=>{
                                            let tableStyle;
                                            if(index%2==0){
                                                tableStyle=style['scheduleTable1']
                                            }else {
                                                tableStyle=style['scheduleTable']
                                            }
                                            return <div key={index} className={tableStyle}>
                                                <div className={style['dpt']}>{item.dpt_AirPt_Cd}</div>
                                                <div className={style['arrv']}>{item.arrv_Airpt_Cd}</div>
                                                <div className={style['fltNum']}>{item.flt_nbr}</div>
                                                <div className={style['aircrftTyp']}>{item.airCrft_Typ}</div>
                                                <div className={style['startTime']}>{item.lcl_Dpt_Tm}</div>
                                                <div className={style['startAirport']}>{item.dpt_AirPt_pot}</div>
                                                <div className={style['endTime']}>{item.lcl_Arrv_Tm}</div>
                                                <div className={style['endAirport']}>{item.arrv_Airpt_pot}</div>
                                                <div className={style['days']}>{item.days}</div>
                                            </div>
                                        })
                                    }
                                    <div className={paginationStyle}>
                                        <Pagination showQuickJumper defaultPageSize={10} current={this.state.offset} total={this.state.totalCount} onChange={this.choosePage.bind(this)} />
                                    </div>
                                    <div className={paginationText}>暂无数据</div>
                                </div>
                            </div>
                            <div className={style['timeDistributeBox']}>
                                <div className={style['timeDistributeTitle']}>
                                    <span className="iconfont">&#xe64f;</span>时刻分布
                                </div>
                                <div className={style['timeDistributeTable']}>
                                    <div className={style['timeDistributeTableTitle']}>
                                        <div>
                                            {this.state.airportName}班期时刻分布表
                                        </div>
                                    </div>
                                    <div className={style['timeList']}>
                                        <div className={style['timeList1']}></div>
                                        <div className={style['timeListStyle']}>
                                            <div>06:00</div>
                                            <div>07:00</div>
                                        </div>
                                        <div className={style['timeListStyle']}>
                                            <div>08:00</div>
                                            <div>09:00</div>
                                        </div>
                                        <div className={style['timeListStyle']}>
                                            <div>10:00</div>
                                            <div>11:00</div>
                                        </div>
                                        <div className={style['timeListStyle']}>
                                            <div>12:00</div>
                                            <div>13:00</div>
                                        </div>
                                        <div className={style['timeListStyle']}>
                                            <div>14:00</div>
                                            <div>15:00</div>
                                        </div>
                                        <div className={style['timeListStyle']}>
                                            <div>16:00</div>
                                            <div>17:00</div>
                                        </div>
                                        <div className={style['timeListStyle']}>
                                            <div>18:00</div>
                                            <div>19:00</div>
                                        </div>
                                        <div className={style['timeListStyle']}>
                                            <div>20:00</div>
                                            <div>21:00</div>
                                        </div>
                                        <div className={style['timeListStyle']}>
                                            <div>22:00</div>
                                            <div>23:00</div>
                                        </div>
                                        <div className={style['timeListLast']}>24:00及以后</div>
                                    </div>
                                    {
                                        this.state.timeDistributeList.map((item,index)=>{
                                            let listItemStyle,listStyle,listStyle1,listStyleLast;
                                            listStyle1=style['listStyle1'];
                                            listStyleLast=style['listStyleLast'];
                                            listStyle=style['listStyle']
                                            if(index%2==0){
                                                listItemStyle=style['listItemStyle0'];
                                            }else {
                                                listItemStyle=style['listItemStyle1'];
                                            };
                                            let sixStyle=(parseInt(item.six)+1)/2+5;
                                            if(parseInt(item.six)>=80){
                                                sixStyle=81/1.2+3
                                            };
                                            let sixNum=193-Math.ceil(parseInt(item.six)*0.8);
                                            let sixColor=`rgb(236,${sixNum},134`;
                                            let sixText=<span className="iconfont" style={{fontSize:sixStyle,color:sixColor}}>&#xe651;
                                                <span className={style['hover']}>{item.six}</span>
                                            </span>;

                                            let sevenStyle=(parseInt(item.seven)+1)/2+5;
                                            if(parseInt(item.seven)>=80){
                                                sevenStyle=81/1.2+3
                                            };
                                            let sevenNum=193-Math.ceil(parseInt(item.seven)*0.8);
                                            let sevenColor=`rgb(236,${sevenNum},134`;
                                            let sevenText=<span className="iconfont" style={{fontSize:sevenStyle,color:sevenColor}}>&#xe651;<span className={style['hover']}>{item.seven}</span></span>;

                                            let eightStyle=(parseInt(item.eight)+1)/2+5;
                                            if(parseInt(item.eight)>=80){
                                                eightStyle=81/1.2+3
                                            };
                                            let eightNum=193-Math.ceil(parseInt(item.eight)*0.8);
                                            let eightColor=`rgb(236,${eightNum},134`;
                                            let eightText=<span className="iconfont" style={{fontSize:eightStyle,color:eightColor}}>&#xe651;<span className={style['hover']}>{item.eight}</span></span>;

                                            let nineStyle=(parseInt(item.nine)+1)/2+5;
                                            if(parseInt(item.nine)>=80){
                                                nineStyle=81/1.2+3
                                            };
                                            let nineNum=193-Math.ceil(parseInt(item.nine)*0.8);
                                            let nineColor=`rgb(236,${nineNum},134`;
                                            let nineText=<span className="iconfont" style={{fontSize:nineStyle,color:nineColor}}>&#xe651;<span className={style['hover']}>{item.nine}</span></span>;

                                            let tenStyle=(parseInt(item.ten)+1)/2+5;
                                            if(parseInt(item.ten)>=80){
                                                tenStyle=81/1.2+3
                                            };
                                            let tenNum=193-Math.ceil(parseInt(item.ten)*0.8);
                                            let tenColor=`rgb(236,${tenNum},134`;
                                            let tenText=<span className="iconfont" style={{fontSize:tenStyle,color:tenColor}}>&#xe651;<span className={style['hover']}>{item.ten}</span></span>;

                                            let elevenStyle=(parseInt(item.eleven)+1)/2+5;
                                            if(parseInt(item.eleven)>=80){
                                                elevenStyle=81/1.2+3
                                            };
                                            let elevenNum=193-Math.ceil(parseInt(item.eleven)*0.8);
                                            let elevenColor=`rgb(236,${elevenNum},134`;
                                            let elevenText=<span className="iconfont" style={{fontSize:elevenStyle,color:elevenColor}}>&#xe651;<span className={style['hover']}>{item.eleven}</span></span>;

                                            let twelveStyle=(parseInt(item.twelve)+1)/2+5;
                                            if(parseInt(item.twelve)>=80){
                                                twelveStyle=81/1.2+3
                                            };
                                            let twelveNum=193-Math.ceil(parseInt(item.twelve)*0.8);
                                            let twelveColor=`rgb(236,${twelveNum},134`;
                                            let twelveText=<span className="iconfont" style={{fontSize:twelveStyle,color:twelveColor}}>&#xe651;<span className={style['hover']}>{item.twelve}</span></span>;

                                            let thirteenStyle=(parseInt(item.thirteen)+1)/2+5;
                                            if(parseInt(item.thirteen)>=80){
                                                thirteenStyle=81/1.2+3
                                            };
                                            let thirteenNum=193-Math.ceil(parseInt(item.thirteen)*0.8);
                                            let thirteenColor=`rgb(236,${thirteenNum},134`;
                                            let thirteenText=<span className="iconfont" style={{fontSize:thirteenStyle,color:thirteenColor}}>&#xe651;<span className={style['hover']}>{item.thirteen}</span></span>;

                                            let fourteenStyle=(parseInt(item.fourteen)+1)/2+5;
                                            if(parseInt(item.fourteen)>=80){
                                                fourteenStyle=81/1.2+3
                                            };
                                            let fourteenNum=193-Math.ceil(parseInt(item.fourteen)*0.8);
                                            let fourteenColor=`rgb(236,${fourteenNum},134`;
                                            let fourteenText=<span className="iconfont" style={{fontSize:fourteenStyle,color:fourteenColor}}>&#xe651;<span className={style['hover']}>{item.fourteen}</span></span>;

                                            let fifteenStyle=(parseInt(item.fifteen)+1)/2+5;
                                            if(parseInt(item.fifteen)>=80){
                                                fifteenStyle=81/1.2+3
                                            };
                                            let fifteenNum=193-Math.ceil(parseInt(item.fifteen)*0.8);
                                            let fifteenColor=`rgb(236,${fifteenNum},134`;
                                            let fifteenText=<span className="iconfont" style={{fontSize:fifteenStyle,color:fifteenColor}}>&#xe651;<span className={style['hover']}>{item.fifteen}</span></span>;

                                            let sixteenStyle=(parseInt(item.sixteen)+1)/2+5;
                                            if(parseInt(item.sixteen)>=80){
                                                sixteenStyle=81/1.2+3
                                            };
                                            let sixteenNum=193-Math.ceil(parseInt(item.sixteen)*0.8);
                                            let sixteenColor=`rgb(236,${sixteenNum},134`;
                                            let sixteenText=<span className="iconfont" style={{fontSize:sixteenStyle,color:sixteenColor}}>&#xe651;<span className={style['hover']}>{item.sixteen}</span></span>;

                                            let seventeenStyle=(parseInt(item.seventeen)+1)/2+5;
                                            if(parseInt(item.seventeen)>=80){
                                                seventeenStyle=81/1.2+3
                                            };
                                            let seventeenNum=193-Math.ceil(parseInt(item.seventeen)*0.8);
                                            let seventeenColor=`rgb(236,${seventeenNum},134`;
                                            let seventeenText=<span className="iconfont" style={{fontSize:seventeenStyle,color:seventeenColor}}>&#xe651;<span className={style['hover']}>{item.seventeen}</span></span>;

                                            let eighteenStyle=(parseInt(item.eighteen)+1)/2+5;
                                            if(parseInt(item.eighteen)>=80){
                                                eighteenStyle=81/1.2+3
                                            };
                                            let eighteenNum=193-Math.ceil(parseInt(item.eighteen)*0.8);
                                            let eighteenColor=`rgb(236,${eighteenNum},134`;
                                            let eighteenText=<span className="iconfont" style={{fontSize:eighteenStyle,color:eighteenColor}}>&#xe651;<span className={style['hover']}>{item.eighteen}</span></span>;

                                            let nineteenStyle=(parseInt(item.nineteen)+1)/2+5;
                                            if(parseInt(item.nineteen)>=80){
                                                nineteenStyle=81/1.2+3
                                            };
                                            let nineteenNum=193-Math.ceil(parseInt(item.nineteen)*0.8);
                                            let nineteenColor=`rgb(236,${nineteenNum},134`;
                                            let nineteenText=<span className="iconfont" style={{fontSize:nineteenStyle,color:nineteenColor}}>&#xe651;<span className={style['hover']}>{item.nineteen}</span></span>;

                                            let twentyStyle=(parseInt(item.twenty)+1)/2+5;
                                            if(parseInt(item.twenty)>=80){
                                                twentyStyle=81/1.2+3
                                            };
                                            let twentyNum=193-Math.ceil(parseInt(item.twenty)*0.8);
                                            let twentyColor=`rgb(236,${twentyNum},134`;
                                            let twentyText=<span className="iconfont" style={{fontSize:twentyStyle,color:twentyColor}}>&#xe651;<span className={style['hover']}>{item.twenty}</span></span>;

                                            let twentyOneStyle=(parseInt(item.twentyOne)+1)/2+5;
                                            if(parseInt(item.twentyOne)>=80){
                                                twentyOneStyle=81/1.2+3
                                            };
                                            let twentyOneNum=193-Math.ceil(parseInt(item.twentyOne)*0.8);
                                            let twentyOneColor=`rgb(236,${twentyOneNum},134`;
                                            let twentyOneText=<span className="iconfont" style={{fontSize:twentyOneStyle,color:twentyOneColor}}>&#xe651;<span className={style['hover']}>{item.twentyOne}</span></span>;

                                            let twentyTwoStyle=(parseInt(item.twentyTwo)+1)/2+5;
                                            if(parseInt(item.twentyTwo)>=80){
                                                twentyTwoStyle=81/1.2+3
                                            };
                                            let twentyTwoNum=193-Math.ceil(parseInt(item.twentyTwo)*0.8);
                                            let twentyTwoColor=`rgb(236,${twentyTwoNum},134`;
                                            let twentyTwoText=<span className="iconfont" style={{fontSize:twentyTwoStyle,color:twentyTwoColor}}>&#xe651;<span className={style['hover']}>{item.twentyTwo}</span></span>;

                                            let twentyThreeStyle=(parseInt(item.twentyThree)+1)/2+5;
                                            if(parseInt(item.twentyThree)>=80){
                                                twentyThreeStyle=81/1.2+3
                                            };
                                            let twentyThreeNum=193-Math.ceil(parseInt(item.twentyThree)*0.8);
                                            let twentyThreeColor=`rgb(236,${twentyThreeNum},134`;
                                            let twentyThreeText=<span className="iconfont" style={{fontSize:twentyThreeStyle,color:twentyThreeColor}}>&#xe651;<span className={style['hover']}>{item.twentyThree}</span></span>;

                                            let otherStyle=(parseInt(item.other)+1)/2+5;
                                            if(parseInt(item.other)>=80){
                                                otherStyle=81/1.2+3
                                            };
                                            let otherNum=193-Math.ceil(parseInt(item.other)*0.8);
                                            let otherColor=`rgb(236,${otherNum},134`;
                                            let otherText=<span className="iconfont" style={{fontSize:otherStyle,color:otherColor}}>&#xe651;<span className={style['hover']}>{item.other}</span></span>;
                                            return <div className={listItemStyle} key={index}>
                                                        <div className={style['listStyle1']}>{item.name}</div>
                                                        <div className={style['listStyle']}>
                                                            <div>{sixText}</div>
                                                            <div>{sevenText}</div>
                                                        </div>
                                                        <div className={style['listStyle']}>
                                                            <div>{eightText}</div>
                                                            <div>{nineText}</div>
                                                        </div>
                                                        <div className={style['listStyle']}>
                                                            <div>{tenText}</div>
                                                            <div>{elevenText}</div>
                                                        </div>
                                                        <div className={style['listStyle']}>
                                                            <div>{twelveText}</div>
                                                            <div>{thirteenText}</div>
                                                        </div>
                                                        <div className={style['listStyle']}>
                                                            <div>{fourteenText}</div>
                                                            <div>{fifteenText}</div>
                                                        </div>
                                                        <div className={style['listStyle']}>
                                                            <div>{sixteenText}</div>
                                                            <div>{seventeenText}</div>
                                                        </div>
                                                        <div className={style['listStyle']}>
                                                            <div>{eighteenText}</div>
                                                            <div>{nineteenText}</div>
                                                        </div>
                                                        <div className={style['listStyle']}>
                                                            <div>{twentyText}</div>
                                                            <div>{twentyOneText}</div>
                                                        </div>
                                                        <div className={style['listStyle']}>
                                                            <div>{twentyTwoText}</div>
                                                            <div>{twentyThreeText}</div>
                                                        </div>
                                                        <div className={style['listStyleLast']}>{otherText}</div>
                                                    </div>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={style['rightBox']} style={{left: this.state.left}}>
                            <div>
                                <div className={maoTimeStyle} onClick={this.toTop.bind(this)}><span className="iconfont">&#xe741;</span>时刻表</div>
                                <div className={maoDistributionStyle} onClick={this.toBottom.bind(this)}><span className="iconfont">&#xe64f;</span>时刻分布</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}