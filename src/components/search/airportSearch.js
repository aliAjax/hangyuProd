import React, {Component} from 'react';
import {hot} from 'react-hot-loader';
import {conversions,conversionsCity,conversionsCompany} from '../../static/js/conversions';
import styles from '../../static/css/nav/search.scss'
import {store} from "../../store/index";

let airportList = null;
export default class AirportSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
        };
    }
    resData(val) {
        this.props.resData(val);
    }
    build() {
        let ar = [];
        let st = this.props.searchText ? this.props.searchText : '';   // 输入名字
        airportList && airportList.forEach((val)=>{
            if(st != ''){
                try{
                    let airportName = val.cityName;  // 机场名字
                    let code = val.code;  // 三字码
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
                            testCode:val.code,
                            code:val.code,
                            name:val.cityName,
                            id: val.allData.id, // 返回机场id
                            type:0
                        });
                    }else if(code.search(regx) != -1){
                        let reg = new RegExp(st,"gmi");
                        let aName = code.replace(reg,"<span "+style+">"+st.toLocaleUpperCase()+"</span>");
                        ar.push({
                            testName:val.cityName,
                            testCode:aName,
                            code:val.code,
                            name:val.cityName,
                            id: val.allData.id, // 返回机场id
                            type:0
                        });
                    }else if(py.search(regx) != -1){
                        let reg = new RegExp(st,"gmi");
                        let aName = py.replace(reg,"<span "+style+">"+st.toLocaleLowerCase()+"</span>");
                        ar.push({
                            testName:val.cityName,
                            testCode:aName,
                            code:val.code,
                            name:val.cityName,
                            id: val.allData.id, // 返回机场id
                            type:0
                        });
                    }else if(pinyin.search(regx) != -1){
                        let reg = new RegExp(st,"gmi");
                        let aName = pinyin.replace(reg,"<span "+style+">"+st.toLocaleLowerCase()+"</span>");
                        ar.push({
                            testName:val.cityName,
                            testCode:aName,
                            code:val.code,
                            name:val.cityName,
                            id: val.allData.id, // 返回机场id
                            type:0
                        });
                    };
                }catch(e) {

                }
            }else{
                ar.push({
                    testName:val.cityName,
                    testCode:val.code,
                    code:val.code,
                    name:val.cityName,
                    id: val.allData.id, // 返回机场id
                    type:0
                });
            }
        });
        return ar;
    }
    qiangzhizhixing() {  // 9.20 更新，解决下拉框数据想通问题
        if((this.props.qiangzhizhixing == 1) && this.props.areaType && this.props.provinceOrArea) {  // 8.16新增，根据省份、区域进行筛选
            let qiangzhiArr = [];
            let areaType = Number(this.props.areaType);
            let provinceOrArea = this.props.provinceOrArea;
            switch (areaType){  // 2-省份，3区域
                case 2:
                    store.getState().airList.forEach((val)=>{
                        if(val.province == provinceOrArea) {
                            qiangzhiArr.push(val);
                        }
                    });
                    break;
                case 3:
                    store.getState().airList.forEach((val)=>{
                        if(val.airportArea == provinceOrArea) {
                            qiangzhiArr.push(val);
                        }
                    });
                    break;
            }
            airportList = conversions(qiangzhiArr);
        }else {
            airportList = conversions(store.getState().airList);
        }
    }
    componentWillMount() {  // 9.20 更新，解决下拉框数据想通问题
        this.qiangzhizhixing();
    }
    componentDidMount() {
        this.build();
    }
    componentWillReceiveProps() {  // 9.20 更新，解决下拉框数据想通问题
        this.qiangzhizhixing();
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

