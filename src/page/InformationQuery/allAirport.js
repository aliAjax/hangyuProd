/* eslint-disable */
import React, { Component } from 'react';
import { store } from "../../store/index";
import { host as $host} from "./../../utils/port";
import {assemblyAction as an} from "../../utils/assemblyAction";
import { Breadcrumb } from 'antd';
import Slice from '../../static/img/Slice.png'
import style from './../../static/css/InformationQuery/InformationQuery.scss'
import ScrollBar from "../../components/scrollBar/scrollBar";

export default class AllAirport extends Component{
    constructor(props){
        super(props);
        this.state = {
            scrollList:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],//右侧滚动条数据
            scrollObj:{},//
        }
    }
    getInfo(val) {  // 传递搜索信息 type: airport、airline、city
        let data = {};
        data.mes = val.iata;   // 机场的三字码
        data.type = 'airport';    // 类型：airline、airport、city
        this.sessionStorageFn(data);
        window.location.href = '#/airport';
    }
    sessionStorageFn(data) {
        store.dispatch(an('SEARCHINFO', data));
        sessionStorage.removeItem('search_info');
        sessionStorage.setItem('search_info', JSON.stringify(data));
    }
    setScroll() {
        let airList=store.getState().airList;
        let scrollObj={};
        let newArr=[];
        for(let i=0;i<airList.length;i++){
            newArr.push(airList[i].airlinElhName[0].toUpperCase())
        };
        let letterArr=[...new Set(newArr)];
        let An=0,Bn=0,Cn=0,Dn=0,En=0,Fn=0,Gn=0,Hn=0,In=0,Jn=0,Kn=0,Ln=0,Mn=0,Nn=0,On=0,Pn=0,Qn=0,Rn=0,Sn=0,Tn=0,Un=0,Vn=0,Wn=0,Xn=0,Yn=0,Zn=0;
        for(let i=0;i<newArr.length;i++){
            switch (newArr[i]){
                case "A":
                    An++;
                    break;
                case "B":
                    Bn++;
                    break;
                case "C":
                    Cn++;
                    break;
                case "D":
                    Dn++;
                    break;
                case "E":
                    En++;
                    break;
                case "F":
                    Fn++;
                    break;
                case "G":
                    Gn++;
                    break;
                case "H":
                    Hn++;
                    break;
                case "I":
                    In++;
                    break;
                case "J":
                    Jn++;
                    break;
                case "K":
                    Kn++;
                    break;
                case "L":
                    Ln++;
                    break;
                case "M":
                    Mn++;
                    break;
                case "N":
                    Nn++;
                    break;
                case "O":
                    On++;
                    break;
                case "P":
                    Pn++;
                    break;
                case "Q":
                    Qn++;
                    break;
                case "R":
                    Rn++;
                    break;
                case "S":
                    Sn++;
                    break;
                case "T":
                    Tn++;
                    break;
                case "U":
                    Un++;
                    break;
                case "V":
                    Vn++;
                    break;
                case "W":
                    Wn++;
                    break;
                case "X":
                    Xn++;
                    break;
                case "Y":
                    Yn++;
                    break;
                case "Z":
                    Zn++;
                    break;
            }
        };
        let num=0;
        num+=An;
        scrollObj.A=[An,num];
        num+=Bn;
        scrollObj.B=[Bn,num];
        num+=Cn;
        scrollObj.C=[Cn,num];
        num+=Dn;
        scrollObj.D=[Dn,num];
        num+=En;
        scrollObj.E=[En,num];
        num+=Fn;
        scrollObj.F=[Fn,num];
        num+=Gn;
        scrollObj.G=[Gn,num];
        num+=Hn;
        scrollObj.H=[Hn,num];
        num+=In;
        scrollObj.I=[In,num];
        num+=Jn;
        scrollObj.J=[Jn,num];
        num+=Kn;
        scrollObj.K=[Kn,num];
        num+=Ln;
        scrollObj.L=[Ln,num];
        num+=Mn;
        scrollObj.M=[Mn,num];
        num+=Nn;
        scrollObj.N=[Nn,num];
        num+=On;
        scrollObj.O=[On,num];
        num+=Pn;
        scrollObj.P=[Pn,num];
        num+=Qn;
        scrollObj.Q=[Qn,num];
        num+=Rn;
        scrollObj.R=[Rn,num];
        num+=Sn;
        scrollObj.S=[Sn,num];
        num+=Tn;
        scrollObj.T=[Tn,num];
        num+=Un;
        scrollObj.U=[Un,num];
        num+=Vn;
        scrollObj.V=[Vn,num];
        num+=Wn;
        scrollObj.W=[Wn,num];
        num+=Xn;
        scrollObj.X=[Xn,num];
        num+=Yn;
        scrollObj.Y=[Yn,num];
        num+=Zn;
        scrollObj.Z=[Zn,num];
        this.setState({
            scrollObj,
            scrollList:letterArr,
        })
    }
    chooseEvent(data){
        let scrollNum=this.state.scrollObj[data];
        let num=scrollNum[1]-scrollNum[0];
        num=parseInt(num/4);
        let scrollLineNum=0;
        if(num>1){
            scrollLineNum=(num)*(200+10);
        };
        this.refs.addScroll.scrollTop = scrollLineNum;
    }
    componentWillMount(){  // 将要渲染
        this.setScroll();
    }
    componentDidMount() {   // 加载渲染完成

    }
    componentWillReceiveProps(nextProps){  // Props发生改变

    }
    componentWillUnmount(){  // 卸载组件

    }
    render(){
        let styleJson = {
            position: 'absolute',
            right: '-100px',
        };
        return(
            <div className={'router-context'}>
                <div className={style['container']} style={{position: 'relative', paddingTop: '61px', height: '100%'}}>
                    <div className={style['item']} style={{height: 'calc(100% - 61px)', position: 'relative'}}>
                        <div>
                            <Breadcrumb separator="》" style={{fontSize: '1.6rem'}}>
                                <Breadcrumb.Item href="#/informationQuery">信息查询</Breadcrumb.Item>
                                <Breadcrumb.Item>所有机场</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <div className={'scroll'} ref={'addScroll'} style={{maxHeight: '100%', overflowY: 'scroll'}}>
                            {
                                store.getState().airList.map((val, index) => {
                                    return (
                                        <div className={style['figure']} key={index} onClick={this.getInfo.bind(this, val)}>
                                            <div className={style['img']}>
                                                {
                                                    val.navBackground
                                                        ? <img src={`${val.navBackground}`} alt={val.airlnCdName} />
                                                        : <img src={Slice} alt={val.airlnCdName} />
                                                }
                                            </div>
                                            <div>
                                                <div>{val.airlnCdName}</div>
                                                <div>{val.iata}/{val.icao}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {/*scrollList:字母列表数组  chooseEvent:子组件返回字母*/}
                        <ScrollBar scrollList={this.state.scrollList} styleJson={styleJson} chooseEvent={(data)=>this.chooseEvent(data)}/>
                    </div>
                </div>
            </div>
        )
    }
}