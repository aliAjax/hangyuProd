/* eslint-disable */
import React, { Component } from 'react';

import style from './../../static/css/mapStyle/infPanel.scss';
import i4 from './../../static/img/mapImag/i4.png';
import {companyIconData} from "./../../static/js/companyIcon";
import Axios from './../../utils/axiosInterceptors';
import {CSSTransition,} from 'react-transition-group';
import emitter from '../../utils/events';
import {cityMes,airMes,companyMes} from './../../utils/airMes';
import {store} from "../../store";
import classNames from 'classnames';
import {assemblyAction as an} from "../../utils/assemblyAction";

export default class InfPanel extends Component{
    constructor(props){
        super(props);
        this.state = {
            checkedCode:"",
            code:"",
            ched:true,
            basicMes:{
                airName:"",
                airCode:"",
                airType:"",
                flyL:"",
                isgj:false,
                fxzdl:'-',
                xfdj:''
            },
            glhs:[],
            allData:{
                spareCapacitys:[]
            },
            yq:[],
            setgd:0,
            setIn:"",
            zc:[],
            setzc:0,
            setInzc:"",
            dropData: {
                mouseCoordinate: {
                    x: 0,
                    y: 0
                },
                switch: false
            },
            timelyBox: "",
            timelyBoxXY: {
                // 最后设置的聊天框位置
                x: 10,
                y: 10
            },
            companyIconData:[]

        }
    }
    componentWillMount(){  // 将要渲染
        this.state.companyIconData = companyIconData;
        let _this = this.state;
        emitter.addEventListener("closeHxwl",()=>{
            this.setState({
                ched:true,
                checkedCode:''
            })
        });
        emitter.addEventListener("tipBox",(d) => {
            console.log(6666)
            let ched = true;
            if(d === this.state.checkedCode){
                ched = false;
            };
            this.setState({
                ched
            },function () {
                let type = store.getState().role.airlineretrievalcondition === d;
                if(type){
                    _this.ched = false
                }else{
                    _this.ched = true
                };
                _this.code = d;
                _this.yq = [];
                _this.zc = [];
                _this.glhs = [];
                Axios({
                    method: 'post',
                    url: '/loadIndexAirportInfoByCode',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    params:{
                        itia:d
                    },
                })
                    .then((response) => {
                        if(response.data.opResult == '0'){
                            if(response.data.obj.opinions != null){
                                this.state.yq = response.data.obj.opinions;
                                this.setInl();
                            }else{
                                this.state.yq = []
                            };
                            if(response.data.obj.rewardPolicyList != null){
                                this.state.zc = response.data.obj.rewardPolicyList;
                                this.setInlzcf();
                            }else{
                                this.state.zc = []
                            }
                            if(response.data.obj.compenys != null){
                                this.state.allData = response.data.obj;
                                this.state.glhs = response.data.obj.compenys;
                            }else{
                                this.state.glhs = []
                            };
                            let newglhs =  this.state.glhs.map((value)=>{
                                let oj = {};
                                this.state.companyIconData.forEach((vl)=>{
                                    if(vl.companyIata === value.iata){
                                        oj.logo = vl.logo;
                                        oj.icon = vl.icon;
                                    }
                                });
                                return Object.assign(oj,value)
                            });
                            this.state.glhs = newglhs;
                            this.setState(()=>{
                                return{
                                    glhs:this.state.glhs,
                                    zc:this.state.zc,
                                    yq:this.state.yq
                                }
                            })
                        }
                    })
                    .catch((error) => {
                            console.log(error);
                        }
                    );
                let mes = airMes(store.getState().airList,d);
                let obj = {
                    airName:mes.airlnCd,
                    airCode:`${mes.iata}/${mes.icao}`,
                    airType:mes.airpotcls == '' ? "-" : mes.airpotcls,
                    flyL:mes.airfieldlvl == '' ? '-' : mes.airfieldlvl,
                    isgj:mes.inter == '0' ? "否" : "是",
                    fxzdl:(mes.releasepunctuality == '' || mes.releasepunctuality == "无数据") ? "-" : mes.releasepunctuality + "%",
                    xfdj:mes.firelvl == '' ? "-" : mes.firelvl
                };
                this.state.basicMes = obj;
                this.setState(()=>({
                    yq: _this.yq
                }));
                this.forceUpdate();
            });
        });
        document.addEventListener("mousemove", e => {
            if (this.state.dropData.switch) {
                this.refs['timely-box'].style.left = this.state.timelyBoxXY.x + (e.screenX - this.state.dropData.mouseCoordinate.x) + 'px';
                this.refs['timely-box'].style.top = this.state.timelyBoxXY.y + (e.screenY - this.state.dropData.mouseCoordinate.y) + 'px';
            }
        });
        this.initBox();
    }
    initBox() {
        this.setState(()=>({
            timelyBox:this.refs['timely-box']
        }))
    }
    goMes(){
        let data = {
            mes: this.state.basicMes.airCode.split('/')[0],
            type:'airport'
        };
        store.dispatch(an('SEARCHINFO', data));
        sessionStorage.setItem('search_info', JSON.stringify(data));
        window.location.href = '#/airport';
    }
    componentDidMount() {   // 加载渲染完成

    }
    componentWillReceiveProps(nextProps){  // Props发生改变

    }
    componentWillUnmount(){  // 卸载组件

    }
    change(){
        this.setState({
            ched:!this.state.ched
        },function () {
            if(this.state.ched){
                emitter.emit('showLines','');
                this.setState({
                    checkedCode:''
                });
            }else{
                emitter.emit('showLines',this.state.basicMes.airCode.split('/')[0]);
                emitter.emit('closeWohx');
                this.setState({
                    checkedCode:this.state.basicMes.airCode.split('/')[0]
                });
            }
        });
    }
    clek(){
        document.getElementById("inf-mes-box").style.display = "none";
    }
    setInl(){
        if(this.state.setIn != "")clearInterval(this.state.setIn);
        this.setState({
            setgd:0
        });
        this.state.setIn = setInterval(()=>{
            if(this.state.setgd < this.state.yq.length-1){
                let setgd = this.state.setgd +1;
                this.setState({
                    setgd:6666666
                });
                setTimeout(()=>{
                    this.setState({
                        setgd:setgd
                    });
                },1000)
            }else if(this.state.setgd == this.state.yq.length-1){
                this.setState({
                    setgd:0
                });
            }
        },5000);
    }
    setInlzcf(){
        if(this.state.setInzc != "")clearInterval(this.state.setInzc);
        this.setState(()=>({
            setzc:0
        }));
        this.state.setInzc = setInterval(()=>{
            if(this.state.setzc < this.state.zc.length-1){
                let setgds = this.state.setzc +1;
                this.state.setzc = 6666666;
                setTimeout(()=>{
                    this.setState(()=>({
                        setzc:setgds
                    }));
                },1000)
            }else if(this.state.setzc == this.state.zc.length-1){
                this.setState(()=>({
                    setzc:0
                }));
            }
        },5000);
    }
    clearAndBindDrop(t, event) {
        this.state.dropData.mouseCoordinate.x = event.screenX;
        this.state.dropData.mouseCoordinate.y = event.screenY;
        this.state.timelyBoxXY.x = this.refs['timely-box'].offsetLeft;
        this.state.timelyBoxXY.y = this.refs['timely-box'].offsetTop;
        // 绑定拖拽事件
        if (t) {
            this.state.dropData.switch = true;
        } else {
            this.state.dropData.switch = false;
        };
        this.setState((data)=>({
            dropData:data.dropData,
            timelyBoxXY:data.timelyBoxXY
        }));
    }
    render(){
        let iskgCkecked = this.state.ched ? `${style['iskgCkecked']} ${style['turn-off']}`: `${style['turn-off']}`;
        let iskgone = classNames({
            [`${style['iskg']}`]: true,
            [`${style['iskg0']}`]: !this.state.ched,
            [`${style['iskg1']}`]: this.state.ched,
        });
        return(
            // popup user-select
            <div className={`popup ${style['inf-box']} ${style['user-select']}`} ref="timely-box" id="inf-mes-box"
                 onMouseDown={this.clearAndBindDrop.bind(this,true)}
                 onMouseUp={this.clearAndBindDrop.bind(this,false)}>
        <div className={`${style['inf-head']}`}>
            <span>{this.state.basicMes.airName}</span>
            <span>{this.state.basicMes.airCode}</span>
            <span className="btn-w" onClick={this.clek.bind(this)}>&#xe62c;</span>
    </div>
        <div className={`${style['inf-mes']}`}>
            <div>
                <div>机场类型</div>
                <div>{this.state.basicMes.airType}</div>
            </div>
            <div>
                <div>飞行区等级</div>
                <div>{this.state.basicMes.flyL}</div>
            </div>
            <div>
                <div>是否国际</div>
                <div>{this.state.basicMes.isgj}</div>
            </div>
            <div>
                <div>放行准点率</div>
                <div>{this.state.basicMes.fxzdl}</div>
            </div>
            <div>
                <div>消防等级</div>
                <div>{this.state.basicMes.xfdj}</div>
            </div>
            {
                store.getState().role.role === '0' ?  <div>
                    <div className={`${style['user-select']}`}>航线网络图
                        <div id='turnLine' onClick={this.change.bind(this)} className={iskgone}>
                            <span className={iskgCkecked}>&#xe61e;</span>
                        </div>
                    </div>
                </div> : ''
            }
    </div>
        <div className={`${style['line-network']}`}>
            <a className={`${style['more']}`} onClick={this.goMes.bind(this)}>
            更多详情
        </a>
    </div>
        <div className={`${style['inf-associated']}`}>
            <div className={`${style['inf-title']}`}>富余运力</div>
            {
                this.state.allData.spareCapacitys.map((key,index)=>{
                    return  <div className={style['redundant']} key={index}>
                        <span>{key.airCrftTyp}</span>
                        <span>{`${key.capacity}架`}</span>
                    </div>
                })
            }
        </div>
        <div className={`${style['inf-associated']}`}>
            <div className={`${style['inf-title']}`}>关联航司</div>
            <div style={{padding:"20px 0 0 0"}}>
                {this.state.glhs.map((val,index)=>{
                    return <div className={style['inf-hsItrmBox']} key={index}>
                        <span className={style["inf-hsItrm"]}>
                            {val.transactionCapacityCount > 0 ? <img className={style['isglhs']} src={i4} alt=""/> : ''}
                        </span>
                        <span className={style['inf-hsItrmBg']}>
                             <svg className="icon" aria-hidden="true">
                                <use xlinkHref={(`#${val.logo}`)}></use>
                            </svg>
                        </span>
                    </div>
                })}
            </div>
        </div>
        <div className={`${style['inf-associated']}`}>
            <div className={`${style['inf-title']}`}>滚动舆情</div>
                {
                    this.state.yq.map((val,key)=>{
                            return<CSSTransition
                                key={key}
                                timeout={500}
                                classNames="rolling"
                                in={key == this.state.setgd}
                                unmountOnExit
                            >
                                <div className={style['gdyq-item']}>
                                    <a href={val.articleUrl} target="_blank" className={style['text-line']}>{val.articleTitle}</a>
                                </div>
                            </CSSTransition>
                    })
                }
        </div>
        <div className={classNames(
            ({
                [`${style['inf-associated']}`]: true,
                [`${style['gdyq']}`]: this.state.zc.length != 0,
            })
            )}>
            <div className={style["inf-title"]}>最新政策</div>
                {
                    this.state.zc.map((val,key)=>{
                        if(key == this.state.setzc){
                            return <div className={style['gdyq-item']}>
                                <a target="_blank" className={style['text-line']}>{val.rewardpolicytext}</a>
                            </div>
                        }
                    })
                }
            </div>
        </div>
        )
    }
}