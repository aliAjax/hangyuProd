
import React, { Component } from 'react';

import Axios from './../../utils/axiosInterceptors'
import emitter from "../../utils/events";
import style from './../../static/css/userCenter/userCenter.scss';
import Bills from './bills/bills';
import CompanyAccount from './companyAccount/companyAccount';
import MyCollection from './myCollection/myCollection';
import MyIntention from './myIntention/myIntention';
import MyOrder from './myOrder/myOrder';
import MyRelease from './myRelease/myRelease';
import MeasuringRecord from '../fromBox/measuringRecord'
import myDraftBox from './myDraftBox/myDraftBox'
import { store } from "../../store/index";

export default class UserCenterBox extends Component{
    constructor(props){
        super(props);
        this.state = {
            showMeasuringRecord: false,  // 测算记录是否显示
            type: '',  // 传给组件的需求类型
            userMes: null,
            demandId:"",//需要展示的合同id
            navList:[
                {
                    name: "草稿箱",
                    set: false,
                    component: myDraftBox
                },
                {
                    name:"我的发布",
                    set:false,
                    component:MyRelease
                },
                {
                    name:"我的意向",
                    set:false,
                    component:MyIntention
                },
                {
                    name:"我的订单",
                    set:true,
                    component:MyOrder
                },
                {
                    name:"我的收藏",
                    set:false,
                    component:MyCollection
                },
                {
                    name:"公司账户",
                    set:false,
                    component:CompanyAccount
                },
                {
                    name:"账单",
                    set:false,
                    component:Bills
                }
            ]
        };
    }
    jumpTo(data1, data2) {  // 跳转/切换 到某个组件, data2：需求类型，无就传"" 下标 + 需求类型 0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托
        this.setState({
            type: data2,
        },()=>{
            this.setNav2(data1);
        });
    }
    measuringClickFn() {  // 测算记录
        let obj = {};
        obj.openFrom = true;
        obj.fromType = 4;
        obj.fromMes = null;
        emitter.emit('openFrom', obj);
    }
    componentWillMount(){  // 将要渲染
        let pathname=this.props.location.pathname.split("/");
        let demandData=pathname[(pathname.length)-1].split("=");
        if(demandData[0]=="demandId"){
            let navList=[
                {
                    name: "草稿箱",
                    set: false,
                    component: myDraftBox
                },
                {
                    name:"我的发布",
                    set:false,
                    component:MyRelease
                },
                {
                    name:"我的意向",
                    set:false,
                    component:MyIntention
                },
                {
                    name:"我的订单",
                    set:false,
                    component:MyOrder
                },
                {
                    name:"我的收藏",
                    set:false,
                    component:MyCollection
                },
                {
                    name:"公司账户",
                    set:false,
                    component:CompanyAccount
                },
                {
                    name:"账单",
                    set:true,
                    component:Bills
                }
            ]
            this.setState({
                navList,
                demandId:demandData[1]
            });
        }
    }
    componentDidMount() {   // 加载渲染完成
        Axios({
            method: 'post',
            url: '/getPersonalInformation',
            /*params:{  // 一起发送的URL参数
                page:1
            },*/
            // data: JSON.stringify(demand),
            dataType:'json',
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        }).then((response)=>{
            if(response.status == 200) {
                this.setState({
                    userMes: response.data
                })
            }
        });
    }
    componentWillReceiveProps(nextProps){  // Props发生改变
        let pathName=window.location.href.split("/");
        let demandData=pathName[(pathName.length)-1].split("=");
        if(demandData[0]=="demandId"){
            if(demandData[0]=="demandId"){
                let navList=[
                    {
                        name: "草稿箱",
                        set: false,
                        component: myDraftBox
                    },
                    {
                        name:"我的发布",
                        set:false,
                        component:MyRelease
                    },
                    {
                        name:"我的意向",
                        set:false,
                        component:MyIntention
                    },
                    {
                        name:"我的订单",
                        set:false,
                        component:MyOrder
                    },
                    {
                        name:"我的收藏",
                        set:false,
                        component:MyCollection
                    },
                    {
                        name:"公司账户",
                        set:false,
                        component:CompanyAccount
                    },
                    {
                        name:"账单",
                        set:true,
                        component:Bills
                    }
                ]
                this.setState({
                    navList,
                    demandId:demandData[1]
                });
            }
        };
    }
    componentWillUnmount(){  // 卸载组件

    }
    // 选择需要渲染的列表
    renderComponent(){

    }
    // 导航栏切换
    setNav(key){
        window.location.href="#/userCenter";
        this.state.navList.forEach((data)=>{
            data.set = false;
        });
        this.state.navList[key].set = true;
        this.setState(()=>({
            navList:this.state.navList,
            type: '',
        }))
    }
    setNav2(key){
        window.location.href="#/userCenter";
        this.state.navList.forEach((data)=>{
            data.set = false;
        });
        this.state.navList[key].set = true;
        this.setState(()=>({
            navList:this.state.navList
        }))
    }
    render(){
        let component = this.renderComponent();
        return(
            <div className={style['userCenterBox']}>
                {
                    this.state.showMeasuringRecord && <MeasuringRecord />
                }
                <div className={style['userCenterBox-mes']}>
                    <div className={style['userCenterBox-mes-detail']}>
                        <div>
                            <div>
                                <img src={store.getState().role.headPortrait} alt="头像"/>
                            </div>
                            <div className={style['userCenterBox-mes-text']}>
                                <div>{this.state.userMes ? this.state.userMes.nickname : '-'}</div>
                                <div>
                                    <div style={{color: 'white'}}>
                                        <span>{this.state.userMes ? this.state.userMes.company : '-'}</span>
                                        <span>{this.state.userMes ? this.state.userMes.department : '-'}</span>
                                    </div>
                                    <div style={{color: 'white'}}>
                                        成单量
                                        <span>{this.state.userMes ? this.state.userMes.SingleQuantity : '-'}</span>
                                    </div>
                                    <div>
                                        {
                                            store.getState().role.role == 1 && <div className={`btn-w ${style['btn-record']}`} onClick={this.measuringClickFn.bind(this)}>
                                                测算记录
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style['userCenter-form-nav']}>
                       <div>
                           {this.state.navList.map((data,key)=>{
                               return <div
                                   key={key}
                                   className={data.set ? style['userCenter-form-nav-set'] : ''}
                                   onClick={this.setNav.bind(this,key)}
                               >
                                   {data.name}
                               </div>
                           })}
                       </div>
                    </div>
                </div>
                <div className={style['userCenterBox-from']}>
                    <div className={style['from-box']}>
                        {
                            this.state.navList.map((data, index)=>{
                                if(data.set)return <data.component key={index} type={this.state.type} jumpTo={this.jumpTo.bind(this)}/>
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}
