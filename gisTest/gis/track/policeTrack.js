/**
 * @(#)policeTrack.js
 * 实时跟踪
 */
var PoliceTrack = function(){
    this.init.apply(this,arguments)
};
PoliceTrack.prototype={
    czmlDataSourceList:[],
    entityBase:null,
    init:function(viewer){
        this.viewer = viewer;
    },
    /**
     * 初始化实时跟踪轨迹
     * id:警员id
     */
    initTrack:function(id,lon,lat,billboard,name,entityBase,type){
        var _self = this;
        _self.entityBase = entityBase;
        var time = getDefaultTimes();
        var nowTime = time.et;
        var toTime = time.tn;
        var _time = 0.5;
        nowTime=nowTime.substring(0,10)+"T"+nowTime.substring(11,nowTime.length)+"Z";
        toTime=toTime.substring(0,10)+"T"+toTime.substring(11,toTime.length)+"Z";
        // var img = {"src":top.ctx + "/images/gis/mapicon2/policeman.png", width:52,height:146,}
        var img = top.ctx + "/images/gis/mapicon2/policeman.png";
        if(type == "policeCan"){
            img = top.ctx + "/images/gis/mapicon2/policecar.png";
        }

        var czml = [{
            "id": "document",
            "version": "1.0",
            "clock": {
                "interval": nowTime +"/"+ toTime,
                "currentTime": nowTime,
            }
        }, {
            "id": "policeTrackLine",
            "availability": nowTime +"/"+ toTime,
            "path": {
                "material": {
                    "polylineArrow": {
                        "color": {
                            rgba: [45, 141, 209, 255],
                        },
                        "outlineColor": {
                            rgba: [0, 255, 255, 255],
                        },
                        "outlineWidth": 5,
                    },
                },
                "width": 10
            },
            "position": {
                "epoch": nowTime,
                "cartographicDegrees": [
                    0,lon,lat,0
                ]
            }
        }];


        var dataSource = new Cesium.CzmlDataSource("policeRealTrack");
        viewer.dataSources.add(dataSource);
        dataSource.load(czml);
        _self.czmlDataSourceList.push(dataSource);
        var a = 0;
        var url = "ws://"+locationServer+"/positionByClient/"+id;
        _self.websocket_police= new WebSocket(url);
        layer.msg("开始跟踪");
        _self.websocket_police.onmessage=function(evt){
            if(evt.data&&evt.data!="连接成功"){
                var data =  eval("(" + evt.data + ")");
                //路径最后添加节点

                viewer.entities.removeById("policeTrackTemp");
                var entity = viewer.entities.add({    //将图标添加到视图中
                    id:"policeTrackTemp",
                    position: Cesium.Cartesian3.fromDegrees(lon * 1,lat * 1,2.61),   //图标的位置
                    billboard : {
                        image :img,
                        width:52,
                        height:146,
                        scale : 0.8,     //图标的放大倍数
                        scaleByDistance:new Cesium.NearFarScalar(6000, 0.8, 8500, 0.5),
                        verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
                    }
                });



                var length = czml[1].position.cartographicDegrees.length;
                var points = czml[1].position.cartographicDegrees;

                czml[1].position.cartographicDegrees = [0,points[length-3],points[length-2],points[length-1]];
                length = czml[1].position.cartographicDegrees.length;

                var dataSource = new Cesium.CzmlDataSource("policeRealTrack");
                viewer.dataSources.add(dataSource);
                _self.czmlDataSourceList.push(dataSource);
                dataSource.load(czml);

                var start = czml[1].position.cartographicDegrees[length-3];
                var end = czml[1].position.cartographicDegrees[length-2];


                var records = trackDynamicDrawing.getSegmentCoordinate([[start,end],[parseFloat(data.longitude),parseFloat(data.latitude)]]);
                if(records.length < 2){
                    return;
                }
                var index = 1;
                var interval = setInterval(function() {
                    //路径最后添加节点
                    czml[1].position.cartographicDegrees.push(index*_time/records.length, records[index][0], records[index][1], 1);
                    viewer.entities.getById("policeTrackTemp").position = Cesium.Cartesian3.fromDegrees(records[index][0] * 1,records[index][1] * 1,2.61);
                    entityBase.position = Cesium.Cartesian3.fromDegrees(records[index][0] * 1,records[index][1] * 1,2.61);
                    //清空之前数据，否则数据越来越多

                    //_self.czmlDataSource.entities.removeAll();
                    dataSource.entities.removeAll();
                    //重新添加修改后的数据
                    dataSource.load(czml);
                    index++;
                    if(index > records.length - 1){
                        window.clearInterval(interval);
                        viewer.entities.remove(viewer.entities.getById("policeTrackTemp"));
                        pointControl.getPoint();
                    }
                }, 1000*_time/records.length);

                /*a=a+15;
                //修改当前时间
                czml[0].clock.currentTime = _self.viewer.clock.currentTime.toString();
                //清空之前数据
                _self.viewer.entities.remove(_self.dataSourcePromise);
                //重新添加修改后的数据
                _self.viewer.dataSources.add(Cesium.CzmlDataSource.load(czml));*/
            }
        }
    },
    /**
     * 关闭警员websocket定位监听
     */
    closeWebSocket:function(){
        var _self = this;
        if(_self.websocket_police){
            _self.websocket_police.close();
        }
    },
    /**
     * 停止实时跟踪
     */
    stopRealTimeTrack:function(){
        var _self = this;
        _self.closeWebSocket();
        _self.viewer.entities.remove(_self.dataSourcePromise);
        _self.viewer.entities.remove(_self.entityBase);
        for(var i=0;i<_self.czmlDataSourceList.length;i++){
            _self.czmlDataSourceList[i].entities.removeAll();
            viewer.dataSources.remove(_self.czmlDataSourceList[i]);
        }
    },
    getBase64 : function (imgUrl){
        var img = new Image();
        img.src = imgUrl+'?v='+Math.random();
        img.setAttribute('crossOrigin','Anonymous');
        img.onload = function(){
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            var dataURL = canvas.toDataURL('image/jpeg');
            return dataURL
        };
    },
    /**
     * 轨迹回放
     * @param policeID
     */
    historyTrack:function (type,policeID) {
        $.post(ctx + "/positionServer/getHistoryTrack.do",{userId : policeID,startTime :"2020-06-11 00:00:00" /*getDefaultTimes().st*/,dateSource : 'LD'},function(r){
            if (!r || r.code != 200){
                return;
            }
            var ds = r.data;
            if (!ds || ds.length == 0){
                layer.msg("今日暂无轨迹");
                return;
            }

            var records = [];
            for (var i=0;i<ds.length;i++) {
                if(ds[i].longitude && ds[i].latitude){
                    records.push([ds[i].longitude,ds[i].latitude]);
                }
            }
            var imgUrl = top.ctx + "/images/gis/mapicon2/policeman.png";
            if(type == "policecar"){
                imgUrl = top.ctx + "/images/gis/mapicon2/policecar.png";
            }
            popupControl.removePopup($('#policeManPopup'));
            trackDynamicDrawing.clearHistoryTrack();
            trackDynamicDrawing.historyTrack(records,imgUrl);

        },'json');
    },
};
