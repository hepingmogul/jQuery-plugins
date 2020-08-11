/**
 * @(#)billboardControl.js
 *
 * @description: 广告牌相关功能
 * @author: 罗超 尹飞 2019/12/14
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */
var BillboardControl = function(){
    this.init.apply(this, arguments);
};

BillboardControl.prototype = {
    earth: null,//cesium视图对象
    init: function (earth) {
        this.earth = earth;
    },
    /**
     * 根据图片创建广告牌
     * @param img 图片的url
     * @param width  广告牌的宽度
     * @param height 广告牌的高度
     * @param cor 广告牌的位置
     * @param rotation 广告牌旋转的角度
     */
    createBillboardByImage:function (img,width,height,cor,rotation) {
        var rotationAngel = 90;
        if(rotation){
            rotationAngel = rotation;
        }
        let p = new XE.Obj.CustomPrimitive(earth);
        p.position = [Cesium.Math.toRadians(cor[0]),Cesium.Math.toRadians(cor[1]),cor[2]];
        p.scale = [ 1, 100, 50 ];
        p.positions = XE.Obj.CustomPrimitive.Geometry.unitBillboard.positions;
        p.sts = [ 0, 0, 1, 0, 1, 1, 0, 1 ];
        p.indices = [ 0, 1, 2, 0, 2, 3 ];
        p.renderState = XE.Obj.CustomPrimitive.getRenderState(true, false);
        p.color = [ 0.5, 0.8, 1, 2 ];
        p.canvasWidth = width;
        p.canvasHeight = height;
        p.rotation = [rotationAngel/180*Math.PI,0,0];

        Cesium.Resource.createIfNeeded(img).fetchImage().then(function(image) {
            p.drawCanvas(ctx => {
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(image, 0, 0);
            });
        });
        window.ptest = p;
    },
    /**
     * 根据div创建广告牌
     * @param div div的id
     * @param width  广告牌的宽度
     * @param height 广告牌的高度
     * @param cor 广告牌的位置
     * @param rotation 广告牌旋转的角度
     */
    createBillboardByHtml:function (div,width,height,cor,rotation) {
        var _self = this;
        html2canvas(document.querySelector("#"+div)).then(canvas => {
            var image = new Image();
            canvas.fillStyle = 'rgba(255, 255, 255, 0)';
            image.src = canvas.toDataURL("image/png");
            var rotationAngel = 90;
            if(rotation){
                rotationAngel = rotation;
            }
            let p = new XE.Obj.CustomPrimitive(earth);
            p.position = [Cesium.Math.toRadians(cor[0]),Cesium.Math.toRadians(cor[1]),cor[2]];
            p.scale = [ 1, 100, 50 ];
            p.positions = XE.Obj.CustomPrimitive.Geometry.unitBillboard.positions;
            p.sts = [ 0, 0, 1, 0, 1, 1, 0, 1 ];
            p.indices = [ 0, 1, 2, 0, 2, 3 ];
            p.renderState = XE.Obj.CustomPrimitive.getRenderState(true, false);
            p.color = [ 0.5, 0.8, 1, 2 ];
            p.canvasWidth = width;
            p.canvasHeight = height;
            p.rotation = [rotationAngel/180*Math.PI,0,0];
            image.onload = function() {
                p.drawCanvas(ctx => {
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(image, 0, 0);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0)';
                });
            };
        });
    }
};