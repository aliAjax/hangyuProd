
import React, { Component } from 'react';
import { Pagination } from 'antd';
import { Spin, Input } from 'antd';
import Axios from './../../utils/axiosInterceptors';
import classNameNames from 'classnames';
import style from './../../static/css/publicOpinion/publicOpinion.scss';
import noimg from './../../static/img/pubo/noimg.png';
const Search = Input.Search;

export default class PublicOpinion extends Component{
    constructor(props){
        super(props);
        this.state = {
            initText: false,
            inputText: this.props.match.params.iata === 'null' ? "" : this.props.match.params.iata,      // 模糊查询的文字
            codeType:this.props.match.params.codeType === 'null' ? 2 : this.props.match.params.codeType,      // 查询的类型
            totalLength: 10,   // 总条数
            current:1,
            list: [],
            nopo:false,
            loading:false,   // 加载中
            oneTime:true
        }
    }
    componentWillMount(){  // 将要渲染

    }
    componentDidMount() {   // 加载渲染完成
        this.resData();
    }
    componentWillReceiveProps(nextProps){  // Props发生改变

    }
    componentWillUnmount(){  // 卸载组件

    }

    custrol(data) {
        if (data.opResult == "0") {
            if (data.obj != undefined && data.obj != null && data.obj[0].length != 0) {
                this.totalLength = Number(data.obj[0].articleCount);
                let arr = [];
                data.obj.forEach((val) => {
                    arr.push({
                        img: val.articleImage == "" ? noimg : val.articleImage,
                        title: val.articleTitle,
                        text: val.articleContent,
                        from: val.articleFrom,
                        time: val.articleTime,
                        src: val.articleUrl
                    })
                });
                let totalLength = 0;
                if( data.obj.length > 0){
                    totalLength = Number(data.obj[0].articleCount);
                };
                this.setState(()=>{
                   return{
                       list:arr,
                       totalLength
                   }
                });
            }
        }else if(data.opResult == "1"){
            this.state.list = [];
        };
        if(this.state.list.length == 0){
            this.state.nopo = true;
        }else{
            this.state.nopo = false;
        }
    }
    resData(pageNumber = 1) {
        this.setState({
            loading:true,
            current:pageNumber
        });
        Axios({
            method: 'post',
            url: '/getPublicOpinionList',
            params: {
                code: this.state.inputText,
                type: this.state.inputText == "" ? 1 : 0,
                codeType: this.state.codeType,
                page: pageNumber
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        })
            .then((response) => {
                this.custrol(response.data);
                this.setState({
                    loading:false,
                    oneTime:false
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    loading:false,
                    oneTime:false
                });
                }
            );
    }
    changeImg(i){
        this.setState((data)=>{
            let list = [...data.list];
            list[i].src = noimg;
            return {
                list
            }
        },function () {
            if(this.state.list.length > 0){
                this.setState({
                    oneTime:true
                })
            }
        })
    }
    renderTemplate(){
        let n = '';
        if(!this.state.loading){
            if(this.state.list.length > 0){
               n =  <div className={style["box"]}>
                       {
                           this.state.list.map((key,i)=>{
                               return (
                                   <div className={style["item"]} key={i}>
                                       <div className={style["item-img"]}><img src={key.img} onError={this.changeImg.bind(this,i)}/></div>
                                       <div className={style["item-nr"]}>
                                           <div className={style["item-title"]}>
                                               <h5><a href={key.src} target="_blank">{key.title}</a></h5>
                                               {/*<div className={style["item-class"]}>*/}
                                                   {/*<span>舆情类型</span>*/}
                                               {/*</div>*/}
                                           </div>
                                           <p>{key.text}</p>
                                           <div className={style["item-time"]}>
                                               <span>{key.from}</span>{key.time}
                                           </div>
                                       </div>
                                   </div>
                               )
                           })
                       }
                   </div>
            }else{
                if(!this.state.oneTime){
                    n = <div className={style["no-item"]}>没有匹配到舆情</div>;
                }
            }
        }
        return n;
    }
    search(){
        this.state.codeType = 2;
        this.resData();
    }
    clearText(data){
        let inputText = data.target.value;
        this.setState({
            inputText
        },()=>{

        })
    }
    render(){
        return(
            <div className={classNameNames(
                {'router-context':true},
                {[style['opinion']]:true},
            )}>
                <div className={style["opinion-box"]}>
                    <div className={style["box-head"]}>
                        <div><span className={style['box-head-icon']}>&#xe624;</span>新闻舆情</div>
                        <div className={style["opinion-search-box"]}>
                            <input className={style["role-search-input"]} defaultValue={this.state.inputText} type="text" onBlur={this.clearText.bind(this)} maxLength="20" placeholder="请输入舆情关键词查询"/>
                            <div className={style["role-search-btn"]}>
                                <i className="iconfont" style={{color: "rgb(222, 226, 229)"}} onClick={this.search.bind(this)}>&#xe62e;</i>
                            </div>
                        </div>
                    </div>
                    <Spin tip="加载中..." spinning={this.state.loading}>
                        {
                            this.renderTemplate()
                        }
                        {
                            <Pagination
                                className={style['pagination-center']}
                                showQuickJumper
                                defaultCurrent={1}
                                current={this.state.current}
                                total={this.state.totalLength}
                                onChange={this.resData.bind(this)}
                                style={{marginBottom:"50px"}}
                            />
                        }
                    </Spin>
                </div>
            </div>
        )
    }
}
