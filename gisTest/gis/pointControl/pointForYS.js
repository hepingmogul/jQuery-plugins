/**
 * 演示用点位加载
 */
var PointForYS = function(){
    this.init.apply(this, arguments);
};

PointForYS.prototype = {
    viewer: null, //cesium视图对象
    billboardCollection:null,//billboard的集合
    labelCollection:null,//billboard的集合
    data:[
        {"deviceType":"videoSurveillance","lat":"29.6230","lon":"106.5470","name":"视频监控模拟点位","pointId":"1","state":"0","channel":""},
        {"deviceType":"videoSurveillance","lat":"29.6198","lon":"106.5337","name":"视频监控模拟点位","pointId":"2","state":"0","channel":""},
        {"deviceType":"videoSurveillance","lat":"29.6104","lon":"106.5164","name":"视频监控模拟点位","pointId":"3","state":"0","channel":""},
        {"deviceType":"videoSurveillance","lat":"29.6155","lon":"106.5473","name":"视频监控模拟点位","pointId":"4","state":"0","channel":""},
        {"deviceType":"videoSurveillance","lat":"29.6078","lon":"106.5317","name":"视频监控模拟点位","pointId":"5","state":"0","channel":""},
        {"deviceType":"videoSurveillance","lat":"29.6165","lon":"106.4982","name":"视频监控模拟点位","pointId":"6","state":"0","channel":""},
        {"deviceType":"videoSurveillance","lat":"29.6468","lon":"106.4776","name":"视频监控模拟点位","pointId":"7","state":"0","channel":""},
        {"deviceType":"videoSurveillance","lat":"29.6829","lon":"106.4630","name":"视频监控模拟点位","pointId":"8","state":"0","channel":""},
        {"deviceType":"videoSurveillance","lat":"29.6729","lon":"106.4807","name":"视频监控模拟点位","pointId":"9","state":"1","channel":""},
        {"deviceType":"videoSurveillance","lat":"29.6600","lon":"106.4786","name":"视频监控模拟点位","pointId":"10","state":"1","channel":""},
        {"deviceType":"illegalParking","lat":"29.6233","lon":"106.4956","name":"违章停车模拟点位","pointId":"11","state":"0","channel":""},
        {"deviceType":"illegalParking","lat":"29.6155","lon":"106.4969","name":"违章停车模拟点位","pointId":"12","state":"0","channel":""},
        {"deviceType":"illegalParking","lat":"29.6565","lon":"106.4708","name":"违章停车模拟点位","pointId":"13","state":"0","channel":""},
        {"deviceType":"illegalParking","lat":"29.6784","lon":"106.4688","name":"违章停车模拟点位","pointId":"14","state":"0","channel":""},
        {"deviceType":"illegalParking","lat":"29.6427","lon":"106.4703","name":"违章停车模拟点位","pointId":"15","state":"0","channel":""},
        {"deviceType":"illegalParking","lat":"29.6531","lon":"106.4985","name":"违章停车模拟点位","pointId":"16","state":"0","channel":""},
        {"deviceType":"illegalParking","lat":"29.6365","lon":"106.5268","name":"违章停车模拟点位","pointId":"17","state":"0","channel":""},
        {"deviceType":"illegalParking","lat":"29.6219","lon":"106.5217","name":"违章停车模拟点位","pointId":"18","state":"0","channel":""},
        {"deviceType":"illegalParking","lat":"29.6224","lon":"106.5173","name":"违章停车模拟点位","pointId":"19","state":"0","channel":""},
        {"deviceType":"illegalParking","lat":"29.6365","lon":"106.5242","name":"违章停车模拟点位","pointId":"20","state":"0","channel":""},
        {"deviceType":"trafficConstruction","lat":"29.6258","lon":"106.5258","name":"行车诱导模拟点位","pointId":"21","state":"0","channel":""},
        {"deviceType":"trafficConstruction","lat":"29.6219","lon":"106.5124","name":"行车诱导模拟点位","pointId":"22","state":"0","channel":""},
        {"deviceType":"trafficConstruction","lat":"29.6107","lon":"106.5101","name":"行车诱导模拟点位","pointId":"23","state":"0","channel":""},
        {"deviceType":"trafficConstruction","lat":"29.6339","lon":"106.5184","name":"行车诱导模拟点位","pointId":"24","state":"0","channel":""},
        {"deviceType":"trafficConstruction","lat":"29.6526","lon":"106.5302","name":"行车诱导模拟点位","pointId":"25","state":"0","channel":""},
        {"deviceType":"trafficConstruction","lat":"29.6492","lon":"106.5114","name":"行车诱导模拟点位","pointId":"26","state":"0","channel":""},
        {"deviceType":"trafficConstruction","lat":"29.6741","lon":"106.4790","name":"行车诱导模拟点位","pointId":"27","state":"0","channel":""},
        {"deviceType":"trafficConstruction","lat":"29.6839","lon":"106.4691","name":"行车诱导模拟点位","pointId":"28","state":"0","channel":""},
        {"deviceType":"trafficConstruction","lat":"29.6185","lon":"106.4909","name":"行车诱导模拟点位","pointId":"29","state":"0","channel":""},
        {"deviceType":"microwaveDetection","lat":"29.6218","lon":"106.4840","name":"微波检测模拟点位","pointId":"30","state":"0","channel":""},
        {"deviceType":"microwaveDetection","lat":"29.6234","lon":"106.4649","name":"微波检测模拟点位","pointId":"31","state":"0","channel":""},
        {"deviceType":"microwaveDetection","lat":"29.6359","lon":"106.4715","name":"微波检测模拟点位","pointId":"32","state":"0","channel":""},
        {"deviceType":"microwaveDetection","lat":"29.6461","lon":"106.4659","name":"微波检测模拟点位","pointId":"33","state":"0","channel":""},
        {"deviceType":"microwaveDetection","lat":"29.6695","lon":"106.4693","name":"微波检测模拟点位","pointId":"34","state":"0","channel":""},
        {"deviceType":"microwaveDetection","lat":"29.6866","lon":"106.4799","name":"微波检测模拟点位","pointId":"35","state":"0","channel":""},
        {"deviceType":"microwaveDetection","lat":"29.6837","lon":"106.4717","name":"微波检测模拟点位","pointId":"36","state":"0","channel":""},
        {"deviceType":"microwaveDetection","lat":"29.6647","lon":"106.5118","name":"微波检测模拟点位","pointId":"37","state":"0","channel":""},
        {"deviceType":"microwaveDetection","lat":"29.6547","lon":"106.5207","name":"微波检测模拟点位","pointId":"38","state":"0","channel":""},
        {"deviceType":"microwaveDetection","lat":"29.6469","lon":"106.5241","name":"微波检测模拟点位","pointId":"39","state":"0","channel":""},
        {"deviceType":"microwaveDetection","lat":"29.6463","lon":"106.5349","name":"微波检测模拟点位","pointId":"40","state":"0","channel":""},
        {"deviceType":"microwaveDetection","lat":"29.6167","lon":"106.5344","name":"微波检测模拟点位","pointId":"41","state":"0","channel":""},
        {"deviceType":"videoDetection","lat":"29.6191","lon":"106.5517","name":"视频检测模拟点位","pointId":"42","state":"0","channel":""},
        {"deviceType":"videoDetection","lat":"29.6074","lon":"106.5414","name":"视频检测模拟点位","pointId":"43","state":"0","channel":""},
        {"deviceType":"videoDetection","lat":"29.6080","lon":"106.5343","name":"视频检测模拟点位","pointId":"44","state":"0","channel":""},
        {"deviceType":"videoDetection","lat":"29.6139","lon":"106.5193","name":"视频检测模拟点位","pointId":"45","state":"0","channel":""},
        {"deviceType":"videoDetection","lat":"29.6165","lon":"106.5089","name":"视频检测模拟点位","pointId":"46","state":"0","channel":""},
        {"deviceType":"videoDetection","lat":"29.6149","lon":"106.4982","name":"视频检测模拟点位","pointId":"47","state":"0","channel":""},
        {"deviceType":"videoDetection","lat":"29.6185","lon":"106.4933","name":"视频检测模拟点位","pointId":"48","state":"0","channel":""},
        {"deviceType":"videoDetection","lat":"29.6468","lon":"106.5020","name":"视频检测模拟点位","pointId":"49","state":"0","channel":""},
        {"deviceType":"videoDetection","lat":"29.6545","lon":"106.5063","name":"视频检测模拟点位","pointId":"50","state":"0","channel":""},
        {"deviceType":"videoDetection","lat":"29.6667","lon":"106.5179","name":"视频检测模拟点位","pointId":"51","state":"0","channel":""},
        {"deviceType":"illegalWhistling","lat":"29.6150","lon":"106.5401","name":"禁止鸣笛模拟点位","pointId":"52","state":"0","channel":""},
        {"deviceType":"illegalWhistling","lat":"29.6124","lon":"106.5023","name":"禁止鸣笛模拟点位","pointId":"53","state":"0","channel":""},
        {"deviceType":"illegalWhistling","lat":"29.6143","lon":"106.6853","name":"禁止鸣笛模拟点位","pointId":"54","state":"0","channel":""},
        {"deviceType":"illegalWhistling","lat":"29.6336","lon":"106.4779","name":"禁止鸣笛模拟点位","pointId":"55","state":"0","channel":""},
        {"deviceType":"illegalWhistling","lat":"29.6369","lon":"106.4832","name":"禁止鸣笛模拟点位","pointId":"56","state":"0","channel":""},
        {"deviceType":"illegalWhistling","lat":"29.6445","lon":"106.5225","name":"禁止鸣笛模拟点位","pointId":"57","state":"0","channel":""},
        {"deviceType":"illegalWhistling","lat":"29.6541","lon":"106.5438","name":"禁止鸣笛模拟点位","pointId":"58","state":"0","channel":""},
        {"deviceType":"illegalWhistling","lat":"29.6696","lon":"106.5608","name":"禁止鸣笛模拟点位","pointId":"59","state":"0","channel":""},
        {"deviceType":"illegalWhistling","lat":"29.6838","lon":"106.5599","name":"禁止鸣笛模拟点位","pointId":"60","state":"0","channel":""},
        {"deviceType":"illegalWhistling","lat":"29.6663","lon":"106.5502","name":"禁止鸣笛模拟点位","pointId":"61","state":"0","channel":""},
        {"deviceType":"illegalWhistling","lat":"29.6829","lon":"106.5792","name":"禁止鸣笛模拟点位","pointId":"62","state":"0","channel":""},
        {"deviceType":"illegalWhistling","lat":"29.6815","lon":"106.5791","name":"禁止鸣笛模拟点位","pointId":"63","state":"0","channel":""},
        {"deviceType":"notComityPedestrian","lat":"29.6296","lon":"106.5532","name":"不礼让行人模拟点位","pointId":"64","state":"0","channel":""},
        {"deviceType":"notComityPedestrian","lat":"29.6334","lon":"106.5271","name":"不礼让行人模拟点位","pointId":"65","state":"0","channel":""},
        {"deviceType":"notComityPedestrian","lat":"29.6205","lon":"106.5124","name":"不礼让行人模拟点位","pointId":"66","state":"0","channel":""},
        {"deviceType":"notComityPedestrian","lat":"29.6163","lon":"106.5073","name":"不礼让行人模拟点位","pointId":"67","state":"0","channel":""},
        {"deviceType":"notComityPedestrian","lat":"29.6273","lon":"106.4842","name":"不礼让行人模拟点位","pointId":"68","state":"0","channel":""},
        {"deviceType":"notComityPedestrian","lat":"29.6189","lon":"106.4708","name":"不礼让行人模拟点位","pointId":"69","state":"0","channel":""},

        //该段为车辆查踪演示设备------------------------------》
        {"deviceType":"illegalParking","lat":"29.627153","lon":"106.531510","name":"镜泊中路41","pointId":"111","state":"0","channel":""},
        {"deviceType":"illegalParking","lat":"29.625573","lon":"106.529616","name":"镜泊中路42","pointId":"112","state":"0","channel":""},
        {"deviceType":"illegalParking","lat":"29.624678","lon":"106.527826","name":"镜泊中路43","pointId":"113","state":"0","channel":""},
        {"deviceType":"illegalParking","lat":"29.624069","lon":"106.525654","name":"镜泊中路44","pointId":"114","state":"0","channel":""},
        //<<-----------------------------该段为车辆查踪演示设备

        //该段为路劲推荐演示设备------------------------------》
        {"deviceType":"illegalParking","lat":"29.625535","lon":"106.521369","name":"违章停车模拟点位","pointId":"115","state":"0","channel":""},

        {"deviceType":"illegalParking","lat":"29.626647","lon":"106.523989","name":"违章停车模拟点位","pointId":"116","state":"0","channel":""},
        {"deviceType":"illegalParking","lat":"29.628483","lon":"106.520401","name":"违章停车模拟点位","pointId":"117","state":"0","channel":""},
        {"deviceType":"illegalParking","lat":"29.626039","lon":"106.518347","name":"违章停车模拟点位","pointId":"118","state":"0","channel":""},
        //<<-----------------------------该段为路劲推荐演示设备
    ],
    init: function (viewer) {
        var _self = this;
        _self.view = viewer;
        viewer.scene.camera.moveEnd.addEventListener(function(){
            _self.getPoint();
        });
        _self.billboardCollection = viewer.scene.primitives.add(new Cesium.BillboardCollection());
        _self.labelCollection = viewer.scene.primitives.add(new Cesium.LabelCollection());
        _self.getPoint();
    },
    getPoint:function(){
        var _self = this;
        var result = _self.data;
        _self.billboardCollection.removeAll();
        _self.labelCollection.removeAll();
        for(var i=0;i<result.length;i++){
            var contentTemp = result[i];
            //添加设备图标
            _self.billboardCollection.add({
                id:{"pointId":contentTemp.pointId,"type":"device","deviceType":contentTemp.deviceType,lon:contentTemp.lon,lat:contentTemp.lat,"channel":contentTemp.channel},   //图标的id
                position: Cesium.Cartesian3.fromDegrees(contentTemp.lon,  contentTemp.lat,2),   //图标的位置
                image : _self.getImageUrl(contentTemp.state,contentTemp.deviceType),  //图片的url地址
                width:52,
                height:146,
                scale : 0.8,     //图标的放大倍数
                scaleByDistance:new Cesium.NearFarScalar(6000, 0.8, 8500, 0.5),
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
            });
            _self.labelCollection.add({
                text : contentTemp.name,
                show : false,
                font : '14pt Source Han Sans CN',    //字体样式
                fillColor:Cesium.Color.BLACK,        //字体颜色
                backgroundColor:Cesium.Color.AQUA,    //背景颜色
                showBackground:true,                //是否显示背景颜色
                style: Cesium.LabelStyle.FILL,        //label样式
                outlineWidth : 2,
                verticalOrigin : Cesium.VerticalOrigin.CENTER,//垂直位置
                horizontalOrigin :Cesium.HorizontalOrigin.CENTER,//水平位置
                pixelOffset:new Cesium.Cartesian2(0,0)            //偏移
            });
        }
    },
    /**
     * 根据设备的在线状态和设备的类型获取图标的url地址
     * @param state   设备的在线状态
     * @param deviceType  设备的类型
     * @returns {string}
     */
    getImageUrl:function (state,deviceType) {
        var imageUrl = top.ctx + "/images/gis/mapicon2/";
        switch (deviceType) {
            case "electronicPolice":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "electricPoloce_off.png";
                } else {
                    imageUrl += "electricPoloce.png";
                }
                break;
            case "intelligentEntry":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "onkk_off.png";
                } else {
                    imageUrl += "onkk.png";
                }
                break;
            case "highSkyDetector":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "gdgq_off.png";
                } else {
                    imageUrl += "gdgq.png";
                }
                break;
            case "illegalParking":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "wztc_off.png";
                } else {
                    imageUrl += "wztc.png";
                }
                break;
            case "illegalWhistling":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "jzmd_off.png";
                } else {
                    imageUrl += "jzmd.png";
                }
                break;
            case "drivingGuidance":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "ydp_off.png";
                } else {
                    imageUrl += "ydp.png";
                }
                break;
            case "microwaveDetection":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "wbjcq_off.png";
                } else {
                    imageUrl += "wbjcq.png";
                }
                break;
            case "notComityPedestrian":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "blrxr.png";
                } else {
                    imageUrl += "blrxr.png";
                }
                break;
            case "pedestrianCare":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "xrga.png";
                } else {
                    imageUrl += "xrga.png";
                }
                break;
            case "peopleRedLight":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "xrchd.png";
                } else {
                    imageUrl += "xrchd.png";
                }
                break;
            case "trafficControl":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "jtgz.png";
                } else {
                    imageUrl += "jtgz.png";
                }
                break;
            case "trafficConstruction":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "dlsg.png";
                } else {
                    imageUrl += "dlsg.png";
                }
                break;
            case "signalControl":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "xhj_off.png";
                } else {
                    imageUrl += "xhj.png";
                }
                break;
            case "videoDetection":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "spjcq_off.png";
                } else {
                    imageUrl += "spjcq.png";
                }
                break;
            case "variableLane":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "kbcd_off.png";
                } else {
                    imageUrl += "kbcd.png";
                }
                break;
            case "policeOfficer":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "policeman.png";
                } else {
                    imageUrl += "policeman.png";
                }
                break;
            case "policeCar":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "policecar.png";
                } else {
                    imageUrl += "policecar.png";
                }
                break;
            default:
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "eyeGIShover_off.png";
                } else {
                    imageUrl += "eyeGIShover.png";
                }
                break;
        }
        return imageUrl;
    },
    //笛卡尔坐标系转WGS84坐标系
    Cartesian3_to_WGS84: function (point) {
        var cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z);
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var lng = Cesium.Math.toDegrees(cartographic.longitude);
        var alt = cartographic.height;
        // return {lat: lat, lng: lng, alt: alt};
        return [lng,lat];
    },
}