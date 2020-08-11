/**
 * @(#)trackDynamicDrawing.js
 * @description: 轨迹动态绘制
 * @author:  尹飞 罗超2020/6/9
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */

var TrackDynamicDrawing = function(){
    this.init.apply(this, arguments);
};

TrackDynamicDrawing.prototype = {

    viewer : null,
    czmlDataSource:null,
    czmlDataSource2:null,
    init : function (viewer){
        var _self = this;
        _self.viewer = viewer;
        this.czmlDataSource = new Cesium.CzmlDataSource("historyTrackpath");
        viewer.dataSources.add(this.czmlDataSource);
        this.czmlDataSource2 = new Cesium.CzmlDataSource("historyTrackpath");
        viewer.dataSources.add(this.czmlDataSource2);
    },
    /**
     *历史轨迹动态绘制
     * @param records 历史轨迹坐标集合[[106.254,29.65854],[106.5484,29.6548]]
     * @param imgUrl 轨迹上显示的图标的url
     * @param time 动态绘制的时长 单位秒
     * @param width 轨迹线的宽度 默认8
     * @param color 轨迹线的颜色 默认红色Cesium.Color.RED
     * @param showArrow 轨迹线上是否显示箭头 false或者true,默认显示
     * @param showStartLabel 是否显示开始图标 false或者true,默认显示
     * @param showEndLabel 是否显示结束图标 false或者true,默认显示
     */
    historyTrack:function (records,imgUrl,time,width,color,showArrow,showStartLabel,showEndLabel) {
        _self = this;
        if(records.length <2){
            return;
        }



        var feature = new ol.Feature({
            geometry: new ol.geom.LineString(records),
            name: 'LineArrow'
        });

        var geometry = feature.getGeometry();
        var extent = geometry.getExtent();
        viewer.camera.flyTo({
            destination:new Cesium.Rectangle(Cesium.Math.toRadians(extent[0]-0.01), Cesium.Math.toRadians(extent[1]-0.01), Cesium.Math.toRadians(extent[2]+0.01), Cesium.Math.toRadians(extent[3]+0.01)),
            duration: 3,   //定位的时间间隔
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-90),
                roll: Cesium.Math.toRadians(0)
            },
            complete: function () {
                //records = [[106.524979,29.6232929], [106.525101,29.6229687], [106.52523,29.622591], [106.525352,29.6220264], [106.525558,29.6213017], [106.52594,29.6199074], [106.526291,29.6185112], [106.526398,29.6181698], [106.526588,29.6174717], [106.526741,29.616951], [106.527252,29.6151161], [106.527504,29.6140003], [106.527679,29.6132889], [106.52774,29.6130352], [106.527779,29.6129208], [106.527847,29.6127243], [106.527954,29.6124573], [106.528,29.61236], [106.528587,29.6113243], [106.528664,29.6112537], [106.529778,29.6092854], [106.529869,29.609129], [106.529953,29.6089649], [106.530037,29.6087875], [106.530151,29.6085472], [106.530258,29.6082668], [106.530357,29.6079865], [106.530472,29.6076317], [106.530525,29.6074009], [106.530708,29.6066971], [106.530708,29.6065502]];
                var coords = [];
                for(var i=0;i<records.length;i++){
                    /*var tempCor = gcoord.transform(
                        [parseFloat(records[i][0]), parseFloat(records[i][1])],    // 经纬度坐标
                        gcoord.AMap,               // 当前坐标系
                        gcoord.WGS84                 // 目标坐标系
                    );
                    coords.push(tempCor);*/
                    coords.push(records[i]);
                }
                records = _self.getSegmentCoordinate(coords);
                var _color = new Cesium.Color(45/255,141/255,209/255,1);
                var _width = 16;
                var _time = 0.5;
                if(color){
                    _color = color;
                }
                if(width){
                    _width = width;
                }
                if(time){
                    _time = time;
                }


                var entity = viewer.entities.add({    //将图标添加到视图中
                    id:"trackHistoryImg",
                    position: Cesium.Cartesian3.fromDegrees(records[0][0] * 1,records[0][1] * 1,2.61),   //图标的位置
                    billboard : {
                        image :top.ctx + "/images/gis/mapicon2/policeman.png",
                        width:52,
                        height:146,
                        scale : 0.8,     //图标的放大倍数
                        scaleByDistance:new Cesium.NearFarScalar(6000, 0.8, 8500, 0.5),
                        verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
                    }
                });

                var czml_path = [
                    {
                        "id":"document",
                        "version":"1.0",
                        "clock": {
                            "interval": "2012-08-04T10:00:00Z/2012-08-04T15:00:00Z",
                            "currentTime": "2012-08-04T20:00:00Z",
                        }
                    },{
                        "id":"trackHistoryLine",
                        "availability" : "2012-08-04T10:00:00Z/2012-08-04T18:02:25Z",
                        "path": {
                            "material": {
                                "polylineArrow": {
                                    "color": {
                                        rgba: [_color.red*255, _color.green*255, _color.blue*255, 255],
                                    },
                                    "outlineColor": {
                                        rgba: [0, 255, 255, 255],
                                    },
                                    "outlineWidth": 5,
                                },
                            },
                            "width": _width
                        },
                        "position":{
                            "epoch":"2012-08-04T10:00:00Z",
                            "cartographicDegrees":[
                                0.0,records[0][0],records[0][1],0.0
                            ]
                        }
                    }];

                var index = 1;
                _self.czmlDataSource2.load(czml_path);
                var interval = setInterval(function() {
                    //路径最后添加节点
                    czml_path[1].position.cartographicDegrees.push(index*_time/records.length, records[index][0], records[index][1], 1);
                    viewer.entities.getById("trackHistoryImg").position = Cesium.Cartesian3.fromDegrees(records[index][0] * 1,records[index][1] * 1,2.61);
                    //清空之前数据，否则数据越来越多
                    _self.czmlDataSource2.entities.removeAll();
                    //重新添加修改后的数据
                    _self.czmlDataSource2.load(czml_path);
                    //viewer.dataSources.add(Cesium.CzmlDataSource.load(czml_path));
                    index++;
                    if(index > records.length - 1){
                        window.clearInterval(interval);
                        viewer.entities.remove(viewer.entities.getById("trackHistoryImg"));
                    }
                }, 1000*_time/records.length);


            }
        });

    },

    clearHistoryTrack:function(){
        this.czmlDataSource2.entities.removeAll();
        this.czmlDataSource.entities.removeAll();
        viewer.entities.remove(viewer.entities.getById("trackHistoryImg"));
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
            var segmentNum = distance/0.00012;
            var cos = (coordinates[i][0] - lastPos[0])/distance;
            var sin = (coordinates[i][1] - lastPos[1])/distance;
            for(var j = 0 ;j< Math.round(segmentNum); j++){
                var newCoorLon = j*0.00012*cos+lastPos[0];
                var newCoorLat = j*0.00012*sin+lastPos[1];
                var cor = [newCoorLon,  newCoorLat];
                segmentCoor.push(cor);
            }

            lastPos[0] = coordinates[i][0];
            lastPos[1] = coordinates[i][1];
        }
        return segmentCoor;
    },
    CLASS_NAME : "TrackDynamicDrawing"
    
};
