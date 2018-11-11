/* eslint-disable */
class MapMethods {
    constructor(props){

    }
    /**
     * 转换全国成航点图例
     * */
    static point(data){
        let list = [],text = [];
        let labelStyle = {
            fontSize : "12px",
            border:"none",
            color:"#605E7C",
            backgroundColor:"transprant",
            textShadow:"1px 1px 1px #ededed"
        };
        data.forEach((val)=>{
            let point = new BMap.Point(val.cityCoordinateJ, val.cityCoordinateW);
            let myLabel = new BMap.Label("<div class='map-demand-cutline-label'></div>",     //为lable填写内容
                {offset:new BMap.Size(-4,-4),
                    position:point});
            myLabel.setStyle({                                   //给label设置样式，任意的CSS都是可以的
                border:"0",                    //边
                height:"8px",                //高度
                width:"8px",                 //宽
                textAlign:"center",            //文字水平居中显示
                borderRadius:"50%",
                backgroundColor:"transparent"
            });
            myLabel.setZIndex(10);
            myLabel.mandatorytype = {
                mes:val
            };
            list.push(myLabel);
            let tx = new BMap.Label(val.airlnCd,{position:point});
            tx.setZIndex(4);
            tx.setStyle(labelStyle);
            tx.setOffset(new BMap.Size(10, -10));
            text.push(tx);
        });
        return {
            list,
            text
        };
    }
    /**
     * 需求图例
     * @param cls{Number} 0，气泡模式，1,、图标模式
     * @param data{list}  需求数据
     * @return obj{}  listDemand 需求实例，listCro 下标实例
     * */
    static demand(data,cls){
        let listDemand = [],listCro = [];
        data.forEach((val)=>{
            let size = cls === 0 ? 126 : 50;
            let mes = "",offset;
            if(val.model === 0){
                offset = new BMap.Size(-(size/2),-(size/2));
                mes = `
                    <div class="map-demand-pao-mes">
                        <div class="map-demand-pao-mes-title">${val.label.title}</div>
                        <div class="map-demand-pao-mes-num">${val.label.num}<div>
                        <div class="map-demand-pao-mes-internationalNum">${val.label.international}</div>
                        <div class="map-demand-pao-mes-name">${val.label.airlnCd}</div>
                    </div>
                `
            }else{
                offset = new BMap.Size(-26,-52);
                let style = "";
                if(val.label.isBc){
                    // offset = new BMap.Size(-6,-33);
                    // style = "color:red"
                    style = "padding-top:29px;"
                }
                mes = `
                    <div class="map-demand-cutline-mes">
                        <div class="map-demand-cutline-mes-num" style="${style}">${val.label.num}<div>
                    </div>
                `
            };
            let sl = "width: 100%;height: 100%;";
            // let sl = val.label.isBc ? "width: 44px;height: 28px;" : "width: 100%;height: 100%;";
            let node = `<div class=${cls === 0 ? "map-demand-pao" : "map-demand-cutline"}>
                            <img class="map-demand-scale" style="${sl}" src='${val.symbol.split("image://")[1]}'/> 
                            ${mes}
                        </div>`;


            // 图例点
            let myLabel = new BMap.Label(node,     //为lable填写内容
                {offset, position:new BMap.Point(val.value[0],val.value[1])});
            myLabel.setStyle({                                   //给label设置样式，任意的CSS都是可以的
                border:"none",
                textAlign:"center",            //文字水平居中显示
                cursor:"pointer",
                borderRadius:"50%",
                backgroundColor:"rgba(0,0,0,0)"
            });
            // 下坐标点
            if(cls === 1){
                let myLabels = new BMap.Label("<div class='map-demand-cutline-label'></div>",     //为lable填写内容
                    {offset:new BMap.Size(-4,-4),
                        position:new BMap.Point(val.value[0],val.value[1])});
                myLabels.setStyle({                                   //给label设置样式，任意的CSS都是可以的
                    border:"0",                    //边
                    height:"8px",                //高度
                    width:"8px",                 //宽
                    textAlign:"center",            //文字水平居中显示
                    borderRadius:"50%",
                    backgroundColor:"transparent"
                });
                myLabels.setZIndex(10);
                myLabels.mandatorytype = val;
                listCro.push(myLabels)
            }
            myLabel.mandatorytype = val;
            myLabel.setZIndex(15);
            listDemand.push(myLabel);
        });
        return {
            listDemand,
            listCro
        };
    }
    /**
     * 航线网络图图例
     * */
    static routeNetwork(){

    }
}
export {MapMethods}