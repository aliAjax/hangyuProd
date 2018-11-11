/* eslint-disable */

import React, { Component } from 'react';
import Axios from './../../utils/axiosInterceptors';
import {zs} from "./bmapResources";
import {airMes} from './../../utils/airMes';
import emitter from '../../utils/events';
import './../../static/js/officialLibrary/bmap';
import style from './../../static/css/mapStyle/mapmodality.scss'
import {store} from "../../store";
import {routesData} from './../../utils/mapAssembly'
import {MapMethods} from './methods';



export default class Maps extends Component{
    constructor(props){
        super(props);
        this.state = {
            myChart:null,
            style:{},
            allDot:[],
            routeNetwork:[],
            option:{},
            tagType:true
        };
        this.demand = {
            listDemand:[],
            listCro:[]
        };
        this.rs = [];
        this.ar = {
            data:{},
            instance:[]
        };
        this.waypoint = [];
        this.lines = {a:6};
        this.airLine = {a:6};
        this.point = [];
        this.pointInstance = {
            list:[],
            text:[]
        };
    }
    componentWillMount(){
    }
    componentDidMount() {
        this.setState({
            style:{
                width:document.body.clientWidth,
                height:document.body.clientHeight
            }
        });
        this.mapDidMount();
    }
    componentWillUnmount(){
    }
    async mapDidMount(){
        this.map = new BMap.Map("maps");
        await this.reData();
        let option = this.initData();
        // this.setOption(option);
    }
    /**
     * 获取数据
     * */
    async reData(){
        return await new Promise((resolve, reject) => {
            let routeNetwork = new Promise(function (resolve, reject) {
                Axios({
                    method: 'post',
                    url: '/getAirlineNetwork',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then((response) => {
                        if(response.data.opResult === '0'){
                            window.localStorage.setItem("airlineNetwork",JSON.stringify(response.data.data));
                            resolve(response.data);
                        }
                    })
                    .catch((error) => {
                            console.log(error);
                        }
                    );
            });
            let allDemands = new Promise(function (resolve, reject) {
                Axios({
                    method: 'post',
                    url: '/getAllDemands',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded'
                    }
                })
                    .then((response) => {
                        if(response.data.msg === '查询成功'){
                            let arr = [];
                            response.data.dataNew.forEach((val) => {
                                if (
                                    val.cityCoordinateJ != null &&
                                    val.cityCoordinateW != null &&
                                    val.dpt != null &&
                                    val.num != null
                                ) {
                                    arr.push(val)
                                }
                            });
                            resolve(arr);
                        }
                    })
                    .catch((error) => {
                            console.log(error);
                        }
                    );
            });
            Promise.all([routeNetwork,allDemands]).then((results)=>{
                this.setState(function (data) {
                    let ob = {};
                    results[0].data.forEach((val)=>{
                        for(let key in val){
                            if(!ob.hasOwnProperty(key)){
                                ob[key] = val[key];
                            }
                        }
                    });
                    results[0].data = ob;
                    return{
                        routeNetwork:results[0],
                        allDot:results[1]
                    }
                },()=>{
                    resolve()
                });
            })
        })
    }
    /**
     * 初始化数据
     *
     * */
    initData(){
        let lines = {};        // 航线网络图数据 type 0，直飞、1，经停
        for(let key in this.state.routeNetwork.data){
            let er = [];
            let selAir = airMes(store.getState().airList,key);
            if(this.state.routeNetwork.data[key].hasOwnProperty("zf")){
                this.state.routeNetwork.data[key]["zf"].forEach((v)=>{
                    let ourAir = airMes(store.getState().airList,v);
                    er.push({
                        fromMes:selAir,
                        toMes:ourAir,
                        fromName:selAir.airlnCd,
                        toName:ourAir.airlnCd,
                        coords:[[selAir.cityCoordinateJ,selAir.cityCoordinateW],[ourAir.cityCoordinateJ,ourAir.cityCoordinateW]],
                        type:0, // 0,直飞、1，经停
                    })
                });
            }
            if(this.state.routeNetwork.data[key].hasOwnProperty("jt")){
                this.state.routeNetwork.data[key]["jt"].forEach((v)=>{
                    v = v.split("-");
                    let selAir = airMes(store.getState().airList,key);
                    let mAir = airMes(store.getState().airList,v[0]);
                    let lAir = airMes(store.getState().airList,v[1]);

                    er.push({
                        fromMes:selAir,
                        toMes:mAir,
                        fromName:selAir.airlnCd,
                        toName:mAir.airlnCd,
                        coords:[[selAir.cityCoordinateJ,selAir.cityCoordinateW],[mAir.cityCoordinateJ,mAir.cityCoordinateW]],
                        type:1, // 0,直飞、1，经停
                    });

                    er.push({
                        fromMes:mAir,
                        toMes:lAir,
                        fromName:mAir.airlnCd,
                        toName:lAir.airlnCd,
                        coords:[[mAir.cityCoordinateJ,mAir.cityCoordinateW],[lAir.cityCoordinateJ,lAir.cityCoordinateW]],
                        type:1, // 0,直飞、1，经停
                    });
                });
            }
            lines[key] = er;
        }
        // 组装自己航线网图
        if(this.state.routeNetwork.list !== undefined){
            let er = [];
            this.state.routeNetwork.list.forEach((data)=>{
                let odata = data.split('-');
                let s1 = airMes(store.getState().airList,odata[0]);
                let s2 = airMes(store.getState().airList,odata[1]);
                er.push({
                    fromMes:s1,
                    toMes:s2,
                    fromName:s1.airlnCd,
                    toName:s2.airlnCd,
                    coords:[[s1.cityCoordinateJ,s1.cityCoordinateW],[s2.cityCoordinateJ,s2.cityCoordinateW]],
                    type:0, // 0,直飞、1，经停
                });
            });
            lines[store.getState().role.airlineretrievalcondition] = er;
        };
        // TODO 需求数据
        this.rs = routesData(this.state.allDot);
        // TODO 航点数据
        this.point = store.getState().airList;
        // TODO 航线网路图数据
        this.lines = lines;
        this.setOption();
    }
    /**
     * 初始化地图
     *
     * */
    setOption(){
        let airD = airMes(store.getState().airList,store.getState().role.airlineretrievalcondition);
        let coordinates =  store.getState().role.role === '0' ? ["110.47", "32.40"] : [airD.cityCoordinateJ,airD.cityCoordinateW];
        this.map.centerAndZoom(new BMap.Point(coordinates[0],coordinates[1]), 6);  // 设置地图中心点
        this.map.enableScrollWheelZoom(true);   // 设置滚轮缩放
        this.map.setMapStyle({styleJson: zs.styleJson });  // 设置地图图层样式
        this.map.enableKeyboard();
        this.listener();
        this.dorPoint();
    }
    /**
     * 绘制航点
     *
     * */
    dorPoint(){
        if(store.getState().airList,store.getState().role.role === "0"){
            // TODO 航点实例
            this.pointInstance = MapMethods.point(this.point);
            this.pointInstance.list.forEach((val)=>{
                this.addEventIpon(val);
                this.map.addOverlay(val);
            });
        };
    }
    /**
     * 添加坐标图例事件事件
     * */
    addEventIpon(val){
        val.addEventListener("click",(a)=>{
            emitter.emit('tipBox',a.target.mandatorytype.mes.iata);
            setTimeout(() => {  // 展开机场信息列表
                let infMesBox = document.getElementById('inf-mes-box');
                let caseBox = document.getElementById('root');
                infMesBox.style.left = `${a.clientX + 30}px`;
                infMesBox.style.top = `${a.clientY}px`;
                infMesBox.style.display = 'block';
                let lf = caseBox.clientWidth - infMesBox.clientWidth - 50;
                if(a.clientX > lf){
                    infMesBox.style.left = `${lf}px`;
                };
                let tp = caseBox.clientHeight - infMesBox.clientHeight - 100;
                if(a.clientY > tp){
                    infMesBox.style.top = `${tp}px`;
                };
            }, 50);
        })
    }
    /**
     * 添加图例事件
     * */
    addEventIcon(val){
        val.addEventListener("click",(a)=>{
            let mes = a.target.mandatorytype.mes;
            switch(a.target.mandatorytype.type){
                case 0:
                    emitter.emit("pushAirport",mes);
                    emitter.emit("resSearchData",mes);
                    break;
                case 1:
                    emitter.emit("pushAirport",mes);
                    emitter.emit("resSearchData",mes);
                    break;
            }
        })
    }
    /**
     * 添加监听
     *
     * */
    listener(){
        emitter.addEventListener("marketRelease",(type = null)=>{
            if(type === null){
                type = this.state.tagType;
            }else{
                this.setState({
                    tagType:type
                },()=>{
                    emitter.emit("showLines",this.code);
                });
            };
            // TODO 需求实例
            let a = [], //  气泡-市场
                b = [], //  图例-市场
                c = [], //  气泡-我的发布
                d = []; //  图例-我的发布
            let cls =  store.getState().role.viewMode;
            let dt = [];
            if(type){
                if(cls === 0){
                    dt = this.rs[0];
                }else{
                    dt = this.rs[1];
                }
            }else{
                if(cls === 0){
                    dt = this.rs[2];
                }else{
                    dt = this.rs[3];
                }
            };
            this.demand.listDemand.forEach((val)=>{
                this.map.removeOverlay(val);
            });
            this.demand.listCro.forEach((val)=>{
                this.map.removeOverlay(val);
            });
            let demand = MapMethods.demand(dt,cls);

            this.demand = {
                listDemand:demand.listDemand,
                listCro:demand.listCro
            };
            demand.listDemand.forEach((val)=>{
                this.addEventIcon(val);
                this.map.addOverlay(val);
                // val.addEventListener("mouseover",function () {
                //     val.setZIndex(27000);
                // })
            });
            demand.listCro.forEach((val)=>{
                this.addEventIpon(val);
                this.map.addOverlay(val);
            });
        });
        emitter.addEventListener('showLines',(code = '')=>{
            try{
                this.ar.instance.forEach((item)=>{
                    this.map.removeOverlay(item);
                });
                this.code = code;
                if(code === ""){return};
                let rs = [],curveStyle = { strokeWeight:1.4, strokeOpacity:1};//strokeColor:"#a5baff"
                let resList = rs.map((data)=>{
                    return data.mes.iata;
                });
                this.lines[code].forEach((data)=>{
                    // TODO 只做错误坐标打印
                    if(data.coords[0][0] == null || data.coords[0][1] == null ||  data.coords[1][0] == null ||  data.coords[1][1] == null){
                        console.log(data);
                        return;
                    };
                    let from = new BMap.Point(data.coords[0][0],data.coords[0][1]);
                    let to = new BMap.Point(data.coords[1][0],data.coords[1][1]);
                    let curve = new BMapLib.CurveLine([from,to], Object.assign(curveStyle,{"strokeColor":data.type === 0 ? "#a5baff" : "rgba(112,194,144,.8)"}));
                    this.ar.instance.push(curve);
                    this.map.addOverlay(curve);
                    let labelStyle = {
                        fontSize : "12px",
                        border:"none",
                        color:"#605E7C",
                        backgroundColor:"transprant",
                        textShadow:"1px 1px 1px #ededed"
                    };
                    // 点
                    let bz = (iata,name,point)=>{
                        resList.push(iata);
                        let myLabel = new BMap.Label("<div class='map-demand-cutline-label'></div>",     //为lable填写内容
                            {offset:new BMap.Size(-4,-4),
                                position:point});
                        myLabel.setStyle({                                   //给label设置样式，任意的CSS都是可以的
                            border:"0",                    //边
                            height:"8px",                //高度
                            width:"8px",                 //宽
                            textAlign:"center",            //文字水平居中显示
                            cursor:"pointer",
                            borderRadius:"50%",
                            backgroundColor:"#CDCDCD"
                        });
                        myLabel.setZIndex(4);
                        // this.map.addOverlay(myLabel);
                        this.ar.instance.push(myLabel);

                        let label = new BMap.Label(name,{position:point});
                        label.setZIndex(4);
                        label.setStyle(labelStyle);
                        label.setOffset(new BMap.Size(10, -10));
                        this.map.addOverlay(label);
                        this.ar.instance.push(label);
                    };
                    let ld = (point)=>{
                        let ldLabels = new BMap.Label("<div class='map-demand-cutline-label'></div>",     //为lable填写内容
                            {offset:new BMap.Size(-4,-4),
                                position:point});
                        ldLabels.setStyle({                                   //给label设置样式，任意的CSS都是可以的
                            border:"0",                    //边
                            height:"8px",                //高度
                            width:"8px",                 //宽
                            textAlign:"center",            //文字水平居中显示
                            borderRadius:"50%",
                            backgroundColor:"transparent"
                        });
                        ldLabels.setZIndex(4);
                        this.map.addOverlay(ldLabels);
                        this.ar.instance.push(ldLabels);
                    };
                    if(!resList.includes(data.fromMes.iata)){
                        bz(data.fromMes.iata,data.fromName,from);
                        ld(from);
                    };
                    if(!resList.includes(data.toMes.iata)){
                        resList.push(data.toMes.iata);
                        bz(data.toMes.iata,data.toName,to);
                        ld(to);
                    };
                });
            }catch (e) {
                console.log(e);
            }
        });
        emitter.addEventListener("changeHd", (data)=> {
            if(!data){
                this.pointInstance.text.forEach((val)=>{
                    this.map.addOverlay(val);
                });
            }else{
                this.pointInstance.text.forEach((val)=>{
                    this.map.removeOverlay(val);
                });
            }
        });
        emitter.addEventListener("addLines",({v,t} = {...b})=>{
            let airList = store.getState().airList,pots = [],lines;
            if(v !== null){
                lines = `${v.dpt}=${v.pst}=${v.arrv}`;
            }
            if(t){
                if(!this.airLine.hasOwnProperty(lines)){
                    if (v.dpt != null && v.dpt != '') {
                        let jw = airMes(airList, v.dpt);
                        pots.push(new BMap.Point(jw.cityCoordinateJ, jw.cityCoordinateW))
                    }
                    if (v.pst != null && v.pst != '') {
                        let jw = airMes(airList, v.pst);
                        pots.push(new BMap.Point(jw.cityCoordinateJ, jw.cityCoordinateW))
                    }
                    if (v.arrv != null && v.arrv != '') {
                        let jw = airMes(airList, v.arrv);
                        pots.push(new BMap.Point(jw.cityCoordinateJ, jw.cityCoordinateW))
                    }
                    let color = ['#ab38fc','#1b00cf','#fb363c'];
                    let setColor = color[Math.floor(Math.random()*3)];
                    while (this.colorList.includes(setColor)){
                        setColor = color[Math.floor(Math.random()*3)];
                    }
                    let curve = new BMapLib.CurveLine(pots, {strokeColor: setColor, strokeWeight: 3, strokeOpacity: 1}); //创建弧线对象
                    this.map.addOverlay(curve); //添加到地图中
                    this.airLine[lines] = {
                        curve,
                        setColor
                    };
                    this.colorList.push(setColor);
                }
            }else{
                if(v === null){
                    for(let i in this.airLine){
                        this.map.removeOverlay(this.airLine[i].curve);
                        delete this.airLine[i];
                    }
                    this.colorList = [];
                }else{
                    try{
                        this.colorList.splice(this.colorList.indexOf(this.airLine[lines].setColor),1);
                        this.map.removeOverlay(this.airLine[lines].curve);
                        delete this.airLine[lines];
                    }catch (e){

                    }
                }
            }
        });
        emitter.emit("showLines",store.getState().role.airlineretrievalcondition);
        emitter.emit("marketRelease",true);
    }
    render(){
        return(
            <div id="maps" className={style['map-box-style']} ref={"maps"}></div>
        )
    }
}
