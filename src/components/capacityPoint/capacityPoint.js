// author:wangli time:2018-08-13 content:航司运力发布地点选取组件
import React,{Component,Fragment} from "react";
import { store } from "../../store";
import style from "../../static/css/capacityPoint/capacityPoint.scss";
import Axios from "./../../utils/axiosInterceptors";
import TargetArea from "../../components/targetArea/targetArea";
import AirportSearch from "../../components/search/airportSearch";
import ProvinceSearch from "../../components/provinceSearch/provinceSearch";
import IconInfo from '../../components/IconInfo/IconInfo';
import { Select } from 'antd';
const Option = Select.Option;

export default class CapacityPoint extends Component{

    constructor(props){
        super(props);
        this.state={
            arrv:"",//航点/省份/区域 选择值
            textType:"目标",//文案显示
            areaType: "1",//区域或者航点 1航点 2省份 3区域
            arrvShowAirportSearch: false,  // 航点下拉框是否显示
            arrvAreaShowAirportSearch: false,  // 区域下拉框是否显示
            arrvProvinceShowAirportSearch: false,  // 省份下拉框是否显示
            arrvSearchText: '', // 航点输入框组件输入的内容
            arrvAreaSearchText: '', // 区域输入框组件输入的内容
            arrvProvinceSearchText: '', // 省份输入框组件输入的内容
            hintText:"",//提示文字
            lockType:"0",//是否锁定 0未锁定
            allProvinceList:[],//所有省份数据
            allAreaList:[],//所有区域数据
            verifyData:{//需要验证的数据
                dpt:"",
                pst:"",
                arrv:""
            }
        }
    }

    //验证航点冲突方法
    verifyFn(data){
        let {dpt,pst,arrv}=this.state.verifyData;
        switch (this.state.textType){
            case "目标":
                if(data==dpt){
                    this.setState({
                        hintText:"* 运力始发和目标航点不能相同"
                    })
                }else {
                    this.setState({
                        hintText:""
                    })
                }
                break;
            case "经停":
                if(data){
                    let hintText="";
					if(data==dpt&&data==arrv){
                        hintText="* 经停航点、运力始发和甩飞航点不能相同"
					}else if(data==arrv&&data!=dpt){
                        hintText="* 经停航点和甩飞航点不能相同"
					}else if(data==dpt&&data!=arrv){
					    hintText="* 经停航点和运力始发不能相同"
                    };
					this.setState({
                        hintText
                    })
                }
                break;
            case "甩飞":
                if(data){
                    let hintText="";
					if(data==dpt&&data==pst){
					    hintText="* 甩飞航点、运力始发和经停航点不能相同"
					}else if(data==pst&&data!=dpt){
						hintText="* 甩飞航点和经停航点不能相同"
					}else if(data==dpt&&data!=pst){
					    hintText="* 甩飞航点和运力始发不能相同"
                    };
					this.setState({
						hintText
					})
                }
                break;
        }
    }

    //航点组件返回数据
    arrvAirportData(data) {
        let arrv = data.code;
        this.verifyFn(arrv);
        this.setState({
            arrvSearchText: data.name,
            arrvShowAirportSearch: false,
            arrv,
        });
        this.props.dataObj({
            pointData:arrv,
            areaType:'1'
        });
    };

    //区域组件返回数据
    arrvAreaAirportData(data) {//目标区域
        this.setState({
            arrvAreaSearchText: data,
            arrvAreaShowAirportSearch: false,
            arrv: data,
        });
        this.props.dataObj({
            pointData:data,
            areaType:'3'
        });
    };

    //省份组件返回数据
    arrvProvinceAirportData(data) {//目标省份
        this.setState({
            arrvProvinceSearchText: data,
            arrvProvinceShowAirportSearch: false,
            arrv: data,
        })
        this.props.dataObj({
            pointData:data,
            areaType:'2'
        });
    };

    //航点输入框输入内容改变
    arrvSearchTextChangeFn(e) {
        let target = e.target;
        let arrvShowAirportSearch= true;
        if (target.value == "") {
            arrvShowAirportSearch=false;
            this.props.dataObj({
                pointData:"",
                areaType:'1'
            });
        };
        this.setState({
            arrvShowAirportSearch,
            arrvSearchText: target.value,
            arrv:"",
            areaType:"1",
        })
    };
    //区域输入框输入内容改变
    arrvAreaSearchTextChangeFn(e) {
        let target = e.target;
        // console.log(target)
        let  arrvAreaShowAirportSearch=true;
        if (target.value == "") {
            arrvAreaShowAirportSearch=false;
            this.props.dataObj({
                pointData:"",
                areaType:'3'
            });
        };
        this.setState({
            arrvAreaShowAirportSearch,
            arrvAreaSearchText: target.value,
            areaType:"3",
            arrv: ""
        })
    };
    //目标省份输入框输入内容改变
    arrvProvinceSearchTextChangeFn(e) {//目标省份输入框
        let target = e.target;
        let  arrvProvinceShowAirportSearch=true;
        if (target.value == "") {
            arrvProvinceShowAirportSearch=false;
            this.props.dataObj({
                pointData:"",
                areaType:'2'
            });
        };
        this.setState({
            arrvProvinceShowAirportSearch,
            arrvProvinceSearchText: target.value,
            areaType:"2",
            arrv: ""
        })
    };

    /*
        目标航点等输入框失焦事件
    */
    arrvInputBlurFn() {
        let that = this;
        setTimeout(() => {
            that.setState(() => {
                return {
                    arrvShowAirportSearch: false,
                }
            })
        }, 150)
    };
    arrvProvinceInputBlurFn() {
        let that = this;
        setTimeout(() => {
            that.setState(() => {
                return {
                    arrvProvinceShowAirportSearch: false,
                }
            })
        }, 150)
    };

    arrvAreaInputBlurFn() {
        let that = this;
        setTimeout(() => {
            that.setState(() => {
                return {
                    arrvAreaShowAirportSearch: false,
                }
            })
        }, 150)
    };

    //是否锁定
    changeLock(){//0 未锁定
        let lockType=this.state.lockType;
        if(lockType==0){
            lockType=1
        }else {
            lockType=0
        };
        this.props.lockEvent(lockType);
        this.setState({
            lockType
        })
    }

    componentWillMount(){
        let {textType="目标",dpt="",arrv="",pst="",areaType="1"}=this.props;
        Axios({  //获取省份数据列表
            method: 'post',
            url: '/getAllProvinceList',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            }
        }).then((response) => {
            if(response.data.opResult == 0){
                this.setState({
                    allProvinceList:response.data.list
                })
            }
        });
        Axios({  //获取省份数据列表
            method: 'post',
            url: '/getAllAreaList',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            }
        }).then((response) => {
            if(response.data.opResult == 0){
                this.setState({
                    allAreaList:response.data.list
                })
            }
        });
        this.setState({
            textType,
            areaType,
            verifyData:{
                dpt,
                pst,
                arrv
            }
        })
    }

    componentWillReceiveProps(nextProps){
        let allAirList = store.getState().allAirList;//始发点
        let {textType="目标",dpt="",arrv="",pst="",hintObj={},lockType=0,pstAreaType="1",areaType="1"}=nextProps;
        let {dpt:dptHint,pst:pstHint,arrv:arrvHint}=hintObj;
        let arrvSearchText = "";
        let arrvAreaSearchText = "";
        let arrvProvinceSearchText = "";
        let hintText="";
        switch (textType){
            case "目标":
                if (arrv) {
                    if (areaType == "1") {
                        //机场匹配查询
                        for (let i = 0; i < allAirList.length; i++) {
                            if (allAirList[i].iata == arrv) {
                                arrvSearchText = allAirList[i].airlnCdName;
                                break
                            }
                        };
                        if(arrv==dpt&&!dptHint){
                            hintText="* 目标航点和运力始发不能相同"
                        };
                    } else if (areaType == "2") {
                        arrvProvinceSearchText = arrv
                    } else if (areaType == "3") {
                        arrvAreaSearchText = arrv
                    } else {
                        areaType = "1"
                    };
                };
				if(arrvHint=="* 请选择目标区域或航点"){
					hintText="* 请选择目标区域或航点"
				}
                break;
            case "经停":
				areaType=pstAreaType;
                if (pst) {
                    if (areaType == "1") {
                        //机场匹配查询
                        for (let i = 0; i < allAirList.length; i++) {
                            if (allAirList[i].iata == pst) {
                                arrvSearchText = allAirList[i].airlnCdName;
                                break
                            }
                        };
						if(pst==arrv&&pst==dpt){
							if(!dptHint){
								hintText="* 经停航点、运力始发和甩飞航点不能相同";
							}else {
								hintText="";
							}
						}else if(pst==arrv&&pst!=dpt){
							hintText="* 经停航点和甩飞航点不能相同"
						}else if(pst==dpt&&pst!=arrv){
							hintText="* 经停航点和运力始发不能相同"
						};
                    } else if (areaType == "2") {
                        arrvProvinceSearchText = pst
                    } else if (areaType == "3") {
                        arrvAreaSearchText = pst
                    };
                };
				if(pstHint=="* 请选择经停区域或航点"){
					hintText="* 请选择经停区域或航点"
				}
                break;
            case "甩飞":
                if (arrv) {
                    if (areaType == "1") {
                        //机场匹配查询
                        for (let i = 0; i < allAirList.length; i++) {
                            if (allAirList[i].iata == arrv) {
                                arrvSearchText = allAirList[i].airlnCdName;
                                break
                            }
                        };
						if(arrv==pst&&arrv==dpt){
							if(!dptHint){
								hintText="* 经停航点、运力始发和甩飞航点不能相同";
							}else {
								hintText="";
							};
						}else if(arrv==pst&&arrv!=dpt){
							hintText="* 甩飞航点和经停航点不能相同"
						}else if(arrv==dpt&&arrv!=pst){
							hintText="* 甩飞航点和运力始发不能相同"
						};
                    } else if (areaType == "2") {
                        arrvProvinceSearchText = arrv;
                    } else if (areaType == "3") {
                        arrvAreaSearchText = arrv;
                    };

                };
				if(arrvHint=="* 请选择甩飞区域或航点"){
					hintText="* 请选择甩飞区域或航点"
				}
                break;
        };
        this.setState({
            arrv,
            textType,
            hintText,
            areaType,
            lockType,
            arrvSearchText,
            arrvAreaSearchText,
            arrvProvinceSearchText,
            verifyData:{
                dpt,
                pst,
                arrv
            }
        })
    }
    
    //更换目标航点或区域类型
    areaType(value) {
        // let areaType="航点";
        // if(value==2){
        //     areaType="省份"
        // }else if(value==3){
        //     areaType='区域'
        // };
        // areaType=this.state.textType+areaType;
		// this.props.dataObj({
			// pointData:"",
			// areaType:value
		// });
        this.setState({
            areaType:value,
            arrv:"",
			lockType:0,
            arrvSearchText: '', // 目标航点输入框组件输入的内容
            arrvAreaSearchText: '', // 目标区域输入框组件输入的内容
            arrvProvinceSearchText: '', // 目标省份输入框组件输入的内容
        },()=>{
            this.props.dataObj({
				pointData:"",
				areaType:value
            });
			this.props.lockEvent(0);
        })
    };

    render(){
        let arrvAxis = {  // 目标航点下拉搜索样式
            position: 'absolute',
            top: '40px',
            right: '0',
            maxHeight: '220px',
            overflowY: 'scroll',
            background: 'white',
            zIndex: 22
        };
        let arrvAreaAxis = {  // 目标航点下拉搜索样式
            position: 'absolute',
            top: '40px',
            right: '0',
            maxHeight: '220px',
            overflowY: 'scroll',
            background: 'white',
            zIndex: 22
        };
        //判断航点或者区域
        let areaType = this.state.areaType;
        let arrvBox = "";
        if (areaType == "3") {//区域
            arrvBox = <Fragment>
                <input type="text"
                       className={style['role-search-input']}
                       maxLength="20"
                       placeholder={`请输入${this.state.textType}区域`}
                       value={this.state.arrvAreaSearchText}
                       onChange={this.arrvAreaSearchTextChangeFn.bind(this)}
                    // onFocus={this.arrvAreaInputFocusFn.bind(this)}
                       onBlur={this.arrvAreaInputBlurFn.bind(this)} />
                {
                    this.state.arrvAreaShowAirportSearch &&
                    <TargetArea axis={arrvAreaAxis}
                                allAreaList={this.state.allAreaList}
                                returnData={this.arrvAreaAirportData.bind(this)}
                                searchText={this.state.arrvAreaSearchText}
                    />
                }
            </Fragment>
        } else if (areaType == "1") {//航点
            arrvBox = <Fragment>
                <input type="text"
                       className={style['role-search-input']}
                       maxLength="20"
                       placeholder={`请输入${this.state.textType}航点`}
                       value={this.state.arrvSearchText}
                       onChange={this.arrvSearchTextChangeFn.bind(this)}
                    // onFocus={this.arrvInputFocusFn.bind(this)}
                       onBlur={this.arrvInputBlurFn.bind(this)} />
                {
                    this.state.arrvShowAirportSearch
                    && <AirportSearch axis={arrvAxis}
                                      resData={this.arrvAirportData.bind(this)}
                                      searchText={this.state.arrvSearchText} />
                }
            </Fragment>
        } else if (areaType == "2") {//省份
            arrvBox = <Fragment>
                <input type="text"
                       className={style['role-search-input']}
                       maxLength="20"
                       placeholder={`请输入${this.state.textType}省份`}
                       value={this.state.arrvProvinceSearchText}
                       onChange={this.arrvProvinceSearchTextChangeFn.bind(this)}
                    // onFocus={this.arrvProvinceInputFocusFn.bind(this)}
                    //    onBlur={this.arrvProvinceInputBlurFn.bind(this)}
                    />
                {
                    this.state.arrvProvinceShowAirportSearch
                    && <ProvinceSearch axis={arrvAxis}
                                       allProvinceList={this.state.allProvinceList}
                                       returnData={this.arrvProvinceAirportData.bind(this)}
                                       searchText={this.state.arrvProvinceSearchText} />
                }
            </Fragment>
        }
        //锁定图标颜色
        let lockType=this.state.lockType;
        let lockStyle=style['unlock'];
        if(lockType==1){
            lockStyle=style['lock'];
        };
        return (
            <div className={style['capacity-release-content-box']}>
                <div className={style['newIcon']}>
                    <Select className={style['capacity-release-content-new']} value={this.state.areaType} defaultValue="1"  onChange={this.areaType.bind(this)}>
                        <Option value="1" style={{ color: "#3979ff" }}>{this.state.textType}航点</Option>
                        <Option value="2" style={{ color: "#3979ff" }}>{this.state.textType}省份</Option>
                        <Option value="3" style={{ color: "#3979ff" }}>{this.state.textType}区域</Option>
                    </Select>
                    <IconInfo placement={"top"} title={`请选择您的${this.state.textType}航点或者省份区域`}/>
                </div>
                {arrvBox}
                <div className={style['lockBox']}>
                    <span onClick={this.changeLock.bind(this)} className={`iconfont ${lockStyle}`}>&#xe664;</span>
                    <div className={style['lockText']}>
                        {this.state.lockType==1?
                            "点击取消锁定（对于指定的内容，如选航点，那只能带入该航点；如选省份或区域，那么只能向下兼容，选择指定省份或区域中所包含的航点。"
                            :"点击锁定该项（对于指定的内容，如选航点，那只能带入该航点；如选省份或区域，那么只能向下兼容，选择指定省份或区域中所包含的航点。"
                        }
                    </div>
                </div>
                <span style={{ whiteSpace: "nowrap", position: "absolute", color: "red", top: 43 }}>{this.state.hintText}</span>
            </div>
        )
    }

}