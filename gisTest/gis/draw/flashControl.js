/**
 * @(#)flashControl.js
 *
 * @description: 3d底图动画效果
 * @author: 尹飞 2019/09/21
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */

var FlashControl = function(){
    this.init.apply(this, arguments);
};

FlashControl.prototype = {
    view: null, //cesium视图对象
    circleRippleIDList:[],//环线波纹实体的id集合
    screwPrimitiveList:[],//螺旋点位图标对象集合
    imgRotatePositionList:[],//旋转图片位置集合
    imgRotatePositionEntityCollection :null,
    imgRotatePrimitiveList:[],
    radarScanEntity:null,//雷达扫描对象
    init: function (view) {
        this.view = view;
       /* this.circleRipple(106.5516187,29.5748543,"11");
        this.radarScan(106.5216187,29.5748543);*/
        this.imgRotatePositionEntityCollection = new Cesium.EntityCollection();
        this.circleWall(106.5592, 29.5578,0.0015);
        this.imgRotateAndEnlarge(106.5700, 29.5614,top.ctx+"/images/cesium/circular_b_01.png");
        this.imgRotateAndEnlarge(106.5531, 29.5932,top.ctx+"/images/cesium/circular_b_01.png");
        this.imgRotateAndEnlarge(106.5898, 29.5888,top.ctx+"/images/cesium/circular_b_01.png");
        this.imgRotateAndEnlarge(106.5465, 29.5628,top.ctx+"/images/cesium/circular_b_01.png");
        this.gltfRotateAndEnlarge(106.5700, 29.5614,top.ctx +'/model/gltf/triangle_01.gltf');
        this.gltfRotateAndEnlarge(106.5531, 29.5932,top.ctx +'/model/gltf/triangle_01.gltf');
        this.gltfRotateAndEnlarge(106.5898, 29.5888,top.ctx +'/model/gltf/triangle_01.gltf');
        this.gltfRotateAndEnlarge(106.5465, 29.5628,top.ctx +'/model/gltf/triangle_01.gltf');

        this.createBasePoint([106.5743,29.5525,0]);
        this.createBasePoint([106.5730,29.5746,0]);
        this.createBasePoint([106.5460,29.5519,0]);
        this.createBasePoint([106.5506,29.5767,0]);
    },
    /**
     * 圆形扩散墙
     * @param lon 圆形扩散墙所在位置的经度
     * @param lat 圆形扩散墙所在位置的纬度
     * @param circle 圆形扩散墙的半径
     * @returns {*}
     */
    circleWall:function(lon,lat,circle){
        if(!circle){
            circle = 0.0015;
        }
        var r = circle+0.002;
        var r2 = circle;
        function changeR() { //这是callback，参数不能内传
            r2 = r2+0.00005;
            if(r2>=r){
                r2=circle;
            }
            var list = [];
            for(var i=0;i<=90;i++){
                x1   =   lon   +   r2   *   Math.cos(i   *   3.14 *4  /180   );
                y1   =   lat   +   r2   *   Math.sin(i   *   3.14 *4  /180   );
                list.push(x1);
                list.push(y1);
                list.push(200.0)
            }
            return Cesium.Cartesian3.fromDegreesArrayHeights(list);
        }
        var circleWall = viewer.entities.add({
            name : 'Red wall at height',
            wall : {
                positions : new Cesium.CallbackProperty(changeR,false),
                material : new Cesium.ImageMaterialProperty({
                    image:top.ctx+"/images/cesium/gradual_blue_01.png",
                    color:Cesium.Color.WHITE.withAlpha(0.9)
                })
            },
        });
        return circleWall;
    },
    /**
     * 清除圆形扩散墙
     */
    clearCircleWall:function(circleWall){
        if(circleWall){
            viewer.entities.remove(circleWall);
        }
    },
    /**
     * 模型旋转和放大
     */
    gltfRotateAndEnlarge:function(lon,lat,url){
        //加载模型
        var height = 20;
        var heightBig = 40;
        var heightLow = 20;
        var flog = true;
        function changeGltf() { //这是callback，参数不能内传
            if(height==heightBig){
                height = height - 1;
                flog = false;
            } else if(height<heightBig&&height>heightLow&&!flog){
                height = height - 1;
            } else if(height == heightLow){
                height = height + 1;
                flog = true;
            } else {
                height = height + 1;
            }
            position = Cesium.Cartesian3.fromDegrees(lon,lat, height);
            return Cesium.Cartesian3.fromDegrees(lon,lat, height);
        }
        var gltfAngle = 0.0;
        var gltfRotate = 1;
        function changeGltfAngle() { //这是callback，参数不能内传
            gltfAngle=gltfAngle+gltfRotate;
            if(gltfAngle>=360){
                gltfAngle=0.0;
            }
            var hpRoll = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(gltfAngle), 0, 0);
            var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpRoll);
            return orientation;
        }
        var position=Cesium.Cartesian3.fromDegrees(lon,lat, 20.0);
        var hpRoll = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(180), 0, 0);
        var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpRoll);
        var model = viewer.entities.add({
            // 模型位置
            position: new Cesium.CallbackProperty(changeGltf,false),
            // 模型方向
            orientation: new Cesium.CallbackProperty(changeGltfAngle,false),
            // 模型资源
            model: {
                // 模型路径
                uri: url,
                // 模型颜色  ，这里可以设置颜色的变化
                color: new Cesium.Color(255 / 255, 245 / 255, 124 / 255, 0.9) ,
                scale:0.5,
                runAnimations:true                //是否运行模型中的动画效果
            },
            // 添加描述
            description: '风机模型'
        });
    },

    imgRotateAndEnlarge2:function(coord,imgUrl,rotate,minR,maxR,height){
        var _self = this;
        if(!minR){
            minR = 50;
        }
        if(!maxR){
            maxR = 50;
        }
        var instances = [];
        for ( var i = 0; i < coord.length; i ++ )
        {
            instances.push( new Cesium.GeometryInstance( {
                geometry : new Cesium.EllipseGeometry( {
                    center : Cesium.Cartesian3.fromDegrees( coord[i][0], coord[i][1] ,height),
                    height : height,
                    semiMajorAxis:maxR,
                    semiMinorAxis:minR
                } )
            } ) );
        }
        var primitive = new Cesium.Primitive({
            geometryInstances: instances,
            appearance: new Cesium.EllipsoidSurfaceAppearance({
                material: new Cesium.Material({
                    fabric: {
                        type: 'Image',
                        uniforms: {
                            image: imgUrl,
                            radians: 0,
                        },
                        source: `
            #define M_PI 3.1415926535897932384626433832795

            uniform sampler2D image;
            uniform float radians;
            
            czm_material czm_getMaterial(czm_materialInput materialInput)
            {
              czm_material material = czm_getDefaultMaterial(materialInput);
              vec2 st = vec2(materialInput.st.x - 0.5, materialInput.st.y - 0.5);
              float alpha = 1.3 - st.x - 0.5;
              float current_radians = atan(st.y, st.x);
              float radius = sqrt(st.x * st.x + st.y * st.y);
              if (radius < 0.50) {
                current_radians = current_radians - radians;
                st = vec2(cos(current_radians) * radius, sin(current_radians) * radius);
                st = vec2(st.x + 0.5, st.y + 0.5);
                vec4 colorImage = texture2D(image, st);
                material.diffuse = colorImage.rgb;
                material.alpha = colorImage.a * alpha;
              } else {
                material.alpha = 0.0;
              }

              return material;
            }
            `
                    }
                })
            })
        });
        var radians = 0;
        viewer.scene.primitives.add(primitive);
        _self.imgRotatePrimitiveList.push(primitive);
        viewer.scene.preUpdate.addEventListener(() => {
            radians += Math.PI / 90;
            primitive.appearance.material.uniforms.radians = radians;
        });
        return primitive;
    },

    clearImgRotatePrimitiveList:function(){
        for(var i=0;i<this.imgRotatePrimitiveList.length;i++){
            viewer.scene.primitives.remove(this.imgRotatePrimitiveList[i]);
        }

        this.imgRotatePrimitiveList = [];
    },


    /**
     *图片旋转和放大
     */
    imgRotateAndEnlarge:function(lon,lat,imgUrl,rotate,minR,maxR){
        var _self = this;
        var r1=(minR?minR:50);
        if(!minR){
            minR = 30;
        }
        if(!maxR){
            maxR = 50;
        }
        if(!rotate){
            rotate = 1;
        }
        var angle = 0.0;
        var deviationR = 0.2;
        function changeR() { //这是callback，参数不能内传
            r1=r1+deviationR;
            if(r1>=maxR){
                r1=minR;
            }

            return r1;
        }
        function changeAngle() { //这是callback，参数不能内传
            angle=angle+rotate;
            if(angle>=360){
                angle=0.0;
            }
            return Cesium.Math.toRadians(angle);
        }
        return viewer.entities.add({
            name:"",
            position:Cesium.Cartesian3.fromDegrees(lon,lat,1),
            ellipse : {
                semiMinorAxis :new Cesium.CallbackProperty(changeR,false),
                semiMajorAxis :new Cesium.CallbackProperty(changeR,false),
                stRotation:new Cesium.CallbackProperty(changeAngle,false),
                height:0,
                material:new Cesium.ImageMaterialProperty({
                    image:imgUrl,
                    repeat:new Cesium.Cartesian2(1.0, 1.0),
                    transparent:true,

                })
            }
        });
    },
    /**
     * 清除所有螺旋点位图标
     */
    clearAllBasePoint:function() {
        for(var i=0;i<this.screwPrimitiveList.length;i++){
            this.clearBasePoint(this.screwPrimitiveList[i]);
        }
        this.screwPrimitiveList = [];
    },
    /**
     * 清除螺旋点位图标
     * @param customPrimitiveList //该值为调用createBasePoint返回的数组
     */
    clearBasePoint:function(customPrimitiveList) {
        if(customPrimitiveList){
            for(var i=0;i<customPrimitiveList.length;i++){
                customPrimitiveList[i].destroy();
            }
        }
    },
    /**
     * 创建螺旋点位图标
     * @param position
     */
    createBasePoint:function(position) {
        var color=[0.5, 0.8, 1, 2];
        var scale=[50, 50, 1];
        position = [Cesium.Math.toRadians(position[0]),Cesium.Math.toRadians(position[1]),0];
        var customPrimitiveList = [];
        // 底面
        {
            let p = new XE.Obj.CustomPrimitive(earth)
            p.position = [...position];
            p.scale = [...scale];
            p.positions = XE.Obj.CustomPrimitive.Geometry.unitSquare.positions;
            p.sts = XE.Obj.CustomPrimitive.Geometry.unitSquare.sts;
            p.indices = XE.Obj.CustomPrimitive.Geometry.unitSquare.indices;
            p.renderState = XE.Obj.CustomPrimitive.getRenderState(true, true);
            p.color = [...color];

            p.canvasWidth = 512;
            p.canvasHeight = 512;

            p.drawCanvas(ctx => {
                let gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
            gradient.addColorStop(0.1, "rgba(255, 255, 255, 1.0)");
            gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.0)");
            gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.9)");
            gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.0)");
            gradient.addColorStop(0.9, "rgba(255, 255, 255, 0.2)");
            gradient.addColorStop(1.0, "rgba(255, 255, 255, 1.0)");

            ctx.clearRect(0, 0, 512, 512);
            ctx.beginPath();
            ctx.arc(256, 256, 256, 0, Math.PI * 2, true);
            // ctx.fillStyle = "rgb(0, 155, 255)";
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.restore();
        });
            customPrimitiveList.push(p);
        }

        // 底面动态辐射波
        {
            let p = new XE.Obj.CustomPrimitive(earth)
            p.position = [...position];
            // p.scale = [...scale];
            p.scale = [50, 50, 1];
            p.positions = XE.Obj.CustomPrimitive.Geometry.unitSquare.positions;
            p.sts = XE.Obj.CustomPrimitive.Geometry.unitSquare.sts;
            p.indices = XE.Obj.CustomPrimitive.Geometry.unitSquare.indices;
            p.renderState = XE.Obj.CustomPrimitive.getRenderState(true, true);
            p.color = [...color];

            p.canvasWidth = 512;
            p.canvasHeight = 512;

            p.drawCanvas(ctx => {
                ctx.clearRect(0, 0, 512, 512);

            ctx.strokeStyle = "rgb(255, 255, 255)";
            ctx.setLineDash([80, 80]);
            ctx.lineWidth = 30;
            ctx.arc(256, 256, 241, 0, Math.PI * 2, true);
            ctx.stroke();
            });

            let angle = 0.0;
            let t = 0.01;
            earth.czm.scene.preUpdate.addEventListener(() => {
                    angle += 10.0;
                if (angle > 360.0) {
                    angle = 0.0;
                }
                p.rotation[0] = angle / 180.0 * Math.PI;

                t += 0.02;
                if (t > 1.0) t = 0.01;

                p.scale[0] = 50 * t;
                p.scale[1] = 50 * t;
            });
            customPrimitiveList.push(p);
        }

        // 柱体
        {
            let p = new XE.Obj.CustomPrimitive(earth)
            p.position = [...position];
            p.scale = [3/50*scale[0], 3/50*scale[1], 300*scale[2]];

            let cylinder = XE.Obj.CustomPrimitive.Geometry.createCylinder(0.3, 2.0, 1.0, 6);
            p.positions = cylinder.positions;
            p.sts = cylinder.sts;
            p.indices = cylinder.indices;
            // p.indices = [0, 1, 2];

            p.renderState = XE.Obj.CustomPrimitive.getRenderState(true, true);
            p.renderState.cull.enabled = false;

            p.color = [...color];
            p.canvasWidth = 1;

            let vtxfFragmentShader =
                `
                varying vec3 v_positionEC;
                varying vec3 v_normalEC;
                varying vec2 v_st;
                varying vec4 v_color;
                uniform sampler2D u_image;
                uniform vec4 u_color;
                void main()
                {
                    float powerRatio = fract(czm_frameNumber / 30.0) + 1.0;
                    float alpha = pow(1.0 - v_st.t, powerRatio);
                    gl_FragColor = vec4(u_color.rgb, alpha*u_color.a);
                }
                `;

            p.fragmentShaderSource = vtxfFragmentShader;
            customPrimitiveList.push(p);
        }

        // 柱体粒子
        {
            let p = new XE.Obj.CustomPrimitive(earth)
            p.position = [...position];
            p.scale = [3/50*scale[0], 3/50*scale[1], 300*scale[2]];

            let cylinder = XE.Obj.CustomPrimitive.Geometry.createCylinder(4.0, 4.0, 1.0, 6);
            p.positions = cylinder.positions;
            p.sts = cylinder.sts;
            p.indices = cylinder.indices;

            p.renderState = XE.Obj.CustomPrimitive.getRenderState(true, true);
            p.renderState.cull.enabled = false;

            p.color = [...color];
            p.canvasWidth = 32;
            p.canvasHeight = 256;

            p.drawCanvas(ctx => {
                ctx.clearRect(0, 0, 32, 256);
        });

            Cesium.Resource.createIfNeeded(top.ctx+'/images/cesium/particles.png').fetchImage().then(function(image) {
                p.drawCanvas(ctx => {
                    ctx.clearRect(0, 0, 32, 512);
                ctx.drawImage(image, 0, 0);
            });
            });

            let vtxfFragmentShader =
                `
                varying vec3 v_positionEC;
                varying vec3 v_normalEC;
                varying vec2 v_st;
                varying vec4 v_color;
                uniform sampler2D u_image;
                uniform vec4 u_color;
                void main()
                {
                    vec3 positionToEyeEC = -v_positionEC;
                    vec3 normalEC = normalize(v_normalEC);
                    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);

                    float dt = fract(czm_frameNumber / 90.0);
                    vec2 st = fract(vec2(1.0) + v_st - vec2(dt, dt));
                    vec4 imageColor = texture2D(u_image, st);

                    vec3 diffuse = imageColor.rgb;
                    float alpha = imageColor.a;

                    diffuse *= v_color.rgb;
                    alpha *= v_color.a;

                    diffuse *= u_color.rgb;
                    alpha *= u_color.a;

                    gl_FragColor = vec4(diffuse, alpha * pow(1.0 - v_st.t, 2.0));
                }
                `;

            p.fragmentShaderSource = vtxfFragmentShader;
            customPrimitiveList.push(p);
        }
        this.screwPrimitiveList.push(customPrimitiveList);
        return customPrimitiveList;
    },

    /**
     * 清除echarts散点图
     */
    clearEchartsRipple:function(){
        $("#ys-cesium-echarts").remove();
    },

    /**
     * 环线波纹
     * @param lon  经度
     * @param lat  纬度
     * @param id   ID编号
     * @param color   颜色“red”或者“blue”
     * @param projection  坐标系“GCJ02”或者“WGS84”
     * @param maxR  闪烁半径
     */
    circleRipple:function (lon,lat,id,color,projection,maxR) {
        var _self = this;
        if(!id){
            id = parseInt(Math.random()*100000)+"";
        }
        _self.clearCircleRipple(id);//先清除原本有的实体，以免添加出错
        //如果参数中的lon,lat为高德接口获取的坐标，需要将其转化为WGS84坐标系的坐标
        if(projection && projection == "GCJ02"){
            temp = gcoord.transform(
                [parseFloat(lon), parseFloat(lat)],    // 经纬度坐标
                gcoord.AMap,               // 当前坐标系
                gcoord.WGS84                 // 目标坐标系
            );
            lon = temp[0];
            lat = temp[1];
        }
        //根据color获取不同的波动圆颜色图片
        var imageUrl = "images/cesium/redCircle2.png";
        if(color == "blue"){
            imageUrl = "images/cesium/blueCircle2.png";
        } else if(color == "yellow"){
            imageUrl = "images/cesium/yellowCircle2.png";
        }
        if(!maxR){
            maxR = 400;
        }
        ysc.addCircleRipple(viewer,{ //默认只绘制两个圆圈叠加 如遇绘制多个，请自行源码内添加。
            id:id,
            lon:lon,
            lat:lat,
            height:1,
            maxR:maxR,
            minR:0,//最好为0
            deviationR:1,//差值 差值也大 速度越快
            eachInterval:2000,//两个圈的时间间隔
            imageUrl:imageUrl
        });
        //如果添加中心线的话：
       /* viewer.entities.add({
            name:"",
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                    lon,lat,0,
                    lon,lat, 5000,]
                ),
                width: 4,
                material : new Cesium.PolylineGlowMaterialProperty({ //发光线
                    glowPower : 0.1,
                    color : Cesium.Color.RED
                })
            }
        });*/
        _self.circleRippleIDList.push(id);
    },
    /**
     * 清除环线波纹
     * @param id
     */
    clearCircleRipple:function(id){
        viewer.entities.remove(viewer.entities.getById(id));
        viewer.entities.remove(viewer.entities.getById(id+"2")); //此动画用的是两个波动圆，第二个的id为第一个的id+"2"
        for (var i = 0; i < this.circleRippleIDList.length; i++) {
            if (this.circleRippleIDList[i] == id)	{
                this.circleRippleIDList.splice(i, 1);
            }
        }
    },
    /**
     * 清楚所有的环线波纹
     */
    clearAllCircleRipple:function(){
        for (var i = 0; i < this.circleRippleIDList.length; i++) {
            viewer.entities.remove(viewer.entities.getById(this.circleRippleIDList[i]));
            viewer.entities.remove(viewer.entities.getById(this.circleRippleIDList[i]+"2")); //此动画用的是两个波动圆，第二个的id为第一个的id+"2"
        }
    },
    /**
     *  雷达扫描
     * @param lon   经度
     * @param lat   纬度
     * @param color  颜色
     * @param radiu  半径
     * @param time   扫描时间
     */
    radarScan:function (lon,lat,color,radiu,time) {
        var scanColor = new Cesium.Color(11/255, 1, 1, 1);//Cesium.Color.BLUE;
        var r = 500;
        var interval = 4000;
        if(color){
            scanColor = color;
        }
        if(radiu){
            r = radiu;
        }
        if(time){
            interval = time;
        }
        var radarScan = ysc.addRadarScan(viewer,{
            lon:lon,//经度
            lat:lat, //纬度
            scanColor:scanColor,//红，绿，蓝，透明度
            r:r,//扫描半径
            interval:interval//时间间隔
        });
        this.radarScanEntity = radarScan;
    },
    /**
     * 清除雷达扫描
     */
    clearRadarScan:function(){
        viewer.scene.postProcessStages.remove(this.radarScanEntity);
        viewer.scene.globe.depthTestAgainstTerrain = false;
    },
    clearAll:function () {
        for (var i = 0; i < this.circleRippleIDList.length; i++) {
            viewer.entities.remove(viewer.entities.getById(this.circleRippleIDList[i]));
            viewer.entities.remove(viewer.entities.getById(this.circleRippleIDList[i]+"2")); //此动画用的是两个波动圆，第二个的id为第一个的id+"2"
        }
        if(this.radarScanEntity){
            this.clearRadarScan();//圆形扫描清除要调用此方法
        }
    }
}