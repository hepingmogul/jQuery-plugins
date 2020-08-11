/**
 * @(#)odControl.js
 *
 * @description: 区域OD分析JS
 * @author: 尹飞 2020/4/20
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */
var 两江新区_center = [106.5166,29.6547];
var 两江新区_code = 500101000000;
var 两江新区_region = [[106.47923676883411,29.671838932073992],[106.48300358061458,29.621385726980815],[106.52650705836366,29.619737880315316],[106.5568024228904,29.638537464591806],[106.56300431970423,29.685430051788426],[106.54754543452964,29.69581564708097],[106.54459911080914,29.695364006896206],[106.53974346471783,29.68879141130726],[106.51463303448563,29.671215591332125],[106.47987198949853,29.67145946319436]];

var 沙坪坝区_code = 500106000000;
var 沙坪坝区_center = [106.4562,29.5406];
var 沙坪坝区_region = [[106.50624743834742,29.615022677767698],[106.49764945250229,29.61875051091775],[106.46622350366506,29.61762951748702],[106.46030798383424,29.607290239530812],[106.47377443004841,29.599810866504793],[106.50557336677214,29.607037388039664],[106.50647168750807,29.615111322175313]];

var 渝中区_code = 500103000000;
var 渝中区_center = [106.5706,29.5576];
var 渝中区_region = [[106.51853801262679,29.611056924155772],[106.5151128451947,29.609847713695512],[106.51356528140047,29.600557612870652],[106.52070355614133,29.59880852151207],[106.5185055896347,29.611232105457226]];


var 江北区_code = 500105000000;
var 江北区_center = [106.5686,29.6027];
var 江北区_region = [[106.57514284799271,29.635675521655475],[106.56947856237979,29.629246777049836],[106.55992866119746,29.617306047811752],[106.55366248288708,29.61288619017314],[106.52769444361682,29.613397159585286],[106.52546789716631,29.611220655663676],[106.52721212908864,29.600691884085045],[106.55164237397368,29.59670270498164],[106.57465466643043,29.61875793778876],[106.58272491389944,29.633956485270772],[106.57545073956595,29.63505319391545]];

var 渝北区_code = 500112000000;
var 渝北区_center = [106.6265,29.7212];
var 渝北区_region = [[106.54954430282909,29.71203434899547],[106.54976961783143,29.710491319376587],[106.55256636286619,29.70550642841961],[106.59134228413149,29.69085976768021],[106.5914949083797,29.68664316292904],[106.58038184606029,29.66984507927805],[106.58565091676964,29.660712406114364],[106.60890791444281,29.66302930385591],[106.61389953139258,29.690440881344596],[106.59555308392176,29.727646004645194],[106.55768675308047,29.727160918581983],[106.54979965154527,29.721184091516793],[106.54966164437639,29.71244701162177]];

var 北碚区_code = 500109000000;
var 北碚区_center = [106.3918,29.8085];
var 北碚区_region = [[106.46040746074392,29.690669604600668],[106.460425566571,29.68373910713299],[106.48255356465289,29.68614605167035],[106.49226533925413,29.677449061807756],[106.5280851002711,29.68555272185184],[106.54331468101681,29.695991176996714],[106.54500724595876,29.702180936339115],[106.5495000359362,29.70960432178735],[106.54895984713146,29.7144429333965],[106.54273977861298,29.71740747069942],[106.53238494471685,29.715210630436292],[106.5195993952062,29.703290333814955],[106.49942189011006,29.6946746227133],[106.46675147166248,29.693611671951793],[106.46085900500948,29.69148882148716]];


var OdControl = function(){
    this.init.apply(this, arguments);
};
OdControl.prototype = {
    view: null, //cesium视图对象
    odEntityList:[],//od线的实体集合，以便管理
    regionList : [],//区域信息集合
    popUplist : [],//气泡集合
    init: function (view) {
        this.view = view;
        //初始化od实例集合类
        this.odEntityList = new Cesium.EntityCollection();
        this.regionList.push({"regionCode":沙坪坝区_code,"regionPoint":沙坪坝区_region,"regionCenter":沙坪坝区_center});
        this.regionList.push({"regionCode":渝中区_code,"regionPoint":渝中区_region,"regionCenter":渝中区_center});
        this.regionList.push({"regionCode":江北区_code,"regionPoint":江北区_region,"regionCenter":江北区_center});
        this.regionList.push({"regionCode":渝北区_code,"regionPoint":渝北区_region,"regionCenter":渝北区_center});
        this.regionList.push({"regionCode":北碚区_code,"regionPoint":北碚区_region,"regionCenter":北碚区_center});
        this.regionList.push({"regionCode":两江新区_code,"regionPoint":两江新区_region,"regionCenter":两江新区_center});
    },
    /**
     * 获取区域与设备的关系
     */
    getRegionRelateDeviceData:function(){
        var _self = this;
        var url = top.ctx+"/device/queryAllPu.do";//查询pu表里面的所有设备，及所有抓拍功能的设备，如果后续有其他表里面的设备也会参数过车数据的话，需要修改该后台
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            success: function (resobj) {
                var data = resobj.resp;
                if(data && data.length > 0){
                    var regionRelateDevice = {};
                    for(var i=0;i<_self.regionList.length;i++){//获取区域的数据
                        var regionCode = _self.regionList[i].regionCode;
                        var points = _self.regionList[i].regionPoint;
                        for(var j=0;j<data.length;j++){//遍历设备，确定设备与区域的关联关系
                            if(_self.isInPolygon([data[j].longitude,data[j].latitude],points)){
                                if(regionRelateDevice.hasOwnProperty(regionCode)){
                                    var deviceList = regionRelateDevice[regionCode];
                                    deviceList = deviceList + "," + data[j].puId;
                                    regionRelateDevice[regionCode] = deviceList;
                                } else {
                                    var deviceList = "";
                                    deviceList = data[j].puId;
                                    regionRelateDevice[regionCode] = deviceList;
                                }
                            }
                        }
                    }
                    //console.info(regionRelateDevice);
                    _self.initBDAPRegionRelateDevice(regionRelateDevice);
                }
            }
        });
    },
    /**
     * 调用大数据接口，初始化设备与区域关系
     * @param data
     */
    initBDAPRegionRelateDevice:function(data){
        var url = top.ctx+"/indexAnalysis/initBDAPRegion.do";
        $.ajax({
            url: url,
            type: "post",
            data:
                {
                    "paramData":JSON.stringify(data)
                },
            success: function (resobj) {
                console.info(resobj);

            }
        });
    },

    /**
     * 获取区域OD数据
     * @param startTime
     * @param endTime
     */
    getRegionOdDate:function (startTime,endTime) {
        url = ctx + "";

        //data = data + "&extent=" + rect.toString() + "&polygon=" + extent;
        $.ajax({
            url: url,
            type: "post",
            traditional:true,
            data:  {"pointParam": JSON.stringify(data), "extent": rect.toString(), "polygon": extent},
            success: function (resobj) {
                _self.equipResultAll(resobj.resp);
            }
        });
    },
    /**
     * 绘制区域OD线
     * @param startPoint 起点
     * @param endPoint 终点
     * @param color 线颜色
     * @param width 线宽度
     * @param height 线曲率
     * @param number 车流量
     */
    drawODLine:function(startPoint,endPoint,color,width,height,number){
        var startPoint = Cesium.Cartesian3.fromDegrees(startPoint[0], startPoint[1]);
        var endPoint = Cesium.Cartesian3.fromDegrees(endPoint[0], endPoint[1]);
        var positions = Cesium.getLinkedPointList(startPoint, endPoint, height, 50);
        var glowingLine = viewer.entities.add({
            polyline: {
                positions: positions,
                width: (typeof width == 'undefined') ? 5 : width,
                //material: new Cesium.PolylineAttackLinkMaterialProperty({
                material: new Cesium.PolylineArrowLinkMaterialProperty({
                    color: color,
                    //color: color,
                    duration:1000
                }),
            }
        });
        var $pop = $(`<div style="color: rgb(250,250,112); position:absolute;height: 20px;width:300px;background-color: #00000000;user-select: none;">车流量数：${number}</div>`);
        this.popUplist.push($pop);
        $("body").append($pop);
        //显示气泡
        //var divPosition= Cesium.Cartesian3.fromDegrees(positions[positions.length/2][0],positions[positions.length/2][1],0);//div的坐标位置
        ysc.creatHtmlElement(viewer,$pop,positions[positions.length/2],[-75,-30],true);//将div加载到地图中

        this.odEntityList.add(glowingLine);
    },
    /**
     * 判断点是否在多边形内
     * @param checkPoint 点坐标
     * @param polygonPoints 多边形坐标
     * @returns {boolean}
     */
    isInPolygon:function (checkPoint, polygonPoints) {
        var counter = 0;
        var i;
        var xinters;
        var p1, p2;
        var pointCount = polygonPoints.length;
        p1 = polygonPoints[0];

        for (i = 1; i <= pointCount; i++) {
            p2 = polygonPoints[i % pointCount];
            if (
                checkPoint[0] > Math.min(p1[0], p2[0]) &&
                checkPoint[0] <= Math.max(p1[0], p2[0])
            ) {
                if (checkPoint[1] <= Math.max(p1[1], p2[1])) {
                    if (p1[0] != p2[0]) {
                        xinters =
                            (checkPoint[0] - p1[0]) *
                            (p2[1] - p1[1]) /
                            (p2[0] - p1[0]) +
                            p1[1];
                        if (p1[1] == p2[1] || checkPoint[1] <= xinters) {
                            counter++;
                        }
                    }
                }
            }
            p1 = p2;
        }
        if (counter % 2 == 0) {
            return false;
        } else {
            return true;
        }
    },
    /**
     * 清除OD线和车流量显示气泡
     */
    clear:function () {
        for(var i=0;i< this.odEntityList.values.length;i++ ){
            viewer.entities.remove(this.odEntityList.values[i]);
        }
        for (var i = 0; i < this.popUplist.length; i++) {
            this.popUplist[i].remove();
        }
        this.odEntityList.removeAll();
        this.popUplist = [];
    }
};