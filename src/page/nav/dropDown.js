import React, { Component } from 'react';
import emitter from '../../utils/events';
import NavDropDown from '../../components/navDropDown/navDropDown';

export default class DropDown extends Component{
    constructor(props){
        super(props);
        this.state={
            className:[props.cName]
        }
    }
    //TODO: 处理角色切换事件
    handleRoleSelect(text){
        emitter.emit('itemClick',text);
    }
    itemMethod=(type,text)=>{
        switch(type){
            case 'roleSelect':
                this.handleRoleSelect(text);
                break;
            case 'lineMeasure':
                // _this.test();
                break;
            default:
                break;
        }
    }
    createDropDownList=()=>{
        return this.props.data ? this.props.data.map((item,index)=>{
            return (<li key={index}>
                <NavDropDown
                    itemMethod={(type,text)=>{
                        if(item.fun != undefined){item.fun.call(this);}
                        return this.itemMethod(type,text);
                    }}
                    item={item}/>
            </li>)
        }) : "";
    }
    render(){
        return (
            <div className={this.props.className}>
                <div>
                    <ul>
                        {this.createDropDownList()}
                    </ul>
                </div>
            </div>
        )
    }
}
