/**
 * @(#)measureControl.js
 *
 * @description: 测量相关功能
 * @author: 尹飞 2019/12/10
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */
var MeasureControl = function(){
    this.init.apply(this, arguments);
};

MeasureControl.prototype = {
    viewer: null,//cesium视图对象
    helpTooltipElement : null,//
    helpTooltip : null,
    floatingPointEntityCollection:null,
    lineEntityCollection:null,
    areaEntityCollection:null,
    measureLinehandler:null,
    measureAreaHandler:null,
    init: function (viewer) {
        this.viewer = viewer;
        this.floatingPointEntityCollection = new Cesium.EntityCollection();
        this.lineEntityCollection = new Cesium.EntityCollection();
        this.areaEntityCollection = new Cesium.EntityCollection();
    },
    //测量空间直线距离
    measureLineSpace:function () {
        var _self = this;
        _self.clear();
        viewer.scene.globe.depthTestAgainstTerrain = false;//关闭地形遮挡
        _self.measureLinehandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        var positions = [];
        var poly = null;
        if($("#measureLineTip").length == 0){
            $("body").append("<div class='mtooltip' id='measureLineTip' ></div>");
        } else {
            $("#measureLineTip").html("");
        }
        var tooltip = document.getElementById("measureLineTip");

        var distance = 0;
        var cartesian = null;

        tooltip.style.display = "block";
        var PolyLinePrimitive = (function () {
            function _(positions) {
                this.options = {
                    polyline: {
                        show: true,
                        positions: [],
                        material: new Cesium.Color(117/255,155/255,230/255.1),
                        width:3
                    }
                };
                this.positions = positions;
                this._init();
            }

            _.prototype._init = function () {
                var _this = this;
                var _update = function () {
                    return _this.positions;
                };
                //实时更新polyline.positions
                this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
                var lineEntity = viewer.entities.add(this.options);
                _self.lineEntityCollection.add(lineEntity);
            };
            return _;
        })();
        _self.measureLinehandler.setInputAction(function (movement) {
            tooltip.style.left = movement.endPosition.x + 15 + "px";
            tooltip.style.top = movement.endPosition.y - 45 + "px";
            tooltip.innerHTML = '<p>单击开始，右击退出</p>';
            cartesian = viewer.scene.pickPosition(movement.endPosition);
            let ray = viewer.camera.getPickRay(movement.endPosition);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (positions.length >= 2) {
                if (!Cesium.defined(poly)) {
                    poly = new PolyLinePrimitive(positions);
                } else {
                    positions.pop();
                    // cartesian.y += (1 + Math.random());
                    positions.push(cartesian);
                }
                distance = _self.getSpaceDistance(positions);
                tooltip.innerHTML='<p>总长:'+distance+'米</p><p>双击结束，右击清除</p>';
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        _self.measureLinehandler.setInputAction(function (movement) {
            let ray = viewer.camera.getPickRay(movement.position);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (positions.length == 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
            //在三维场景中添加Label
            var textDisance = distance + "米";
            var floatingPoint = viewer.entities.add({
                name: '空间直线距离',
                position: positions[positions.length - 1],
                point: {
                    pixelSize: 5,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                },
                label: {
                    text: textDisance,
                    font: '18px sans-serif',
                    fillColor: Cesium.Color.GOLD,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(20, -20),
                }
            });
            _self.floatingPointEntityCollection.add(floatingPoint);
            //屏蔽双击旋转的事件
            roamControl.stopRoamByCenterByDoubleClick();
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        _self.measureLinehandler.setInputAction(function (movement) {
            let ray = viewer.camera.getPickRay(movement.position);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (positions.length == 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
            distance = _self.getSpaceDistance(positions);
            //在三维场景中添加Label
            var textDisance = distance + "米";
            var floatingPoint = viewer.entities.add({
                name: '空间直线距离',
                position: positions[positions.length - 1],
                point: {
                    pixelSize: 5,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                },
                label: {
                    text: textDisance,
                    font: '18px sans-serif',
                    fillColor: Cesium.Color.GOLD,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(20, -20),
                }
            });
            _self.floatingPointEntityCollection.add(floatingPoint);
            _self.measureLinehandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK); //关闭事件句柄
            _self.measureLinehandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK); //关闭事件句柄
            _self.measureLinehandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE); //关闭事件句柄
            tooltip.style.display = "none";
            //开启双击旋转的事件
            roamControl.startRoamByCenterByDoubleClick();
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        _self.measureLinehandler.setInputAction(function (movement) {
            tooltip.style.display = "none";
            _self.measureLinehandler.destroy();
            for(var i=0;i<_self.lineEntityCollection.values.length;i++){//清除地图上画的线
                viewer.entities.remove(_self.lineEntityCollection.values[i]);
            }
            _self.lineEntityCollection.removeAll();
            for(var i=0;i<_self.floatingPointEntityCollection.values.length;i++){ //清除地图上的点
                viewer.entities.remove(_self.floatingPointEntityCollection.values[i]);
            }
            _self.floatingPointEntityCollection.removeAll();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    //空间两点距离计算函数
    getSpaceDistance:function (positions) {
        var distance = 0;
        for (var i = 0; i < positions.length - 1; i++) {
            var point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            var point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
            /**根据经纬度计算出距离**/
            var geodesic = new Cesium.EllipsoidGeodesic();
            geodesic.setEndPoints(point1cartographic, point2cartographic);
            var s = geodesic.surfaceDistance;
            //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
            //返回两点之间的距离
            s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
            distance = distance + s;
        }
        return distance.toFixed(2);
    },
    //测量空间面积
    measureAreaSpace:function () {
        var _self = this;
        _self.clear();
        viewer.scene.globe.depthTestAgainstTerrain = false;//关闭地形遮挡
        // 鼠标事件
        _self.measureAreaHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        var positions = [];
        var tempPoints = [];
        var polygon = null;
        if($("#measureAreaTip").length == 0){
            $("body").append("<div class='mtooltip' id='measureAreaTip' ></div>");
        } else {
            $("#measureAreaTip").html("");
        }
        var tooltip = document.getElementById("measureAreaTip");
        var cartesian = null;
        tooltip.style.display = "block";
        var areaEntity;
        var PolygonPrimitive = (function(){
            function _(positions){
                this.options = {
                    name:'多边形',
                    polygon : {
                        hierarchy: Cesium.Cartesian3.fromDegreesArray([]),
                        material : new Cesium.Color(61/255,138/255,216/255,0.3)
                    }
                };
                this.options2 = {
                    name:'多边形',
                    polyline: {
                        show: true,
                        positions: [],
                        material: new Cesium.Color(117/255,155/255,230/255.1),
                        width:3
                    }
                };
                this.hierarchy = positions;
                this._init();
            }

            _.prototype._init = function(){
                var _this = this;
                var _update = function () {
                    var list = [];
                    var coordinateList = [];
                    for(var k=0;k<_this.hierarchy.length;k++){
                        var lon = _self.Cartesian3_to_WGS84(_this.hierarchy[k])[0];
                        var lat = _self.Cartesian3_to_WGS84(_this.hierarchy[k])[1];
                        list.push(lon);
                        list.push(lat);
                        coordinateList.push([lon,lat]);
                    }
                    return {positions:Cesium.Cartesian3.fromDegreesArray(list)};
                    //return _self.hierarchy;
                };
                var _update2 = function () {
                    var temp = _this.hierarchy.concat();
                    if(_this.hierarchy.length > 2){
                        temp.push(_this.hierarchy[0]);
                    }
                    return temp;
                };
                //实时更新polygon.hierarchy
                this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
                this.options2.polyline.positions = new Cesium.CallbackProperty(_update2, false);
                areaEntity = viewer.entities.add(this.options);
                _self.areaEntityCollection.add(areaEntity);
                var areaLineEntity = viewer.entities.add(this.options2);
                _self.areaEntityCollection.add(areaLineEntity);
            };

            return _;
        })();
        _self.measureAreaHandler.setInputAction(function(movement){
            tooltip.style.left = movement.endPosition.x + 15 + "px";
            tooltip.style.top = movement.endPosition.y - 45 + "px";
            tooltip.innerHTML ='<p>单击开始，右击退出</p>';
            cartesian = viewer.scene.pickPosition(movement.endPosition);
            let ray = viewer.camera.getPickRay(movement.endPosition);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if(positions.length >= 2){
                if (!Cesium.defined(polygon)) {
                    polygon = new PolygonPrimitive(positions);
                }else{
                    positions.pop();
                    positions.push(cartesian);
                }
                var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                var heightString = cartographic.height;
                tempPoints.push({ lon: longitudeString, lat: latitudeString ,hei:heightString});
                var textArea = _self.getArea(tempPoints,positions) + "平方公里";
                tooltip.innerHTML='<p>'+textArea+'</p><p>双击结束，右击清除</p>';
                tempPoints.pop();
            }
        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        _self.measureAreaHandler.setInputAction(function(movement){
            let ray = viewer.camera.getPickRay(movement.position);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if(positions.length == 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
            //在三维场景中添加点
            var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
            var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            var heightString = cartographic.height;
            tempPoints.push({ lon: longitudeString, lat: latitudeString ,hei:heightString});
            //屏蔽双击旋转的事件
            roamControl.stopRoamByCenterByDoubleClick();
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);

        _self.measureAreaHandler.setInputAction(function (movement) {
            let ray = viewer.camera.getPickRay(movement.position);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (positions.length == 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
            distance = _self.getSpaceDistance(positions);
            //在三维场景中添加Label
            var textArea = _self.getArea(tempPoints,positions) + "平方公里";
            var polyPositions = areaEntity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
            var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
            var floatingPoint = viewer.entities.add({
                name : '多边形面积',
                position : polyCenter,
                label : {
                    text : textArea,
                    font : '18px sans-serif',
                    fillColor : Cesium.Color.GOLD,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth : 2,
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset : new Cesium.Cartesian2(20, -40),
                    heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
            _self.floatingPointEntityCollection.add(floatingPoint);
            _self.measureAreaHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK); //关闭事件句柄
            _self.measureAreaHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK); //关闭事件句柄
            _self.measureAreaHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE); //关闭事件句柄
            tooltip.style.display = "none";
            //开启双击旋转的事件
            roamControl.startRoamByCenterByDoubleClick();
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        _self.measureAreaHandler.setInputAction(function(movement){
            tooltip.style.display = "none";
            _self.measureAreaHandler.destroy();

            for(var i=0;i<_self.areaEntityCollection.values.length;i++){
                viewer.entities.remove(_self.areaEntityCollection.values[i]);
            }
            _self.areaEntityCollection.removeAll();
            for(var i=0;i<_self.floatingPointEntityCollection.values.length;i++){
                viewer.entities.remove(_self.floatingPointEntityCollection.values[i]);
            }
            _self.floatingPointEntityCollection.removeAll();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
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
    getArea:function (points,positions) {
        var res = 0;
        //拆分三角曲面

        for (var i = 0; i < points.length - 2; i++) {
            var j = (i + 1) % points.length;
            var k = (i + 2) % points.length;
            var totalAngle = this.Angle(points[i], points[j], points[k]);


            var dis_temp1 = this.distance(positions[i], positions[j]);
            var dis_temp2 = this.distance(positions[j], positions[k]);
            res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle)) ;
        }


        return (res/1000000.0).toFixed(4);
    },
    distance:function (point1,point2) {
        var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
        var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
        /**根据经纬度计算出距离**/
        var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;
        //返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        return s;
    },
    /*方向*/
    Bearing:function (from, to) {
        var radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad)
        var degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度
        var lat1 = from.lat * radiansPerDegree;
        var lon1 = from.lon * radiansPerDegree;
        var lat2 = to.lat * radiansPerDegree;
        var lon2 = to.lon * radiansPerDegree;
        var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        if (angle < 0) {
            angle += Math.PI * 2.0;
        }
        angle = angle * degreesPerRadian;//角度
        return angle;
    },
    /*角度*/
    Angle:function (p1, p2, p3) {
        var bearing21 = this.Bearing(p2, p1);
        var bearing23 = this.Bearing(p2, p3);
        var angle = bearing21 - bearing23;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    },
    clear:function () {
        if(this.measureAreaHandler){
            this.measureAreaHandler.destroy();
        }
        for(var i=0;i<this.areaEntityCollection.values.length;i++){//清除地图上画的面
            viewer.entities.remove(this.areaEntityCollection.values[i]);
        }
        this.areaEntityCollection.removeAll();
        for(var i=0;i<this.floatingPointEntityCollection.values.length;i++){//清除地图上画的面
            viewer.entities.remove(this.floatingPointEntityCollection.values[i]);
        }
        this.floatingPointEntityCollection.removeAll();
        if(this.measureLinehandler){
            this.measureLinehandler.destroy();
        }
        for(var i=0;i<this.lineEntityCollection.values.length;i++){//清除地图上画的线
            viewer.entities.remove(this.lineEntityCollection.values[i]);
        }
        this.lineEntityCollection.removeAll();
        for(var i=0;i<this.floatingPointEntityCollection.values.length;i++){ //清除地图上的点
            viewer.entities.remove(this.floatingPointEntityCollection.values[i]);
        }
        this.floatingPointEntityCollection.removeAll();
        if($("#measureLineTip").length > 0){
            document.getElementById("measureLineTip").style.display = "none";//隐藏测距提示框
        }
        if($("#measureAreaTip").length > 0){
            document.getElementById("measureAreaTip").style.display = "none";//隐藏测面提示框
        }
    }
};