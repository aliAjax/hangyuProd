// author:wangli time:2018-06-17 content:运力发布表单-目标省份模块
import React, { Component } from "react";
import style from "../../static/css/targetArea/targetArea.scss";

export default class ProvinceSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            regType: "",//匹配模式
            newList: [],//显示的下拉列表
            searchText: "",//正则匹配条件
            provinceList: [//省份数据
                // { name: "北京市", spell: "bjs", eName: "beijingshi" },
                // { name: "天津市", spell: "tjs", eName: "tianjinshi" },
                // { name: "河北省", spell: "hbs", eName: "heibeisheng" },
                // { name: "山西省", spell: "sxs", eName: "shanxisheng" },
                // { name: "内蒙古", spell: "nmg", eName: "neimenggu" },
                // { name: "辽宁省", spell: "lns", eName: "liaoningsheng" },
                // { name: "吉林省", spell: "jls", eName: "jilinsheng" },
                // { name: "黑龙江省", spell: "hljs", eName: "heilongjiangsheng" },
                // { name: "上海市", spell: "shs", eName: "shanghaishi" },
                // { name: "江苏省", spell: "jss", eName: "jiansusheng" },
                // { name: "浙江省", spell: "zjs", eName: "zhejiangsheng" },
                // { name: "安徽省", spell: "ahs", eName: "anhuisheng" },
                // { name: "福建省", spell: "fjs", eName: "fujiansheng" },
                // { name: "江西省", spell: "jxs", eName: "jiangxisheng" },
                // { name: "山东省", spell: "sds", eName: "shandongsheng" },
                // { name: "河南省", spell: "hns", eName: "henansheng" },
                // { name: "湖北省", spell: "hbs", eName: "hubeisheng" },
                // { name: "湖南省", spell: "hns", eName: "hunansheng" },
                // { name: "广东省", spell: "gds", eName: "guangdongsheng" },
                // { name: "广西", spell: "jx", eName: "jiangxi" },
                // { name: "海南省", spell: "hns", eName: "hainansheng" },
                // { name: "重庆市", spell: "cqs", eName: "chongqingshi" },
                // { name: "四川省", spell: "scs", eName: "sichuansheng" },
                // { name: "贵州省", spell: "gzs", eName: "guizhousheng" },
                // { name: "云南省", spell: "yns", eName: "yunnansheng" },
                // { name: "西藏", spell: "xz", eName: "xizang" },
                // { name: "陕西省", spell: "sxs", eName: "shanxisheng" },
                // { name: "甘肃省", spell: "gss", eName: "gansusheng" },
                // { name: "青海省", spell: "qhs", eName: "qinghaisheng" },
                // { name: "宁夏", spell: "nxs", eName: "ningxiasheng" },
                // { name: "新疆", spell: "xj", eName: "xinjiang" },//以上是省份
            ]
        }
    }

    componentWillReceiveProps(nextProps) {
        let searchText = nextProps.searchText;
        let provinceList = this.state.provinceList;
        let newList = [];
        let regType = this.state.regType;
        if (searchText != "" || searchText != this.state.searchText) {//通过用户输入匹配出付合的省份
            searchText = searchText.toLocaleLowerCase();
            let provinceReg = new RegExp(searchText);
            for (let i = 0; i < provinceList.length; i++) {
                if (provinceReg.test(provinceList[i].name)) {
                    regType = "";
                    newList.push(provinceList[i])
                } else if (provinceReg.test(provinceList[i].spell)) {
                    regType = "spell";
                    newList.push(provinceList[i])
                } else if (provinceReg.test(provinceList[i].eName)) {
                    regType = "eName";
                    newList.push(provinceList[i])
                }
            };
        };
        this.setState({
            newList,
            regType,
            searchText
        })
    }

    componentWillMount() {
        let provinceList = this.props.allProvinceList;
        let searchText = this.props.searchText;
        let newList = [];
        let regType = this.state.regType;
        if (searchText != "" || searchText != this.state.searchText) {//通过用户输入匹配出付合的省份
            searchText = searchText.toLocaleLowerCase();
            let provinceReg = new RegExp(searchText);
            for (let i = 0; i < provinceList.length; i++) {
                if (provinceReg.test(provinceList[i].name)) {
                    regType = "";
                    newList.push(provinceList[i])
                } else if (provinceReg.test(provinceList[i].spell)) {
                    regType = "spell";
                    newList.push(provinceList[i])
                } else if (provinceReg.test(provinceList[i].eName)) {
                    regType = "eName";
                    newList.push(provinceList[i])
                }
            };
        };
        this.setState({
            newList,
            regType,
            searchText,
            provinceList
        })
    }

    //返回父组件选择值
    click(data) {//data:选中的省份
        this.props.returnData(data)
    }

    //模糊匹配方法
    build() {

    }

    render() {
        let newList = this.state.newList;
        let regType = this.state.regType;
        let eNameStyle, spellStyle;
        if (regType == "spell") {//spell 是简拼
            eNameStyle = style['noShow']
        } else if (regType == "eName") {
            spellStyle = style['noShow']
        } else {
            eNameStyle = style['noShow'];
            spellStyle = style['noShow']
        };
        return (
            <div className="scroll" style={this.props.axis}>
                {
                    newList.map((item, index) => {
                        let styleSpan = "style='color: #3c78ff'";
                        let eName = item.eName.replace(this.state.searchText, "<span " + styleSpan + ">" + this.state.searchText + "</span>");
                        let spell = item.spell.replace(this.state.searchText, "<span " + styleSpan + ">" + this.state.searchText + "</span>");
                        return (
                            <div className={style['indexBox']} key={index} onClick={this.click.bind(this, item.name)}>
                                <div>{item.name}</div>
                                <div className={`${eNameStyle} ${style["last"]}`} dangerouslySetInnerHTML={{ __html: eName }}></div>
                                <div className={`${spellStyle} ${style["last"]}`} dangerouslySetInnerHTML={{ __html: spell }}></div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}