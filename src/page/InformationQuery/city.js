import React, {Component} from 'react';
import Axios from './../../utils/axiosInterceptors'
import { Spin, Breadcrumb } from 'antd';
import echarts from 'echarts'
import { store } from "../../store/index";
import style from './../../static/css/InformationQuery/city.scss'
import noimg from '../../static/img/pubo/noimg.png';
import slice from '../../static/img/Slice.png'

export default class Airline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoData:{},
            qyCode:'',
            showDetail:true,
            enterpriseShow:false,
            collegeShow:false,
            site4aShow:false,
            site5aShow:false,
            roadPointShow:false,
            roadPointShow1:false,
            isInfo:true,
            img: '',
            spinShow: true,
            newsData: null,
            showNewsDetail: false,  // 是否显示新闻
            spinNewsShow: true,  // 新闻加载中。。。
            echartShow: true,  // echart是否显示
            left: '',
        }
    };
    drawLine(data){
        let myChart1 = echarts.init(document.getElementById('myChart1')),
            myChart2 = echarts.init(document.getElementById('myChart2')),
            myChart3 = echarts.init(document.getElementById('myChart3'));
        myChart1.setOption({
            tooltip: {
            },
            legend: {
                data:['旅游收入','旅游人次'],
                itemGap :340,
                left:5,
                top:5
            },
            backgroundColor:'#fbfbfb',
            xAxis: {
                data: [2015,2016,2017],
                axisLine:{
                    lineStyle :{
                        color: '#605e7c'
                    }
                }
            },
            yAxis: [
                {
                    name:'单位：亿元',
                    //data: ["0","1","2","3","4","5","6"],
                    type : 'value',
                    axisLine:{
                        lineStyle :{
                            color: '#605e7c'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['#aaa'],
                            type:'dashed'
                        }
                    }
                },
                {
                    name:'单位：万人',
                    type : 'value',
                    //inverse: true,
                    //nameLocation: 'start',
                    axisLine:{
                        lineStyle :{
                            color: '#605e7c'
                        }
                    }
                }
            ],
            series: [{
                    name: '旅游收入',
                    type: 'line',
                    data: [null,this.state.infoData.culturaleducationyYears ? this.state.infoData.culturaleducationyYears[0].tourismincome : '',null],
                    color:['#605e7c']
                },
                {
                    name: '旅游人次',
                    type: 'bar',
                    data: [0,this.state.infoData.culturaleducationyYears ? this.state.infoData.culturaleducationyYears[0].passengersnumberyear : '',0],
                    barWidth:'30%',
                    color:['red']
                }]
        });
        myChart2.setOption({
            tooltip: {
            },
            legend: {
                data:['城市GDP'],
                left:5,
                top:5
            },
            backgroundColor:'#fbfbfb',
            xAxis: {
                data: [2015,2016,2017],
                axisLine:{
                    lineStyle :{
                        color: '#605e7c'
                    }
                }
            },
            yAxis: {
                name:'单位：亿元',
                //data: ["0","1","2","3","4","5","6"],
                type : 'value',
                axisLine:{
                    lineStyle :{
                        color: '#605e7c'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#aaa'],
                        type:'dashed'
                    }
                }
            },
            series: {
                name: '城市GDP',
                type: 'line',
                data: [null,parseFloat(this.state.infoData.economicYears[0].citygdp),null],
                color:['#605e7c']
            }
        });
        myChart3.setOption({
            tooltip: {
            },
            legend: {
                data:['常驻人口'],
                right:10,
                top:25
            },
            backgroundColor:'#fbfbfb',
            xAxis: {
                data: [2015,2016,2017],
                axisLine:{
                    lineStyle :{
                        color: '#605e7c'
                    }
                }
            },
            yAxis: {
                name:'单位：万人',
                //data: ["0","1","2","3","4","5","6"],
                type : 'value',
                axisLine:{
                    lineStyle :{
                        color: '#605e7c'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#aaa'],
                        type:'dashed'
                    }
                }
            },
            series: {
                name: '常驻人口',
                type: 'bar',
                barWidth:'30%',
                data: [null,parseFloat(this.state.infoData.populations[0].residentpgenumber),null],
                color:['#605e7c']
            }
        });
    }
    getBaseInfo(){
        let city = document.getElementById('city');
        city.scrollTop = 0;
        /*this.setState({
            isInfo: true
        })*/
    }
    getNews(){
        let city = document.getElementById('city');

        //获取新闻定位点
        let news = document.getElementById('news');
        city.scrollTop = news.offsetTop - 200;
        /*this.setState({
            isInfo: false
        })*/
    }
    openWindow(src) {
        window.open(src);
    }
    getData(){
        Axios({
            method: 'post',
            url: '/getCityDetail',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
                cityName: store.getState().searchInfo.mes
            }
        })
        .then((response) => {
            if(response.data.opResult == "0"){
                let img, years;
                if( response.data.citys[0].navBackground == '' ||  response.data.citys[0].navBackground == null){
                    img = slice;
                }else {
                    img = response.data.citys[0].navBackground
                }
                this.setState({
                    showDetail: true,
                    infoData: response.data.citys[0],
                    img: img,
                    spinShow: false,
                });
                this.drawLine(response.data.citys[0]);
            }else{
                this.setState({
                    showDetail: false,
                    spinShow: false,
                });
            }
        })
        Axios({
            method: 'post',
            url: '/loadCityOpinionByCode',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
                cityName: store.getState().searchInfo.mes
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
        if(currentValue.type == 'city') {
            this.setState({
                spinShow: true,
                spinNewsShow: true,
                showNewsDetail: false,
            }, ()=>{
                this.getData();
            });
        }
    }
    onScroll() {
        //获取新闻定位点
        let news = '';
        news = document.getElementById('news');
        if (news) {
            if(this.refs.myCity.scrollTop >= news.offsetTop - 200) {
                this.setState({
                    isInfo: false
                })
            }else {
                this.setState({
                    isInfo: true
                })
            }
        }
    }
    getLeft() {
        if(this.refs.content) {
            let a = this.refs.content.getBoundingClientRect().left;
            this.setState({
                left: `${a + 1100}px`
            });
        }
    }
    componentDidMount() {
        this.getLeft();
        this.getData();
        /*判断redux里searchInfo数据是否改变*/
        this.unsubscribe = store.subscribe(this.handleChange.bind(this));
        this.refs.myCity.addEventListener('scroll', this.onScroll.bind(this));
        window.addEventListener('resize', this.getLeft.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe();
        this.refs.myCity.removeEventListener('scroll', this.onScroll.bind(this));
        window.removeEventListener('resize', this.getLeft.bind(this));
    }
    render() {
        return (
            <div className={'router-context'}>
                {
                    this.state.spinShow && <Spin size="large" style={{zIndex: 100}} />
                }
                <div className={style['wrapper']} id="city" ref={'myCity'}>
                    {
                        this.state.showDetail ? (<div className={style['content']} ref={'content'} style={{position: 'relative'}}>
                            <Breadcrumb separator="》" style={{position: 'absolute', top: '-50px', left: '0', fontSize: '1.6rem'}}>
                                <Breadcrumb.Item href="#/informationQuery">信息查询</Breadcrumb.Item>
                                <Breadcrumb.Item href="#/allCity">所有城市</Breadcrumb.Item>
                                <Breadcrumb.Item>城市详情</Breadcrumb.Item>
                            </Breadcrumb>
                            <div className={style['banner']}>
                                <div className={style['airport-img']}><img src={this.state.img} alt="" /></div>
                                <div className={style['b-til']}>{this.state.infoData.cityname || "-"}</div>
                                <div className={style['sidebar']} style={{left: this.state.left}}>
                                    <div className={this.state.isInfo ? style['seleted'] : ''} onClick={this.getBaseInfo.bind(this)}><span className={`iconfont ${style['iconfont']}`}>&#xe603;</span>基本信息</div>
                                    <div className={!this.state.isInfo ? style['seleted'] : ''} onClick={this.getNews.bind(this)}><span className={`iconfont ${style['iconfont']}`}>&#xe624;</span>新闻舆情</div>
                                </div>
                            </div>
                            <div className={style['info']}>
                                <div className={style['i-til']}><span className={`iconfont ${style['iconfont']}`}>&#xe603;</span>基本信息</div>
                                <div className={style['i-content']}>
                                    <div className={style['info-box']}>
                                        <ul>
                                            <li><div className={style['name']}>城市名称</div><div className={style['text']}>{this.state.infoData.cityname || "-"}</div></li>
                                            <li><div className={style['name']}>城市类型</div><div className={style['text']}>{this.state.infoData.citytype || "-"}</div></li>
                                            <li><div className={style['name']}>大型企业数量</div><div className={style['text']}>{this.state.infoData.largeenterprisenumber || "-"}</div></li>
                                            <li><div className={style['name']}>著名高校数量</div><div className={style['text']}>{this.state.infoData.famousuniversities || "-"}</div></li>
                                            <li><div className={style['name']}>4A景点数量</div><div className={style['text']}>{this.state.infoData.sitesnumber4a || "-"}</div></li>
                                            <li><div className={style['name']}>5A景点数量</div><div className={style['text']}>{this.state.infoData.sitesnumber5a || "-"}</div></li>
                                        </ul>
                                    </div>
                                    <div className={style['info-box']}>
                                        <ul>
                                            <li><div className={style['name']}>所在省份</div>
                                                <div className={style['text']}>{this.state.infoData.provinces || "-"}</div></li>
                                            <li><div className={style['name']}>机场</div><div className={style['text']}>{this.state.infoData.airport || "-"}</div></li>
                                            <li>
                                                <div className={style['name']}>企业枚举</div>
                                                <div className={`${style['overflow-item']} ${style['text']}`}
                                                     onMouseOver={()=>{this.setState({enterpriseShow: true})}}
                                                     onMouseOut={()=>{this.setState({enterpriseShow: false})}}>{this.state.infoData.enterpriseenumeration || "-"}</div>
                                                <div className={`${style['list-wrapper']} ${!this.state.enterpriseShow ? style['display-none']: ''}`}
                                                     onMouseOver={()=>{this.setState({enterpriseShow: true})}}
                                                     onMouseOut={()=>{this.setState({enterpriseShow: false})}}>{this.state.infoData.enterpriseenumeration || "-"}</div>
                                            </li>
                                            <li>
                                                <div className={style['name']}>高校枚举</div>
                                                <div className={`${style['overflow-item']} ${style['text']}`}
                                                     onMouseOver={()=>{this.setState({collegeShow: true})}}
                                                     onMouseOut={()=>{this.setState({collegeShow: false})}}>{this.state.infoData.famousuniversitiesenumeration || "-"}</div>
                                                <div className={`${style['list-wrapper']} ${!this.state.collegeShow ? style['display-none']: ''}`}
                                                     onMouseOver={()=>{this.setState({collegeShow: true})}}
                                                     onMouseOut={()=>{this.setState({collegeShow: false})}}>{this.state.infoData.famousuniversitiesenumeration || "-"}</div>
                                            </li>
                                            <li>
                                                <div className={style['name']}>4A景点枚举</div>
                                                <div className={`${style['overflow-item']} ${style['text']}`}
                                                     onMouseOver={()=>{this.setState({site4aShow: true})}}
                                                     onMouseOut={()=>{this.setState({site4aShow: false})}}>{this.state.infoData.sitesenumeration4a || "-"}</div>
                                                <div className={`${style['list-wrapper']} ${!this.state.site4aShow ? style['display-none']: ''}`}
                                                     onMouseOver={()=>{this.setState({site4aShow: true})}}
                                                     onMouseOut={()=>{this.setState({site4aShow: false})}} >{this.state.infoData.sitesenumeration4a || "-"}</div>
                                            </li>
                                            <li>
                                                <div className={style['name']}>5A景点枚举</div>
                                                <div className={`${style['overflow-item']} ${style['text']}`}
                                                     onMouseOver={()=>{this.setState({site5aShow: true})}}
                                                     onMouseOut={()=>{this.setState({site5aShow: false})}}>{this.state.infoData.sitesenumeration5a || "-"}</div>
                                                <div className={`${style['list-wrapper']} ${!this.state.site5aShow ? style['display-none']: ''}`}
                                                     onMouseOver={()=>{this.setState({site5aShow: true})}}
                                                     onMouseOut={()=>{this.setState({site5aShow: false})}}>{this.state.infoData.sitesenumeration5a || "-"}</div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className={style['info-box']}>
                                        <ul>
                                            <li><div className={style['name']}>行政区等级</div><div className={style['text']}>{this.state.infoData.citylvl || "-"}</div></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className={style['airport-policy']} >
                                    <div className={style['policy-til']}>
                                        <div>补贴</div>
                                        {
                                            this.state.infoData.policys && <div style={{color: '#3c78ff'}}>共{this.state.infoData.policys.length}条</div>
                                        }
                                    </div>
                                    <div className={style['policy-content']}>
                                        {
                                            this.state.infoData.policys && this.state.infoData.policys.map((item, index) => {
                                                return (
                                                    <div className={style['policy-content-item']} key={index}>
                                                        <div className={style['time']}>{item.policyyear|| "--"}</div>
                                                        <div className={style['text']}>
                                                            <div className={style['text-til']}>内容</div>
                                                            <div className={style['text-tent']}>{item.subsidypolicy|| "--"}</div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        {
                                            !this.state.infoData.policys && <div className={style['policy-content-item']}>
                                                <div style={{textAlign: 'center', width: '100%', color: 'red'}}>暂无内容</div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                {
                                    this.state.echartShow && (<div className={style['i-echart']}>
                                        <div>
                                            <div className={style['t-til']}>旅游</div>
                                            <div id="myChart1" style={{width: '523px', height: '270px'}}></div>
                                        </div>
                                        <div>
                                            <div className={style['t-til']}>经济</div>
                                            <div id="myChart2" style={{width: '523px', height: '270px'}}></div>
                                        </div>
                                        <div>
                                            <div className={style['t-til']}>人口</div>
                                            <div id="myChart3" style={{width: '1058px', height: '270px'}}></div>
                                        </div>
                                    </div>)
                                }
                                <div className={style['traffic']}>
                                    <div className={style['t-til']}>
                                        <div>交通</div>
                                    </div>
                                    <div className={style['t-content']}>
                                        <div className={style['highway']}>
                                            <div className={style['c-til']}>
                                                <div>公路</div>
                                                {
                                                    this.state.infoData.highwayList && <div style={{color: '#3c78ff'}}>共{this.state.infoData.highwayList.length}条</div>
                                                }
                                            </div>
                                            {
                                                this.state.infoData.highwayList && this.state.infoData.highwayList.map((item, index) => {
                                                    return (
                                                        <div className={style['c-list-item']} key={index}>
                                                            <div className={style['type']}><span>类型</span>{item.roadType|| "--"}</div>
                                                            <div className={style['code']}><span>代码</span>{item.roadCode|| "--"}</div>
                                                            <div className={style['place']}>
                                                                <span>途径点</span>
                                                                <div className={style['over-flow']}
                                                                     onMouseOver={()=>{this.setState({roadPointShow1: true})}}
                                                                     onMouseOut={()=>{this.setState({roadPointShow1: false})}}>{item.roadPoint|| "--"}</div>
                                                                <div className={`${style['list-wrapper']} ${!this.state.roadPointShow1 ? style['display-none']: ''}`}>{item.roadPoint|| "--"}</div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            {
                                                !this.state.infoData.highwayList && <div className={style['c-list-item']}>
                                                    <div style={{textAlign: 'center', width: '100%', color: 'red'}}>暂无数据</div>
                                                </div>
                                            }
                                        </div>
                                        <div className={style['railway']}>
                                            <div className={style['c-til']}>
                                                <div>铁路</div>
                                                {
                                                    this.state.infoData.railwayList &&  <div style={{color: '#3c78ff'}}>共{this.state.infoData.railwayList.length}条</div>
                                                }
                                            </div>
                                            {
                                                this.state.infoData.railwayList && this.state.infoData.railwayList.map((item, index) => {
                                                    return (
                                                        <div className={style['c-list-item']} key={index}>
                                                            <div className={style['type']}><span>类型</span>{item.roadType|| "--"}</div>
                                                            <div className={style['code']}><span>代码</span>{item.roadCode|| "--"}</div>
                                                            <div className={style['place']}>
                                                                <span>途径点</span>
                                                                <div className={style['over-flow']}
                                                                     onMouseOver={()=>{this.setState({roadPointShow: true})}}
                                                                     onMouseOut={()=>{this.setState({roadPointShow: false})}}>{item.roadPoint|| "--"}</div>
                                                                <div className={`${style['list-wrapper']} ${!this.state.roadPointShow ? style['display-none']: ''}`}>{item.roadPoint|| "--"}</div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }

                                            {
                                                !this.state.infoData.railwayList &&  <div className={style['c-list-item']}>
                                                    <div style={{textAlign: 'center', width: '100%', color: 'red'}}>暂无数据</div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className={style['news']} id="news">
                                    <div className={style['n-til']}>
                                        <div className={style['n-name']}><span className={`iconfont ${style['iconfont']}`}>&#xe624;</span>新闻舆情</div>
                                        <div>
                                            {
                                                this.state.showNewsDetail && <a href={`#/publicOpinion/${store.getState().searchInfo.mes}/2`}><span className={style['more']}>查看更多></span></a>
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
                        </div>)
                            : (<div className={style['content']} style={{color: 'red', textAlign: 'center', lineHeight: '67px'}}>暂无内容,请重新搜索</div>)
                    }
                </div>
            </div>
        )
    }
}
