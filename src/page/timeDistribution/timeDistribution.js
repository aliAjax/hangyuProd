// author:wangli time:2018-05-24 content:时刻查询
/* eslint-disable */
import React, { Component } from 'react';
import { host as $host} from "./../../utils/port";
import {store} from "../../store/index";
import ScrollBar from "../../components/scrollBar/scrollBar";
import style from "../../static/css/timeDistribution/timeDistribution.scss";


export default class TimeDistribution extends Component{
    constructor(props){
        super(props);
        this.state = {
                airList:[],//所有机场数据列表
                scrollList:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],//右侧滚动条数据
                scrollObj:{},//滚动对象{距离，字母名}
                total:"",//机场总数
        }
    }

    //跳转到具体机场的时刻分布
    airportTime(data,name){//data:三字码 name：机场名
        let arr=[];
        arr.push(data,name);
        window.location.href = `#/timeDistributionAirport/${arr}`;//href跳转携带三字码和机场名
    }

    componentWillMount(){  // 将要渲染
        let airList=store.getState().airList;
        let scrollObj={};
        let newArr=[];
        for(let i=0;i<airList.length;i++){
            newArr.push(airList[i].airlinElhName[0].toUpperCase())
        };
        //滚动条字母数据组装
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
        //滚动条点击对应字母时，需滚动距离
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
            airList,
            scrollObj,
            scrollList:letterArr,
            total:airList.length
        })
    }
    componentDidMount() {   // 加载渲染完成

    }
    componentWillReceiveProps(nextProps){  // Props发生改变

    }
    componentWillUnmount(){  // 卸载组件

    }

    //组件返回的选中字母
    chooseEvent(data){//data:选中字母
        let scrollNum=this.state.scrollObj[data];
        let num=scrollNum[1]-scrollNum[0];
        num=parseInt(num/4);
        let scrollLineNum=0;
        if(num>1){//计算滚动距离
            scrollLineNum=(num)*(200+20);
        };
        this.scroll.scrollTop=scrollLineNum;
    }

    render(){
        return(
            <div className={`router-context ${style['backColor']}`}>
                <div className={style['innerBox']}>
                    <div className={style['title']}>时刻查询列表</div>
                    <div ref={(data)=>this.scroll=data} className={style['itemsBox']}>
                        {
                            this.state.airList.map((item,index)=>{
                                let src="";
                                let showNum="";
                                let showBox;
                                let styleText=style['itemBox'];
                                if(index<4){
                                    styleText=style['marginTop']
                                    if(index==3){
                                        styleText=style['marginTop4']
                                    }
                                };
                                if((index+1)%4==0&&index!=3){
                                    styleText=style['itemBox4']
                                };
                                if(item.passengerThroughputs!=null){
                                    showNum=Math.round(item.passengerThroughputs[0]/10000);
                                    showBox=<div className={style['num']}>吞吐量{showNum}万</div>
                                }
                                return <div className={styleText} key={index} onClick={this.airportTime.bind(this,item.iata,item.airlnCdName)}>
                                    <img src={item.navBackground?`${item.navBackground}`:require("../../static/img/timeDistribution/wutu.png")} style={item.navBackground?{}:{marginLeft:"0px"}} alt={item.airlnCdName}/>
                                    <div className={style['airportName']}>{item.airlnCdName}</div>
                                    <div className={style['airportCode']}>{item.iata}/{item.icao}</div>
                                    {/*{showBox}*/}
                                </div>
                            })
                        }
                    </div>
                    {/*scrollList:字母列表数组  styleJson:定义组件样式 chooseEvent:子组件返回字母*/}
                    <ScrollBar scrollList={this.state.scrollList} styleJson={{position:"absolute",right:"-100px"}} chooseEvent={(data)=>this.chooseEvent(data)}/>
                </div>
            </div>
        )
    }
}