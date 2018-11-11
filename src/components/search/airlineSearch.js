import React, {Component} from 'react';
import {hot} from 'react-hot-loader';
import {conversions,conversionsCity,conversionsCompany} from '../../static/js/conversions';
import styles from '../../static/css/nav/search.scss'
import {store} from "../../store/index";

let airportList = null;
export default class AirportSearch extends Component {
    constructor(props) {
        super(props);
        airportList = conversionsCompany(store.getState().companyList);
        this.state = {
            list: [],
        };
    }
    resData(val) {
        this.props.resData(val);
    }
    build() {
        let ar = [];
        airportList.forEach((val)=>{
            let st = this.props.searchText;   // 输入名字
            if(st != ''){
                try{
                    let companyName = val.companyName;  // 机场名字
                    let code3 = val.companyIcao;  // 三字码
                    let code = val.companyIata;  // 二字码
                    let pinyin = val.pinyin; // 拼音
                    let py = val.py; // 拼音首字母
                    let regx = new RegExp(st,"gmi");
                    let style = "style='color: #3c78ff'";
                    if(companyName.search(regx) != -1){
                        let reg = new RegExp(st,"gmi");
                        let aName = companyName.replace(reg,"<span "+style+">"+st+"</span>");
                        if(st == companyName){
                            aName = companyName;
                        }else{
                            aName = companyName.replace(reg,"<span "+style+">"+st+"</span>");
                        }
                        ar.push({
                            testName:aName,
                            testCode:val.companyIata,
                            code3:val.companyIcao,
                            code:val.companyIata,
                            name:val.companyName,
                            id: val.id,
                            type:2
                        });
                    }else if(code.search(regx) != -1){
                        let reg = new RegExp(st,"gmi");
                        let aName = code.replace(reg,"<span "+style+">"+st.toLocaleUpperCase()+"</span>");
                        ar.push({
                            testName:val.companyName,
                            testCode:aName,
                            code3:val.companyIcao,
                            code:val.companyIata,
                            name:val.companyName,
                            id: val.id,
                            type:2
                        });
                    }else if(py.search(regx) != -1){
                        let reg = new RegExp(st,"gmi");
                        let aName = py.replace(reg,"<span "+style+">"+st.toLocaleLowerCase()+"</span>");
                        ar.push({
                            testName:val.companyName,
                            testCode:aName,
                            code3:val.companyIcao,
                            code:val.companyIata,
                            name:val.companyName,
                            id: val.id,
                            type:2
                        });
                    }else if(pinyin.search(regx) != -1){
                        let reg = new RegExp(st,"gmi");
                        let aName = pinyin.replace(reg,"<span "+style+">"+st.toLocaleLowerCase()+"</span>");
                        ar.push({
                            testName:val.companyName,
                            testCode:aName,
                            code3:val.companyIcao,
                            code:val.companyIata,
                            name:val.companyName,
                            id: val.id,
                            type:2
                        });
                    };
                }catch(e) {

                }
            }else{
                ar.push({
                    testName:val.companyName,
                    testCode:val.companyIata,
                    code3:val.companyIcao,
                    code:val.companyIata,
                    name:val.companyName,
                    id: val.id,
                    type:2
                });
            }
        });
        return ar;
    }
    componentDidMount() {
        this.build();
    }
    shouldComponentUpdate() {
        if(this.props.update) {
            return false
        }else {
            return true
        }
    }
    render() {
        return (
            <div className="scroll" style={this.props.axis}>
                {
                    this.build().map((val, index) => {
                        return (
                            <div className={styles['item']} style={this.props.item ? this.props.item : {}} key={index} onClick={this.resData.bind(this, val)}>
                                <div className={styles['item-imm']}
                                     dangerouslySetInnerHTML={{__html: val.testName}}></div>
                                <div className={styles['item-dynamics']}
                                     dangerouslySetInnerHTML={{__html: val.testCode}}></div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

