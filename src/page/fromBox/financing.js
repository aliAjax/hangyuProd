import React,{Component,Fragment} from "react";
import IconInfo from '../../components/IconInfo/IconInfo';
import AirportSearch from "../../components/search/airportSearch";
import {Radio,Input,Menu,Dropdown,Icon,Modal} from "antd";
import Axios from "./../../utils/axiosInterceptors";
import Btn from "../../components/button/btn";
import style from '../../static/css/fromBox/financing.scss';
import emitter from "../../utils/events";
import {store} from "../../store";

const RadioGroup = Radio.Group;

export default class  extends Component{

    constructor(props){
        super(props);
		this.affirmSubmit = this.affirmSubmit.bind(this);
        this.state={
			current:true,//导航栏 true：融资申请
			dpt: "",//运力始发
			pst:"",//经停点
			arrv: "",//目标区域或航点
			contact: store.getState().role.concat,//联系人
			ihome: store.getState().role.phone,//移动电话
			remark: "",//其他说明
			textNum: "0",//其他说明输入字数
			dptSearchText: '', // 始发输入框组件输入的内容
			dptShowAirportSearch: false,  // 始发下拉框是否显示
			arrvSearchText: '', // 到达输入框组件输入的内容
			arrvShowAirportSearch: false,  // 到达下拉框是否显示
			pstSearchText: '', // 经停输入框组件输入的内容
			pstShowAirportSearch: false,  // 经停下拉框是否显示
			textNum:0,//其他说明可输入文字
			remark:"",//其他说明
			judgeStylesType: {//输入框格式验证
				ihome: false, //电话格式
			},
			hintText: {//验证提示语
				dpt: "",
				pst:"",
				arrv: "",
				ihome: "",
				contact: "",
				data: ""
			},
			statusName: "状态",//状态显示名字
			status: [
				{ key: 8, name: "全部" },
				{ key: 0, name: "申请中" },
				{ key: 2, name: "申请失败" },
				{ key: 1, name: "申请成功" },
			],//状态筛选数据
			routeType:0,// 0 直飞 1 经停 2 甩飞
			listData:[],//申请记录数据
			noReadCountAboutFinacingApplication:"",//申请状态改变量
        }
    }


	//状态筛选条件
	changeStatus(num) {
		let statusName = "全部";
		switch (num) {
			case "0":
				statusName = "申请中";
				break;
			case "2":
				statusName = "申请失败";
				break;
			case "1":
				statusName = "申请成功";
				break;
			case "8":
				num = null;
				break;
			default:
				break;
		};
		this.setState({
			statusName,
			state:num
		});
		let demand={
			state:num
		};
		Axios({
			method: 'get',
			url:"/selectApplicationListByState",
			params: {
				state:num
			},
			// data: JSON.stringify(demand),
			// dataType: 'json',
			headers: {
				'Content-type': 'application/json; charset=utf-8'
			}
		}).then((response) => {
			if(response.data.opResult==0){
				this.setState({
					listData:response.data.list,
				});
			}else {
			}
		})
	}

    //申请融资
	affirmSubmit() {
		let {routeType,dpt,pst,arrv,contact,ihome,hintText,remark}=this.state;
		if(ihome==""){
			hintText.ihome="* 请输入联系电话"
		};
		if(contact==""){
			hintText.contact="* 请输入联系人姓名"
		};
		if(routeType==1&&pst==""){
			hintText.pst="* 请选择经停点"
		};
		if(routeType==2&&pst==""){
			hintText.pst="* 请选择甩飞点"
		};
		if(routeType==0){//切换到直飞时
			pst="";
			hintText.arrv="";
			if(dpt==arrv){
				if(dpt==""){
					hintText.dpt = "* 始发点和到达点不能为空";
				}else {
					hintText.dpt = "* 始发点和到达点不能相同";
				}

			}else {
				if(dpt&&arrv){
					hintText.dpt="";
					hintText.arrv="";
				}else if(dpt&&!arrv){
					hintText.dpt="";
					hintText.arrv="* 请选择到达点";
				}else{
					hintText.dpt="* 请选择始发点";
					hintText.arrv="";
				}
			}
		}else if(routeType==1){//切换到经停时
			if(dpt==pst&&dpt==arrv){
				if(dpt==""){
					hintText.dpt = "* 始发点、经停点、到达点不能为空";
				}else {
					hintText.dpt = "* 始发点、经停点、到达点不能相同";
				};
				hintText.pst="";
				hintText.arrv="";
			}else if(dpt==pst&&dpt!=arrv){
				if(!arrv){
					hintText.arrv="* 请选择到达点";
					hintText.dpt = "* 始发点和经停点不能相同";
					hintText.pst="";
				}else {
					hintText.dpt = "* 始发点和经停点不能为空";
					hintText.pst="";
					hintText.arrv="";
				}
			}else if(dpt!=pst&&dpt==arrv){
				if(!pst){
					hintText.pst="* 请选择经停点";
					hintText.dpt = "* 始发点和到达点不能相同";
					hintText.arrv="";
				}else {
					hintText.dpt = "* 始发点和到达点不能为空";
					hintText.pst="";
					hintText.arrv="";
				}
			}else if(dpt!=pst&&pst==arrv){
				if(!dpt){
					hintText.dpt="* 请选择始发点";
					hintText.arrv = "* 到达点和经停点不能相同";
					hintText.pst="";
				}else {
					hintText.dpt = "";
					hintText.pst="";
					hintText.arrv="* 到达点和经停点不能为空";
				}
			}
		}else {//甩飞时
			if(dpt==pst&&dpt==arrv){
				if(dpt==""){
					hintText.dpt = "* 始发点、甩飞点、到达点不能为空";
				}else {
					hintText.dpt = "* 始发点、甩飞点、到达点不能相同";
				};
				hintText.pst="";
				hintText.arrv="";
			}else if(dpt==pst&&dpt!=arrv){
				if(!arrv){
					hintText.arrv="* 请选择甩飞点";
					hintText.dpt = "* 始发点和经停点不能相同";
					hintText.pst="";
				}else {
					hintText.dpt = "* 始发点和经停点不能为空";
					hintText.pst="";
					hintText.arrv="";
				}
			}else if(dpt!=pst&&dpt==arrv){
				if(!pst){
					hintText.pst="* 请选择经停点";
					hintText.dpt = "* 始发点和甩飞点不能相同";
					hintText.arrv="";
				}else {
					hintText.dpt = "* 始发点和甩飞点不能为空";
					hintText.pst="";
					hintText.arrv="";
				}
			}else if(dpt!=pst&&pst==arrv){
				if(!dpt){
					hintText.dpt="* 请选择始发点";
					hintText.arrv = "* 甩飞点和经停点不能相同";
					hintText.pst="";
				}else {
					hintText.dpt = "";
					hintText.pst="";
					hintText.arrv="* 甩飞点和经停点不能为空";
				}
			}
		};
		let contactType=false;
		if(contact){
			var first=contact.split(" ").join("");
			var second=first.split("　").join("");
			if(second){
				contactType=true;
			}else {
				hintText.contact="* 请输入正确的联系人姓名"
			};
		};
		if(routeType==0&&dpt&&arrv&&dpt!=arrv&&contactType&&ihome&&/^[1][3,4,5,7,8][0-9]{9}$/.test(ihome)){
			let demand= {
				routeType,
				dpt,
				arrv,
				pst:null,
				ihome,
				contact,
				remark
			};
			Axios({
				method: 'post',
				url:"/applicationFinancingBySelf",
				data: JSON.stringify(demand),
				dataType: 'json',
				headers: {
					'Content-type': 'application/json; charset=utf-8'
				}
			}).then((response) => {
				if (response.data.opResult == "0") {
					Modal.success({
						title: '信息提示：',
						content: '融资申请提交成功，可在申请记录中查看',
						onOk() {
							emitter.emit("financing");
							emitter.emit('openFrom', { openFrom: false });
						},
						className: "test"
					});
				} else {

					Modal.error({
						title: '信息提示：',
						content: '融资申请失败' + "," + response.data.msg,
						onOk() {
							emitter.emit('openFrom', { openFrom: false });
						},
						className: "test"
					});
				}
			})
		}else if((routeType==1||routeType==2)&&dpt&&arrv&&contact&&pst&&ihome&&dpt!=arrv&&dpt!=pst&&pst!=arrv) {
			let demand= {
				routeType,
				dpt,
				arrv,
				pst,
				ihome,
				contact,
				remark
			};
			Axios({
				method: 'post',
				url: "/applicationFinancingBySelf",
				data: JSON.stringify(demand),
				dataType: 'json',
				headers: {
					'Content-type': 'application/json; charset=utf-8'
				}
			}).then((response) => {
				if (response.data.opResult == "0") {
					Modal.success({
						title: '信息提示：',
						content: '融资申请提交成功，可在申请记录中查看',
						onOk() {
							emitter.emit("financing");
							emitter.emit('openFrom', { openFrom: false });
						},
						className: "test"
					});
				} else {
					Modal.error({
						title: '信息提示：',
						content: '融资申请失败' + "," + response.data.msg,
						onOk() {
							emitter.emit('openFrom', { openFrom: false });
						},
						className: "test"
					});
				}
			})
		}
		else {
			this.setState({
				hintText
			})
		}
	}

	//切换导航栏
	changeNav(type){
    	if(type){
			emitter.emit("financing");
    		let hintText=this.state.hintText;
    		hintText.contact="";
    		hintText.ihome="";
			Axios({
				method: 'get',
				url:"/updateSystemStateAboutFinancingApplication",
				headers: {
					'Content-type': 'application/json; charset=utf-8'
				}
			}).then((response) => {
				let demand={
					state:null
				};
				Axios({
					method: 'get',
					url:"/selectApplicationListByState",
					data: JSON.stringify(demand),
					dataType: 'json',
					headers: {
						'Content-type': 'application/json; charset=utf-8'
					}
				}).then((response) => {
					if(response.data.opResult==0){
						this.setState({
							listData:response.data.list,
							noReadCountAboutFinacingApplication:response.data.noReadCountAboutFinacingApplication
						});
					}else {
					}
				});
			});
			this.setState({
				current: type,
				contact: store.getState().role.concat,//联系人
				ihome: store.getState().role.phone,//移动电话
				hintText
			});
		}else {
    		emitter.emit("financing");
			this.setState({
				statusName: "状态",//状态显示名字
				current: type,
				noReadCountAboutFinacingApplication:""
			});
		}
	}

	//更改航路设计方式
	changeWayType=(e)=>{
    	let {pst,hintText,dpt,arrv}=this.state;
    	if(e.target.value==0){//切换到直飞时
    		pst="";
			hintText.arrv="";
    		if(dpt==arrv){
    			if(dpt==""){
    				hintText.dpt="";
				}else {
					hintText.dpt = "* 始发点和到达点不能相同";
				};
			}else {
    			hintText.dpt="";
    			hintText.pst="";
			}
		}else if(e.target.value==1){//切换到经停时
    		if(dpt==pst&&dpt==arrv){
				if(dpt==""){
					hintText.dpt="";
				}else {
					hintText.dpt = "* 始发点、经停点、到达点不能相同";
				};
				hintText.pst="";
				hintText.arrv="";
			}else if(dpt==pst&&dpt!=arrv){
    			if(dpt==""){
					hintText.dpt = "";
				}else {
					hintText.dpt = "* 始发点和经停点不能相同";
				};
				hintText.pst="";
				hintText.arrv="";
			}else if(dpt!=pst&&dpt==arrv){
				if(dpt==""){
					hintText.dpt = "";
				}else {
					hintText.dpt = "* 始发点和到达点不能相同";
				};
				hintText.pst="";
				hintText.arrv="";
			}else if(dpt!=pst&&dpt!=arrv&&pst==arrv){
				if(pst){
					hintText.arrv = "* 到达点和经停点不能相同";
				}else {
					hintText.arrv="";
				};
				hintText.dpt = "";
				hintText.pst="";
			}else {
    			hintText.dpt="";
    			hintText.pst="";
    			hintText.arrv="";
			}
		}else {//切换到甩飞时
			if(dpt==pst&&dpt==arrv){
				if(dpt==""){
					hintText.dpt = "";
				}else {
					hintText.dpt = "* 始发点、甩飞点、到达点不能相同";
				};
				hintText.pst="";
				hintText.arrv="";
			}else if(dpt==pst&&dpt!=arrv){
				if(dpt==""){
					hintText.dpt = "";
				}else {
					hintText.dpt = "* 始发点和甩飞点不能相同";
				};
				hintText.pst="";
				hintText.arrv="";
			}else if(dpt!=pst&&dpt==arrv){
				if(dpt==""){
					hintText.dpt = "";
				}else {
					hintText.dpt = "* 始发点和到达点不能相同";
				};
				hintText.pst="";
				hintText.arrv="";
			}else if(dpt!=pst&&dpt!=arrv&&pst==arrv){
				if(pst==""){
					hintText.arrv = "";
				}else {
					hintText.arrv="* 到达点和甩飞点不能相同";
				};
				hintText.dpt = "";
				hintText.pst="";
			}else {
				hintText.dpt="";
				hintText.pst="";
				hintText.arrv="";
			}
		};
    	this.setState({
			hintText,
			routeType:e.target.value,
			pst,
		})
	}

	//运力始发输入框输入内容改变
	dptSearchTextChangeFn(type,e) {
		let target = e.target;
		let hintText = this.state.hintText;
		switch (type){
			case "dpt":
				let dpt = this.state.dpt;
				let dptShowAirportSearch=true;
				if (target.value == "") {
					dpt = "";
					hintText.dpt = "* 请选择运力始发";
					dptShowAirportSearch=false
				};
				this.setState({
					dptSearchText: target.value,
					dpt,
					hintText,
					dptShowAirportSearch,
				})
				break;
			case "arrv":
				let arrv = this.state.arrv;
				let arrvShowAirportSearch=true;
				if (target.value == "") {
					arrv = "";
					hintText.arrv = "* 请选择运力到达";
					arrvShowAirportSearch=false
				};
				this.setState({
					arrvSearchText: target.value,
					arrv,
					hintText,
					arrvShowAirportSearch,
				})
				break;
			case "pst":
				let pst = this.state.pst;
				let pstShowAirportSearch=true;
				if (target.value == "") {
					pst = "";
					hintText.pst = "* 请选择运力经停";
					pstShowAirportSearch=false
				};
				this.setState({
					pstSearchText: target.value,
					pst,
					hintText,
					pstShowAirportSearch,
				})
				break;
		}
	};

	/*
	*运力始发&&目标航点等输入框失焦事件
	*
	*/
	dptInputBlurFn(type) {
		let that = this;
		switch (type){
			case "dpt":
				setTimeout(() => {
					that.setState(() => {
						return {
							dptShowAirportSearch: false,
						}
					})
				}, 150)
				break;
			case "pst":
				setTimeout(() => {
					that.setState(() => {
						return {
							pstShowAirportSearch: false,
						}
					})
				}, 150)
				break;
			case "arrv":
				setTimeout(() => {
					that.setState(() => {
						return {
							arrvShowAirportSearch: false,
						}
					})
				}, 150)
				break;
		}

	};

	// 始发接受下拉框传来的数据
	//data:返回数据对象
	dptAirportData(type,data) {
		let {dpt,arrv,pst,hintText,routeType}=this.state;
		switch (type){
			case "dpt":
				dpt = data.code;
				hintText.dpt = "";
				if (dpt == arrv&&dpt!=pst) {
					hintText.dpt = "* 始发点和到达点不能相同";
					hintText.pst="";
					hintText.arrv="";
				}else if(dpt != arrv&&dpt==pst){
					if(routeType==1){
						hintText.dpt = "* 始发点和经停点不能相同";
					}else {
						hintText.dpt = "* 始发点和甩飞点不能相同";
					};
					hintText.pst="";
					hintText.arrv="";
				}else if(dpt==arrv&&dpt==pst){
					hintText.pst="";
					hintText.arrv="";
					if(routeType==1){
						hintText.dpt = "* 始发点、经停点、到达点不能相同";
					}else {
						hintText.dpt = "* 始发点、甩飞点、到达点不能相同";
					}
				}else if(dpt!=arrv&&arrv==pst&&arrv!=""){
					hintText.dpt="";
					hintText.pst="";
					if(routeType==1){
						hintText.arrv = "* 经停点和到达点不能相同";
					}else {
						hintText.arrv = "* 甩飞点和到达点不能相同";
					}
				}else {
					hintText.dpt="";
					hintText.pst="";
					hintText.arrv="";
				};
				this.setState({
					hintText,
					dptSearchText: data.name,
					dptShowAirportSearch: false,
					dpt
				})
				break;
			case "pst":
				pst = data.code;
				hintText.pst = "";
				if (pst == arrv&&dpt!=pst) {
					hintText.dpt="";
					hintText.arrv="";
					if(routeType==1){
						hintText.pst = "* 经停点和到达点不能相同";
					}else {
						hintText.pst = "* 甩飞点和到达点不能相同";
					}
				}else if(pst != arrv&&dpt==pst){
					hintText.dpt="";
					hintText.arrv="";
					if(routeType==1){
						hintText.pst = "* 经停点和始发点不能相同";
					}else {
						hintText.pst = "* 甩飞点和始发点不能相同";
					}
				}else if(pst==arrv&&pst==dpt){
					hintText.dpt="";
					hintText.arrv="";
					if(routeType==1){
						hintText.pst = "* 经停点、始发点、到达点不能相同";
					}else {
						hintText.pst = "* 甩飞点、始发点、到达点不能相同";
					}
				}else if(pst!=arrv&&dpt==arrv&&dpt!=""){
					hintText.pst="";
					hintText.arrv="";
					hintText.dpt = "* 始发点和到达点不能相同";
				}else {
					hintText.dpt="";
					hintText.pst="";
					hintText.arrv="";
				};;
				this.setState({
					hintText,
					pstSearchText: data.name,
					pstShowAirportSearch: false,
					pst
				})
				break;
			case "arrv":
				arrv = data.code;
				hintText.arrv = "";
				if (pst == arrv&&dpt!=arrv) {
					hintText.dpt="";
					hintText.pst="";
					if(routeType==1){
						hintText.arrv = "* 到达点和经停点不能相同";
					}else {
						hintText.arrv = "* 到达点和甩飞点不能相同";
					}
				}else if(pst != arrv&&dpt==arrv){
					hintText.dpt="";
					hintText.pst="";
					hintText.arrv = "* 到达点和始发点不能相同";
				}else if(arrv==pst&&arrv==dpt){
					hintText.dpt="";
					hintText.pst="";
					if(routeType==1){
						hintText.arrv = "* 到达点、经停点、始发点不能相同";
					}else {
						hintText.arrv = "* 到达点、甩飞点、始发点不能相同";
					}
				}else if(arrv!=dpt&&dpt==pst&&dpt!=""){
					hintText.arrv="";
					hintText.pst="";
					if(routeType==1){
						hintText.dpt = "* 始发点和经停点不能相同";
					}else {
						hintText.dpt = "* 始发点和甩飞不能相同";
					}
				}else {
					hintText.dpt="";
					hintText.pst="";
					hintText.arrv="";
				};;
				this.setState({
					hintText,
					arrvSearchText: data.name,
					arrvShowAirportSearch: false,
					arrv
				})
				break;
		}
	}

	//其他说明
	other(event) {
		let remark = event.target.value;
		let textNum = remark.length;
		this.setState({
			remark,
			textNum
		})
	};

	//联系人
	contact(event) {
		let contact = event.target.value;
		let hintText = this.state.hintText;
		hintText.contact = "";
		this.setState({
			contact,
			hintText
		})
	};

	//移动电话
	ihome(event) {
		let ihome = event.target.value;
		let judgeStylesType = this.state.judgeStylesType;
		var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;//验证规则
		if (phoneReg.test(ihome)) {
			judgeStylesType.ihome = true;
			this.setState({
				ihome,
				judgeStylesType
			})
		} else {
			judgeStylesType.ihome = false;
			this.setState({
				ihome,
				judgeStylesType
			})
		}
	};

	//移动电话输入事件
	ihomeChange(e) {
		// let judgeStylesType = this.state.judgeStylesType;
		// var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;//正则验证规则
		this.setState({
			ihome: e.target.value,
		})
		// if (phoneReg.test(e.target.value)) {
		// 	judgeStylesType.ihome = true;
		// 	this.setState({
		// 		ihome: e.target.value,
		// 		judgeStylesType
		// 	})
		// } else {
		// 	judgeStylesType.ihome = false;
		// 	this.setState({
		// 		ihome: e.target.value,
		// 		judgeStylesType
		// 	})
		// }
	};

	componentWillMount(){
		var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;//正则验证规则
		let judgeStylesType=this.state.judgeStylesType;
		if(phoneReg.test(store.getState().role.phone)){
			judgeStylesType.ihome=true
			this.setState({
				judgeStylesType
			})
		};
		let demand={
			state:null
		};
		Axios({
			method: 'get',
			url:"/selectApplicationListByState",
			data: JSON.stringify(demand),
			dataType: 'json',
			headers: {
				'Content-type': 'application/json; charset=utf-8'
			}
		}).then((response) => {
			if(response.data.opResult==0){
				this.setState({
					current:this.props.fromMes.type,
					listData:response.data.list,
					noReadCountAboutFinacingApplication:response.data.noReadCountAboutFinacingApplication
				});
			}else {
			}
		});
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			current:nextProps.fromMes.type
		})
	}

	//申请记录滚动条
	componentDidMount(){

	}

	//关闭表单
	cancel(){
		emitter.emit('openFrom', { openFrom: false });
	}

    render(){
    	let {current,hintText}=this.state;
		let dptAxis = {  // 始发下拉搜索样式
			position: 'absolute',
			top: '40px',
			right: '0',
			maxHeight: '220px',
			overflowY: 'scroll',
			background: 'white',
			zIndex: 22
		};
		//运力始发
		let dptText = hintText.dpt;
		let arrvText = hintText.arrv;
		let pstText = hintText.pst;
		//联系人
		let contactText = hintText.contact;
		//移动电话正则验证提示
		let ihomeText = "";
		let ihomeType = this.state.judgeStylesType.ihome;
		let ihomeNoText = this.state.hintText.ihome;
		if (!ihomeType && this.state.ihome != "") {
			ihomeText = "* 请输入正确的手机号"
			ihomeNoText = "";
		} else if (ihomeType) {
			ihomeNoText = "";
			ihomeText = ""
		};
		try {
			this.ihomeInput.input.value = this.state.ihome
		} catch (e) {

		};
		let timerA=false;//防抖
		let _this=this;
		//下拉选项
		const onClickEvent = function ({ key }) {
			_this.changeStatus(key)
		};
		const menu = (
			<Menu onClick={onClickEvent}>
				{
					this.state.status.map((item, key) => {
						return <Menu.Item key={item.key}><span>{item.name}</span></Menu.Item>
					})
				}
			</Menu>
		);
		let noReadCountAboutFinacingApplication=this.state.noReadCountAboutFinacingApplication;
		let noReadCountAboutFinacingApplicationText="";
		if(noReadCountAboutFinacingApplication>=1){
			if(noReadCountAboutFinacingApplication>99){
				noReadCountAboutFinacingApplicationText="99+"
			}else {
				noReadCountAboutFinacingApplicationText=noReadCountAboutFinacingApplication
			}
		}
        return (
        	<div className={style['formBox']}>
				<div className={style['formBoxNav']}>
					<ul className={`clear-both`}>
						<li onClick={this.changeNav.bind(this,true)}>
							<div className={current?style['navBorder']:style['']}>
								<span className={`iconfont ${style['formIcon']}`}>&#xe745;</span><span>航线融资申请</span>
							</div>
						</li>
						<li onClick={this.changeNav.bind(this,false)}>
							<div className={!current?style['navBorder']:style['']}>
								<span className={`iconfont ${style['formIcon']}`}>&#xe665;</span><span>申请记录</span>{this.state.noReadCountAboutFinacingApplication>0?<div className={style['applicationNum']}>{noReadCountAboutFinacingApplicationText}</div>:""}
							</div>
						</li>
					</ul>
				</div>
				{
					current?
							<div className={style['financingBox']}>
								<div className={style['title']}>
									请输入你想融资的航线
								</div>
								<div className={style['radio']}>
									<span>航路设计</span>
									<RadioGroup onChange={this.changeWayType} value={this.state.routeType}>
										<Radio value={0}>直飞</Radio>
										<Radio value={1}>经停</Radio>
										<Radio value={2}>甩飞</Radio>
									</RadioGroup>
									<div style={{display:"inline-block",marginLeft:"-15px"}}>
										<IconInfo title={"选择您想开航融资的航线类型"}/>
									</div>
								</div>
								<div className={style['component']}>
									<div>
										<div className={style['capacity-release-content-box']}>
											<div className={style['capacity-release-content-filter-type']}><span className={`iconfont`}>&#xe6ad;</span><span className={style['iconAir']}>始发</span></div>
											<input type="text"
												   className={style['role-search-input']}
												   maxLength="20"
												   placeholder="请输入运力始发点"
												   value={this.state.dptSearchText}
												   onChange={this.dptSearchTextChangeFn.bind(this,"dpt")}
												// onFocus={this.dptInputFocusFn.bind(this)}
												   onBlur={this.dptInputBlurFn.bind(this,"dpt")}
											/>
											{
												this.state.dptShowAirportSearch
												&& <AirportSearch axis={dptAxis}
																  resData={this.dptAirportData.bind(this,"dpt")}
																  searchText={this.state.dptSearchText} />
											}
											<span className={style['mes']}>{dptText}</span>
										</div>
										<div className={style['capacity-release-content-box']}>
											<div className={style['capacity-release-content-filter-type']}><span className={`iconfont`}>&#xe672;</span><span className={style['iconAir']}>到达</span></div>
											<input type="text"
												   className={style['role-search-input']}
												   maxLength="20"
												   placeholder="请输入运力到达点"
												   value={this.state.arrvSearchText}
												   onChange={this.dptSearchTextChangeFn.bind(this,"arrv")}
												// onFocus={this.dptInputFocusFn.bind(this)}
												   onBlur={this.dptInputBlurFn.bind(this,"arrv")}
											/>
											{
												this.state.arrvShowAirportSearch
												&& <AirportSearch axis={dptAxis}
																  resData={this.dptAirportData.bind(this,"arrv")}
																  searchText={this.state.arrvSearchText} />
											}
											<span className={style['mes']}>{arrvText}</span>
										</div>
									</div>
									{
										(this.state.routeType==1||this.state.routeType==2)&&
											<div className={style['capacity-release-content-box']}>
												<div className={style['capacity-release-content-filter-type']}><span className={`iconfont`}>&#xe6ad;</span><span className={style['iconAir']}>
													{this.state.routeType==1?"经停":"甩飞"}
												</span></div>
												<input type="text"
													   className={style['role-search-input']}
													   maxLength="20"
													   placeholder={`请输入运力${this.state.routeType==1?"经停":"甩飞"}点`}
													   value={this.state.pstSearchText}
													   onChange={this.dptSearchTextChangeFn.bind(this,"pst")}
													// onFocus={this.dptInputFocusFn.bind(this)}
													   onBlur={this.dptInputBlurFn.bind(this,"pst")}
												/>
												{
													this.state.pstShowAirportSearch
													&& <AirportSearch axis={dptAxis}
																	  resData={this.dptAirportData.bind(this,"pst")}
																	  searchText={this.state.pstSearchText} />
												}
												<span className={style['mes']}>{pstText}</span>
											</div>
									}

								</div>
								<div className={style['other']}>
									<div className={style['capacity-release-content-other']} style={{ position: "relative" }}>
										<div style={{color:"#3c78ff"}}>其他说明</div>
										<textarea className={style['otherText']} value={this.state.remark} maxLength="80" onChange={this.other.bind(this)}></textarea>
										<span className={style['row-border']} style={{ top: '22px' }}></span>
										<span className={style['row-border']} style={{ top: '44px' }}></span>
										<span className={style['row-border']} style={{ top: '66px' }}></span>
										<span style={{ position: 'absolute', bottom: '0px', right: '10px' }}>{this.state.textNum}/80</span>
									</div>
								</div>
								<div className={style['phoneNum']}>
									<div className={style['capacity-release-content-box']}>
										<div className={style['capacity-release-content-filter-type']}>联系人</div>
										<input className={style['capacity-release-input-hover']} maxLength={20} value={this.state.contact}  placeholder={"请输入联系人姓名"}  onChange={this.contact.bind(this)}></input>
										<span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 52 }}>{contactText}</span>
									</div>
									<div className={style['capacity-release-content-box']} style={{ position: "relative" }}>
										<div className={style['capacity-release-content-filter-type']}>电话</div>
										<input value={this.state.ihome} className={style['capacity-release-input-hover']} onBlur={this.ihome.bind(this)} placeholder={"请输入联系人电话"} maxLength="11" onChange={this.ihomeChange.bind(this)}></input>
										<span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 52 }}>{ihomeText}</span>
										<span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 52 }}>{ihomeNoText}</span>
									</div>
								</div>
								<div className={style['btns']}>
									<Btn text='提交申请' otherText="申请中" btnType="1" styleJson={{ width: "250px" ,padding:0}} onClick={function () {//防止连续点击
										clearTimeout(timerA);
										timerA = setTimeout(function () {
											_this.affirmSubmit()
										}, 300)
									}} />
									<Btn text='取消' btnType="0" styleJson={{ width: "100px", height: "32px",padding:0 }} onClick={this.cancel.bind(this)} />
								</div>
							</div>
						:
						<div className={style['applicationRecord']}>
							<div className={style['applicationRecordNav']}>
								<div className={style['recordTime']}>时间</div>
								<div className={style['recordLine']}>航线</div>
								<div className={style['my-intention-nav-send']}>
									<Dropdown overlay={menu} trigger={['click']}>
										<a className="ant-dropdown-link" href="#" style={{ textDecoration: "none" }}>
											{this.state.statusName} <Icon type="caret-down" />
										</a>
									</Dropdown>
								</div>
							</div>
							<div className={style['applicationRecordList']}>
								{this.state.listData.length==0?
									<div className={style['noData']}>暂无申请记录</div>
									:this.state.listData.map((item,index)=>{
									return (<div style={{position:"relative"}}>
												<div className={style['listTime']}>{item.applicationDateFormat}</div>
												<div className={style['listTitle']} title={item.airLine}>{item.airLine}</div>
												<div className={style['listStatus']}>{item.stateStr}</div>
												{item.unReadSysTemMessage>0?<div className={style['msePoint']}></div>:""}
											</div>)
								})}
							</div>
						</div>
				}
			</div>
		)
    }

}