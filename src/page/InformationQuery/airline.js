import React, {Component} from 'react';
import { Spin, Breadcrumb } from 'antd';
import Axios from './../../utils/axiosInterceptors'
import {store} from "../../store/index";
import style from './../../static/css/InformationQuery/airline.scss'
import {companyIconData} from '../../static/js/companyIcon'
import noimg from '../../static/img/pubo/noimg.png'

export default class Airline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoData:{},
            qyCode:'',
            newsData: null, // 数组
            showDetail:true,
            basedistributionShow:false,
            step:'1',
            companyIconData,
            icon: '',
            iconShow: false,
            spinShow: true,  // 加载中...
            isInfo: true,
            showNewsDetail: false,  // 是否显示新闻
            spinNewsShow: true,  // 新闻加载中。。。
            left: '',
        }
    };
    getNews(){
        let airline = document.getElementById('airline');
        //获取新闻定位点
        let news = document.getElementById('news');
        airline.scrollTop = news.offsetTop - 200;
       /* this.setState({
            isInfo: false,
        })*/
        //this.scrollTo("2");
    }
    getBaseInfo(){
        let airline = document.getElementById('airline');
        airline.scrollTop = 0;
        /*this.setState({
            isInfo: true,
        })*/
        //this.scrollTo("1");
    }
    openWindow(src) {
        window.open(src);
    }
    getData(){
        Axios({
            method: 'post',
            url: '/aircompenyDetail',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
                itia: store.getState().searchInfo.mes
            }
        })
        .then((response) => {
            let showDetail = false,
                iconShow = false,
                infoData = {},
                icon = '';
            if(response.data.opResult == "0"){
                if(response.data.obj){
                    showDetail = true;
                }
                infoData = response.data.obj;
                companyIconData.forEach((val) => {
                    if(response.data.obj.id == val.id){
                        iconShow = true;
                        icon = `#${val.icon}`
                    }
                })
            }else{
                showDetail = false;
            }
            this.setState({
                showDetail: showDetail,
                iconShow: iconShow,
                icon: icon,
                infoData: infoData,
                spinShow: false,
            })
        });
        Axios({
            method: 'post',
            url: '/loadAirCompenyOpinionByCode',
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
        if(currentValue.type == 'airline') {
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
            if (this.refs.myAirline.scrollTop >= news.offsetTop - 200) {
                this.setState({
                    isInfo: false
                })
            } else {
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
        this.refs.myAirline.addEventListener('scroll', this.onScroll.bind(this));
        window.addEventListener('resize', this.getLeft.bind(this));
    }
    componentWillUnmount() {
        this.unsubscribe();
        this.refs.myAirline.removeEventListener('scroll', this.onScroll.bind(this));
        window.removeEventListener('resize', this.getLeft.bind(this));
    }
    render() {
        return (
            <div className={'router-context'}>
                {
                    this.state.spinShow && <Spin size="large" style={{zIndex: 100}} />
                }
                <div className={`scroll ${style['wrapper']}`} id="airline" ref={'myAirline'}>
                    {
                        this.state.showDetail ? (<div className={style['content']} ref={'content'} style={{position: 'relative'}}>
                            <Breadcrumb separator="》" style={{position: 'absolute', top: '-50px', left: '0', fontSize: '1.6rem'}}>
                                <Breadcrumb.Item href="#/informationQuery">信息查询</Breadcrumb.Item>
                                <Breadcrumb.Item href="#/allAirline">所有航司</Breadcrumb.Item>
                                <Breadcrumb.Item>航司详情</Breadcrumb.Item>
                            </Breadcrumb>
                            <div className={style['banner']}>
                                <div className={style['airport-img']}>

                                </div>
                                {
                                    this.state.iconShow ? (<div className={`${style['b-til']} ${style['svg-wrapper']}`} style={{marginLeft: '20px', overflow: 'hidden'}}>
                                        <div className={style['svg-container']}>
                                            <svg className={`${style['icon']} ${style['svg-logo']}`} aria-hidden="true">
                                                <use xlinkHref={this.state.icon}></use>
                                            </svg>
                                        </div>
                                    </div>) : <div className={`${style['b-til']} ${style['svg-wrapper']}`} style={{background: 'rgba(0, 0, 0, 0.3)'}}>
                                        <span>{this.state.infoData.airlnCd || "-"}</span>
                                    </div>
                                }
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
                                            <li><div>航司名</div><div>{this.state.infoData.airlnCd || "-"}</div></li>
                                            <li><div>成立时间</div><div>{this.state.infoData.establishtime || "-"}</div></li>
                                            <li>
                                                <div>基地分布</div>
                                                <div className={style['basedistribution']}
                                                     onMouseOver={()=>{this.setState({basedistributionShow: true})}}
                                                     onMouseOut={()=>{this.setState({basedistributionShow: false})}}>{this.state.infoData.basedistribution || "-"}</div>
                                                <div className={`${style['list-wrapper']} ${!this.state.basedistributionShow ? style['basedistribution-show'] : ''}`}
                                                     onMouseOver={()=>{this.setState({basedistributionShow: true})}}
                                                     onMouseOut={()=>{this.setState({basedistributionShow: false})}}>{this.state.infoData.basedistribution || "-"}</div>
                                            </li>
                                            <li><div>航空联盟</div><div>{this.state.infoData.airlinealliance || "-"}</div></li>
                                        </ul>
                                    </div>
                                    <div className={style['info-box']}>
                                        <ul>
                                            <li><div>二字码</div><div>{this.state.infoData.iata || "-"}</div></li>
                                            <li><div>总部地点</div><div>{this.state.infoData.headquarterslocation || "-"}</div></li>
                                            <li><div>通航国家数量</div><div>{this.state.infoData.shippingcountry || "-"}</div></li>
                                        </ul>
                                    </div>
                                    <div className={style['info-box']}>
                                        <ul>
                                            <li><div>三字码</div><div>{this.state.infoData.icao || "-"}</div></li>
                                            <li><div>所属航系</div><div>{this.state.infoData.systemairpot || "-"}</div></li>
                                            <li><div>通航机场数量</div><div>{this.state.infoData.navigationairport || "-"}</div></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className={style['i-table']}>
                                    <div className={style['table-til']}>
                                        <div>机型及数量</div>
                                        {
                                            this.state.infoData.planeDetails && <div className={style['i-num']}>共{this.state.infoData.planeDetails.length || "-"}条</div>
                                        }
                                    </div>
                                    <div className={style['table-content']} >
                                        <ul className={style['table-content-ul']}>
                                            {
                                                this.state.infoData.planeDetails && this.state.infoData.planeDetails.map((item, index) => {
                                                    return (<li key={index}>
                                                        <div>{item.airporttype}</div>
                                                        <div><span>数量</span>{item.number}</div>
                                                    </li>)
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <div className={style['news']} id="news">
                                    <div className={style['n-til']}>
                                        <div className={style['n-name']}><span className={`iconfont ${style['iconfont']}`}>&#xe624;</span>新闻舆情</div>
                                        <div>
                                            {
                                                this.state.showNewsDetail && <a href={`#/publicOpinion/${store.getState().searchInfo.mes}/0`}><span className={style['more']}>查看更多></span></a>
                                            }
                                        </div>
                                    </div>
                                    {
                                        this.state.spinNewsShow && <Spin size="large" style={{zIndex: 100, display: 'block'}} />
                                    }
                                    {
                                        (this.state.showNewsDetail && this.state.newsData) ? this.state.newsData.map((item, index) => {
                                            return (<div className={style['news-box']} key={index}>
                                                <div className={style['box-pic']}>
                                                    <img src={item.articleImage || noimg} alt="" />
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
                                            </div>)
                                        }) : (<div style={{color: 'red', textAlign: 'center', lineHeight: '67px'}}>暂无内容</div>)
                                    }
                                </div>
                            </div>
                        </div>)
                            : (<div className={style['content']}
                                   style={{color: 'red', textAlign: 'center', lineHeight: '67px'}}>暂无内容,请重新搜索</div>)
                    }
                </div>
            </div>
        )
    }
}
