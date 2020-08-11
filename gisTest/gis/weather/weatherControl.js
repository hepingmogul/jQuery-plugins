/**
 * @(#)weatherControl.js
 *
 * @description: 3D地图天气控制
 * @author: 尹飞 2019/10/11
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */
var WeatherControl = function(){
    this.init.apply(this, arguments);
};

WeatherControl.prototype = {
    viewer: null, //cesium视图对象
    init: function (viewer) {
        this.viewer = viewer;
    },
    /**
     * 显示下雨
     */
    showRain:function(){
        var collection = viewer.scene.postProcessStages;
        if(collection.getStageByName("rain")){
            return;
        } else {
            var fs_rain = this.getRainShader();
            var snow = new Cesium.PostProcessStage({
                name: 'rain',
                fragmentShader: fs_rain
            });
            collection.add(snow);
            //将天空大气和雾度调整为雨雪天值
            viewer.scene.skyAtmosphere.hueShift = -0.8;
            viewer.scene.skyAtmosphere.saturationShift = -0.7;
            viewer.scene.skyAtmosphere.brightnessShift = -0.33;
            viewer.scene.fog.density = 0.001;
            viewer.scene.fog.minimumBrightness = 0.8;
        }

    },
    /**
     * 移除下雨：
     */
    removeRain:function(){
        var collection = viewer.scene.postProcessStages;
        var rain = collection.getStageByName("rain");
        if(rain){
            viewer.scene.postProcessStages.remove(rain);
            rain = null;
        }
        //将天空大气和雾度调整为正常值
        viewer.scene.skyAtmosphere.hueShift = -0.96;
        viewer.scene.skyAtmosphere.saturationShift = 0.4;
        viewer.scene.skyAtmosphere.brightnessShift = 0.4;
        viewer.scene.fog.density = 0.0002;
        viewer.scene.fog.minimumBrightness = 0.03;
    },
    /**
     * 获取下雨的shader字符串
     */
    getRainShader:function () {
        return "uniform sampler2D colorTexture;\n\
				varying vec2 v_textureCoordinates;\n\
			\n\
				float hash(float x){\n\
					return fract(sin(x*133.3)*13.13);\n\
			}\n\
			\n\
			void main(void){\n\
			\n\
				float time = czm_frameNumber / 60.0;\n\
			vec2 resolution = czm_viewport.zw;\n\
			\n\
			vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
			vec3 c=vec3(.6,.7,.8);\n\
			\n\
			float a=-.4;\n\
			float si=sin(a),co=cos(a);\n\
			uv*=mat2(co,-si,si,co);\n\
			uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
			\n\
			float v=1.-sin(hash(floor(uv.x*100.))*2.);\n\
			float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n\
			c*=v*b; \n\
			\n\
			gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5);  \n\
			}\n\
            ";
    },
    /**
     * 显示下雪
     */
    showSnow:function(){
        var collection = viewer.scene.postProcessStages;
        if(collection.getStageByName("snow")){
            return;
        } else {
            var fs_snow = this.getSnowShader();
            var snow = new Cesium.PostProcessStage({
                name: 'snow',
                fragmentShader: fs_snow
            });
            collection.add(snow);
            //将天空大气和雾度调整为雨雪天值
            viewer.scene.skyAtmosphere.hueShift = -0.8;
            viewer.scene.skyAtmosphere.saturationShift = -0.7;
            viewer.scene.skyAtmosphere.brightnessShift = -0.33;
            viewer.scene.fog.density = 0.001;
            viewer.scene.fog.minimumBrightness = 0.8;
        }

    },
    /**
     * 获取下雪的shader
     */
    getSnowShader:function () {
        return "uniform sampler2D colorTexture;\n\
        varying vec2 v_textureCoordinates;\n                    \n\
        float snow(vec2 uv,float scale)\n\  {\n\
            float time = czm_frameNumber / 60.0;\n\
            float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\n\                            uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\n\                            uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\n\                            p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\n\                            k=smoothstep(0.,k,sin(f.x+f.y)*0.01);\n\
            return k*w;\n\                        }\n\
               \n\
        void main(void){\n   vec2 resolution = czm_viewport.zw;\n\
            vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\                            vec3 finalColor=vec3(0);\n\
            float c = 0.0;\n\   c+=snow(uv,30.)*.0;\n\                            c+=snow(uv,20.)*.0;\n c+=snow(uv,15.)*.0;\n  c+=snow(uv,10.);\n\                            c+=snow(uv,8.);\n\   c+=snow(uv,6.);\n c+=snow(uv,5.);\n\                            finalColor=(vec3(c)); \n\
            gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.5); \n\                    \n\                        }\n\                    "
    },
    /**
     * 移除下雪
     */
    removeSnow:function(){
        var collection = viewer.scene.postProcessStages;
        var snow = collection.getStageByName("snow");
        if(snow){
            viewer.scene.postProcessStages.remove(snow);
            snow = null;
        }
        //将天空大气和雾度调整为正常值
        viewer.scene.skyAtmosphere.hueShift = -0.96;
        viewer.scene.skyAtmosphere.saturationShift = 0.4;
        viewer.scene.skyAtmosphere.brightnessShift = 0.4;
        viewer.scene.fog.density = 0.0002;
        viewer.scene.fog.minimumBrightness = 0.03;
    },
    /**
     * 显示雾天效果
     */
    showFog:function(){
        this.FogStage=Cesium.PostProcessStageLibrary.createBrightnessStage();
        //this.FogStage.uniforms.brightness=20;//整个场景通过后期渲染变亮 1为保持不变 大于1变亮 0-1变暗 uniforms后面为对应glsl里面定义的uniform参数
        this.FogStage=new Cesium.PostProcessStage({
            "name":"fog",
            //sampleMode:PostProcessStageSampleMode.LINEAR,
            fragmentShader:this.getFogShader()
        });

        this.viewer.scene.postProcessStages.add(this.FogStage);
        this.FogStage.enabled=true;
    },
    /**
     * 获取雾天的shader
     */
    getFogShader:function () {
        return "  uniform sampler2D colorTexture;\n" +
            "  uniform sampler2D depthTexture;\n" +
            "  varying vec2 v_textureCoordinates;\n" +
            "  void main(void)\n" +
            "  {\n" +
            "      vec4 origcolor=texture2D(colorTexture, v_textureCoordinates);\n" +
            "      vec4 fogcolor=vec4(0.8,0.8,0.8,0.6);\n" +
            "\n" +
            "      float depth = czm_readDepth(depthTexture, v_textureCoordinates);\n" +
            "      vec4 depthcolor=texture2D(depthTexture, v_textureCoordinates);\n" +
            "\n" +
            "      float f=(depthcolor.r-0.22)/0.2;\n" +
            "      if(f<0.0) f=0.0;\n" +
            "      else if(f>0.6) f=0.6;\n" +
            "      gl_FragColor = mix(origcolor,fogcolor,f);\n" +
            "   }";
    },
    /**
     * 移除雾天
     */
    removeFog:function(){
        var collection = viewer.scene.postProcessStages;
        var fog = collection.getStageByName("fog");
        if(fog){
            viewer.scene.postProcessStages.remove(fog);
            fog = null;
        }
    },
    //移除所有天气效果
    removeAll:function () {
        this.removeRain();
        this.removeSnow();
        this.removeFog();
        //将天空大气和雾度调整为正常值
        viewer.scene.skyAtmosphere.hueShift = -0.96;
        viewer.scene.skyAtmosphere.saturationShift = 0.4;
        viewer.scene.skyAtmosphere.brightnessShift = 0.4;
        viewer.scene.fog.density = 0.0002;
        viewer.scene.fog.minimumBrightness = 0.03;
    }
};