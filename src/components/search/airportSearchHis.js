import React, {Component} from 'react';
import {hot} from 'react-hot-loader';
import {conversions,conversionsCity,conversionsCompany} from '../../static/js/conversions';
import {store} from "../../store/index";
import styles from '../../static/css/nav/search.scss'

let airportList = null; // 将获取到的数据处理成我想要的数据
let myCityList = null; // 将获取到的数据处理成我想要的数据
export default class AirportSearchHis extends Component {
    constructor(props) {
        super(props);
        airportList = conversions(store.getState().airList); // 将获取到的数据处理成我想要的数据
        myCityList = conversionsCity(store.getState().cityList); // 将获取到的数据处理成我想要的数据
        this.state = {
            list: [],
        };
    }
    build() {
        let ar = [];
        airportList.forEach((val)=>{
            let st = this.props.searchText;   // 输入名字
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
        /*myCityList.forEach((val)=>{
            let st = this.props.searchText;   // 输入名字
            if(st != ''){
                let airportName = val.cityName;  // 机场名字
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
                        name:val.cityName,
                        type:2
                    });
                }else if(code.search(regx) != -1){
                    let reg = new RegExp(st,"gmi");
                    let aName = code.replace(reg,"<span "+style+">"+st.toLocaleUpperCase()+"</span>");
                    ar.push({
                        testName:val.cityName,
                        testCode:aName,
                        code:val.cityIcao,
                        name:val.cityName,
                        type:2
                    });
                }else if(py.search(regx) != -1){
                    let reg = new RegExp(st,"gmi");
                    let aName = py.replace(reg,"<span "+style+">"+st.toLocaleLowerCase()+"</span>");
                    ar.push({
                        testName:val.cityName,
                        testCode:aName,
                        code:val.cityIcao,
                        name:val.cityName,
                        type:2
                    });
                }else if(pinyin.search(regx) != -1){
                    let reg = new RegExp(st,"gmi");
                    let aName = pinyin.replace(reg,"<span "+style+">"+st.toLocaleLowerCase()+"</span>");
                    ar.push({
                        testName:val.cityName,
                        testCode:aName,
                        code:val.cityIcao,
                        name:val.cityName,
                        type:2
                    });
                };
            }else{
                ar.push({
                    testName:val.cityName,
                    testCode:val.cityIcao,
                    code:val.cityIcao,
                    name:val.cityName,
                    type:2
                });
            }
        });*/
        return ar;
    }
    resData(val) {
        let le = localStorage.getItem('hisyData');
        let hisyData = (le == null ? '[]' : le);
        hisyData = JSON.parse(hisyData);
        let tx = true;
        hisyData.forEach((v) => {
            if(v.name == val.name) {
                tx = false;
            }
        });
        if(tx) {
            hisyData.push(val);
        }
        localStorage.setItem('hisyData', JSON.stringify(hisyData));
        this.props.resData(val);
    }
    componentDidMount() {
        this.build()
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

