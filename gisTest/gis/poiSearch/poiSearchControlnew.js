
var PoiSearchControl = function () {
    this.init.apply(this, arguments);
};

PoiSearchControl.prototype = {
    viewer: null,
    overlay: null,
    entityCollection: null,//poi实体集合
    poiOverlays: [],
    init: function (viewer) {
        var _self = this;
        _self.viewer = viewer;
        _self.entityCollection = new Cesium.EntityCollection();
    },

    showPOIPopup: function (rows) {
        var _self = this;
        _self.clear();
        var zb = [];
        for (var i = 0, l = rows.length; i < l; i++) {
            var lon = rows[i].location.split(",")[0];
            var lat = rows[i].location.split(",")[1];

            lon = Number.parseFloat(lon);
            lat = Number.parseFloat(lat);

            var imgUrl = top.ctx + '/images/gis/mapicon/mark_r.png';

            var container = document.createElement("div");
            container.setAttribute("_type","poiPopup");
            container.setAttribute("style", "height: 31px;width: 19px; cursor: pointer;position:absolute; background-image: url(" + imgUrl + ")");
            container.innerHTML = "<span style='text-align: center;float: left;width: 19px;'>" + (i + 1) + "</span>";
            $("body").append($(container));
            var divPosition= Cesium.Cartesian3.fromDegrees(lon,lat);//data.boxHeightMax为undef也没事
            ysc.creatHtmlElement(viewer,$(container),divPosition,[-10,-31],true);//data.boxHeightMax为undef也没事)


            $(container).data("data", rows[i]);
            $(container).data("coordinate", [lon,lat]);

            $(container).bind('click', function () {
                search.searchAddressDetail($(this).data("data").id);
            });

            $(container).hover(function(){
                $(this).css("background-image","url(" + top.ctx + '/images/gis/mapicon/mark_b.png' + ")");
                $(this).parent().css("z-index",10);
                var name = $(this).data("data").name;
                var coordinate = $(this).data("coordinate");
                var html = $('<div class="pa PopupsBox" id="poiHover" style="border: 1px solid #00deff;z-index:150;">' +
                    '<div class="PopupsContent01" style="width:160px;background-color: rgba(0,68,164,0.9);">' +
                    '<div class="caseSelect">' +
                    '<p class="dib" style="min-width: 140px;height:26px;">'+name+'</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="gis_bubble_triangle" style="left: 59px;"></div>' +
                    '   </div>');
                $("body").append(html);
                var divPosition= Cesium.Cartesian3.fromDegrees(coordinate[0],coordinate[1]);//data.boxHeightMax为undef也没事
                ysc.creatHtmlElement(viewer,$(html),divPosition,[-60,-70],true);//data.boxHeightMax为undef也没事)
            },function(){
                $(this).css("background-image","url(" + top.ctx + '/images/gis/mapicon/mark_r.png' + ")");
                $(this).parent().css("z-index",0);
                $("#poiHover").remove();
            });
        }

        if (rows.length == 1) {
            viewer.camera.flyTo({
                destination:Cesium.Cartesian3.fromDegrees(lon * 1, lat * 1,1182.57803),
            });
        } else {
            //map.getView().fit(feature.getGeometry(), map.getSize(), {padding: [50, 50, 50, 50], maxZoom: 15});
            viewer.camera.flyTo({
                destination:Cesium.Cartesian3.fromDegrees(lon * 1, lat * 1,1182.57803),
            });
        }
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
                lon = Number.parseFloat(lon) ;
                lat = Number.parseFloat(lat);

                var imgUrl = top.ctx + '/images/gis/mapicon/mark_r.png';
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
                        destination:Cesium.Cartesian3.fromDegrees(lon * 1, lat * 1,1182.57803),
                    });
                }
            }
        }
        _self.bindClickEvent();
        _self.map.getView().setZoom(15);
    },

    getPointInfo: function (id) {
        //在点击时获取像素区域
        search.searchAddressDetail(id);
    },
    clear: function () {
        var _self = this;
        for(var i=0;i<_self.entityCollection.values.length;i++){
            viewer.entities.remove(_self.entityCollection.values[i]);
        }
        $("div[_type='poiPopup']").remove();
    }
};