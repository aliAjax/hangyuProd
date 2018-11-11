
/* eslint-disable */
import React, { Component } from 'react';
import { host as $host} from "./../../utils/port";
import Axios from './../../utils/axiosInterceptors';
import ChatSocket from './communicationConstructor'
import emitter from './../../utils/events';
import {store} from './../../store/index';
import style from './../../static/css/timely/timely.scss';
import classNames from 'classnames';

export default class TimelyCommunication extends Component{
    constructor(props){
        super(props);
        this.state = {
            setId:'',
            newline: {
                enter: false,
                ctrl: false
            },
            ishs: true,
            selectModifyHistory: null,
            timelyBox: "",
            timelyBoxXY: {
                // 最后设置的聊天框位置
                x: 10,
                y: 10
            },
            textData: "",
            dropData: {
                mouseCoordinate: {
                    x: 0,
                    y: 0
                },
                switch: false
            },
            chatData:[], // 聊天数据
            sysData:[], // 聊天数据
            showBox:false,
        };
        this.updateNum = this.updateNum.bind(this);
    }

    componentWillMount(){  // 将要渲染

    }
    componentDidMount() {   // 加载渲染完成
        this.initData();
        emitter.addEventListener("openTimeBox", (type)=>{
            this.setState({
                showBox:type
            });
        });
        emitter.addEventListener("openChat", (obj)=>{
            this.openChat(obj);
        });
        let st = $dev ? `${$socketIp}${store.getState().role.id}` : `ws://${$host}/socket?name=${store.getState().role.id}`;
        this.ChatSocket = new ChatSocket(st,this);
    }
    componentWillReceiveProps(nextProps){  // Props发生改变

    }
    componentWillUnmount(){  // 卸载组件
        delete this.ChatSocket;
    }
    assembly(data){
        let a = {};
        data.data.forEach((va,key)=>{
            a[va.chatFlag] = va;
        });
        a['x-t-null'] = Object.assign(data.systemMessage,{'chatFlag':'x-t-null'});
        this.setState((val,key)=>({
            chatData:a,
        }),()=>{
            this.updateNum();
        });
    }
    initData(){
        Axios({
            method: 'post',
            url: '/openChat',
            params: {
                fromNameId: store.getState().role.id,
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        })
            .then((response) => {
                if(response.data.opResult === '0'){
                    // emitter.emit("changeNum",`${response.data.data.length + response.data.systemMessage.noReadCount}`);
                    if(response.data.data.length > 0){
                        this.setState({
                            setId:response.data.data[0].chatFlag
                        },()=> {
                            this.assembly(response.data);
                        });
                    }else{
                        this.setState({
                            setId:'x-t-null'
                        },()=> {
                            this.assembly(response.data);
                        });
                    }
                    this.initBox();

                }
            })
            .catch((error) => {
                    console.log(error);
                }
            );
    }
    // TODO 发起会话接口
    /**
     * 发起会话接口
     * params {obj} 两个属性  toNameId 、对方id，responsePlanId 方案id，如无方案id则传null
     *  author Allan
     * */
    openChat(obj,open = true){
       try{
           let responsePlanId = obj.responsePlanId ?  obj.responsePlanId : null;
           let setId = "",item1 = `${store.getState().role.id}-${obj.toNameId}-${responsePlanId}`,item2 = `${obj.toNameId}-${store.getState().role.id}-${responsePlanId}`;
           setId = this.state.chatData.hasOwnProperty(item1) ? item1 : setId;
           setId = this.state.chatData.hasOwnProperty(item2) ? item2 : setId;
           if(setId !== '' && open){
               this.setState({
                   showBox:true
               },()=>{
                   this.setState({
                       setId
                   });
               });
               return;
           }
           Axios({
               method: 'post',
               url: '/openChat',
               params: {
                   fromNameId: store.getState().role.id,
                   toNameId:obj.toNameId,
                   responsePlanId:(obj.responsePlanId === "null" || obj.responsePlanId === null || obj.responsePlanId === undefined || obj.responsePlanId === "undefined") ? "" : obj.responsePlanId
               },
               headers: {
                   'Content-type': 'application/x-www-form-urlencoded'
               }
           })
               .then((response) => {
                   if (response.data.opResult == "0") {
                       if (!this.state.chatData.hasOwnProperty(response.data.data["0"].chatFlag)) {
                           this.state.chatData[response.data.data["0"].chatFlag] = response.data.data["0"];
                           this.state.setId = response.data.data["0"].chatFlag;
                           this.setState(()=>({
                               chatData:this.state.chatData
                           }),()=>{
                               if(open){
                                   this.setState({
                                       showBox:true
                                   })
                               }
                           });
                       }
                   }
                   this.updateNum();
               })
               .catch((error) => {
                       console.log(error);
                   }
               );
       }catch (e){
           console.log(e)
       }
    }
    initBox() {
        this.state.timelyBox = this.refs['timely-box'];
        let app = document.getElementById("root");
        let left = (app.offsetWidth - 900) / 2;
        let top = (app.offsetHeight - 600) / 2;
        this.state.timelyBoxXY.x = left;
        this.state.timelyBoxXY.y = top;
        this.state.timelyBox.style.left = left + 'px';
        this.state.timelyBox.style.top = top + 'px';
        document.addEventListener("mousemove", e => {
            if (this.state.dropData.switch) {
                this.state.timelyBox.style.left = this.state.timelyBoxXY.x + (e.screenX - this.state.dropData.mouseCoordinate.x) + 'px';
                this.state.timelyBox.style.top = this.state.timelyBoxXY.y + (e.screenY - this.state.dropData.mouseCoordinate.y) + 'px';
            }
        });
    }
    inputTextarea(data){
        this.setState({
            textData:this.refs['textarea'].value
        });
    }
    sendData(){
        if (this.state.textData === "") return;
        let ids = this.state.setId.split("-");
        let len = ids.indexOf(String(store.getState().role.id)) == 0 ? true : false;
        let p = {
            fromNameId: len ? ids[0] : ids[1],
            toNameId: len ? ids[1] : ids[0],
            responsePlanId: ids[2] == 'null' ? '' : ids[2],
            text: this.state.textData
        };
        Axios({
            method: "post",
            url: "/api/send",
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            params: p
        })
            .then(response => {
                if(response.data.message === 'success'){
                    this.setState({
                        textData:""
                    },function () {
                       this.refs['textarea'].value = '';
                    })
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    openhs () {
        this.setState({
           ishs:!this.state.ishs
        },function () {
        });
    }
    setChat(key){
        this.setState({
            setId:key
        },function () {
            if (key === 'x-t-null') return;
            this.updataMes(key);
            setTimeout(() => {
               this.refs[ "chat-function-banner"].scrollTop =  this.refs[ "chat-function-banner"].scrollHeight;}, 10);
        });
    }
    clearAndBindDrop(t, event) {
        this.state.dropData.mouseCoordinate.x = event.screenX;
        this.state.dropData.mouseCoordinate.y = event.screenY;
        this.state.timelyBoxXY.x = this.state.timelyBox.offsetLeft;
        this.state.timelyBoxXY.y = this.state.timelyBox.offsetTop;
        // 绑定拖拽事件
        if (t) {
            this.state.dropData.switch = true;
        } else {
            this.state.dropData.switch = false;
        };
    }
    // 更新icon的未读数量显示
    updateNum(){
        let num = 0;
        for(let key in this.state.chatData){
            if(this.state.chatData[key].noReadCount > 0){
                num += 1;
            }
        };
        try {
            this.refs[ "chat-function-banner"].scrollTop =  this.refs[ "chat-function-banner"].scrollHeight;
        }catch (e){
        }
        emitter.emit("changeNum",num);
    }
    woListScrollMes(e){
        if(e.target.scrollTop < e.target.scrollHeight/2){
            if(this.state.chatData[this.state.setId].pageNo === this.state.chatData[this.state.setId].pageCount)return;
            let sed = this.setId.split('-'),
                num = Number(this.state.chatData[this.satte.setId].chatRcord.pageNo) + 1;
            params = {
                fromNameId:store.getState().role.id,
                toNameId:sed[0] == store.getState().role.id ? sed[1] : sed[0],
                page:num,
                demandId:sed[2] == 'null' ? "":sed[2]
            }
            Axios({
                url:"/openNormalChat",
                method: "post",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                params
            }).then((res)=>{
                if (res.data.opResult === "0"){
                    this.state.chatData[this.state.setId].chatRcord.list = [...this.state.chatData[this.state.setId].chatRcord.list,...res.data.systemMessage.chatRcord.list];
                    this.setState(()=>({
                        chatData:this.state.chatData
                    }),()=> {
                        this.updateNum();
                    });
                }
            });
        }
    }
    woListScrollSys(e){
        if(e.target.scrollTop > e.target.scrollHeight/2){
            if(this.state.chatData['x-t-null'].pageNo === this.state.chatData['x-t-null'].pageCount)return;
            let page = this.state.chatData['x-t-null'].chatRcord.pageNo + 1;
            Axios({
                url:"/openSystemChat",
                method: "post",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                params: {
                    fromNameId:store.getState().role.id,
                    page
                }
            }).then((res)=>{
                if (res.data.opResult === "0"){
                    this.state.chatData['x-t-null'].chatRcord.list = [...this.state.chatData['x-t-null'].chatRcord.list,...res.data.systemMessage.chatRcord.list];
                    this.state.chatData['x-t-null'].chatRcord.pageNo = page;
                    this.state.chatData['x-t-null'].noReadCount = Number(this.state.chatData['x-t-null'].noReadCount) + Number(res.data.systemMessage.noReadCount);
                    this.setState(()=>({
                        chatData:this.state.chatData
                    }),()=> {
                        this.updateNum();
                    });
                }
            });
        }

    }
    /**
     * 查看详情
     * */
    queryMes(val){
        let data ={
            openFrom:true,
            fromType:3,
            fromMes:{
                tabType:'mine',
                transmit:{
                    id:this.state.chatData[this.state.setId].demandId
                }
            }
        };
        emitter.emit('openFrom',data);
    }
    chatList(data){
        let role = store.getState().role;
        let node = data.map((val,key)=>{
            let img = (val.textType == '0' && val.fromNameId == role.id) ? store.getState().role.headPortrait : this.kfIng().headPicture;
            return (
                <div key={key} className={classNames({[style['modify-the-information']]:(val.textType == '1'),[style['oneself-news']]:(val.textType == '0' && val.fromNameId == role.id),[style['others-news']]:(val.textType == '0' && val.fromNameId != role.id)})}>
                    {
                        val.textType == '0' ? <div className={style["head-portrait"]}><img src={img} /></div> : ''
                    }
                    {
                        val.textType == '0' ? <div className={style["say-words"]}><p>{val.date}</p><div className={style["popup"]}>{val.text}</div></div>: ''
                    }
                    {
                        val.textType != '0' ? <span><p>{val.date}</p><span></span>{val.text}</span> : ''
                    }
                </div>
            )
        });
        return node;
    }
    keyPress(e){
        if(e.keyCode === 13){
            e.preventDefault();
            this.sendData();
        }
    }
    sChangec(){
        if(this.state.setId != 'x-t-null'){
        // if(1==0){
            let a = JSON.parse(JSON.stringify(this.state.chatData[this.state.setId].chatRcord.list)).reverse();
            return (
                <div className={style["chat-function"]}>
                    <div   onScroll={this.woListScrollMes.bind(this)}
                         className={classNames({[style["chat-function-banner"]]:true})}
                         ref="chat-function-banner">
                        <div className="scroll">
                            {
                                this.chatList(a)
                            }
                        </div>
                    </div>
                    {
                        this.state.chatData[this.state.setId].isSendMessage === "1" ?
                            <div className={style["chat-function-input"]} key={"chat-function-input-0"}>
                                <textarea onKeyDown={this.keyPress.bind(this)} className={style["chat-hover"]} maxLength={200} name="a" ref="textarea" onInput={this.inputTextarea.bind(this)} onMouseDown={(e)=>{e.stopPropagation()}}></textarea>
                                <div onClick={this.sendData.bind(this)} className={classNames({"btn":true,'btn-b':true,[style['user-select']]:true,[style['req-bth']]:true})} id="req-bth">发送(Enter)</div>
                            </div>
                            :
                            <div className={style["chat-function-input"]} key={"chat-function-input-1"}>
                                <textarea className={style["chat-hover"]} style={{paddingTop:"25px",fontSize:"14px",color:"rgba(204,204,204,1)"}} disabled='disabled' value="需求已完成或关闭，不能发送消息"></textarea>
                                <div className={classNames({[style['user-select']]:true,[style['req-bth']]:true,'may-btn-gary':true})} id="req-bth">发送(Enter)</div>
                            </div>
                    }
                </div>
            )
        }else{
            // let a = JSON.parse(JSON.stringify(this.state.chatData['x-t-null'].chatRcord.list)).reverse();
            let a = this.state.chatData['x-t-null'].chatRcord.list;
            return (
                <div className={style["chat-detailed"]} onScroll={this.woListScrollSys.bind(this)}>
                    {
                        a.map((val,index)=>{
                            return (
                                <div key={index} className={style["chat-detailed-item"]}>
                                    <div className={classNames({[style['chat-detailed-title']]:true,[style['information-x1']]:(val.state == '1')})}><span>{val.title}</span>{val.date}</div>
                                    <div className={classNames({[style["chat-detailed-text"]]:true,[style['popup']]:true})}>{val.text}</div>
                                    <div onClick={this.updataSys.bind(this,val)} className={classNames({[style['chat-detailed-btn']]:true,'btn':true,'btn-b':true})} >查看详情</div>
                                </div>
                            )
                        })
                    }
                </div>
            )
        }
    }
    kfIng() {
        let argss = {
            name:"",
            department:"",
            company:"",
            phone:"",
            iata:"",
            headPicture:""
        };
        this.state.chatData[this.state.setId].chatObjectList.forEach((val,key)=>{
            argss[val.key] = val.val
        });
        return argss;
    }
    mesList(){
       if(!this.state.chatData[this.state.setId].chatFlag.includes("null")){
            return(
                <div className={style["personal"]}>
                    {
                        this.state.ishs ?
                            <div className={style["personal-c"]}>
                                <div className={style["personal-panel"]}>
                                    <div className={style['personal-panel-portrait']}>
                                        {
                                            this.kfIng().headPicture === undefined ? "" :  <img src={this.kfIng().headPicture}/>
                                        }
                                    </div>
                                    <div className={style["personal-panel-name"]}>
                                        <p className={style["max-length"]} title={this.kfIng().name}>{this.kfIng().name}</p>
                                        <div className={style["max-length"]} title={`${this.kfIng().department}${this.kfIng().company}`}>{this.kfIng().department}<span>{this.kfIng().company}</span></div>
                                        <div className={style["max-length"]} title={this.kfIng().phone}>{this.kfIng().phone}</div>
                                    </div>
                                </div>
                                <div className={style["demand-history"]}>
                                    <div>{this.state.chatData[this.state.setId].title}</div>
                                    <span onClick={this.openhs.bind(this)} title="历史记录">&#xe63b;</span>
                                </div>
                                <div className={classNames({[style['demand-describe']]:true})}>
                                    <div>
                                        {
                                            this.state.chatData[this.state.setId].rightTableUp.map((key,i)=>{
                                                return(
                                                    <div key={i}>
                                                        <div>{key.key}</div>
                                                        <div title={key.val}>{key.val == 'null' ? '': key.val}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                        {
                                            this.state.chatData[this.state.setId].rightTableDown.map((key,i)=>{
                                                return(
                                                    <div key={i}>
                                                        <div>{key.key}</div>
                                                        <div title={key.val}>{key.val == 'null' ? '': key.val}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            :
                            <div onClick={this.openhs.bind(this)} className={classNames({[style["personal-hy-btn"]]:true,'btn':true,'btn-b':true})}></div>
                    }
                    {
                        this.state.ishs ?
                            <div className={classNames({[style["view-btn"]]:true,'btn-w':true})} onClick={this.queryMes.bind(this,this.state.setId.split("-")[2])}>查看订单详情</div>
                            :
                            <div className={style["personal-hy"]}>
                                {
                                    this.state.chatData[this.state.setId].modifyRcord.list.length === 0 ?
                                        <div className={style["none-personal-hy"]}>无修改记录</div>
                                        :
                                        <div className={style["personal-hy-t"]}>
                                            修改记录({this.state.chatData[this.state.setId].modifyRcord.list.length}条)
                                        </div>
                                }
                                {
                                    this.state.chatData[this.state.setId].modifyRcord.list.length != 0 ?
                                        this.state.chatData[this.state.setId].modifyRcord.list.map((key,i)=>{
                                            return (
                                                <div key={i} className={style["personal-hy-i"]}>
                                                    <div>{key.date}{key.text}</div>
                                                </div>
                                            )
                                        })
                                        :
                                        ''
                                }
                            </div>
                    }
                </div>
            )
       }else if(store.getState().role.role === '2' && this.state.setId != 'x-t-null'){
           return(
               <div className={style["personal-x"]}>
                   <div className={style["personal-x-kf"]}>
                   </div>
                   <div className={style["personal-x-title"]}>
                       <span>公司</span>
                       <h4>{this.state.chatData[this.state.setId].rightTableUp[0].val}</h4>
                   </div>
                   <div className={style["personal-x-item"]}>
                       <span>部门</span>
                       <p>{this.state.chatData[this.state.setId].rightTableUp[1].val}</p>
                   </div>
                   <div className={style["personal-x-item"]}>
                       <span>机场</span>
                       <h6>{this.state.chatData[this.state.setId].rightTableUp[2].val}</h6>
                   </div>
                   <div className={style["personal-x-item"]}>
                       <span>电话</span>
                       <h6>{this.state.chatData[this.state.setId].rightTableUp[3].val}</h6>
                   </div>
                   <img src={require('./../../static/img/chat/blbj.png')} alt=""/>
               </div>
           )
       }else{
          return(
              <div className={style["personal-x"]}>
                  <div className={style["personal-x-kf"]}>
                      <img src={require('./../../static/img/login/logo.png')} alt=""/>
                  </div>
                  <div className={style["personal-x-title"]}>
                      <span>如有任何需求请联系</span>
                      <h4>{this.state.chatData[this.state.setId].rightTableUp[2].val}</h4>
                  </div>
                  <div className={style["personal-x-item"]}>
                      <span>热线</span>
                      <p>{this.state.chatData[this.state.setId].rightTableUp[3].val}</p>
                  </div>
                  {/* <div className={style["personal-x-item"]}>
                      <span>地址</span>
                      <h6>{this.state.chatData[this.state.setId].rightTableUp[0].val}</h6>
                  </div> */}
                  <img src={require('./../../static/img/chat/blbj.png')} alt=""/>
              </div>
          )
       }
    }
    closeWindow(){
        this.setState({
            showBox:false
        });
    }
    // 删除某会话
    closeItem(data,e){
        e.stopPropagation();
        delete this.state.chatData[data];
        let setId = this.state.setId;
        if(setId === data){
            setId = "x-t-null";
        }
        this.setState(({
            setId,
            chatData:this.state.chatData
        }),()=>{
            this.updateNum();
        });
    }
    updataSys(val){
        let data;
        if(val.textType === "3"){
            data = {
                openFrom:true,
                fromType:6,
                fromMes: {
                    type:false
                }
            };
            emitter.emit('openFrom',data)
        }else{
            Axios({
                url:"/updateSystemState",
                method: "post",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                params: {
                    id:val.id
                }
            }).then((res)=>{
                data ={
                    openFrom:true,
                    fromType:3,
                    fromMes:{
                        tabType:'mine',
                        transmit:{
                            id:val.demandId
                        }
                    }
                };
                emitter.emit('openFrom',data);
            });
        };
    }
    updataMes(key){
        if(this.state.chatData[key].noReadCount === 0)return;
        let id = key.split('-');
        Axios({
            url:"/updateState",
            method: "post",
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            params: {
                fromNameId: id[0] == store.getState().role.id ? id[0] : id[1],
                toNameId: id[0] == store.getState().role.id ? id[1] : id[0],
                responsePlanId : id[2] == "null" ? "" : id[2]
            }
        }).then((res)=>{
            if (res.data.opResult == "0"){
                this.state.chatData[key].noReadCount = 0;
                this.updateNum();
                this.setState(()=>({
                    chatData:this.state.chatData
                }),()=>{
                    this.updateNum();
                });
            }
        });
    }
    render(){
        let wz = {left:`${this.state.timelyBoxXY.x}px`,top:`${this.state.timelyBoxXY.y}px`};
        if(this.state.chatData.length ===0)return null;
        if(this.state.setId !== 'x-t-null'){
            if(this.refs["chat-function-bannerssss"] !== undefined){
                setTimeout(() => {
                    this.refs["chat-function-banner"].scrollTop =  this.refs["chat-function-banner"].scrollHeight;
                }, 10);
            }
        }
        let kys = [];
        Object.keys(this.state.chatData).forEach((val)=>{
            if(this.state.chatData[val].noReadCount > 0){
                kys = [val,...kys];
            }else{
                kys.push(val);
            }
        });
        return(
            <div style={wz} className={classNames({[style['timely-box']]:true,'popup':true,[style['timely-box-none']]:this.state.showBox})} ref="timely-box"
            onMouseDown={this.clearAndBindDrop.bind(this,true)}
            onMouseUp={this.clearAndBindDrop.bind(this,false)}
            >
                <div className={style["timely-nav"]}>
                    {
                        kys.map((key,i)=>{
                            if(key === 'x-t-null'){
                                return (
                                    <div onClick={this.setChat.bind(this,key)} key={i} className={classNames({[style['timely-nav-checked']]:(this.state.setId == 'x-t-null'),[style['information']]:(this.state.chatData[key].noReadCount > 0)})}>
                                        <p className={style["max-length"]}>系统消息</p>
                                        <span className={style["max-length"]}></span>
                                    </div>
                                )
                            }else{
                                return  (
                                    <div onClick={this.setChat.bind(this,key)} key={i} className={classNames({[style['timely-nav-checked']]:(this.state.setId == this.state.chatData[key].chatFlag),[style['information']]:(this.state.chatData[key].noReadCount > 0)})}>
                                        <p className={style["max-length"]}>{this.state.chatData[key].title}</p>
                                        {/*<span className={style["max-length"]}>{this.state.chatData[key].rightTableUp[2].val}</span>*/}
                                        <div className={style["close-item"]} onClick={this.closeItem.bind(this,key)}>&#xe62c;</div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
                <div className={style["timely-content"]}>
                    <div className={style["timely-content-head"]}>
                        <div className={style["timely-title"]}>{this.state.chatData[this.state.setId].title}
                            {
                                this.state.setId != 'x-t-null' ? <span>洽谈中</span> : ''
                            }
                        </div>
                        <div className={style["timely-window"]}>
                            {/*<div className={classNames({"btn-w":true,'timely-window-s':true})}>&#xe667;</div>*/}
                            <div
                                className={classNames({"btn-w":true,"timely-window-d":true})}
                                onClick={this.closeWindow.bind(this)}
                            >&#xe62c;</div>
                        </div>
                    </div>
                    <div className={style["timely-content-body"]}>
                        {
                            this.sChangec()
                        }
                        {
                            this.mesList()
                        }
                    </div>
                </div>
            </div>
        )
    }
}
