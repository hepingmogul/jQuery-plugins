/**
 * @(#)mapVControl.js
 *
 * @description: 整合mapV相关功能
 * @author: 罗超 尹飞 2019/11/29
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */

var MapVControl = function(){
    this.init.apply(this, arguments);
};

MapVControl.prototype = {
    viewer : null,//cesium视图对象
    mapvHeatLayer : null,//mapv热力图对象
    honeycombLayer:null,//mapv蜂窝图对象
    init: function (viewer) {
        this.viewer = viewer;
    },
    /**
     * mapv热力图
     * @param list 数组，格式为[{lon:lon1,lat:lat1,count:count1},{lon:lon2,lat:lat2,count:count2}]
     * @param fillStyle  //热力图的填充色 默认为rgba(255, 250, 50, 0.8)
     * @param maxSize  //显示的圆最大半径大小，默认为10
     */
    heatMap:function (list,fillStyle,maxSize) {
        var data = [];
        var max = 0;
        if(!fillStyle){
            fillStyle = "rgba(255, 250, 50, 0.8)";
        }
        if(!maxSize){
            maxSize = 10;
        }
        for(var i=0;i<list.length;i++){
            if(list[i].count > max){
                max = list[i].count;
            }
            data.push({
                // 点数据
                geometry: {
                    type: 'Point',
                    coordinates: [list[i].lon, list[i].lat]
                },
                count: list[i].count
            });
        }
        var dataSet = new mapv.DataSet(data);

        var options = {
            fillStyle: fillStyle, // 填充颜色
            globalCompositeOperation: "lighter", // 颜色叠加方式
            maxSize: maxSize, // 显示的圆最大半径大小
            max: max, // 数值最大值范围
            shadowBlur: 30, // 投影模糊级数
            shadowColor: 'rgba(255, 250, 50, 1)', // 投影颜色
            draw: 'bubble' // 用不同大小的圆来展示
        };
        this.mapvHeatLayer = XE.mixins.mapVLayer(viewer, dataSet, options);
    },
    /**
     *清除热力图
     */
    clearheatMap:function(){
        this.mapvHeatLayer.destroy();
    },
    /**
     * mapv蜂窝图
     * @param list 数组，格式为[{lon:lon1,lat:lat1,count:count1},{lon:lon2,lat:lat2,count:count2}]
     * @param fillStyle  //蜂窝图的填充色 默认为rgba(55, 50, 250, 0.8)
     * @param maxSize  //显示的蜂窝的大小，默认为50
     */
    honeycombMap:function (list,fillStyle,maxSize) {
        var data = [];
        var max = 0;
        if(!fillStyle){
            fillStyle = "rgba(55, 50, 250, 0.8)";
        }
        if(!maxSize){
            maxSize = 50;
        }
        for(var i=0;i<list.length;i++){
            if(list[i].count > max){
                max = list[i].count;
            }
            data.push({
                // 点数据
                geometry: {
                    type: 'Point',
                    coordinates: [list[i].lon, list[i].lat]
                },
                count: list[i].count
            });
        }
        var dataSet = new mapv.DataSet(data);
        var options = {
            fillStyle: fillStyle, // 填充颜色
            shadowColor: 'rgba(255, 250, 50, 1)', // 投影颜色
            shadowBlur: 20, // 投影模糊级数
            max: max*3, // 数值最大值范围
            size: maxSize, // 大小值
            label: { // 是否显示文字标签
                show: true,
                fillStyle: 'white', // 填充颜色
            },
            globalAlpha: 0.5, // 透明度
            gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" }, // 渐变色
            draw: 'honeycomb' // 蜂窝状展示
        }

        this.honeycombLayer = XE.mixins.mapVLayer(viewer, dataSet, options);
    },
    /**
     *清除蜂窝图
     */
    clearHoneycombMap:function(){
        this.honeycombLayer.destroy();
    },
};