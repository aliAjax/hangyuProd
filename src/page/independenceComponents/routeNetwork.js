
import React, { Component } from 'react';
import Axios from './../../utils/axiosInterceptors';
import {store} from './../../store/index'

import emitter from '../../utils/events';
import style from './../../static/css/independenceComponents/independenceComponents.scss';
import modelTag from './../../static/img/model/modelTag.png';
import modelPao from './../../static/img/model/modelPao.png';
import {assemblyAction as an} from "../../utils/assemblyAction";

export default class RouteNetwork extends Component{
    constructor(props){
        super(props);
        this.state = {
            ched1: false,
            modelTag:false,
            modelPao:true,
            setIcon:'modelTag',
            max_model_magic:false,
            setHd:true, // 航点
        }
    }
    componentWillMount(){  // 将要渲染

    }
    componentWillReceiveProps(nextProps){  // Props发生改变

    }
    componentWillUnmount(){  // 卸载组件

    }
    changePoint(){
        this.setState({
            ched1:!this.state.ched1
        },function () {
            if(!this.state.ched1){
                emitter.emit('closeHxwl');
                emitter.emit('showLines',store.getState().role.airlineretrievalcondition);
            }else{
                emitter.emit('showLines','');
            }
        });
    }
    showModeIcon(t){
        if(t){
            this.setState({
                max_model_magic:true,
                modelTag:true,
                modelPao:true
            })
        }else{
            this.setState({
                max_model_magic:false
            });
            if(this.state.setIcon === "modelTag"){
                this.setState({
                    modelTag:true,
                    modelPao:false
                });
            }else if(this.state.setIcon === "modelPao"){
                this.setState({
                    modelTag:false,
                    modelPao:true
                });
            }
        }
    }
    changeMode(t){
        switch (t){
            case 'modelTag':
                this.setState({
                    setIcon:"modelTag",
                    modelTag:true,
                    modelPao:false,
                    max_model_magic:false
                });
                this.changeViewMode(1);
                break;
            case 'modelPao':
                this.setState({
                    setIcon:"modelPao",
                    modelTag:false,
                    modelPao:true,
                    max_model_magic:false
                });
                this.changeViewMode(0);
                break;
        };
    }
    changeViewMode(t){
        if(t != undefined){
            Axios({
                method: 'post',
                url: '/changeViewMode',
                params: {
                    viewMode: t,
                },
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            })
                .then((response) => {
                    if(response.data.opResult === 0){
                        store.dispatch(an('ROLE', Object.assign( store.getState().role,{viewMode:t})));
                        emitter.emit('marketRelease');
                    }
                })
                .catch((error) => {
                        console.log(error);
                    }
                );
        }
    }
    changeHd(){
        this.setState({
            setHd:!this.state.setHd
        },function () {
            emitter.emit("changeHd",this.state.setHd);
        });
    }
    componentDidMount(){
        this.setState({
            modelTag:store.getState().role.viewMode === 0 ? false : true,
            modelPao:store.getState().role.viewMode === 0 ? true : false,
            setIcon:store.getState().role.viewMode === 0 ? 'modelPao' : 'modelTag'
        });
        emitter.addEventListener("closeWohx",()=>{
            this.setState({
                ched1:true
            })
        })
    }
    render(){
        let hd = store.getState().role.role === '0' ?
            <div className={style['user-select']}>
                航点
                <div id='turnLine1' onClick={this.changeHd.bind(this)} className={`${this.state.setHd ? style['iskg1'] : style['iskg0']} ${style['iskg']}`}>
                    <span className={`${this.state.setHd ? style['iskgCkecked'] : ""} ${style['turn-off']}`}>&#xe61e;</span>
                </div>
            </div>
            :
            '';
        return(
            <div className={style['route-network']}>
                <div className={style['user-select']}>
                    我的航线网络图
                    <div id='turnLine1' onClick={this.changePoint.bind(this)} className={`${this.state.ched1 ? style['iskg1'] : style['iskg0']} ${style['iskg']}`}>
                        <span className={`${this.state.ched1 ? style['iskgCkecked'] : ""} ${style['turn-off']}`}>&#xe61e;</span>
                    </div>
                </div>
                {
                    store.getState().role.role === '0' ? "" :
                        <div className={style["line-annotation"]}>
                            <div>
                                <span>直飞</span>
                                <div style={{backgroundColor:"#4177fd"}}></div>
                            </div>
                            <div>
                                <span>经停</span>
                                <div style={{backgroundColor:"#62b083"}}></div>
                            </div>
                        </div>
                }
                {hd}
                <section className={`${style['model-magic']} ${this.state.max_model_magic ? style['max-model-magic'] : ''}`}
                     onMouseEnter={this.showModeIcon.bind(this,true)}
                     onMouseLeave={this.showModeIcon.bind(this,false)}
                >
                    {
                        this.state.modelTag ? <div className={style['model-magic-tag']} onClick={this.changeMode.bind(this,'modelTag')}><img src={modelTag} alt="" /></div> : ""
                    }
                    {
                        this.state.modelPao ? <div className={style['model-magic-pao']} onClick={this.changeMode.bind(this,'modelPao')}><img src={modelPao} alt="" /></div> : ""
                    }
                </section>
            </div>
        )
    }
}

