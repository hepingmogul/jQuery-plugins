/**
 * @(#)echartsMap.js
 * @description: echarts与cesium地图结合
 * @author:  尹飞 2019/10/17
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */
var echartsMap = null;
$(function () {
    echartsMap = new EchartsMap(viewer);
});
var EchartsMap = function () {
    this.init.apply(this, arguments);
};

EchartsMap.prototype = {

    echart: null,

    mapLayer: null,

    flashMarkLayer: null,

    viewer: null,

    echartdiv: null,

    option: null,

    myChart: null,

    _geoCoord: [],

    handler: null,

    init: function (viewer) {
        var scope = this;
        scope.viewer = viewer;
        scope.echart = echarts2;  //需要导入echarts的js文件才可以得到该变量
    },
    /**
     * 绑定事件
     */
    event: function () {
        var scope = this;
        scope.myChart.on("click", function (param) {
            //事件函数
        });
    },

    /**
     * echarts轨迹绘制
     * records：数组类型,[{站点id:"site",经过时间:"time"}]
     * lineWidth:轨迹线的宽度，默认值为2
     * lineColor:轨迹线的颜色，默认为"red"
     * beginCircleColor:起点的波动圆的颜色，默认为"red"
     * endCircleColor:终点的波动圆的颜色，默认为"red"
     * circleRadius:波动圆的半径大小，默认为10
     */
    drawEchartsTrack: function (records) {
        records.reverse();
        var scope = this;
        var device = [];
        var hmap = new HashMap();
        var reg = new RegExp('^0');
        var times = [];
        for (var i in records) {
            var z = records[i].puLocation;
            var time = records[i].time;
            if (z && z.split("_").length > 1) {
                var zp = z.split("_");
                if (!reg.test(zp[0]) && !reg.test(zp[1])) {
                    device.push({puLocation: records[i].puLocation, deviceName: records[i].deviceName});
                    var key = zp.join(",");
                    if (!hmap.containsKey(key))
                        hmap.put(key, {coordinate: [parseFloat(zp[0]), parseFloat(zp[1])], times: [time]});
                    else {
                        var t = hmap.get(key);
                        t.times.push(time);
                    }
                }
            }
        }
        var keys = hmap.keys();
        for (var j in keys) {
            times.push(hmap.get(keys[j]));
        }
        scope.option = scope.getTrackOption(device);
        ysc.echartsCombineCesium(viewer,scope.option);
    }
    /**
     * 交通信号配时优化-演示功能
     * 信号机点位直线相连
     * @param recordsList
     */
    , drawEchartsTrack2: function (recordsList) {
        //records.reverse();
        var scope = this;
        var echartdiv = document.getElementById("divEchartsMapGis");
        var deviceList = [];
        var hmap = new HashMap();
        var reg = new RegExp('^0');
        var times = [];
        for (var j = 0; j < recordsList.length; j++) {
            var device = [];
            var records = recordsList[j];
            for (var i in records) {
                var z = records[i].puLocation;
                var time = records[i].time;
                var tracestring;
                if (z && z.split("_").length > 1) {
                    var zp = z.split("_");
                    if (!reg.test(zp[0]) && !reg.test(zp[1])) {
                        device.push({
                            puLocation: records[i].puLocation,
                            deviceName: records[i].deviceName,
                            overlapping: records[i].overlapping
                        });
                        var key = zp.join(",");
                        if (!hmap.containsKey(key))
                            hmap.put(key, {coordinate: [parseFloat(zp[0]), parseFloat(zp[1])], times: [time]});
                        else {
                            var t = hmap.get(key);
                            t.times.push(time);
                        }
                    }
                }
            }
            deviceList.push(device);
        }

        var keys = hmap.keys();
        //if(flog)	//缩放时时间气泡显示与否
        for (var j in keys) {
            times.push(hmap.get(keys[j]));
        }
        //popupControl.showTimePopWins(times);
        echartdiv.style.cssText = "position:absolute;width:" + map.getSize()[0] + "px;height:"
            + map.getSize()[1] + "px;";
        scope.echartdiv = echartdiv;
        scope.option = scope.getTrackOption2(deviceList);
        scope.mapLayer = new ol.Overlay({
            element: echartdiv,
            positioning: 'center-center',
            stopEvent: false   //开启map的事件，以免点击事件没反应
        });
        var cor = scope.map.getView().getCenter();
        scope.mapLayer.setPosition(cor);
        map.addOverlay(scope.mapLayer);
        scope.handler = function (e) {
            scope.updateLayer(e);
        };
        map.on("moveend", scope.handler);
        scope.updateLayer();
        map.getView().on("change:resolution", function (evt) {
            scope.hide();
        });
    },

    /**
     * echarts闪烁点绘制
     * records：数组类型,[{"puLocation",lon1_lat1,"deviceName":"",color:""},{"puLocation",lon2_lat2,"deviceName":"",color:""}...]
     * color:波动圆的默认颜色，默认为"red"
     * circleRadius:波动圆的半径大小，默认为10
     * originalPoint:起点 {"puLocation":lon1_lat1,"deviceName":"",color:""}
     *
     */
    drawEchartsFlashMark: function (records, color, circleRadius, originalPoint) {
        this.clear();
        records.reverse();
        var scope = this;

        scope.option = scope.getFlashOption(records, color, circleRadius, originalPoint);
        ysc.echartsCombineCesium(viewer,scope.option);
    },

    getFlashOption: function (device, color, circleRadius, originalPoint) {
        var reg = new RegExp('^0');
        var geoCoordate = {};
        var series = [];
        for (var i in device) {
            var z = device[i].puLocation;
            if (z && z.split("_").length > 1) {
                var zp = z.split("_");
                if (!reg.test(zp[0]) && !reg.test(zp[1])) {
                    var deviceName = device[i].deviceName ? device[i].deviceName : '未知';
                    geoCoordate[deviceName] = [parseFloat(zp[0]), parseFloat(zp[1])];
                }
            }
        }
        if (originalPoint) {
            var z = originalPoint.puLocation;
            if (z && z.split("_").length > 1) {
                var zp = z.split("_");
                if (!reg.test(zp[0]) && !reg.test(zp[1])) {
                    var deviceName = originalPoint.deviceName ? originalPoint.deviceName : '未知';
                    geoCoordate[deviceName] = [parseFloat(zp[0]), parseFloat(zp[1])];
                }
            }
            var markLineDate = [];
            for (var i = 0; i < device.length; i++) {
                var startDeviceName = originalPoint.deviceName ? originalPoint.deviceName : '未知';
                var endDeviceName = device[i].deviceName ? device[i].deviceName : '未知';
                var singleLineDate ={
                    fromName: startDeviceName,
                    toName: endDeviceName,
                    coords: [geoCoordate[startDeviceName], geoCoordate[endDeviceName]],
                    value: 1
                };
                markLineDate.push(singleLineDate);
            }
            var item = {
                type: 'lines',
                coordinateSystem: 'GLMap',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 4, //箭头指向速度，值越小速度越快
                    trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
                    symbol: 'arrow', //箭头图标
                    symbolSize: 10, //图标大小
                },
                lineStyle: {
                    normal: {
                        width: 3, //尾迹线条宽度
                        opacity: 1, //尾迹线条透明度
                        color: '#00EAFF',//线的颜色
                        curveness: .3 //尾迹线条曲直度
                    }
                },
                data: markLineDate
            };
            series.push(item);
        }

        var option = {
            animation: !1,
            GLMap: {},
            series: series
        };
        return option;
    },
    getTrackOption: function (device) {
        var scope = this;
        var reg = new RegExp('^0');
        var geoCoordate = {};
        var markPointDate = [];
        var markLineDate = [];
        for (var i in device) {
            var z = device[i].puLocation;
            if (z && z.split("_").length > 1) {
                var zp = z.split("_");
                if (!reg.test(zp[0]) && !reg.test(zp[1])) {
                    var deviceName = device[i].deviceName ? device[i].deviceName : '未知';
                    geoCoordate[deviceName] = [parseFloat(zp[0]), parseFloat(zp[1])];
                    if (i == 0) {
                        markPointDate.push({name: deviceName, value: 0});
                    } else if (i == (device.length - 1)) {
                        markPointDate.push({name: deviceName, value: 1});
                    }
                }
            }
        }
        for (var i = 0; i < (device.length - 1); i++) {
            var startDeviceName = device[i].deviceName ? device[i].deviceName : '未知';
            var endDeviceName = device[i + 1].deviceName ? device[i + 1].deviceName : '未知';
            var singleLineDate = [{name: startDeviceName}, {name: endDeviceName, value: 1}];
            markLineDate.push(singleLineDate);
        }
        markLineDate = scope.dealData(markLineDate);
        var option = {
            color: ["black", 'aqua', 'lime'],
            tooltip: {
                trigger: 'item',
                formatter: '{b}'
            },
            dataRange: {
                show: false,
                min: 0,
                max: 1,
                calculable: true,
                color: ["red", "yellow"],
                textStyle: {
                    color: '#fff'
                }
            },
            series: [
                {
                    type: 'map',
                    coordinateSystem: 'GLMap',
                    mapType: 'none',
                    roam: false,//鼠标滚轮缩放
                    data: [],
                    geoCoord: geoCoordate,
                    markLine: {
                        large: false,
                        smooth: true,
                        effect: {
                            show: true,
                            scaleSize: 1.5,
                            period: 15,
                            color: '#fff',
                            shadowBlur: 10
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: 3,
                                lineStyle: {
                                    type: 'solid',
                                    shadowBlur: 10
                                }
                            }
                        },
                        data: markLineDate
                    }
                }]
        };
        return option;
    },
    getTrackOption2: function (deviceList) {
        var scope = this;
        var reg = new RegExp('^0');
        var geoCoordate = {};
        var series = [];
        for (var j = 0; j < deviceList.length; j++) {
            var markPointDate = [];
            var markLineDate = [];
            var device = deviceList[j];
            for (var i in device) {
                var z = device[i].puLocation;
                var overlapping = device[i].overlapping;
                console.log(overlapping)
                if (z && z.split("_").length > 1) {
                    var zp = z.split("_");
                    if (!reg.test(zp[0]) && !reg.test(zp[1])) {
                        var deviceName = device[i].deviceName ? device[i].deviceName : '未知';
                        geoCoordate[deviceName] = [parseFloat(zp[0]), parseFloat(zp[1])];
                        if (!overlapping) {
                            markPointDate.push({name: deviceName, value: ""});
                        }
                    }
                }
            }
            for (var i = 0; i < (device.length - 1); i++) {
                var startDeviceName = device[i].deviceName ? device[i].deviceName : '未知';
                var endDeviceName = device[i + 1].deviceName ? device[i + 1].deviceName : '未知';
                var singleLineDate = [{name: startDeviceName}, {name: endDeviceName, value: ""}];
                markLineDate.push(singleLineDate);
            }
            markLineDate = scope.dealData(markLineDate);
            series.push({
                type: 'map',
                mapType: 'none',
                roam: false,//鼠标滚轮缩放
                data: [],
                geoCoord: geoCoordate,
                markLine: {
                    large: false,
                    smooth: true,
                    smoothness: 0,
                    effect: {
                        show: true,
                        scaleSize: 1.5,
                        period: 15,
                        color: '#00FF79',
                        shadowBlur: 8
                    },
                    itemStyle: {
                        normal: {
                            color: "#00FF79",
                            borderWidth: 3.5,
                            lineStyle: {
                                type: 'solid',
                                shadowBlur: 8
                            }
                        }
                    },
                    data: markLineDate
                },
                markPoint: {
                    clickable: false,
                    symbol: 'emptyCircle',
                    symbolSize: function (v) {
                        return 7 + v / 10
                    },
                    effect: {
                        show: true,
                        scaleSize: 6,
                        shadowBlur: 1,
                        color: '#00FF79' //波动颜色
                    },
                    itemStyle: {
                        normal: {
                            label: {show: false}
                        },
                        emphasis: {
                            label: {position: 'top'}
                        }
                    },
                    data: markPointDate
                }
            })
        }
        var option = {
            color: ["#00FF79"],
            tooltip: {
                trigger: 'item',
                formatter: '{b}'
            },
            dataRange: {
                show: false,
                min: 0,
                max: 1,
                calculable: true,
                color: ["#00FF79"],
                textStyle: {
                    color: '#00FF79'
                }
            },
            series: series
        };
        return option;
    },
    geoCoord2Pixel: function (geoCoord) {
        var scope = this;
        if (clientGISKind == clientGISKinds.OFFLINEGIS
            && (geoCoord[0] * 1 >= -180 && geoCoord[0] * 1 <= 180)
            && (geoCoord[1] * 1 >= -90 && geoCoord[1] * 1 <= 90)) {
            var cor = ol.proj.transform(ZT.Utils.gps84_To_Gcj02(geoCoord[0], geoCoord[1]), 'EPSG:4326', 'EPSG:3857');
        } else {
            var cor = [geoCoord[0], geoCoord[1]];
        }
        var scrPt = scope.map.getPixelFromCoordinate(cor);
        var x = scrPt[0],
            y = scrPt[1];
        return [x, y];
    },
    updateLayer: function (e) {
        var scope = this;
        var w, h;
        w = scope.map.getSize()[0];
        h = scope.map.getSize()[1];
        scope.echartdiv.style.cssText = "position:absolute;top:" + (-h / 2) + "px;left:" + (-w / 2) +
            "px;width:" + w + "px;height:" + h + "px;";
        var ecOption = scope.getEcOption();
        scope.myChart = scope.echart.init(scope.echartdiv);
        scope.myChart.setOption(ecOption);

        map.removeOverlay(scope.mapLayer);
        scope.mapLayer = new ol.Overlay({
            insertFirst: true,
            element: scope.echartdiv,
            positioning: 'center-center',
            stopEvent: false   //开启map的事件，以免点击事件没反应
        });
        var cor = map.getView().getCenter();
        scope.mapLayer.setPosition(cor);
        map.addOverlay(scope.mapLayer);
        scope.event();
    },
    /**
     *将echart的option转换
     * @returns {*}
     */
    getEcOption: function () {
        var scope = this;
        scope._option = scope.option;
        var series = scope._option.series || {};
        // 记录所有的geoCoord
        for (var i = 0, item; item = series[i++];) {
            var geoCoord = item.geoCoord;
            if (geoCoord) {
                for (var k in geoCoord) {
                    scope._geoCoord[k] = geoCoord[k];
                }
            }
        }

        // 添加x、y
        for (var i = 0, item; item = series[i++];) {
            var markPoint = item.markPoint || {};
            var markLine = item.markLine || {};

            var data = markPoint.data;
            if (data && data.length) {
                for (var k = 0, len = data.length; k < len; k++) {
                    if (!(data[k].name && this._geoCoord.hasOwnProperty(data[k].name))) {
                        data[k].name = k + 'markp';
                        scope._geoCoord[data[k].name] = data[k].geoCoord;
                    }
                    scope._AddPos(data[k]);
                }
            }

            data = markLine.data;
            if (data && data.length) {
                for (var k = 0, len = data.length; k < len; k++) {
                    if (!(data[k][0].name && this._geoCoord.hasOwnProperty(data[k][0].name))) {
                        data[k][0].name = k + 'startp';
                        scope._geoCoord[data[k][0].name] = data[k][0].geoCoord;
                    }
                    if (!(data[k][1].name && this._geoCoord.hasOwnProperty(data[k][1].name))) {
                        data[k][1].name = k + 'endp';
                        scope._geoCoord[data[k][1].name] = data[k][1].geoCoord;
                    }
                    scope._AddPos(data[k][0]);
                    scope._AddPos(data[k][1]);
                }
            }
        }
        return scope._option;
    },
    _AddPos: function (obj) {
        var scope = this;
        var coord = scope._geoCoord[obj.name];
        var pos = scope.geoCoord2Pixel(coord);
        obj.x = pos[0]; //- self._mapOffset[0];
        obj.y = pos[1]; //- self._mapOffset[1];
    },
    dealData: function (markLineDate) {
        if (markLineDate.length > 1) {
            var data = [];
            data.push(markLineDate[0]);
            for (var i = 0; i < markLineDate.length; i++) {
                var flog = true;
                for (var j = 0; j < data.length; j++) {
                    if (data[j][0].name == markLineDate[i][0].name && data[j][1].name == markLineDate[i][1].name) {
                        flog = false;
                    }
                }
                if (flog) {
                    data.push(markLineDate[i]);
                }
            }
            return data;
        } else {
            return markLineDate;
        }
    },
    hide: function () {
        $("#divEchartsMapGis").hide();
    },
    clear: function () {
        var scope = this;
        if (!scope.mapLayer) return;

        map.removeOverlay(scope.mapLayer);
        map.un("moveend", scope.handler);
        popupControl.clearTimePopWins();
        scope.mapLayer = null;
        scope.option = null;
        scope.myChart = null;
        scope._geoCoord = [];
        if ($("#divEchartsMapGis").length == 0) {
            $('body').append("<div id=\"divEchartsMapGis\" style=\"position:absolute;top:0px;left:0px;pointer-events: auto;\"></div>");
        }
    },
    CLASS_NAME: "EchartsMap"
};  