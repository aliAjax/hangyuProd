import React, {Component} from 'react';
import Axios from "./../../../utils/axiosInterceptors";
import emitter from "../../../utils/events";
import SaveOrNot from '../../../components/saveOrNot/saveOrNot'
import styles from '../../../static/css/from/airLineNeed.scss'
import {store} from "../../../store/index";
import { Modal } from 'antd';
import Btn from "../../../components/button/btn";

export default class AirLineEscrow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSmall: false,
            noMsgFabu: false,  // 表单发布
            noMsgCaogao: false,  // 保存草稿按钮
            saveDraftId: '',  // 保存草稿成功后返回的id
            fltNbr: '',  // 航班号
            fltNbrWarnShow: false,  // 航班号警告是否显示
            contact: '',  // 联系人
            contactWarnShow: false, // 联系人警告是否显示
            iHome: '',  // 联系方式
            iHomeWarnShow: false,  // 联系方式警告是否显示
            remark: '',  // 其他说明
            textNum: 0,  // 其他说明字数
            showSaveOrNot: false,  // 是否保存为草稿是否显示
            alertShow: false,  // 关闭 是否弹窗
            myHeight: '',
        };
    }
    success(mes) {
        Modal.success({
            title: mes,
        });
    }
    error(mes) {
        Modal.error({
            title: mes,
        });
    }
    fltNbrChangeFn(e) {  // 航班号改变事件
        let target = e.target;
        let val = target.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'');
        this.setState({
            fltNbr: val,
            fltNbrWarnShow: false,
            alertShow: true,
        })
    }
    closeFn() {  // 点击“取消”
        if(this.state.alertShow) {
            this.setState({
                showSaveOrNot: true,
            });
        }else {
            this.closeFormBox();
        }
    }
    contactFocusFn() {
        this.setState({
            contactWarnShow: false
        })
    }
    contactChangeFn(e) {  // 联系人失焦事件
        let target = e.target;
        let val = target.value.replace(/(^\s*)|(\s*$)/g,"");
        this.setState({
            contact: val,
            alertShow: true,
        })
    }
    iHomeChangeFn(e) {  // 联系方式input事件
        let target = e.target;
        let val = target.value.replace(/\D/g,'');
        this.setState({
            iHome: val,
            iHomeWarnShow: false,
            alertShow: true,
        })
    }
    iHomeBlurFn(e) {  // 联系方式失焦事件
        let target = e.target;
        let val = target.value.replace(/(^\s*)|(\s*$)/g,"");
        if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(val)) && (val != '')) {
            this.setState({
                iHomeWarnShow: true
            })
        }
    }
    textChangeFn(e) {  // 其他说明改变
        let target = e.target;
        this.setState({
            remark: target.value,
            textNum: e.target.value.length,
            alertShow: true,
        })
    }
    saveOrNotSaveFn() {  // 保存-是否保存为草稿组件
        this.setState({
            showSaveOrNot: false,
        });
        this.sendDataFn(3)  //type: 1 保存草稿， type: 2 发布运力信息, type: 3 保存-保存为草稿组件
    }
    saveOrNotCancelFn() {  // 取消-保存为草稿组件
        this.closeFormBox();
    }
    closeFormBox() {
        let obj = {};
        obj.openFrom = false;
        obj.fromType = '';
        obj.fromMe = '';
        emitter.emit('openFrom', obj);
    }
    save() {  // 提交的数据
        let demand = {};
        demand.demandtype = "2";  // 0:航线需求、1:运力需求、2:运营托管、3:航线委托、4:运力委托
        demand.fltNbr = this.state.fltNbr;  // 航班号
        demand.contact = this.state.contact;  // 联系人
        demand.iHome = this.state.iHome;   // 联系方式
        demand.remark = this.state.remark;  // 其他说明
        return demand;
    }
    sendDataFn(type) {   // type: 1 保存草稿， type: 2 发布运力信息, type: 3 保存草稿-是否保存草稿组件
        let re = new RegExp(/^[A-Za-z0-9]+$/);
        let fltNbr = this.state.fltNbr;  // 航班号
        let contact = this.state.contact; // 联系人
        let iHomeWarnShow = this.state.iHomeWarnShow;  // 联系方式
        if(fltNbr == '' || !re.test(fltNbr)){
            this.setState({
                fltNbrWarnShow: true
            });
            return false
        }else if(contact == ''){
            this.setState({
                contactWarnShow: true
            });
            return false
        }else if(iHomeWarnShow) {
            return false
        }
        else {
            let demand = this.save();  // 绑定数据 type: 1 保存草稿， type: 2 发布运力信息, type: 3 保存草稿-是否保存草稿组件
            if(type == 1 || type == 3) {  // TODO：点击保存草稿  demandprogress=11
                demand.demandprogress = 11;
                this.setState({
                    noMsgCaogao: true,
                },()=>{
                    //TODO:请求需要渲染的数据，保存草稿：第一次--demandAdd，第二次--demandUpdate
                    if(this.state.saveDraftId != '' && this.state.saveDraftId != null) {
                        demand.id = this.state.saveDraftId;
                        try{
                            demand.releasetime = this.props.data.releasetime;
                        }catch (e) {

                        }
                        Axios({
                            method: 'post',
                            url: '/demandUpdate',
                            /*params:{  // 一起发送的URL参数
                                page:1
                            },*/
                            data: JSON.stringify(demand),
                            dataType:'json',
                            headers: {
                                'Content-type': 'application/json;charset=utf-8'
                            }
                        }).then((response)=>{
                            if(type == 1) {
                                if(response.data.opResult === '0') {
                                    this.success('保存草稿成功，请进入个人中心-草稿箱查看');
                                    this.props.renewData();
                                    this.setState({
                                        alertShow: false,
                                    });
                                    this.closeFormBox();
                                    emitter.emit('renewCaogaoxiang');
                                }else {
                                    this.error('保存草稿失败！');
                                }
                            }
                            if(type == 2) {
                                if(response.data.opResult === '0') {
                                    this.success('发布成功！');
                                    this.closeFormBox();
                                    emitter.emit('renewCaogaoxiang');
                                }else {
                                    this.error('发布失败！');
                                }
                            }
                            if(type == 3) {
                                if(response.data.opResult === '0') {
                                    this.success('保存草稿成功，请进入个人中心-草稿箱查看');
                                    this.closeFormBox();
                                    emitter.emit('renewCaogaoxiang');
                                }else {
                                    this.error('保存草稿失败！');
                                }
                            }
                        })
                    }else {
                        Axios({
                            method: 'post',
                            url: '/demandAdd',
                            /*params:{  // 一起发送的URL参数
                                page:1
                            },*/
                            data: JSON.stringify(demand),
                            dataType:'json',
                            headers: {
                                'Content-type': 'application/json;charset=utf-8'
                            }
                        }).then((response)=>{
                            if(type == 1 || type == 3) {  // TODO：点击保存草稿  demandprogress=11
                                if(response.data.opResult === '0') {
                                    this.success('保存草稿成功，请进入个人中心-草稿箱查看');
                                    this.setState({
                                        showSaveOrNot: false,
                                        saveDraftId: response.data.demandId,
                                        alertShow: false,
                                    });
                                    this.closeFormBox();
                                    emitter.emit('renewCaogaoxiang');
                                }else {
                                    this.error('保存失败！');
                                }
                            }else if(type == 2) {
                                if(response.data.opResult === '0') {
                                    this.success('发布成功！');
                                    this.closeFormBox();
                                    emitter.emit('renewCaogaoxiang');
                                }else {
                                    this.error('发布失败！');
                                }
                            }
                        })
                    }
                })
            }else {
                demand.demandprogress = '';  // 航线需求发布
                this.setState({
                    noMsgFabu: true,
                }, ()=>{
                    //TODO:请求需要渲染的数据，保存草稿：第一次--demandAdd，第二次--demandUpdate
                    if(this.state.saveDraftId != '' && this.state.saveDraftId != null) {
                        demand.id = this.state.saveDraftId;
                        try{
                            demand.releasetime = this.props.data.releasetime;
                        }catch (e) {

                        }
                        Axios({
                            method: 'post',
                            url: '/demandUpdate',
                            /*params:{  // 一起发送的URL参数
                                page:1
                            },*/
                            data: JSON.stringify(demand),
                            dataType:'json',
                            headers: {
                                'Content-type': 'application/json;charset=utf-8'
                            }
                        }).then((response)=>{
                            this.setState({
                                noMsgFabu: false,
                            });
                            if(type == 1) {
                                if(response.data.opResult === '0') {
                                    this.success('保存草稿成功，请进入个人中心-草稿箱查看');
                                    this.props.renewData();
                                    this.setState({
                                        alertShow: false,
                                    });
                                    emitter.emit('renewCaogaoxiang');
                                }else {
                                    this.error('保存草稿失败！');
                                }
                            }
                            if(type == 2) {
                                if(response.data.opResult === '0') {
                                    this.success('发布成功！');
                                    this.closeFormBox();
                                    emitter.emit('renewCaogaoxiang');
                                }else {
                                    this.error('发布失败！');
                                }
                            }
                            if(type == 3) {
                                if(response.data.opResult === '0') {
                                    this.success('保存草稿成功，请进入个人中心-草稿箱查看');
                                    this.closeFormBox();
                                    emitter.emit('renewCaogaoxiang');
                                }else {
                                    this.error('保存草稿失败！');
                                }
                            }
                        })
                    }else {
                        Axios({
                            method: 'post',
                            url: '/demandAdd',
                            /*params:{  // 一起发送的URL参数
                                page:1
                            },*/
                            data: JSON.stringify(demand),
                            dataType:'json',
                            headers: {
                                'Content-type': 'application/json;charset=utf-8'
                            }
                        }).then((response)=>{
                            this.setState({
                                noMsgFabu: false,
                            });
                            if(type == 1 || type == 3) {  // TODO：点击保存草稿  demandprogress=11
                                if(response.data.opResult === '0') {
                                    this.success('保存成功！');
                                    this.setState({
                                        showSaveOrNot: false,
                                        saveDraftId: response.data.demandId,
                                        alertShow: false,
                                    });
                                    emitter.emit('renewCaogaoxiang');
                                }else {
                                    this.error('保存失败！');
                                }
                            }else if(type == 2) {
                                if(response.data.opResult === '0') {
                                    this.success('发布成功！');
                                    this.closeFormBox();
                                    emitter.emit('renewCaogaoxiang');
                                }else {
                                    this.error('发布失败！');
                                }
                            }
                        })
                    }
                })
            }
        }
    }
    setDataFn(data) {
        if(Object.keys(data).length != 0) {
            let textNum = 0;  // TODO：自己添加的“保存草稿的id”
            if(data.remark) {  // 其他说明字数
                textNum = data.remark.length;
            }
            this.setState({
                saveDraftId: data.id,  // 保存草稿成功后返回的id
                fltNbr: data.fltNbr,  // 航班号
                contact: data.contact,  // 联系人
                iHome: data.iHome,  // 联系方式
                remark: data.remark,  // 其他说明
                textNum: textNum,  // 其他说明字数
            })
        }
    }
    componentWillReceiveProps(nextProps) {  // TODO: initData
        this.setDataFn(nextProps.data);
    }
    componentDidMount() {
        this.setDataFn(this.props.data);
        let clientWidth = document.documentElement.clientWidth;  // 8.06 新增，1366分辨率下，样式改变
        let isSmall = false;
        if(clientWidth <= 1366) {
            isSmall = true;
        }else {
            isSmall = false;
        }
        this.setState({
            isSmall,
            myHeight: document.body.clientHeight - 130,
            contact: store.getState().role.concat,  // 联系人
            iHome: store.getState().role.phone,  // 联系方式
        })
    }
    render() {
        // 航班号警告
        let fltNbrWarn = <div style={{position: 'absolute', top: '40px', left: '-55px', color: 'red'}}>
            请输入正确的航班号！
        </div>;
        // 联系方式警告
        let iHomeWarn = <div style={{position: 'absolute', top: '40px', left: '-55px', color: 'red'}}>
            请输入正确的联系方式！
        </div>;
        // 联系人警告
        let contactWarn = <div style={{position: 'absolute', top: '40px', left: '-55px', color: 'red'}}>
            请输入联系人！
        </div>;
        return (
            <div className={`scroll ${styles['airline-need']}`} style={{height: this.state.myHeight}}>
                {
                    this.state.showSaveOrNot && <SaveOrNot
                        save={this.saveOrNotSaveFn.bind(this)}
                        cancel={this.saveOrNotCancelFn.bind(this)} />
                }
                <h2>我有航线需要运营托管!</h2>
                <span className={`${'iconfont'} ${styles['closeIcon']}`}
                      onClick={this.closeFn.bind(this)}>&#xe62c;</span>
                <div className={`${styles['eighth']} ${styles['flex']}`}>
                    <div className={`${styles['col-box']} ${styles['screen-change-target']}`} style={{background: '#F6F6F6'}}>
                        <div className={styles['col-text']}>航班号</div>
                        <div className={styles['col-input']}>
                            <input type="text"
                                   style={this.state.isSmall ? {width: '110px'} : {width: '155px'}}
                                   maxLength={'10'}
                                   placeholder={'请输入航班号'}
                                   value={this.state.fltNbr}
                                   onChange={this.fltNbrChangeFn.bind(this)} />
                            {
                                this.state.fltNbrWarnShow && fltNbrWarn
                            }
                        </div>
                    </div>
                    <div className={`${styles['col-box']} ${styles['screen-change-target']}`} style={{background: '#F6F6F6'}}>
                        <div className={styles['col-text']}>联系人</div>
                        <div className={styles['col-input']}>
                            <input type="text"
                                   style={this.state.isSmall ? {width: '110px'} : {width: '155px'}}
                                   value={this.state.contact}
                                   maxLength="20"
                                   onFocus={this.contactFocusFn.bind(this)}
                                   onChange={this.contactChangeFn.bind(this)} />
                            {
                                this.state.contactWarnShow && contactWarn
                            }
                        </div>
                    </div>
                    <div className={styles['col-box']} style={{background: '#F6F6F6'}}>
                        <div className={styles['col-text']}>移动电话</div>
                        <div className={styles['col-input']}>
                            <input type="text" style={{width: '144px'}}
                                   maxLength={'20'}
                                   value={this.state.iHome}
                                   onChange={this.iHomeChangeFn.bind(this)}
                                   onBlur={this.iHomeBlurFn.bind(this)} />
                            {
                                this.state.iHomeWarnShow && iHomeWarn
                            }
                        </div>
                    </div>
                </div>
                <div className={`${styles['seventh']} ${styles['flex']}`}>
                    其他说明
                    <textarea className={styles['text-area']} maxLength="200"
                              value={this.state.remark}
                              onKeyDown={(e) => {if(e.keyCode == 13) e.preventDefault()}}
                              onChange={this.textChangeFn.bind(this)}></textarea>
                    <span className={styles['row-border']} style={{top: '26px'}}></span>
                    <span className={styles['row-border']} style={{top: '52px'}}></span>
                    <span className={styles['row-border']} style={{top: '78px'}}></span>
                    <span className={styles['row-border']} style={{top: '104px'}}></span>
                    <span className={styles['row-border']} style={{top: '130px'}}></span>
                    <span className={styles['row-border']} style={{top: '156px'}}></span>
                    <span style={{position: 'absolute', bottom: '5px', right: '25px'}}>{this.state.textNum}/200</span>
                </div>
                <div className={`${styles['escroe-buttons']} ${styles['flex']}`}>
                    <div>
                        <Btn text='保存草稿'
                             btnType="0"
                             otherText="保存中"
                             isDisable={this.state.noMsgCaogao}
                             styleJson={{ width: "100px",padding:0 }}
                             onClick={()=>{ this.sendDataFn(1)} } />
                    </div>
                    {/*<div className={'btn-w'} style={{width: '100px'}} onClick={this.sendDataFn.bind(this, 1)}>保存草稿</div>*/}
                    <div>
                        <Btn text='确认发布运营托管'
                             btnType="1"
                             otherText="发布中"
                             isDisable={this.state.noMsgFabu}
                             styleJson={{ width: "250px" }}
                             onClick={()=> { this.sendDataFn(2)} } />
                    </div>
                    {/*<div className={'btn-b'} style={{width: '250px'}} onClick={this.sendDataFn.bind(this, 2)}>确认发布运营托管</div>*/}
                    <div className={'btn-w'} style={{width: '100px', height: '32px', padding: '6px 20px'}} onClick={this.closeFn.bind(this)}>取消</div>
                </div>
            </div>
        )
    }
}
