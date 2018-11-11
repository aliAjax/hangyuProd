import React, { Component } from 'react';
import gg from './../../static/img/ieErr/google.png';
import style from './../../static/css/guide/guide.scss';


class IeErr extends  Component{
    constructor(props){
        super(props);

    }
    componentDidMount() {
    }
    render(){
        return(<div style={styles.banBox}>
            <div style={styles.banGoogle}>
                <div className={style['guide-btn-b']} style={styles.btn} onClick={()=>{window.open("http://118.118.221.133/softdl.360tpcdn.com/auto/20180613/105189_a7a80e7116ee2ca5e7b752b327fe3482.exe")}}>去下载</div>
            </div>
        </div>)
    }
}
export default IeErr;

let styles = {
    banBox:{
        width:'100%',
        height:"100%",
        position:"relative"
        // backgroundImage:`url(${bg})`
    },
    banGoogle:{
        width:'739px',
        height:"539px",
        backgroundImage:`url(${gg})`,
        margin:"auto auto",
        position:"absolute",
        top:0,
        left:0,
        right:0,
        bottom:0
    },
    btn:{
        width:"350px",
        height:"60px",
        borderRadius:"50px",
        lineHeight:"60px",
        margin:"264px auto",
        fontSize:"2rem"
    }
};