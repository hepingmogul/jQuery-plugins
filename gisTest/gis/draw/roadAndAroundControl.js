/**
 * @(#)roadAndAroundControl.js
 *
 * @description: 道路显示以及周边显示js
 * @author: 尹飞 2019/09/24
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */

var RoadAndAroundControl = function(){
    this.init.apply(this, arguments);
};

RoadAndAroundControl.prototype = {
    viewer: null,
    entityCollection: null,  //道路显示以及周边图层的实体集合
    lineWidth:100,//周边缓冲区的距离
    _x:0.0013,//经度坐标偏移值
    _y:0.0000,//纬度坐标偏移值
    init: function (viewer) {
        var _self = this;
        _self.viewer = viewer;
        _self.entityCollection = new Cesium.EntityCollection();
    },
    /**
     * 画道路
     * @param center:道路中点坐标 coords:道路坐标,name:道路的名称,icor:道路中心点位是否显示图标，是的话传图标的路径
     */
    showRoad:function(center,coords,name,icor){
        var _self = this;
        //如果参数中的center为高德接口获取的坐标，需要将其转化为WGS84坐标系的坐标
        center = gcoord.transform(
            [parseFloat(center[0]), parseFloat(center[1])],    // 经纬度坐标
            gcoord.AMap,               // 当前坐标系
            gcoord.WGS84                 // 目标坐标系
        );


        //地图移动到道路中点坐标位置
        if (center[0] != 0 && center[0] != 0) {
            viewer.camera.flyTo({
                destination:Cesium.Cartesian3.fromDegrees(center[0] * 1, center[1] * 1,1182.57803),
            });
        }
        //显示波动的气泡
        if(typeof flashControl != "undefined" && flashControl != null){
            flashControl.circleRipple(center[0],center[1],name,"red","WGS84");
        }
        //显示中点的图标
        if(icor){
            var entity = viewer.entities.add({    //将图标添加到视图中
                position: Cesium.Cartesian3.fromDegrees(center[0] * 1,center[1] * 1,2.61),   //图标的位置
                billboard : {
                    image :icor,  //图片的url地址
                    scale : 1,     //图标的放大倍数
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
                },
                properties :{
                    _type:"target",
                    type:"jam",
                    lon:center[0],
                    lat:center[1]
                }
            });
            _self.entityCollection.add(entity);
        }
        //显示道路
        var reg = new RegExp('^0');
        var list = [];
        var tempList = coords.split(";");
        for(var i=0;i< tempList.length;i++){
            var z = tempList[i].split(",");
            if(z){
                if(!reg.test(z[0]) && !reg.test(z[1])){
                    //如果参数中的coords为高德接口获取的坐标，需要将其转化为WGS84坐标系的坐标
                    z = gcoord.transform(
                        [parseFloat(z[0]), parseFloat(z[1])],    // 经纬度坐标
                        gcoord.AMap,               // 当前坐标系
                        gcoord.WGS84                 // 目标坐标系
                    );
                    list.push(parseFloat(z[0]));
                    list.push(parseFloat(z[1]));
                }
            }
        }
        var Line = viewer.entities.add({
            name : 'glowLine',
            polyline : {
                positions : Cesium.Cartesian3.fromDegreesArray(list),
                width : 20,
                material : new Cesium.PolylineGlowMaterialProperty({
                    glowPower : 0.3,
                    color : Cesium.Color.RED.withAlpha(0.9),
                    disableDepthTestDistance:Number.POSITIVE_INFINITY
                })
            }
        });
        _self.entityCollection.add(Line);
    },

    /**
     * 加图标
     * @param iconUrl 图片的url地址
     * @param location
     * @param type 用于标记图标类别，便于清除
     * @param isFlash 是否闪烁
     */
    addEntityByImg : function(iconUrl,location,type,isFlash){
        var _self = this;
        //显示波动的气泡
        if(isFlash){
            var name = parseInt(Math.random()*100000)+"";
            flashControl.circleRipple(location[0],location[1],name,"red","WGS84");
        }
        var entity = viewer.entities.add({    //将图标添加到视图中
            position: Cesium.Cartesian3.fromDegrees(location[0] * 1,location[1] * 1,2.61),   //图标的位置
            billboard : {
                image :iconUrl,
                scale : 1,     //图标的放大倍数
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
            },
            properties :{
                _type : type,
                type:type,
                lon:location[0],
                lat:location[1]
            }
        });
        _self.entityCollection.add(entity);

    },

    /**
     * 画圆形
     *  @param center:中点坐标，radiu:半径大小
     */
    showCircle:function(center,radiu){
       /* var circle = new Cesium.GeometryInstance({
            geometry : new Cesium.CircleGeometry({
                center : Cesium.Cartesian3.fromDegrees(center[0], center[1]),
                radius : radiu
            }),
            id : 'circle',
            attributes : {
                color : new Cesium.ColorGeometryInstanceAttribute(0.0, 1.0, 1.0, 0.5)
            }
        });

        viewer.scene.primitives.add(new Cesium.Primitive({
            geometryInstances : circle,
            appearance : new Cesium.PerInstanceColorAppearance()
        }));*/
        flashControl.radarScan(center[0],center[1],null,radiu);
    },

    /**
     * 画周边缓冲区
     * @param coords:道路坐标
     */
    showAround:function(coords,callBack){
        var _self = this;
        var reg = new RegExp('^0');
        var list = [];
        var tempList = coords.split(";");
        for(var i=0;i< tempList.length;i++){
            var z = tempList[i].split(",");
            var temp ;
            if(z){
                if(!reg.test(z[0]) && !reg.test(z[1])){
                    //如果参数中的coords为高德接口获取的坐标，需要将其转化为WGS84坐标系的坐标
                    z = gcoord.transform(
                        [parseFloat(z[0]), parseFloat(z[1])],    // 经纬度坐标
                        gcoord.AMap,               // 当前坐标系
                        gcoord.WGS84                 // 目标坐标系
                    );
                    temp = [parseFloat(z[0]),parseFloat(z[1])];
                    list.push(temp);
                }
            }
        }
        var lineWidth = _self.lineWidth;
        var extent = ZT.Utils.getPolyLineString(list);

        var geometry = new ol.geom.LineString(list);
        var extentTemp = geometry.getExtent();
        viewer.camera.flyTo({
            destination:new Cesium.Rectangle(Cesium.Math.toRadians(extentTemp[0]-0.002), Cesium.Math.toRadians(extentTemp[1]-0.002), Cesium.Math.toRadians(extentTemp[2]+0.002), Cesium.Math.toRadians(extentTemp[3]+0.002)),

        });

        var url = ctx + "/gis/getlinebuffer.do"
        ZT.Utils.Ajax().request(url,{
            data : "extent=" + extent + "&lineWidth=" + lineWidth,
            success :function(resobj){
                var e = resobj.response.replace(/\"/g,"");
                _self.displayPaths(e);
                var data = {"coordinates" : e};
                if(typeof(callBack) == "function"){
                    callBack(data);
                }
            },
            failure : function(resobj){
                _hideWait();
                clickType = 0;
                alert("服务端异常");
            }
        });
    },
    //绘制缓冲区
    displayPaths : function(wkttext){
        var _self = this;
        var coord = wkttext.substring(wkttext.indexOf("((")+2,wkttext.indexOf("))"));
        if(coord){
            var list = coord.split(",");
            var array = [];
            for(var i=0;i<list.length;i++){
                var a = list[i].split(" ");
                for(var j=0;j<a.length;j++){
                    if(a[j]){
                        array.push(a[j]);
                    }
                }
                array.push(1.0);
            }
            var displayPaths = viewer.entities.add({
                polygon : {
                    hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(array),
                    material :new Cesium.Color(61/255,138/255,216/255,0.3),
                    perPositionHeight : true,
                    outline : true,
                    outlineWidth:20,
                    outlineColor : new Cesium.Color(117/255,155/255,230/255,1),
                },
                properties :{
                    _type:"lineWidth"
                }
            });
            _self.entityCollection.add(displayPaths);
        }
    },
    /**
     * 清除方法
     * @param type  要清除实体的_type
     */
    clear:function(type){
        if(type){
            for(var i=0;i< this.entityCollection.values.length;i++ ){
                if(this.entityCollection.values[i].properties && this.entityCollection.values[i].properties._type && this.entityCollection.values[i].properties._type.getValue() == type){
                    viewer.entities.remove(this.entityCollection.values[i]);
                }
            }
        } else {
            flashControl.clearRadarScan();//圆形扫描清除要调用此方法
            for(var i=0;i< this.entityCollection.values.length;i++ ){ //清除所有的实体
                viewer.entities.remove(this.entityCollection.values[i]);
            }
        }
    },
};