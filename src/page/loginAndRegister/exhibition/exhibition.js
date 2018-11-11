
import React, { Component } from 'react';
import classNames from 'classnames';
import {CSSTransition} from 'react-transition-group';
import style from "./../../static/css/loginAndRegister/banner.scss"


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
        if(index === 4){
            if(attribute){
                index = 0;
            }else{
                index --;
            }
        }else if(index === 0){
            if(attribute){
                index ++;
            }else{
                index = 4;
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
                <div className={style['banner-001']}>
                    <span>版本公告</span>
                    <p>版本号：V2.1.13.06.11_beta</p>
                </div>
                <div className={style['banner-002']}>©2017  航遇  成都太美航空技术有限公司</div>
                <img className={style['banner-01']} src={require('./../../static/img/login/logo.png')} />
                <div id={'control'} className={style['control']}>
                    <a onClick={this.changeI.bind(this,0)}><div className={classNames({[style['control-set']]:this.state.pageIndex === 0})}></div></a>
                    <a onClick={this.changeI.bind(this,1)}><div className={classNames({[style['control-set']]:this.state.pageIndex === 1})}></div></a>
                    <a onClick={this.changeI.bind(this,2)}><div className={classNames({[style['control-set']]:this.state.pageIndex === 2})}></div></a>
                    <a onClick={this.changeI.bind(this,3)}><div className={classNames({[style['control-set']]:this.state.pageIndex === 3})}></div></a>
                    <a onClick={this.changeI.bind(this,4)}><div className={classNames({[style['control-set']]:this.state.pageIndex === 4})}></div></a>
                </div>
                <div id={'control1'} className={style['control1']}>
                    <a onClick={this.changeI.bind(this,0)} className={classNames({[style['control1-set']]:(this.state.pageIndex >= 0 && this.state.pageIndex <= 1)})}>
                        <div>01 |   产品介绍</div>
                    </a>
                    <a onClick={this.changeI.bind(this,3)} className={classNames({[style['control1-set']]:(this.state.pageIndex > 1 && this.state.pageIndex <= 3)})}>
                        <div>02 |   优势</div>
                    </a>
                    <a onClick={this.changeI.bind(this,4)} className={classNames({[style['control1-set']]:(this.state.pageIndex === 4)})}>
                        <div>03 |   联系我们</div>
                    </a>
                </div>
                <CSSTransition
                    in={this.state.pageIndex === 0}
                    timeout={500}
                    classNames="banner-i1"
                    unmountOnExit
                >
                    <div id={'anchor1'} ref={'anchor1'} className={classNames({[style['banner-item']]:true})}>
                        <div className={style['banner-a1']}>
                            <img className={classNames({[style['banner-a2']]:true,'earth-scale':true})} src={require('./../../static/img/login/banner1/earth.png')} />
                            <img className={classNames({[style['banner-a2-kd']]:true})} src={require('./../../static/img/login/banner1/333.png')} />
                            <img className={classNames({[style['banner-a2-444']]:true,'scatter-rotate':true})} src={require('./../../static/img/login/banner1/444.png')} />
                            <img className={classNames({[style['banner-a2-222']]:true,'scatter-line-rotate':true})} src={require('./../../static/img/login/banner1/222.png')} />
                            <img className={classNames({[style['banner-a2-yun']]:true,'yun-scale':true})} src={require('./../../static/img/login/banner1/yun.png')} />
                            <CSSTransition
                            in={this.state.img1}
                            classNames="banner-a4"
                            timeout={1000}
                            unmountOnExit
                            >
                                <img className={style['banner-a3']} src={require('./../../static/img/login/diyishang.png')} />
                            </CSSTransition>
                            <CSSTransition
                                in={this.state.img2}
                                classNames="banner-a4"
                                timeout={1000}
                                unmountOnExit
                            >
                                <img className={style['banner-a4']} src={require('./../../static/img/login/diyixia.png')} />
                            </CSSTransition>
                        </div>
                    </div>
                </CSSTransition>
                <div id={'anchor2'} className={classNames({[style['banner-item']]:true})}>
                    <CSSTransition
                        timeout={500}
                        classNames="banner-i2"
                        in={this.state.pageIndex === 1}
                        unmountOnExit
                    >
                        <img className={classNames({[style['banner-i2']]:true})} src={require('./../../static/img/login/diqiu.png')} />
                    </CSSTransition>
                    <CSSTransition
                        timeout={500}
                        classNames="banner-c11"
                        in={this.state.pageIndex === 1}
                        unmountOnExit
                    >
                        <div className={style['banner-c11']}>
                            <div className={style['banner-c01']}></div>
                            <div className={style['banner-c02']}></div>
                            <div className={style['banner-c03']}></div>
                            <div className={style['banner-c1']}>
                                <div>
                                    <h2>航线交易</h2>
                                    <h3>运力供应平台</h3>
                                    <p className={style['yw']}>route trading and capacity supply platform</p>
                                </div>
                                <div>
                                    <span>一目十航</span>
                                    <h5>为机场提供航线</h5>
                                    <p className={style['yw']}>capacity for the airport</p>
                                </div>
                                <div>
                                    <span>一呼百应</span>
                                    <h5>为机场提供运力</h5>
                                    <p className={style['yw']}>capacity for the airport</p>
                                </div>
                            </div>
                            <div className={style['banner-c2']}>
                                <div>
                                    <h2>航线数据</h2>
                                    <h3>分析平台</h3>
                                    <p className={style['yw']}>route data analysis platform</p>
                                </div>
                                <div>
                                    <span>有的放矢</span>
                                    <h5>开航测算</h5>
                                    <p className={style['yw']}>Sailing estimates</p>
                                </div>
                                <div>
                                    <span>选择更多</span>
                                    <h5>机场对比</h5>
                                    <p className={style['yw']}>Airport comparison</p>
                                </div>
                                <div>
                                    <span>方便快捷</span>
                                    <h5>信息查询</h5>
                                    <p className={style['yw']}>Information inquiry</p>
                                </div>
                                <div>
                                    <span>掌握更多</span>
                                    <h5>时刻查看</h5>
                                    <p className={style['yw']}>Time inquiry</p>
                                </div>
                            </div>
                            <div className={style['banner-c3']}>
                                <div>
                                    <h2>航线和运力业务</h2>
                                    <h3>托管平台</h3>
                                    <p className={style['yw']}>route data analysis platform</p>
                                </div>
                                <div>
                                    <span>开航无忧</span>
                                    <h5>专业的航线运营团队帮助运营航线</h5>
                                    <p className={style['yw']}>route operations team to help run the route</p>
                                </div>
                                <div>
                                    <span>投放无忧</span>
                                    <h5>优秀的市场团队帮助找到合适的航点</h5>
                                    <p className={style['yw']}>marketing ream to help find the right waypoint</p>
                                </div>
                            </div>
                        </div>
                    </CSSTransition>
                </div>
                <div id={'anchor3'} className={classNames({[style['banner-item']]:true})}>
                    <CSSTransition
                        timeout={500}
                        classNames="banner-i3"
                        in={this.state.pageIndex === 2}
                        unmountOnExit
                    >
                        <img className={classNames({[style['banner-i3']]:true})} src={require('./../../static/img/login/diqiu.png')} />
                    </CSSTransition>
                    <CSSTransition
                        timeout={500}
                        classNames="banner-b1"
                        in={this.state.pageIndex === 2}
                        unmountOnExit
                    >
                        <div className={style['banner-b1']}>
                            <div >

                                <img className={style['banner-b01']} src={require('./../../static/img/login/shuzi1.png')} />
                                <h3>本场航线查看</h3>
                                <h5>辅助决策</h5>
                                <p className={style['yw']}>The airport route view to help support decision-making</p>
                            </div>
                            <div>

                                <img className={style['banner-b02']} src={require('./../../static/img/login/shuzi2.png')} />
                                <h3>航司航线网络查看</h3>
                                <h5>辅助决策</h5>
                                <p className={style['yw']}>Airline Route Network View Help Assisted Decision Making</p>
                            </div>
                            <div>

                                <img className={style['banner-b03']} src={require('./../../static/img/login/shuzi3.png')} />
                                <h3>运力供应、航线供应</h3>
                                <h4>国内唯一一家</h4>
                                <h5>航线和运力供应综合服务平台</h5>
                                <p className={style['yw']}>The only domestic route and capacity supply integrated service platform</p>
                            </div>

                            <div>

                                <img className={style['banner-b07']} src={require('./../../static/img/login/shuzi4.png')} />
                                <h3>开航辅助工具</h3>
                                <h5>让市场不在难开拓</h5>
                                <p className={style['yw']}>Sailing aids,the market is no longer difficult to open up</p>
                            </div>

                        </div>
                    </CSSTransition>
                    <CSSTransition
                        timeout={500}
                        classNames="banner-b04"
                        in={this.state.pageIndex === 2}
                        unmountOnExit
                    >
                        <img className={classNames({[style['banner-b04']]:true})} src={require('./../../static/img/login/yangji1.png')} />
                    </CSSTransition>
                    <CSSTransition
                        timeout={500}
                        classNames="banner-b05"
                        in={this.state.pageIndex === 2}
                        unmountOnExit
                    >
                        <img className={classNames({[style['banner-b05']]:true})} src={require('./../../static/img/login/yangji3.png')} />
                    </CSSTransition>
                    <CSSTransition
                        timeout={500}
                        classNames="banner-b06"
                        in={this.state.pageIndex === 2}
                        unmountOnExit
                    >
                        <img className={classNames({[style['banner-b06']]:true})} src={require('./../../static/img/login/yangji02.png')} />
                    </CSSTransition>
                </div>
                <div id={'anchor4'} className={classNames({[style['banner-item']]:true})}>
                    <CSSTransition
                        timeout={500}
                        classNames="banner-i4"
                        in={this.state.pageIndex === 3}
                        unmountOnExit
                    >
                        <img className={classNames({[style['banner-i4']]:true})} src={require('./../../static/img/login/diqiu.png')} />
                    </CSSTransition>
                    <CSSTransition
                        timeout={500}
                        classNames="banner-d11"
                        in={this.state.pageIndex === 3}
                        unmountOnExit
                    >
                        <div className={style['banner-d11']}>
                            <div className={style['banner-d1']}>
                                <span>闲置运力难以消化?</span>
                                <span>信息不对称，影响全面决策?</span>
                                <span>资金回收慢，运营风险高?</span>
                                <p className={style['yw']}>route opened</p>
                                <p className={style['yw']}>not just contacts</p>
                            </div>
                            <div className={style['banner-d2']}>
                                <span>解决运营烦恼</span>
                                <img src={require('./../../static/img/login/tupian1.png')} />
                                <h3>托管服务</h3>
                                <h5>一键托管，无忧运营</h5>
                                <p className={style['yw']}>Route hosting services,one-click hosting so you do nont worry-free operation</p>
                            </div>
                            <div className={style['banner-d3']}>
                                <span>解决资金困扰</span>
                                <img src={require('./../../static/img/login/tupian2.png')} />
                                <h3>垫资服务</h3>
                                <h5>开航更简单</h5>
                                <p className={style['yw']}>Advance service for your route,sailing easier</p>
                            </div>
                            <div className={style['banner-d4']}>

                                <div>
                                    <span>高效科学</span>
                                    <h3>标准化方案提交</h3>
                                    <h5>告别无效沟通</h5>
                                    <p className={style['yw']}>Standardization program submitted,bid farewell to  invalid communication</p>
                                </div>
                                <div>
                                    <span>直接对接</span>
                                    <h3>在线洽谈</h3>
                                    <h5>无缝对接市场人员</h5>
                                    <p className={style['yw']}>Online negotiations,seamless docking market staff</p>
                                </div>
                                <div>
                                    <span>定制服务</span>
                                    <h3>专属顾问服务</h3>
                                    <h5>协助航线协议推进</h5>
                                    <p className={style['yw']}>Exclusive advisory services to help assist the airline agreement</p>
                                </div>
                                <div>&#xe673;</div>
                                <div>&#xe633;</div>
                                <div>&#xe635;</div>
                            </div>
                        </div>
                    </CSSTransition>
                </div>
                <div id={'anchor5'} className={classNames({[style['banner-item']]:true})}>
                    <CSSTransition
                        timeout={1000}
                        classNames="banner-i5"
                        in={this.state.pageIndex === 4}
                        unmountOnExit
                    >
                        <img className={classNames({[style['banner-i5']]:true})} src={require('./../../static/img/login/diqiu.png')} />
                    </CSSTransition>

                    <CSSTransition
                        timeout={500}
                        classNames="banner-e11"
                        in={this.state.pageIndex === 4}
                        unmountOnExit
                    >
                        <div className={style['banner-e11']}>
                            <div className={style['banner-e1']}>
                                <h5>成都太美航空技术有限公司</h5>
                                <h3 className={style['yw']}>Chengdu TaiMei Aviation Technology Co.,Ltd.</h3>
                                <h4>成都太美航空技术有限公司，延承海南太美航空股份有限公司“航空+旅游”核心业务方向，以航空旅游数据服务为切入点，充分利用IT、DT及互联网技术，面向政府、机场、中小航空企业等专业领域客户提供大数据系统研发、大数据分析等产品及服务。</h4>
                                <p className={style['yw']}>Chengdu TaiMei Aviation Technology Co.,Ltd.extends the "Aviation+Tourism"mode,the core business mode of Hainan TaiMei Air Stock Co.,Ltd.,sets the aviation and travel data as the breakthrough points.Supported by IT,DT and Internet technology,it provides local governments,airports,small and medium-size airlines with innovative products and services ranging from big data systems research research to big data analysis.</p>
                            </div>
                            <div className={style['banner-item-phone']}>
                                <div>
                                    <h6>HOTLINE</h6>
                                    <span>028-65733800</span>
                                </div>
                                <div>
                                    <h6>WEB</h6>
                                    <span>www.taimei-air.com</span>
                                </div>
                            </div>
                        </div>
                    </CSSTransition>
                </div>
            </div>
        )
    }
}
