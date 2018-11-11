import letterConversions from './letterConversions'

function conversions(data) {
    let mes = [];
    data.forEach((val)=>{
        let letter = letterConversions(val.airlnCdName);
        mes.push({
            cityName:val.airlnCdName,  // 机场名字
            pinyin:letter.allLetter,    // 机场全拼音
            py:letter.fllLetter,    // 机场首字母拼音
            code:val.iata,  // 三字码
            initial:letter.fllLetter.substring(0,1), // 第一个字母
            airLvl:val.airfieldlvl,  // 机场等级airfieldlvl
            iaco:val.icao,
            cityCoordinateJ:val.cityCoordinateJ,
            cityCoordinateW:val.cityCoordinateW,
            allData:val
        })
    });
    return mes;
}
function conversionsCity(data) {
    let mes = [];
    data.forEach((val)=>{
        let letter = letterConversions(val.cityName);
        mes.push({
            cityName:val.cityName,  // 机场名字
            pinyin:letter.allLetter,    // 机场全拼音
            py:letter.fllLetter,    // 机场首字母拼音
            cityIcao:val.cityIcao,  // 三字码
            initial:letter.fllLetter.substring(0,1), // 第一个字母
            id:val.id,          // 城市id
            cityCoordinate:val.cityCoordinate // 城市经纬度
        })
    });
    return mes;
}
function conversionsCompany(data) { //航司名称
    let mes = [];
    data.forEach((val)=>{
        let letter = letterConversions(val.airlnCd);
        mes.push({
            companyName:val.airlnCd,  // 航司名字
            pinyin:letter.allLetter,    // 航司全拼音
            py:letter.fllLetter,    // 航司首字母拼音
            companyIcao:val.icao,  // 三字码
            companyIata:val.iata,  // 二字码
            initial:letter.fllLetter.substring(0,1), // 第一个字母
            id:val.id,          // 航司id
        })
    });
    return mes;
}
export {conversions,conversionsCity,conversionsCompany};
