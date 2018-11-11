// author:wangli time:2018-05-06 content:首页市场信息模块
import React, { Component } from 'react';
import Axios from "./../../utils/axiosInterceptors";
import emitter from '../../utils/events';
import { store } from "../../store/index";
import style from './../../static/css/demandList/demandList.scss';
import HangsiDemandItem from './hangsiDemandItem';
import AirportDemandItem from './airPortDemandItem';
import { message } from "antd";

export default class MarketDemand extends Component {
    constructor(props) {
        super(props);
        this.openNewForm=this.openNewForm.bind(this);
        this.state = {
            aType:false,//是否显示超链接流程引导 false:不显示
            itia: "",//匹配三字码
            num: 1,//初始化渲染数据数据
            releaseTime: true,//发布时间样式,false为升序
            matchingDegree: false,//匹配度样式，false为升序
            arrangeType: false,//下划线样式,false为发布时间
            role: 0,//角色判断 0是航司
            page: 1,//初始请求数据页数
            maxPage: false,//最大请求,false为未达到最大请求数据
            noteText: "",//没有数据时提示
            initData: [],//数据列表
            subsidyPolicy: "",//其他 1为选择
            fixedSupplement: "",//定补 1为选择
            bottomPreservation: "",//保底  1为选择
            isMatch: "",//我匹配的
            isCurrentUserResponsed: "",//我响应的
            airlineType: "",//筛选-航司类型
            internationalAirline: "",//筛选-航线类型
            conditions: this.props.conditions//父组件传递的筛选条件
        }
    }
    //修改是否收藏的方法
    changeCollectEvent(data, demandId, index) {//data:是否收藏 demangdID：需求id index：需求所在位置
        let initData = this.state.initData;
        initData[index].collectType = data;
        let collectId = initData[index].collectId;
        this.setState({
            initData
        });
        if (data == 1) {
            Axios({ //增加收藏
                method: 'post',
                url: '/addCollect',
                params: {
                    demandIds: demandId
                },
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                if (response.data.opResult == 0) {
                    initData[index].demandId = response.data.list[0].key;
                    initData[index].collectId = response.data.list[0].val;
                    this.setState({
                        initData
                    })
                } else {
                }
            })
        } else if (data == 0) {
            Axios({ //删除收藏
                method: 'post',
                url: '/delCollect',
                params: {
                    collectId
                },
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                if (response.data.opResult == 0) {
                } else {
                }
            })
        }
    };

    // 升序方法
    ascendingOrder(type) {//type:升序类型
        let initData = this.state.initData;
        switch (type) {
            case "startTime"://发布时间
                initData = initData.sort(function (a, b) {
                    return parseInt(a.releasetime.split(" ").join("").split("-").join("").split(":").join("")) - parseInt(b.releasetime.split(" ").join("").split("-").join("").split(":").join(""));
                });
                this.setState({
                    initData
                })
                break;
            case "matchingDegree"://匹配度（待完善）
                initData = initData.sort(function (a, b) {
                    return a.receiveSchemeNum - b.receiveSchemeNum;
                });
                this.setState({
                    initData
                })
            default:
                break;
        }
    };

    //降序方法
    descendingOrder(type) {//type:降序类型
        let initData = this.state.initData;
        switch (type) {
            case "startTime"://发布时间
                initData.sort(function (a, b) {
                    return parseInt(b.releasetime.split(" ").join("").split("-").join("").split(":").join("")) - parseInt(a.releasetime.split(" ").join("").split("-").join("").split(":").join(""));
                });
                this.setState({
                    initData
                })
                break;
            case "matchingDegree"://匹配度
                initData.sort(function (a, b) {
                    return b.receiveSchemeNum - a.receiveSchemeNum;
                });
                this.setState({
                    initData
                })
            default:
                break;
        }
    };

    //根据发布时间显示列表信息
    changeReleaseTime() {
        // this.ascendingOrder("startTime");
        this.setState({
            arrangeType: false,
        })
    };

    // TODO:根据匹配度显示列表信息
    changeMatchingDegree() {
        this.descendingOrder("matchingDegree");
        this.setState({
            arrangeType: true
        })
    };

    //按发布时间顺序显示
    changeArrangeTimeMethod(e) {
        e.stopPropagation();
        this.descendingOrder("startTime");
        const arrangeType = this.state.arrangeType;
        if (arrangeType) {
            this.setState({
                arrangeType: false
            })
        } else {
            switch (this.state.releaseTime) {
                case false:
                    this.descendingOrder("startTime");
                    this.setState({
                        releaseTime: !this.state.releaseTime,
                    })
                    break;
                case true:
                    this.ascendingOrder("startTime");
                    this.setState({
                        releaseTime: !this.state.releaseTime,
                    })
                    break;
                default:
                    break;
            }
        }
    };

    //按匹配度顺序显示
    changeArrangeDegreeMethod(e) {
        e.stopPropagation();
        this.ascendingOrder("matchingDegree");
        const arrangeType = this.state.arrangeType;
        if (arrangeType == false) {
            this.setState({
                arrangeType: true
            })
        } else {
            switch (this.state.matchingDegree) {
                case false:
                    this.descendingOrder("matchingDegree");
                    this.setState({
                        matchingDegree: !this.state.matchingDegree,
                    })
                    break;
                case true:
                    this.ascendingOrder("matchingDegree");
                    this.setState({
                        matchingDegree: !this.state.matchingDegree,
                    })
                    break;
                default:
                    break;
            }
            this.setState({
                matchingDegree: !this.state.matchingDegree
            })
        }
    };

    componentWillMount() {  // 将要渲染
        //判断登陆角色类型
        let role;
        let name = store.getState().role.airlineretrievalcondition;
        if (store.getState().role.role) {
            role = store.getState().role.role
        } else {
            role = 0
        };
        this.ascendingOrder("startTime");
        this.setState({
            role
        })
        //请求需要渲染的数据
        Axios({
            method: 'post',
            url: '/getOthersDemandListIndex',
            params: {
                page: 1
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            if (response.data.opResult == 0) {
                this.setState(() => ({
                    initData: response.data.list.list
                }));
                this.props.queryNum(response.data.list.totalCount)
            } else if (response.data.opResult == 1) {
                this.setState({
                    aType:true,
                    maxPage: true,//最大请求,false为未达到最大请求数据
                })
            }
        })
    };

    //监听滚动条位置
    onScrollHandle(event) {
        const clientHeight = event.target.clientHeight;
        const scrollHeight = event.target.scrollHeight;
        const scrollTop = event.target.scrollTop;
        const isBottom = (clientHeight + scrollTop === scrollHeight);
        isBottom ? setTimeout(this.lazy(), 20000) : "";//延时加载
    };

    //显示没有数据模块
    showNoData() {
        let _this = this;
        let noteText = this.state.noteText;
        noteText = "没有更多数据了"
        this.setState({
            noteText
        });
        setTimeout(function () {
            noteText = "";
            _this.setState({
                noteText
            })
        }, 1000)
    };

    //滚动加载更多数据
    lazy() {
        let initData = this.state.initData;
        let page = this.state.page;
        page = page + 1;
        if (this.state.maxPage) {//判断是否已经到达数据数量上限
            this.showNoData()
        } else {
            Axios({
                method: 'post',
                url: '/getOthersDemandListIndex',
                params: {
                    page,
                    itia: this.state.itia,
                    subsidyPolicy: this.state.subsidyPolicy,
                    fixedSupplement: this.state.fixedSupplement,
                    bottomPreservation: this.state.bottomPreservation,
                    airlineType: this.state.airlineType,
                    internationalAirline: this.state.internationalAirline,
                    isMatch: this.state.isMatch,
                    isCurrentUserResponsed: this.state.isCurrentUserResponsed
                },
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                let initData = this.state.initData;
                if (response.data.opResult == 0) {
                    let dataList = response.data.list.list;
                    if (dataList.length == 0) {
                        this.showNoData()
                        this.setState({
                            maxPage: true,
                            page
                        })
                    } else {
                        for (let i = 0; i < dataList.length; i++) {
                            initData.push(dataList[i])
                        };
                        this.setState({
                            initData,
                            page
                        });
                    };
                } else {
                    this.setState({
                        maxPage: true,
                        page
                    });
                }
            })
        }
    };

    //加载更多数据
    getMoreData() {
        this.lazy();
    };

    componentDidMount() {   // 加载渲染完成
        if (this.contentNode) {
            this.contentNode.addEventListener('scroll', this.onScrollHandle.bind(this));
        };
    };

    componentWillReceiveProps(nextProps) {  // Props发生改变
        const { conditions, mac, res, searchMes } = nextProps;
        let subsidyPolicy = "";//补贴方式（其他） 1为有值 否则没有
        let fixedSupplement = "";//补贴方式（定补） 1为有值 否则没有
        let bottomPreservation = "";//补贴方式（保底） 1为有值 否则没有
        let airlineType = "";//航司类型
        let internationalAirline = "";//航线类型
        let isMatch = mac ? "1" : "";//我匹配的
        let isCurrentUserResponsed = res ? "1" : "";//我响应的
        let itia = "";
        try {
            itia = searchMes.code
        } catch (e) {

        };
        try {
            airlineType = conditions.conditions.airportType;
        } catch (e) {

        };
        try {
            internationalAirline = conditions.conditions.airType;
        } catch (e) {

        };
        try {
            for (let i = 0; i < conditions.conditions.subsidyPolicy.s.length; i++) {
                if (conditions.conditions.subsidyPolicy.s[i] == "保底") {
                    bottomPreservation = 1
                } else if (conditions.conditions.subsidyPolicy.s[i] == "定补") {
                    fixedSupplement = 1
                } else if (conditions.conditions.subsidyPolicy.s[i] == "待议") {
                    subsidyPolicy = 1
                }
            };
        } catch (e) {

        };
        if (internationalAirline != this.state.internationalAirline || subsidyPolicy != this.state.subsidyPolicy || airlineType !== this.state.airlineType || fixedSupplement != this.state.fixedSupplement || bottomPreservation != this.state.bottomPreservation || isMatch != this.state.isMatch || isCurrentUserResponsed != this.state.isCurrentUserResponsed || itia != this.state.itia) {
            Axios({
                method: 'post',
                url: '/getOthersDemandListIndex',
                params: {
                    page: 1,
                    internationalAirline,
                    subsidyPolicy,
                    airlineType,
                    fixedSupplement,
                    bottomPreservation,
                    isMatch,
                    isCurrentUserResponsed,
                    itia
                },
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                if (response.data.opResult == 0) {
                    let maxPage = response.data.list.totalCount < 10 ? true : false;
                    this.setState(() => ({
                        initData: response.data.list.list,
                        page: 1,
                        maxPage
                    }));
                    this.props.queryNum(response.data.list.totalCount)
                } else if (response.data.opResult == 1) {
                    this.setState({
                        initData: [],
                        page: 1,
                        maxPage: true,//最大请求,false为未达到最大请求数据
                    });
                    this.props.queryNum("0")
                } else if (response.data.opResult == 2) {
                    message.error("查询异常,请稍后再试")
                }
            })
        };
        this.setState({
            internationalAirline,
            subsidyPolicy,
            airlineType,
            fixedSupplement,
            bottomPreservation,
            isMatch,
            isCurrentUserResponsed,
            itia
        });
    };
    componentWillUnmount() {  // 卸载组件
        if (this.contentNode) {
            this.contentNode.removeEventListener('scroll', this.onScrollHandle.bind(this));
        }
    };

    //重新发布表单
    openNewForm(){
        let fromData = {
            openFrom:true,
            fromType:this.state.role == '1' ? 0 : 1,
            fromMes: {
                transmit: {
                    bianjiAgain: false,
                }
            }
        };
        emitter.emit('openFrom',fromData);
    };

    render() {
        const { releaseTime, matchingDegree, arrangeType, role, initData } = this.state;
        //三角样式判断
        let releaseTimeTop, releaseTimeBottom, matchingDegreeTop, matchingDegreeBottom, arrangeTypeTime, arrangeTypeDegree;
        if (releaseTime) {//发布时间三角样式
            releaseTimeTop = style['demand-list-top-triangle1'];
            releaseTimeBottom = style['demand-list-bottom-triangle1']
        } else {
            releaseTimeTop = style['demand-list-top-triangle0'];
            releaseTimeBottom = style['demand-list-bottom-triangle0']
        };
        if (matchingDegree) {//匹配度三角样式
            matchingDegreeTop = style['demand-list-top-triangle1'];
            matchingDegreeBottom = style['demand-list-bottom-triangle1']
        } else {
            matchingDegreeTop = style['demand-list-top-triangle0'];
            matchingDegreeBottom = style['demand-list-bottom-triangle0']
        };
        //排列样式下划线
        if (arrangeType) {
            arrangeTypeDegree = style['demand-filter-style']
        } else {
            arrangeTypeTime = style['demand-filter-style']
        };
        let newOpenForm="";
        if(role==1){
            newOpenForm=<span>暂无匹配闲置运力，您可以<span className={style['reForm']} onClick={this.openNewForm}>发布</span>一条航线需求，等待航司响应。</span>
        }else{
            newOpenForm=<span>暂无匹配航线需求，您可以<span className={style['reForm']} onClick={this.openNewForm}>发布</span>一条运力信息，等待机场用户响应。</span>
        }
        return (
            <div className={style['demand-market']} style={{ position: "relative", zIndex: -1 }}>
                <div className={`${style['demand-list-padding']} ${style['demand-list-filter']}`}>
                    <div
                        className={arrangeTypeTime}
                        onClick={() => {
                            return (
                                this.changeReleaseTime()
                            )
                        }}
                    >
                        <span>发布时间</span>
                                <div className={style['demand-list-triangle']} onClick={(e) => this.changeArrangeTimeMethod(e)}>
                            <div className={releaseTimeTop}></div>
                            <div className={releaseTimeBottom}></div>
                        </div>
                    </div>
                    {/*<div  //功能待完善，等待后台算法完善*/}
                    {/*className={arrangeTypeDegree}*/}
                    {/*onClick={()=>{*/}
                    {/*return(*/}
                    {/*this.changeMatchingDegree()*/}
                    {/*)*/}
                    {/*}}*/}
                    {/*>*/}
                    {/*匹配度*/}
                    {/*<div className={style['demand-list-triangle']} onScroll={this.scrollEvent.bind(this)} onClick={(e)=>this.changeArrangeDegreeMethod(e)}>*/}
                    {/*<div className={matchingDegreeTop}></div>*/}
                    {/*<div className={matchingDegreeBottom}></div>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                </div>
                <div
                    className={`scroll ${style['demand-market-lazy']}`}
                    // onScroll={this.lazy.bind(this)}
                    ref={node => this.contentNode = node}
                >
                    {
                        this.state.initData.map((item, index) => {
                            // 根据角色类型给组件传递参数
                            if (role == 1) {
                                return <AirportDemandItem key={`airport${index}`} data={item} index={index} changeCollect={(data, demandId, index) => this.changeCollectEvent(data, demandId, index)} />
                            } else if (role == 0) {
                                return <HangsiDemandItem key={`hangsi${index}`} data={item} index={index} changeCollect={(data, demandId, index) => this.changeCollectEvent(data, demandId, index)} />
                            } else {
                                return ""
                            }
                        })
                    }
                </div>
                {
                  this.state.aType && newOpenForm
                }
                <div className={style['get-more-data']}>
                    <div style={{ position: "absolute", top: -26 }}>{this.state.noteText}</div>
                    {/*<Button onClick={this.getMoreData.bind(this)}>更多数据</Button>*/}
                </div>
            </div>
        )
    }
}