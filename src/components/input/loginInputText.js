import React, { Component } from 'react';


export default class LoginInputText extends Component{
    constructor(props){
        super(props);
        this.state = {
            placeholder:props.placeholder === undefined ? '' : props.placeholder,
            className:`may-input ${props.className === undefined ? '' : props.className}`,
        };
    }
    middle(e){
        e.target.value = e.target.value.replace(/ /g,'');
        if(this.props.hasOwnProperty('querData')){
            this.props.querData(e);
        }
    }
    componentWillMount(){

    }
    enter(e){
        if(e.keyCode === 13 && this.props.enter !== undefined){
            this.props.enter();
        }
    }
    render(){
        return(
            <input
                defaultValue={this.props.defaultValue === undefined ? '' : this.props.defaultValue}
                ref={this.props.refId === undefined ? '' : this.props.refId}
                onInput={this.middle.bind(this)}
                onBlur={this.middle.bind(this)}
                className={this.state.className}
                placeholder={this.state.placeholder}
                type={this.props.type === undefined ? 'text' : this.props.type}
                maxLength={this.props.maxLength === undefined ? 20 : this.props.maxLength}
                disabled={this.props.disabled === undefined ? false : true}
                onKeyUp={this.enter.bind(this)}
            />
        )
    }
}
