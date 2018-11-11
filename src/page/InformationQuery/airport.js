import React, {Component} from 'react';
import Axios from './../../utils/axiosInterceptors'
import echarts from 'echarts'
import { Spin, Breadcrumb } from 'antd';
import { store } from "../../store/index";
import style from './../../static/css/InformationQuery/airport.scss'
import AirportInfo from './airportInfo'
import slice from '../../static/img/Slice.png'
import noimg from '../../static/img/pubo/noimg.png';

export default class Airport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetail: true,
            isInfo: true,
            resonShow: false,  // 特殊机场形成原因
            flytypeShow: false,  // 可降机型
            img: '',  // 机场图片
            spinShow: true,  // 加载中是否展示
            detailBtnShow: false,  // 更多按钮是否显示
            detailInfoShow: false,  // 更多组件是否显示
            years: '',
            infoData: {},
            newsData: null,
            showNewsDetail: false,  // 是否显示新闻
            spinNewsShow: true,  // 新闻加载中。。。
            left: '',
        };
    }
    getBaseInfo() {
        let airport = document.getElementById('airport');
        airport.scrollTop = 0;
        /*this.setState({
            isInfo: true,
        })*/
    }
    getNews(){
        let airport = document.getElementById('airport');
        //获取新闻定位点
        let news = document.getElementById('news');
        airport.scrollTop = news.offsetTop - 200;
        /*this.setState({
            isInfo: false,
        })*/
    }
    airportInfo(){
        this.setState({
            detailInfoShow: true
        })
    }
    closeDetail(){
        this.setState({
            detailInfoShow: false
        })
    }
    openWindow(src) {
        window.open(src);
    }
    turnData(num,n){
        let newNum = [];
        num.forEach(item =>{
            newNum.push(item*100000 /(Math.pow(10,n+5)));
        });
        return newNum.reverse();
    }
    drawLine(data){
        let myChart1 = echarts.init(document.getElementById('myChart1')),
            myChart2 = echarts.init(document.getElementById('myChart2')),
            myChart3 = echarts.init(document.getElementById('myChart3'));
        myChart1.setOption({
            tooltip: {
            },
            xAxis: {
                data: this.state.years
            },
            yAxis: {
                name:'单位:1000万',
                //data: ["0","1","2","3","4","5","6"],
                type : 'value',
                splitLine: {
                    lineStyle: {
                        color: ['#aaa'],
                        type:'dashed'
                    }
                }
            },
            grid: {
                left: '50'
            },
            series: [{
                name: '旅客吞吐量',
                type: 'line',
                data:this.turnData(data.passengerThroughputs,7)
            }]
        });
        myChart2.setOption({
            tooltip: {
            },
            xAxis: {
                data: this.state.years
            },
            yAxis: {
                name:'单位:10万',
                //data:["0","1","2","3","4","5","6"]
                type : 'value',
                splitLine: {
                    lineStyle: {
                        color: ['#aaa'],
                        type:'dashed'
                    }
                }
            },
            grid: {
                left: '50'
            },
            series: [{
                name: '货物吞吐量',
                type: 'line',
                data:this.turnData(data.goodsThroughputs,5)
            }]
        });
        myChart3.setOption({
            tooltip: {
            },
            xAxis: {
                data: this.state.years
            },
            yAxis: {
                name:'单位:10万',
                //data: ["0","1","2","3","4","5","6"]
                type : 'value',
                splitLine: {
                    lineStyle: {
                        color: ['#aaa'],
                        type:'dashed'
                    }
                }
            },
            grid: {
                left: '45'
            },
            series: [{
                name: '起降架次',
                type: 'line',
                data:this.turnData(data.takeOffAndLandingFlights,5)
            }]
        });
    }
    getLeft() {
        if(this.refs.content) {
            let a = this.refs.content.getBoundingClientRect().left;
            this.setState({
                left: `${a + 1100}px`
            });
        }
    }
    getData() {
        this.setState({
            detailBtnShow: false,
        });
        Axios({
            method: 'post',
            url: '/loadAirportByCode',
            params: {
                itia: store.getState().searchInfo.mes
            },
            dataType:'json',
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        }).then((response) => {
            if(response.data.opResult == "0") {
                let img, years;
                if(response.data.obj.navBackground == '' || response.data.obj.navBackground == null){
                    img = slice;
                }else {
                    img = response.data.obj.navBackground
                }
                if(response.data.obj && response.data.obj.years) {
                    years = response.data.obj.years.reverse();
                }else {
                    years = false;
                }
                this.setState({
                    infoData: response.data.obj,
                    img: img,
                    years: years,
                    showDetail: true,
                    spinShow: false,
                    detailBtnShow: true,
                }, () => {
                    if(this.state.years) {
                        this.drawLine(this.state.infoData);
                    }
                })
            }else {
                this.setState({
                    showDetail: false,
                    spinShow: false,
                })
            }
        });
        Axios({  // 请求新闻舆情数据
            method: 'post',
            url: '/loadAirportOpinionByCode',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
                itia: store.getState().searchInfo.mes
            }
        })
            .then((response) => {
                let showNewsDetail = false;
                let spinNewsShow = true;
                let newsData = null;
                if(response.data.opResult == 0) {
                    showNewsDetail = true;
                    spinNewsShow = false;
                    newsData = response.data.opinions;
                }else {
                    showNewsDetail = false;
                    spinNewsShow = false;
                }
                this.setState({
                    showNewsDetail,
                    spinNewsShow,
                    newsData,
                })
            })
    }
    select(state) {
        return state.searchInfo
    }
    handleChange() {
        let currentValue;
        currentValue = this.select(store.getState());
        if(currentValue.type == 'airport') {
            this.setState({
                spinShow: true,
                spinNewsShow: true,
                showNewsDetail: false,
                detailInfoShow: false,
            }, ()=>{
                this.getData();
            });
        }
    }
    onScroll() {
        // 获取新闻定位点
        let news = '';
        news = document.getElementById('news');
        if (news) {
            if (this.refs.myAirport.scrollTop >= news.offsetTop - 200) {
                this.setState({
                    isInfo: false
                });
            } else {
                this.setState({
                    isInfo: true
                });
            }
        }
    }
    componentDidMount() {
        this.getLeft();
        this.getData();
        /*判断redux里searchInfo数据是否改变*/
        this.unsubscribe = store.subscribe(this.handleChange.bind(this));
        this.refs.myAirport.addEventListener('scroll', this.onScroll.bind(this));
        window.addEventListener('resize', this.getLeft.bind(this));
    }
    componentWillUnmount() {
        this.unsubscribe();
        this.refs.myAirport.removeEventListener('scroll', this.onScroll.bind(this));
        window.removeEventListener('resize', this.getLeft.bind(this));
    }
    render() {
        return (
            <div className={'router-context'}>
                {
                    this.state.spinShow && <Spin size="large" style={{zIndex: 100}} />
                }
                <div className={`scroll ${style['wrapper']}`} id="airport" ref={'myAirport'}>
                    {
                        this.state.showDetail && <div className={style['content']} ref={'content'} style={{position: 'relative'}}>
                            <Breadcrumb separator="》" style={{position: 'absolute', top: '-50px', left: '0', fontSize: '1.6rem'}}>
                                <Breadcrumb.Item href="#/informationQuery">信息查询</Breadcrumb.Item>
                                <Breadcrumb.Item href="#/allAirport">所有机场</Breadcrumb.Item>
                                <Breadcrumb.Item>机场详情</Breadcrumb.Item>
                            </Breadcrumb>
                            <div className={style['banner']}>
                                <div className={style['airport-img']}>
                                    <img src={this.state.img} alt="" />
                                </div>
                                <div className={style['b-til']}>{this.state.infoData.airlnCdName || "-"}</div>
                                <div className={style['sidebar']} style={{left: this.state.left}}>
                                    <div className={this.state.isInfo ? style['seleted'] : ''} onClick={this.getBaseInfo.bind(this)}><span className={`iconfont ${style['iconfont']}`}>&#xe603;</span>基本信息</div>
                                    <div className={!this.state.isInfo ? style['seleted'] : ''} onClick={this.getNews.bind(this)}><span className={`iconfont ${style['iconfont']}`} >&#xe624;</span>新闻舆情</div>
                                </div>
                            </div>
                            <div className={style['info']}>
                                <div className={style['i-til']}><span className={`iconfont ${style['iconfont']}`}>&#xe603;</span>基本信息</div>
                                <div className={style['i-content']}>
                                    <div className={style['info-box']}>
                                        <ul>
                                            <li><div>机场名字</div><div>{this.state.infoData.airlnCdName || "-"}</div></li>
                                            <li><div>所在城市</div><div>{this.state.infoData.city || "-"}</div></li>
                                            <li><div>所属机场集团</div><div className={style['shipgroup']}>{this.state.infoData.membershipgroup || "-"}</div></li>
                                            <li><div>机场类型</div><div>{this.state.infoData.airpottype || "-"}</div></li>
                                            <li><div>是否特殊机场</div><div>{this.state.infoData.specialairport || "-"}</div></li>
                                            <li><div>飞行区等级</div><div>{this.state.infoData.airfieldlvl || "-"}</div></li>
                                            <li><div>灯光条件</div><div>{this.state.infoData.lightingconditions || "-"}</div></li>
                                            <li><div>是否国际</div><div>{this.state.infoData.inter || "-"}</div></li>
                                            <li><div>国内在飞航点</div><div>{this.state.infoData.domestic || "-"}</div></li>
                                            <li><div>机场专线</div><div>{this.state.infoData.airportshuttlemetro || "-"}</div></li>
                                        </ul>
                                    </div>
                                    <div className={style['info-box']}>
                                        <ul>
                                            <li><div>三字码</div><div>{this.state.infoData.iata || "-"}</div></li>
                                            <li><div>所在区域</div><div>{this.state.infoData.area || "-"}</div></li>
                                            <li><div>通航时间</div><div>{this.state.infoData.departuretime || "-"}</div></li>
                                            <li><div>标高</div><div>{this.state.infoData.airEle || "-"}</div></li>
                                            <li>
                                                <div>特殊机场构成原因</div>
                                                <div onMouseOver={()=>{this.setState({resonShow: true})}}
                                                     onMouseOut={()=>{this.setState({resonShow: false})}}>{this.state.infoData.specialairportwhy || "-"}</div>
                                                {
                                                    (this.state.infoData.specialairportwhy && this.state.resonShow) && <div className={`${style['list-wrapper']} ${!this.state.resonShow ? style['reson-show'] : ''}`}>{this.state.infoData.specialairportwhy || "-"}</div>
                                                }
                                            </li>
                                            <li><div>消防等级</div><div>{this.state.infoData.firelvl || "-"}</div></li>
                                            <li>
                                                <div>可起降机型</div>
                                                <div className={style['fl-type']}
                                                     onMouseOver={()=>{this.setState({flytypeShow: true})}}
                                                     onMouseOut={()=>{this.setState({flytypeShow: false})}}>{this.state.infoData.modelcanhandle || "-"}</div>
                                                {
                                                    <div className={`scroll ${style['list-wrapper']} ${!this.state.flytypeShow ? style['flytype-show'] : ''}`}
                                                           onMouseOver={()=>{this.setState({flytypeShow: true})}}
                                                           onMouseOut={()=>{this.setState({flytypeShow: false})}}>{this.state.infoData.modelcanhandle || "-"}</div>
                                                }
                                            </li>
                                            <li><div>放行准点率</div><div>{this.state.infoData.releasepunctuality || "-"}</div></li>
                                            <li><div>国内在飞航班数量</div><div>{this.state.infoData.intheflight || "-"}</div></li>
                                            <li><div>机场巴士</div><div>{this.state.infoData.airportbus || "-"}</div></li>
                                        </ul>
                                    </div>
                                    <div className={style['info-box']}>
                                        <ul>
                                            <li><div>四字码</div><div>{this.state.infoData.icao || "-"}</div></li>
                                            <li><div>所在战区</div><div>{this.state.infoData.warzone || "-"}</div></li>
                                            <li><div>高原机场</div><div>{this.state.infoData.airpotcls || "-"}</div></li>
                                            <li><div>机型数量</div><div>{this.state.infoData.planepositionnumber || "-"}</div></li>
                                            <li><div>国际在飞航点</div><div>{this.state.infoData.international || "-"}</div></li>
                                            <li><div>距离市区</div><div>{this.state.infoData.distancefromdowntown || "-"}</div></li>
                                        </ul>
                                    </div>
                                    {
                                        this.state.detailBtnShow && <div className={style['airport-info']}
                                                                         onClick={this.airportInfo.bind(this)}><a>更多></a></div>
                                    }
                                </div>
                                <div className={style['i-echart']}>
                                    <div>
                                        <h5>旅客吞吐量</h5>
                                        <div id="myChart1" style={{width:"345px",height:'320px'}}></div>
                                        {
                                            ((!this.state.infoData.passengerThroughputs
                                                || (this.state.infoData.passengerThroughputs && this.state.infoData.passengerThroughputs.length == 0))
                                                && !this.state.years)
                                            && <div className={style['no-data']}>暂无数据</div>
                                        }
                                    </div>
                                    <div>
                                        <h5>货物吞吐量</h5>
                                        <div id="myChart2" style={{width:"345px",height:'320px'}}></div>
                                        {
                                            ((!this.state.infoData.passengerThroughputs
                                                || (this.state.infoData.goodsThroughputs && this.state.infoData.goodsThroughputs.length == 0))
                                                && !this.state.years)
                                            && <div className={style['no-data']}>暂无数据</div>
                                        }
                                    </div>
                                    <div>
                                        <h5>起降架次</h5>
                                        <div id="myChart3" style={{width:"345px",height:'320px'}}></div>
                                        {
                                            ((!this.state.infoData.passengerThroughputs
                                                || (this.state.infoData.takeOffAndLandingFlights && this.state.infoData.takeOffAndLandingFlights.length == 0))
                                                && !this.state.years)
                                            && <div className={style['no-data']}>暂无数据</div>
                                        }
                                    </div>
                                </div>
                                <div className={style['airport-track']}>
                                    <div className={style['track-til']}>
                                        <div>机场跑道数据</div>
                                        {
                                            this.state.infoData.runwayList && <div style={{color: '#3c78ff'}}>共{this.state.infoData.runwayList.length}条</div>
                                        }
                                    </div>
                                    {
                                        this.state.infoData.runwayList ? this.state.infoData.runwayList.map((item, index) => {
                                            return (
                                                <div className={style['track-content']} key={index}>
                                                    <div>跑道{index+1}</div>
                                                    <div><span>编号</span>{item.runwaynumber|| "-"}</div>
                                                    <div><span>等级</span>{item.runwaylvl || "-"}</div>
                                                    <div><span>长度</span>{item.runwaylength|| "-"}</div>
                                                    <div><span>宽度</span>{item.runwaywidth|| "-"}</div>
                                                </div>
                                            )
                                        }) : <div className={style['track-content']}>
                                            <div style={{width: '100%', textAlign: 'center', color: 'red'}}>暂无内容</div>
                                        </div>
                                    }
                                </div>
                                <div className={style['airport-policy']} >
                                    <div className={style['policy-til']}>
                                        <div>相关政策</div>
                                        {
                                            this.state.infoData.rewardPolicyList && <div style={{color: '#3c78ff'}}>共{this.state.infoData.rewardPolicyList.length}条</div>
                                        }
                                    </div>
                                    <div className={style['policy-content']}>
                                        {
                                            this.state.infoData.rewardPolicyList ? this.state.infoData.rewardPolicyList.map((item, index) => {
                                                return (
                                                    <div className={style['policy-content-item']} key={index}>
                                                        <div className={style['time']}>{item.rewardpolicydate|| "--"}</div>
                                                        <div className={style['text']}>
                                                            <div className={style['text-til']}>内容</div>
                                                            <div className={style['text-tent']}>{item.rewardpolicytext|| "--"}</div>
                                                        </div>
                                                    </div>
                                                )
                                            }) : <div className={style['policy-content-item']}>
                                                <div style={{width: '100%', color: 'red', textAlign: 'center'}}>暂无内容</div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className={style['news']} id="news">
                                    <div className={style['n-til']}>
                                        <div className={style['n-name']}><span className={`iconfont ${style['iconfont']}`}>&#xe624;</span>新闻舆情</div>
                                        <div>
                                            {
                                                this.state.showNewsDetail && <a href={`#/publicOpinion/${store.getState().searchInfo.mes}/1`}><span className={style['more']}>查看更多></span></a>
                                            }
                                        </div>
                                    </div>
                                    {
                                        this.state.spinNewsShow && <Spin size="large" style={{zIndex: 100, display: 'block'}} />
                                    }
                                    {
                                        (this.state.showNewsDetail && this.state.newsData) ? this.state.newsData.map((item, index) => {
                                            return (
                                                <div className={style['news-box']} key={index}>
                                                    <div className={style['box-pic']}>
                                                        <img src={item.articleImage||noimg} alt="" />
                                                    </div>
                                                    <div className={style['box-content']}>
                                                        <div className={style['box-til']}>
                                                            <div className={style['name']}><a onClick={this.openWindow.bind(this, item.articleUrl)}>{item.articleTitle}</a></div>
                                                            <div className={style['type']}>
                                                                <div>{item.articleType}</div>
                                                            </div>
                                                        </div>
                                                        <div className={style['box-text']}>{item.articleContent}</div>
                                                        <div className={style['box-foot']}>
                                                            <div className={style['box-net']}>{item.articleFrom}</div>
                                                            <div className={style['box-time']}>{item.articleTime}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }) : (<div style={{color: 'red', textAlign: 'center', lineHeight: '67px'}}>暂无内容</div>)
                                    }
                                </div>
                            </div>
                        </div>
                    }
                    {
                        !this.state.showDetail && <div className={style['content']} style={{color: 'red', textAlign: 'center', lineHeight: '67px'}}>暂无内容,请重新搜索</div>
                    }
                </div>
                {
                    this.state.detailInfoShow && <AirportInfo closeDetail={this.closeDetail.bind(this)}
                                                              myData={this.state.infoData}></AirportInfo>
                }
            </div>
        )
    }
}
