/**
 * @(#)eventPointControl.js
 *
 * @description: 交通事件点位管理
 * @author: feiyin 2020/06/15
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */

var EventPointControl = function(){
    this.init.apply(this, arguments);
};

EventPointControl.prototype = {
    viewer: null, //cesium视图对象
    congesitionEntityCollection:null,//异常拥堵地图实体集合
    eventEntityCollection:null,//交通事件地图实体集合
    congesitionInterval:null,//异常拥堵循环任务
    eventInterval:null,//交通事件循环任务
    init: function (viewer) {
        var _self = this;
        _self.viewer = viewer;
        _self.congesitionEntityCollection = new Cesium.EntityCollection();
        _self.eventEntityCollection = new Cesium.EntityCollection();
        _self.initCongesitionJob();
        _self.initEventJob();
    },
    /**
     * 初始化异常拥堵循环刷新任务
     */
    initCongesitionJob:function () {
        var _self = this;
        _self.getCongesition();
        _self.congesitionInterval = setInterval(function () {
            //隔2分钟执行一次
            _self.getCongesition();
        }, 1000 * 60 * 2);
    },
    /**
     * 初始化交通事件循环刷新任务
     */
    initEventJob:function(){
        var _self = this;
        _self.getEvent();
        _self.eventInterval = setInterval(function () {
            //隔2分钟执行一次
            _self.getEvent();
        }, 1000 * 60 * 2);
    },
    /**
     * 展示异常拥堵图标信息到地图
     */
    getCongesition:function () {
        var _self = this;
        _self.clearCongesition();//加载新的拥堵事件前先把原本的清除
        $.ajax({
            async : true,
            cache : false,
            type : "POST",
            dataType : "json",
            url : "eventAlarm/queryAbnormalJam_abc",
            data:{
                "page":1,
                "rows":99,
            },
            success : function(data) {
                var rows = data.rows;
                for(var i =0; i<rows.length; i++){
                    var center = gcoord.transform(
                        [parseFloat(rows[i].LON), parseFloat(rows[i].LAT)],    // 经纬度坐标
                        gcoord.AMap,               // 当前坐标系
                        gcoord.WGS84                 // 目标坐标系
                    );
                    var entity = viewer.entities.add({    //将图标添加到视图中
                        position: Cesium.Cartesian3.fromDegrees(center[0] * 1,center[1] * 1,2.61),   //图标的位置
                        billboard : {
                            image :_self.getIcon("congesition"),  //图片的url地址
                            scale : 1,     //图标的放大倍数
                            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
                        },
                        properties :{
                            type:"congesition_map",
                            lon:rows[i].LON,
                            lat:rows[i].LAT,
                            polylineStr:rows[i].POLYLINE,
                            data:rows[i]
                        }
                    });
                    _self.congesitionEntityCollection.add(entity);
                }

            }
        });
    },

    //拥堵气泡
    showCongesitionPopup:function(data){
        var _self=this;
        $('#ydPopup').find("#ydRoadName").text(data.FULL_NAME||"无名大道");
        $('#ydPopup').find("#ydTime").text(data.MAX_TIME+'分钟');
        $('#ydPopup').find("#ydRoadDistance").text(data.CONGESTION_LENGTH+'米');
        $('#ydPopup').find("#ydSpeed").text(data.SPEED+'km/h');
        if($('#redPopup').length == 0){
            $("body").append(`
               <div class='ysc-dynamic-layer alarm-mode' id='redPopup' style="pointer-events: auto;">
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
        $('#redPopup').find(".bubble-Gis01").html(document.getElementById("ydPopup").innerHTML);
        var cor = [data.LON,data.LAT];
        //如果参数中的center为高德接口获取的坐标，需要将其转化为WGS84坐标系的坐标
        cor = gcoord.transform(
            [parseFloat(cor[0]), parseFloat(cor[1])],    // 经纬度坐标
            gcoord.AMap,               // 当前坐标系
            gcoord.WGS84                 // 目标坐标系
        );
        //popupControl.showPopup($('#redPopup'),cor[0],cor[1],-100);
        var divPosition= Cesium.Cartesian3.fromDegrees(cor[0],cor[1],0);//div的坐标位置
        ysc.creatHtmlElement(viewer,$("#redPopup"),divPosition,[-170,-300],true);//将div加载到地图中
        var obj = $('#redPopup');
        obj.find(".windowIcon04").bind('click',function(){
            popupControl.removePopup($("#redPopup"));
            flashControl.clearAll();
            roadAndAroundControl.clear();
        });
        //周边视频
        obj.find("#ydZbsp").bind('click',function(){
            roadAndAroundControl.clear("circle");
            roadAndAroundControl.clear("lineWidth");
            //画出辐射圈
            var cor0 = data.LON+","+data.LAT;
            var polygon = data.POLYLINE;
            flashControl.clearAll();
            roadAndAroundControl.clear("circle");
            roadAndAroundControl.showAround(polygon,function(dataForAround){
                var e = dataForAround.coordinates;
                //查询圈内设备
                abnormalJam.searchAroundDeviceForPolyLine(cor,polygon,e)
            });
        });
        //周边警力
        obj.find("#ydZbjl").bind('click',function(){
            roadAndAroundControl.clear("lineWidth");
            flashControl.clearAll();
            //搜索半径
            var radio = 500 / 20037508.34 * 180;
            //如果参数中的centerCor为高德接口获取的坐标，需要将其转化为WGS84坐标系的坐标
            var cor = gcoord.transform(
                [parseFloat(data.LON), parseFloat(data.LAT)],    // 经纬度坐标
                gcoord.AMap,               // 当前坐标系
                gcoord.WGS84                 // 目标坐标系
            );
            var cor0=cor+","+radio;
            roadAndAroundControl.showCircle(cor,500);
            $.ajax({
                async : true,
                cache : false,
                type : "POST",
                dataType : "json",
                url : "police/queryDeviceByCircle",
                data:{
                    "extent":cor0,
                    "pointType":"policeOfficer",
                },
                success : function(data) {
                    var rows = data.resp;
                    if(rows.length == 0){
                        layer.msg("周边暂无警力");
                    }
                    for(var i =0; i<rows.length; i++){
                        flashControl.circleRipple(rows[i].LON,rows[i].LAT,rows[i].NAME,"blue","WGS84");
                    }
                }
            });
            //定位
            var tmpLon = data.LON;
            var tmpLat = data.LAT;
            //如果参数中的centerCor为高德接口获取的坐标，需要将其转化为WGS84坐标系的坐标
            tempCoor = gcoord.transform(
                [parseFloat(tmpLon), parseFloat(tmpLat)],    // 经纬度坐标
                gcoord.AMap,               // 当前坐标系
                gcoord.WGS84                 // 目标坐标系
            );
            if(tmpLon&&tmpLat){
                viewer.camera.flyTo({
                    destination:Cesium.Cartesian3.fromDegrees(tempCoor[0] * 1, tempCoor[1] * 1 - 0.011,1000),
                    orientation : {
                        heading : Cesium.Math.toRadians(0),
                        pitch : Cesium.Math.toRadians(-40),
                        roll : 0.0
                    }
                });
            }
        });
        //周边红绿灯
        obj.find("#ydZbhld").bind('click',function(){
            roadAndAroundControl.clear("circle");
            roadAndAroundControl.clear("lineWidth");
            //画出辐射圈
            var cor0 = data.LON+","+data.LAT;
            flashControl.clearAll();
            roadAndAroundControl.clear("circle");

            //画出周边圈图层
            var centerCor = [];
            centerCor.push(data.LON);
            centerCor.push(data.LAT);
            //如果参数中的centerCor为高德接口获取的坐标，需要将其转化为WGS84坐标系的坐标
            centerCor = gcoord.transform(
                [parseFloat(centerCor[0]), parseFloat(centerCor[1])],    // 经纬度坐标
                gcoord.AMap,               // 当前坐标系
                gcoord.WGS84                 // 目标坐标系
            );
            roadAndAroundControl.showCircle(centerCor,1000);

            eventAlarm.searchAroundDevice(centerCor[0]+","+centerCor[1], 1000, "signalControl",function (deviceList) {
                for(var i =0;i<deviceList.length;i++){
                    //警员闪烁
                    flashControl.circleRipple(deviceList[i].lon,deviceList[i].lat,deviceList[i].name,"blue","wgs84");
                }
            });
            //roadAndAroundControl.showCircle([parseFloat(data.LON), parseFloat(data.LAT)], 1000);
            //定位
            var tmpLon = data.LON;
            var tmpLat = data.LAT;
            if(tmpLon&&tmpLat){
                if (tmpLon != 0 && tmpLat != 0) {
                    //如果参数中的records为高德接口获取的坐标，需要将其转化为WGS84坐标系的坐标
                    cor = gcoord.transform(
                        [parseFloat(tmpLon), parseFloat(tmpLat)],    // 经纬度坐标
                        gcoord.AMap,               // 当前坐标系
                        gcoord.WGS84                 // 目标坐标系
                    );

                    viewer.camera.flyTo({
                        destination:Cesium.Cartesian3.fromDegrees(cor[0] * 1, cor[1] * 1 - 0.022,2000),
                        orientation : {
                            heading : Cesium.Math.toRadians(0),
                            pitch : Cesium.Math.toRadians(-40),
                            roll : 0.0
                        }
                    });

                }
            }
        });
    },

    /**
     * 清除异常拥堵图标
     */
    clearCongesition:function(){
        for(var i=0;i< this.congesitionEntityCollection.values.length;i++ ){
            viewer.entities.remove(this.congesitionEntityCollection.values[i]);
        }
    },
    /**
     * 隐藏异常拥堵图标
     */
    hideCongesition:function () {
        this.congesitionEntityCollection.show = false
    },
    /**
     * 显示异常拥堵图标
     */
    showCongesition:function () {
        this.congesitionEntityCollection.show = true
    },
    /**
     * 展示交通事件图标信息到地图
     */
    getEvent:function () {
        var _self = this;
        _self.clearEvent();//加载新的拥堵事件前先把原本的清除
        $.ajax({
            async: true,
            cache: false,
            type: "POST",
            dataType: "json",
            url: "roadEvent/queryRoadEvent_abc",
            data: {
                "pageIndex": 1,
                "pageSize": 999,
            },
            success: function (res) {
                if (!res.value) {
                    layer.msg("获取交通事件失败");
                    return;
                }
                var rows = res.response.resultObject.resultList;

                for (var i = 0; i < rows.length; i++) {
                    var category = rows[i].category; //事件大类
                    var codeImg = "";
                    codeImg = _self.getIcon(category);
                    var lon = rows[i].x;
                    var lat = rows[i].y;
                    var center = gcoord.transform(
                        [parseFloat(lon), parseFloat(lat)],    // 经纬度坐标
                        gcoord.AMap,               // 当前坐标系
                        gcoord.WGS84                 // 目标坐标系
                    );
                    var entity = viewer.entities.add({    //将图标添加到视图中
                        position: Cesium.Cartesian3.fromDegrees(center[0] * 1,center[1] * 1,2.61),   //图标的位置
                        billboard : {
                            image :codeImg,  //图片的url地址
                            scale : 1,     //图标的放大倍数
                            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
                        },
                        properties :{
                            type:"event_map",
                            lon:rows[i].x,
                            lat:rows[i].y,
                            polylineStr:rows[i].lines,
                            data:rows[i]
                        }
                    });
                    _self.eventEntityCollection.add(entity);
                }
            }
        })
    },

    /**
     * 显示事件气泡
     * @param lonlats 道路经纬度数组（高德接口获取）
     * @param data
     */
    showEventPop: function (data) {
        var _self = this;
        var center = [data.x,data.y];
        var cor = gcoord.transform(
            [parseFloat(center[0]), parseFloat(center[1])],    // 经纬度坐标
            gcoord.AMap,               // 当前坐标系
            gcoord.WGS84                 // 目标坐标系
        );
        var eventStatus = "";
        var now = new Date();
        var startTime = new Date(data.startTime);
        var endTime = new Date(data.endTime);
        if(now < startTime){
            eventStatus = "<span class='textColor07'>未生效</span>";
        }else if(now >= startTime && now <= endTime){
            eventStatus = "<span class='textColor06'>生效中</span>";
        }else if(now > endTime){
            eventStatus = "<span class='textColor02'>已失效</span>";
        }
        flashControl.clearAll();
        $("#eventPopup").remove();
        var eventContent = data.eventContent;
        if(data.eventDesc){
            eventContent = data.eventDesc;
        }
        $("body").append(`
           <div class='ysc-dynamic-layer alarm-mode' id='eventPopup' style="pointer-events: auto;height: 212px;">
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
                    <div class="bubble-Header">
                        <h1>
                            <span style="position:absolute;text-shadow: 0 0 7px #0bffff;">事件信息</span>
                            <span class="tc_bt_l"></span>
                        </h1>
                    </div>
                    <div class="windowGroup bubbleClose-pos">
                        <ul>
                            <li class="windowIcon04"></li>
                        </ul>
                    </div>
                    <div class="pa ">
                        <div class="bubble-Content01 p10 pb20 tc" style="width:260px;margin-left:30px;">
                            <div class="lh200" style="font-size: 12px;">
                                <ul align="left">
                                    <li style="text-shadow: 0 0 7px #0bffff;">事件状态： <span>${eventStatus}</span></li>
                                    <li style="text-shadow: 0 0 7px #0bffff;">开始时间： <span>${data.startTime}</span></li>
                                    <li style="text-shadow: 0 0 7px #0bffff;">结束时间： <span>${data.endTime}</span></li>
                                    <li style="text-shadow: 0 0 7px #0bffff;">事件内容： <span>${eventContent}</span></li>
                                </ul>
                            </div>
                            <div class=" tc" style="margin-left: -32px; font-size: 12px;margin-top: 12px;width:320px;">
                                <div class="EPBut01 dib" id="eventZbsp" >周边视频</div>
                                <div class="EPBut01 dib" id="eventZbjl" >周边警力</div>
                                <div class="EPBut01 dib" id="eventZbhld" >周边红绿灯</div>
                            </div>
                        </div>
                
                    </div>
                </div>
            </div>
            `);

        var divPosition= Cesium.Cartesian3.fromDegrees(cor[0],cor[1],0);//div的坐标位置
        ysc.creatHtmlElement(viewer,$("#eventPopup"),divPosition,[-170,-300],true);//将div加载到地图中
        var obj = $('#eventPopup');
        obj.find(".windowIcon04").unbind().bind('click',function(){
            popupControl.removePopup($("#eventPopup"));
            flashControl.clearAll();
            roadAndAroundControl.clear();
        });

        //周边视频
        obj.find("#eventZbsp").unbind().bind('click',function(){
            var polygon = data.lines.replace(/_/g,",");
            roadAndAroundControl.clear("circle");
            roadAndAroundControl.clear("lineWidth");
            flashControl.clearAll();
            roadAndAroundControl.showAround(polygon,function(dataForAround){
                var e = dataForAround.coordinates;
                //查询圈内设备
                abnormalJam.searchAroundDeviceForPolyLine(cor,polygon,e)
            });
        });

        //周边警力
        obj.find("#eventZbjl").unbind().bind('click',function(){
            roadAndAroundControl.clear("lineWidth");
            flashControl.clearAll();
            //搜索半径
            var radio = 500 / 20037508.34 * 180;
            //如果参数中的centerCor为高德接口获取的坐标，需要将其转化为WGS84坐标系的坐标
            var cor = gcoord.transform(
                [parseFloat(data.x), parseFloat(data.y)],    // 经纬度坐标
                gcoord.AMap,               // 当前坐标系
                gcoord.WGS84                 // 目标坐标系
            );
            var cor0=cor+","+radio;
            roadAndAroundControl.showCircle(cor,500);
            $.ajax({
                async : true,
                cache : false,
                type : "POST",
                dataType : "json",
                url : "police/queryDeviceByCircle",
                data:{
                    "extent":cor0,
                    "pointType":"policeOfficer",
                },
                success : function(data) {
                    var rows = data.resp;
                    if(rows.length == 0){
                        layer.msg("周边暂无警力");
                    }
                    for(var i =0; i<rows.length; i++){
                        flashControl.circleRipple(rows[i].LON,rows[i].LAT,rows[i].NAME,"blue","WGS84");
                    }
                }
            });
            //定位
            var tmpLon = data.x;
            var tmpLat = data.y;
            //如果参数中的centerCor为高德接口获取的坐标，需要将其转化为WGS84坐标系的坐标
            tempCoor = gcoord.transform(
                [parseFloat(tmpLon), parseFloat(tmpLat)],    // 经纬度坐标
                gcoord.AMap,               // 当前坐标系
                gcoord.WGS84                 // 目标坐标系
            );
            if(tmpLon&&tmpLat){
                viewer.camera.flyTo({
                    destination:Cesium.Cartesian3.fromDegrees(tempCoor[0] * 1, tempCoor[1] * 1 - 0.011,1000),
                    orientation : {
                        heading : Cesium.Math.toRadians(0),
                        pitch : Cesium.Math.toRadians(-40),
                        roll : 0.0
                    }
                });
            }
        });

        // 周边红绿灯
        obj.find("#eventZbhld").unbind().bind('click',function(){
            roadAndAroundControl.clear("circle");
            roadAndAroundControl.clear("lineWidth");
            flashControl.clearAll();

            eventAlarm.searchAroundDevice(cor.join(","),1000,"signalControl",function (data) {
                if(data.length == 0){
                    layer.msg("周边暂无红绿灯");
                    return;
                }
                //地图扫描+设备闪烁
                eventAlarm.aroundPointInMap(cor,data,1000);
            })

        });
    },
    /**
     * 隐藏交通事件图标
     */
    hideEvent:function () {
        this.eventEntityCollection.show = false;
    },
    /**
     * 显示交通事件图标
     */
    showEvent:function () {
        this.eventEntityCollection.show = true;
    },
    /**
     * 清除交通事件图标
     */
    clearEvent:function () {
        for(var i=0;i< this.eventEntityCollection.values.length;i++ ){
            viewer.entities.remove(this.eventEntityCollection.values[i]);
        }
    },
    /**
     * 获取地图图标
     */
    getIcon:function (type) {
        if(type == "congesition"){
            return top.ctx+"/theme/blue/images/icons/gis_sslk_1.png";
        }
        switch (type) {
            case 100:
                codeImg=top.ctx+"/theme/blue/images/event/jtts_"+"E1.png";
                break;
            case 200:
                codeImg=top.ctx+"/theme/blue/images/event/jtts_"+"E2.png";
                break;
            case 300:
                codeImg=top.ctx+"/theme/blue/images/event/jtts_"+"E3.png";
                break;
            case 400:
                codeImg=top.ctx+"/theme/blue/images/event/jtts_"+"E8.png";
                break;
            case 500:
                codeImg=top.ctx+"/theme/blue/images/event/jtts_"+"E9.png";
                break;
        }
        return codeImg;
    }

};