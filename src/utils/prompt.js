import React, { Component } from 'react';

export default class Prompt extends Component{
    constructor(props){
        super(props);
        this.state = {
            style:this.props.hasOwnProperty("style") ? this.props["style"] : {},
            data:[props.children],
            tip:""
        }
    }
    componentWillMount(){

    }
    tip(t){
        this.setState({
            tip:t
        })
    }
    render(){
        return(
           <div style={style["box"]}>
               {
                   this.state.data.map((d,i)=>{
                       return (
                           <div key={i}>
                               {d}
                           </div>
                       );
                   })
               }
               <div style={this.state.style} className={"prompt"}>{this.state.tip}</div>
           </div>
        )
    }
}

const style = {
    box:{
        position:"relative"
    }
};
