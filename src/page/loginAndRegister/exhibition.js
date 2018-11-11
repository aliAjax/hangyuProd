/* eslint-disable */
import React, { Component } from 'react';
import classNames from 'classnames';
import {CSSTransition} from 'react-transition-group';
import style from "./../../static/css/loginAndRegister/newBanner.scss"


export default class Exhibition extends Component{
    constructor(props){
        super(props);
        this.state = {
            pageIndex:0,
            changeIng:false, // 切换中
            img1:false,
            img2:false
        }
    }

    showXq(){
        if(this.state.pageIndex === 0){
            setTimeout(()=>{
                this.setState({
                    img1:true,
                });
            },3500);
            setTimeout(()=>{
                this.setState({
                    img2:true
                });
            },7000)

        }else{
            this.setState({
                img1:false,
                img2:false
            });
        }
    }
    wheel(e,t) {
        if(this.state.changeIng)return;
        let attribute = true;  // true，表示下滑动，false，上滑动

        if("deltaY" in e){
            if(e.deltaY < 0){
                attribute = false;
            };
        }else{
            if(e.detail < 0){
                attribute = false;
            };
        };
        let index = this.state.pageIndex;
        if(index === 1){
            if(attribute){
                index = 0;
            }else{
                index --;
            }
        }else if(index === 0){
            if(attribute){
                index ++;
            }else{
                index = 1;
            }
        }else{
            if(attribute){
                index ++;
            }else{
                index --;
            }
        }
        this.setState({
            pageIndex:"",
            changeIng:true
        }, ()=> {
           setTimeout(()=>{
               this.setState({
                   pageIndex:index,
               },()=>{
                   this.showXq();
               })
           },400);
            setTimeout(()=>{
                this.setState({
                    changeIng:false
                })
            },1000)
        })
    }
    componentDidMount(){
        this.showXq();
    }
    changeI(i){
        this.setState({"pageIndex":i})
    }
    render(){
        return(
            <div id={'anchorBox'} className={style['banner-panel']}>
                <img className={style['newAir']} src={require('./../../static/img/login/newAir.png')} alt=""/>
                <div className={style['banner-001']}>
                    <span>©2018 航遇 成都太美航空技术有限公司  版权所有</span>
                    <p>备案号：蜀ICP备16026684号-3
                        <a target="_blank" style={{color:'#535353',marginLeft:'10px'}} href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51019002001708"><img style={{height: "16px",transform: "translate(-3px,-3px)"}} src={"http://www.beian.gov.cn/portal/download?token=fa8b23ba-8404-46cb-99e0-6782283bd2b6"}/>川公网安备 51019002001708号</a>
                    </p>
                </div>
                <div className={style['banner-002']}>
                    <span>版本公告</span>
                    <p>版本号：{version_numbe}</p>
                </div>
                <img className={style['banner-01']} src={require('./../../static/img/login/logo.png')} />
                <div className={classNames({[style['banner-item']]:true})}>
                    <img className={style["text1"]} src={require('./../../static/img/login/text.png')} />
                </div>
                <div className={classNames({[style['banner-item']]:true})}>
                    <div className={style['banner-e1']}>
                        <h5>成都太美航空技术有限公司</h5>
                        <h3 className={style['yw']}>Chengdu TaiMei Aviation Technology Co.,Ltd.</h3>
                        <h4>成都太美航空技术有限公司，延承海南太美航空股份有限公司“航空+旅游”核心业务方向，以航空旅游数据服务为切入点，充分利用IT、DT及互联网技术，面向政府、机场、中小航空企业等专业领域客户提供大数据系统研发、大数据分析等产品及服务。</h4>
                        <p className={style['yw']}>Chengdu TaiMei Aviation Technology Co.,Ltd.extends the "Aviation+Tourism"mode,the core business mode of Hainan TaiMei Air Stock Co.,Ltd.,sets the aviation and travel data as the breakthrough points.Supported by IT,DT and Internet technology,it provides local governments,airports,small and medium-size airlines with innovative products and services ranging from big data systems research research to big data analysis.</p>
                        <div className={style["contact-item"]}>
                            <div>
                                <span>HOTLINE</span>
                                <p>028-65733800</p>
                            </div>
                            <div>
                                <span>WEB</span>
                                <p>www.taimei-air.com</p>
                            </div>
                        </div>
                        <img className={style["text2"]} src={require('./../../static/img/login/text2.png')} />
                    </div>
                    <img className={classNames({[style['yuna']]:true})} src={require('./../../static/img/login/yuna.png')} />
                </div>
            </div>
        )
    }
}
