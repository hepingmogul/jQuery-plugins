/**
* @(#)flowingLine.js
*
* @description: 道路流光效果cesium版本
* @author: 尹飞 罗超 2019/08/01
* @version: 1.0
* @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
* @Copyright: 版权信息
*/

var FlowingLineControl = function(){
    this.init.apply(this, arguments);
};

FlowingLineControl.prototype = {
    viewer : null,//cesium视图对象
    geoJsonFile : null,//道路的geojson文件
    czmlList : [],//geojson转czml数据的数组
    odEntityList:[],//od线的实体集合，以便管理
    flowEntityLeader:null,//流光线实体的parent实体，以便控制显影
    flowLineEntityCollection:null,//道路流光source
    flowLineHeight:6000,//显示道路流光的高度值
    init: function (viewer) {
        this.viewer = viewer;
        //初始化od实例集合类
        this.odEntityList = new Cesium.EntityCollection();
        //初始化流光实例集合
        this.flowLineEntityCollection = new Cesium.EntityCollection();
        //初始化流光线实体的parent实体，以便控制显影
        this.flowEntityLeader =viewer.entities.add(new Cesium.Entity());
        this.flowEntityLeader.show = false;//默认先不显示，加载完后再显示，以免出现白色一闪的情况
        //初始化道路流光效果+
        this.initFlowLine3(top.ctx+'/geojson/road.geojson');
        var _self = this;
        viewer.scene.camera.moveEnd.addEventListener(function(){
            if(viewer.camera.pitch < 0 && viewer.camera.positionCartographic.height/(viewer.camera.pitch*-1) < _self.flowLineHeight){
                _self.showFlowLine();
            } else {
                _self.hideFlowLine();
            }
        });
       // this.addODLine();
       // this.addODLine([106.5700,29.5614],[106.5531,29.5932],new Cesium.Color(77 / 255, 201 / 255, 255 / 255, 1));
      //  this.addODLine([106.5898,29.5888],[106.5465,29.5628],new Cesium.Color(255 / 255, 201 / 255, 38 / 255, 1));
        this.addODLine([106.5590,29.5569],[106.5743,29.5525],new Cesium.Color(255 / 255, 201 / 255, 38 / 255, 1));
        this.addODLine([106.5590,29.5569],[106.5730,29.5746],new Cesium.Color(255 / 255, 201 / 255, 38 / 255, 1));
        this.addODLine([106.5590,29.5569],[106.5460,29.5519],new Cesium.Color(255 / 255, 201 / 255, 38 / 255, 1));
        this.addODLine([106.5590,29.5569],[106.5506,29.5767],new Cesium.Color(255 / 255, 201 / 255, 38 / 255, 1));
        _self.hideFlowLine();
    },
    //初始化道路底线
    initFlowLine3:function(url){
        var _self = this;
        //加载geojson道路数据,及添加道路底线
        var promiseRoute = Cesium.GeoJsonDataSource.load(url);
        promiseRoute.then(function(dataSource) {
            _self.flowLineDataSource = dataSource;
           // viewer.dataSources.add(_self.flowLineDataSource);
            var entities = _self.flowLineDataSource.entities.values;
            var position;
            var i;
            var lineArray = [];
            ysc.initHaloLineMaterialProperty({
                color: Cesium.Color.YELLOW.withAlpha(0.4),
                clampToGround : true,//贴地
                glowPower: 0.2
            });
            ysc.initPolylineTrailLinkMaterialProperty({
                color: Cesium.Color.GREEN,
                flowImage:top.ctx+"/images/cesium/path2.png",//飞行线的图片
                glowPower:0.0,//发光强度
            });
            for (var o = 0; o < entities.length; o++) {
                lineArray = [];
                var r = entities[o];
                r.nameID = o;   //给每条线添加一个编号，方便之后对线修改样式
                r.polyline.width = 30;  //添加默认样式
                r.polyline.material = new Cesium.HaloLineMaterialProperty/*PolylineGlowLinkMaterialProperty*/({
                    color: Cesium.Color.YELLOW.withAlpha(0.2),
                    glowPower: 0.2
                });
                //
                position = r.polyline.positions.getValue();
                for(i=0;i<position.length;i++){
                    lineArray = lineArray.concat(_self.xyzToCoordination(position[i].x,position[i].y,position[i].z));
                }

                _self.addFlowingLine(lineArray,"line"+o);
            }
        });
        setTimeout(function () {
            _self.flowEntityLeader.show = true;
        },2000); //延迟显示是为了以免出现白色一闪的情况
    },
    /**
     * 添加流光线
     * @param lineArray 线的坐标集合。例如[lon,lat,height,lon2,lat2,height2....]
     * @param name 名称
     */
    addFlowingLine:function(lineArray,name){
        /** 二 流动折线**/
        var data2={ //只加入常用的属性，可以在源码中加入其他属性，以下类似。
            flowing:true,
            //flowImage:top.ctx+"/images/gis/building.png",//飞行线的图片
            flowImage:top.ctx+"/images/cesium/path2.png",//飞行线的图片
            glowPower:0.0,//发光强度
            options:{
                name: name,
                parent:this.flowEntityLeader,
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(lineArray),
                    width:8,
                    material:[Cesium.Color.GREEN,1000],//混合颜色、(红绿混合透明后 就是黄色了)3000秒发射间隔,单纯材质无法展示飞行动态。所以去掉了。
                }
            }
        };
        var data = ysc.creatBrokenLine(viewer,data2);
        var entity = viewer.entities.add(data.options);
        this.flowLineEntityCollection.add(entity);
    },
    //世界坐标转经纬度
    xyzToCoordination:function(x,y,z) {
        var ellipsoid = viewer.scene.globe.ellipsoid;
        var cartesian3 = new Cesium.Cartesian3(x, y, z);
        var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var lng = Cesium.Math.toDegrees(cartographic.longitude);
        var height = cartographic.height;
        return [lng, lat, height]
    },
    /**
     * 添加od飞线
     * startPoint：起点坐标，数组类型，例如[lon,lat]
     * endPoint：起点坐标，数组类型，例如[lon,lat]
     * color:线的颜色，例如new Cesium.Color(77 / 255, 201 / 255, 255 / 255, 1)
     * width:线的粗细,默认5
     */
    addODLine:function(startPoint,endPoint,color,width){
        var startPoint = Cesium.Cartesian3.fromDegrees(startPoint[0], startPoint[1]);
        var endPoint = Cesium.Cartesian3.fromDegrees(endPoint[0], endPoint[1]);
        var positions = Cesium.getLinkedPointList(startPoint, endPoint, 30000, 50);
        var glowingLine = viewer.entities.add({
            polyline: {
                positions: positions,
                width: (typeof width == 'undefined') ? 5 : width,
                //material: new Cesium.PolylineAttackLinkMaterialProperty({
                material: new Cesium.PolylineArrowLinkMaterialProperty({
                    //color: new Cesium.Color(77 / 255, 201 / 255, 255 / 255, 1)
                    color: color,
                    duration:1000
                }),
            }
         });
        this.odEntityList.add(glowingLine);
        /*var colors = [
            new Cesium.Color(77 / 255, 201 / 255, 255 / 255, 1),
            new Cesium.Color(255 / 255, 201 / 255, 38 / 255, 1),
            new Cesium.Color(221 / 255, 221 / 255, 221 / 255, 1)
        ];
        for (var i = 0, len = 10; i < len; i++) {
            var startPoint = Cesium.Cartesian3.fromDegrees(106.3+Math.random() * 0.5, 29.5+Math.random() * 0.5);
            var endPoint = Cesium.Cartesian3.fromDegrees(106.3+Math.random() * 0.5, 29.5+Math.random() * 0.5);

            var positions = Cesium.getLinkedPointList(startPoint, endPoint, 30000, 50);

            var glowingLine = viewer.entities.add({
                polyline: {
                    positions: positions,
                    width: 5,
                    //material: new Cesium.PolylineAttackLinkMaterialProperty({
                    material: new Cesium.PolylineArrowLinkMaterialProperty({
                        //color: new Cesium.Color(77 / 255, 201 / 255, 255 / 255, 1)
                        color: colors[i%3],
                        duration:1000
                    }),
                }
            });
        }*/
    },

    /**
     * 添加OD轨迹线
     */
    addODTrackLine:function(records,color,width,angularityFactor){
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

        if (zb.length > 0) {
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
            flashControl.circleRipple(zb[0][0]*1,zb[0][1]*1,"","blue","WGS84");
            carTrack.entityCollection.add(start); //将终点图标实体添加到实体集合中，以便后续对它进行管理
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
            carTrack.entityCollection.add(end);//将终点图标实体添加到实体集合中，以便后续对它进行管理
            //显示终点波动气泡
            flashControl.circleRipple(zb[zb.length - 1][0]*1,zb[zb.length - 1][1]*1,"","red","WGS84");

            for (var i = 0, l = zb.length; i < l; i++) {
                if (i === zb.length - 1) {
                    break;
                }
                var startPoint = Cesium.Cartesian3.fromDegrees(zb[i][0], zb[i][1]);
                var endPoint = Cesium.Cartesian3.fromDegrees(zb[i + 1][0], zb[i + 1][1]);
                var angularity = 3000;
                if(angularityFactor){
                    angularity = angularityFactor;
                }
                var positions = Cesium.getLinkedPointList(startPoint, endPoint, angularity, 50); //(开始节点,结束节点,曲率,点集数量)
                var glowingLine = viewer.entities.add({
                    polyline: {
                        positions: positions,
                        width: (typeof width == 'undefined') ? 5 : width,
                        //material: new Cesium.PolylineAttackLinkMaterialProperty({
                        material: new Cesium.PolylineArrowLinkMaterialProperty({
                            //color: new Cesium.Color(77 / 255, 201 / 255, 255 / 255, 1)
                            color: color,
                            duration: 1000
                        }),
                    }
                });
                this.odEntityList.add(glowingLine);
            }
            var feature = new ol.Feature({
                geometry: new ol.geom.LineString(zb),
                name: 'LineArrow'
            });
            var geometry = feature.getGeometry();
            var extent = geometry.getExtent();
            viewer.camera.flyTo({
                destination:new Cesium.Rectangle(Cesium.Math.toRadians(extent[0]-0.01), Cesium.Math.toRadians(extent[1]-0.01), Cesium.Math.toRadians(extent[2]+0.01), Cesium.Math.toRadians(extent[3]+0.01))
            });
        }
    },
    //隐藏道路流光
    hideFlowLine:function(){
        this.flowLineEntityCollection.show = false
    },
    //隐藏道路流光
    showFlowLine:function(){
        if(!roadConditionsControl.isShowRealTimeRoadConditionlayer && !roadConditionsControl.isShowForecastRoadConditionlayer){
            this.flowLineEntityCollection.show = true;
        }
    },
    //清除od线
    clearODLine:function () {
        for(var i=0;i< this.odEntityList.values.length;i++ ){
            viewer.entities.remove(this.odEntityList.values[i]);
        }
        this.odEntityList.removeAll();
    }
};
