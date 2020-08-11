var roadConditionsControl = null;
$(function () {
    roadConditionsControl = new RoadConditionsControl(viewer);
});
var RoadConditionsControl = function(){
    this.init.apply(this, arguments);
};

RoadConditionsControl.prototype = {
    intervalTime : 30000,//实时路况刷新时间
    realTimeRoadConditionlayer : null,//实时路况图层
    forecastRoadConditionlayer : null,//预测路况图层
    isShowRealTimeRoadConditionlayer:false,//是否在显示实时路况图层
    isShowForecastRoadConditionlayer:false,//是否在显示预测路况图层
    timer :null,//实时路况刷新定时器
    viewer : null,
    init : function (viewer) {
        this.viewer = viewer;
        //this.initRealTimeRoadConditions();
    },
    /**
     * 初始化实时路况
     */
    initRealTimeRoadConditions:function(){
        var _self = this;
        _self.isShowRealTimeRoadConditionlayer = true;
        var longTime = new Date().getTime();
        /*_self.realTimeRoadConditionlayer = viewer.scene.imageryLayers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({
                url : 'http://10.1.211.189:19090/tm_amap_com/trafficengine/mapabc/traffictile?v=1.0&;t=1&x={x}&y={y}&z={z}&&t='+longTime,
                format: "image/png",
            })
        );*/
        var imagery = new XE.Obj.Imagery(earth);
        imagery.xbsjImageryProvider.type = 'XbsjImageryProvider';
        imagery.xbsjImageryProvider['XbsjImageryProvider'] = {
            url: "http://50.37.141.251:8883/tile?lid=traffic&get=map&cache=off&x={x}&y={y}&z={z}&_dc="+new Date().getTime(),
           // url: `http://${amapIp}:${amapApiPort}/trafficengine/mapabc/traffictile?&x={x}&y={y}&z={z}`,
            rectangle: [-Math.PI, -Math.PI * 0.5, Math.PI, Math.PI * 0.5],
            srcCoordType: 'GCJ02',  //实时纠偏
            dstCoordType: 'WGS84'
        };
        _self.realTimeRoadConditionlayer = new XE.SceneTree.Leaf(imagery);

        if(_self.timer){
            window.clearInterval(_self.timer);
        }
        _self.timer = window.setInterval(function(){
            var longTime = new Date().getTime();
            /*var option = {
                url : 'http://10.1.211.189:19090/tm_amap_com/trafficengine/mapabc/traffictile?v=1.0&;t=1&x={x}&y={y}&z={z}&&t='+longTime,
                format: "image/png"
            };
            viewer.scene.imageryLayers.remove(_self.realTimeRoadConditionlayer);
            _self.realTimeRoadConditionlayer = viewer.scene.imageryLayers.addImageryProvider(
                new Cesium.UrlTemplateImageryProvider({
                    url : 'http://10.1.211.189:19090/realTimeRoadCondition/trafficengine/mapabc/traffictile?v=1.0&;t=1&x={x}&y={y}&z={z}&&t='+longTime,
                    format: "image/png",
                })
            );*/
            _self.realTimeRoadConditionlayer.destroy();
            var imagery = new XE.Obj.Imagery(earth);
            imagery.xbsjImageryProvider.type = 'XbsjImageryProvider';
            imagery.xbsjImageryProvider['XbsjImageryProvider'] = {
                url:  "http://50.37.141.251:8883/tile?lid=traffic&get=map&cache=off&x={x}&y={y}&z={z}&_dc="+new Date().getTime(),
                //url: `http://${amapIp}:${amapApiPort}/trafficengine/mapabc/traffictile?&x={x}&y={y}&z={z}`,
                rectangle: [-Math.PI, -Math.PI * 0.5, Math.PI, Math.PI * 0.5],
                srcCoordType: 'GCJ02',  //实时纠偏
                dstCoordType: 'WGS84'
            };
            _self.realTimeRoadConditionlayer = new XE.SceneTree.Leaf(imagery);
        },_self.intervalTime);
    },
    /**
     * 关闭实时路况
     */
    hideRealTimeRoadConditions:function(){
        var _self = this;
        _self.isShowRealTimeRoadConditionlayer = true;
        /*viewer.scene.imageryLayers.remove(_self.realTimeRoadConditionlayer);*/
        if(_self.realTimeRoadConditionlayer){
            _self.realTimeRoadConditionlayer.destroy();
        }
        window.clearInterval(_self.timer);
    },
    /**
     * 初始化预测路况
     */
    initForecastRoadCondition:function(){
        var _self = this;
        _self.isShowForecastRoadConditionlayer = true;
        var data = new Date();
        data.setHours(data.getHours() + 1);
        var day = data.getDay();
        if(day == 0){
            day = 7;
        }
        var hour = data.getHours();
        /*_self.forecastRoadConditionlayer = viewer.scene.imageryLayers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({
                url : 'http://10.1.211.189:19090/history_traffic_amap_com/traffic?type=2&day='+day+'&hh='+hour+'&mm=0&x={x}&y={y}&z={z}',
                format: "image/png"
            })
        );*/
        var imagery = new XE.Obj.Imagery(earth);
        imagery.xbsjImageryProvider.type = 'XbsjImageryProvider';
        imagery.xbsjImageryProvider['XbsjImageryProvider'] = {
            url: `http://${amapIp}:${amapApiPort}/traffic?type=2&day=`+day+`&hh=`+hour+`&mm=0&x={x}&y={y}&z={z}`,
            rectangle: [-Math.PI, -Math.PI * 0.5, Math.PI, Math.PI * 0.5],
            srcCoordType: 'GCJ02',  //实时纠偏
            dstCoordType: 'WGS84'
        };
        _self.forecastRoadConditionlayer = new XE.SceneTree.Leaf(imagery);
    },
    /**
     * 获取某一时刻的预测路况，精确到分钟
     */
    showForecastRoadCondition:function(day,hour,mm){
        var _self = this;
        _self.isShowForecastRoadConditionlayer = true;
        /*viewer.scene.imageryLayers.remove(_self.forecastRoadConditionlayer);
        _self.forecastRoadConditionlayer = viewer.scene.imageryLayers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({
                url : 'http://10.1.211.189:19090/history_traffic_amap_com/traffic?type=2&day='+day+'&hh='+hour+'&mm=0&x={x}&y={y}&z={z}',
                format: "image/png"
            })
        );*/
        _self.forecastRoadConditionlayer.destroy();
        var imagery = new XE.Obj.Imagery(earth);
        imagery.xbsjImageryProvider.type = 'XbsjImageryProvider';
        imagery.xbsjImageryProvider['XbsjImageryProvider'] = {
            url: `http://${amapIp}:${amapApiPort}/traffic?type=2&day=`+day+`&hh=`+hour+`&mm=0&x={x}&y={y}&z={z}`,
            rectangle: [-Math.PI, -Math.PI * 0.5, Math.PI, Math.PI * 0.5],
            srcCoordType: 'GCJ02',  //实时纠偏
            dstCoordType: 'WGS84'
        };
        _self.forecastRoadConditionlayer = new XE.SceneTree.Leaf(imagery);
    },
    /**
     * 关闭预测路况
     */
    hideForecastRoadCondition:function(){
        var _self = this;
      /*  viewer.scene.imageryLayers.remove(_self.forecastRoadConditionlayer);*/
        if(_self.forecastRoadConditionlayer){
            _self.forecastRoadConditionlayer.destroy();
        }
    },
    /**
     * 清除路况
     */
    close:function(){
        var _self = this;
        if(_self.forecastRoadConditionlayer){
           /* viewer.scene.imageryLayers.remove(_self.forecastRoadConditionlayer);*/
            _self.forecastRoadConditionlayer.destroy();
        }
        _self.isShowRealTimeRoadConditionlayer = false;
        if(_self.realTimeRoadConditionlayer){
           /* viewer.scene.imageryLayers.remove(_self.realTimeRoadConditionlayer);*/
            _self.realTimeRoadConditionlayer.destroy();
        }
        _self.isShowForecastRoadConditionlayer = false;
        if(_self.timer){
            window.clearInterval(_self.timer);
        }
    },
};