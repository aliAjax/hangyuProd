
const initialState = {
    role:null,    // 用户信息
    text: 7,
    sasas: 88,
    num:55,
    allAirList:null,   // 所有机场的数据
    airList:null,   // 国内机场的数据
    internationalAirList:null,   // 国外机场的数据
    // air:['A320','A330','B737NG','E190/195','CRJ900','MA60','B787','B777','B767','E145','B757','B747','ARJ21'],  // 所有机型数据
    air:null,  // 所有机型类数据
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
export default initialState;