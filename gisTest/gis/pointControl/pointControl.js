/**
 * @(#)pointControl.js
 *
 * @description: 点位管理
 * @author: feiyin 2019/09/21
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */

var PointControl = function(){
    this.init.apply(this, arguments);
};

PointControl.prototype = {
    viewer: null, //cesium视图对象
    billboardCollection:null,//billboard的集合
    labelCollection:null,//billboard的集合
    pixelRange:15, //扩展屏幕空间边界框的像素范围
    policePopupMoveNum:1101,//警员警车气泡鼠标移动事件标识符
    policePopupClickNum:1102,//警员警车气泡鼠标点击事件标识符
    dataSource:null,//点位源
    dataSourcePromise:null,
    policeManCount:0,//记录警员数量
    pixelRange:15,//聚合的距离
    minimumClusterSize:3,//可以群集的最小屏幕空间对象数
    enabled:true,//是否启动聚合
    clusterDistance:50,//聚合像素距离
    init: function (viewer) {
        var _self = this;
        _self.view = viewer;
        viewer.scene.camera.moveEnd.addEventListener(function(){
            _self.getPoint();
        });
        //配置聚合
        _self.billboardCollection = viewer.scene.primitives.add(new Cesium.BillboardCollection());
        _self.labelCollection = viewer.scene.primitives.add(new Cesium.LabelCollection());
        _self.dataSource = new Cesium.CustomDataSource('point');
        _self.dataSource.clustering.enabled = _self.enabled;
        _self.dataSource.clustering.pixelRange = _self.pixelRange;
        _self.dataSource.clustering.minimumClusterSize = _self.minimumClusterSize;
        _self.dataSourcePromise = viewer.dataSources.add(_self.dataSource);
        _self.getPoint();


        /*viewer.scene.camera.moveEnd.addEventListener(function(){
            var height = viewer.camera.positionCartographic.height;
            if(height > 4000){
                _self.hideAll();
            }else{
                _self.showAll();
            }
        });*/
        _self.policePosition = window.setInterval(function(){//15秒定时获取警员最新定位
            _self.getPolicePosition();
        },1000*15)
    },
    //获取图片的base64
    getBase64 : function (imgUrl){
        var img = new Image();
        img.src = imgUrl;
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var dataURL = canvas.toDataURL();
        return dataURL;
    },
    //聚合的样式
    customStyle:function(){
        var _self = this;

        _self.dataSourcePromise.then(function(dataSource) {
            var pixelRange = 15;
            var minimumClusterSize = 3;
            var enabled = true;
            dataSource.clustering.enabled = enabled;
            dataSource.clustering.pixelRange = pixelRange;
            dataSource.clustering.minimumClusterSize = minimumClusterSize;
            dataSource.clustering.clusterEvent.addEventListener(function(clusteredEntities, cluster) {
                cluster.billboard.show = true;
                cluster.billboard.id = cluster.label.id;
                cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

                if (clusteredEntities.length >= 1 && clusteredEntities.length < 1000) {
                    cluster.label.show = true;
                    cluster.billboard.image = "data:image/png;base64,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";
                    cluster.billboard.pixelOffset = new Cesium.Cartesian2(0, -45);
                    cluster.billboard.scale = 0.6;
                    cluster.billboard.width = 52;
                    cluster.billboard.height = 146;
                    //cluster.billboard.scaleByDistance = new Cesium.NearFarScalar(6000, 0.8, 8500, 0.5);
                    cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
                    cluster.label.text = clusteredEntities.length+'';
                    cluster.label.font = '18px Helvetica';
                    cluster.label.scale = 0.6;
                    cluster.label.verticalOrigin = Cesium.VerticalOrigin.CENTER;
                    cluster.label.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
                    cluster.label.pixelOffset = new Cesium.Cartesian2(0,-117);
                    //cluster.label.scaleByDistance = new Cesium.NearFarScalar(6000, 0.8, 8500, 0.5);
                } else if(clusteredEntities.length >= 1000 && clusteredEntities.length < 10000){
                    cluster.label.show = true;
                    cluster.billboard.image = "data:image/png;base64,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";
                    cluster.billboard.pixelOffset = new Cesium.Cartesian2(0, -45);
                    cluster.billboard.scale = 0.8;
                    cluster.billboard.width = 52;
                    cluster.billboard.height = 146;
                    //cluster.billboard.scaleByDistance = new Cesium.NearFarScalar(6000, 0.8, 8500, 0.5);
                    cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
                    cluster.label.text = clusteredEntities.length+'';
                    cluster.label.font = '18px Helvetica';
                    cluster.label.scale = 0.6;
                    cluster.label.verticalOrigin = Cesium.VerticalOrigin.CENTER;
                    cluster.label.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
                    cluster.label.pixelOffset = new Cesium.Cartesian2(0,-140);
                    //cluster.label.scaleByDistance = new Cesium.NearFarScalar(6000, 0.8, 8500, 0.5);
                } else if(clusteredEntities.length >= 10000){
                    cluster.label.show = true;
                    cluster.billboard.image = "data:image/png;base64,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";
                    cluster.billboard.pixelOffset = new Cesium.Cartesian2(0, -45);
                    cluster.billboard.scale = 1.0;
                    cluster.billboard.width = 52;
                    cluster.billboard.height = 146;
                    //cluster.billboard.scaleByDistance = new Cesium.NearFarScalar(6000, 0.8, 8500, 0.5);
                    cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
                    cluster.label.text = clusteredEntities.length+'';
                    cluster.label.font = '18px Helvetica';
                    cluster.label.scale = 0.6;
                    cluster.label.verticalOrigin = Cesium.VerticalOrigin.CENTER;
                    cluster.label.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
                    cluster.label.pixelOffset = new Cesium.Cartesian2(0,-160);
                    //cluster.label.scaleByDistance = new Cesium.NearFarScalar(6000, 0.8, 8500, 0.5);
                }
            });
        });

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
    //获取聚合距离
    getClusterDistance:function(pixelDistance){
        var height = $("#div3d").height();
        var pt1 = new Cesium.Cartesian2(100,height);
        var pt2= new Cesium.Cartesian2(100+pixelDistance,height);

        var pick1= viewer.scene.globe.pick(viewer.camera.getPickRay(pt1), viewer.scene);
        var pick2= viewer.scene.globe.pick(viewer.camera.getPickRay(pt2), viewer.scene);

        //将三维坐标转成地理坐标
        var geoPt1= viewer.scene.globe.ellipsoid.cartesianToCartographic(pick1);
        var geoPt2= viewer.scene.globe.ellipsoid.cartesianToCartographic(pick2);
        //地理坐标转换为经纬度坐标
        var point1=[geoPt1.longitude / Math.PI * 180,geoPt1.latitude / Math.PI * 180];
        var point2=[geoPt2.longitude / Math.PI * 180,geoPt2.latitude / Math.PI * 180];
        return Math.sqrt(Math.pow((point1[0]- point2[0]),2)+Math.pow((point1[1]- point2[1]),2));
    },
    //获取视窗范围
    getParam:function(){
        //先获取地图div的宽和高
        var width = $("#div3d").width();
        var height = $("#div3d").height();
        var pt1 = new Cesium.Cartesian2(0,0);
        var pt2= new Cesium.Cartesian2(width,0);
        var pt3= new Cesium.Cartesian2(width,height);
        var pt4= new Cesium.Cartesian2(0,height);

        var pick1= viewer.scene.globe.pick(viewer.camera.getPickRay(pt1), viewer.scene);
        var pick2= viewer.scene.globe.pick(viewer.camera.getPickRay(pt2), viewer.scene);
        var pick3= viewer.scene.globe.pick(viewer.camera.getPickRay(pt3), viewer.scene);
        var pick4= viewer.scene.globe.pick(viewer.camera.getPickRay(pt4), viewer.scene);
        var fullExtentArr = eval($('#offlinegis_MapFullExtent').val());//地图配置的范围
        var point1 = [];
        var point2 = [];
        var point3 = [];
        var point4 = [];
        if(!pick1){
            var yIndex = 0;
            do {
                // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
                yIndex <= height ? yIndex += 10 : height;
                pt1 = new Cesium.Cartesian2(0,yIndex);
                pick1 = viewer.scene.globe.pick(viewer.camera.getPickRay(pt1), viewer.scene);
            } while (!pick1);
        }
        //将三维坐标转成地理坐标
        var geoPt1= viewer.scene.globe.ellipsoid.cartesianToCartographic(pick1);
        //地理坐标转换为经纬度坐标
        point1=[geoPt1.longitude / Math.PI * 180,geoPt1.latitude / Math.PI * 180];

        if(!pick2){
            var yIndex = 0;
            do {
                // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
                yIndex <= height ? yIndex += 10 : height;
                pt1 = new Cesium.Cartesian2(width,yIndex);
                pick2 = viewer.scene.globe.pick(viewer.camera.getPickRay(pt1), viewer.scene);
            } while (!pick2);
        }
        //将三维坐标转成地理坐标
        var geoPt2= viewer.scene.globe.ellipsoid.cartesianToCartographic(pick2);
        //地理坐标转换为经纬度坐标
        point2=[geoPt2.longitude / Math.PI * 180,geoPt2.latitude / Math.PI * 180];

        if(!pick3){
            point3 = [fullExtentArr[1],fullExtentArr[2]];
        } else {
            //将三维坐标转成地理坐标
            var geoPt3= viewer.scene.globe.ellipsoid.cartesianToCartographic(pick3);
            //地理坐标转换为经纬度坐标
            point3=[geoPt3.longitude / Math.PI * 180,geoPt3.latitude / Math.PI * 180];
        }
        if(!pick4){
            point4 = [fullExtentArr[0],fullExtentArr[2]];
        } else {
            //将三维坐标转成地理坐标
            var geoPt4= viewer.scene.globe.ellipsoid.cartesianToCartographic(pick4);
            //地理坐标转换为经纬度坐标
            point4=[geoPt4.longitude / Math.PI * 180,geoPt4.latitude / Math.PI * 180];
        }
        var minLon = point1[0],maxLon = point1[0],maxLat = point1[1],minLat = point1[1];
        var lonList = [point1[0],point2[0],point3[0],point4[0]];
        var latList = [point1[1],point2[1],point3[1],point4[1]];
        for(var i=0;i<lonList.length;i++){
            if(lonList[i] < minLon){
                minLon = lonList[i];
            }
            if(lonList[i] > maxLon){
                maxLon = lonList[i];
            }
        }
        for(var i=0;i<latList.length;i++){
            if(latList[i] < maxLat){
                maxLat = latList[i];
            }
            if(latList[i] > minLat){
                minLat = latList[i];
            }
        }
        return {minLon:minLon,maxLon:maxLon,maxLat:maxLat,minLat:minLat,isMaxZoom:1,clusterDistance:this.getClusterDistance(this.clusterDistance),deviceTypes:this.getDeviceType()};
    },
    //获取要显示的设备类型
    getDeviceType:function(){
        var deviceType = [];
        $("#deviceTypesList").find(".active").each(function () {
            var flog = true;
            var typeNum = $(this).attr("typeNum");
            for(var i=0;i<deviceType.length;i++){
                if(deviceType[i] == typeNum){
                    flog = false;
                }
            }
            if(flog && typeNum){
                deviceType.push(typeNum);
            }
        });
        if(deviceType.length==0){
            return "null";
        }else{
            return deviceType.toString();
        }

    },
    getPoint:function(){
        var _self = this;
        //请求后台，获取所有的设备
        $.ajax({
            async: true,
            cache: false,
            type: "POST",
            data: _self.getParam(),
            url: top.ctx+"/gis/getDevicePointInView.do",
            dataType: "json",
            success: function (resobj) {
                var result = resobj.resp;
                /*for(var i=0;i<_self.entityCollection.values.length;i++){
                    viewer.entities.remove(_self.entityCollection.values[i]);
                }
                _self.entityCollection.removeAll();*/
                _self.billboardCollection.removeAll();
                _self.labelCollection.removeAll();
                _self.policeManCount = 0;
                for(var i=0;i<result.length;i++){
                    var entity;
                    var tempResult = result[i];
                    if(tempResult.size<2) {//单个
                        var contentTemp = tempResult.oneFeature;
                        if(contentTemp.deviceType=="policeOfficer"){//警员计数
                            _self.policeManCount++;
                        }
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
                        /*_self.labelCollection.add({
                            text : "",
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
                        });*/
                    }else if (tempResult.size >= 1 && tempResult.size < 1000) {
                        //添加聚合图标
                        _self.labelCollection.add({
                            id:{"islabel":true,type:"deviceCluster",lon:tempResult.lon,lat:tempResult.lat,size:tempResult.size,features:tempResult.includeFeatures.features},
                            text : tempResult.size+'',
                            position: Cesium.Cartesian3.fromDegrees(tempResult.lon,  tempResult.lat,2),   //图标的位置
                            show : true,
                            font : '18px Helvetica',    //字体样式
                            scale : 0.6,//label标签的缩放级别
                            verticalOrigin : Cesium.VerticalOrigin.CENTER,//垂直位置
                            horizontalOrigin :Cesium.HorizontalOrigin.CENTER,//水平位置
                            pixelOffset:new Cesium.Cartesian2(1,-72)            //偏移
                        });
                        _self.billboardCollection.add({
                            id:{type:"deviceCluster",lon:tempResult.lon,lat:tempResult.lat,size:tempResult.size,features:tempResult.includeFeatures.features},
                            position: Cesium.Cartesian3.fromDegrees(tempResult.lon,  tempResult.lat,2),   //图标的位置
                            image : top.ctx+'/images/gis/mapicon2/m0.png',  //图片的url地址
                            width:52,
                            height:146,
                            scale : 0.6,     //图标的放大倍数
                            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
                        });

                    }  else if(tempResult.size >= 1000 && tempResult.size < 10000){
                        //添加聚合图标
                        _self.labelCollection.add({
                            id:{"islabel":true,type:"deviceCluster",lon:tempResult.lon,lat:tempResult.lat,size:tempResult.size,features:tempResult.includeFeatures.features},
                            position: Cesium.Cartesian3.fromDegrees(tempResult.lon,  tempResult.lat,2),   //图标的位置
                            text : tempResult.size+'',
                            show : true,
                            font : '18px Helvetica',    //字体样式
                            scale : 0.6,//label标签的缩放级别
                            verticalOrigin : Cesium.VerticalOrigin.CENTER,//垂直位置
                            horizontalOrigin :Cesium.HorizontalOrigin.CENTER,//水平位置
                            pixelOffset:new Cesium.Cartesian2(1,-95)          //偏移
                        });
                        _self.billboardCollection.add({
                            id:{type:"deviceCluster",lon:tempResult.lon,lat:tempResult.lat,size:tempResult.size,features:tempResult.includeFeatures.features},
                            position: Cesium.Cartesian3.fromDegrees(tempResult.lon,  tempResult.lat,2),   //图标的位置
                            image : top.ctx+'/images/gis/mapicon2/m0.png',  //图片的url地址
                            width:52,
                            height:146,
                            scale : 0.8,     //图标的放大倍数
                            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
                        });

                    } else {
                        //添加聚合图标
                        _self.labelCollection.add({
                            id:{"islabel":true,type:"deviceCluster",lon:tempResult.lon,lat:tempResult.lat,size:tempResult.size,features:tempResult.includeFeatures.features},
                            position: Cesium.Cartesian3.fromDegrees(tempResult.lon,  tempResult.lat,2),   //图标的位置
                            text : tempResult.size+'',
                            show : true,
                            font : '18px Helvetica',    //字体样式
                            scale : 0.6,//label标签的缩放级别
                            verticalOrigin : Cesium.VerticalOrigin.CENTER,//垂直位置
                            horizontalOrigin :Cesium.HorizontalOrigin.CENTER,//水平位置
                            pixelOffset:new Cesium.Cartesian2(1,-120)        //偏移
                        });
                        _self.billboardCollection.add({
                            id:{type:"deviceCluster",lon:tempResult.lon,lat:tempResult.lat,size:tempResult.size,features:tempResult.includeFeatures.features},
                            position: Cesium.Cartesian3.fromDegrees(tempResult.lon,  tempResult.lat,2),   //图标的位置
                            image : top.ctx+'/images/gis/mapicon2/m0.png',  //图片的url地址
                            width:52,
                            height:146,
                            scale : 1.0,     //图标的放大倍数
                            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
                        });

                    }
                    //_self.entityCollection.add(entity);
                }
                 //flashControl.imgRotateAndEnlarge2(policeCoord,top.ctx+"/images/cesium/policeAround/1.png",null,50,50,1);
                 //flashControl.imgRotateAndEnlarge2(policeCoord,top.ctx+"/images/cesium/policeAround/2.png",null,40,40,2);
                 //flashControl.imgRotateAndEnlarge2(policeCoord,top.ctx+"/images/cesium/policeAround/3.png",null,30,30,3);
                 //flashControl.imgRotateAndEnlarge2(policeCoord,top.ctx+"/images/cesium/policeAround/4.png",null,20,20,4);

                //  _self.customStyle();
            }
        });
    },
    /**
     * 显示或者隐藏某一个类型的设备的图层
     * @param deviceType
     */
    show:function(isSelected,deviceType){

    },
    //隐藏所有设备图层
    hideAll:function(){

    },
    //显示所有设备图层
    showAll:function(){

    },
    //显示聚合列表
    showDeviceList:function(cor,list){
        var _self = this;
        if($("#deviceClusterPopup").length > 0){
            $("#deviceClusterPopup").remove();
        }
        var html = '<div class="pa PopupsBox" id="deviceClusterPopup" style="width:312px;">' +
            '<div class="PopupsHeader">' +
            '<h1>设备列表</h1>' +
            '<div class="windowGroup PopUpClose_pos">' +
            '<ul>' +
            '<li class="windowIcon04"></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '<div class="gis_selectContent">' +
            '<div class="listDetails " style="max-height:200px;overflow-y:auto">' +
            '<div class="devType03">';
        for(var i=0;i<list.length;i++){
            var feature = list[i];
            html += '<dl onclick="pointControl.getPointInfo(\''+feature.pointId+'\',\['+feature.lon+','+feature.lat+'\],\''+feature.deviceType+'\',\''+feature.channel+'\')"><dt  style="background-image:url(' + _self.getZtreeImageUrl(feature.state,feature.deviceType) + ')"></dt><dd>'+feature.name+'</dd></dl>'
        }
        html += '</div></div></div></div>';
        $("body").append(html);
        $("#deviceClusterPopup").find(".windowIcon04").unbind("click").bind("click",function () {
            $("#deviceClusterPopup").remove();
        });
        var divPosition= Cesium.Cartesian3.fromDegrees(cor[0],cor[1]);//div的坐标位置
        ysc.creatHtmlElement(viewer,$("#deviceClusterPopup"),divPosition,[0,-(parseInt($("#deviceClusterPopup").css("height"))+82)],true);//将div加载到地图中
    },
    getPointInfo:function(pointId,coordinate,deviceType,channel){
        var _self = this;
        var url ="";
        if(deviceType=="signalControl"){
            url =top.ctx + "/gis/queryDevicePointById.do?pointType=1";
        }else if(deviceType=="microwaveDetection" ){
            url =top.ctx + "/gis/queryDevicePointById.do?pointType=2";
        }else if(deviceType=="videoDetection"){
            url =top.ctx + "/gis/queryDevicePointById.do?pointType=3";
        }else if(deviceType=="drivingGuidance"){
            url =top.ctx + "/gis/getGuidanceById.do";
        }else{
            url = top.ctx + "/gis/queryDevicePointById.do";
        }
        $.ajax({
            type: "POST",
            url: url,
            async: false,
            data:{
                "pointId":pointId,
                "userName":parent.globeUsername,
                "channel":channel
            },
            dataType: "json",
            success: function (resp) {
                if(!resp) return;
                $("#deviceClusterPopup").remove();//隐藏聚合气泡
                var content = resp.data;
                if(content && content != "undefined" && resp.code == 200) {
                    if(deviceType=="signalControl"|| deviceType== "microwaveDetection" || deviceType=="videoDetection"){
                        _self.addPopUp(content.extendData,coordinate,deviceType);
                    }else if(deviceType=="drivingGuidance"){
                        _self.addGuidancePopUp(content,coordinate);
                    }else{
                        _self.addPopUp(content,coordinate);
                    }

                }
            }
        });
    },
    addPopUp : function(content,coordinate,deviceType){
        var _self = this;
        if(!content.name){
            content.name="未知"
        }
        if(!content.name){
            content.name="未知"
        }
        if(!content.deviceid){
            content.deviceid="未知"
        }
        if(!content.regionname||content.regionname=="null"){
            content.regionname="未知"
        }
        if(!content.supplier){
            content.supplier="未知"
        }
        var state = "";
        if(content.state){
            state = content.state;
        }
        if(content.status){
            state = content.status;
        }
        var ip = content.ip ||"未知";
        $('#devicePopup').find("#devicePopupIp").text(ip);
        $('#devicePopup').find("#regionName").text(content.regionname);
        if(deviceType=="signalControl"){//若为信号机
            $('#devicePopup').find("#deviceTitle").text("信号控制");
            $('#devicePopup').find("#deviceNameLi").html(`路口名称：<span id="devicePopupName" title="`+content.name+`">`+content.name+`</span>`);
            $('#devicePopup').find("#devicePopupName").text(content.crossName);
            $('#devicePopup').find("div[type='aroundMonitor']").hide();
            $('#devicePopup').find("div[type='videoReplay']").hide();
            $('#devicePopup').find("div[type='picMonitor']").hide();
            $('#devicePopup').find("div[type='signalRealTimeState']").show();
            $('#devicePopup').find("#deviceIpLi").hide();
            $('#devicePopup').find("#supplierLi").show();
            $('#devicePopup').find("#supplier").text(content.supplier);
        }else if(deviceType=="microwaveDetection"){
            $('#devicePopup').find("div[type='aroundMonitor']").hide();
            $('#devicePopup').find("div[type='videoReplay']").hide();
        }else{
            $('#devicePopup').find("div[type='aroundMonitor']").show();
            $('#devicePopup').find("div[type='videoReplay']").show();
            $('#devicePopup').find("div[type='picMonitor']").show();
            $('#devicePopup').find("div[type='signalRealTimeState']").hide();
            $('#devicePopup').find("#deviceNameLi").html(`设备名称：<span id="devicePopupName" title="`+content.name+`">`+content.name+`</span>`);
            $('#devicePopup').find("#deviceIpLi").show();
            $('#devicePopup').find("#supplierLi").hide();
        }
        if(content.type == "125" ){//智能卡口才有图片监控
            $('#devicePopup').find("div[type='picMonitor']").show();
        } else {
            $('#devicePopup').find("div[type='picMonitor']").hide();
        }
        switch(content.type){//根据设备类型修改气泡
            case "120":
                $('#devicePopup').find("#deviceTitle").text("电子警察");
                $('#devicePopup').find("div[type='aroundMonitor']").text("视频监控");
                break;
            case "125":
                $('#devicePopup').find("#deviceTitle").text("智能卡口");
                $('#devicePopup').find("div[type='aroundMonitor']").text("视频监控");
                break;
            case "132":
                $('#devicePopup').find("#deviceTitle").text("视频监控");
                $('#devicePopup').find("div[type='aroundMonitor']").text("视频监控");
                break;
            case "148":
                $('#devicePopup').find("#deviceTitle").text("视频检测");
                $('#devicePopup').find("div[type='aroundMonitor']").text("视频监控");
                break;
            case "142":
                $('#devicePopup').find("#deviceTitle").text("不礼让行人");
                $('#devicePopup').find("div[type='aroundMonitor']").text("视频监控");
                break;
            case "146":
                $('#devicePopup').find("#deviceTitle").text("高空瞭望");
                $('#devicePopup').find("div[type='aroundMonitor']").text("视频监控");
                break;
            case "143":
                $('#devicePopup').find("#deviceTitle").text("违章停车");
                $('#devicePopup').find("div[type='aroundMonitor']").text("视频监控");
                break;
            case "147":
                $('#devicePopup').find("#deviceTitle").text("微波检测");
                $('#devicePopup').find("div[type='aroundMonitor']").text("视频监控");
                break;
            case "144":
                $('#devicePopup').find("#deviceTitle").text("违法鸣笛");
                $('#devicePopup').find("div[type='aroundMonitor']").text("视频监控");
                break;
            case "149":
                $('#devicePopup').find("#deviceTitle").text("行人关爱");
                $('#devicePopup').find("div[type='aroundMonitor']").text("视频监控");
                break;
            case "145":
                $('#devicePopup').find("#deviceTitle").text("行人闯红灯");
                $('#devicePopup').find("div[type='aroundMonitor']").text("视频监控");
                break;
            case "150":
                $('#devicePopup').find("#deviceTitle").text("可变车道");
                $('#devicePopup').find("div[type='aroundMonitor']").text("视频监控");
                break;
            default :
                $('#devicePopup').find("#deviceTitle").text("设备信息");
                $('#devicePopup').find("div[type='aroundMonitor']").text("视频监控");
                break;
        }

        if(state==null||state==""||state=="0"||state=="113"){
            $('#devicePopup').find("#state").text("离线");
        }else{
            $('#devicePopup').find("#state").text("在线");
        }
        if($('#popup').length == 0){//重新加载气泡
            $("body").append(`
            <div class='ysc-dynamic-layer' id='popup' style="pointer-events: auto;">
                <!------------------------------装饰用图------------------------------->
                <div class="tc-debris tc-debris-01"></div>
                <div class="tc-debris tc-debris-02"></div>
                <div class="tc-debris tc-debris-03"></div>
                <div class="tc-debris tc-debris-04"></div>
                <div class="tc-debris tc-debris-05"></div>
                <div class="tc-debris tc-debris-06"></div>
                <div class="tc-debris tc-debris-07"></div>
                <div class="tc-debris tc-debris-08"></div>
                <div class="tc-debris tc-debris-09"></div>
                <div class="bubble-triangle-new"></div>
                <div class="bubble-light"></div>
                <div class='bubble-Gis01'>
            
                </div>
            </div>
            `)
        }

        $('#popup').find(".bubble-Gis01").html(document.getElementById("devicePopup").innerHTML);
        popupControl.showPopup($('#popup'),coordinate[0],coordinate[1]);
        var obj = $('#popup');
        obj.find(".windowIcon04").unbind("click").bind("click",function(e){
            popupControl.removePopup($("#popup"));
        });

        //图片监控
        obj.find("div[type='picMonitor']").unbind("click").click(function(){
            monitor.initWebSocket(content.deviceid,content.name);
        });
        //视频监控
        obj.find("div[type='aroundMonitor']").click(function(){
            /*if(content.type=="146"){
                _self.playVideoForHighSky(content);
            }else{
                _self.playVideo(content);
            }*/
            _self.playVideo(content);
        });
        //录像回放
        obj.find("div[type='videoReplay']").click(function(){
            _self.replayVideo(content);
        });
        //实时状态机
        obj.find("div[type='signalRealTimeState']").click(function(){
            $("#crossId").val(content.crossID);
            $("#signalControlerId").val(content.puid);
            signaler.show();
        })
    },

    /**
     * 录像回放
     */
    replayVideo:function(content){
        var msgString = content.deviceid+"@"+content.channelid+"@"+content.name
            +"@"+content.lon+"@"+content.lat + "@" + content.state;
        window.top.sendMsgToClient(109, msgString);
    },
    /**
     * 双击查看实时视频
     */
    playVideo : function(content){
        var lontemp = content.lon;
        var lattemp = content.lat;
        // if((content.lon >= -180 && content.lon <= 180)&& (content.lat >= -90 && content.lat <= 90)){
        //     var pnt = [content.lon*1,content.lat*1];
        //     // var cor =ZT.Utils.transformPoint(pnt);
        //     lontemp = pnt[0];
        //     lattemp  = pnt[1];
        // }
        var tmpLL = [lontemp*1,lattemp*1];
        var tmpPix = carTrack.getPixelFromCoordinate(tmpLL);
        //300是gis地图的水平距左距离，60是CS工具栏高度，24是gis导航栏高度
        var tmpPixStr =(Math.round(tmpPix[0]) + 200)+"@"+(Math.round(tmpPix[1]-200));
        if(content.state == 0 || content.state == 113 || content.state == ""){
            content.state = 113;
        }else {
            content.state = 114;
        }
        if(!(content.lon >= -180 && content.lon <= 180)|| !(content.lat >= -90 && content.lat <= 90)){
            var pnt = [content.lon*1,content.lat*1];
            pnt = ZT.Utils.transformOffToESPG(pnt);
            content.lon = pnt[0];
            content.lat = pnt[1];
        }
        var channelid = content.channelid || content.channel;
        var msgString = content.deviceid+"@"+channelid+"@"+content.name
            +"@"+content.lon+"@"+content.lat + "@" + tmpPixStr + "@" + content.state;
        window.top.sendMsgToClient(107, msgString);
        top.window.openVideoFlag=0;
    },

    /**
     * 高空瞭望视频
     */
    playVideoForHighSky : function(content){
        var lontemp = content.lon;
        var lattemp = content.lat;
        var tmpLL = [lontemp*1,lattemp*1];
        var tmpPix = carTrack.getPixelFromCoordinate(tmpLL);
        //300是gis地图的水平距左距离，60是CS工具栏高度，24是gis导航栏高度
        var tmpPixStr =(Math.round(tmpPix[0]) + 10)+"@"+(Math.round(tmpPix[1])+101);
        if(content.state == 0 || content.state == 113 || content.state == ""){
            content.state = 113;
        }else {
            content.state = 114;
        }
        if(!(content.lon >= -180 && content.lon <= 180)|| !(content.lat >= -90 && content.lat <= 90)){
            var pnt = [content.lon*1,content.lat*1];
            pnt = ZT.Utils.transformOffToESPG(pnt);
            content.lon = pnt[0];
            content.lat = pnt[1];
        }
        var msgString = content.deviceid+"海康AR球机@PCCLoud://UP_"+ highSkyIp+":"+highSkyPort+"_"
            +highSkyAccount+"_"+highSkyPassword+"&"+content.sceneCode+"_"+"500"+"_"+"200"+"_"+"1230"+"_"+"500";
        window.top.sendMsgToClient(107, msgString);
        top.window.openVideoFlag=0;
    },

    /**
     * 显示警员气泡
     * @param pointId 警员的id
     */
    showPoliceManPopup: function (pointId,coordinate) {
        var _self = this;
        var url = top.ctx + "/police/queryPoliceManById.do";
        ZT.Utils.Ajax().request(url,{
            data : "id="+pointId,
            success :function(resobj){
                if(!resobj) return;
                var content = eval("(" + resobj.response + ")");
                if(content && content != "undefined" && content.status == "0" && content.resp) {
                    _self.addPoliceManPopUp(content.resp,coordinate);
                }
            },
            failure : function(resobj){
                layer.msg("获取警车点位信息失败");
            }
        });

    },

    addPoliceManPopUp:function(content,coordinate){
        var _self = this;
        var data = content;
        var state = "";
        var name = data.NAME||"未知";
        var policeNumber = data.POLICENUMBER||"未知";
        var mobilePhone = data.MOBILEPHONE||"未知";
        if(data.STATE==1){
            state="在线";
        }else{
            state="离线";
        }
        var regionName = data.DEPT_NAME; // _self.getRegionName(data.regionId);
        if(!regionName){
            regionName = "未知";
        }
        $("#policeManPopup").remove();//清除上次的警员气泡
        var $p = $('<div class="pa PopupsBox" id="policeManPopup" style="width:412px;left:-117px;top:4px;display: none;">'
            +'<div class="PopupsHeader">'
            +'<h1>警员</h1>'
            +'<div class="windowGroup PopUpClose_pos">'
            +'<ul>'
            +'<li class="windowIcon04"></li>'
            +'</ul>'
            +'</div>'
            +'</div>'
            +'<div class="PopupsContent01 p10">'
            +'<div style="display: inline-block;float:left;width:148px;height: 120px;"><img style="width:148px;height: 120px;" src="'+data.AVATER+'" onerror="this.src=\'images/default/jy_mrt.png\';"></div>'
            +'<div class="lh200" style="display: inline-block;margin-left:10px;">'
            +'<ul>'
            +'<li>警员名称：  '+name+'</li>'
            +'<li>警员编号：  '+data.POLICE_NUMBER+'</li>'
            // +'<li>警员性别：  '+data.gender+'</li>'
            // +'<li>警员年龄：  '+data.age+'</li>'
            +'<li>手机号码：  '+mobilePhone+'</li>'
            //
            +'<li>在线状态：  在线</li>'
            +'<li>所属区域：  '+regionName+'</li>'


            +'</ul>'
            +'</div>'

            // +'<div class="lh200" style="position: absolute;bottom: 45px;">'
            // +'<ul>'
            // +'<li>警员名称： '+data.name+' </li>'
            // +'<li>警员编号： '+data.policeNumber+' </li>'
            // +'</ul>'
            // +'</div>'

            +'<div class="mt10 tc" style="">'
            +'<div class="EPBut01 dib" id="pmSsgz">实时跟踪</div>'
            +'<div class="EPBut01 dib" id="pmGjhf">轨迹回放</div>'
            +'<div class="EPBut01 dib" id="pmZpcj">指派出警</div>'
            +'<div class="EPBut01 dib" id="pmJyhx">警员画像</div>'
            +'</div>'
            +'</div>'
            +'<div class="gis_bubble_triangle"></div>'
            +'</div>'
        );
        var coor = null;
        var reg = new RegExp('^0');
        if (!reg.test(coordinate[0]) && !reg.test(coordinate[1])) {
            coor = [parseFloat(coordinate[0]), parseFloat(coordinate[1])];
        }
        if (!coor) {
            return;
        }
        //地图定位到轨迹的起点位置
        viewer.camera.flyTo({
            destination:Cesium.Cartesian3.fromDegrees(coor[0], coor[1],1182.57803)
        });
        $("body").append($p);
        var divPosition= Cesium.Cartesian3.fromDegrees(coor[0],coor[1]);//div的坐标位置
        ysc.creatHtmlElement(viewer,$("#policeManPopup"),divPosition,[0,-(parseInt($p.css("height"))+90)],true);//将div加载到地图中
        $("#policeManPopup").show();

        /*$p.find("img").click(function(){
            var $f = $('<div class="Preview-fullscreen" style="background:grey;">'
                +'<img id="fullscreenimg" src="'+data.avater+'" />'
                +' <a id="closeFullButton" href="javascript:void(-1)" class="Preview_close" style="top:5px;"></a>'
                +'</div>');
            $f.find("#closeFullButton").unbind().click(function(){
                $f.remove();
            });
            $f.find("#fullscreenimg").unbind().dblclick(function(){
                $f.remove();
            });
            // 先清除，避免重复
            parent.$("div.Preview-fullscreen").remove();
            parent.$("body").append($f);
        });*/
        $p.find(".windowIcon04").bind('click',function(){
            popupControl.removePopup($('#policeManPopup'));
        });
        policeTrack.stopRealTimeTrack();
        //实时跟踪
        $p.find("#pmSsgz").bind('click',function(){
            popupControl.removePopup($('#policeManPopup'));
            flashControl.clearAll();
            var billboard = null;
            for(var i=0;i<pointControl.billboardCollection.length;i++){
                if(pointControl.billboardCollection.get(i).id.pointId == data.ID){
                    billboard = pointControl.billboardCollection.get(i);
                }
            }
            var entity = flashControl.imgRotateAndEnlarge(data.LONGITUDE,data.LATITUDE,top.ctx+"/images/cesium/circular_b_01.png");
            policeTrack.initTrack(data.ID,data.LONGITUDE,data.LATITUDE,billboard,data.NAME,entity,"policeMan");

        });
        //轨迹回放
        $p.find("#pmGjhf").bind('click',function(){
            policeTrack.historyTrack("policeman",data.ID);
        });
        //指派出警
        $p.find("#pmZpcj").bind('click',function(){
            flashControl.clearAll();
            var lon = data.longitude || data.LONGITUDE;
            var lat = data.latitude || data.LATITUDE;
            //如果参数中的records为高德接口获取的坐标，需要将其转化为WGS84坐标系的坐标
            var tempCor = gcoord.transform(
                [parseFloat(lon), parseFloat(lat)],    // 经纬度坐标
                gcoord.WGS84,               // 当前坐标系
                gcoord.AMap                 // 目标坐标系
            );
            var corForPolice = tempCor[0]+","+tempCor[1];//警员的坐标即为出警的起始坐标

            if(abnormalJam.destinationCor[0]&&abnormalJam.destinationCor[1]){
                var dCor = abnormalJam.destinationCor[0]+","+abnormalJam.destinationCor[1];
                abnormalJam.searchRoutePlan(corForPolice,dCor,abnormalJam.destinationName,"警员所在位置");
                $("#routeDivForZpcj").find("#zpcjDestinationInput").val(abnormalJam.destinationName);
                $("#routeDivForZpcj").show();
            }else{
                layer.msg("请在地图上点击出警终点");
                _self.showMouseTitle(corForPolice,"policeMan",function(handler){//显示跟随鼠标的title
                    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)//移除鼠标点击事件
                });
                //取消出警绑定事件
                $(".cancelOutPoliceForZpcj").unbind().bind("click",function(){
                    $("#routeDivForZpcj").hide();
                    carTrack.clearPathPlan();
                    flashControl.clearAll();
                })
            }
            _self.closeOther();//关闭其他看板
            setTimeout(function(){
                popupControl.removePopup($('#policeManPopup'));
            },500)
        });
    },

    /**
     * 显示警车气泡
     * @param pointId 警车的id
     */
    showPoliceCarPopup: function (pointId,coordinate) {
        var _self = this;
        var url = top.ctx + "/police/queryPoliceCarById.do";
        ZT.Utils.Ajax().request(url,{
            data : "id="+pointId,
            success :function(resobj){
                if(!resobj) return;
                var content = eval("(" + resobj.response + ")");
                if(content && content != "undefined" && content.status == "0" && content.resp) {
                    _self.addPoliceCarPopUp(content.resp,coordinate);
                }
            },
            failure : function(resobj){
                layer.msg("获取警车点位信息失败")
            }
        });

    },
    addPoliceCarPopUp:function(content,coordinate){
        var _self = this;
        var data = content;
        var state = "";
        if(data.state==1){
            state="在线";
        }else{
            state="离线";
        }
        var regionName = data.ORG_NAME; // _self.getRegionName(data.regionId);
        if(!regionName){
            regionName = "未知";
        }
        var plateNum = data.PLATE_NUM||"未知";
        var module = data.MODULE||"未知";
        var brand = clppJson[data.BRAND]||"未知";
        $("#policeCarPopup").remove();//清除上次的警车气泡
        var $p = $('<div class="pa PopupsBox" id="policeCarPopup"  style="width:412px;display: none;">'
            +'<div class="PopupsHeader">'
            +'<h1>警车</h1>'
            +'<div class="windowGroup PopUpClose_pos">'
            +'<ul>'
            +'<li class="windowIcon04"></li>'
            +'</ul>'
            +'</div>'
            +'</div>'
            +'<div class="PopupsContent01 p10">'
            +'<div style="display: inline-block;float:left;width:148px;height: 120px;"><img style="width:148px;height: 120px;" src="'+data.IMG_URL+'" onerror="this.src=\'images/default/jc_mrt.png\';"></div>'
            +'<div class="lh200" style="display: inline-block;margin-left:10px;">'
            +'<ul>'
            +'<li>号牌号码： '+plateNum+' </li>'
            +'<li>所属单位：  '+regionName+'</li>'
            +'<li>在线状态：  '+state+'</li>'
            +'<li>车辆品牌：  '+brand+'</li>'
            +'<li>车辆型号：  '+module+'</li>'

            +'</ul>'
            +'</div>'

            // +'<div class="lh200" style="position: absolute;bottom: 45px;">'
            // +'<ul>'
            // +'<li>号牌号码： '+data.licencePlateNumber+' </li>'
            // +'</ul>'
            // +'</div>'

            +'<div class="mt10 tc" style="">'
            // +'<div class="EPBut01 dib" id="pcSsgz">实时跟踪</div>'
            // +'<div class="EPBut01 dib" id="pcGjhf">轨迹回放</div>'
            +'<div class="EPBut01 dib" id="pcZpcj">指派出警</div>'
            +'</div>'
            +'</div>'
            +'<div class="gis_bubble_triangle"></div>'
            +'</div>'
        );

        var coor = null;
        var reg = new RegExp('^0');
        if (!reg.test(coordinate[0]) && !reg.test(coordinate[1])) {
            coor = [parseFloat(coordinate[0]), parseFloat(coordinate[1])];
        }
        if (!coor) {
            return;
        }
        //地图定位到轨迹的起点位置
        viewer.camera.flyTo({
            destination:Cesium.Cartesian3.fromDegrees(coor[0], coor[1],1182.57803)
        });
        $("body").append($p);
        var divPosition= Cesium.Cartesian3.fromDegrees(coor[0],coor[1]);//div的坐标位置
        ysc.creatHtmlElement(viewer,$("#policeCarPopup"),divPosition,[0,-(parseInt($p.css("height"))+90)],true);//将div加载到地图中
        $("#policeCarPopup").show();

        /* $p.find("img").click(function(){
             var $f = $('<div class="Preview-fullscreen" style="background:grey;">'
                 +'<img id="fullscreenimg" src="'+data.imgUrl+'" />'
                 +' <a id="closeFullButton" href="javascript:void(-1)" class="Preview_close" style="top:5px;"></a>'
                 +'</div>');
             $f.find("#closeFullButton").unbind().click(function(){
                 $f.remove();
             });
             $f.find("#fullscreenimg").unbind().dblclick(function(){
                 $f.remove();
             });
             // 先清除，避免重复
             parent.$("div.Preview-fullscreen").remove();
             parent.$("body").append($f);
         });*/
        $p.find(".windowIcon04").bind('click',function(){
            popupControl.removePopup($('#policeCarPopup'));
        });
        /*policeTrack.stopRealTimeTrack();
        //实时跟踪
        $p.find("#pmSsgz").bind('click',function(){
            popupControl.removePopup($('#policeManPopup'));
            flashControl.clearAll();
            var billboard = null;
            for(var i=0;i<pointControl.billboardCollection.length;i++){
                if(pointControl.billboardCollection.get(i).id.pointId == data.ID){
                    billboard = pointControl.billboardCollection.get(i);
                }
            }
            var entity = flashControl.imgRotateAndEnlarge(data.LONGITUDE,data.LATITUDE,top.ctx+"/images/cesium/circular_b_01.png");
            policeTrack.initTrack(data.ID,data.LONGITUDE,data.LATITUDE,billboard,data.NAME,entity,"policeCar");

        });
        //轨迹回放
        $p.find("#pmGjhf").bind('click',function(){
            policeTrack.historyTrack("policeman",data.ID);
        });*/
        //指派出警
        $p.find("#pcZpcj").bind('click',function(){
            flashControl.clearAll();
            var lon = data.LONGITUDE;
            var lat = data.LATITUDE;
            //如果参数中的records为高德接口获取的坐标，需要将其转化为WGS84坐标系的坐标
            var tempCor = gcoord.transform(
                [parseFloat(lon), parseFloat(lat)],    // 经纬度坐标
                gcoord.WGS84,               // 当前坐标系
                gcoord.AMap                 // 目标坐标系
            );
            var corForPolice = tempCor[0]+","+tempCor[1];
            if(abnormalJam.destinationCor[0]&&abnormalJam.destinationCor[1]){
                var dCor = abnormalJam.destinationCor[0]+","+abnormalJam.destinationCor[1];
                abnormalJam.searchRoutePlan(corForPolice,dCor,abnormalJam.destinationName,"警车所在位置");
                $("#routeDivForZpcj").show();
            }else{
                layer.msg("请在地图上点击出警终点");
                _self.showMouseTitle(corForPolice,"policeCar",function(handler){//显示跟随鼠标的title
                    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)//移除鼠标点击事件
                });
                //取消出警绑定事件
                $(".cancelOutPoliceForZpcj").unbind().bind("click",function(){
                    $("#routeDivForZpcj").hide();
                    carTrack.clearPathPlan();
                    flashControl.clearAll();
                })
            }
            _self.closeOther();//关闭其他看板
            setTimeout(function(){
                popupControl.removePopup($('#policeCarPopup'));
            },500)

        });
    },
    /**
     * 诱导屏气泡
     */
    addGuidancePopUp:function(data,coordinate){
        /**
         * 请求后台获取设备当前显示内容
         */
        $.get(ctx+"/guidanceMonitor/queryDevicesDetailPopUp.do?id="+data.deviceid,function (dataResult) {
            var content = '';
            if(1==dataResult.status) {
                var value = dataResult.data;
                /**
                 *构建弹窗内容
                 */
                var status = 1 == value.deviceStatus ? "在线" : "故障";

                var textColor = '';
                switch (value.fontColor + '') {
                    case '0':
                        textColor = '#ff0000';
                        break;
                    case '1':
                        textColor = '#ffff00';
                        break;
                    case '2':
                        textColor = '#32cd32';
                        break;
                    default:
                        textColor = '#ff0000';
                        break;
                }


                var XAlign = '';
                switch (value.elementXAlign + '') {//左右对齐方式
                    case '1':
                        XAlign = 'left';
                        break;
                    case '2':
                        XAlign = 'middle';
                        break;
                    case '3':
                        XAlign = 'right';
                        break;
                    default:
                        XAlign = 'middle';
                        break;
                }

                var YAlign = '';
                switch (value.elementYAlign + '') {//上下对齐方式
                    case '1':
                        YAlign = 'top';
                        break;
                    case '2':
                        YAlign = 'middle';
                        break;
                    case '3':
                        YAlign = 'bottom';
                        break;
                    default:
                        YAlign = 'middle';
                        break;
                }

                switch (value.elementType) {
                    //文字
                    case "1":
                        content = '<pre title="' + value.content + '"  style="margin-left:3px;background-image:-webkit-linear-gradient( 90deg, rgb(14,60,124) 0%, rgb(4,24,43) 100%);padding: 10px;cursor: pointer;overflow: hidden; font-size: ' + value.fontSize + 'px;width: 260px;height: 169px; color:' + textColor + ';vertical-align:' + YAlign + ';text-align: ' + XAlign + '">' + value.content + '</pre>';
                        break;
                    //图片
                    case "2":
                        content = '<img src="' + value.content + '" style="background-image:-webkit-linear-gradient( 90deg, rgb(14,60,124) 0%, rgb(4,24,43) 100%);"   width="264px" height="169px"  style="margin-left:3px; "/>';
                        break;
                    //视频
                    case "7":
                        content = '<img src="' + value.content + '" style="background-image:-webkit-linear-gradient( 90deg, rgb(14,60,124) 0%, rgb(4,24,43) 100%);"   width="264px" height="169px"  style="margin-left:3px; "/>';
                        break;

                    default:
                        content = '<img style="background-image:-webkit-linear-gradient( 90deg, rgb(14,60,124) 0%, rgb(4,24,43) 100%);" width="194px" height="169px" alt=""  style="margin-left:3px; " />';
                        break;
                }
                var colorStyle = "textColor12"; //在线颜色样式
                var state = "关机";//在线状态
                var screeType = "双基色";//设备类型
                var departMent = "未知";//管理部门
                var programName = "未知";//节目名称
                var publishTime = "未知";//发布时间
                var location = "未知";//地点
                if(value.screenStatus=="114"){
                    colorStyle = "textColor06";
                    state="开机";
                }
                if(value.programName){
                    programName = value.programName;
                }
                if(value.screeType=="888"){
                    screeType = "全彩";
                }
                if(data.regionname){
                    departMent = data.regionname;
                }
                if(value.publishTime){
                    publishTime = value.publishTime;
                }
                var html = `
                <div id="guidancePopup" class="pa PopupsBox" style="width:474px;left:-117px;top:-110px;display:none">
                    <div class="PopupsHeader">
                        <h1>交通诱导屏</h1>
                        <div class="windowGroup PopUpClose_pos">
                            <ul>
                                <li class="windowIcon04"></li>
                            </ul>
                        </div>
                    </div>
                    <div class="PopupsContent01">
                        <div class="p10">
                            <div class="fl">
                                <div style="display:inline-block;width:264px;height:169px;">
                                    {content}
                                </div>
                            </div>
                            <div class="fl ml5">
                                <div style="height:160px;width:168px;display:inline-block;overflow:auto">
                                    <table border="1" cellspacing="0" cellpadding="0" class="jtydp_table" bordercolor="#4599d9" width="160">
                                        <tr class="oddBgc">
                                            <td width="50%">设备状态</td>
                                            <td class="${colorStyle}">${state}</td>
                                        </tr>
                                        <tr>
                                            <td>设备类型</td>
                                            <td>${screeType}</td>
                                        </tr>
                                        <tr class="oddBgc">
                                            <td>管理部门</td>
                                            <td>${departMent}</td>
                                        </tr>
                                        <tr>
                                            <td>节目名称</td>
                                            <td>${programName}</td>
                                        </tr>
                                        <!--<tr class="oddBgc">-->
                                            <!--<td>节目类别</td>-->
                                            <!--<td>交通管制</td>-->
                                        <!--</tr>-->
                                        <!--<tr>-->
                                            <!--<td>发布人</td>-->
                                            <!--<td>张福强</td>-->
                                        <!--</tr>-->
                                        <tr class="oddBgc">
                                            <td>发布时间</td>
                                            <td>${publishTime}</td>
                                        </tr>
                                         <!--<tr>-->
                                             <!--<td>地点</td>-->
                                             <!--<td>${location}</td>-->
                                         <!--</tr>-->
                                    </table>
                                </div>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div class="pb10 pl10">
                            <div class="fl lh200"><i class="fa fa-circle mr5 ${colorStyle}"></i>${state}</div>
                            <!--<div class="fr mr10">-->
                                <!--<p class="EPBut01 dib" aliasid="videoPreviewBtn">远程关屏</p>-->
                                <!--<p class="EPBut01 dib" aliasid="videoReplayBtn" id="jsfbInMap">即时发布</p>-->
                            <!--</div>-->
                            <div class="clear"></div>
                        </div>
                    </div>
                    <div class="gis_bubble_triangle"></div>
                </div>
                `;
                var $p = $(html.replace("{content}",content));
                var coor = null;
                var reg = new RegExp('^0');
                if (!reg.test(coordinate[0]) && !reg.test(coordinate[1])) {
                    coor = [parseFloat(coordinate[0]), parseFloat(coordinate[1])];
                }
                if (!coor) {
                    return;
                }
                $("body").append($p);
                var divPosition= Cesium.Cartesian3.fromDegrees(coor[0],coor[1]);//div的坐标位置
                ysc.creatHtmlElement(viewer,$("#guidancePopup"),divPosition,[0,-(parseInt($p.css("height"))+90)],true);//将div加载到地图中
                //绑定事件
                $p.find(".windowIcon04").bind('click',function(){
                    popupControl.removePopup($('#guidancePopup'));
                });
            }else{
                layer.msg("请求超时")
            }
        });
    },
    getRegionName:function(regionId){
        $.ajax({
            type: "POST",
            url: ctx + "/duty/getRegionName.do",
            async: true,
            dataType: "json",
            data:{
                "regionId":regionId
            },
            success: function (data) {
                return data.rows;
            },
            error: function () {

            }
        });
    },


    /**
     * 显示跟随鼠标的title
     * corForPolice 警员警车的坐标
     * type 类型为警员还是警车
     */
    showMouseTitle:function(corForPolice,type,callBack){
        var _self= this;
        var handler = new Cesium.ScreenSpaceEventHandler;
        handler.setInputAction(function(movement){
            $("#mouseTitle").empty();
            $("#mouseTitle").append(`<span>点击地图选择终点</span>`);
            $("#mouseTitle").show();
            $("#mouseTitle").css({
                left:movement.endPosition.x+2,
                top:movement.endPosition.y
            });
        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.setInputAction(function(click){
            handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);//移除鼠标跟随事件
            $("#mouseTitle").hide();//隐藏跟随鼠标的div标签
            //处理点击地图的终点坐标
            var cartesian = drawControl.viewer.scene.camera.pickEllipsoid(click.position, drawControl.viewer.scene.globe.ellipsoid);
            var position = drawControl.Cartesian3_to_WGS84(cartesian);
            var location = gcoord.transform(
                [parseFloat(position[0]), parseFloat(position[1])],    // 经纬度坐标
                gcoord.WGS84,                 //当前坐标系
                gcoord.AMap               // 目标坐标系
            ).join(",");
            //开始路径规划
            var desName = "";
            if(type=="policeCar"){
                desName = "警车所在位置"
            }else{
                desName = "警员所在位置"
            }
            abnormalJam.searchRoutePlan(corForPolice,location,"所选终点位置",desName);
            $("#routeDivForZpcj").show();
            callBack(handler);//回调关闭点击事件监听
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    //关闭其他看板
    closeOther:function(){
        //去掉按钮选中状态
        $("#mainMenu li").removeClass("active");
        trackRoam.hide();
        eventAlarm.hide();
        search.closeAllAndEmpty();
        indexAnalysis.hideAllCon();
        eventPublish.hideCon();
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
    /**
     * 通过警员id获取最新定位
     */
    getPolicePosition:function(){
        var _self = this;
        $.ajax({
            type: "POST",
            url: ctx + "/police/queryPoliceMan",
            async: true,
            dataType: "json",
            data:{
                "page":1,
                "rows":1000
            },
            success: function (resp) {
               var rows = resp.rows;
               // for(var i=0; i<rows.length; i++){
               //     var bbc = _self.billboardCollection._billboards;
               //     for(var k =0;k<bbc.length; k++){
               //         if(bbc[k].id.pointId==rows[i].id){
               //             bbc[k].position = drawControl.WGS84_to_Cartesian3({"lng":rows[i].longitude,"lat":rows[i].latitude});
               //         }
               //     }
               // }
                if(rows.length==_self.policeManCount){
                    var bbc = _self.billboardCollection._billboards;
                    for(var i=0; i<rows.length; i++){
                        if(rows[i].LONGITUDE){
                            bbc[i].position = drawControl.WGS84_to_Cartesian3({"lng":rows[i].LONGITUDE,"lat":rows[i].LATITUDE});
                        }
                    }
                }else{//若与数据库数量不匹配则重新查询
                    _self.getPoint();
                }

            },

        });

    },
    /**
     * 根据设备的在线状态和设备的类型获取图标的url地址
     * @param state   设备的在线状态
     * @param deviceType  设备的类型
     * @returns {string}
     */
    getZtreeImageUrl:function (state,deviceType) {
        var imageUrl = top.ctx + "/images/tree/";
        switch (deviceType) {
            case "electronicPolice":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "electronicPolice_off.png";
                } else {
                    imageUrl += "electronicPolice_on.png";
                }
                break;
            case "intelligentEntry":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "intelligentEntry_off.png";
                } else {
                    imageUrl += "intelligentEntry_on.png";
                }
                break;
            case "highSkyDetector":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "highSkyDetector_off.png";
                } else {
                    imageUrl += "highSkyDetector_on.png";
                }
                break;
            case "illegalParking":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "illegalParking_off.png";
                } else {
                    imageUrl += "illegalParking_on.png";
                }
                break;
            case "illegalWhistling":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "illegalWhistling_off.png";
                } else {
                    imageUrl += "illegalWhistling_on.png";
                }
                break;
            case "drivingGuidance":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "drivingGuidance_off.png";
                } else {
                    imageUrl += "drivingGuidance_on.png";
                }
                break;
            case "microwaveDetection":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "microwaveDetection_off.png";
                } else {
                    imageUrl += "microwaveDetection_on.png";
                }
                break;
            case "notComityPedestrian":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "notComityPedestrian_off.png";
                } else {
                    imageUrl += "notComityPedestrian_on.png";
                }
                break;
            case "pedestrianCare":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "pedestrianCare_off.png";
                } else {
                    imageUrl += "pedestrianCare_on.png";
                }
                break;
            case "peopleRedLight":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "peopleRedLight_off.png";
                } else {
                    imageUrl += "peopleRedLight_on.png";
                }
                break;
            case "trafficControl":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "trafficControl_off.png";
                } else {
                    imageUrl += "trafficControl_on.png";
                }
                break;
            case "trafficConstruction":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "trafficConstruction_off.png";
                } else {
                    imageUrl += "trafficConstruction_on.png";
                }
                break;
            case "signalControl":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "signalControl_off.png";
                } else {
                    imageUrl += "signalControl_on.png";
                }
                break;
            case "videoDetection":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "videoDetection_off.png";
                } else {
                    imageUrl += "videoDetection_on.png";
                }
                break;
            case "variableLane":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "variableLane_off.png";
                } else {
                    imageUrl += "variableLane_on.png";
                }
                break;
            case "policeOfficer":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "policeOfficer_off.png";
                } else {
                    imageUrl += "policeOfficer_on.png";
                }
                break;
            case "policeCar":
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "policeCar_off.png";
                } else {
                    imageUrl += "policeCar_on.png";
                }
                break;
            default:
                if (state==null||state==""||state==0||state==113) {
                    imageUrl += "DEFAULT_off.png";
                } else {
                    imageUrl += "DEFAULT_on.png";
                }
                break;
        }
        return imageUrl;
    }
};