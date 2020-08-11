
var poiSearchControl = null;
$(function () {
    poiSearchControl = new PoiSearchControl(viewer);
});
var PoiSearchControl = function () {
    this.init.apply(this, arguments);
};

PoiSearchControl.prototype = {
    viewer: null, //地图视图
    overlay: null,
    entityCollection: null,//poi实体集合
    init: function (viewer) {
        var _self = this;
        _self.viewer = viewer;
        _self.entityCollection = new Cesium.EntityCollection();
    },

    showPOISearchResult: function (rows) {
        var _self = this;
        //先清除地图上已有的定位图标
        _self.clear();
        for (var i = 0, l = rows.length; i < l; i++) {
            var lon = rows[i].location.split(",")[0];
            var lat = rows[i].location.split(",")[1];
            if (lon != "" && lat != "" && (lon * 1 >= -180 && lon * 1 <= 180)
                && (lat * 1 >= -90 && lat * 1 <= 90)) {
                lon = Number.parseFloat(lon) + 0.0018;
                lat = Number.parseFloat(lat) + 0.0005;

                var imgUrl = top.ctx + '/images/gis/mapicon/mark_b.png';
                var entity = viewer.entities.add({    //将图标添加到视图中
                    id:rows[i].id,   //图标的id
                    position: Cesium.Cartesian3.fromDegrees(lon,lat,2.61),   //图标的位置
                    billboard : {
                        image : imgUrl,  //图片的url地址
                        scale : 1,     //图标的放大倍数
                        verticalOrigin : Cesium.VerticalOrigin.BOTTOM,   //不设置此属性的话图标会进入地底
                    },
                    properties :{
                        type:"location",
                        lon:lon,
                        lat:lat
                    }

                });
                _self.entityCollection.add(entity);
                if (lon != 0 && lat != 0) {
                    viewer.camera.flyTo({
                        destination:Cesium.Cartesian3.fromDegrees(cor[0] * 1, cor[1] * 1,1182.57803),
                    });
                }
            }
        }
        _self.bindClickEvent();
        _self.map.getView().setZoom(15);
    },

    getPointInfo: function (id) {
        var _self = this;
        //在点击时获取像素区域
        var url = "poiSearch/poiIdSearch/" + id;
        ZT.Utils.Ajax().request(url, {
            success: function (resobj) {
                if (!resobj) return;
                var resp = eval("(" + resobj.response + ")");
                if (resp && resp != "undefined" && resp.status == "0") {
                    var data = resp.resp[0];
                    showPopup(data);
                }
            },
            failure: function () {
                alert("获取信息失败");
            }
        });
    },
    clear:function(){
        var _self = this;
        _self.entityCollection.removeAll();
    },
};