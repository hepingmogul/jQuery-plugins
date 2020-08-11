/**
 * @(#)roadControl.js
 *
 * @description: 3d道路
 * @author: 尹飞 2020/6/16
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */

var RoadControl = function(){
    this.init.apply(this, arguments);
};
RoadControl.prototype = {
    view: null, //cesium视图对象
    roadEntityCollection: null,//交通事件地图实体集合
    crossEntityCollection: null,//路口地图实体集合
    ArrowCollection:null,//billboard的集合
    init: function (view) {
        this.view = view;
        this.roadEntityCollection = new Cesium.EntityCollection();
        this.crossEntityCollection = new Cesium.EntityCollection();
        this.ArrowCollection = viewer.scene.primitives.add(new Cesium.BillboardCollection());
    },
    /**
     * 显示道路
     * @param id 道路id
     * @param coords 道路坐标集合
     * @param color 道路颜色
     * @param width 道路宽度
     * @param showArrow 是否显示箭头
     * @param flash 道路是否闪烁
     */
    showRoad:function (id,coords,color,width,showArrow,flash) {
        if(!color){
            color = Cesium.Color.RED;
        }
        if(!width){
            width = 8;
        }
        var _self = this;
        var list = [];
        var line = [];
        var reg = new RegExp('^0');
        for(var i=0;i< coords.length;i++){
            var z = coords[i];
            if(z){
                if(!reg.test(z[0]) && !reg.test(z[1])){
                    //如果参数中的coords为高德接口获取的坐标，需要将其转化为WGS84坐标系的坐标
                    z = gcoord.transform(
                        [parseFloat(z[0]), parseFloat(z[1])],    // 经纬度坐标
                        gcoord.AMap,               // 当前坐标系
                        gcoord.WGS84                 // 目标坐标系
                    );
                    line.push(z);
                    list.push(parseFloat(z[0]));
                    list.push(parseFloat(z[1]));
                    list.push(0);
                }
            }
        }

        var feature = new ol.Feature({
            geometry: new ol.geom.LineString(line),
            name: 'LineArrow'
        });
        var geometry = feature.getGeometry();

        var trackline = viewer.entities.add({
            id : id,
            polyline : {
                positions : Cesium.Cartesian3.fromDegreesArrayHeights(list),
                width : width,
                clampToGround:true, //不设置该属性的话zIndex将无效
                material : color
            }
        });
        _self.roadEntityCollection.add(trackline);//添加轨迹实线

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
                //添加设备图标
                _self.ArrowCollection.add({
                    id:id+"_"+i,
                    position: Cesium.Cartesian3.fromDegrees(c[0],c[1],0.1),   //图标的位置
                    image : (ctx || '') + '/images/gis/arrow1.png',  //图片的url地址
                    scale : 0.8,     //图标的放大倍数
                    verticalOrigin : Cesium.VerticalOrigin.CENTER,   //不设置此属性的话图标会进入地底
                    rotation: rotation
                });
            }
        });

        if(showArrow){ /*开始添加轨迹箭头*/
            var height = viewer.camera.positionCartographic.height;
            _self.wheelHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            _self.wheelEvent = function() {
                if (viewer.camera.positionCartographic.height != height && viewer.camera.positionCartographic.height > 450)//当比例尺发生变化时
                {
                    _self.clearArrow(id);
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
                        if(n < 2){

                        }
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
                            //添加设备图标
                            _self.ArrowCollection.add({
                                id:id+"_"+i,
                                position: Cesium.Cartesian3.fromDegrees(c[0],c[1],0.1),   //图标的位置
                                image : (ctx || '') + '/images/gis/arrow1.png',  //图片的url地址
                                scale : 0.8,     //图标的放大倍数
                                verticalOrigin : Cesium.VerticalOrigin.CENTER,   //不设置此属性的话图标会进入地底
                                rotation: rotation
                            });
                        }
                    });
                }
            };
            _self.wheelHandler.setInputAction(_self.wheelEvent, Cesium.ScreenSpaceEventType.WHEEL);


        }

    },
    /**
     * 显示路口图标
     * @param id 路口id
     * @param coor 路口坐标
     */
    showCross:function(id,coor){
        var _self = this;
        var entity = viewer.entities.add({    //将图标添加到视图中
            position: Cesium.Cartesian3.fromDegrees(coor[0] * 1,coor[1] * 1,2.61),   //图标的位置
            billboard : {
                image :top.ctx+"/theme/blue/images/event/jtts_"+"E8.png",  //图片的url地址
                scale : 1,     //图标的放大倍数
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
            }
        });
        flashControl.circleRipple(coor[0],coor[1],id,"blue","WGS84",200);
        _self.crossEntityCollection.add(entity);
    },

    clearCross:function(){
        var _self = this;
        for(var i=0;i<_self.crossEntityCollection.values.length;i++){
            viewer.entities.remove(_self.crossEntityCollection.values[i]);
        }
        flashControl.clearAllCircleRipple();
        _self.crossEntityCollection.removeAll();
    },

    /**
     * 清除道路箭头
     */
    clearArrow:function(id){
        var _self = this;
        if(id){
            for(var i=0;i<_self.ArrowCollection.length;i++){
                if(_self.ArrowCollection.get(i).id.indexOf(id+"_") > -1){
                    _self.ArrowCollection.remove(_self.ArrowCollection.get(i));
                }
            }

        } else {
            _self.ArrowCollection.removeAll();
        }

    },

    /**
     * 清除道路
     */
    clearRoad:function(){
        var _self = this;
        for(var i=0;i<_self.roadEntityCollection.values.length;i++){
            viewer.entities.remove(_self.roadEntityCollection.values[i]);
        }
        _self.roadEntityCollection.removeAll();
        _self.clearArrow();
        if(_self.wheelHandler){
            _self.wheelHandler.removeInputAction(Cesium.ScreenSpaceEventType.WHEEL);
        }
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

};