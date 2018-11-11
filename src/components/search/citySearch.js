import React, {Component} from 'react';
import {hot} from 'react-hot-loader';
import {conversions,conversionsCity,conversionsCompany} from '../../static/js/conversions';
import {store} from "../../store/index";
import styles from '../../static/css/nav/search.scss'

let cityList = null;
export default class CitySearch extends Component {
    constructor(props) {
        super(props);
        cityList = conversionsCity(store.getState().cityList);
        this.state = {
            list: [],
        };
    }
    resData(val) {
        this.props.resData(val);
    }
    build() {
        let ar = [];
        cityList.forEach((val)=>{
            let st = this.props.searchText;   // 输入名字
            if(st != ''){
                try{
                    let airportName = val.cityName;  // 城市名字
                    let code = val.cityIcao;  // 三字码
                    let pinyin = val.pinyin; // 拼音
                    let py = val.py; // 拼音首字母
                    let regx = new RegExp(st,"gmi");
                    let style = "style='color: #3c78ff'";

                    if(airportName.search(regx) != -1){
                        let reg = new RegExp(st,"gmi");
                        let aName = airportName.replace(reg,"<span "+style+">"+st+"</span>");
                        if(st == airportName){
                            aName = airportName;
                        }else{
                            aName = airportName.replace(reg,"<span "+style+">"+st+"</span>");
                        }
                        ar.push({
                            testName:aName,
                            testCode:val.cityIcao,
                            code:val.cityIcao,
                            name:val.cityName
                        });
                    }else if(code.search(regx) != -1){
                        let reg = new RegExp(st,"gmi");
                        let aName = code.replace(reg,"<span "+style+">"+st.toLocaleUpperCase()+"</span>");
                        ar.push({
                            testName:val.cityName,
                            testCode:aName,
                            code:val.cityIcao,
                            name:val.cityName
                        });
                    }else if(py.search(regx) != -1){
                        let reg = new RegExp(st,"gmi");
                        let aName = py.replace(reg,"<span "+style+">"+st.toLocaleLowerCase()+"</span>");
                        ar.push({
                            testName:val.cityName,
                            testCode:aName,
                            code:val.cityIcao,
                            name:val.cityName
                        });
                    }else if(pinyin.search(regx) != -1){
                        let reg = new RegExp(st,"gmi");
                        let aName = pinyin.replace(reg,"<span "+style+">"+st.toLocaleLowerCase()+"</span>");
                        ar.push({
                            testName:val.cityName,
                            testCode:aName,
                            code:val.cityIcao,
                            name:val.cityName
                        });
                    };
                }catch(e) {

                }
            }else{
                ar.push({
                    testName:val.cityName,
                    testCode:val.cityIcao,
                    code:val.cityIcao,
                    name:val.cityName
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
                            <div className={styles['item']} key={index} style={this.props.item ? this.props.item : {}} onClick={this.resData.bind(this, val)}>
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

