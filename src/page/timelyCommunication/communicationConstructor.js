/* eslint-disable */

import {store} from "../../store/index";
import emitter from "../../utils/events";

/** 即时通讯
 *  @param {w} ws的地址
 *  @param {obj} 传入的tim...对象
 *  author Allan
 * */
export default class ChatSocket{
    constructor(w,obj){
        this.w = w;
        this.obj = obj;
        this.online(w);
    }
    cts(){
        let obj = this.obj;
        this.ws.onopen = () => {
            console.log('打开连接');
        };
        this.ws.onmessage = (data) => {
            let chat = JSON.parse(data.data),chatFlag;
            console.log(chat);
            switch (chat.type) {
                case "message" || "remind":
                    break;
                case "system":
            };
            if(chat.type === "isChat"){
                chatFlag = chat.chatFlag;
            }else if(chat.type === "system" || chat.type === "systemMessageAlreadyRead"){
                chatFlag = "x-t-null";
            }else{
                chatFlag = chat.data.chatFlag;
            };
            let selfId = store.getState().role.id;
            try{
                if (chat.type === "message" || chat.type === "remind") {
                    if(obj.state.chatData.hasOwnProperty(chatFlag)){
                        if (obj.state.chatData[chatFlag].chatRcord == null) {
                            obj.state.chatData[chatFlag].chatRcord = {
                                list: []
                            }
                        };
                        obj.state.chatData[chatFlag].chatRcord.list.splice(0, 0, chat.data);
                        if (chat.data.chatFlag != obj.state.setId) {
                            obj.state.chatData[chatFlag].noReadCount = 1;
                        }
                        // obj.state.chatData[chatFlag].modifyRcord.list.push(chat.data);
                    }else{
                        let a = chatFlag.split("-");
                        obj.openChat({
                            fromNameId:selfId,
                            toNameId:selfId === Number(a[0]) ?  Number(a[1]) : Number(a[0]),
                            responsePlanId:a[2]
                        },false);
                    }
                } else if (chat.type === "system") {
                    obj.state.chatData["x-t-null"].chatRcord.list.splice(0, 0, chat.data);
                    if ( obj.state.setId != "x-t-null") {
                        obj.state.chatData["x-t-null"].noReadCount = 1;
                    }
                }else if(chat.type === "isChat"){
                    if(!obj.state.chatData.hasOwnProperty(chatFlag)){
                        let a = chatFlag.split("-");
                        obj.openChat({
                            fromNameId:selfId,
                            toNameId:selfId === Number(a[0]) ? a[1] : a[0],
                            responsePlanId:a[2]
                        },false);
                    }else{
                        obj.state.chatData[chatFlag].isSendMessage =  chat.isSendMessage;
                    }
                    if(chat.isSendMessage === "2"){
                        delete obj.state.chatData[chatFlag];
                        obj.state.setId = "x-t-null";
                    }
                }else if(chat.type === "systemMessageAlreadyRead"){
                    let ids = chat.ids.split(",");
                    obj.state.chatData['x-t-null'].chatRcord.list.forEach((value,ky)=>{
                        if(ids.includes(value.id.toString())){
                            obj.state.chatData['x-t-null'].chatRcord.list[ky].state = "0";
                            let num = 0;
                            obj.state.chatData['x-t-null'].chatRcord.list.forEach((val,key)=>{
                                if(val.state !== '0'){
                                    num += 1;
                                }
                            });
                            obj.state.chatData['x-t-null'].noReadCount = num;
                            obj.setState(()=>({
                                chatData:obj.state.chatData
                            }));
                        }
                    });
                };
                obj.setState(()=>({
                    chatData:obj.state.chatData
                }),function () {
                    obj.updateNum();
                })
            }catch (e){
                console.log(e)
            }
        };
        this.ws.onclose = () => {
            console.log('关闭连接');
            this.online(this.w);
        };
        this.ws.onerror = () => {
            console.log('error连接错误');
        };
    }
    online(w){
        if ('WebSocket' in window) {
            this.ws = new WebSocket(w);
            this.cts();
        } else if ('MozWebSocket' in window) {
            this.ws = new MozWebSocket(w);
            this.cts();
        } else {
            alert("not support");
        };
    }
}