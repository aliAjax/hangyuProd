import React,{Component} from 'react';
import InputPayPwd from './inputPayPwd';
import SetPwdAg from './setPwdAg';
import SetPwd from './setPwd';
export default class PayPas extends Component{
    constructor(props){
        super(props);
        this.state = {
            type:0,
            pas:""
        }
    }
    model(t){
        switch (this.state.type){
            case 0:
                return <InputPayPwd modelm={this.modelm.bind(this)} changeModel={this.props.changeModel.bind(this)}/>;
                break;
            case 1:
                return <SetPwd modelm={this.modelm.bind(this)} pas={this.pas.bind(this)} changeModel={this.props.changeModel.bind(this)}/>;
                break;
            case 2:
                return <SetPwdAg modelm={this.modelm.bind(this)} pas={this.state.pas} changeModel={this.props.changeModel.bind(this)}/>;
                break;
            default:
                break
        }
    }
    modelm(n){
        this.setState({
            type:n
        })
    }
    pas(pas){
        this.setState({
            pas
        })
    }
    render(){
        return(
            <div>
                {this.model()}
            </div>
        )
    }
}