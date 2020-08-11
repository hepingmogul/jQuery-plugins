/**
 * @(#)popupControl.js
 *
 * @description: 3d底图动画效果
 * @author: 尹飞 2019/09/21
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */
var popupControl = null;
$(function () {
    popupControl = new PopupControl(viewer);
});
var PopupControl = function(){
    this.init.apply(this, arguments);
};

PopupControl.prototype = {
    view: null, //cesium视图对象
    layerElementList:[],//所有气泡的集合
    init: function (view) {
        this.view = view;
    },
    showPopup:function (layerElement,lon,lat,height) {
        var data={
            layerId:"layer1",//英文，且唯一,内部entity会用得到
            lon:lon,
            lat:lat,
            element:layerElement,
            addEntity:false,//默认为false,如果为false的话就不添加实体，后面的实体属性就不需要了，这个时候 boxHeightMax可要可不要。它代表弹窗起始点的地理坐标高度
            boxMaterial:Cesium.Color.DEEPSKYBLUE.withAlpha(0.5),
            boxHeightMax:height,
            circleSize:300,//大圆的大小，小圆的大小默认为一半
        };
        ysc.showDynamicLayer(viewer,data,function (){ //回调函数 改变弹窗的内容;
           // layerElement.find(".main").html("hello world!"+Math.random()*10000);
        });
        this.layerElementList.push(layerElement);
    },
    //彻底删除弹框
    removePopup:function (layerElement) {
        ysc.removeDynamicLayer(viewer,{
            layerId:"layer1",
            element:layerElement //这里的移除 是真的移除了doom 所以 如果重新拥有 则需要在document中重建 弹窗的doom 即：<div class='ysc-dynamic-layer' id='one'> <div class='line'></div> <div class='main'> 哈哈哈 这是一个文本 </div> </div>
        });
    },
    //彻底删除所有弹框
    removeAllPopup:function () {
        for(var i=0;i<this.layerElementList.length;i++){
            ysc.removeDynamicLayer(viewer,{
                layerId:"layer1",
                element:this.layerElementList[i] //这里的移除 是真的移除了doom 所以 如果重新拥有 则需要在document中重建 弹窗的doom 即：<div class='ysc-dynamic-layer' id='one'> <div class='line'></div> <div class='main'> 哈哈哈 这是一个文本 </div> </div>
            });
        }
        this.layerElementList = [];
    }
}