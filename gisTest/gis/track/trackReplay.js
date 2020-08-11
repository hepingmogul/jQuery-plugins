/**
 * @(#)trackReplay.js
 * @description: 3d轨迹回放
 * @author:  尹飞 罗超2019/10/16
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */

var TrackReplay = function(){
    this.init.apply(this, arguments);
};

TrackReplay.prototype = {

    viewer : null,

    styles : null,

    animation : false,

    speed : 50,

    currentIndex : 0,

    geoMarker : null,

    moveFeature : null,

    entityCollection : [],

    routeCoords : null,

    routeLength : null,

    now : null,

    needCalculateAngle : true,

    callBack : null, //完成回调

    init : function (viewer){
        var _self = this;
        _self.viewer = viewer;
        this.entityCollection = new Cesium.EntityCollection();
    },

    setEndedCallBack : function(callBack) {
        if (typeof callBack == "function") {
            this.callBack = callBack;
        }
    },

    trackReplay : function(coordinates)
    {
        var _self = this;
        var segmentCoordinate = _self.getSegmentCoordinate(coordinates);
        if(segmentCoordinate.length == 0){
            return ;
        }
        var route = new ol.geom.LineString(segmentCoordinate);
        _self.routeCoords = route.getCoordinates();
        _self.routeLength = _self.routeCoords.length;
        _self.geoMarker =  viewer.entities.add({    //将图标添加到视图中
            position: Cesium.Cartesian3.fromDegrees(_self.routeCoords[0][0],_self.routeCoords[0][1],1.0),   //图标的位置
            id:'geoMarker',
            billboard : {
                image : ctx + "/images/gis/drive1.png",  //图片的url地址
                scale : 1,     //图标的放大倍数
                verticalOrigin : Cesium.VerticalOrigin.CENTER,   //不设置此属性的话图标会进入地底
                disableDepthTestDistance:Number.POSITIVE_INFINITY
            }
        });
        _self.entityCollection.add(_self.geoMarker);//将终点图标实体添加到实体集合中，以便后续对它进行管理
        _self.animation = false;
        _self.lastIndex = 0;
        _self.bindEvent();
    },

    start : function(isStarted,speed) {
        var _self = this;

        _self.startAnimation(isStarted,parseInt(speed));
    },

    pause : function() {
        var _self = this;

        _self.stopAnimation(false);
    },

    adjust : function (speed) {
        var _self = this;

        if(_self.animation){
            _self.stopAnimation(false);
            _self.startAnimation(parseInt(speed));
        }
    },

    bindEvent : function()
    {

    },

    startAnimation : function(started,speedNum)
    {
        var _self = this;
        var features = _self.entityCollection.values;
        if(typeof features != "undefined" && features != null && features.length > 0){
            for(var i =0; i< features.values.length; i++){
                if(features[i].id == "geoMarker"){
                    _self.entityCollection.removeById(features[i].id);
                }
            }
        }
        if(null != _self.moveFeature){
            viewer.scene.postRender.removeEventListener(_self.moveFeature);
        }
        _self.moveFeature = viewer.scene.postRender.addEventListener(function(){

            if(_self.animation){
                var elapsedTime = new Date().getTime() - _self.now;
                if(started){
                    var index = Math.round(_self.speed*elapsedTime/1000) + _self.currentIndex;
                } else {
                    var index = Math.round(_self.speed*elapsedTime/1000) ;
                }

                _self.lastIndex = index;
                if(index > _self.routeLength){
                    _self.stopAnimation(true);
                    if (_self.callBack) {
                        _self.callBack.call(this);
                    }
                    return;
                }
                if(null != _self.routeCoords[index]){
                    _self.geoMarker.position = Cesium.Cartesian3.fromDegrees(_self.routeCoords[index][0],_self.routeCoords[index][1],1.0);

                    if (_self.needCalculateAngle) {
                        if (index+1 < _self.routeCoords.length) {
                            var dx=-_self.routeCoords[index][0]+_self.routeCoords[index+1][0];
                            var dy=-_self.routeCoords[index][1]+_self.routeCoords[index+1][1];
                            var rotation = Math.atan2(dy,dx);
                            _self.geoMarker.billboard.rotation = rotation;
                        }
                    }
                }
            } else{
                _self.currentIndex = index;
            }

        });
        _self.animation = true;
        _self.now = new Date().getTime();
        if(speedNum != null){
            _self.speed = speedNum;
        }

    },

    stopAnimation : function(ended)
    {
        var _self = this;
        _self.animation = false;
        _self.currentIndex = _self.lastIndex ;
        var coord = ended?_self.routeCoords[_self.routeLength-1]:_self.routeCoords[_self.currentIndex];
        viewer.scene.postRender.removeEventListener(_self.moveFeature);
        _self.geoMarker.position = Cesium.Cartesian3.fromDegrees(coord[0],coord[1],2.61);
    },

    getSegmentCoordinate : function(coordinates)
    {
        var segmentCoor = [];
        var lastPos = [];
        for(var i = 0;i < coordinates.length;i++){
            if (lastPos.length == 0 && coordinates[i][0] && coordinates[i][1]) {
                lastPos[0] = coordinates[i][0];
                lastPos[1] = coordinates[i][1];
                continue;
            }

            if (!lastPos[0] || !lastPos[1] || !coordinates[i][0] || !coordinates[i][1]) {
                continue;
            }

            var lonPower = Math.pow(coordinates[i][0] - lastPos[0],2);
            var latPower = Math.pow(coordinates[i][1] - lastPos[1],2);
            var distance = Math.sqrt(lonPower+latPower);
            var segmentNum = distance/0.0003;
            var cos = (coordinates[i][0] - lastPos[0])/distance;
            var sin = (coordinates[i][1] - lastPos[1])/distance;
            for(var j = 0 ;j< Math.round(segmentNum); j++){
                var newCoorLon = j*0.0003*cos+lastPos[0];
                var newCoorLat = j*0.0003*sin+lastPos[1];
                var cor = [newCoorLon,  newCoorLat];
                segmentCoor.push(cor);
            }

            lastPos[0] = coordinates[i][0];
            lastPos[1] = coordinates[i][1];
        }
        return segmentCoor;
    },

    clear : function(){
        var _self = this;
        for(var i=0;i<_self.entityCollection.values.length;i++){
            viewer.entities.remove(_self.entityCollection.values[i]);
        }
        _self.entityCollection.removeAll();
        if(null != _self.moveFeature){
            viewer.scene.postRender.removeEventListener(_self.moveFeature);
        }
    },
    CLASS_NAME : "TrackReplay"
};