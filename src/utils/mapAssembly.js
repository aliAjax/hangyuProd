import {airMes} from "./airMes";
import {i3, i5, i10,i8} from "../page/bmap/bmapResources";
import {store} from "../store";
const rc = {
    a: {
        fontFamily: 'Microsoft YaHei',
        color: 'white',
        fontSize:10,
        align:"center"
    },
    b: {
        fontFamily: 'Microsoft YaHei',
        color: 'white',
        align:"center",
        fontSize:12,
        height:30,
        verticalAlign: 'bottom',
    },
    b1: {
        fontFamily: 'Microsoft YaHei',
        color: '#3c78ff',
        fontSize:30,
        fontWeight:"bold",
        verticalAlign: 'bottom',
    },
    c:{
        fontFamily: 'Microsoft YaHei',
        color: 'white',
        fontSize:10,
        align:"center"
    },
    c1:{
        fontFamily: 'Microsoft YaHei',
        color: '#3c78ff',
        fontSize:24,
        fontWeight:"bold",
        padding:[4,0,10,0],
        align:"center"
    },
    c2:{
        fontFamily: 'Microsoft YaHei',
        color: '#3c78ff',
        fontSize:10,
        fontWeight:"bold",
        align:"center"
    },
    c3:{
        fontFamily: 'Microsoft YaHei',
        color: 'white',
        fontSize:14,
        align:"center",
    }
};
/**
 * @param data {List} 所以需求和发布的数据
 * @return {List} 返回一个数组，0、气泡-市场，1、图例-市场，2、气泡-我的发布，3、 图例-我的发布，
 * @author Allan 2018/4/28
 * */
function routesData(data) {
    let a = [], //  气泡-市场
        b = [], //  图例-市场
        c = [], //  气泡-我的发布
        d = [], //  图例-我的发布
        have = false,
        haveself = false, // 是否有自己本场
        havemk = false; // 是否有市场
    // e = []; //  图例-点
    // type 0,市场需求、1，我的发布，6、机场信息
    data.forEach((v)=>{
        let mes = airMes(store.getState().airList, v.dpt);
        let isDpt = v.dpt === store.getState().role.airlineretrievalcondition;
        if(isDpt){
            have = true;
        };
        switch (store.getState().role.role){
            case '0':
                if(v.num > 0){
                    a.push({
                        name: v.airlnCd,
                        value: [v.cityCoordinateJ, v.cityCoordinateW],
                        symbol:i8,
                        symbolOffset: [0, 0],
                        mes,
                        type:0,  //  需求类型  0，市场、1，我的需求
                        model:0,   // 模式 0，气泡，1图例
                        label:{
                            title:"市场需求（条）",
                            num:v.num,
                            international:v.internationalNum > 0 ? `含国际航线${v.internationalNum}条` : "",
                            airlnCd:mes.airlnCd,
                        }
                    });
                    b.push({
                        name: v.airlnCd,
                        value: [v.cityCoordinateJ, v.cityCoordinateW],
                        symbol:i3,
                        symbolOffset: [0, -25],
                        mes,
                        model:1,   // 模式 0，气泡，1图例
                        type:0,  //  需求类型  0，市场、1，我的需求
                        label:{
                            num:v.num,
                        }
                    });

                }
                if(v.myNum > 0){
                    c.push({
                        name: v.airlnCd,
                        value: [v.cityCoordinateJ, v.cityCoordinateW],
                        symbol:i8,
                        symbolOffset: [0, 0],
                        mes,
                        model:0,   // 模式 0，气泡，1图例
                        type:1,  //  需求类型  0，市场、1，我的需求
                        label:{
                            title:"我发布的（架）",
                            num:v.myNum,
                            international:"",
                            airlnCd:mes.airlnCd,
                        }
                    });
                    d.push({
                            name: v.airlnCd,
                            value: [v.cityCoordinateJ, v.cityCoordinateW],
                            symbol:i5,
                            symbolOffset: [0, -25],
                            mes,
                            model:1,   // 模式 0，气泡，1图例
                            type:1,  //  需求类型  0，市场、1，我的需求
                            label:{
                                num:v.myNum,
                            }
                        },
                    );
                }
                break;
            case '1':
                if(v.num > 0){
                    a.push({
                        name: v.airlnCd,
                        value: [v.cityCoordinateJ, v.cityCoordinateW],
                        symbol:i8,
                        symbolOffset: [0, 0],
                        mes,
                        model:0,   // 模式 0，气泡，1图例
                        type:0,  //  需求类型  0，市场、1，我的需求
                        label:{
                            title:"市场运力（架）",
                            num:v.num,
                            international:"",
                            airlnCd:mes.airlnCd
                        }
                    });
                    b.push({
                        name: v.airlnCd,
                        value: [v.cityCoordinateJ, v.cityCoordinateW],
                        symbol:isDpt ? i10 : i5,
                        symbolOffset: isDpt ? [20, -20] : [0, -25],
                        symbolSize:isDpt ? [44,21] : [40,40],
                        mes,
                        model:1,   // 模式 0，气泡，1图例
                        type:0,  //  需求类型  0，市场、1，我的需求
                        label:{
                            title:"市场运力（架）",
                            international:"",
                            isBc:isDpt,
                            num:isDpt ? `${v.num}` : `${v.num}`,
                            airlnCd:mes.airlnCd
                        }
                    });
                    if(isDpt){
                        havemk = true;
                    }
                }
                if(v.myNum > 0){
                    c.push({
                        name: v.airlnCd,
                        value: [v.cityCoordinateJ, v.cityCoordinateW],
                        symbol:i8,
                        symbolOffset: [0, 0],
                        mes,
                        model:0,   // 模式 0，气泡，1图例
                        type:1,  //  需求类型  0，市场、1，我的需求
                        label:{
                            title:"我发布的（条）",
                            num:v.myNum,
                            international:v.internationalNum > 0 ? `含国际航线${v.internationalNum}条` : "",
                            airlnCd:mes.airlnCd,
                        }
                    });
                    d.push({
                        name: v.airlnCd,
                        symbol:isDpt ? i10 : i3,
                        symbolOffset: isDpt ? [20, -20] : [0, -25],
                        symbolSize:isDpt ? [44,21] : [40,40],
                        value: [v.cityCoordinateJ, v.cityCoordinateW],
                        mes,
                        model:1,   // 模式 0，气泡，1图例
                        type:1,  //  需求类型  0，市场、1，我的需求
                        label:{
                            isBc:isDpt,
                            num:isDpt ? `${v.myNum}` : `${v.myNum}`
                        }
                    });
                    if(isDpt){
                        haveself = true;
                    }
                }
                break;
        };
    });
    if(!haveself){
        let havaMes = airMes(store.getState().airList, store.getState().role.airlineretrievalcondition);
        if(havaMes !== ''){
            d.push({
                name: store.getState().role.airlineretrievalcondition,
                value: [havaMes.cityCoordinateJ, havaMes.cityCoordinateW],
                symbol:i10,
                symbolOffset:[20, -20],
                symbolSize:[44,21],
                mes:havaMes,
                model:1,   // 模式 0，气泡，1图例
                type:1,  //  需求类型  0，市场、1，我的需求
                label:{
                    international:"",
                    isBc:true,
                    num:``,
                }
            });
        }
    }
    if(!havemk){
        let havaMes = airMes(store.getState().airList, store.getState().role.airlineretrievalcondition);
        if(havaMes !== ''){
            b.push({
                name: store.getState().role.airlineretrievalcondition,
                value: [havaMes.cityCoordinateJ, havaMes.cityCoordinateW],
                symbol:i10,
                symbolOffset:[20, -20],
                symbolSize:[44,21],
                mes:havaMes,
                model:1,   // 模式 0，气泡，1图例
                type:0,  //  需求类型  0，市场、1，我的需求
                label:{
                    international:"",
                    isBc:true,
                    num:``,
                }
            });
        }
    }
    return [a,b,c,d];
};

export {routesData}
