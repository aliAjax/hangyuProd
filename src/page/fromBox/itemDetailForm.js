import React, { Component } from 'react';
import Axios from "./../../utils/axiosInterceptors";
import emitter from "../../utils/events";
import { store } from './../../store/index';
import { Tabs, Modal, Spin } from 'antd';
import moment from 'moment';
import classNames from 'classnames';

import { inherits } from 'util';
import style from './../../static/css/from/itemDetailForm.scss';

import HeaderInfo from './headerInfo.js';
import Plan from './plan.js';
import Received from './received.js';
import PlanInfo from './planInfo.js';
import PayEarnestMoney from '../../components/payEarnestMoney/payEarnestMoney'
import CompanyRecharge from '../userCenter/companyAccount/companyRecharge';
import Confirmations from './../../components/confirmations/confirmations';
import Contract from './../../components/Contract/contract';

const dateFormat = 'YYYY-MM-DD';
const TabPane = Tabs.TabPane;

export default class ItemDetailForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			willmount: true,//是否是第一次加载组件
			showCompanyRecharge: false,  // 充值账户是否显示
			role: store.getState().role.role,//用户类型
			id: '',//需求id
			employeeId: '',//发布需求方id
			releasetime: '',//发布时间
			demandtype: '',//需求种类共5种（0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托）除去0和1两种状态, 其他状态不再地图上呈现，仅在太美角色个人中心的委托列表中呈现。
			demandtypeStr: '',
			recivedResponseCount: '',//收到的方案数
			browsingVolume: '',//浏览量
			title: '',//标题
			collectId: 0,//收藏用户id
			collectType: 0, //是否收藏：0-未收藏，其他-已收藏
			demandprogress: '',//需求进度状态[:-1·待支付；0:需求发布、,1:意向征集、2:订单确认、3:关闭（审核不通过、下架、过期）、4:订单完成、5:佣金支付、6:交易完成、7:待处理、8:已接受、9:处理中（测评中）、10:已拒绝、11:草稿]
			demandprogressStr: '',
			responseProgress: '',
			demandstate: '', //需求状态(0: 正常,1: 完成,2: 异常,3: 删除,4: 未处理,5: 审核不通过,6, 审核通过)
			demandStateStr: '',
			identifier: '--',//编号

			isResponseDemand: '',//当前用户是否响应
			isWithdrawResponse: '',
			releaseDemandAirport: '',
			targetPoint: '',

			demandPlans: [],
			planList: [],

			dptTime: '',
			arrvTime: '',
			days: '',
			bottomSubsidyPrice: '',
			fixedSubsidyPrice: '',
			subsidypolicy: '',
			subsidypolicyStr: '',

			airCompany: '',
			aircrfttyp: '',
			seating: '',
			airlineType: '',
			airlineTypeStr: '',
			sailingtime: '',
			performShift: '',
			periodValidity: '',
			timeRequirements: '',
			timeRequirementsStr: '',
			fltNbr: '',
			remark: '',
			closeReason: '',
			contact: '', iHome: '',
			cpyNm: '', //“成都双流国际机场”，发布机场名称

			fltNbr: '',
			intentionMoneyState: '',
			internationalAirline: '',
			plans: '',

			// days: "",//班期
			// periodValidity: "",//需求有效期
			// sailingtime: '',  // 计划执行周期

			//处理后的数据,将会向下传递
			isMarket: true,//市场或者我的,true:市场;false:我的;由本页面自己判断
			processedDemandPlans: [],//需求详情-方案
			processedPlanInfo: [],//需求详情-详细信息
			processedPlanList: [],//收到的方案
			payload: null,//修改运力有效期所需数据
			processedContact: [],//联系人
			transmit: null,

			outofId: '',//下架id

			// 其他操作状态
			defaultActiveKey: '2',//默认显示面板(默认需求详情)
			receivedDefaultKey: '',
			itemDetailFormLoading: true,//需求详情加载数据遮层,true:开启,false:关闭
			loading: false,//其他用户操作loading动画
			showPayEarnestMoney: false,  // 支付意向金是否显示
			payData: {},  // 向支付意向金组件传递的数据
			demandId: '',  // 方案id
			visible_entrust: false,//委托框隐藏
			visible_contract: false,//账单隐藏
		};
	}
	componentWillMount() {  // 将要渲染
		this.init(this.props)
	}
	componentWillReceiveProps(nextProps) {  // Props发生改变
		this.init(nextProps)
	}
	componentDidMount() {
		let main = this.refs.main;
		let child = main.childNodes;
		let title = child[0];
		let body = child[1];
		let progressBar = child[2];
		let footer = child[3];
		body.style.height = main.offsetHeight - title.offsetHeight - progressBar.offsetHeight - (footer ? footer.offsetHeight : 0);
		this.renewItemDetailForm1 = emitter.addEventListener('renewItemDetailForm1', () => {
			this.updateData();
		});
	}
	componentWillUnmount() {
		emitter.removeEventListener(this.renewItemDetailForm1);
	}
	// 获取数据
	init = (props) => {
		let param = props.fromMes;
		if (param && param.transmit.id) {
			this.setState({
				itemDetailFormLoading: true,
				id: param.transmit.id,
			}, () => {
				this.updateData();
			})
		} else {
			console.log('未获取到数据')
		}
	}
	// 更新数据
	updateData() {
		emitter.emit("addLines", { v: null, t: false });
		Axios({
			url: 'getDemandDetailInfo',
			method: 'get',
			params: {
				demandId: this.state.id,
			},
		}).then((response) => {
			if (response.data.opResult === "0") {
				let data = response.data.obj;
				if (data.employeeId !== store.getState().role.id && data.demandprogress == '12') {//查看市场需求,并且需求状态为审核中时关闭层,当跳过列表中的验证时到达此步
					emitter.emit('openFrom', {
						openFrom: false,
					});
				}
				this.setState(() => {
					// let defaultActiveKey = 
					return {
						...data,//将获得数据结构到state中
						isMarket: data.employeeId !== store.getState().role.id,//是否是市场,true:市场,false:自己发布的
						defaultActiveKey: data.demandtype == '0' || data.demandtype == '1' ? (this.state.defaultActiveKey || '2') : '2',//设置默认key
						receivedDefaultKey: this.state.receivedDefaultKey || '',//设置方案列表默认展开
						itemDetailFormLoading: false,//详情加载动画
						visible_entrust: false,//隐藏委托框
						visible_contract: false,//账单隐藏
						showCompanyRecharge: false,//关闭充值
						loading: false,//其他用户操作loading动画
					}
				}, () => {
					// 处理数据
					this.processStateData();
				})
			}

		})
	}
	updateDetail = () => {
		this.updateData();
	}
	// 数据处理
	processStateData = () => {
		let processedDemandPlans = [], //航司/机场方案
			processedPlanInfo = [], //航司/机场方案详细
			processedPlanList = [], //航司/机场 收到的方案列表
			payload = {}, //修改运力有效期数据(仅可修改自己发布的)
			processedContact = [];//发布需求的航司/机场联系人和联系电话
		let {
			role,
			isMarket,
			id,
			demandPlans,
			planList,
			subsidypolicy,
			bottomSubsidyPrice,
			fixedSubsidyPrice,
			dptTime,
			arrvTime,
			days,
			aircrfttyp,
			seating,
			airlineType,
			sailingtime,
			performShift,
			periodValidity,
			remark,
			timeRequirements,
			fltNbr,

			contact,
			iHome,

			isWithdrawResponse,
			isResponseDemand,
			demandprogress,
			demandtype,
			releaseDemandAirport,
			employeeId,

		} = this.state;

		let airlineTypeStr = this.getAirlineType(airlineType);
		let timeRequirementsStr = this.getTimeRequirements(timeRequirements);

		//判断是否可以编辑运力有效期
		let editPeriodValidity = (demandtype === '0' || demandtype === '1') && (demandprogress === '-1' || demandprogress === '0' || demandprogress === '1' || demandprogress === '2' || demandprogress === '11') ? true : false;

		// 收到的方案列表
		if (planList && planList.length) {
			processedPlanList = planList.map((plan) => {
				return {
					...plan,
					employeeId,
					demandprogress
				}
			})
		}
		// 组装联系方式
		processedContact = (isResponseDemand === 0 && isWithdrawResponse === 1) || (isResponseDemand === 1) || isMarket == false ? [
			{ name: '联系人', value: contact },
			{ name: '联系电话', value: iHome },
		] : [];

		//默认显示
		// let defaultActiveKey = '2';
		// if (planList && planList.length) {
		// 	for (let i = 0; i < planList.length; i++) {
		// 		let value = planList[i];
		// 		if (isMarket) {//市场 意向
		// 			if (value.isCurrentUserResponsePlan === '1') {
		// 				defaultActiveKey = '1';
		// 				break;
		// 			} else {
		// 				continue
		// 			}
		// 		} else {//我的 发布
		// 			defaultActiveKey = '1';
		// 			break;
		// 		}
		// 	}
		// }
		// let defaultActiveKey = this.state.defaultActiveKey || '2';
		// if (willmount) {
		// 	isResponseDemand == 1 ? defaultActiveKey = '1' : defaultActiveKey = '2';
		// }

		// 需求详情
		if (role === '1' && isMarket) {//**机场-市场
			// 机场-市场-需求详情-方案
			if (demandPlans) {
				processedDemandPlans = demandPlans.map((value) => {
					return {
						...value,
						subsidypolicy,//其他
						bottomSubsidyPrice,//保底价格
						fixedSubsidyPrice,//定补价格
						dptTime,//始发时段
						arrvTime,//达到时段
						days,//班期
					}
				})
			}

			// 机场-市场-运力详情-方案详细
			let dptNm = demandPlans ? demandPlans[0].dptNm : '';

			processedPlanInfo = [
				{ name: '机型', value: aircrfttyp },
				{ name: '座位布局', value: seating },
				{ name: '运力始发', value: dptNm },//特殊
				{ name: '航司类型', value: airlineTypeStr },
				{ name: '计划执行周期', value: sailingtime },
				{ name: '计划执行班次', value: performShift },
				{ name: '运力有效期', value: periodValidity },
				{ name: '其他说明', value: remark || '无' },
			]


		} else if (role === '1' && !isMarket) {//**机场-我的
			// 机场-我的-需求详情-方案列表
			processedDemandPlans = demandPlans;

			// 机场-我的-需求详情-详细信息
			processedPlanInfo = [
				{ name: '航司要求', value: airlineTypeStr },//航司要求
				{ name: '机型', value: aircrfttyp },//机型
				{ name: '时刻要求', value: timeRequirementsStr },//时刻要求
				{ name: '班期', value: days },//班期,
				{ name: '计划执行周期', value: sailingtime },//计划执行周期
				{ name: '计划执行班次', value: performShift },//执行班次
				{ name: '需求有效期', value: periodValidity, edit: editPeriodValidity },//需求有效期
				{ name: '其他说明', value: remark || '无' }//其他说明
			];
			if (demandtype === '2') {
				processedPlanInfo = [
					{ name: '航班号', value: fltNbr },//航班号
					{ name: '其他说明', value: remark || '无' }//其他说明
				]
			}

			//修改运力有效期
			payload = {
				id, isMarket, sailingtime, periodValidity,
			}

		} else if (role === '0' && isMarket) {//**航司-市场
			// 航司-市场-需求详情-方案列表
			if (demandPlans) {
				processedDemandPlans = demandPlans.map((value, index) => {
					return {
						...value,
						releaseDemandAirport,
					}
				})
			}

			// 航司-市场-需求详情-详细信息
			processedPlanInfo = [
				{ name: '航司要求', value: airlineTypeStr },//航司要求
				{ name: '机型', value: aircrfttyp },//机型
				{ name: '时刻要求', value: timeRequirementsStr },//时刻要求
				{ name: '班期', value: days },//班期,
				{ name: '计划执行周期', value: sailingtime },//计划执行周期
				{ name: '计划执行班次', value: performShift },//执行班次
				{ name: '需求有效期', value: periodValidity },//需求有效期
				{ name: '其他说明', value: remark || '无' }//其他说明
			];

		} else if (role === '0' && !isMarket) {//**航司-我的
			//航司-我的-需求详情-时刻方案
			if (demandPlans) {
				processedDemandPlans = demandPlans.map((value) => {
					return {
						...value,
						subsidypolicy,//其他
						bottomSubsidyPrice,//保底价格
						fixedSubsidyPrice,//定补价格
						dptTime,//始发时段
						arrvTime,//达到时段
						days,//班期
					}
				})
			}

			// 航司-我的-运力详情-方案详细
			let dptNm = demandPlans ? demandPlans[0].dptNm : '';

			processedPlanInfo = [
				{ name: '机型', value: aircrfttyp },
				{ name: '座位布局', value: seating },
				{ name: '运力始发', value: dptNm },
				{ name: '航司类型', value: airlineTypeStr },
				{ name: '计划执行周期', value: sailingtime },
				{ name: '计划执行班次', value: performShift },
				{ name: '运力有效期', value: periodValidity, edit: editPeriodValidity },
				{ name: '其他说明', value: remark || '无' },
			];

			//修改运力有效期
			payload = {
				id, isMarket, sailingtime, periodValidity,
			}

		}
		// 设置处理好的数据
		this.setState(() => {
			return {
				processedDemandPlans, processedPlanInfo, payload, processedPlanList, processedContact
			}
		})

	}

	//三字码获取城市名
	getCityName = (code) => {
		let cityList = store.getState().cityList;
		let city = cityList.filter((value) => {
			return value.cityIcao == code
		})
		return city[0].cityName;
	}
	//获取服务类型
	getAirlineType = (airlineType) => {
		let str;
		switch (Number(airlineType)) {
			case 0:
				str = '全服务航空';
				break;
			case 1:
				str = '低成本航空';
				break;
			case 2:
				str = '都接受';
				break;
			default:
				str = '--'
				break;
		}
		return str;
	}
	//获取时刻要求
	getTimeRequirements = (timeRequirements) => {
		let str;
		switch (Number(timeRequirements)) {
			case 0:
				str = '白班';
				break;
			case 1:
				str = '晚班';
				break;
			case 2:
				str = '都接受';
				break;
			default:
				str = '--'
				break;
		}
		return str;
	}
	//寻找对应状态
	getDemandprogressStr = () => {
		let demandprogressStr = '';
		switch (Number(this.state.demandprogress)) {
			case -1: demandprogressStr = '待支付'; break;
			case 0: demandprogressStr = '需求发布'; break;
			case 1: demandprogressStr = '意向征集'; break;
			case 2: demandprogressStr = '订单确认'; break;
			case 3: demandprogressStr = '关闭'; break;
			case 4: demandprogressStr = '订单完成'; break;
			case 5: demandprogressStr = '佣金支付'; break;
			case 6: demandprogressStr = '交易完成'; break;
			case 7: demandprogressStr = '待处理'; break;
			case 8: demandprogressStr = '已接受'; break;
			case 9: demandprogressStr = '处理中'; break;
			case 10: demandprogressStr = '已拒绝'; break;
			case 11: demandprogressStr = '草稿'; break;
			case 12: demandprogressStr = '审核中'; break;
			default:
				demandprogressStr = '--';
		}
		return demandprogressStr;
	}
	//获取机场缩写:例:
	findName = (dpt, pst, arrv) => {
		let cityList = store.getState().cityList;
		let arr = {};
		let city = cityList.filter((value) => {
			if (value.cityIcao == dpt) {
				arr.dptNm = value.cityName;
			} else if (value.cityIcao == pst) {
				arr.pstNm = value.cityName;
			} else if (value.cityIcao == arrv) {
				arr.arrvNm = value.cityName;
			}
		})
		return arr;
	}
	// 设置方案列表中的激活key,当在方案列表中展开进行操作时,需记录当前key,避免操作时,方案面板收回
	upPanelKey = (key) => {
		this.setState({
			receivedDefaultKey: key
		})
	}
	// 响应 弹出层
	respond(transmit) {
		let popupType = 0;
		if (this.state.isMarket) {
			if (this.state.role === '1') {
				popupType = 2;
			} else {
				popupType = 1;
			}
		}
		emitter.emit('openPopup', {
			popupType: popupType,
			popupMes: {
				transmit,
			}
		})
	}
	payAndPush() {  // 支付意向金并发布
		let sailingtime = this.state.sailingtime;
		let periodValidity = this.state.periodValidity;
		if (sailingtime && periodValidity) {
			let s = moment(sailingtime.split(',')[0]);  // 计划执行周期的初始时间
			let p = moment(periodValidity);   // 需求有效期
			let n = moment();  // 当前时间
			if (!n.isAfter(s)) {
				if (!p.isSame(n.format(dateFormat)) && (p.isBefore(n.format(dateFormat)) || p.isAfter(s.format(dateFormat)))) {
					Modal.error({
						title: '请输入正确的需求有效期！',
					});
				} else {
					Axios({
						method: 'post',
						url: '/selectSingleReleaseRoutefreezMargin',
						dataType: 'json',
						headers: {
							'Content-type': 'application/json;charset=utf-8'
						}
					}).then((response) => {
						if (response.data.opResult === '0') {
							let payData = {};
							payData.title = this.state.title;
							payData.demandId = this.state.id;
							payData.intentionMoney = response.data.singleReleaseRoutefreezMargin;
							this.setState({
								showPayEarnestMoney: true,
								payData: payData,
							})
						} else {
							Modal.error({
								title: response.data.msg,
							});
						}
					})
				}
			} else {
				Modal.error({
					title: '计划执行周期有误，请重新编辑后发布',
				});
			}
		} else {
			if (!periodValidity) {
				Modal.error({
					title: '请选择需求有效期',
				});
			} else if (!sailingtime) {
				Modal.error({
					title: '计划执行周期有误，请重新编辑后发布',
				});
			}
		}
	}
	closeMoneyFn() {  // 关闭意向金组件
		this.setState({
			showPayEarnestMoney: false,
		})
	}
	reEdit(item) {
		if (item.demandId) {
			let obj = {};
			let transmit = {};
			transmit.demandId = item.demandId;
			transmit.bianjiAgain = true;
			obj.openFrom = true;
			obj.fromType = 0;
			obj.fromMes = {
				transmit: transmit,
			};
			emitter.emit('openFrom', obj);
		} else {
			Modal.error({
				title: '出错了！',
			});
		}
	}
	// tab1 内容文本 根据tabType来判断显示 
	getTabFirstName = () => {
		return this.state.isMarket ? '他' : '';
	}
	// tab2 内容文本 根据role来判断显示
	getTabSecondName = () => {
		let bool = this.state.isMarket;
		if (this.state.role === '1') {
			return bool ? '运力' : '需求';
		} else {
			return bool ? '需求' : '运力';
		}
	}
	// 切换收藏图标
	getCollectIcon = () => {
		// return '';
		return {
			__html: this.state.collectType == 0 ? '&#xe634;' : '&#xe637;'
		}
	}
	// 收藏
	collecting = (id) => {
		let _this = this;
		if (Number(this.state.collectType) === 1) {//已收藏过 ->取消收藏
			Axios({
				url: 'delCollect',
				method: 'post',
				params: {
					collectId: _this.state.collectId,//收藏id
				}
			}).then((response) => {
				if (response.data.opResult === '0') {
					_this.setState({
						collectType: !_this.state.collectType
					});
					Modal.success({
						title: '取消收藏成功',
					});
				} else {
					Modal.info({
						title: '数据已变化,请刷新',
						okText: '刷新',
						onOk: () => {
							this.updateData()
						}
					});
				}
			})
		} else if (Number(this.state.collectType) === 0) {//为收藏过 ->添加收藏
			Axios({
				url: 'addCollect',
				method: 'post',
				params: {
					demandIds: id//需求id
				}
			}).then((response) => {
				if (response.data.opResult === '0') {
					_this.setState({
						collectId: response.data.list[0].val,
						collectType: !_this.state.collectType
					});
					Modal.success({
						title: '收藏成功',
					});
				} else {
					Modal.info({
						title: '数据已变化,请刷新',
						okText: '刷新',
						onOk: () => {
							this.updateData()
						}
					});
				}
			})
		}
	}

	//点击确定
	handleOk = () => {
		this.setState({ loading: true });
		Axios({
			url: 'closeDemandById',
			method: 'post',
			params: {
				id: this.state.outofId,
				closeReason: '运力调整'
			}
		}).then((response) => {
			this.setState({ loading: false, visible: false });
			if (response.data.opResult === '0') {
				Modal.success({
					title: '需求下架成功',
				});
			} else {
				Modal.error({
					title: response.data.msg,
				});
			}
		})
	}

	demandBackOn = () => {
		let { id, role } = this.state;
		let formType = role === '1' ? 0 : 1;
		emitter.emit('openFrom', {
			openFrom: true,
			fromType: formType,
			fromMes: {
				transmit: {
					demandId: id,
					chongxinshangjia: true,
				}
			},
		})
	}
	// 需求下架处理事件
	outof = (transmit) => {
		emitter.emit('openPopup', {
			popupType: 4,
			popupMes: {
				transmit,
			}
		})
		// this.setState({
		// 	visible: true,
		// 	outofId: id,
		// });
	}
	// onClick = { this.handleSchemeBtnClick.bind(this, transmit) }
	handleSchemeBtnClick(transmit) {
		let popupType = 0;
		if (store.getState().role.role === '1') {//机场
			popupType = 1;
		} else {
			popupType = 2
		}
		transmit.bianjiOrNot = true;  // 是否是点击“重新编辑”true：重新编辑，false：我要洽谈
		emitter.emit('openPopup', {
			popupType: popupType,
			popupMes: {
				transmit,
			}
		})
	}

	// 当需求为订单完成状态 点击'订单完成'跳转至账单,并显示合同
	toBill = () => {
		// window.location.href = `#/userCenter/demandId=${this.state.id}`;
		this.setState({
			visible_contract: true
		})

	}
	closeContract = () => {
		this.setState({
			visible_contract: false
		})
	}

	// 洽谈窗口
	chatPanel(fromNameId, toNameId, responsePlanId, event) {
		// console.log('当前用户id:' + fromNameId, '对方用户id:' + toNameId, '方案id' + responsePlanId);
		emitter.emit('openChat', {
			fromNameId, toNameId, responsePlanId
		});
		// e.preventDefault();
	}
	// 头部标题 及其按钮
	titleFun = () => {
		let { isMarket, id, title, collectId, demandprogress, responseProgress, isResponseDemand, identifier, demandtype, processedPlanList } = this.state;
		let role = store.getState().role.role;
		let btn = '', demandBackOn = '';
		let transmit = {
			id, title, identifier
		}
		if (isMarket == false) {
			if (demandprogress === "3" || demandprogress === '10') {
				demandBackOn = <div className={style['back-on']} onClick={this.demandBackOn.bind(this, id, role)}>重新上架</div>
				if (demandprogress === "3") {
					btn = '需求已下架';
				} else if (demandprogress === '10') {
					btn = '已拒绝';
				}
			} else if ((demandprogress === "4") && role == '1') {
				// btn = '订单已完成';
				btn=<span style={{ cursor: 'pointer' }} onClick={this.toBill}>订单已完成</span>
			} else if ((demandprogress === "5") && role == '1') {
				btn = '佣金支付';
			} else if ((demandprogress === "6") && role == '1') {
				// btn = '交易已完成';
				btn=<span style={{ cursor: 'pointer' }} onClick={this.toBill}>交易已完成</span>
			} else if (role == '0' && (demandprogress === "4" || demandprogress === "5" || demandprogress === "6")) {//航司的交易完成包括订单完成佣金支付交易完成
				// btn = '交易已完成';
				btn=<span style={{ cursor: 'pointer' }} onClick={this.toBill}>交易已完成</span>
			} else if (demandprogress === '8') {
				btn = '已接受';
			} else if (demandprogress === '9' && (demandtype === '3' || demandtype === '4')) {
				btn = '处理中';
			} else if (demandtype === '0' || demandtype === '1') {
				btn = (
					<span className={style['out-of']} onClick={this.outof.bind(this, transmit)}>{role == '1' ? '需求下架' : '运力下架'}</span>
				)
			} else {
				let str = '';
				if (demandtype === '2') {
					str = '取消托管'
				} else if (demandtype === '3' || demandtype === '4') {
					str = '取消委托'
				}
				btn = (
					<span className={style['out-of']} onClick={this.outof.bind(this, transmit)}>{str}</span>
				)
			}
		} else {
			btn = (
				<button onClick={this.collecting.bind(this, id, collectId)}>
					<i className={'iconfont'} dangerouslySetInnerHTML={this.getCollectIcon()}></i>
				</button>
			)
		};
		let resText = "";

		if (isResponseDemand == 1) {//'我'是否响应过该需求
			if (processedPlanList && processedPlanList.length) {
				let rp = -1;
				// uTime = uTime ? uTime : '';
				for (let i = 0; i < processedPlanList.length; i++) {
					let value = processedPlanList[i];
					if (value.isCurrentUserResponsePlan === '1') {
						if (value.responseProgress === '0') {
							resText = <span>我已提交方案</span>
							break;
						} else if (value.responseProgress === '1') {
							resText = <span>订单确认</span>
							break;
						} else if (value.responseProgress === '4') {
							resText = <span style={{ background: "#b4b4b4" }}>我已落选</span>;
							break;
						} else if (value.responseProgress === '5') {
							resText = <span style={{ cursor: 'pointer' }} onClick={this.toBill}>交易完成</span>;
							break;
						} else if (value.responseProgress === '6') {
							resText = <span style={{ cursor: 'pointer' }} onClick={this.toBill}>订单完成</span>;
							break;
						} else if (value.responseProgress === '7') {
							resText = <span style={{ cursor: 'pointer' }} onClick={this.toBill}>佣金支付</span>
							break;
						}
					} else {
						continue
					}
				}
				// processedPlanList.map((value, index) => {
				// 	if (value.isCurrentUserResponsePlan === '1') {
				// 		if (value.responseProgress === '0') {
				// 			resText = <span>我已提交方案</span>
				// 		} else if (value.responseProgress === '1') {
				// 			resText = <span>订单确认</span>
				// 		} else if (value.responseProgress === '4') {
				// 			resText = <span style={{ background: "#b4b4b4" }}>我已落选</span>;
				// 		} else if (value.responseProgress === '5') {
				// 			resText = <span>交易完成</span>;
				// 		} else if (value.responseProgress === '6') {
				// 			resText = <span style={{ cursor: 'pointer' }} onClick={this.toBill}>订单完成</span>;
				// 		} else if (value.responseProgress === '7') {
				// 			resText = <span>佣金支付</span>
				// 		}
				// 	}
				// })
			}
		}

		// switch (responseProgress) {
		// 	case "0":
		// 	case "1":
		// 	case "3":
		// 		resText = <span>我已提交方案</span>;
		// 		break;
		// 	case "5":
		// 		resText = <span>交易完成</span>;
		// 		break;
		// 	case "6":
		// 		resText = <span style={{ cursor: 'pointer' }} onClick={this.toBill}>订单完成</span>;
		// 		break;
		// 	case "4":
		// 		resText = <span style={{ background: "#b4b4b4" }}>我已落选</span>;
		// 		break;
		// 	default:
		// 		break;
		// };
		return (
			<div className={style['detail-title']}>
				<div>
					<h3 title={title}>{title}</h3>
					{/* 显示是否提交方案 */}
					{resText}
				</div>
				<div>
					{/* 对话框按钮 TODO:未添加事件 */}
					{/* {isResponseDemand === 1 ? <button onClick={this.chatPanel.bind(this, fromNameId, toNameId, responsePlanId)}><i className={'iconfont'}>&#xe602;</i></button> : ''} */}
					{demandBackOn}
					{/* 按钮 市场->收藏按钮  我的->(需求/运力)下架按钮*/}
					{btn}
				</div>
			</div>
		)

	}


	jichangPublish() {  // 流程提示-机场-发布
		let fromData = {
			openFrom: true,
			fromType: store.getState().role.role == '1' ? 0 : 1,
			fromMes: {
				transmit: {
					bianjiAgain: false,
					new: true,
				}
			}
		};
		emitter.emit('openFrom', fromData)
	}
	chongzhi() {  // 流程提示-充值
		this.setState({
			showCompanyRecharge: true
		})
	}
	closeChongzhi() {  // 关闭“充值”
		this.setState({
			showCompanyRecharge: false
		})
	}
	lianxiKefu() {  // 联系客服
		let obj = {};
		obj.fromNameId = store.getState().role.id;
		obj.toNameId = 1;
		obj.responsePlanId = null;
		emitter.emit('openChat', obj);
	}

	// 方案洽谈
	// 当传入指定意向方案id时,打开指定id的洽谈窗口,无则默认打开第一个方案洽谈
	chatForPlan = (rpid = '') => {
		let {
			employeeId,//发布需求烦恼歌id
			processedPlanList,//收到的方案列表
		} = this.state;
		let id = '';//意向id
		if (rpid) {
			id = rpid
		} else {
			if (processedPlanList && processedPlanList.length) {
				for (let i = 0; i < processedPlanList.length; i++) {
					let value = processedPlanList[i];
					if (value.isCurrentUserResponsePlan === '1') {
						id = value.id;
						break;
					} else {
						continue
					}
				}
			}

		}

		emitter.emit('openChat', {
			fromNameId: store.getState().role.id,
			toNameId: employeeId,
			responsePlanId: id,
		});
	}
	// 方案重新编辑
	reEditPlan = () => {
		let {
			id: demandId,//需求id
			role,
			employeeId,//发布需求烦恼歌id
			processedPlanList,//收到的方案列表
		} = this.state;

		let id = '';//意向id
		let responseId = '';//方案id

		if (processedPlanList && processedPlanList.length) {
			for (let i = 0; i < processedPlanList.length; i++) {
				let value = processedPlanList[i];
				if (value.isCurrentUserResponsePlan === '1') {
					id = value.id;
					responseId = value.responseId;
					break;
				} else {
					continue
				}
			}
		}
		let editType = 2;
		let popupType = role === '1' ? 2 : 1;//机场重新编辑表单为2,航司重新编辑表单为1

		let transmit = {
			id,//方案id
			responseId, //响应id
			demandId, //需求id
			editType,//表单类型
		}
		emitter.emit('openPopup', {
			popupType,
			popupMes: {
				transmit,
			}
		})
	}


	unLoadingFn = () => {
		this.setState(() => {
			return {
				uploading: false,
			}
		})
	}
	uploadingFn = (callback) => {
		this.setState(() => {
			return {
				uploading: true,
			}
		}, () => {
			callback()
		})
	}
	//显示一键委托二次确认框
	showVisible_entrust = (transmit) => {
		this.setState(() => {
			return {
				visible_entrust: true,
			}
		})
	}
	//隐藏一键委托二次确认框
	hideVisible_entrust = () => {
		this.setState(() => {
			return {
				visible_entrust: false,
			}
		})
	}
	// 一键委托
	option_entrust = () => {
		let { id } = this.state;
		Axios({
			url: 'autoEntrustDemand',
			method: 'get',
			params: {
				demandId: id,
			},
		}).then((response) => {
			if (response.data.opResult === "0") {
				this.updateData();
				this.hideVisible_entrust();
				Modal.success({
					title: '一键委托成功',
				});
				emitter.emit('renewWodefabu');
			} else {
				Modal.error({
					title: response.data.msg,
				});

			}
		})
	}
	// 切换至方案列表
	toReceivedList = (fn) => {
		this.setState(() => {
			return {
				defaultActiveKey: '1',
			}
		}, () => {
			if (typeof fn == 'function') {
				fn()
			}
		})
	}
	// 跳转到方案列表中,并展开待确认的方案 ,当我是需求方是:可查看所有方案/当我是意向方时:只可查看自己提交的 roleType,true:查看全部,false:查看自己
	toReceivedItem = (roleType = true) => {
		let {
			id: demandId,//需求id
			role,
			isMarket,
			employeeId,//发布需求烦恼歌id
			processedPlanList,//收到的方案列表
		} = this.state;

		let type = '';
		let keyStr = '';//意向id
		let responseId = '';//方案id

		if (role === '1' && !isMarket || role === '0' && !isMarket) {
			type = '0';
		} else {
			type = '1';
		}
		// type = roleType ? '0' : '1';

		if (processedPlanList && processedPlanList.length) {
			for (let i = 0; i < processedPlanList.length; i++) {
				let value = processedPlanList[i];
				if (value.isCurrentUserResponsePlan === type && value.responseProgress === '1' && value.state === '2') {
					keyStr = value.id + "" + i;
					break;
				} else {
					continue
				}
			}
		}
		this.toReceivedList(() => {
			this.setState(() => {
				return {
					receivedDefaultKey: keyStr,
				}
			})
		})

	}
	// 展开第一条我的提交的方案
	toReceivedFirstItem = () => {
		let {
			processedPlanList,//收到的方案列表
		} = this.state;

		let keyStr = '';//意向id

		if (processedPlanList && processedPlanList.length) {
			for (let i = 0; i < processedPlanList.length; i++) {
				let value = processedPlanList[i];
				if (value.isCurrentUserResponsePlan === '1') {
					keyStr = value.id + "" + i;
					break;
				} else {
					continue
				}
			}
		}
		this.toReceivedList(() => {
			this.setState(() => {
				return {
					receivedDefaultKey: keyStr,
				}
			})
		})
	}
	// 重新编辑需求
	reEditDemnad = () => {
		let { id, role } = this.state;
		if (id) {
			let temp = role == '1' ? { chongxinshangjia: true, } : { bianjiAgain: true }
			emitter.emit('openFrom', {
				fromType: role == '1' ? 0 : 1,
				openFrom: true,
				fromMes: {
					transmit: {
						demandId: id,
						...temp
					},
				}
			});
		} else {
			Modal.error({
				title: '出错了！',
			});
		}
	}
	// 引导提示
	guidance = () => {
		let {
			demandtype,//需求类型
			demandprogress,//需求状态
			responseProgress,//需求状态
			releasetime,//需求发布时间
			processedPlanList,//收到的方案列表
			isResponseDemand,//当前角色是否响应过该需求
			role,//角色类型 0:航司,1:机场
			isMarket,//是否是市场,true:市场,false:我发布的
		} = this.state;

		if (demandtype === '0' || demandtype === '1') {//航线需求或者运力委托

			if (role == '1' && !isMarket) {//机场查看自己的需求

				if (demandprogress === "-1") {//待支付

					return <div className={style['tip_1']}>市场瞬息万变，请及时支付意向金并发布需求，把握市场先机。</div>;

				} else if (demandprogress === "0") {//需求发布

					let rtime = new Date(releasetime);
					let ctime = new Date();
					let dtime = ctime.getTime() - rtime.getTime();
					let days = Math.floor(dtime / (24 * 3600 * 1000))
					let hours = Math.floor((dtime % (24 * 3600 * 1000)) / (3600 * 1000))
					if (Number(days) < 3) {
						return (
							<div className={style['tip_1']}>
								该需求已发布成功，请耐心等待航司响应，预计3个工作日。（已发布{days}天{hours}小时）<br />
								为提高航线开通效率您也可，<a onClick={this.showVisible_entrust}>一键委托</a> 平台专业团队替您跟进。
							</div>
						)
					} else {
						return (
							<div className={style['tip_2']}>
								该需求已发布{days}天{hours}小时，未收到任何响应方案，建议您：<br />
								1、重新评估，提高报价，细化调整航线需求，<a onClick={this.reEditDemnad}>重新编辑</a><br />
								2、当然，您也可以将这些全权委托给平台专业团队，<a onClick={this.showVisible_entrust}>一键委托</a><br />
								3、或者，继续耐心等待。
							</div>
						)
					}

				} else if (demandprogress === "1") {//意向征集

					return <div className={style['tip_1']}>已有方案响应，请尽快洽谈，并选择合适的运力，<a onClick={this.toReceivedList}>查看收到的方案</a></div>

				} else if (demandprogress === '2') {//订单确认

					return <div className={style['tip_1']}>您已选择运力，等待对方确认后生成订单，<a onClick={this.toReceivedItem.bind(this, true)}>查看确认的方案</a></div>

				} else if (demandprogress === '4') {//订单完成

					return <div className={style['tip_1']}>订单已生成，请及时联系对方签约，点此<a onClick={this.toBill}>查看订单协议</a></div>

				} else if (demandprogress === '5') {//佣金支付

					return <div className={style['tip_1']}>
						该航线开通合同已签署，系统将在7个工作日后从您预存账户中进行佣金扣款，<br />
						为避免扣款失败请提前<a onClick={this.chongzhi.bind(this)}>充值</a>保证账户金额充足。
					</div>

				} else if (demandprogress === '6') {

					return <div className={style['tip_1']}>该航线已开通，交易已完成。</div>

				} else {

					return '';

				}

			} else if (role == '1' && isMarket) {//机场查看市场运力需求 ,可能存在多个方案

				if (demandprogress === '0') {//需求发布

					if (responseProgress == '-1') {
						return <div>市场瞬息万变，请及时支付意向金并提交方案，把握市场先机。</div>
					}
					return '';

				} else if (demandprogress === '1') {// 意向征集

					if (responseProgress == '-1') {
						return <div>市场瞬息万变，请及时支付意向金并提交方案，把握市场先机。</div>
					}

					if (isResponseDemand == 1) {//'我'是否响应过该需求
						if (processedPlanList && processedPlanList.length) {
							let uTime = '';
							let rpid = '';
							for (let i = 0; i < processedPlanList.length; i++) {
								let value = processedPlanList[i];
								if (value.isCurrentUserResponsePlan === '1') {
									uTime = value.updateDate
									rpid = value.id;
									break;
								} else {
									continue
								}
							}

							let rtime = new Date(uTime);
							let ctime = new Date();
							let dtime = ctime.getTime() - rtime.getTime();
							let days = Math.floor(dtime / (24 * 3600 * 1000))
							let hours = Math.floor((dtime % (24 * 3600 * 1000)) / (3600 * 1000))
							if (Number(days) < 7) {

								return <div className={style['tip_1']}>您的<a onClick={this.toReceivedFirstItem}>方案</a>已提交成功，请积极与需求方<a onClick={this.chatForPlan.bind(this, rpid)}>联系洽谈</a>。</div>

							} else {
								return (
									<div className={style['tip_2']}>
										您的方案距上次更新已有{days}天{hours}小时，仍未被选中，建议您：<br />
										1、积极<a onClick={this.chatForPlan.bind(this, rpid)}>联系对方</a>，明确需求意图。<br />
										2、重新测算评估、优化调整方案、提高您的报价，<a onClick={this.reEditPlan}>重新编辑</a>您的意向<br />
										3、或者，坚持原方案继续耐心等待。
									</div>
								)
							}

						}

					} else if (isResponseDemand == 0) {//'我'没有响应过该需求
						return '';
					} else { //错误情况
						return '';
					}

				} else if (demandprogress === '2') {//订单确认 

					if (responseProgress == '-1') {
						return <div>市场瞬息万变，请及时支付意向金并提交方案，把握市场先机。</div>
					}

					if (isResponseDemand == 1) {//'我'是否响应过该需求
						let respStatus = false;//我的方案是否被选中 true:选中,false:未选中
						let rpid = '';
						// 查找我的方案状态
						if (processedPlanList && processedPlanList.length) {
							// processedPlanList.map((value, index) => {
							// 	//订单确认状态
							// 	if (value.isCurrentUserResponsePlan === '1' && value.responseProgress === '1') {
							// 		respStatus = true;
							// 		rpid = value.id;
							// 	}
							// })
							for (let i = 0; i < processedPlanList.length; i++) {
								let value = processedPlanList[i];
								if (value.isCurrentUserResponsePlan === '1' && value.responseProgress === '1') {
									respStatus = true;
									rpid = value.id;
									break;
								} else {
									continue
								}
							}
						}

						if (respStatus) {
							return (
								<div className={style['tip_2']}>
									您的航线方案已被对方选中，运力紧张,建议：<br />
									1.尽快<a onClick={this.toReceivedItem.bind(this, false)}>确认方案</a>，生成订单。<br />
									2.方案若有异议或调整，请<a onClick={this.chatForPlan.bind(this, rpid)}>联系对方</a>修改方案后尽快确认。<br />
									3.如果因外部原因航线无法开通，您也可申请<a onClick={this.toReceivedItem.bind(this, false)}>撤回方案</a>
								</div>
							)
						} else {//我的方案未被选中

							return <div className={style['tip_1']}>对方已在选择方案，您目前已落后。但还有机会，请积极与对方<a onClick={this.chatForPlan.bind(this, rpid)}>接洽</a> 。</div>

						}
					} else {//'我'没有响应过该需求
						return '';
					}

				} else if (demandprogress === '3') {// 需求关闭

					return <div className={style['tip_1']}>未达成合作，订单失败。对该运力感兴趣的话，您也可以自己<a onClick={this.jichangPublish}>发布</a>航线需求。</div>

				} else if (demandprogress === '4' || demandprogress === '5' || demandprogress === '6') {//订单完成,佣金支付,交易完成

					if (isResponseDemand == 1) {//'我'是否响应过该需求
						let respStatus = 0;
						// 查找我的方案状态
						if (processedPlanList && processedPlanList.length) {
							processedPlanList.map((value, index) => {
								if (value.isCurrentUserResponsePlan === '1') {
									if (value.responseProgress === '4') {
										respStatus = 1;//落选
									} else if (value.responseProgress === '6') {
										respStatus = 2;//订单完成
									} else if (value.responseProgress === '7') {
										respStatus = 3;//佣金支付
									} else if (value.responseProgress === '5') {
										respStatus = 4;//交易完成
									}
								}
							})
						}
						if (respStatus == 1) {

							return <div className={style['tip_1']}>未达成合作，订单失败。对该运力感兴趣的话，您也可以自己<a onClick={this.jichangPublish}>发布航线</a>需求。</div>

						} else if (respStatus == 2) {

							return <div className={style['tip_1']}>订单已生成，请及时联系对方签约，点此<a onClick={this.toBill}>查看订单协议</a></div>

						} else if (respStatus == 3) {

							return <div className={style['tip_1']}>
								该航线开通合同已签署，系统将在7个工作日后从您预存账户中进行佣金扣款，<br />
								为避免扣款失败请提前<a onClick={this.chongzhi.bind(this)}>充值</a>保证账户金额充足。若有疑问请<a onClick={this.lianxiKefu.bind(this)}>联系客服</a>。
							</div>

						} else if (respStatus == 4) {

							return <div className={style['tip_1']}>该航线已开通，交易已完成。您可以再<a onClick={this.jichangPublish}>发布</a>新的需求</div>

						} else {//我的方案未被选中

							return '';

						}
					} else {//'我'没有响应过该需求
						return ''
					}

				}

			} else if (role == '0' && !isMarket) {//航司查看自己发布的需求---

				if (demandprogress === '0') {//需求发布

					let rtime = new Date(releasetime);
					let ctime = new Date();
					let dtime = ctime.getTime() - rtime.getTime();
					let days = Math.floor(dtime / (24 * 3600 * 1000))
					let hours = Math.floor((dtime % (24 * 3600 * 1000)) / (3600 * 1000))

					if (Number(days) < 3) {

						return <div className={style['tip_1']}>
							该运力信息已发布成功，请耐心等待机场响应，预计3个工作日。（已发布{days}天{hours}小时）<br />
							为提高运力消化效率您也可，<a onClick={this.showVisible_entrust}>一键委托</a> 平台专业团队替您跟进。
						</div>

					} else {
						return <div className={style['tip_2']}>
							该需求已发布{days}天{hours}小时，未收到任何响应方案，建议您：<br />
							1、重新评估，提高报价，细化调整运力信息，<a onClick={this.reEditDemnad}>重新编辑</a> <br />
							2、当然，您也可以将这些全权委托给平台专业团队，<a onClick={this.showVisible_entrust}>一键委托</a> <br />
							3、或者，继续耐心等待。
						</div>
					}

				} else if (demandprogress === '1') {//意向征集

					return <div className={style['tip_1']}>已有方案响应，请尽快测算和洽谈，选择合适的航线方案，<a onClick={this.toReceivedList}>查看收到的方案</a></div>

				} else if (demandprogress === '2') {//订单确认

					return <div className={style['tip_1']}>您已选择航线方案，等待对方确认后生成订单 <a onClick={this.toReceivedItem.bind(this, true)}>查看确认的方案</a></div>

				} else if (demandprogress === '6') {//交易完成

					return <div className={style['tip_1']}>订单已生成，请及时联系对方签约，点此<a onClick={this.toBill}>查看订单协议</a></div>

				} else {
					return '';
				}

			} else if (role == '0' && isMarket) {// 航司-查看市场需求 ----

				if (demandprogress === '0') {//需求发布

					return '';

				} else if (demandprogress === '1') {//意向征集

					if (isResponseDemand == 1) {//'我'是否响应过该需求
						if (processedPlanList && processedPlanList.length) {
							let uTime = '';
							let rpid = '';

							for (let i = 0; i < processedPlanList.length; i++) {
								let value = processedPlanList[i];
								if (value.isCurrentUserResponsePlan === '1') {
									uTime = value.updateDate
									rpid = value.id;
									break;
								} else {
									continue
								}
							}
							let rtime = new Date(uTime);
							let ctime = new Date();
							let dtime = ctime.getTime() - rtime.getTime();
							let days = Math.floor(dtime / (24 * 3600 * 1000));
							let hours = Math.floor((dtime % (24 * 3600 * 1000)) / (3600 * 1000));
							if (Number(days) < 3) {

								return <div className={style['tip_1']}>您的<a onClick={this.toReceivedFirstItem}>方案</a>已提交成功，请积极与需求方<a onClick={this.chatForPlan.bind(this, rpid)}>联系洽谈</a>。</div>

							} else {

								return <div className={style['tip_2']}>
									您的方案尚未被机场选中，为提高竞争力，建议您：<br />
									1、积极<a onClick={this.chatForPlan.bind(this, rpid)}>联系对方</a>，明确需求意图。<br />
									2、重新测算评估、优化调整方案、提高您的报价，<a onClick={this.reEditPlan}>重新编辑</a>您的意向方案。<br />
									3、当然，您也可以坚持原方案，继续耐心等待。
								</div>

							}

						}

					} else {
						return '';
					}

				} else if (demandprogress === '2') {//订单确认

					if (isResponseDemand == 1) {//'我'是否响应过该需求

						if (processedPlanList && processedPlanList.length) {
							let rp = -1;
							let rpid = '';

							for (let i = 0; i < processedPlanList.length; i++) {
								let value = processedPlanList[i];
								if (value.isCurrentUserResponsePlan === '1') {
									if (value.responseProgress === '0') {//意向征集
										rp = 0;
									} else if (value.responseProgress === '1') {//订单确认
										rp = 1;
									}
									rpid = value.id;
									break;
								} else {
									continue
								}
							}

							if (rp == 0) {////意向征集 我已落选

								return <div className={style['tip_1']}>对方已在选择方案，您目前已落后。但还有机会，请积极与对方<a onClick={this.chatForPlan.bind(this, rpid)}>接洽</a>。</div>

							} else if (rp == 1) {//订单确认
								return <div className={style['tip_2']}>
									您的方案已被对方选中，建议：<br />
									1.尽快<a onClick={this.toReceivedItem.bind(this, false)}>确认方案</a>，生成订单。<br />
									2.方案若有异议或调整，请<a onClick={this.chatForPlan.bind(this, rpid)}>联系对方</a>修改方案后尽快确认。<br />
									3.如果因外部原因航线无法开通，您也可申请<a onClick={this.toReceivedItem.bind(this, false)}>撤回方案</a>。
							</div>
							} else {
								return '';
							}
						}

					} else {
						return '';
					}

				} else if (demandprogress === '3') {// 需求关闭

					return <div className={style['tip_1']}>未达成合作，订单失败。对该航线感兴趣的话，您也可以自己<a onClick={this.jichangPublish}>发布</a>运力需求。</div>

				} else if (demandprogress === '6') {//交易完成

					if (isResponseDemand == 1) {//'我'是否响应过该需求

						if (processedPlanList && processedPlanList.length) {
							var rp = -1;
							for (let i = 0; i < processedPlanList.length; i++) {
								let value = processedPlanList[i];
								if (value.isCurrentUserResponsePlan === '1') {
									if (value.responseProgress === '0') {//意向征集
										rp = 0;
									} else if (value.responseProgress === '4') {//落选状态
										rp = 0;
									} else if (value.responseProgress === '5') {//交易完成
										rp = 1;
									}
									break;
								} else {
									continue
								}
							}

							if (rp == 0) {////意向征集 我已落选

								return <div className={style['tip_1']}>未达成合作，订单失败。对该航线感兴趣的话，您也可以自己<a onClick={this.jichangPublish}>发布</a>运力信息。</div>

							} else if (rp == 1) {//订单确认
								return <div className={style['tip_1']}>已生成订单，请及时联系对方签约，点此<a onClick={this.toBill}>查看订单协议</a></div>
							} else {
								return '';
							}
						}

					} else {
						return '';
					}

				}
				// else if(demandprogress === '3'){
				// 	return <div>需求关闭了</div>
				// }

			}
		} else if (demandtype === '2') {//运营托管
			if (demandprogress === '7') {
				return <div className={style['tip_1']}>您的航线托管平台已收到，正在为您安排专属客服经理，请您稍等！<a onClick={this.lianxiKefu.bind(this)}>联系客服</a></div>
			} else if (demandprogress === '9') {
				return <div className={style['tip_1']}>正在为您全面评测航线需求，请您耐心等待！预计3个工作日。<a onClick={this.lianxiKefu.bind(this)}>联系客服</a></div>
			} else if (demandprogress === '8') {
				return <div className={style['tip_1']}>太棒了！您的托管已接受！专属客服经理会与您联系。您可以<a onClick={this.jichangPublish}>发布</a>新的需求</div>
			} else if (demandprogress === '10') {
                let { id } = this.state;
                let role = store.getState().role.role;
				return <div className={style['tip_1']}>市场条件暂时无法满足您的托管需求！航线托管失败。您可以提高报价或调整思路重新<a onClick={this.demandBackOn.bind(this, id, role)}>发布</a></div>
			} else {
				return '';
			}

		} else if (demandtype === '3') {//航线委托
			if (demandprogress === '7') {
				return <div className={style['tip_1']}>您的航线委托平台已收到，正在为您安排专属客服经理，请您稍等！<a onClick={this.lianxiKefu.bind(this)}>联系客服</a></div>
			} else if (demandprogress === '9') {
				return <div className={style['tip_1']}>正在为您全面评测航线需求，量身打造航线方案，请您耐心等待！预计3个工作日<a onClick={this.lianxiKefu.bind(this)}>联系客服</a></div>
			} else if (demandprogress === '6') {
				return <div className={style['tip_1']}>太棒了！您的委托已完成！专属客服经理会与您联系。您可以<a onClick={this.jichangPublish}>发布</a>新的需求</div>
			} else if (demandprogress === '10') {
				return <div className={style['tip_1']}>暂无市场条件满足您的委托需求！航线委托失败。您可以调整思路重新<a onClick={this.demandBackOn}>发布</a></div>
			} else {
				return '';
			}
		} else if (demandtype === '4') {//运力委托
			if (demandprogress === '7') {//待处理
				return <div className={style['tip_1']}>您的运力委托平台已收到，正在为您安排专属客服经理，请您稍等！<a onClick={this.lianxiKefu.bind(this)}>联系客服</a></div>
			} else if (demandprogress === '9') {//处理中
				return <div className={style['tip_1']}>正在为您全面评测运力情况，量身打造航线方案，请您耐心等待！预计3个工作日。<a onClick={this.lianxiKefu.bind(this)}>联系客服</a></div>
			} else if (demandprogress === '6') {//交易完成
				return <div className={style['tip_1']}>太棒了！您的委托已完成！专属客服经理会与您联系。您可以<a onClick={this.jichangPublish}>发布</a>新的需求</div>
			} else if (demandprogress === '10') {//拒绝
				return <div className={style['tip_1']}>暂无市场条件满足您的委托需求！航线委托失败。您可以调整思路重新<a onClick={this.jichangPublish}>发布</a></div>
			} else {
				return '';
			}
		}

	}
	// tab节点 收到的方案/需求详情
	tabFun = () => {
		let tab1, tab2;
		let { id, isMarket, role, processedDemandPlans, processedPlanInfo, payload, processedContact, processedPlanList, demandprogress } = this.state;
		let type = 0;//类型,1:机场-市场;2:机场-我的;3:航司-市场;4:航司-我的;

		if (role === '1') {
			type = isMarket ? 1 : 2;
		} else {
			type = isMarket ? 3 : 4;
		}
		try {
			
			tab1 = <Received isMarket={isMarket} role={role} demandId={id} demandprogress={demandprogress} planList={processedPlanList} updateDetail={this.updateDetail} defaultActiveKey={this.state.receivedDefaultKey} upPanelKey={this.upPanelKey} />;
		} catch (error) {
			console.log(error)
		}
		tab2 = (
			<div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
				<Plan isMarket={isMarket} role={role} demandPlans={processedDemandPlans} />
				<PlanInfo info={processedPlanInfo} payload={payload} contact={processedContact} updateDetail={this.updateDetail} />
				<div className={style['demand-tip']}>
					<div className={style['tip-con']}>
						{this.guidance()}
					</div>
				</div>
			</div>
		)
		return { tab1, tab2 };
	}
	processBarEle = (item, num, responseNum, tip = '') => {
		let active = {
			background: '#2196f3',
		}
		return item.map((value, index) => {
			let { text } = value
			return (
				<div className={style['process-status']} style={index <= num ? active : {}} key={index}>
					{index <= num ? <i className={`${style['response-done']} iconfont`}>&#xe61f;</i> : ''}
					<span>{text}</span>
					{responseNum == index ? <i className={`${style['response-icon']} iconfont`} title={tip}>&#xe71a;</i> : ''}
				</div>
			)
		})
	}
	processBar = () => {
		// return '';
		let { isMarket, role, demandtype, demandprogress, processedPlanList } = this.state;

		let item = [],
			num = 0,
			tempResponseProgress = -10,
			responseNum = -1,
			responseProgressNum = -10,
			total = 0,
			tip = '',
			stampType = 0;

		if (demandprogress === '6') {
			stampType = 1;//交易完成
		} else if (demandprogress === '3') {
			stampType = 2;//关闭
		}

		if (demandtype === '0' || demandtype === '1') {

			if (role === '1' && !isMarket) {//机场登录-查看我发布的
				switch (Number(demandprogress)) {
					case -1: num = 0;//待支付
						break;
					case 12: num = 1;//审核中
						break;
					case 0: num = 2;//需求发布
						break;
					case 1: num = 3;//意向征集
						break;
					case 2: num = 4;//订单确认
						break;
					case 4: num = 5;//订单完成
						break;
					case 5: num = 6;//佣金支付
						break;
					case 6: num = 7;//交易完成
						break;
					default: num = -1//关闭-下架-交易完成-错误
						break;
				}
				item = [
					{ text: '待支付', },
					{ text: '审核中', },
					{ text: '需求发布', },
					{ text: '意向征集', },
					{ text: '订单确认', },
					{ text: '订单完成', },
					{ text: '佣金支付', },
					{ text: '交易完成', },
				]
			} else if (role === '1' && isMarket) {//机场登录-查看市场
				switch (Number(demandprogress)) {
					// case -1: num = 0;//待支付
					// 	break;
					// case 12: num = 1;//草稿
					// 	break;
					case 0: num = 0;//需求发布
						break;
					case 1: num = 1;//意向征集
						break;
					case 2: num = 2;//订单确认
						break;
					case 4: num = 3;//订单完成
						break;
					case 5: num = 4;//佣金支付
						break;
					case 6: num = 5;//交易完成
						break;
					default: num = -1//关闭-下架-交易完成-错误
						break;
				}
				item = [
					{ text: '需求发布', },
					{ text: '意向征集', },
					{ text: '订单确认', },
					{ text: '订单完成', },
					{ text: '佣金支付', },
					{ text: '交易完成', },
				]
				if (processedPlanList && processedPlanList.length) {
					processedPlanList.map((value, index) => {
						if (value.isCurrentUserResponsePlan === '1') {
							let tempNum = -10;
							switch (Number(value.responseProgress)) {
								case 0: tempNum = 1; tip = '您已提交方案';//意向征集
									break;
								case 1: tempNum = 2; tip = '您的方案已被需求方选择,请尽快确认';//订单确认
									break;
								case 6: tempNum = 3; tip = '已与对方达成交易,请联系对方进行签约合作';//订单完成
									break;
								case 7: tempNum = 4; tip = '开航合作已达成';//佣金支付
									break;
								case 5: tempNum = 5; tip = '交易已完成,成功开通航线' //交易完成
									break;
								case 4: stampType = 3;//落选状态
									break;

								default: tempNum = -10;//默认
									break;
							}
							responseNum = tempNum > tempResponseProgress ? tempNum : responseNum;
						}
					})
					if (responseNum === 1 && num === 2) {
						tip = '对方已在选择方案,您目前已落后,但还有机会,请多于需求方接洽';
					}
				}
			} else if (role === '0' && !isMarket) {//航司登录-查看我发布的
				switch (Number(demandprogress)) {
					// case -1: num = 0;//待支付
					// 	break;
					case 12: num = 0;//审核中
						break;
					case 0: num = 1;//需求发布
						break;
					case 1: num = 2;//意向征集
						break;
					case 2: num = 3;//订单确认
						break;
					// case 4: num = 4;//订单完成
					// 	break;
					// case 5: num = 6;//佣金支付
					// 	break;
					case 6: num = 4;//交易完成
						break;
					default: num = -1//关闭-下架-交易完成-错误
						break;
				}
				item = [
					{ text: '审核中', },
					{ text: '需求发布', },
					{ text: '意向征集', },
					{ text: '订单确认', },
					{ text: '交易完成', },
				]

			} else if (role === '0' && isMarket) {//航司登录-查看市场
				switch (Number(demandprogress)) {
					// case -1: num = 1;//待支付
					// 	break;
					// case 12: num = 2;//草稿
					// 	break;
					case 0: num = 0;//需求发布
						break;
					case 1: num = 1;//意向征集
						break;
					case 2: num = 2;//订单确认
						break;
					case 4: num = 3;//订单完成
						break;
					case 5: num = 3;//佣金支付
						break;
					case 6: num = 3;//交易完成
						break;
					default: num = -1//关闭-下架-交易完成-错误
						break;
				}
				item = [
					{ text: '需求发布', },
					{ text: '意向征集', },
					{ text: '订单确认', },
					{ text: '交易完成', },
				]
				if (processedPlanList && processedPlanList.length) {
					processedPlanList.map((value, index) => {
						if (value.isCurrentUserResponsePlan === '1') {
							let tempNum = -10;
							switch (Number(value.responseProgress)) {
								case 0: tempNum = 1; tip = '您已提交方案';//意向征集
									break;
								case 1: tempNum = 2; tip = '您的方案已被需求方选择,请尽快确认';//订单确认
									break;
								case 6: tempNum = 3; tip = '交易已完成,成功投放运力';//订单完成
									break;
								case 7: tempNum = 3; tip = '交易已完成,成功投放运力';//佣金支付
									break;
								case 5: tempNum = 3; tip = '交易已完成,成功投放运力';//交易完成
									break;
								case 4: stampType = 3;//落选状态
									break;
								default: tempNum = -10;//默认
									break;
							}
							responseNum = tempNum > tempResponseProgress ? tempNum : responseNum;
						}
					})
					if (responseNum === 1 && num === 2) {
						tip = '对方已在选择方案,您目前已落后,但还有机会,请多与需求方接洽';
					}
				}

			}
		} else if (demandprogress === '10') {
			return '';
		} else if (demandtype === '2') {//运营托管
			switch (Number(demandprogress)) {
				case 7: num = 0;//待处理
					break;
				case 9: num = 1;//测评中
					break;
				case 8: num = 2;//已接受
					break;
				default: num = -1//关闭-下架-交易完成-错误
					break;
			}
			item = [
				{ text: '待处理', },
				{ text: '测评中', },
				{ text: '已接受', },
			]
		} else if (demandtype === '3') {//航线委托
			switch (Number(demandprogress)) {
				case 7: num = 0;//待处理
					break;
				case 9: num = 1;//处理中
					break;
				case 6: num = 2;//交易完成
					break;
				default: num = -1//关闭-下架-交易完成-错误
					break;
			}
			item = [
				{ text: '待处理', },
				{ text: '处理中', },
				{ text: '已接受', },
			]
		} else if (demandtype === '4') { // 运力委托
			switch (Number(demandprogress)) {
				case 7: num = 0;//待处理
					break;
				case 9: num = 1;//处理中
					break;
				case 6: num = 2;//交易完成
					break;
				default: num = -1//关闭-下架-交易完成-错误
					break;
			}
			item = [
				{ text: '待处理', },
				{ text: '处理中', },
				{ text: '交易完成', },
			]
		}
		// console.log(num, item.length, (num / (item.length - 1) * 100) + '%')
		return (
			<div className={style['process-bar']}>
				<div className={style['process-bar-con']} style={demandprogress === '3' ? { background: '#ccc' } : {}}>
					<div className={style['process-bg-bar']} style={{ width: ((num > 0 ? num : 0) / (item.length - 1) * 100) + '%' }}></div>
					{this.stampEle(stampType)}
					{this.processBarEle(item, num, responseNum, tip)}
				</div>
			</div>
		)
	}
	// 特殊状态 交易完成-关闭-落选 需加上印章戳
	stampEle = (stampType) => {
		// return '';
		let { demandprogress } = this.state;
		if (stampType === 1) {
			return <div className={style['stamp']}><i className={'iconfont'}>&#xe65f;</i></div>;
		} else if (stampType === 2) {
			return <div className={style['stamp']}><i className={'iconfont'}>&#xe65d;</i></div>;
		} else if (stampType === 3) {
			return <div className={style['stamp']}><i className={'iconfont'}>&#xe65e;</i></div>;
		}
		return '';
	}
	// 响应 我要洽谈/我有运力
	chatFun = () => {
		let { id: demandId, isMarket, demandprogress, isResponseDemand, isWithdrawResponse, closeReason } = this.state;
		let editType = 1;//编辑/响应 1:响应,2:重新编辑
		let transmit = { demandId, editType }//需要传递的数据
		if (demandprogress === '12') {
			return (
				<div className={style['text_tip']}>
					<div>为遵守中华人民共和国有关法律规定，发布的需求需经审核后才能在平台公开展示.</div>
					<div>审核期最长不超过1个工作日。<a onClick={this.lianxiKefu.bind(this)}>联系客服</a></div>
				</div>
			)
		} else if (demandprogress === '3') {
			return (
				<div className={style['text_info']}>
					关闭原因:{closeReason}
				</div>
			)
		} else if (demandprogress === '10') {
			return (
				<div className={style['text_info']}>
					拒绝原因:{closeReason}
				</div>
			)
		} else if (demandprogress === '-1' && !isMarket) {
			return (
				<div className={style['user-operation']}>
					<button className={style['btn-blue-plus']} onClick={this.payAndPush.bind(this)}>
						{this.state.role === '1' ? '支付意向金并发布' : ''}
					</button>
					<button className={style['btn-gray']} onClick={this.reEdit.bind(this, transmit)}>
						<i className={'iconfont'}>&#xe645;</i>重新编辑
                        </button>
				</div>
			)
		} else {
			if (isMarket) {
				if ((demandprogress === '0' || demandprogress === '1' || demandprogress === '2') && (isResponseDemand === 0 || (isResponseDemand === 1 && isWithdrawResponse === 1))) {//未响应过
					return (
						<div className={style['user-operation']}>
							<button className={style['btn-blue-plus']} onClick={this.respond.bind(this, transmit)}>
								{this.state.role === '1' ? '我要洽谈' : '我有运力'}
							</button>
						</div>
					)
				} else {
					return '';
				}
			} else {
				return '';
			}
		}
	}
	identifierFun = () => {
		let { demandprogress } = this.state;
		if (demandprogress === '4' || demandprogress === '5' || demandprogress === '6' || demandprogress === '8') {
			return '订单';
		}
		return '需求'
	}
	onTabClick = (key) => {
		this.setState({
			defaultActiveKey: key,
		})
	}
	//关闭表单详情
	closeItemDetailForm() {
		emitter.emit("addLines", { v: null, t: false });
		let o = {
			openFrom: false,
		}
		emitter.emit('openFrom', o);
	}

	render() {
		let tab = this.tabFun();
		let { demandtype } = this.state;
		return (
			<div className={style['item-detail-con']}>
				{
					this.state.showCompanyRecharge && <CompanyRecharge close={this.closeChongzhi.bind(this)} />
				}
				{
					this.state.visible_contract && <div style={{ width: 'inherit', height: '100%', position: 'absolute', zIndex: 300 }}>
						<Contract showId={this.state.id} closeDetail={() => this.closeContract()} />
					</div>
				}
				<div className={style['shade']} style={{ display: this.state.itemDetailFormLoading ? '' : 'none' }}>
					<Spin tip='loading...' spinning={this.state.itemDetailFormLoading} />
				</div>
				{
					this.state.showPayEarnestMoney && <PayEarnestMoney
						data={this.state.payData}
						close={this.closeMoneyFn.bind(this)} />
				}
				{/* <HeaderInfo headerTitle={this.state.headerTitle} /> */}
				<div className={style['detail-top-info']}>
					<div className={style['detail-top-info-item']}>
						<span>发布时间</span>
						<span>
							{this.state.releasetime}
						</span>
					</div>
					<div className={`${style['detail-top-info-item']} ${style['item-hide']}`}>
						<span>状态:</span>
						<span>
							{this.getDemandprogressStr()}
						</span>
					</div>
					<div className={`${style['detail-top-info-item']} ${style['item-hide']}`}>
						<i className={'iconfont'}>&#xe64c;</i>
						<span>浏览量</span>
						<span className={style['num-color']}>
							{this.state.browsingVolume}
						</span>
					</div>
					<div className={`${style['detail-top-info-item']} ${style['item-hide']}`}>
						<i className={'iconfont'}>&#xe6e7;</i>
						<span>响应方案</span>
						<span className={style['num-color']}>
							{this.state.recivedResponseCount}
						</span>
					</div>
					<div className={`${style['detail-top-info-item']} ${style['identifier-visible']}`}>
						<span>{this.identifierFun()}编号: </span>
						<span>
							{this.state.identifier}
						</span>
					</div>
					<div className={style['close-btn']} onClick={this.closeItemDetailForm}>
						<i className={'iconfont'}>&#xe62c;</i>
					</div>
					{/* <div className={style['detail-top-info-item']}>
						<div>
							<span>发布时间</span>
							<span>
								{this.state.releasetime}
							</span>
						</div>
						<div>
							<span>状态:</span>
							<span>
								{this.getDemandprogressStr()}
							</span>
						</div>
					</div>
					<div className={style['detail-top-info-item']}>
						<div>
							<i className={'iconfont'}>&#xe629;</i>
							<span>浏览量</span>
							<span>
								{this.state.browsingVolume}
							</span>
						</div>
						<div>
							<i className={'iconfont'}>&#xe629;</i>
							<span>响应方案</span>
							<span>
								{this.state.recivedResponseCount}
							</span>
						</div>
						<div className={style['close-btn']} onClick={this.closeItemDetailForm}>
							<i className={'iconfont'}>&#xe62c;</i>
						</div>
					</div> */}
				</div>
				<div className={style['main-detail-info']} ref={'main'}>
					<div className={style['detail-title-con']}>
						{this.titleFun()}
					</div>
					<div className={style['detail-body']} ref='body'>
						<Tabs defaultActiveKey={'2'} activeKey={this.state.defaultActiveKey} onTabClick={this.onTabClick} >
							{
								//航线需求和运力需求才显示方案列表
								demandtype === '0' || demandtype === '1' ?
									<TabPane tab={'方案列表'} key="1">
										{/*他/我收到的方案*/}
										{tab.tab1}
									</TabPane> : ''
							}
							<TabPane tab={this.getTabSecondName() + '详情'} key="2">
								{/*运力/需求详情*/}
								{tab.tab2}
							</TabPane>
						</Tabs>
					</div>
					<div style={{ height: '50px' }}>
						{this.processBar()}
					</div>
					<div style={{ height: '50px' }}>
						{this.chatFun()}
					</div>
				</div>
				<div className={`${style['identifier']} ${style['identifier2-visible']}`}>
					{this.identifierFun()}编号: {this.state.identifier}
				</div>
				<Confirmations
					title={'一键委托'} subTitle={`确认将此${this.state.role === '1' ? '航线' : '运力'}需求委托给平台处理，委托后将生成新的${this.state.role === '1' ? '航线' : '运力'}委托，此需求将关闭。`} tipText={''}
					visible={this.state.visible_entrust}
					onOk={this.option_entrust}
					onCancel={this.hideVisible_entrust}
					uploading={this.state.uploading} />
			</div>
		)
	}
}