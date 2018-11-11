import initialState from "./state";
import letterConversions from '../static/js/letterConversions'
const reducer = (state = initialState, action) => {
    let d = Object.assign({},state);
    switch (action.type) {
        case 'ROLE':
            d.role = action.data;
            if(action.data === null){
                setTimeout(()=>{
                    window.location.href = "#/";
                },150);
                sessionStorage.setItem("role",action.data)
            }else{
                sessionStorage.setItem("role",JSON.stringify(action.data));
            }
            break;
        case 'CHANGE_TEXT':
            d.text ++;
            d.sasas ++;
            break;
        case 'BUTTON_CLICK':
            d.text --;
            d.sasas --;
            break;
        case 'CLICKCHILID':
            d.num ++;
            break;
        case 'SETCITY':
            let vlC = action.data;
            if(vlC.t){
                if(d.demandList.conditions.city.s.indexOf(vlC.v) == -1){
                    d.demandList.conditions.city.s.push(vlC.v);
                }
            }else{
                if(vlC.v == '$&'){  // 清空筛选条件
                    d.demandList.conditions = {
                        flyGrade: {
                            va: [
                                [
                                    {v: '1A', s: false},
                                    {v: '2A', s: false},
                                    {v: '3A', s: false},
                                    {v: '4C', s: false},
                                ],
                                [
                                    {v: '1B', s: false},
                                    {v: '2B', s: false},
                                    {v: '3B', s: false},
                                    {v: '4D', s: false},
                                ],
                                [
                                    {v: '1C', s: false},
                                    {v: '2C', s: false},
                                    {v: '3C', s: false},
                                    {v: '4E', s: false}
                                ],
                                [
                                    {v: '3D', s: false},
                                    {v: '4F', s: false}
                                ]
                            ],
                            s: []  // 选中列表
                        },
                        city: {
                            s:[]
                        },
                        airType: '',  // 航线类型  全部:""; 国内航线:1; 国际航线:2
                        airportType: "",  // 航司类型  0-全服务航空，1-低成本航空，""-都接受
                        subsidyPolicy: {
                            va: [
                                {v: '定补', s: false},
                                {v: '保底', s: false},
                                {v: '待议', s: false},
                            ],
                            s: []
                        },
                    }
                }else{
                    let l = d.demandList.conditions.city.s.indexOf(vlC.v);
                    d.demandList.conditions.city.s.splice(l,1);
                }
            }
            break;
        case 'SUBSIDYPOLICY':
            let vl1 = action.data;
            if(d.demandList.conditions.subsidyPolicy.va[vl1].s){
                let l = d.demandList.conditions.subsidyPolicy.s.indexOf(d.demandList.conditions.subsidyPolicy.va[vl1].v);
                d.demandList.conditions.subsidyPolicy.va[vl1].s = false;
                d.demandList.conditions.subsidyPolicy.s.splice(l,1);
            }else{
                d.demandList.conditions.subsidyPolicy.va[vl1].s = true;
                d.demandList.conditions.subsidyPolicy.s.push(d.demandList.conditions.subsidyPolicy.va[vl1].v);
            }
            break;
        case 'FLYGRADE':
            let vl = action.data;
            let index = d.demandList.conditions.flyGrade.va.indexOf(vl[0]);
            if(d.demandList.conditions.flyGrade.va[index][vl[1]].s){
                let l = d.demandList.conditions.flyGrade.s.indexOf(d.demandList.conditions.flyGrade.va[index][vl[1]].v);
                d.demandList.conditions.flyGrade.va[index][vl[1]].s = false;
                d.demandList.conditions.flyGrade.s.splice(l,1);
            }else{
                d.demandList.conditions.flyGrade.va[index][vl[1]].s = true;
                d.demandList.conditions.flyGrade.s.push(d.demandList.conditions.flyGrade.va[index][vl[1]].v);
            }
            break;
        case 'LINETYPE':
            let vlType = action.data;
            d.demandList.conditions.airType = vlType;
            break;
        case 'PORTTYPE':
            let vlType1 = action.data;
            d.demandList.conditions.airportType = vlType1;
            break;
        case 'INITDATA':
            let airList0 = [], airList1 = [];
            action.data[0].forEach((val) => {
                if(val.country === '0') {
                    airList0.push(val);
                }else if(val.country === '1') {
                    airList1.push(val);
                }
            });
            action.data[2].map((val)=>{
                let letter = letterConversions(val.airlnCd);
                val.companyPinyin = letter.allLetter;
                return val;
            })
            d.allAirList = action.data[0];
            d.airList = airList0;
            d.internationalAirList = airList1;
            d.cityList = action.data[1];
            d.companyList = action.data[2];
            d.air=[];
            // console.info(action.data);
            for(let i=0;i<action.data[3].jichangPlaneModel.length;i++){
                d.air.push(action.data[3].jichangPlaneModel[i].plane_model);
            };
            d.airSingleList=[];
            for(let i=0;i<action.data[3].hangsiPlaneModel.length;i++){
                d.airSingleList.push(action.data[3].hangsiPlaneModel[i].plane_model);
            };
            break;
        case 'SEARCHINFO':
            d.searchInfo = action.data;  //信息查询数据
            break;
        case 'NEWPHONE':
            d.newPhone = action.data;
            break;
        case 'CHANGEROLE':
            for(let item in action.data) {
                d.role[item] = action.data[item];
            }
            sessionStorage.setItem("role",JSON.stringify(d.role));
            break;
        case 'EMPTYDATA':  // 清空数据
            d = {
                role:null,    // 用户信息
                text: 7,
                sasas: 88,
                num:55,
                allAirList:null,   // 所有机场的数据
                airList:null,   // 国内机场的数据
                internationalAirList:null,   // 国外机场的数据
                // air:['A320','A330','B737NG','E190/195','CRJ900','MA60','B787','B777','B767','E145','B757','B747','ARJ21'],  // 所有机型数据
                air:null,  // 所有机型数据
                airSingleList:null,//所有机型数据
                cityList:null,   // 所有城市的数据
                companyList:null,   // 所有航司的数据
                demandList: {  // ** 需求列表数据
                    conditions: {  // 需求列表-全部筛选条件
                        order: false,
                        open: false,
                        flyGrade: { // 飞行区等级
                            va: [
                                [
                                    {v: '1A', s: false},
                                    {v: '2A', s: false},
                                    {v: '3A', s: false},
                                    {v: '4C', s: false},
                                ],
                                [
                                    {v: '1B', s: false},
                                    {v: '2B', s: false},
                                    {v: '3B', s: false},
                                    {v: '4D', s: false},
                                ],
                                [
                                    {v: '1C', s: false},
                                    {v: '2C', s: false},
                                    {v: '3C', s: false},
                                    {v: '4E', s: false}
                                ],
                                [
                                    {v: '3D', s: false},
                                    {v: '4F', s: false}
                                ]
                            ],
                            s: []  // 选中列表
                        },
                        city: {
                            s: []
                        },     //选择
                        airType: '',  // 航线类型  全部:""; 国内航线:1; 国际航线:2
                        airportType: "",  // 航司类型  0-全服务航空，1-低成本航空，""-都接受
                        subsidyPolicy: {  // 补贴政策
                            va: [
                                {v: '定补', s: false},
                                {v: '保底', s: false},
                                {v: '待议', s: false},
                            ],
                            s: []
                        },
                    },
                },
                searchInfo: window.sessionStorage.getItem('search_info') ? JSON.parse(window.sessionStorage.getItem('search_info')) : {},  // 搜索机场、航司、城市详情，搜索条件
                newPhone: '',  // 更改手机时填写的新手机号
            };
            break;
        default:
            return d;
    }
    return d;
};

export default reducer
