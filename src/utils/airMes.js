/**
 * 机场转换信息 方法
 * @param data{list}机场信息列表 field{string}传入信息
 * @author  2017/11
 * @version  1.0.1
 * */

const airMes = function (data,field = '$%') {
    for(let i = 0;i < data.length;i ++){
        if(data[i].city != null && data[i].city == field){
            return data[i];
        }else if(data[i].iata != null && data[i].iata == field){
            return data[i];
        }else if(data[i].icao != null && data[i].icao == field){
            return data[i];
        };
    };
    return '';
};

/**
 * 城市转换信息 方法
 * @param data{list}城市信息列表 field{string}传入信息
 * @author  2017/11
 * @version  1.0.1
 * */

const cityMes = function (data,field = '$%') {
    for(let i = 0;i < data.length;i ++){
        if(data[i].cityCoordinate != null && data[i].cityCoordinate == field){
            return data[i];
        }else if(data[i].cityIcao != null && data[i].cityIcao == field){
            return data[i];
        }else if(data[i].cityName != null && data[i].cityName == field){
            return data[i];
        };
    };
    return '';
};

/**
 * 航司转换信息 方法
 * @param data{list}城市信息列表 field{string}传入信息
 * @author  2017/11
 * @version  1.0.1
 * */

const companyMes = function (data,field = '$%') {
    for(let i = 0;i < data.length;i ++){
        if(data[i].companyIata != null && data[i].companyIata == field){
            return data[i];
        }else if(data[i].companyIcao != null && data[i].companyIcao == field){
            return data[i];
        }else if(data[i].companyName != null && data[i].companyName == field){
            return data[i];
        };
    };
    return '';
};
export {cityMes,airMes,companyMes};
