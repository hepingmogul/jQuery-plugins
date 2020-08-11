/**
 * @(#)mapInit.js
 *
 * @description: gis初始化3D
 * @author: 尹飞 2019/09/23
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */

var viewer = null;
var earth = null;
XE.ready().then(map_init);

function map_init(target){
	/*viewer = new Cesium.Viewer(target,{
		animation : false,//是否创建动画小器件，左下角仪表
		shouldAnimate : true,
		baseLayerPicker : false,//是否显示图层选择器
		fullscreenButton : false,//是否显示全屏按钮
		geocoder : false,//是否显示geocoder小器件，右上角查询按钮
		homeButton : false,//是否显示Home按钮
		infoBox : false,//是否显示信息框
		sceneModePicker : false,//是否显示3D/2D选择器
		selectionIndicator : false,//是否显示选取指示器组件
		timeline : false,//是否显示时间轴
		navigationHelpButton : false,//是否显示右上角的帮助按钮
		scene3DOnly : false,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
		clock : new Cesium.Clock(),//用于控制当前时间的时钟对象
		selectedImageryProviderViewModel : undefined,//当前图像图层的显示模型，仅baseLayerPicker设为true有意义
		imageryProviderViewModels : Cesium.createDefaultImageryProviderViewModels(),//可供BaseLayerPicker选择的图像图层ProviderViewModel数组
		selectedTerrainProviderViewModel : undefined,//当前地形图层的显示模型，仅baseLayerPicker设为true有意义
		terrainProviderViewModels : Cesium.createDefaultTerrainProviderViewModels(),//可供BaseLayerPicker选择的地形图层ProviderViewModel数组
		skyBox : new Cesium.SkyBox({ //天空盒子
			nearGround:!0,
			sources : {
				positiveX : top.ctx + '/images/gis/skybox2/posx.png',
				negativeX : top.ctx + '/images/gis/skybox2/negx.png',
				positiveY : top.ctx + '/images/gis/skybox2/negy.png',
				negativeY :top.ctx + '/images/gis/skybox2/posy.png',
				positiveZ :top.ctx + '/images/gis/skybox2/posz.png',
				negativeZ : top.ctx + '/images/gis/skybox2/negz.png'
			}
		}),
		imageryProvider:new Cesium.WebMapServiceImageryProvider({
			//url : 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
            url :'http://10.1.211.189:19090/mapabc/roadmap_3D/{z}/{x}/{y}.png',
			format: "image/png",
			layers: 'base'// Here just give layer name
		}),
	});*/
	// 1.2.1 创建地球
	earth = new XE.Earth("div3d");
// 1.2.2 添加默认地球影像
	earth.sceneTree.root = {
		"children": [
			{
				"czmObject": {
					"name": "默认离线影像",
					"xbsjType": "Imagery",
					"show": true,
					"xbsjImageryProvider": {
						"XbsjImageryProvider": {
							//"url": 'http://'+gis3dIp+':'+gis3dPort+'/mapabc/roadmap/{z}/{x}/{y}.png',
							"url":'http://50.37.141.251:25013/v3/tile?z={z}&x={x}&y={y}',
							"maximumLevel": 19,
							"srcCoordType": 'GCJ02',  //实时纠偏
							"dstCoordType": 'WGS84'
						}
					}
				}
			}
		]
	};
	viewer = earth.czm.viewer;
	//创建两江广告牌
	creatBillbon();
	var layers = viewer.imageryLayers;//viewer.scence.imagerLayers也可以
	var baseEarthImage = layers.addImageryProvider(new Cesium.SingleTileImageryProvider({
		url : top.ctx+'/images/cesium/earth-blue.jpg',
		rectangle : Cesium.Rectangle.fromDegrees(-180,-90,180,90)//西经，南纬，东经，北纬
	}));
	viewer.camera.setView({
		destination: Cesium.Cartesian3.fromDegrees(-38, 33, 20000444),
		duration: 3,   //定位的时间间隔
		orientation: {
			heading: Cesium.Math.toRadians(0),
			pitch: Cesium.Math.toRadians(-90),
			roll: Cesium.Math.toRadians(0)
		},
	});
	//地球旋转
	Cesium.xbsjRotateEarth(viewer.scene, 1e7*2, 1.5);
	viewer.scene.xbsjEarthRotatingSpeed = Math.PI / 5;
	//天空大气调整
	viewer.scene.skyAtmosphere.hueShift = -0.96;
	viewer.scene.skyAtmosphere.saturationShift = 0.4;
	viewer.scene.skyAtmosphere.brightnessShift = 0.4;

	//开启日照阴影
	/*viewer.scene.globe.enableLighting = true;
	viewer.shadows = true;*/

	//禁止相机进入地底下
	var minPitch = -Cesium.Math.PI_OVER_TWO;
	var maxPitch = 0;
	var minHeight = 200;

	viewer.camera.changed.addEventListener(
		function() {
			if (viewer.camera._suspendTerrainAdjustment && viewer.scene.mode === Cesium.SceneMode.SCENE3D) {
				viewer.camera._suspendTerrainAdjustment = false;
				viewer.camera._adjustHeightForTerrain();
			}

			// Keep camera in a reasonable pitch range
			var pitch = viewer.camera.pitch;

			if (pitch > maxPitch || pitch < minPitch) {
				viewer.scene.screenSpaceCameraController.enableTilt = false;

				// clamp the pitch
				if(pitch > maxPitch ) {
					pitch = maxPitch;
				} else if(pitch < minPitch) {
					pitch = minPitch;
				}

				var destination = Cesium.Cartesian3.fromRadians(
					viewer.camera.positionCartographic.longitude,
					viewer.camera.positionCartographic.latitude,
					Math.max(viewer.camera.positionCartographic.height, minHeight));

				viewer.camera.setView({
					destination: destination,
					orientation: { pitch: pitch }
				});
				viewer.scene.screenSpaceCameraController.enableTilt = true;
			}
		}
	);
	//显示经纬度和比例尺
	show3DCoordinates(target);
	setTimeout(function(){

		viewer.camera.flyTo({
			//destination: Cesium.Cartesian3.fromDegrees(Number.parseFloat(center[0]), Number.parseFloat(center[1]),1182.57803),
			//destination: Cesium.Cartesian3.fromDegrees(106.5209,29.5631,1182.57803),
			destination: Cesium.Cartesian3.fromDegrees(106.57181807206297, 29.602349151739556,1786.8346544294425),
			duration:3,   //定位的时间间隔
			orientation: {
				heading : Cesium.Math.toRadians(0),
				pitch : Cesium.Math.toRadians(-90),
				roll : Cesium.Math.toRadians(0)
			},
			complete:function(){
				viewer.camera.flyTo({
					//destination: Cesium.Cartesian3.fromDegrees(Number.parseFloat(center[0]), Number.parseFloat(center[1]),1182.57803),
					destination: Cesium.Cartesian3.fromDegrees(106.57181807206297, 29.602349151739556,1786.8346544294425),
					orientation: {
						heading: Cesium.Math.toRadians(0),
						pitch: Cesium.Math.toRadians(-20),
						roll: Cesium.Math.toRadians(0)
					},
					complete:function(){
                        roadConditionsControl.initRealTimeRoadConditions();

						popupControl.removePopup($("#CQ_LianJiang"));
						flashControl.clearEchartsRipple();
						flowingLineControl = new FlowingLineControl(viewer);
					}
				});
				baseEarthImage.show = false;
				viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50;//相机的高度的最小值
				viewer.scene.screenSpaceCameraController.maximumZoomDistance = 58830;  //相机高度的最大值
				//鹰眼图开启
				setTimeout(function () {
					$.getScript(top.ctx+'/js/gis/cesiumPlugin/leaflet/leaflet.js',function(){
						initOverview();
					});
				},2000);
				$.getScript(top.ctx+'/js/gis/cesiumPlugin/earthSDK/v1.2.7/XbsjEarth/thirdParty/mapv/mapv.min.js',function(){
				});
				initControl();

				/*earth.sceneTree.root.children.push({
					"czmObject": {
						"xbsjType": "Model",
						"name": "大厦",
						"url": top.ctx +'/model/gltf/multi_storied_01.gltf',
						"minimumPixelSize": 128,
						"luminanceAtZenith": 0.8, // 提高亮度
						"silhouetteColor":[0, 0.5, 1.0,1],
						"scale": 20,
						"xbsjPosition": [Cesium.Math.toRadians(106.5638), Cesium.Math.toRadians(29.5472), -50.0],
					}
				});*/
			}
		});

	},6000);
	//地图的底图、位置、级别设置
	configMap();
	//加载3d楼栋
	load3DBuilding();
	//加载向上的光粒
	 loadLightGrains(106.66,29.8,106.4,29.4,500);
	//开启抗锯齿
	viewer.scene.postProcessStages.fxaa.enabled = true;
	//绑定地图事件
	registerMapEvent();

	//导航功能开启
	$.getScript(top.ctx+'/js/gis/cesiumPlugin/navigation/navigation.js',function(){
		initNavigation();
	});
	//加载流光
	$.getScript(top.ctx+'/js/gis/cesiumPlugin/graph/CesiumGeometry.js',function(){

	});
	//加载热力图插件js
	$.getScript(top.ctx+'/js/gis/cesiumPlugin/CesiumHeatmap.js',function(){

	});
	//模型预加载
	/*var scene=viewer.scene;
	var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
		Cesium.Cartesian3.fromDegrees(106.5638, 29.5472, -10.0)); //模型转化成世界坐标
	var model = scene.primitives.add(Cesium.Model.fromGltf({  //将模型添加到场景的基础元素中
		url : top.ctx +'/model/gltf/multi_storied_01.gltf',//模型文件相对路径
        show : true,
        modelMatrix : modelMatrix,
		color:new Cesium.Color(111 / 255, 228 / 255, 255 / 255, 1),
		scale : 20,//调整模型在地图中的大小
        minimumPixelSize : 128,
        //maximumScreenSpaceError: 16 // default value
	}));*/


}

var pointForYS = null;
var pointControl = null;
var drawControl = null;
var flashControl = null;
var flowingLineControl = null;
var poiSearchControl = null;
var roadAndAroundControl = null;
var carTrack = null;
var policeTrack = null;
var trackReplay = null;
var roamControl = null;
var weather;
var weatherControl = null;
var mapVControl = null;
var measureControl = null;
var billboardControl = null;
var regionControl = null;
var odControl = null;
var trackDynamicDrawing = null;
var eventPointControl = null;
var roadControl = null;
function initControl() {
	drawControl = new DrawControl(viewer);
	poiSearchControl = new PoiSearchControl(viewer);
	flashControl = new FlashControl(viewer);
	roadAndAroundControl = new RoadAndAroundControl(viewer);
	carTrack = new CarTrack(viewer);
	policeTrack = new PoliceTrack(viewer);
	trackReplay = new TrackReplay(viewer);
	roamControl = new RoamControl(viewer);
	weatherControl = new WeatherControl(viewer);
	weather = new Weather();
	mapVControl = new MapVControl(viewer);
	measureControl = new MeasureControl(viewer);
	pointControl = new PointControl(viewer);
	billboardControl = new BillboardControl(earth);
	regionControl = new RegionControl(viewer);
	odControl = new OdControl(viewer);
	//pointForYS = new PointForYS(viewer);
	trackDynamicDrawing = new TrackDynamicDrawing(viewer);
	eventPointControl = new EventPointControl(viewer);
	roadControl = new RoadControl(viewer);
	//flowingLineControl = new FlowingLineControl(viewer);
}

function creatBillbon(){
	var offline_center = $('#offlinegis_Center').val();
	var center = eval(offline_center);
	var divPosition= Cesium.Cartesian3.fromDegrees(106.5630,29.6455,0);//div的坐标位置
	ysc.creatHtmlElement(viewer,$("#CQ_LianJiang"),divPosition,[-160,-120],true);//将div加载到地图中
	setTimeout(function () {
		ysc.creatEchartsRipple([{name: '重庆两江', value: 279}],{"重庆两江":[106.5630,29.6455]});
	},3500);

}

//地图的底图、位置、级别设置
function configMap(){

	var offline_ip = $('#offlinegis_Url').val();
	var offline_port = $('#offlinegis_Port').val();

	var offline_url = 'http://'+offline_ip+':'+offline_port;

	var offline_center = $('#offlinegis_Center').val();
	var fullExtentArr = eval($('#offlinegis_MapFullExtent').val());

	var offline_min_level = $('#offlinegis_MapMinLevel').val();
	var offline_max_level = $('#offlinegis_MapMaxLevel').val();

	var center = eval(offline_center);
	//相机初始化位置和角度设置
	viewer._cesiumWidget._creditContainer.style.display="none";
	viewer.scene.globe.depthTestAgainstTerrain = false;
	/**
	 * 设置后当相机高度达到设置的最大和最小高度时将不再放大和缩小
	 */
	/*viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50;//相机的高度的最小值
	viewer.scene.screenSpaceCameraController.maximumZoomDistance = 18830;  //相机高度的最大值
	viewer.scene.screenSpaceCameraController._minimumZoomRate = 30000; // 设置相机缩小时的速率
	viewer.scene.screenSpaceCameraController._maximumZoomRate=5906376272000 ;   //设置相机放大时的速率*/
}

/*显示当前坐标*/
function show3DCoordinates(target) {
	//地图底部工具栏显示地图坐标信息
	var elementbottom = document.createElement("div");
	$(".cesium-viewer").append(elementbottom);
	elementbottom.className = "mapfootBottom";
	var coordinatesDiv = document.getElementById(this.mapDivId + "_coordinates");
	if (coordinatesDiv) {
		coordinatesDiv.style.display = "block";
	}
	else {

		var _divID_coordinates = target + "_coordinates";
		coordinatesDiv = document.createElement("div");
		coordinatesDiv.id = _divID_coordinates;
		coordinatesDiv.className = "map3D-coordinates";
		coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;text-align:center;font-family:微软雅黑;color:#edffff;'>暂无坐标信息</span>";
		//document.getElementById(this.mapDivId).appendChild(coordinatesDiv);
		$(".cesium-viewer").append(coordinatesDiv);
		var handler3D = new Cesium.ScreenSpaceEventHandler(
			viewer.scene.canvas);
		handler3D.setInputAction(function(movement) {
			var pick= new Cesium.Cartesian2(movement.endPosition.x,movement.endPosition.y);
			if(pick){
				var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);
				if(cartesian){
					//世界坐标转地理坐标（弧度）
					var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
					if(cartographic){
						//海拔
						var height = viewer.scene.globe.getHeight(cartographic);
						//视角海拔高度
						var he = Math.sqrt(viewer.scene.camera.positionWC.x * viewer.scene.camera.positionWC.x + viewer.scene.camera.positionWC.y * viewer.scene.camera.positionWC.y + viewer.scene.camera.positionWC.z * viewer.scene.camera.positionWC.z);
						var he2 = Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z);
						//地理坐标（弧度）转经纬度坐标
						var point=[ cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];
						if(!height){
							height = 0;
						}
						if(!he){
							he = 0;
						}
						if(!he2){
							he2 = 0;
						}
						if(!point){
							point = [0,0];
						}
						coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;text-align:center;font-family:微软雅黑;color:#edffff;'>"+"视角海拔高度:"+(he - he2).toFixed(2)+"米"+"&nbsp;&nbsp;&nbsp;&nbsp;海拔:"+height.toFixed(2)+"米"+"&nbsp;&nbsp;&nbsp;&nbsp;经度：" + point[0].toFixed(6) + "&nbsp;&nbsp;纬度：" + point[1].toFixed(6)+ "</span>";
					}
				}
			}
		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	}
}

//加载3D楼栋
/*function load3DBuilding(){
	var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
		url: build3dUrl,
		luminanceAtZenith:0.5,
		maximumMemoryUsage:1024
	}));
	tileset.style = new Cesium.Cesium3DTileStyle({
		color : 'vec4（cross（$ {RightVector}，$ {UpVector}），1.0）'
	});
	//地图缩放事件,当缩放到一定级别的时候，隐藏3D楼栋
	viewer.scene.camera.moveEnd.addEventListener(function(){
		var height = viewer.camera.positionCartographic.height;
		/!*if(height > 2550){
			tileset.show = false;
		}else{
			tileset.show = true;
		}*!/
	});
	//绑定楼栋点击事件
	buildingClick();
}*/
function load3DBuilding(){
	var fsBody = `
            float vtxf_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
            float vtxf_a12 = v_elevationPos.z / 60.0 + sin(vtxf_a11) * 0.1+0.3;
            gl_FragColor *= vec4(vtxf_a12, vtxf_a12, vtxf_a12, 1.0);

            float vtxf_a13 = fract(czm_frameNumber / 360.0);
            float vtxf_h = clamp(v_elevationPos.z / 300.0, 0.0, 1.0);
            vtxf_a13 = abs(vtxf_a13 - 0.5) * 2.0;
            float vtxf_diff = step(0.005, abs(vtxf_h - vtxf_a13));
            gl_FragColor.rgb += vec3(5.0/255.0,12.0/255.0,107.0/255.0) * (1.0 - vtxf_diff)*0.8;
            `;
	earth.sceneTree.root.children.push({
		"ref": "tileset",
		"czmObject": {
			"xbsjType": "Tileset",
			"xbsjGuid": "094b1984-4aae-4ac3-bb35-86d84e6a8204",
			"name": "白模测试2",
			"url": build3dUrl,
			"xbsjStyle": "var style = {\n    color: \"vec4(0, 0.5, 1.0,1)\"\n}",
			"xbsjClippingPlanes": {},
			"xbsjCustomShader": {
				"fsBody": fsBody,
			}
		}
	});
	/*earth.sceneTree.root.children.push({
		"ref": 'polyline1',
		"czmObject": {
			"xbsjType": "Polyline",
			"positions":bordData,
			"xbsjCustomShader": {
				"fsBody": fsBody,
			}
		}
	});*/
	//绑定楼栋点击事件
	buildingClick();
}

function loadLightGrains(maxLon,maxLat,minLon,minLat,density) {
	const odlines = new XE.Obj.ODLines(earth);
	odlines.color = [1, 1, 1, 1];
	var p = [];
	var p1 = [];
	if(!density){
		density = 500;
	}
	for(var i=0;i<500;i++){
		//p1.push([106.4+Math.random()*0.26,29.4+Math.random()*0.4,0]);
		p1.push([minLon+Math.random()*(maxLon - minLon),minLat+Math.random()*(maxLat - minLat),0]);
	}
	p.push(p1);

	p = p.flatMap(e => e);

	let timeDuration = 10.0;
	let moveBaseDuration = 4.0;

	busLines = p.map(e => {
		return {
			posititons: [[Cesium.Math.toRadians(e[0]),Cesium.Math.toRadians(e[1]),e[2]], [Cesium.Math.toRadians(e[0]), Cesium.Math.toRadians(e[1]), e[2] + Math.random() * 1500.0+100]],
			color: [0.5, 0.8, 1.0, 0.8],
			width: 1.0,
			startTime: timeDuration * Math.random(),
			duration: moveBaseDuration + 1.0 * Math.random()
		}
	});

	odlines.data = busLines;
	odlines.timeDuration = timeDuration;
	odlines.playing = true;

	return odlines;
}

function buildingClick(){
	// An entity object which will hold info about the currently selected feature for infobox display
	var selectedEntity = new Cesium.Entity();

	// Get default left click handler for when a feature is not picked on left click
	var clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

	// If silhouettes are not supported, change the feature color to yellow on mouse over and green on mouse click.
	if(Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)) {
		// Silhouettes are supported

		var silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
		silhouetteGreen.uniforms.color = Cesium.Color.LIME;
		silhouetteGreen.uniforms.length = 0.01;
		silhouetteGreen.selected = [];
		var silhouetteGreenStage = Cesium.PostProcessStageLibrary.createSilhouetteStage([silhouetteGreen]);
		viewer.scene.postProcessStages.add(silhouetteGreenStage);



		// Silhouette a feature on selection and show metadata in the InfoBox.
		viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
			// If a feature was previously selected, undo the highlight
			silhouetteGreen.selected = [];

			// Pick a new feature
			var pickedFeature = viewer.scene.pick(movement.position);
			if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {
				if(!Cesium.defined(pickedFeature)) {
					clickHandler(movement);
					return;
				}

				// Select the feature if it's not already selected
				if(silhouetteGreen.selected[0] === pickedFeature) {
					return;
				}

				// Highlight newly selected feature
				silhouetteGreen.selected = [pickedFeature];
				var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(movement.position),viewer.scene);
				var coord = drawControl.Cartesian3_to_WGS84(cartesian);
				//调用高德根据经纬度查询地点的接口，所以坐标要从WGS84转到GCJ02
				cor = gcoord.transform(
					[parseFloat(coord[0]), parseFloat(coord[1])],    // 经纬度坐标
					gcoord.WGS84,               // 当前坐标系
					gcoord.AMap                 // 目标坐标系
				);
				//调用高德的根据经纬度查询地点的接口
				$.ajax({
					async: true,
					cache: false,
					type: "POST",
					dataType: "json",
					url: ctx + "/mapBase/regeoLocation_abc",
					data:{
						location : cor.join(",")
					},
					success: function (res) {
						$("#buildingPopup").find("#buildingAddress").text("未知");
						$("#buildingPopup").find("#buildingAddress").attr("title","");
						$("#buildingPopup").find("#buildingName").text("未知");
						$("#buildingPopup").find("#buildingName").attr("title","");
						$("#buildingPopup").find("#buildingType").text("未知");
						$("#buildingPopup").find("#buildingStreet").text("");
						$("#buildingPopup").find("#buildingAddress").text("");
						var data;
						if(res.response){
							data = res.response;
						}
						if(data.regeocode){
							if(data.regeocode.formatted_address){
								$("#buildingPopup").find("#buildingAddress").text(data.regeocode.formatted_address);
								$("#buildingPopup").find("#buildingAddress").attr("title",data.regeocode.formatted_address);
							}
							if(data.regeocode.addressComponent){
								if(data.regeocode.addressComponent.building && data.regeocode.addressComponent.building.name && data.regeocode.addressComponent.building.name.length > 0){
									$("#buildingPopup").find("#buildingName").text(data.regeocode.addressComponent.building.name);
									$("#buildingPopup").find("#buildingName").attr("title",data.regeocode.addressComponent.building.name);
									$("#buildingPopup").find("#buildingType").text(data.regeocode.addressComponent.building.type);
								}
								$("#buildingPopup").find("#buildingStreet").text(data.regeocode.addressComponent.township);
								$("#buildingPopup").find("#buildingRegion").text(data.regeocode.addressComponent.district);
							}
						}
						if($('#popup').length == 0){
							$("body").append(`
							<div class='ysc-dynamic-layer' id='popup' style="pointer-events: auto;">
                                <!------------------------------装饰用图------------------------------->
                                <div class="tc-debris tc-debris-01"></div>
                                <div class="tc-debris tc-debris-02"></div>
                                <div class="tc-debris tc-debris-03"></div>
                                <div class="tc-debris tc-debris-04"></div>
                                <div class="tc-debris tc-debris-05"></div>
                                <div class="tc-debris tc-debris-06"></div>
                                <div class="tc-debris tc-debris-07"></div>
                                <div class="tc-debris tc-debris-08"></div>
                                <div class="tc-debris tc-debris-09"></div>
                                <div class="bubble-triangle-new"></div>
                                <div class="bubble-light"></div>
                                <div class='bubble-Gis01'>
                            
                                </div>
                            </div>
							`)
						}
						$('#popup').find(".bubble-Gis01").html(document.getElementById("buildingPopup").innerHTML);
						var divPosition= Cesium.Cartesian3.fromDegrees(coord[0],coord[1],0);//div的坐标位置
						ysc.creatHtmlElement(viewer,$("#popup"),divPosition,[-170,-(parseInt($("#popup").css("height"))+85)],true);//将div加载到地图中
						//popupControl.showPopup($('#popup'),coord[0],coord[1],pickedFeature.getProperty("height"));
						var obj = $('#popup');
						obj.find(".windowIcon04").unbind("click").bind("click",function(e){
							popupControl.removePopup($("#popup"));
							silhouetteGreen.selected = [];
						});
					}
				});
			}

		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	} else {
		// Silhouettes are not supported. Instead, change the feature color.

		// Information about the currently highlighted feature
		var highlighted = {
			feature: undefined,
			originalColor: new Cesium.Color()
		};
	}
}

function showCoordinate(movement) {
	var pick= new Cesium.Cartesian2(movement.position.x,movement.position.y);
	if(pick) {
		var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);
		if (cartesian) {
			//世界坐标转地理坐标（弧度）
			var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
			if (cartographic) {
				//海拔
				var height = viewer.scene.globe.getHeight(cartographic);
				//视角海拔高度
				var he = Math.sqrt(viewer.scene.camera.positionWC.x * viewer.scene.camera.positionWC.x + viewer.scene.camera.positionWC.y * viewer.scene.camera.positionWC.y + viewer.scene.camera.positionWC.z * viewer.scene.camera.positionWC.z);
				var he2 = Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z);
				//地理坐标（弧度）转经纬度坐标
				var point = [cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];
				alert(point[0].toFixed(6) + "  " + point[1].toFixed(6));
			}
		}
	}
}

function registerMapEvent() {
	//鼠标左击事件
	var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
	handler.setInputAction(function (movement) {
		var pick = viewer.scene.pick(movement.position);
        //showCoordinate(movement);
		if (Cesium.defined(pick) && pick.id && (pick.id.type || (pick.id.properties && pick.id.properties.type && pick.id.properties.type.getValue()))) {
			if(pick.id.type == 'device'){  //点击设备或者警力
				var deviceId = pick.id.pointId;  //获取设备id
				var deviceType = pick.id.deviceType;  //获取设备类型
				var coord = [pick.id.lon,pick.id.lat];//获取设备经纬度
				var channel = 1;
				if(pick.id.channel){
					channel = pick.id.channel;  //获取设备通道
				}
				if(pick.id.deviceType == 'policeCar'){
					pointControl.showPoliceCarPopup(deviceId,coord); //弹出气泡
				} else if(pick.id.deviceType == 'policeOfficer'){
					pointControl.showPoliceManPopup(deviceId,coord); //弹出气泡
				} else {
					pointControl.getPointInfo(deviceId,coord,deviceType,channel); //弹出气泡
				}
			} else if(pick.id.properties && pick.id.properties.type.getValue() == 'location'){ //点击poi地点
				var id = pick.id.id;  //获取设备id
				var coord = [pick.id.properties.lon.getValue(),pick.id.properties.lat.getValue()];//获取设备经纬度
				poiSearchControl.getPointInfo(deviceId,coord); //弹出气泡
			} else if(pick.id.properties && pick.id.properties.type.getValue() == 'jam'){ //点击拥堵
                var id = pick.id.id;  //获取设备id
                var coord = [pick.id.properties.lon.getValue(),pick.id.properties.lat.getValue()];//获取设备经纬度
                if(abnormalJam.abnormalJamData){
                    abnormalJam.showYDpopup(abnormalJam.abnormalJamData); //弹出气泡
                }
            } else if(pick.id.properties && pick.id.properties.type.getValue() == 'congesition_map'){//地图上默认加载的异常拥堵图标
				var centerPoint = [pick.id.properties.lon,pick.id.properties.lat];
				var polyLine = pick.id.properties.polylineStr.getValue();
				roadAndAroundControl.showRoad(centerPoint,polyLine);
				//打开拥堵气泡
				eventPointControl.showCongesitionPopup(pick.id.properties.data.getValue()); //弹出气泡
			} else if(pick.id.properties && pick.id.properties.type.getValue() == 'event_map'){
				var coord = [pick.id.properties.lon.getValue(),pick.id.properties.lat.getValue()];//获取设备经纬度
				var polyLine = pick.id.properties.polylineStr.getValue();
				roadAndAroundControl.showRoad(coord,polyLine);
				//打开拥堵气泡
				eventPointControl.showEventPop(pick.id.properties.data.getValue()); //弹出气泡
			} else if(pick.id.properties && pick.id.properties._type.getValue() == 'eventIcon'){ //点击交通事件
                var id = pick.id.id;  //获取设备id
                var coord = [pick.id.properties.lon.getValue(),pick.id.properties.lat.getValue()];//获取设备经纬度
                if(trafficEvent.nowEventData){
                    var arr = trafficEvent.nowEventData.polyline.replace(/,/g, "_").split(";");
                    trafficEvent.showEventPop(arr,trafficEvent.nowEventData); //弹出气泡
                }
            } else if(pick.id.type == 'deviceCluster'){//点击聚合气泡
				var size = pick.id.size;
				if(size > 10 && viewer.camera.positionCartographic.height >1000){//如果聚合气泡里面的设备数量大于10个，则不显示设备列表，直接调低camera高度
					var cameraPosition = drawControl.Cartesian3_to_WGS84(viewer.camera.position);
					var targetPosition = [pick.id.lon,pick.id.lat];
					var cameraHeight = viewer.camera.positionCartographic.height;
					var heading = viewer.camera.heading;
					var pitch = viewer.camera.pitch;
					var ox = (targetPosition[0] + cameraPosition[0])/2;
					var oy = (targetPosition[1] + cameraPosition[1])/2;
					var cameraCoor = [ox,oy]; //相机的坐标设为终点指向起点的延长线上的点，以便能把整个轨迹显示在视野中
					viewer.camera.flyTo({
						destination:Cesium.Cartesian3.fromDegrees(cameraCoor[0],cameraCoor[1],cameraHeight/2),
						orientation: {
							heading : heading,
							pitch : pitch,
							roll : Cesium.Math.toRadians(0)
						}
					});
				} else {//如果聚合气泡里面的设备数量小于或等于10个，则显示设备列表
					pointControl.showDeviceList([pick.id.lon,pick.id.lat],pick.id.features);
					var cameraPosition = drawControl.Cartesian3_to_WGS84(viewer.camera.position);
					var targetPosition = [pick.id.lon,pick.id.lat];
					var cameraHeight = viewer.camera.positionCartographic.height;
					var heading = viewer.camera.heading;
					var pitch = viewer.camera.pitch;
					var ox = (targetPosition[0] + cameraPosition[0])/2;
					var oy = (targetPosition[1] + cameraPosition[1])/2;
					var cameraCoor = [ox,oy]; //相机的坐标设为终点指向起点的延长线上的点，以便能把整个轨迹显示在视野中
					if(viewer.camera.positionCartographic.height >1000){//只有高度大于1000的时候才移动镜头
						viewer.camera.flyTo({
							destination:Cesium.Cartesian3.fromDegrees(cameraCoor[0],cameraCoor[1],cameraHeight/2),
							orientation: {
								heading : heading,
								pitch : pitch,
								roll : Cesium.Math.toRadians(0)
							},
							complete:function () {
								//pointControl.showDeviceList([pick.id.properties.lon.getValue(),pick.id.properties.lat.getValue()],pick.id.properties.features.getValue());
							}
						});
					}

				}
			}

		}

	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

//地图鹰眼功能
function initOverview() {
	var url = 'http://50.37.141.251:25013/v3/tile?z={z}&x={x}&y={y}';
	var layer = new L.TileLayer(url, {
		minZoom: 4,
		maxZoom: 19
	});
	var container = document.getElementById("overview");
	var options = {
		container: container,
		toggleDisplay: true,
		width: 150,
		height: 150,
		position: "topright",
		aimingRectOptions: {
			color: "#ff1100",
			weight: 3
		},
		shadowRectOptions: {
			color: "#0000AA",
			weight: 1,
			opacity: 0,
			fillOpacity: 0
		}
	};
	overviewCtr = new CesiumOverviewMapControl(viewer, layer, options);
}

//地图导航功能
function initNavigation() {
	// extend our view by the cesium navigaton mixin
	var options = {};
	options.defaultResetView =  Cesium.Cartographic.fromDegrees(106.572752,29.61573,1182.6330);
	options.enableCompass= true;            //罗盘
	options.enableZoomControls= false;      //缩放
	options.enableDistanceLegend= false;    //比例尺
	options.enableCompassOuterRing= true;   //指南针外环
	viewer.extend(Cesium.viewerCesiumNavigationMixin, options);
	$(".compass-gyro-background").css("background","rgba(45, 146, 216, 0.5)");
	$(".compass-outer-ring-background").css("border-color","rgba(46,151,224,.5)");
	$(".distance-legend").css("border","none");
	$(".distance-legend").css("background","none");
	/*罗盘*/
	$(".compass").css("position","absolute");
	$(".compass").css("right","20px");
	$(".compass").css("top","140px");
	$(".compass").attr("title","拖动外圈：旋转视图。拖动内部陀螺仪：自由动态观察。双击：重置视图。提示：按住CTRL键并拖动地图也可以自由动态观察。");
	$(".compass-outer-ring").attr("title","单击并拖动以旋转相机");
	$($($(".navigation-controls")[1]).find(".navigation-control")[0]).attr("title","放大");
	$($($(".navigation-controls")[1]).find(".navigation-control")[1]).attr("title","还原");
	$($(".navigation-controls")[1]).find(".navigation-control-last").attr("title","缩小");
	/*导航控制器*/
	$(".navigation-controls").css("border","1px solid rgba(45,182,216,0.5)");
	$(".navigation-controls").css("position","absolute");
	$(".navigation-controls").css("right","50px");
	$(".navigation-controls").css("top","230px");
	$(".navigation-controls").css("height","90px");
}
