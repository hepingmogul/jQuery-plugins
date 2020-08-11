/**
 * @(#)DrawControl.js
 *
 * @description: 3d范围框选组件
 * @author: 尹飞 2019/09/27
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */
var DrawControl = function(){
    this.init.apply(this, arguments);
};

DrawControl.prototype = {
    viewer: null, //cesium视图对象
    handlerList:[],//地图框选事件集合
    init: function (viewer) {
        this.viewer = viewer;
    },
    addDrawInteraction:function (type,callback,searchType) {
        var _self = this;
        viewer.scene.globe.depthTestAgainstTerrain = false;//关闭地形遮挡
        _self.clear();
        if(type){
            if(type == "Box"){ //矩形框选
                _self.drawRect(callback,searchType);
            } else if(type == "Circle"){ //圆形框选
                _self.circleDraw(callback,searchType);
            } else if(type == "Polygon"){ //多边形框选
                _self.drawPolygon(callback,searchType);
            } else if(type == "LineString"){ //线周边框选
                _self.drawLineString(callback);
            }

        }

    },

    addDrawInteractionForTs:function (type,callback,searchType,isHideDevice) {
        var _self = this;
        viewer.scene.globe.depthTestAgainstTerrain = false;//关闭地形遮挡
        _self.clear();
        if(type){
            if(type == "Box"){ //矩形框选
                _self.drawRectForTs(callback);
            } else if(type == "Circle"){ //圆形框选
                _self.circleDrawForTs(callback);
            } else if(type == "Polygon"){ //多边形框选
                _self.drawPolygonForTs(callback,searchType,isHideDevice);
            } else if(type == "LineString"){ //线周边框选
                _self.drawLineString(callback);
            }

        }

    },

    //画点
    drawPoint:function(callback){
        var _this = this;
        //坐标存储
        var positions = [];

        var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
        _this.handlerList.push(handler);
        //单击鼠标左键画点
        handler.setInputAction(function (movement) {
            var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.position, _this.viewer.scene.globe.ellipsoid);
            positions.push(cartesian);
            _this.viewer.entities.add({
                position: cartesian,
                point: {
                    color: Cesium.Color.RED,
                    pixelSize: 5,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        //单击鼠标右键结束画点
        handler.setInputAction(function (movement) {
            handler.destroy();
            callback(positions);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },

    /**
     * 标记单个点位
     * @param markId 点位id(自定义)
     * @param callBack 标记完执行的回调函数
     */
    markPoint : function(markId,callBack){
        var _this = this;
        if($("#measureTip").length == 0){
            $("body").append("<div class='mtooltip' id='measureTip' ></div>");
        } else {
            $("#measureTip").show();
            $("#measureTip").html("单击地图选取位置");
        }
        var tooltip = document.getElementById("measureTip");
        var imgUrl = "/images/gis/origin_reverse.png";
        if("startPoint" == markId){
            imgUrl = "/images/gis/origin_reverse.png";
        }else if("endPoint" == markId){
            imgUrl = "/images/gis/destination_reverse.png";
        }

        if(!!_this.markHandler){
            _this.markHandler.destroy();
        }

        _this.markHandler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
        _this.handlerList.push(_this.markHandler);
        //单击鼠标左键画点
        _this.markHandler.setInputAction(function (movement) {
            tooltip.style.display = "none";
            var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.position, _this.viewer.scene.globe.ellipsoid);
            _this.viewer.entities.removeById(markId);
            _this.viewer.entities.add({
                id : markId,
                position: cartesian,
                billboard : {
                    image : top.ctx+imgUrl,  //图片的url地址
                    // pixelOffset : new Cesium.Cartesian2(0, 17),
                    scale : 1,
                    // scaleByDistance:new Cesium.NearFarScalar(6000, 0.8, 8500, 0.5),
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
                }
            });
            callBack(_this.Cartesian3_to_WGS84(cartesian));
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //鼠标移动
        _this.markHandler.setInputAction(function (movement) {
            tooltip.style.left = movement.endPosition.x + 5 + "px";
            tooltip.style.top = movement.endPosition.y - 45 + "px";
            tooltip.innerHTML ='<p>单击地图选取位置</p>';
            var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.endPosition, _this.viewer.scene.globe.ellipsoid);
            if (positions.length >= 2) {
                if (!Cesium.defined(poly)) {
                    poly = new PolyLinePrimitive(positions);
                } else {
                    if(cartesian != undefined){
                        tooltip.innerHTML='<p>双击结束绘制</p>';
                        positions.pop();
                        cartesian.y += (1 + Math.random());
                        positions.push(cartesian);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },

    //画线
    drawLineString:function(callback){
        var _this = this;
        if($("#measureTip").length == 0){
            $("body").append("<div class='mtooltip' id='measureTip' ></div>");
        } else {
            $("#measureTip").show();
            $("#measureTip").html("单击开始");
        }
        var tooltip = document.getElementById("measureTip");
        var PolyLinePrimitive = (function () {
            function _(positions) {
                this.options = {
                    polyline: {
                        show: true,
                        positions: [],
                        material: Cesium.Color.RED,
                        width:3
                    }
                };
                this.positions = positions;
                this._init();
            }

            _.prototype._init = function () {
                var _self = this;
                var _update = function () {
                    return _self.positions;
                };
                //实时更新polyline.positions
                this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
                _this.lineEntity = _this.viewer.entities.add(this.options);
            };
            return _;
        })();

        var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
        _this.handlerList.push(handler);
        var positions = [];
        var poly = undefined;
        //鼠标左键单击画点
        handler.setInputAction(function (movement) {
            var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.position, _this.viewer.scene.globe.ellipsoid);
            if (positions.length == 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
            //屏蔽双击旋转的事件
            roamControl.stopRoamByCenterByDoubleClick();
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //鼠标移动
        handler.setInputAction(function (movement) {
            tooltip.style.left = movement.endPosition.x + 5 + "px";
            tooltip.style.top = movement.endPosition.y - 45 + "px";
            tooltip.innerHTML ='<p>单击开始选择</p>';
            var cartesian = _this.viewer.scene.camera.pickEllipsoid(movement.endPosition, _this.viewer.scene.globe.ellipsoid);
            if (positions.length >= 2) {
                if (!Cesium.defined(poly)) {
                    poly = new PolyLinePrimitive(positions);
                } else {
                    if(cartesian != undefined){
                        tooltip.innerHTML='<p>双击结束绘制</p>';
                        positions.pop();
                        cartesian.y += (1 + Math.random());
                        positions.push(cartesian);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //单击鼠标右键取消画线
        handler.setInputAction(function (movement) {
            tooltip.style.display = "none";
            handler.destroy();
            _this.clear();
            //开启双击旋转的事件
            roamControl.startRoamByCenterByDoubleClick();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        //双击鼠标结束画线
        handler.setInputAction(function (movement) {
            tooltip.style.display = "none";
            handler.destroy();
            var coord = [];
            for(var i=0;i<positions.length-2;i++){ //减二是因为双击的时候会调用2次单击的事件以及鼠标移动事件回存一次，导致最后一个点位存了3次
                var coordinate = _this.Cartesian3_to_WGS84(positions[i]);
                coord.push(coordinate);
            }
            if(typeof  callback == "function"){
                callback(coord);
            }
            //开启双击旋转的事件
            roamControl.startRoamByCenterByDoubleClick();
            console.info(JSON.stringify({"list":coord}));
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    },
    //画面
    drawPolygon:function(callback,searchType){
        var _this = this;
        var positions = [];
        var coordinateList = [];
        var poly = null;
        if($("#measureTip").length == 0){
            $("body").append("<div class='mtooltip' id='measureTip' ></div>");
        } else {
            $("#measureTip").show();
            $("#measureTip").html("单击开始");
        }
        var tooltip = document.getElementById("measureTip");
        var PolygonPrimitive = (function () {
            function _(positions) {
                this.options = {
                    id:"drawPolygon",
                    name: '多边形',
                    polygon: new Cesium.PolygonGraphics({
                        hierarchy: Cesium.Cartesian3.fromDegreesArray([]),
                        perPositionHeight: true,
                        material : new Cesium.Color(61/255,138/255,216/255,0.3),
                        outline : true,
                        outlineWidth: 10,
                        outlineColor : new Cesium.Color(117/255,155/255,230/255.1),
                    })
                };
                this.options2 = {
                    id:"drawPolygonLine",
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

            _.prototype._init = function () {
                var _self = this;
                var _update = function () {
                    var list = [];
                    coordinateList = [];
                    for(var k=0;k<_self.hierarchy.length;k++){
                        var lon = _this.Cartesian3_to_WGS84(_self.hierarchy[k])[0];
                        var lat = _this.Cartesian3_to_WGS84(_self.hierarchy[k])[1];
                        list.push(lon);
                        list.push(lat);
                        coordinateList.push([lon,lat]);
                    }
                    return {positions:Cesium.Cartesian3.fromDegreesArray(list)};
                    //return _self.hierarchy;
                };
                var _update2 = function () {
                    var temp = _self.hierarchy.concat();
                    if(_self.hierarchy.length > 2){
                        temp.push(_self.hierarchy[0]);
                    }
                    return temp;
                };
                //实时更新polygon.hierarchy
                this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
                this.options2.polyline.positions = new Cesium.CallbackProperty(_update2, false);
                _this.viewer.entities.add(this.options);
                _this.viewer.entities.add(this.options2);
            };
            return _;
        })();

        var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
        _this.handlerList.push(handler);


        //鼠标单击画点
        handler.setInputAction(function (movement) {
            var position = movement.position;
            if (!Cesium.defined(position)) {
                return;
            }
            var ray = _this.viewer.scene.camera.getPickRay(position);
            if (!Cesium.defined(ray)) {
                return;
            }
            var cartesian = _this.viewer.scene.globe.pick(ray, _this.viewer.scene);
            if (positions.length == 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
            //屏蔽双击旋转的事件
            roamControl.stopRoamByCenterByDoubleClick();
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //鼠标移动
        handler.setInputAction(function (movement) {
            tooltip.style.left = movement.endPosition.x + 5 + "px";
            tooltip.style.top = movement.endPosition.y - 45 + "px";
            tooltip.innerHTML ='<p>单击开始选择</p>';
            var position = movement.endPosition;
            if (!Cesium.defined(position)) {
                return;
            }
            var ray = _this.viewer.scene.camera.getPickRay(position);
            if (!Cesium.defined(ray)) {
                return;
            }
            var cartesian = _this.viewer.scene.globe.pick(ray, _this.viewer.scene);
            if (cartesian) {
                if (positions.length < 2) {
                    return;
                }
                if (positions.length >= 2) {
                    tooltip.innerHTML='<p>双击结束选择、右键清除图形</p>';
                    if (!Cesium.defined(poly)) {
                       // positions.push(cartesian);
                        poly = new PolygonPrimitive(positions);
                    } else {
                        if(cartesian != undefined){
                            positions.pop();
                            //cartesian.y += (1 + Math.random());
                            positions.push(cartesian);
                        }
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //单击鼠标右键取消画线
        handler.setInputAction(function (movement) {
            tooltip.style.display = "none";
            handler.destroy();
            _this.clear();
            //开启双击旋转的事件
            roamControl.startRoamByCenterByDoubleClick();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        //双击鼠标结束画线
        handler.setInputAction(function (movement) {
            tooltip.style.display = "none";
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK); //关闭事件句柄
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK); //关闭事件句柄
            handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE); //关闭事件句柄
            var extent = ZT.Utils.getPolyGonString(coordinateList);
            resultWinControl.spatialQuery("Polygon",extent,searchType);
            //开启双击旋转的事件
            roamControl.startRoamByCenterByDoubleClick();
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    },

    drawPolygonForTs:function(callback,searchType,isHideDevice){
        var _this = this;
        var positions = [];
        var coordinateList = [];
        var poly = null;
        if($("#measureTip").length == 0){
            $("body").append("<div class='mtooltip' id='measureTip' ></div>");
        } else {
            $("#measureTip").show();
            $("#measureTip").html("单击开始");
        }
        var tooltip = document.getElementById("measureTip");
        var PolygonPrimitive = (function () {
            function _(positions) {
                this.options = {
                    id:"drawPolygon",
                    name: '多边形',
                    polygon: new Cesium.PolygonGraphics({
                        hierarchy: Cesium.Cartesian3.fromDegreesArray([]),
                        perPositionHeight: true,
                        material : new Cesium.Color(61/255,138/255,216/255,0.3),
                        outline : true,
                        outlineWidth: 10,
                        outlineColor : new Cesium.Color(117/255,155/255,230/255.1),
                    })
                };
                this.options2 = {
                    id:"drawPolygonLine",
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

            _.prototype._init = function () {
                var _self = this;
                var _update = function () {
                    var list = [];
                    coordinateList = [];
                    for(var k=0;k<_self.hierarchy.length;k++){
                        var lon = _this.Cartesian3_to_WGS84(_self.hierarchy[k])[0];
                        var lat = _this.Cartesian3_to_WGS84(_self.hierarchy[k])[1];
                        list.push(lon);
                        list.push(lat);
                        coordinateList.push([lon,lat]);
                    }
                    return {positions:Cesium.Cartesian3.fromDegreesArray(list)};
                    //return _self.hierarchy;
                };
                var _update2 = function () {
                    var temp = _self.hierarchy.concat();
                    if(_self.hierarchy.length > 2){
                        temp.push(_self.hierarchy[0]);
                    }
                    return temp;
                };
                //实时更新polygon.hierarchy
                this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
                this.options2.polyline.positions = new Cesium.CallbackProperty(_update2, false);
                _this.viewer.entities.add(this.options);
                _this.viewer.entities.add(this.options2);
            };
            return _;
        })();

        var handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas);
        _this.handlerList.push(handler);


        //鼠标单击画点
        handler.setInputAction(function (movement) {
            var position = movement.position;
            if (!Cesium.defined(position)) {
                return;
            }
            var ray = _this.viewer.scene.camera.getPickRay(position);
            if (!Cesium.defined(ray)) {
                return;
            }
            var cartesian = _this.viewer.scene.globe.pick(ray, _this.viewer.scene);
            if (positions.length == 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
            //屏蔽双击旋转的事件
            roamControl.stopRoamByCenterByDoubleClick();
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //鼠标移动
        handler.setInputAction(function (movement) {
            var position = movement.endPosition;
            tooltip.style.left = movement.endPosition.x + 5 + "px";
            tooltip.style.top = movement.endPosition.y - 45 + "px";
            tooltip.innerHTML ='<p>单击开始选择</p>';
            if (!Cesium.defined(position)) {
                return;
            }
            var ray = _this.viewer.scene.camera.getPickRay(position);
            if (!Cesium.defined(ray)) {
                return;
            }
            var cartesian = _this.viewer.scene.globe.pick(ray, _this.viewer.scene);
            if (cartesian) {
                if (positions.length < 2) {
                    return;
                }
                if (positions.length >= 2) {
                    tooltip.innerHTML='<p>双击结束选择、右键清除图形</p>';
                    if (!Cesium.defined(poly)) {
                        // positions.push(cartesian);
                        poly = new PolygonPrimitive(positions);
                    } else {
                        if(cartesian != undefined){
                            positions.pop();
                            //cartesian.y += (1 + Math.random());
                            positions.push(cartesian);
                        }
                    }
                }
            }

        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //单击鼠标右键取消画线
        handler.setInputAction(function (movement) {
            if(isHideDevice=="true"){
                $("#deviceTypes").fadeIn();
                if(selfDefinedRegion){
                    for(var i =0; i<selfDefinedRegion.showDeviceDataType.length; i++){
                        $("#deviceTypesList").find("dl[data-type='" + selfDefinedRegion.showDeviceDataType[i] + "']").addClass("active");
                    }
                    selfDefinedRegion.showDeviceDataType=[];//添加完毕后清空保存的显示设备
                }
                if(selfDefinedTeam){
                    for(var i =0; i<selfDefinedTeam.showDeviceDataType.length; i++){
                        $("#deviceTypesList").find("dl[data-type='" + selfDefinedTeam.showDeviceDataType[i] + "']").addClass("active");
                    }
                    selfDefinedTeam.showDeviceDataType=[];//添加完毕后清空保存的显示设备
                }
                if(eventPointControl){
                    eventPointControl.showCongesition();
                    eventPointControl.showEvent();
                }
                pointControl.getPoint();
            }
            tooltip.style.display = "none";
            handler.destroy();
            _this.clear();
            //开启双击旋转的事件
            roamControl.startRoamByCenterByDoubleClick();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        //双击鼠标结束画线
        handler.setInputAction(function (movement) {
            tooltip.style.display = "none";
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK); //关闭事件句柄
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK); //关闭事件句柄
            handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE); //关闭事件句柄
            var extent = ZT.Utils.getPolyGonString(coordinateList);
            if(typeof  callback == "function"){
                callback(extent);
            }
            if(searchType!="region"){
                resultWinControl.spatialQueryForTs("Polygon",extent);
            }
            //开启双击旋转的事件
            roamControl.startRoamByCenterByDoubleClick();
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    },

    //画圆
    circleDraw(_callBack,searchType){
        let _self = this;
        _self.viewer.scene.globe.depthTestAgainstTerrain = true;
        _self.circle= {
            points:[]
            ,rect:null
            ,entity:null
            ,r:1
        };
        var tempPosition;
        if($("#measureTip").length == 0){
            $("body").append("<div class='mtooltip' id='measureTip' ></div>");
        } else {
            $("#measureTip").show();
            $("#measureTip").html("单击开始");
        }
        var tooltip = document.getElementById("measureTip");
        let cartographic1;
        let p;
        let tempLon;
        let tempLat;
        var ShapeEventHandler = new Cesium.ScreenSpaceEventHandler(_self.viewer.scene.canvas);
        _self.handlerList.push(ShapeEventHandler);
        //单击鼠标右键取消画圆
        ShapeEventHandler.setInputAction(function (movement) {
            tooltip.style.display = "none";
            ShapeEventHandler.destroy();
            _self.clear();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        ShapeEventHandler.setInputAction(function(click){
            tempPosition = _self.getPointFromWindowPoint(click.position);
            //选择的点在球面上
            if(tempPosition){
                function callBackPos() {
                    const minlon = Cesium.Math.toDegrees(_self.circle.points[0].longitude);
                    const minlat = Cesium.Math.toDegrees(_self.circle.points[0].latitude);
                    const maxlon = Cesium.Math.toDegrees(_self.circle.points[1].longitude);
                    const maxlat = Cesium.Math.toDegrees(_self.circle.points[1].latitude);
                    const r = _self.getFlatternDistance(minlat, minlon, maxlat, maxlon);
                    if(r){
                        return r;
                    }
                    return 1;
                };
                if(_self.circle.points.length==0) {
                    p = click.position;
                    cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(tempPosition);
                    _self.circle.points.push(_self.viewer.scene.globe.ellipsoid.cartesianToCartographic(tempPosition));
                    _self.circle.points.push(_self.viewer.scene.globe.ellipsoid.cartesianToCartographic(tempPosition));
                    tempLon = Cesium.Math.toDegrees(cartographic1.longitude);
                    tempLat = Cesium.Math.toDegrees(cartographic1.latitude);
                    _self.circle.entity = _self.viewer.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(tempLon,tempLat),
                        ellipse : {
                            semiMinorAxis : new Cesium.CallbackProperty(callBackPos, false),
                            semiMajorAxis : new Cesium.CallbackProperty(callBackPos, false),
                            //条形材质
                            material :  new Cesium.Color(61/255,138/255,216/255,0.3),
                            height:0.1,
                            outline : true,
                            outlineWidth: 2,
                            outlineColor : new Cesium.Color(117/255,155/255,230/255.1),
                        }
                    });
                }else{
                    tooltip.style.display = "none";
                    ShapeEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    ShapeEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    var tempCircle = new Cesium.CircleOutlineGeometry({
                        center : Cesium.Cartesian3.fromDegrees(tempLon,tempLat),
                        radius : callBackPos(),
                        granularity : Math.PI / 2
                    });
                    var geometry = Cesium.CircleOutlineGeometry.createGeometry(tempCircle);
                    /*var float64ArrayPositionsIn = geometry.attributes.position.values;
                    var positionsIn = [].slice.call(float64ArrayPositionsIn);
                    _callBack(positionsIn);*/
                    var extent = [tempLon,tempLat].toString() + "," + (callBackPos()/ 20037508.34 * 180).toString();
                    resultWinControl.spatialQuery("Circle",extent,searchType);
                }
            }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
        ShapeEventHandler.setInputAction(function(movement){
            tooltip.style.left = movement.endPosition.x + 5 + "px";
            tooltip.style.top = movement.endPosition.y - 45 + "px";
            tooltip.innerHTML ='<p>单击开始选择</p>';
            if(_self.circle.points.length==0){
                return;
            }else {
                tooltip.innerHTML ='<p>单击结束选择、右键清除图形</p>';
            }
            var moveEndPosition = _self.getPointFromWindowPoint(movement.endPosition);
            //选择的点在球面上
            if(moveEndPosition){
                _self.circle.points.pop();
                _self.circle.points.push(_self.viewer.scene.globe.ellipsoid.cartesianToCartographic(moveEndPosition));
            }
        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },

    circleDrawForTs(_callBack){
        let _self = this;
        _self.viewer.scene.globe.depthTestAgainstTerrain = true;
        _self.circle= {
            points:[]
            ,rect:null
            ,entity:null
            ,r:1
        };
        var tempPosition;
        if($("#measureTip").length == 0){
            $("body").append("<div class='mtooltip' id='measureTip' ></div>");
        } else {
            $("#measureTip").show();
            $("#measureTip").html("单击开始");
        }
        var tooltip = document.getElementById("measureTip");
        let cartographic1;
        let p;
        let tempLon;
        let tempLat;
        var ShapeEventHandler = new Cesium.ScreenSpaceEventHandler(_self.viewer.scene.canvas);
        _self.handlerList.push(ShapeEventHandler);
        //单击鼠标右键取消画圆
        ShapeEventHandler.setInputAction(function (movement) {
            tooltip.style.display = "none";
            ShapeEventHandler.destroy();
            _self.clear();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        ShapeEventHandler.setInputAction(function(click){
            tempPosition = _self.getPointFromWindowPoint(click.position);
            //选择的点在球面上
            if(tempPosition){
                function callBackPos() {
                    const minlon = Cesium.Math.toDegrees(_self.circle.points[0].longitude);
                    const minlat = Cesium.Math.toDegrees(_self.circle.points[0].latitude);
                    const maxlon = Cesium.Math.toDegrees(_self.circle.points[1].longitude);
                    const maxlat = Cesium.Math.toDegrees(_self.circle.points[1].latitude);
                    const r = _self.getFlatternDistance(minlat, minlon, maxlat, maxlon);
                    if(r){
                        return r;
                    }
                    return 1;
                };
                if(_self.circle.points.length==0) {
                    p = click.position;
                    cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(tempPosition);
                    _self.circle.points.push(_self.viewer.scene.globe.ellipsoid.cartesianToCartographic(tempPosition));
                    _self.circle.points.push(_self.viewer.scene.globe.ellipsoid.cartesianToCartographic(tempPosition));
                    tempLon = Cesium.Math.toDegrees(cartographic1.longitude);
                    tempLat = Cesium.Math.toDegrees(cartographic1.latitude);
                    _self.circle.entity = _self.viewer.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(tempLon,tempLat),
                        ellipse : {
                            semiMinorAxis : new Cesium.CallbackProperty(callBackPos, false),
                            semiMajorAxis : new Cesium.CallbackProperty(callBackPos, false),
                            //条形材质
                            material :  new Cesium.Color(61/255,138/255,216/255,0.3),
                            height:0.1,
                            outline : true,
                            outlineWidth: 2,
                            outlineColor : new Cesium.Color(117/255,155/255,230/255.1),
                        }
                    });
                }else{
                    tooltip.style.display = "none";
                    ShapeEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    ShapeEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    var extent = [tempLon,tempLat].toString() + "," + (callBackPos()/ 20037508.34 * 180).toString();
                    if(typeof _callBack == "function"){
                        _callBack(extent);
                    }
                    resultWinControl.spatialQueryForTs("Circle",extent);
                }
            }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
        ShapeEventHandler.setInputAction(function(movement){
            tooltip.style.left = movement.endPosition.x + 5 + "px";
            tooltip.style.top = movement.endPosition.y - 45 + "px";
            tooltip.innerHTML ='<p>单击开始选择</p>';
            if(_self.circle.points.length==0){
                return;
            }else {
                tooltip.innerHTML ='<p>单击结束选择、右键清除图形</p>';
            }
            var moveEndPosition = _self.getPointFromWindowPoint(movement.endPosition);
            //选择的点在球面上
            if(moveEndPosition){
                _self.circle.points.pop();
                _self.circle.points.push(_self.viewer.scene.globe.ellipsoid.cartesianToCartographic(moveEndPosition));
            }
        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },

    //画矩形
    drawRect:function(callback,searchType){
        let _self = this;
        let pointsArr = [];
        _self.shape= {
            points:[],
            rect:null,
            entity:null
        };
        var tempPosition;
        if($("#measureTip").length == 0){
            $("body").append("<div class='mtooltip' id='measureTip' ></div>");
        } else {
            $("#measureTip").show();
            $("#measureTip").html("单击开始");
        }
        var tooltip = document.getElementById("measureTip");
        var handle = new Cesium.ScreenSpaceEventHandler(_self.viewer.scene.canvas);
        _self.handlerList.push(handle);
        //单击鼠标右键取消画矩形
        handle.setInputAction(function (movement) {
            tooltip.style.display = "none";
            handle.destroy();
            _self.clear();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        //鼠标左键单击画矩形
        handle.setInputAction(function(click){
            tempPosition = _self.getPointFromWindowPoint(click.position);
            //选择的点在球面上
            if(tempPosition){
                if(_self.shape.points.length==0) {
                    pointsArr.push(tempPosition);
                    _self.shape.points.push(_self.viewer.scene.globe.ellipsoid.cartesianToCartographic(tempPosition));
                    _self.shape.rect=Cesium.Rectangle.fromCartographicArray(_self.shape.points);
                    _self.shape.rect.east+=0.000001;
                    _self.shape.rect.north+=0.000001;
                    _self.shape.entity= _self.viewer.entities.add({
                        rectangle : {
                            coordinates :_self.shape.rect,
                            material : new Cesium.Color(61/255,138/255,216/255,0.3),
                            outline : true,
                            outlineWidth: 2,
                            outlineColor : new Cesium.Color(117/255,155/255,230/255.1),
                            height:0.1
                        }
                    });
                    _self.bufferEntity = _self.shape.entity;
                }
                else{
                    tooltip.style.display = "none";
                    handle.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    handle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    var westCoordination = _self.radian_to_WGS84(_self.shape.rect.west);
                    var eastCoordination = _self.radian_to_WGS84(_self.shape.rect.east);
                    var northCoordination = _self.radian_to_WGS84(_self.shape.rect.north);
                    var southCoordination = _self.radian_to_WGS84(_self.shape.rect.south);
                    var extent = [[westCoordination,southCoordination],[eastCoordination,northCoordination]];
                   /* for(var i=0;i<pointsArr.length;i++){
                        extent.push([_self.Cartesian3_to_WGS84(pointsArr[i]).lng,_self.Cartesian3_to_WGS84(pointsArr[i]).lat]);
                    }
                    callback(extent);*/
                    resultWinControl.spatialQuery("Box",extent,searchType);
                }
            }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //鼠标移动
        handle.setInputAction(function(movement){
            tooltip.style.left = movement.endPosition.x + 5 + "px";
            tooltip.style.top = movement.endPosition.y - 45 + "px";
            tooltip.innerHTML ='<p>单击开始选择</p>';
            if(_self.shape.points.length==0){
                return;
            }else {
                tooltip.innerHTML ='<p>单击结束选择、右键清除图形</p>';
            }
            var moveEndPosition = _self.getPointFromWindowPoint(movement.endPosition);
            //选择的点在球面上
            if(moveEndPosition){
                pointsArr[1] = moveEndPosition;
                _self.shape.points[1]=_self.viewer.scene.globe.ellipsoid.cartesianToCartographic(moveEndPosition);
                _self.shape.rect= Cesium.Rectangle.fromCartographicArray(_self.shape.points);
                if(_self.shape.rect.west==_self.shape.rect.east)
                    _self.shape.rect.east+=0.000001;
                if(_self.shape.rect.south==_self.shape.rect.north)
                    _self.shape.rect.north+=0.000001;
                _self.shape.entity.rectangle.coordinates = _self.shape.rect;
            }
        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },

    //画矩形
    drawRectForTs:function(callback){
        let _self = this;
        let pointsArr = [];
        _self.shape= {
            points:[],
            rect:null,
            entity:null
        };
        var tempPosition;
        if($("#measureTip").length == 0){
            $("body").append("<div class='mtooltip' id='measureTip' ></div>");
        } else {
            $("#measureTip").show();
            $("#measureTip").html("单击开始");
        }
        var tooltip = document.getElementById("measureTip");
        var handle = new Cesium.ScreenSpaceEventHandler(_self.viewer.scene.canvas);
        _self.handlerList.push(handle);
        //单击鼠标右键取消画矩形
        handle.setInputAction(function (movement) {
            tooltip.style.display = "none";
            handle.destroy();
            _self.clear();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        //鼠标左键单击画矩形
        handle.setInputAction(function(click){
            tempPosition = _self.getPointFromWindowPoint(click.position);
            //选择的点在球面上
            if(tempPosition){
                if(_self.shape.points.length==0) {
                    pointsArr.push(tempPosition);
                    _self.shape.points.push(_self.viewer.scene.globe.ellipsoid.cartesianToCartographic(tempPosition));
                    _self.shape.rect=Cesium.Rectangle.fromCartographicArray(_self.shape.points);
                    _self.shape.rect.east+=0.000001;
                    _self.shape.rect.north+=0.000001;
                    _self.shape.entity= _self.viewer.entities.add({
                        rectangle : {
                            coordinates :_self.shape.rect,
                            material : new Cesium.Color(61/255,138/255,216/255,0.3),
                            outline : true,
                            outlineWidth: 2,
                            outlineColor : new Cesium.Color(117/255,155/255,230/255.1),
                            height:0.1
                        }
                    });
                    _self.bufferEntity = _self.shape.entity;
                }
                else{
                    tooltip.style.display = "none";
                    handle.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    handle.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    var westCoordination = _self.radian_to_WGS84(_self.shape.rect.west);
                    var eastCoordination = _self.radian_to_WGS84(_self.shape.rect.east);
                    var northCoordination = _self.radian_to_WGS84(_self.shape.rect.north);
                    var southCoordination = _self.radian_to_WGS84(_self.shape.rect.south);
                    var extent = [[westCoordination,southCoordination],[eastCoordination,northCoordination]];
                    if(typeof callback == "function"){
                        callback(extent);
                    }
                    resultWinControl.spatialQueryForTs("Box",extent);
                }
            }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
        //鼠标移动
        handle.setInputAction(function(movement){
            tooltip.style.left = movement.endPosition.x + 5 + "px";
            tooltip.style.top = movement.endPosition.y - 45 + "px";
            tooltip.innerHTML ='<p>单击开始选择</p>';
            if(_self.shape.points.length==0){
                return;
            } else {
                tooltip.innerHTML ='<p>单击结束选择、右键清除图形</p>';
            }
            var moveEndPosition = _self.getPointFromWindowPoint(movement.endPosition);
            //选择的点在球面上
            if(moveEndPosition){
                pointsArr[1] = moveEndPosition;
                _self.shape.points[1]=_self.viewer.scene.globe.ellipsoid.cartesianToCartographic(moveEndPosition);
                _self.shape.rect= Cesium.Rectangle.fromCartographicArray(_self.shape.points);
                if(_self.shape.rect.west==_self.shape.rect.east)
                    _self.shape.rect.east+=0.000001;
                if(_self.shape.rect.south==_self.shape.rect.north)
                    _self.shape.rect.north+=0.000001;
                _self.shape.entity.rectangle.coordinates = _self.shape.rect;
            }
        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },

    //清除所有Entity和ImageryLayers
    clearHandle: function () {
        var _self = this;
        for(var i=0;i< _self.handlerList.length;i++){
            _self.handlerList[i].destroy();
        }
    },
    getPointFromWindowPoint(point){
        if(this.viewer.scene.terrainProvider.constructor.name=="EllipsoidTerrainProvider") {
            return this.viewer.camera.pickEllipsoid(point,this.viewer.scene.globe.ellipsoid);
        } else {
            var ray=this.viewer.scene.camera.getPickRay(point);
            return this.viewer.scene.globe.pick(ray,this.viewer.scene);
        }
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
    //WGS84坐标系转笛卡尔坐标系
    WGS84_to_Cartesian3: function (point) {
        var car33 = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.alt);
        var x = car33.x;
        var y = car33.y;
        var z = car33.z;
        return {x: x, y: y, z: z};
    },
    //弧度转WGS84坐标系
    radian_to_WGS84:function(radian){
        return radian/ Math.PI * 180;
    },

    //计算两点间距离
    getFlatternDistance(lat1, lng1, lat2, lng2) {
        var EARTH_RADIUS = 6378137.0;    //单位M
        var PI = Math.PI;

        function getRad(d) {
            return d * PI / 180.0;
        }
        var f = getRad((lat1 + lat2) / 2);
        var g = getRad((lat1 - lat2) / 2);
        var l = getRad((lng1 - lng2) / 2);

        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);

        var s, c, w, r, d, h1, h2;
        var a = EARTH_RADIUS;
        var fl = 1 / 298.257;

        sg = sg * sg;
        sl = sl * sl;
        sf = sf * sf;

        s = sg * (1 - sl) + (1 - sf) * sl;
        c = (1 - sg) * (1 - sl) + sf * sl;

        w = Math.atan(Math.sqrt(s / c));
        r = Math.sqrt(s * c) / w;
        d = 2 * w * a;
        h1 = (3 * r - 1) / 2 / c;
        h2 = (3 * r + 1) / 2 / s;

        return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
    },
    //清除框选
    clear:function () {
        if(this.shape && this.shape.entity){
            this.viewer.entities.remove(this.shape.entity);//清除地图上画的矩形框选的图形实体
        }
        if(this.circle && this.circle.entity){
            this.viewer.entities.remove(this.circle.entity);//清除地图上画的圆形框选的图形实体
        }
        if(typeof this.lineEntity != "undefined" && this.lineEntity){
            this.viewer.entities.remove(this.lineEntity);//清除地图上画的线
        }
        this.viewer.entities.removeById("drawPolygon");////清除地图上画的多边形
        this.viewer.entities.removeById("drawPolygonLine");////清除地图上画的多边形的边线
        this.clearHandle();//清除所有的框选事件
    }
};