/**
 * @(#)regionControl.js
 *
 * @description: 3d区域控制
 * @author: 尹飞 2019/10/31
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */
var RegionControl = function(){
    this.init.apply(this, arguments);
};
RegionControl.prototype = {
    view: null, //cesium视图对象
    circleRippleIDList: [],//环线波纹实体的id集合
    regionList : [],//区域集合
    regionEntityCollection:null,//交通事件地图实体集合
    init: function (view) {
        this.view = view;
        this.initBord();
        this.regionEntityCollection = new Cesium.EntityCollection();
        //this.initRegion();
    },
    //初始化区域
    initRegion:function () {
        var _self = this;
       /* var list = ["华新街街道_行政边界.geojson","古路镇_行政边界.geojson","回兴街道_行政边界.geojson","复兴镇_行政边界.geojson","复盛镇人民政府_行政边界.geojson"
                   ,"大石坝街道_行政边界.geojson","大竹林街道_行政边界.geojson","寸滩街道_行政边界.geojson","江北城街道_行政边界.geojson","礼嘉街道_行政边界.geojson",
                  "翠云街道_行政边界.geojson","蔡家岗镇_行政边界.geojson","观音桥街道_行政边界.geojson","郭家沱街道_行政边界.geojson","龙塔街道_行政边界.geojson","龙山街道_行政边界.geojson",
                  "龙溪街道_行政边界.geojson","龙兴镇_行政边界.geojson","木耳镇_行政边界.geojson","人和街道_行政边界.geojson","施家梁镇_行政边界.geojson","石船镇_行政边界.geojson","两路街道_行政边界.geojson",
                  "石马河街道_行政边界.geojson","双凤桥街道_行政边界.geojson","双龙湖街道_行政边界.geojson","水土镇_行政边界.geojson","天宫殿街道_行政边界.geojson","铁山坪街道_行政边界.geojson",
                  "五里店街道_行政边界.geojson","鱼嘴镇人民政府_行政边界.geojson","玉峰山镇_行政边界.geojson","鸳鸯街道_行政边界.geojson","王家街道_行政边界.geojson","悦来街道_行政边界.geojson"];*/
        var list = ["鸳鸯街道_行政边界.geojson","人和街道_行政边界.geojson","天宫殿街道_行政边界.geojson","翠云街道_行政边界.geojson","大竹林街道_行政边界.geojson","礼嘉街道_行政边界.geojson"];
        for(var k=0;k<list.length;k++){
            var promise = Cesium.GeoJsonDataSource.load(top.ctx +"/js/gis/region/geojson/"+list[k]);
            promise.then(function(dataSource) {
                viewer.dataSources.add(dataSource);

                //Get the array of entities
                var entities = dataSource.entities.values;

                var colorHash = {};
                for (var i = 0; i < entities.length; i++) {
                    var entity = entities[i];
                    var name = entity.name;
                    var regionCode = entity.properties.regionCode.getValue();
                    var color = colorHash[name];
                    if (!color) {
                        color = Cesium.Color.fromRandom({
                            alpha : 0.15
                        });
                        colorHash[name] = color;
                    }
                    entity.polygon.material = color;
                    entity.polygon.outline = false;
                    entity.polygon.extrudedHeight = 100;

                    //注意这里..开始
                    var polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;

                    var coordList = [];
                    for(var j=0;j<polyPositions.length;j++){
                        var coord = drawControl.Cartesian3_to_WGS84(polyPositions[j]);
                        coordList.push(coord);
                    }
                    var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
                    polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
                    var regionData = {"regionCode":regionCode,"regionPoint":coordList,"regionCenter":polyCenter};
                    _self.regionList.push(regionData);

                    entity.position = polyCenter;
                    // 注意这里..结束
                    /*entity.label={
                        // position:
                        text:name,
                        color : Cesium.Color.fromCssColorString('#fff'),
                        font:'normal 32px MicroSoft YaHei',
                        showBackground : true,
                        scale : 0.5,
                        horizontalOrigin : Cesium.HorizontalOrigin.LEFT_CLICK,
                        verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                        distanceDisplayCondition : new Cesium.DistanceDisplayCondition(10.0, 100000.0),
                        disableDepthTestDistance : 10000.0
                    }*/
                }
            }).otherwise(function(error){
                window.alert(error);
            });
        }
    },

    /**
     * 在地图上显示区域
     * @param id 区域id
     * @param coords 区域坐标集合
     * @param index 区域拥堵指数
     */
    showRegion:function(id,coords,index){
        var _self = this;
        if(index > 10){
            index = 10;
        }
        var color = Cesium.Color.RED;
        if(index < 1.3){
            color = new Cesium.Color(154/255,219/255,110/255,0.5);
        } else if(1.3<= index && index < 1.6){
            color = new Cesium.Color(154/255,219/255,110/255,0.4);
        } else if(1.6<= index && index < 1.9){
            color = new Cesium.Color(255/255,180/255,0/255,0.4);
        } else if(1.9<= index && index <= 2.2){
            color = new Cesium.Color(255/255,39/255,9/255,0.4);
        }else if(2.2<index){
            color = new Cesium.Color(148/255,19/255,28/255,0.4);
        }
        var entity = viewer.entities.add({
            id:id,
            //name : '绿色拉伸多边形',
            polygon : {
                hierarchy : Cesium.Cartesian3.fromDegreesArray(coords),
                extrudedHeight: 0,
                material : color
            },
            properties :{
                height:index*100
            }
        });
        _self.regionEntityCollection.add(entity);
    },

    /**
     * 拔高区域
     * @param id
     */
    heightRegion:function(id){
        var _self = this;
        for(var i=0;i< _self.regionEntityCollection.values.length;i++){
            if(_self.regionEntityCollection.values[i].polygon.extrudedHeight._callback){
                _self.regionEntityCollection.values[i].polygon.extrudedHeight.setCallback(function(){return 0});;
            }

        }
        var height = 0;
        viewer.entities.getById(id).polygon.material.color.setValue(viewer.entities.getById(id).polygon.material.color.getValue().withAlpha(0.8));
        var targetHeight =  viewer.entities.getById(id).properties.height.getValue();
        function changeHeight() { //这是callback，参数不能内传
            height +=10;
            if(height>=targetHeight){
               return targetHeight;
            }
            return height;
        }
        viewer.entities.getById(id).polygon.extrudedHeight = new Cesium.CallbackProperty(changeHeight,false);
    },

    /**
     * 清除区域
     */
    clearRegion:function(){
        for(var i=0;i< this.regionEntityCollection.values.length;i++ ){
            viewer.entities.remove(this.regionEntityCollection.values[i]);
        }
        this.regionEntityCollection.removeAll();
    },



    /**
     * 初始化边界
     */
    initBord:function () {
       /* var data = [];
        for(var i=0;i<bordData.length;i++){
            data.push([Cesium.Math.toRadians(bordData[i][0]),Cesium.Math.toRadians(bordData[i][1]),0]);
        }
        earth.sceneTree.root.children.push({
            "ref": 'polyline1',
            "czmObject": {
                "xbsjType": "Polyline",
                "positions":data
            }
        })*/
       var data = [];
       for(var i=0;i<bordData.length;i++){
           data = data.concat([bordData[i][0],bordData[i][1],10]);
       }
       /* var data2={ //只加入常用的属性，可以在源码中加入其他属性，以下类似。
            flowing:true,
            showImage:top.ctx+"/images/gis/ccc.png",//飞行线的图片
            width:4,
            options:{
                name: name,
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(data),
                    width:4,
                    clampToGround : true,//贴地
                    material:[Cesium.Color.GREEN,2000],//混合颜色、(红绿混合透明后 就是黄色了)3000秒发射间隔,单纯材质无法展示飞行动态。所以去掉了。
                }
            }
        };
        ysc.creatHaloLine(viewer,data2);*/
        var glowingLine = viewer.entities.add({
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(data),
                width: (typeof width == 'undefined') ? 20 : width,
                //material: new Cesium.PolylineAttackLinkMaterialProperty({
                material: new Cesium.PolylineGlowLinkMaterialProperty({
                    //color: new Cesium.Color(0 / 255, 156 / 255, 255 / 255, 1),
                    color: Cesium.Color.BLUE,
                    clampToGround : true,//贴地
                    glowPower: 0.1
                }),
            }
        });


    }
};