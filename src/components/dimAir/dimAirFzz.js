import React, { Component, Fragment } from "react";
import { store } from "../../store";
import style from '../../static/css/fromBox/capacityRelease.scss';
export default class DimAirFzz extends Component {
    constructor(props) {
        super(props);
        this.state={
            air:[],//机型全部数据
            aircrfttyp:"",//已选机型
            aircrfttypShowType:false,//是否显示下拉框
            aircrfttypBox:[],//机型可选数据
            aircrfttypTypeSearchText:"",//输入框输入的筛选条件
            aircrfttypTypeSearch:"",//用户输入值
        }
    }

    componentWillMount() {  // 将要渲染
        let air=store.getState().air;
        this.setState({
            air
        })
     }

    componentWillReceiveProps(nextProps){
        this.airTypeInput.value=nextProps.defaultData?nextProps.defaultData:this.state.aircrfttypTypeSearch;
        this.setState({
            aircrfttyp:nextProps.defaultData
        })
    }

    aircrfttypOnFocus() {//拟飞机型焦点事件
        let air = this.state.air;
        let aircrfttypBox = [];
        let listReg = new RegExp(this.airTypeInput.value.toUpperCase());
        for (let i = 0; i < this.state.air.length; i++) {
            if (listReg.test(air[i])) {
                aircrfttypBox.push(air[i])
            }
        };
        this.setState({
            aircrfttypShowType: true,
            aircrfttypBox
        })
    }

    aircrfttypOnBlur() {//拟飞机型失去焦点事件
        setTimeout(() => {
            this.setState({
                aircrfttypShowType: false
            })
        }, 150);
        this.props.dimEvent(this.state.aircrfttyp)
    }

    changeAir() {//拟飞机型模糊查询事件
        let air = this.state.air;
        let aircrfttypBox = [];
        let listReg = new RegExp(this.airTypeInput.value.toUpperCase());
        for (let i = 0; i < this.state.air.length; i++) {
            if (listReg.test(air[i])) {
                aircrfttypBox.push(air[i])
            }
        };
        this.setState({
            aircrfttyp: "",
            aircrfttypBox,
            aircrfttypTypeSearchText: this.airTypeInput.value.toUpperCase(),
            aircrfttypTypeSearch: this.airTypeInput.value,
        })
    }

    //向父组件返回已选机型
    aircrfttypEvent(item){
        this.airTypeInput.value=item;
        this.setState({
            aircrfttyp:item
        });
        this.props.dimEvent(item);
    }

    render() {
        let aircrfttypBoxStyle = this.state.aircrfttypShowType ? `${style['airTypeBox']} ${style['airTypeBox-fzz']}` : style['hidden'];
        return (
          <Fragment>
              <input className={`${style['capacity-release-input-hover']} ${style['capacity-release-input-hover-fzz']}`}
                     ref={(data) => this.airTypeInput = data}
                     onFocus={this.aircrfttypOnFocus.bind(this)}
                     onBlur={this.aircrfttypOnBlur.bind(this)}
                     onChange={this.changeAir.bind(this)}
                     maxLength="8"
                     placeholder="请选择适航机型" />
              <div className={`scroll box-show ${aircrfttypBoxStyle}`} style={{top: '40px', left: '0'}}>
                  {this.state.aircrfttypBox.map((item, index) => {
                      let styleSpan = "style='color: #3c78ff'";
                      let airText = item.replace(this.state.aircrfttypTypeSearchText, "<span " + styleSpan + ">" + this.state.aircrfttypTypeSearchText + "</span>")
                      return <div key={index} onClick={this.aircrfttypEvent.bind(this,item)} title={item} dangerouslySetInnerHTML={{ __html: airText }}></div>
                  })}
              </div>
          </Fragment>
        )
    }
}