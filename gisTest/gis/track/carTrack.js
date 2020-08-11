/**
 * @(#)carTrack.js
 *
 * @description: 3d车辆轨迹效果
 * @author: 尹飞 2019/09/23
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */

var CarTrack = function(){
    this.init.apply(this, arguments);
};

CarTrack.prototype = {
    view: null, //cesium视图对象
    entityCollection:[],//实体集合，以便管理实体
    arrowEntityCollection:[],//轨迹箭头的实体集合，以便缩放地图的时候重绘箭头
    selectColor:null,//选中线的颜色，用于路径规划
    color:null,//普通线的颜色
    modifier:10,//轨迹显示时鼠标滚轮事件的修饰符，以便管理轨迹箭头
    init: function (view) {
        this.view = view;
        this.entityCollection = new Cesium.EntityCollection();
        this.arrowEntityCollection = new Cesium.EntityCollection();
        this.selectColor = Cesium.Color.BLUE;
        this.color = Cesium.Color.CYAN;
    },
    /**
     * 画路线规划
     * @param records  车辆轨迹坐标集合,例如：[{"PULOCATION":lon1_lat1},{"PULOCATION":lon2_lat2}]
     * @param color  线的颜色  //new Cesium.Color(0, 222/255, 255/255, 1):未选中颜色，new Cesium.Color(111/255, 93/255, 247/255, 1):选中颜色
     * @param schemeName //方案的名称 ，例如：方案一、方案二
     * @param time   //花费的时间 //分钟数
     * @param showStratAndEnd //是否显示起点和终点图标 true/false
     * @param hideScheme //是否隐藏方案的显示，是的话传true
     * @param proj //投影坐标系，“WGS84”或者“GCJ02”
     */
    drawPathPlan: function(records,color, schemeName, time, showStratAndEnd, hideScheme,proj){
        var _self = this;
        //如果轨迹的点位数为0，则直接返回
        if (!records || null == records || records.length < 1) {
            return;
        }
        //如果没有传颜色值的话默认为普通线的颜色
        if(color){
            color = _self.color;
        }
        //判断坐标是否为0的正则表达式
        var reg = new RegExp('^0');
        var zb = []; //轨迹坐标集合
        for (var i in records) {
            var z = records[i].PULOCATION;
            if (z && z.split("_").length > 1) {
                var zp = z.split("_");
                var cor;
                if (!reg.test(zp[0]) && !reg.test(zp[1])) {
                    cor = [parseFloat(zp[0]), parseFloat(zp[1])];
                    //如果参数中的records为高德接口获取的坐标，需要将其转化为WGS84坐标系的坐标
                    if(proj && proj == "WGS84"){

                    } else {
                        cor = gcoord.transform(
                            [parseFloat(cor[0]), parseFloat(cor[1])],    // 经纬度坐标
                            gcoord.AMap,               // 当前坐标系
                            gcoord.WGS84                 // 目标坐标系
                        );
                    }
                    zb.push(cor);
                }
            }
        }
        //当不为0的坐标长度大于0的时候才进入里面的方法
        if(zb.length>0){
            //地图定位到轨迹的起点位置
            if(zb.length > 1){
                var dx = zb[zb.length - 1][0] - zb[0][0];
                var dy = zb[zb.length - 1][1] - zb[0][1];
                var cos = Math.sqrt(dx * dx / (dx * dx + dy * dy));
                var sin = Math.sqrt(dy * dy / (dx * dx + dy * dy));
                var ox,oy;
                if (zb[0][0] < zb[zb.length - 1][0])
                    ox = zb[0][0] - 0.01*cos;
                else
                    ox = zb[0][0] + 0.01*cos;
                if (zb[0][1] < zb[zb.length - 1][1])
                    oy = zb[0][1] - 0.01*sin;
                else
                    oy = zb[0][1] + 0.01*sin;
                var cameraCoor = [ox,oy]; //相机的坐标设为终点指向起点的延长线上的点，以便能把整个轨迹显示在视野中
                var heading = _self.bearing(zb[0][1], zb[0][0],zb[zb.length - 1][1], zb[zb.length - 1][0]);//获取相机的方向，以便朝向路线
                viewer.camera.flyTo({
                    destination:Cesium.Cartesian3.fromDegrees(cameraCoor[0] * 1, cameraCoor[1] * 1,1082.57803),
                    orientation : {
                        heading : Cesium.Math.toRadians(heading),
                        pitch : Cesium.Math.toRadians(-40),
                        roll : 0.0
                    }
                });
            } else {
                viewer.camera.flyTo({
                    destination:Cesium.Cartesian3.fromDegrees(zb[0][0] * 1, zb[0][1] * 1,8582.57803),
                    orientation : {
                        heading : Cesium.Math.toRadians(175.0),
                        pitch : Cesium.Math.toRadians(-70),
                        roll : 0.0
                    }
                });
            }
          /*  viewer.camera.flyTo({
                destination:Cesium.Cartesian3.fromDegrees(zb[0][0] * 1, zb[0][1] * 1,8582.57803),
                orientation : {
                    heading : Cesium.Math.toRadians(175.0),
                    pitch : Cesium.Math.toRadians(-70),
                    roll : 0.0
                }
            });*/

            //是否绘制轨迹起点图标样式
            if(showStratAndEnd){
                //添加起点图标
                var start = viewer.entities.add({    //将图标添加到视图中
                    position: Cesium.Cartesian3.fromDegrees(zb[0][0],zb[0][1],2.61),   //图标的位置
                    billboard : {
                        image : (top.ctx || '') + '/images/gis/origin_reverse.png',  //图片的url地址
                        scale : 1,     //图标的放大倍数
                        verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
                    },
                    properties :{
                        type:"start",
                    }
                });
                _self.entityCollection.add(start); //将终点图标实体添加到实体集合中，以便后续对它进行管理
                if(zb.length > 1){
                    var end = viewer.entities.add({    //将图标添加到视图中
                        position: Cesium.Cartesian3.fromDegrees(zb[zb.length - 1][0],zb[zb.length - 1][1],2.61),   //图标的位置
                        billboard : {
                            image : (top.ctx || '') + '/images/gis/destination_reverse.png',  //图片的url地址
                            scale : 1,     //图标的放大倍数
                            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
                        },
                        properties :{
                            type:"end",
                        }
                    });
                    _self.entityCollection.add(end);//将终点图标实体添加到实体集合中，以便后续对它进行管理
                }
            }

        }
        //添加方案气泡
        if(hideScheme){

        } else {
            $p = $(`<div class="pa PopupsBox" style="border: 1px solid #00deff;display: none;" _type="carTrack" schemeName="` + schemeName + `">
				<div class="PopupsContent01" style="width:150px;background-color: rgba(0,68,164,0.9);">
						<div class="caseSelect">
								<p class="caseBtn dib " type="` + schemeName + `" onclick="carTrack.setPathPlanSelect('` + schemeName + `')" style="width: 60px;">` + schemeName + `</p><p class="dib" style="min-width: 80px;">` + time + `分钟</p>
						</div>
				</div>
				<div class="gis_bubble_triangle" style="left: 59px;"></div>
			   </div>`);
            //先将要显示气泡的div加载到页面中，不过一般先将该div隐藏，等定位好后再show出来
            $("body").append($p);

            var divPosition= Cesium.Cartesian3.fromDegrees(zb[Math.ceil(zb.length/2)][0],zb[Math.ceil(zb.length/2)][1]);//div的坐标位置
            ysc.creatHtmlElement(viewer,$p,divPosition,[-60,-(parseInt($p.css("height"))+10)],true);//将div加载到地图中
            $p.show(); //显示div
        }

        //轨迹线坐标集合，因为三维的坐标的集合格式是[lon1,lat1,height1,lon2,lat2,height2,lon3,lat3,height3]
        var trackData = [];
        for(var j=0;j<zb.length;j++){
            trackData.push(zb[j][0]);
            trackData.push(zb[j][1]);
            trackData.push(0);
        }
        //添加底线实体
        var trackLine = viewer.entities.add({
            polyline : {
                positions : Cesium.Cartesian3.fromDegreesArrayHeights(trackData),
                width : 5,
                material :Cesium.Color.RED/*new Cesium.PolylineGlowMaterialProperty({
                    glowPower : 1,
                    color :  color,
                })*/
            },
            properties :{
                schemeName: schemeName,
                trackData:zb
            }
        });
        _self.entityCollection.add(trackLine);//将底线实体添加到实体集合中，以便管理
        //添加飞行线实体
        /*var data2={ //只加入常用的属性，可以在源码中加入其他属性，以下类似。
            flowing:true,
            flowImage:"http://localhost:8097/its_trafficSituation/images/gis/path.png",//飞行线的图片
            options:{
                id:"carTrack",  //因为飞行线是调用ysc的方法进行创建的，所以加上id属性，以便管理
                name: name,
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(trackData),
                    width:5,
                    clampToGround : true,//贴地
                    material:[ new Cesium.PolylineGlowMaterialProperty({
                        glowPower : 0.3,
                        color : Cesium.Color.BLUE.withAlpha(0.9),
                    }),3000],//混合颜色、(红绿混合透明后 就是黄色了)3000秒发射间隔,单纯材质无法展示飞行动态。所以去掉了。
                }
            }
        };
        ysc.creatBrokenLine(viewer,data2);//调用ysc的方法创建飞行线*/

    },

    /**
     * 画路线
     * @param records 车辆轨迹坐标集合
     * @param showStratAndEnd 是否显示起点和终点图标
     * @param flyToCenter 是否将线路定位到地图中心
     * @param isDrag 是否能拖动起点和终点图标（showStratAndEnd为true时生效）
     */
    drawRoadLine : function(records,showStratAndEnd,flyToCenter){
        var _self = this;
        //如果轨迹的点位数为0，则直接返回
        if (!records || null == records || records.length < 1) {
            return;
        }
        //判断坐标是否为0的正则表达式
        var reg = new RegExp('^0');
        var zb = []; //轨迹坐标集合
        for (var i in records) {
            var z = records[i].PULOCATION;
            if (z && z.split("_").length > 1) {
                var zp = z.split("_");
                var cor;
                if (!reg.test(zp[0]) && !reg.test(zp[1])) {
                    cor = [parseFloat(zp[0]), parseFloat(zp[1])];
                    //如果参数中的records为高德接口获取的坐标，需要将其转化为WGS84坐标系的坐标
                    cor = gcoord.transform(
                        [parseFloat(cor[0]), parseFloat(cor[1])],    // 经纬度坐标
                        gcoord.AMap,               // 当前坐标系
                        gcoord.WGS84                 // 目标坐标系
                    );
                    zb.push(cor);
                }
            }
        }
        //当不为0的坐标长度大于0的时候才进入里面的方法
        if(zb.length>0){

            var centerNum = Math.ceil(zb.length/2);
            //地图定位到轨迹的起点位置
            if(flyToCenter){
                viewer.camera.flyTo({
                    destination:Cesium.Cartesian3.fromDegrees(zb[centerNum][0] * 1, zb[centerNum][1] * 1,1182.57803),
                });

            }

            //是否绘制轨迹起点图标样式
            if(showStratAndEnd){
                //添加起点图标
                var start = viewer.entities.add({    //将图标添加到视图中
                    position: Cesium.Cartesian3.fromDegrees(zb[0][0],zb[0][1],2.61),   //图标的位置
                    billboard : {
                        image : (top.ctx || '') + '/images/gis/origin_reverse.png',  //图片的url地址
                        scale : 1,     //图标的放大倍数
                        verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
                    },
                    properties :{
                        seq : "startPoint",
                        type:"start",
                    }
                });

                var end = viewer.entities.add({    //将图标添加到视图中
                    position: Cesium.Cartesian3.fromDegrees(zb[zb.length - 1][0],zb[zb.length - 1][1],2.61),   //图标的位置
                    billboard : {
                        image : (top.ctx || '') + '/images/gis/destination_reverse.png',  //图片的url地址
                        scale : 1,     //图标的放大倍数
                        verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
                    },
                    properties :{
                        seq : "endPoint",
                        type:"end",
                    }
                });
                _self.entityCollection.add(start); //将终点图标实体添加到实体集合中，以便后续对它进行管理
                _self.entityCollection.add(end);//将终点图标实体添加到实体集合中，以便后续对它进行管理

            }

        }

        //轨迹线坐标集合，因为三维的坐标的集合格式是[lon1,lat1,height1,lon2,lat2,height2,lon3,lat3,height3]
        var trackData = [];
        for(var j=0;j<zb.length;j++){
            trackData.push(zb[j][0]);
            trackData.push(zb[j][1]);
            trackData.push(0);
        }
        //添加底线实体
        var trackLine = viewer.entities.add({
            polyline : {
                positions : Cesium.Cartesian3.fromDegreesArrayHeights(trackData),
                width : 5,
                material :Cesium.Color.RED/*new Cesium.PolylineGlowMaterialProperty({
                    glowPower : 1,
                    color :  color,
                })*/
            },
            properties :{
                trackData:zb
            }
        });
        _self.entityCollection.add(trackLine);//将底线实体添加到实体集合中，以便管理

    },

    /**
     * 拖动地图图标
     * @param dragSeqs 被拖动的Entity的properties属性的seq的值，多个用","隔开
     * @param callBack 拖动结束执行的回调函数
     */
    dragEntitiesBySeq : function(dragSeqs,callBack){
        var dragSeqsArr = dragSeqs.split(",");
        var _self = this;
        var leftDownFlag = false;
        var pointDraged = null;
        var pointSeq = ""
        _self.dragHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

        //按下mouse左键
        _self.dragHandler.setInputAction(function (movement) {
            var entity = viewer.scene.pick(movement.position);//选取当前的entity
            leftDownFlag = true;
            if (entity && entity.id && entity.id.properties && entity.id.properties.seq) {
                var seq = entity.id.properties.seq.getValue();
                if($.inArray(seq,dragSeqsArr) > -1){//只拖动指定的图标
                    $("#map").css("cursor","grabbing");//改变鼠标指针样式（小抓手）
                    pointDraged = entity;
                    pointSeq = seq;
                    viewer.scene.screenSpaceCameraController.enableRotate = false;//锁定相机
                    return;
                }
            }
            pointSeq = "";
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        // 松开mouse左键
        _self.dragHandler.setInputAction(function (movement) {
            leftDownFlag = false;
            pointDraged = null;
            if($.inArray(pointSeq,dragSeqsArr) > -1){
                $("#map").css("cursor","grab");
                var c = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
                callBack(pointSeq,c);//执行回调
            }
            viewer.scene.screenSpaceCameraController.enableRotate = true;//解锁相机
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
        //  鼠标悬停mouse move
        _self.dragHandler.setInputAction(function (movement) {
            $("#map").css("cursor","default");
            var e = viewer.scene.pick(movement.endPosition);//选取当前的entity
            if (e && e.id && e.id.properties && e.id.properties.seq) {
                var s = e.id.properties.seq.getValue();
                if ($.inArray(s,dragSeqsArr) > -1) {
                    $("#map").css("cursor","grab"); //改变鼠标指针样式（小手）
                }
            }

            //如果已按住且选中起点（或终点图标）
            if (leftDownFlag === true && pointDraged != null) {
                $("#map").css("cursor","grabbing");
                var ray = viewer.camera.getPickRay(movement.endPosition);
                var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                pointDraged.id.position = new Cesium.CallbackProperty(function () {
                    return cartesian;
                }, false);//防止闪烁，在移动的过程
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },

    /**
     * 获取方向
     * @param startLat 起点纬度
     * @param startLng  起点经度
     * @param destLat  终点纬度
     * @param destLng  终点经度
     * @returns {number}
     */
    bearing:function(startLat, startLng, destLat, destLng){
        startLat = this.toRadians(startLat);
        startLng = this.toRadians(startLng);
        destLat = this.toRadians(destLat);
        destLng = this.toRadians(destLng);

        let y = Math.sin(destLng - startLng) * Math.cos(destLat);
        let x = Math.cos(startLat) * Math.sin(destLat) - Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
        let brng = Math.atan2(y, x);
        let brngDgr = this.toDegrees(brng);
        return (brngDgr + 360) % 360;
    },
    // Converts from degrees to radians.
    toRadians:function(degrees) {
        return degrees * Math.PI / 180;
    },

    // Converts from radians to degrees.
    toDegrees:function(radians) {
        return radians * 180 / Math.PI;
    },
    /**
     * 将某一个方案的轨迹置为选中
     */
    setPathPlanSelect: function (name) {
        var _self = this;
        //将选中的方案的div置为选中状态
        $("div[_type='carTrack']").each(function(){
            if($(this).attr("schemeName") == name){
                if (!$(this).find(".caseBtn").hasClass("active")) {
                    $(this).find(".caseBtn").addClass("active");
                }
             } else {
                $(this).find(".caseBtn").removeClass("active");
            }
        });
        //遍历实体集合，将选中方案的线置为蓝色，并添加小车动画
        var list = _self.entityCollection.values;
        for (var i = 0; i < list.length; i++) {
            var entityTemp = list[i];
            if (entityTemp.properties && entityTemp.properties.schemeName && entityTemp.properties.schemeName.getValue()) {
                var schemeName = entityTemp.properties.schemeName.getValue();//从实体中获取方案的名称
                if (name == schemeName) {
                   // entityTemp.polyline.material.color =  _self.selectColor;//将选中方案的线置为蓝色
                    entityTemp.polyline.width = 10;
                    entityTemp.polyline.material = new Cesium.PolylineGlowMaterialProperty({glowPower:0.2,color:Cesium.Color.ORANGERED.withAlpha(0.9)});
                    var trackData = entityTemp.properties.trackData.getValue();
                    _self.setEntityHeight(entityTemp,1);
                    _self.clearCzml();//清除已有的小车动画
                    _self.addCzml(trackData);//添加小车动画
                } else {
                    _self.setEntityHeight(entityTemp,0.1);
                    entityTemp.polyline.material.color = _self.color;//将不是选中方案的线置为默认颜色
                }
            }
        }
    },
    /**
     * 修改底部线的高度
     * @param entity 底部线的实体
     * @param height 高度值
     */
    setEntityHeight:function(entity,height){
        var zb = entity.properties.trackData.getValue();
        var trackData = [];
        for(var j=0;j<zb.length;j++){
            trackData.push(zb[j][0]);
            trackData.push(zb[j][1]);
            trackData.push(height);
        }
        entity.polyline.positions = Cesium.Cartesian3.fromDegreesArrayHeights(trackData);
    },
    /**
     * 添加czml小车动画，
     * @param zb 小车轨迹坐标集合
     */
    addCzml:function(zb){
        var czml = [
            {
                "id":"document",
                "version":"1.0",
                "clock": {
                    "interval": "2012-08-04T10:00:00Z/2012-08-04T15:00:00Z",
                    "currentTime": "2012-08-04T10:00:00Z",
                }
            },{
                "id":"trackLine",
                "availability" : "2012-08-04T10:00:00Z/2012-08-04T15:00:00Z",
                "model":{
                    "gltf":top.ctx+"/model/CesiumMilkTruck.glb", //小车模型的url
                    "minimumPixelSize":100,
                    "maximumScale":5000
                },
                "orientation" : {
                    "velocityReference": "#position"
                },
                "viewFrom": {
                    "cartesian": [ -2080, -1715, 779 ]
                },
                "position":{
                    "interpolationAlgorithm":"LAGRANGE",
                    "interpolationDegree":1,
                    "epoch":"2012-08-04T10:00:00Z",
                    "cartographicDegrees":[

                    ]
                }
            }];

        //给小车czml动画设置路线
        for(var j=0;j<zb.length;j++){
            czml[1].position.cartographicDegrees.push(j*0.5);
            czml[1].position.cartographicDegrees.push(zb[j][0]);
            czml[1].position.cartographicDegrees.push(zb[j][1]);
            czml[1].position.cartographicDegrees.push(0);
        }
        var data = new Date();
        var dataStr1 = this.dataTranslate(data);
        data =new Date(data.setSeconds(data.getSeconds()+zb.length*0.5));
        var dataStr2 = this.dataTranslate(data);
        czml[0].clock.interval = dataStr1+"/"+dataStr2;
        czml[1].availability = dataStr1+"/"+dataStr2;
        czml[1].position.epoch = dataStr1;
        //将czml添加到视图实体中
        this.czmlDataSource = new Cesium.CzmlDataSource("Trackpath");
        this.czmlDataSource.load(czml);
        viewer.dataSources.add(this.czmlDataSource);


        /* viewer.dataSources.add(Cesium.CzmlDataSource.load(czml)).then(function(ds) {
             viewer.trackedEntity = ds.entities.getById('path');
         });*/
    },
    /**
     * 时间格式转换
     * @param data
     */
    dataTranslate:function(data){
        var yy = data.getFullYear(); //截取年，即2012
        var MM = data.getMonth() + 1; //截取月，即07
        var dd = data.getDate(); //截取日，即29
        if (MM < 10)//目的是构造2012-12-04这样的日期
            MM = "0" + MM;
        if (dd < 10)
            dd = "0" + dd;
        var hh = data.getHours(); //截取小时，即8
        var mm = data.getMinutes(); //截取分钟，即34
        var ss = data.getTime() % 60000;
        //获取时间，因为系统中时间是以毫秒计算的， 所以秒要通过余60000得到。
        ss = (ss - (ss % 1000)) / 1000; //然后，将得到的毫秒数再处理成秒
        if (hh < 10) hh = '0' + hh; //字符串
        if (mm < 10) mm = '0' + mm; //字符串
        if (ss < 10) ss = '0' + ss; //字符串
        var str =  yy + "-" + MM + "-" + dd + "T" + hh + ":" + mm + ":" + ss+"Z";
        return str;
    },
    /**
     * 清除czml动画
     */
    clearCzml:function(){
        var _self = this;
        if(_self.czmlDataSource){
            _self.czmlDataSource.entities.remove(carTrack.czmlDataSource.entities.values[0])
        }
        // 起始时间
        var currentTime = Cesium.JulianDate.fromDate(new Date());
        // 设置始时钟始时间
        viewer.clock.startTime = currentTime.clone();
        // 设置时钟当前时间
        viewer.clock.currentTime = currentTime.clone();
    },
    /**
     * 画车辆轨迹线
     * @param records 轨迹数据集合
     */
    drawTrack:function(records){
        var _self = this;
        //如果轨迹的点位数为0，则直接返回
        if (!records || null == records || records.length < 1) {
            return;
        }

        //判断坐标是否为0的正则表达式
        var reg = new RegExp('^0');
        var zb = []; //轨迹坐标集合
        for (var i in records) {
            var z = records[i].PULOCATION;
            if (z && z.split("_").length > 1) {
                var zp = z.split("_");
                var cor;
                if (!reg.test(zp[0]) && !reg.test(zp[1])) {
                    cor = [parseFloat(zp[0]), parseFloat(zp[1])];
                    zb.push(cor);
                }
            }
        }
        //当不为0的坐标长度大于0的时候才进入里面的方法
        if(zb.length>0){
            //画轨迹线
            _self.drawTrackLine(records);
            //添加起点图标
            var start = viewer.entities.add({    //将图标添加到视图中
                position: Cesium.Cartesian3.fromDegrees(zb[0][0],zb[0][1],2.61),   //图标的位置
                billboard : {
                    image : (top.ctx || '') + '/images/gis/origin_reverse.png',  //图片的url地址
                    scale : 1,     //图标的放大倍数
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
                },
                properties :{
                    type:"start",
                }
            });
            //显示起点波动气泡
            flashControl.clearAll();//先清除地图上的波动气泡
            flashControl.circleRipple(zb[0][0]*1,zb[0][1]*1,"","blue","WGS84",1000);
            _self.entityCollection.add(start); //将终点图标实体添加到实体集合中，以便后续对它进行管理
            if(zb.length > 1){
                //添加终点图标
                var end = viewer.entities.add({    //将图标添加到视图中
                    position: Cesium.Cartesian3.fromDegrees(zb[zb.length - 1][0],zb[zb.length - 1][1],2.61),   //图标的位置
                    billboard : {
                        image : (top.ctx || '') + '/images/gis/destination_reverse.png',  //图片的url地址
                        scale : 1,     //图标的放大倍数
                        verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
                    },
                    properties :{
                        type:"end",
                    }
                });
                _self.entityCollection.add(end);//将终点图标实体添加到实体集合中，以便后续对它进行管理
                //显示终点波动气泡
                flashControl.circleRipple(zb[zb.length - 1][0]*1,zb[zb.length - 1][1]*1,"","red","WGS84",1000);
            }


        }

        //轨迹线坐标集合，因为三维的坐标的集合格式是[lon1,lat1,height1,lon2,lat2,height2,lon3,lat3,height3]
        var trackData = [];
        for(var j=0;j<zb.length;j++){
            trackData.push(zb[j][0]);
            trackData.push(zb[j][1]);
            trackData.push(0);
        }
        //添加底线实体
        /*var trackLine = viewer.entities.add({
            id : 'trackLine',
            polyline : {
                positions : Cesium.Cartesian3.fromDegreesArrayHeights(trackData),
                width : 20,
                material : new Cesium.PolylineGlowMaterialProperty({
                    glowPower : 0.8,
                    color :  Cesium.Color.BLUE.withAlpha(.01),
                })
            }
        });
        _self.entityCollection.add(trackLine);//将底线实体添加到实体集合中，以便管理*/
        //添加飞行线实体
        var data2={ //只加入常用的属性，可以在源码中加入其他属性，以下类似。
            flowing:true,
            flowImage:"http://localhost:8097/its_trafficSituation/images/gis/path.png",//飞行线的图片
            options:{
                id:"carTrack",  //因为飞行线是调用ysc的方法进行创建的，所以加上id属性，以便管理
                name: name,
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(trackData),
                    width:5,
                    zIndex:101,
                    clampToGround:true,//不设置该属性的话zIndex将无效
                    material:[new Cesium.PolylineGlowMaterialProperty({
                        glowPower : 0.8,
                        color :  Cesium.Color.ORANGE.withAlpha(.1),
                    }),6000],//混合颜色、(红绿混合透明后 就是黄色了)3000秒发射间隔,单纯材质无法展示飞行动态。所以去掉了。
                }
            }
        };
        ysc.creatTrackLine(viewer,data2);//调用ysc的方法创建飞行线
    },
    /**
     * 画轨迹线
     */
    drawTrackLine:function(records){
        var _self = this;
       // records = records.reverse();
        var hmap = new HashMap();
        var reg = new RegExp('^0');

        var zb = [];
        var lastCoor;
        var nextCoor;
        var testSegment = [];
        for (var i in records) {
            if (i < (records.length - 1)) {
                if (records[parseInt(i) + 1].PULOCATION) {
                    var nextZ = records[parseInt(i) + 1].PULOCATION;
                }

                if (nextZ && nextZ.split("_").length > 1) {
                    var nextZp = nextZ.split("_");
                    if (!reg.test(nextZp[0]) && !reg.test(nextZp[1])) {
                        nextCoor = [parseFloat(nextZp[0]), parseFloat(nextZp[1])];
                    }
                }
            }
            var z = records[i].PULOCATION;
            var time = records[i].JGSK;
            if (z && z.split("_").length > 1) {
                var zp = z.split("_");
                testSegment.push([parseFloat(zp[0]), parseFloat(zp[1])]);
                var cor;
                if (!reg.test(zp[0]) && !reg.test(zp[1])) {
                    cor = [parseFloat(zp[0]), parseFloat(zp[1])];
                    if (i < 2) {
                        zb.push(cor);
                    } else {
                        var flog = false;
                        for (var j = 0; j < zb.length - 1; j++) {
                            if (zb[j].toString() == lastCoor.toString() && zb[j + 1].toString() == cor.toString()) {
                                if (zb[j].toString() == cor.toString() && zb[j + 1].toString() == nextCoor.toString()) {
                                    flog = true;
                                    break;
                                }
                            }

                        }
                        if (!flog) {
                            zb.push(cor);
                        }
                    }
                    lastCoor = cor;
                    var key = zp.join(",");
                    if (!hmap.containsKey(key))
                        hmap.put(key, {coordinate: [parseFloat(zp[0]), parseFloat(zp[1])], times: [time]});
                    else {
                        var t = hmap.get(key);
                        t.times.push(time);
                    }
                }
            }
        }
        if (testSegment.length > 0) {
            var fiestSegment = testSegment[0];
            for (var k = 1; k < testSegment.length; k++) {
                if (testSegment[k].toString() != fiestSegment.toString()) {
                    trackReplay.trackReplay(testSegment);
                    break;
                }
            }
        }
        var siteNum = [];
        var vs = hmap.values();
        for (var j in vs) {
            var coordinate0 = vs[j].coordinate;

            if (coordinate0) {
                siteNum.push(coordinate0);
            }
        }

        if (siteNum.length < 1) {
            tipsInfoShowOrHide("轨迹坐标未定位");
            return;
        }

        var feature = new ol.Feature({
            geometry: new ol.geom.LineString(zb),
            name: 'LineArrow'
        });
        var trackData = [];
        for(var j=0;j<zb.length;j++){
            trackData.push(zb[j][0]);
            trackData.push(zb[j][1]);
            trackData.push(0.0);
        }
        var trackLineInner = viewer.entities.add({
            id : 'trackLineInner',
            polyline : {
                positions : Cesium.Cartesian3.fromDegreesArrayHeights(trackData),
                width : 2,
                zIndex:100,
                clampToGround:true,//不设置该属性的话zIndex将无效
                material : new Cesium.Color(12/255,184/255,98/255,1)
            }
        });
        _self.entityCollection.add(trackLineInner);
        var trackLineOuter = viewer.entities.add({
            id : 'trackLineOuter',
            polyline : {
                positions : Cesium.Cartesian3.fromDegreesArrayHeights(trackData),
                width : 4,
                zIndex:99,
                clampToGround:true, //不设置该属性的话zIndex将无效
                material : new Cesium.Color(39/255,129/255,203/255,1)
            }
        });
        _self.entityCollection.add(trackLineOuter);
        var geometry = feature.getGeometry();
        var extent = geometry.getExtent();
        //地图定位到轨迹,完成飞行后再调用画轨迹箭头的方法，不然会报错
        viewer.camera.flyTo({
            destination:new Cesium.Rectangle(Cesium.Math.toRadians(extent[0]-0.01), Cesium.Math.toRadians(extent[1]-0.01), Cesium.Math.toRadians(extent[2]+0.01), Cesium.Math.toRadians(extent[3]+0.01)),
            complete:function () {
                geometry.forEachSegment(function (start, end) {
                    var dx = end[0] - start[0];
                    var dy = end[1] - start[1];
                    if (dx == 0 && dy == 0) return;
                    var rotation = Math.atan2(dy, dx);
                    var s = _self.getPixelFromCoordinate(start);
                    var e = _self.getPixelFromCoordinate(end);
                    var x = e[0] - s[0];
                    var y = e[1] - s[1];
                    var zoom = Math.floor(height/236);
                    var m = Math.sqrt(200 * zoom * x * x / (x * x + y * y));
                    var n = Math.abs(Math.floor(x / m));
                    for (var i = 1; i < n; i++) {
                        var ox, oy;
                        if (s[0] < e[0])
                            ox = s[0] + i * m;
                        else
                            ox = s[0] - i * m;
                        if (s[1] < e[1])
                            oy = s[1] + i * m * Math.abs(y / x);
                        else
                            oy = s[1] - i * m * Math.abs(y / x);
                        var c = _self.getCoordinateFromPixel([ox, oy]);
                        var entity = viewer.entities.add({    //将图标添加到视图中
                            position: Cesium.Cartesian3.fromDegrees(c[0],c[1],0.1),   //图标的位置
                            billboard : {
                                image :(ctx || '') + '/images/gis/arrow1.png',  //图片的url地址
                                scale : 0.7,     //图标的放大倍数
                                verticalOrigin : Cesium.VerticalOrigin.CENTER,   //不设置此属性的话图标会进入地底
                                rotation: rotation
                            }
                        });
                        _self.arrowEntityCollection.add(entity);
                        _self.entityCollection.add(entity);
                    }
                });
            }
        });
        geometry.forEachSegment(function (start, end) {
            var dx = end[0] - start[0];
            var dy = end[1] - start[1];
            if (dx == 0 && dy == 0) return;
            var rotation = Math.atan2(dy, dx);
            if (start[0] == zb[0][0] && start[1] == zb[0][1]) {
                var midp = [];
                midp.push(parseFloat((end[0] + start[0]) / 2));
                midp.push(parseFloat((end[1] + start[1]) / 2));

                var entity = viewer.entities.add({    //将图标添加到视图中
                    position: Cesium.Cartesian3.fromDegrees(midp[0],midp[1],0.0),   //图标的位置
                    billboard : {
                        image :(ctx || '') + '/images/gis/arrow.png',  //图片的url地址
                        scale : 0.6,     //图标的放大倍数
                        verticalOrigin : Cesium.VerticalOrigin.CENTER,   //不设置此属性的话图标会进入地底
                        rotation: rotation
                    }
                });
                _self.entityCollection.add(entity);
                return;
            }
            var entity = viewer.entities.add({    //将图标添加到视图中
                position: Cesium.Cartesian3.fromDegrees(start[0],start[1],0.0),   //图标的位置
                billboard : {
                    image :(ctx || '') + '/images/gis/arrow.png',  //图片的url地址
                    scale : 0.6,     //图标的放大倍数
                    verticalOrigin : Cesium.VerticalOrigin.CENTER,   //不设置此属性的话图标会进入地底
                    rotation: rotation
                }
            });
            _self.entityCollection.add(entity);
        });
        var height = viewer.camera.positionCartographic.height;
        _self.wheelHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        _self.wheelEvent = function() {
            if (viewer.camera.positionCartographic.height != height)//当比例尺发生变化时
            {
                _self.clearArrow();
                height = viewer.camera.positionCartographic.height;
                geometry.forEachSegment(function (start, end) {
                    var dx = end[0] - start[0];
                    var dy = end[1] - start[1];
                    if (dx == 0 && dy == 0) return;
                    var rotation = Math.atan2(dy, dx);
                    var s = _self.getPixelFromCoordinate(start);
                    var e = _self.getPixelFromCoordinate(end);
                    var x = e[0] - s[0];
                    var y = e[1] - s[1];
                    var zoom = Math.floor(height/236);
                    var m = Math.sqrt(200 * zoom * x * x / (x * x + y * y));
                    var n = Math.abs(Math.floor(x / m));
                    for (var i = 1; i < n; i++) {
                        var ox, oy;
                        if (s[0] < e[0])
                            ox = s[0] + i * m;
                        else
                            ox = s[0] - i * m;
                        if (s[1] < e[1])
                            oy = s[1] + i * m * Math.abs(y / x);
                        else
                            oy = s[1] - i * m * Math.abs(y / x);
                        var c = _self.getCoordinateFromPixel([ox, oy]);
                        var entity = viewer.entities.add({    //将图标添加到视图中
                            position: Cesium.Cartesian3.fromDegrees(c[0],c[1],0.1),   //图标的位置
                            billboard : {
                                image :(ctx || '') + '/images/gis/arrow1.png',  //图片的url地址
                                scale : 0.7,     //图标的放大倍数
                                verticalOrigin : Cesium.VerticalOrigin.CENTER,   //不设置此属性的话图标会进入地底
                                rotation: rotation
                            }
                        });
                        _self.arrowEntityCollection.add(entity);
                        _self.entityCollection.add(entity);
                    }
                });
            }
        };
        _self.wheelHandler.setInputAction(_self.wheelEvent, Cesium.ScreenSpaceEventType.WHEEL);
    },
    /**
     * 经纬度坐标转屏幕坐标
     */
    getPixelFromCoordinate : function(coord){
        var  cartesian  =   Cesium.Cartesian3.fromDegrees(coord[0],coord[1]);
        var pick = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian);
        return [pick.x,pick.y];
    },
    /**
     * 屏幕坐标转经纬度坐标
     */
    getCoordinateFromPixel:function(coord){
        var pick= new Cesium.Cartesian2(coord[0],coord[1]);
        var cartesian = viewer.camera.pickEllipsoid(pick, viewer.scene.globe.ellipsoid);
        var ellipsoid=viewer.scene.globe.ellipsoid;
        var cartesian3=new Cesium.Cartesian3(cartesian.x,cartesian.y,cartesian.z);
        var cartographic=ellipsoid.cartesianToCartographic(cartesian3);
        var lat=Cesium.Math.toDegrees(cartographic.latitude);
        var lng=Cesium.Math.toDegrees(cartographic.longitude);
        return [lng,lat];
    },
    /**
     * 清除路线规划的轨迹
     */
    clearPathPlan:function () {
        var _self = this;
        for(var i=0;i<_self.entityCollection.values.length;i++){
            viewer.entities.remove(_self.entityCollection.values[i]);
        }
        _self.entityCollection.removeAll();
        _self.clearCzml();//清除小车动画
        $("div[_type='carTrack']").remove();//清除方案气泡
        viewer.entities.removeById("carTrack");
    },
    /**
     * 清除箭头
     */
    clearArrow:function(){
        var _self = this;
        for(var i=0;i<_self.arrowEntityCollection.values.length;i++){
            viewer.entities.remove(_self.arrowEntityCollection.values[i]);
        }
        _self.arrowEntityCollection.removeAll();
    },
    /**
     * 清除车辆轨迹
     */
    clear:function () {
        var _self = this;
        for(var i=0;i<_self.entityCollection.values.length;i++){
            viewer.entities.remove(_self.entityCollection.values[i]);
        }
        _self.entityCollection.removeAll();
        for(var i=0;i<_self.arrowEntityCollection.values.length;i++){
            viewer.entities.remove(_self.arrowEntityCollection.values[i]);
        }
        _self.arrowEntityCollection.removeAll();
        if(_self.wheelHandler){
            _self.wheelHandler.removeInputAction(Cesium.ScreenSpaceEventType.WHEEL);
        }

        viewer.entities.removeById("carTrack");
        if (typeof trackReplay != 'undefined' && trackReplay) {
            trackReplay.clear();
        }
        flowingLineControl.clearODLine();
    }
};