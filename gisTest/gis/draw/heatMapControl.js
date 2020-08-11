/**
 * @(#)heatMapControl.js
 *
 * @description: 热力图
 * @author: 罗超 尹飞 2019/11/29
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */

var heatMapControl = function(){
    this.init.apply(this, arguments);
};

HeatMapControl.prototype = {
    viewer: null,//cesium视图对象
    heatMap:null,
    init: function (viewer) {
        this.viewer= viewer;
    },
    /**
     *
     * @param list 数组[{x: 106.2698, y: 29.3654, value: 11.409122369106317}]
     */
    heatMap:function (list) {
        if(list.length == 0){
            return ;
        }
        // 初始化CesiumHeatmap
        var west = list[0].x;
        var south = list[0].y;
        var east = list[0].x;
        var north = list[0].y;
        for(var i=0;i<list.length;i++){
            if(list[i].x){
                if(list[i].x < west){
                    west = list[i].x;
                }
                if(list[i].x > east){
                    east = list[i].x;
                }
            }
            if(list[i].y){
                if(list[i].y < south){
                    south = list[i].y;
                }
                if(list[i].y > north){
                    north = list[i].y;
                }
            }
        }
        // 矩形坐标
        var bounds = {
            west: west, south: south, east: east, north: north
        };
        this.heatMap = CesiumHeatmap.create(
            viewer, // 视图层
            bounds, // 矩形坐标
            { // heatmap相应参数
                backgroundColor: "rgba(0,0,0,0)",
                radius: 50,
                maxOpacity: .5,
                minOpacity: 0,
                blur: .75
            }
        );
        // 添加数据 最小值，最大值，数据集
        heatMap.setWGS84Data(0, 100, getData(300));
    },
    /**
     * 隐藏热力图
     */
    hide:function () {
        this.heatMap.show(false);
    },
    /**
     * 显示热力图
     */
    show:function () {
        this.heatMap.show(true);
    },
};