function intercept(nextProps) {


    // if(this.props.role === null){
    //     if(this.props.location.pathname !== "/login" || this.props.location.pathname === "/index"){
    //         this.props.history.replace("login");
    //     }
    // };
    if(this.props.role === null){
        if(this.props.location.pathname != "/login"){
            this.props.history.replace("login");
        }
    }else{
        if(!this.props.location.pathname.includes("index")){
            this.props.history.replace("index");
        }
    };
}
export {intercept};