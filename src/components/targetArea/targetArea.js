// author:wangli time:2018-06-19 content:运力发布表单-目标区域模块
import React, { Component } from "react";
import style from "../../static/css/targetArea/targetArea.scss";

export default class TargetArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            regType: "",//匹配模式
            newList: [],//显示的下拉列表
            searchText: "",//正则匹配条件
            areaList: [//区域数据
                // { name: "华东地区", spell: "hddq", eName: "huadongdiqu" },
                // { name: "华中地区", spell: "hzdq", eName: "huazhongdiqu" },
                // { name: "华北地区", spell: "hbdq", eName: "huabeidiqu" },
                // { name: "华南地区", spell: "hndq", eName: "huanandiqu" },
                // { name: "东北地区", spell: "dbdq", eName: "dongbeidiqu" },
                // { name: "西北地区", spell: "xbdq", eName: "xibeidiqu" },
                // { name: "西南地区", spell: "xndq", eName: "xinandiqu" },//以上是大区
            ]
        }
    }

    componentWillMount() {
        let areaList = this.props.allAreaList;
        // this.setState({
        //     newList: areaList
        // });
        let searchText = this.props.searchText;
        // let areaList = this.state.areaList;
        let newList = [];
        let regType = this.state.regType;
        if (searchText != "" || searchText != this.state.searchText) {//通过用户输入匹配符合条件的区域
            searchText = searchText.toLocaleLowerCase();
            let provinceReg = new RegExp(searchText);
            for (let i = 0; i < areaList.length; i++) {
                if (provinceReg.test(areaList[i].name)) {
                    regType = "";
                    newList.push(areaList[i])
                } else if (provinceReg.test(areaList[i].spell)) {
                    regType = "spell";
                    newList.push(areaList[i])
                } else if (provinceReg.test(areaList[i].eName)) {
                    regType = "eName";
                    newList.push(areaList[i])
                }
            };
        };
        this.setState({
            newList,
            regType,
            searchText,
            areaList
        })
    }

    componentWillReceiveProps(nextProps) {
        let searchText = nextProps.searchText;
        let areaList = this.state.areaList;
        let newList = [];
        let regType = this.state.regType;
        if (searchText != "" || searchText != this.state.searchText) {//通过用户输入匹配符合条件的区域
            searchText = searchText.toLocaleLowerCase();
            let provinceReg = new RegExp(searchText);
            for (let i = 0; i < areaList.length; i++) {
                if (provinceReg.test(areaList[i].name)) {
                    regType = "";
                    newList.push(areaList[i])
                } else if (provinceReg.test(areaList[i].spell)) {
                    regType = "spell";
                    newList.push(areaList[i])
                } else if (provinceReg.test(areaList[i].eName)) {
                    regType = "eName";
                    newList.push(areaList[i])
                }
            };
        };
        this.setState({
            newList,
            regType,
            searchText
        })

    }

    //返回父组件选择值
    click(data) {
        this.props.returnData(data)
    }



    //模糊匹配方法
    build() {
    }

    render() {
        let newList = this.state.newList;
        let regType = this.state.regType;
        let eNameStyle, spellStyle;
        if (regType == "spell") {
            eNameStyle = style['noShow']
        } else if (regType == "eName") {
            spellStyle = style['noShow']
        } else {
            eNameStyle = style['noShow'];
            spellStyle = style['noShow']
        }
        return (
            <div className={`scroll box-show`} style={this.props.axis}>
                {
                    newList.map((item, index) => {
                        let styleSpan = "style='color: #3c78ff'";
                        let eName = item.eName.replace(this.state.searchText, "<span " + styleSpan + ">" + this.state.searchText + "</span>");
                        let spell = item.spell.replace(this.state.searchText, "<span " + styleSpan + ">" + this.state.searchText + "</span>");
                        return (
                            <div className={style['indexBox']} key={index} onClick={this.click.bind(this, item.name)}>
                                <div>{item.name}</div>
                                <div className={eNameStyle} dangerouslySetInnerHTML={{ __html: eName }}></div>
                                <div className={spellStyle} dangerouslySetInnerHTML={{ __html: spell }}></div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}