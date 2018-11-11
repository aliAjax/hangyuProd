import React, { Component } from 'react';
import classNames from 'classnames';
import {Switch,Route,HashRouter as Router ,Redirect} from 'react-router-dom'
import emitter from '../../utils/events';
import {store} from "../../store";
import {assemblyAction as an} from "../../utils/assemblyAction";
import {CSSTransition,} from 'react-transition-group';
import DropDown from './dropDown.js';
import navDropDownListJSON from './navDropDownListJSON';
import { Menu, Dropdown } from 'antd';
import AirportSearch from '../../components/search/airportSearch'  // 机场搜索
import CitySearch from '../../components/search/citySearch'  // 城市搜索
import AirlineSearch from '../../components/search/airlineSearch'  // 航司搜索
import style from '../../static/css/nav/nav.scss';
import NavDropDown from '../../components/navDropDown/navDropDown';
import ToView from './toView';
import logo from './../../static/img/logo.png';
import Axios from "../../utils/axiosInterceptors";

export default class Nav extends Component{
    constructor(props){
        super(props);
        this.state = {
            axisWidth: '320px',   // 下拉框-item宽度
            firstChange: true,  // 下拉是否是第一次打开
            update: true,  // 是否更新,true:不更新
            showSearch: false,  // TODO：新版-搜索下拉是否显示
            airportHeight: '105px',  // 机场下拉框高度
            airlineHeight: '105px',  // 航司下拉框高度
            cityHeight: '105px',  // 城市下拉框高度
            roleName:store.getState().role.companyName,
            role:'机场',
            placeholder: '首都国际机场',
            searchType: '机场',
            searchText: '', // 输入框输入的内容
            searchTextBus: '', // 输入框输入的内容
            mes: '', // 保存到redux的搜索数据
            showAirportSearch: false,  // 机场下拉框是否显示
            showAirlineSearch: false,  // 航司下拉框是否显示
            showCitySearch: false,  // 城市下拉框是否显示
            searchBrnShow: false,  // 搜索按钮是否能够点击
            test:false,
            className:{
                'tool':[],
                'role':[],
                'user':[]
            },
            toolType:false,  // 控制工具显示
            roleType:false,  // 控制机场显示
            userType:false,  // 控制用户显示
			noReadCountAboutFinacingApplication:"",//融资状态更改消息数量
        };
    }
    changeClientWidth() {
        let clientWidth = document.documentElement.clientWidth;
        if(clientWidth <= 1366) {
            this.setState({
                axisWidth: '220px',
            })
        }else {
            this.setState({
                axisWidth: '320px',
            })
        }
    }
    componentDidMount(){
        this.changeClientWidth();
        window.addEventListener('resize', this.changeClientWidth.bind(this));
        this.itemClick = emitter.addEventListener('itemClick',(value)=>{
            this.setState({
                role:value,
                roleType:false
            })
        });
        this.closeFloatingLayer = emitter.addEventListener('closeFloatingLayer', (message) => {
            // 监听浮沉关闭
            this.refs.navInput.blur();
            this.setState({
                showAirportSearch: false,
                showAirlineSearch: false,  // 航司下拉框是否显示
                showCitySearch: false,  // 城市下拉框是否显示
                showSearch: false,  // 搜索下拉是否显示
                toolType:false,
                roleType:false,
                userType:false,
            })
        });
		emitter.addEventListener("usePaper",()=>{//下载使用手册
			this.downLoadUse.submit();
			// console.info("下载使用手册");
        });
        emitter.addEventListener("financing",()=>{
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
					if(response.data.opResult==0){
						this.setState({
							noReadCountAboutFinacingApplication:response.data.systemMessage.noReadCountAboutFinacingApplication
						})
					}
				})
        })
    }
    componentWillUnmount() {
        emitter.removeEventListener(this.itemClick);
        emitter.removeEventListener(this.closeFloatingLayer);
        window.removeEventListener('resize', this.changeClientWidth.bind(this));
    }
    componentWillMount(){
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
			    if(response.data.opResult==0){
			        this.setState({
						noReadCountAboutFinacingApplication:response.data.systemMessage.noReadCountAboutFinacingApplication
                    })
                }
            })
    }
    //TODO: 处理下拉点击事件更新class
    handleClick(type,e){
        e.stopPropagation();
        let typeed = !this.state[type];
        this.toolType = false;
        this.roleType = false;
        this.userType = false;
        this.setState({
            toolType:false,
            roleType:false,
            userType:false,
        },function () {
            this.setState(()=>({
                [type]:typeed
            }));
        });
    }
    //输入框输入内容改变
    searchTextChangeFn(e) {
        let target = e.target;
        let _this = this;
        target.value = target.value.replace(/(^\s*)|(\s*$)/g,"");  // 去除空格
        if(target.value == '') {
            _this.setState({
                searchText: target.value,
                searchTextBus: '',
                searchBrnShow: false,
            })
        }else {
            _this.setState({
                searchText: target.value,
            })
        }
        if(this.state.firstChange) {
            this.setState({
                update: false,
            }, ()=>{
                this.setState({
                    firstChange: false,
                })
            });
        }else {
            this.setState({
                update: true,
            }, ()=>{
                setTimeout(()=>{
                    this.setState({
                        update: false,
                    })
                }, 400);
            });
        }
    }
    // 输入框焦点事件
    inputClickFn(e) {
        e.stopPropagation();
        /*if(this.state.searchType == '机场' || this.state.searchType == '时刻') {
            this.state.showAirportSearch = true;
            this.state.showAirlineSearch = false;
            this.state.showCitySearch = false;
        }else if(this.state.searchType == '航司') {
            this.state.showAirportSearch = false;
            this.state.showAirlineSearch = true;
            this.state.showCitySearch = false;
        }else if(this.state.searchType == '城市') {
            this.state.showAirportSearch = false;
            this.state.showAirlineSearch = false;
            this.state.showCitySearch = true;
        }
        this.setState((prev) =>{
            return {
                showAirportSearch: prev.showAirportSearch,
                showAirlineSearch: prev.showAirlineSearch,
                showCitySearch: prev.showCitySearch,
            }
        })*/
        this.setState({
            showSearch: true,
        })
    }
    searchBoxHeight(len) {  // 下拉框高度
        if(len) {
            console.info(1);
            if(len >= 3) {
                return `${35*3}px`;
            }else {
                return `${35*len}px`;
            }
        }else {
            console.info(0);
            return 0;
        }
    }
    arLength(boolean) {
        /*this.setState({
            showDropDown: !boolean,
        })*/
    }
   /* menuClickFn({ key }) {
        let placeholder = '首都国际机场';
        if(key == '机场' || key == '时刻') {
            placeholder = '首都国际机场'
        }else if(key == '城市') {
            placeholder = '北京'
        }else if(key == '航司') {
            placeholder = '中国国际航空'
        }
        this.setState({
            searchType: key,
            searchText: '',
            searchTextBus: '',
            mes: '',
            placeholder: placeholder,
            searchBrnShow: false,
        })
    }*/
    // TODO:接受下拉框传来的数据
    airportData(searchType, data){
        let mes = '';
        if(searchType == '机场') {
            mes = data.code;
        }else if(searchType == '航司') {
            mes = data.code3;
        }else if(searchType == '城市') {
            mes = data.name;
        }else if(searchType == '时刻') {
            mes = data.code;
        }
        this.setState({
            searchType,
            searchText: data.name,
            searchTextBus: data.name,
            showAirportSearch: false,
            showAirlineSearch: false,  // 航司下拉框是否显示
            showCitySearch: false,  // 城市下拉框是否显示
            showSearch: false,
            mes: mes,
            searchBrnShow: true,
        },()=>{
            this.searchBrnClickFn();
        })
    }
    sessionStorageFn(data) {
        store.dispatch(an('SEARCHINFO', data));
        sessionStorage.setItem('search_info', JSON.stringify(data));
    }
    searchBrnClickFn() {
        let data = {};
        if(this.state.searchType == '机场') {
            data.mes = this.state.mes;   // 机场的三字码
            data.type = 'airport';    // 类型：airline、airport、city
            this.sessionStorageFn(data);
            window.location.href = '#/airport';
        }else if(this.state.searchType == '航司') {
            data.mes = this.state.mes;   // 航司的三字码
            data.type = 'airline';    // 类型：airline、airport、city
            this.sessionStorageFn(data);
            window.location.href = '#/airline';
        }else if(this.state.searchType == '城市') {
            data.mes = this.state.mes;   // 城市的名称
            data.type = 'city';    // 类型：airline、airport、city
            this.sessionStorageFn(data);
            window.location.href = '#/city';
        }else if(this.state.searchType == '时刻') {
            data.mes = this.state.mes;   // 机场、航司的三字码
            data.type = 'airport';    // 类型：airline、airport、city
            this.sessionStorageFn(data);
            // window.location.href = '#/city';
            let arr=[];
            arr.push(this.state.mes, this.state.searchTextBus);
            window.location.href = `#/timeDistributionAirport/${arr}`;
        }
    }
    /**
     * 修改图片
     * */
    errPhoneImg(){
        let role = JSON.parse(JSON.stringify(store.getState().role));
        role.headPortrait = require('./../../static/img/145.jpg');
        store.dispatch(an('ROLE',role));
    }
    //弹出融资表单
	financingForm(){
        console.info("hahhah");
    }
    
    render(){
        this.closeFloatingLayer;
        let items;
        if(this.props.data){
            items=this.props.data.map((item,index)=>{
                return <li key={index}><NavDropDown itemMethod={(type,text)=>this.itemMethod(type,text)} item={item}/></li>
            })
        }
        let axis = {  // 下拉搜索样式
            /*position: 'absolute',
            top: '40px',
            left: '0px',*/
            // position: 'absolute',
            // left: '0',
            // overflowY: 'scroll',
            overflowY: 'hidden',
            maxHeight: '105px',
            width: this.state.axisWidth,
            overflowX: 'hidden',
            background: 'white',
            zIndex: 22,
            boxShadow: '0 2px 11px rgba(85,85,85,0.1)'
        };
        let item = {  // 下拉搜索框
            // width: '320px',
            width: this.state.axisWidth,
        };
        let fromData = {
            openFrom:true,
            fromType:store.getState().role.role == '1' ? 0 : 1,
            fromMes: {
                transmit: {
                    bianjiAgain: false,
                }
            }
        };
		let financingData = {
			openFrom:true,
			fromType:6
		};

        /*const menu = (
            <Menu onClick={this.menuClickFn.bind(this)}>
                <Menu.Item key="机场">机场</Menu.Item>
                <Menu.Item key="城市">城市</Menu.Item>
                <Menu.Item key="航司">航司</Menu.Item>
                <Menu.Item key="时刻">时刻</Menu.Item>
            </Menu>
        );*/
        let address="/downloadOperatingInstruction";
        return(
            <div className={`${style['nav-box']} box-show`} id="nav-box">
				<form id="downLoad" ref={(ref) => this.downLoadUse = ref} action={address} method="get" style={{ display: "none" }}>
				</form>
                <div className={style['logo']}>
                    <img src={logo}/>
                </div>
                <div className={style['bar']}>
                    {/*box_1*/}
                    <div className={style['bar-w']}>
                        <div id="air-index" className={classNames({[style['bar-item']]:true,[style['bar-item-1']]:true})}><a href="#/">首页</a></div>
                        <div id="air-po" className={classNames({[style['bar-item']]:true,[style['bar-item-1']]:true})}><a href="#/publicOpinion/null/2">新闻舆情</a></div>
                        <div id="air-tp" className={classNames({[style['bar-item']]:true,[style['bar-item-1']]:true})}>
                            <a onClick={this.handleClick.bind(this,'toolType')}>工具 <i className={'iconfont'}>&#xe605;</i></a>
                            <CSSTransition
                                timeout={500}
                                classNames="dropDown"
                                in={this.state.toolType}
                                unmountOnExit
                            >
                                <DropDown
                                    type="tool"
                                    className={`${style['menu-tool']}`}
                                    data={navDropDownListJSON.tool}>
                                </DropDown>
                            </CSSTransition>
                        </div>
                        <div className={style['bar-item']}>
                            <div className={style['item-search-box']}>
                                <input type="text"
                                       ref={'navInput'}
                                       className={style['role-search-input']}
                                       maxLength="20"
                                       placeholder={this.state.placeholder}
                                       value={this.state.searchText}
                                       onClick={(e)=>{e.stopPropagation()}}
                                       onChange={this.searchTextChangeFn.bind(this)}
                                       onFocus={this.inputClickFn.bind(this)} />
                                {/*{
                                    this.state.showAirportSearch
                                        && <AirportSearch axis={axis}
                                                       item={item}
                                                       resData={this.airportData.bind(this)}
                                                       searchText={this.state.searchText} />
                                }
                                {
                                    this.state.showAirlineSearch
                                    && <AirlineSearch axis={axis}
                                                      item={item}
                                                      resData={this.airportData.bind(this)}
                                                      searchText={this.state.searchText} />
                                }
                                {
                                    this.state.showCitySearch
                                    && <CitySearch axis={axis}
                                                      item={item}
                                                      resData={this.airportData.bind(this)}
                                                      searchText={this.state.searchText} />
                                }*/}
                                {
                                    this.state.showSearch && <div className={style['search-box']} onClick={(e)=>{e.stopPropagation()}}>
                                        <div>
                                            <div className={style['left']}>机场</div>
                                            <div className={style['right']} style={{maxHeight: this.state.airportHeight}}>
                                                <AirportSearch axis={axis}
                                                               item={item}
                                                               update={this.state.update}
                                                               arLength={this.arLength.bind(this)}
                                                               resData={this.airportData.bind(this, '机场')}
                                                               searchText={this.state.searchText} />
                                            </div>
                                        </div>
                                        <div className={style['line']}></div>
                                        <div>
                                            <div className={style['left']}>航司</div>
                                            <div className={style['right']} style={{maxHeight: this.state.airlineHeight}}>
                                                <AirlineSearch axis={axis}
                                                               item={item}
                                                               update={this.state.update}
                                                               resData={this.airportData.bind(this, '航司')}
                                                               searchText={this.state.searchText} />
                                            </div>
                                        </div>
                                        <div className={style['line']}></div>
                                        <div>
                                            <div className={style['left']}>城市</div>
                                            <div className={style['right']} style={{maxHeight: this.state.cityHeight}}>
                                                <CitySearch axis={axis}
                                                            item={item}
                                                            update={this.state.update}
                                                            resData={this.airportData.bind(this, '城市')}
                                                            searchText={this.state.searchText} />
                                            </div>
                                        </div>
                                        <div className={style['line']}></div>
                                        <div>
                                            <div className={style['left']}>时刻</div>
                                            <div className={style['right']} style={{maxHeight: this.state.airportHeight}}>
                                                <AirportSearch axis={axis}
                                                               item={item}
                                                               update={this.state.update}
                                                               arLength={this.arLength.bind(this)}
                                                               resData={this.airportData.bind(this, '时刻')}
                                                               searchText={this.state.searchText} />
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className={style['role-line']}></div>
                                {/*<Dropdown overlay={menu} trigger={['click']}>
                                    <div className={style['drop-down']}>
                                        <div>{this.state.searchType}</div>
                                        <span className={'iconfont'} style={{fontSize: '1.5rem'}}>&#xe605;</span>
                                    </div>
                                </Dropdown>*/}
                                {
                                    this.state.searchBrnShow
                                        ? (<div className={style['role-search-btn']} onClick={this.searchBrnClickFn.bind(this)}>
                                                <i className={'iconfont'}>&#xe62e;</i>
                                            </div>)
                                        : (<div className={style['role-search-btn']}>
                                                <i className={'iconfont'}>&#xe62e;</i>
                                            </div>)
                                }

                            </div>
                        </div>
                    </div>
                    {/*box-3*/}
                    <div>
                        <div className={style['bar-item']}>
                            <div className={style['item-user']}>
                                <div>
                                    <img onError={this.errPhoneImg.bind(this)} src={store.getState().role.headPortrait} alt="头像"/>
                                </div>
                                <div>
                                    <a onClick={this.handleClick.bind(this,'userType')}>{this.state.roleName} <i className={'iconfont'}>&#xe605;</i></a>
                                    <CSSTransition
                                        timeout={500}
                                        classNames="dropDown"
                                        in={this.state.userType}
                                        unmountOnExit
                                    >
                                        <DropDown
                                            className={`${style['menu-tool']}`}
                                            data={navDropDownListJSON.user}>
                                        </DropDown>
                                    </CSSTransition>
                                </div>
                            </div>
                        </div>
                        <ToView></ToView>
                        {
                            store.getState().role.role==1 &&
                                <div className={style['financingBtn']}
                                     onClick={()=>{
                                                    emitter.emit('openFrom',financingData);
                                                    emitter.emit('financing');
                                             }}
                                >
                                    <div className={`iconfont ${style['money']}`}>&#xe74f;</div>
                                    <div style={{display:"flex",alignItems:"center"}}>
										<div className={style['spanTitle']}>航线融资</div>
                                        {this.state.noReadCountAboutFinacingApplication>0?<div className={style['spanNum']}>{this.state.noReadCountAboutFinacingApplication<=99?this.state.noReadCountAboutFinacingApplication:'99+'}</div>:""}
                                    </div>
                                </div>
                        }
                        <div className={style['bar-item']} onClick={()=>{emitter.emit('openFrom',fromData)}}>
                            <div className={style['item-publish']}>
                                <i className={'iconfont'}>&#xe606;</i>
                                发布
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}