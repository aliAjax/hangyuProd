import React,{Component} from 'react';
import classNames from 'classnames';
import Prompt from './../../../utils/prompt';
import style from './payPwd.scss';
import styles from '../../../static/css/components/dealPwd.scss'
import stylerRed from './../../../static/css/loginAndRegister/registered.scss';


export default class SetPwd extends Component{
    constructor(props){
        super(props);
        this.state = {
            steps:0,
            pwdLength: 0,  // 输入的密码长度
            pwdValue: '',  // 输入的密码
        }
    }
    componentDidMount(){
        this.ulClickFn();
    }
    validationGS(){
        if(this.state.pwdLength === 6){
            this.refs["inputYZM"].tip("");
            this.props.pas(this.state.pwdValue);
            this.props.modelm(2);
        }else{
            this.refs["inputYZM"].tip("请输入交易密码");
        }
    }
    close(){
        this.props.changeModel('');
    }
    inputChangeFn(e) {
        e.target.value = e.target.value.replace(/\D/g,'');
        this.setState({
            pwdLength: e.target.value.length,
            pwdValue: e.target.value,
        })
    }
    ulClickFn() {
        this.refs.pwd.focus();
    }
    sets(){
        return(
            <div>
                <div style={{lineHeight:"24px"}}>请输入6位交易密码</div>
                <div className={style["input-list"]}>
                    <input ref="pwd"
                           style={{position: 'absolute', top: '-9999px'}}
                           type="text"
                           onBlur={this.ulClickFn.bind(this)}
                           maxLength="6"
                           disabled={this.state.isLocked}
                           onChange={this.inputChangeFn.bind(this)}/>
                    <div>
                        <div className={styles['first']}>
                            <ul className={`${styles['ul-style']} ${this.state.isLocked ? styles['isLocked'] : ''}`} onClick={this.ulClickFn.bind(this)}>
                                <li className={classNames({[styles["set-c"]]:(this.state.pwdLength === 1 || this.state.pwdLength === 0)})}>{this.state.pwdLength >= 1 && '*'}</li>
                                <li className={classNames({[styles["set-c"]]:this.state.pwdLength === 2})}>{this.state.pwdLength >= 2 && '*'}</li>
                                <li className={classNames({[styles["set-c"]]:this.state.pwdLength === 3})}>{this.state.pwdLength >= 3 && '*'}</li>
                                <li className={classNames({[styles["set-c"]]:this.state.pwdLength === 4})}>{this.state.pwdLength >= 4 && '*'}</li>
                                <li className={classNames({[styles["set-c"]]:this.state.pwdLength === 5})}>{this.state.pwdLength >= 5 && '*'}</li>
                                <li className={classNames({[styles["set-c"]]:this.state.pwdLength === 6})}>{this.state.pwdLength == 6 && '*'}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <Prompt ref='inputYZM' style={{top:"-22px"}}>
                    <div className={stylerRed['stylerRed-btn']} style={{"padding":0,marginTop:"63px"}}>
                        <div className={classNames({"may-btn":true})} ref={'resetPwd'} onClick={this.validationGS.bind(this)}>下一步</div>
                        <div className={classNames({"may-btn-gary":true})} onClick={this.close.bind(this)}>取消</div>
                    </div>
                </Prompt>
            </div>
        )
    }
    rendm(){
        switch (this.state.steps){
            case 0:
                return this.sets();
                break;
        }
    }
    render(){
        return(
            <div ref={"pasSet"} style={{position:"relative"}} className={classNames({[style["input-box"]]:true})}>
                {this.rendm()}
                <div style={{width:"280px",textAlign:'center',height:'30px',bottom:"0px",position:"absolute"}}>客服电话：028-65733800</div>
            </div>
        )
    }
}