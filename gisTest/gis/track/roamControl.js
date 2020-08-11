/**
 * @(#)roamControl.js
 *
 * @description: 3d漫游效果
 * @author: 尹飞 2019/10/14
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */

var RoamControl = function(){
    this.init.apply(this, arguments);
};

RoamControl.prototype = {
    viewer: null, //cesium视图对象
    speed : 1,//默认速度
    init: function (viewer) {
        this.stopRoamByCenterByDoubleClick();
        this.startRoamByCenterByDoubleClick();
        //this.initRoamRoute();//初始化漫游的路线
    },
    /**
     * 修改速度，以便调整漫游的速度
     * speed  : 漫游的速度，为0的时候漫游暂停，大于1的时候加速
     */
    setSpeed:function(speed){
        this.speed = speed;
        viewer.clock.multiplier = speed;
    },
    //关闭双击旋转漫游
    stopRoamByCenterByDoubleClick:function(){
        earth.czm.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    },
    //开启双击旋转漫游
    startRoamByCenterByDoubleClick:function(){
        earth.czm.viewer.screenSpaceEventHandler.setInputAction(event => {
            layer.msg("你已进入旋转漫游模式，单击地图退出漫游");
            var coordWorld = this.getPointFromWindowPoint(event.position);
            var coord = this.Cartesian3_to_WGS84(coordWorld);
            earth.camera.flyAround([Cesium.Math.toRadians(coord[0]),Cesium.Math.toRadians(coord[1]),15], 3000, [0, -Math.PI / 5, 0], 3, 3.14/25);
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    },
    //屏幕坐标转世界坐标
    getPointFromWindowPoint(point){
        if(viewer.scene.terrainProvider.constructor.name=="EllipsoidTerrainProvider") {
            return viewer.camera.pickEllipsoid(point,viewer.scene.globe.ellipsoid);
        } else {
            var ray=viewer.scene.camera.getPickRay(point);
            return viewer.scene.globe.pick(ray,viewer.scene);
        }
    },
    //笛卡尔坐标系转WGS84坐标系
    Cartesian3_to_WGS84: function (point) {
        var cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z);
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
        var lat = Cesium.Math.toDegrees(cartographic.latitude);
        var lng = Cesium.Math.toDegrees(cartographic.longitude);
        var alt = cartographic.height;
        // return {lat: lat, lng: lng, alt: alt};
        return [lng,lat];
    },
    /**
     * 环绕某一点进行环绕漫游
     * @param records
     */
    roamByCenter:function (center) {
        var center = Cesium.Cartesian3.fromDegrees(106.57933299927168,29.622504722488795);
        var heading = Cesium.Math.toRadians(50.0);
        var pitch = Cesium.Math.toRadians(-20.0);
        var range = 5000.0;
        var x=50;
        viewer.scene.postRender.addEventListener(function () {
            x+=0.05;
            heading=Cesium.Math.toRadians(x);
            viewer.camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, range));
        });
    },
    /**
     * 按照坐标路线进行漫游
     * @param marks
     */
    roamByLine:function (marks) {
        var _self = this;
        /** 相机视角飞行 开始 **/
        // var marks = [
        //     {lng:106.55885639698207,lat:29.55308391757833,height:100, flytime:10},
        //     {lng:106.56073792924575,lat:29.557935984579228,height:100, flytime:10},
        //     {lng:106.56166883525653,lat:29.56146678056901,height:100, flytime:10},
        //     {lng:106.56267138746729,lat:29.56800120245279,height:100, flytime:10},
        //     {lng:106.5635974449411,lat:29.575363785882157,height:100, flytime:10},
        //     {lng:106.56386119801887,lat:29.577773555487568,height:100, flytime:10},
        //     {lng:106.56356001539221,lat:29.579271408332616,height:100, flytime:10},
        //     {lng:106.56183713562194,lat:29.58238435430562,height:100, flytime:10},
        //     {lng:106.55562601223072,lat:29.592879962444474,height:100, flytime:10},
        //     {lng:106.55526873704035,lat:29.59523343836358,height:100, flytime:10},
        //     {lng:106.55842270252808,lat:29.613591421391597,height:100, flytime:10},
        //     {lng:106.555784644872,lat:29.615614336902247,height:100, flytime:10},
        //     {lng:106.55485990437843,lat:29.617009817488526,height:100, flytime:10},
        //     {lng:106.55443443855064,lat:29.618336246168464,height:100, flytime:10},
        //     {lng:106.55397063210326,lat:29.623676592790815,height:100, flytime:10},
        //     {lng:106.55887701150984,lat:29.624122186215374,height:100, flytime:10},
        //     {lng:106.5602658456753,lat:29.62461198058207,height:100, flytime:10},
        //     {lng:106.5683519520868,lat:29.629300874403178,height:100, flytime:10},
        //     {lng:106.58071727891819,lat:29.63174126777446,height:100, flytime:10},
        //     {lng:106.59084025560105,lat:29.63655684765678,height:100, flytime:10},
        //     {lng:106.59372237510267,lat:29.636372291756658,height:100, flytime:10},
        //     {lng:106.60496440182993,lat:29.630316387175586,height:100, flytime:10},
        //     {lng:106.60651232691268,lat:29.630247222946462,height:100, flytime:10},
        //     {lng:106.60628714686152,lat:29.634330425620146,height:100, flytime:10},
        //     {lng:106.6077890304595,lat:29.639051362222535,height:100, flytime:10},
        //     {lng:106.62479704597582,lat:29.661503302168637,height:100, flytime:10},
        //     {lng:106.62999683573726,lat:29.671552780991185,height:100, flytime:10},
        //     {lng:106.64480555064796,lat:29.690932439009387,height:100, flytime:10},
        //     {lng:106.63518522063454,lat:29.694135681460168,height:100, flytime:10},
        //     {lng:106.63128644264398,lat:29.69449489329805,height:100, flytime:10},
        //     {lng:106.62460899909871,lat:29.69321353990049,height:100, flytime:10},
        //     {lng:106.61755183804956,lat:29.696381615835065,height:100, flytime:10},
        //     {lng:106.61484520498026,lat:29.689335486026035,height:100, flytime:10},
        //     {lng:106.60385420079587,lat:29.680045770867746,height:100, flytime:10},
        //     {lng:106.59753136930361,lat:29.674863964786336,height:100, flytime:10},
        //     {lng:106.59572878388659,lat:29.666929896672197,height:100, flytime:10},
        //     {lng:106.58031789355583,lat:29.67121010019814,height:100, flytime:10},
        //     {lng:106.56288288231595,lat:29.681947857737153,height:100, flytime:10},
        //     {lng:106.54428815351334,lat:29.695135773630955,height:100, flytime:10}
        // ];// 地标集合 根据地标顺序来进行漫游
        var marksIndex = 1;
        var pitchValue = -30;
        var heading = bearing(marks[0].lat, marks[0].lng, marks[1].lat, marks[1].lng);
        heading = Cesium.Math.toRadians(heading);
        viewer.scene.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(marks[0].lng,marks[0].lat, marks[0].height),  //定位坐标点，建议使用谷歌地球坐标位置无偏差

            duration:7   //定位的时间间隔
        });

        setTimeout(function(){
            flyExtent();
        },7000);

        function  flyExtent(){
            // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值
            var pitch = Cesium.Math.toRadians(pitchValue);
            // 时间间隔2秒钟
            setExtentTime(marks[marksIndex].flytime);
            var Exection = function TimeExecution() {
                var preIndex = marksIndex - 1;
                if(marksIndex == 0){
                    preIndex = marks.length -1;
                }
                var heading = bearing(marks[preIndex].lat, marks[preIndex].lng, marks[marksIndex].lat, marks[marksIndex].lng);
                heading = Cesium.Math.toRadians(heading);
                // 当前已经过去的时间，单位s
                var delTime = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime, viewer.clock.startTime);
                var originLat = marksIndex == 0 ? marks[marks.length - 1].lat : marks[marksIndex-1].lat;
                var originLng = marksIndex == 0 ? marks[marks.length - 1].lng : marks[marksIndex-1].lng;
                var endPosition = Cesium.Cartesian3.fromDegrees(
                    (originLng+(marks[marksIndex].lng-originLng)/marks[marksIndex].flytime*delTime),
                    (originLat+(marks[marksIndex].lat-originLat)/marks[marksIndex].flytime*delTime),
                    marks[marksIndex].height
                );
                viewer.scene.camera.setView({
                    destination: endPosition,
                    orientation: {
                        heading: heading,
                        pitch : pitch
                    }
                });
                if (Cesium.JulianDate.compare(viewer.clock.currentTime, viewer.clock.stopTime) >= 0) {
                    viewer.clock.onTick.removeEventListener(Exection);
                    changeCameraHeading();
                }
            };
            viewer.clock.onTick.addEventListener(Exection);
            var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            handler.setInputAction(function (movement) {
                viewer.clock.onTick.removeEventListener(Exection);
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
        // 相机原地定点转向
        function  changeCameraHeading(){
            var nextIndex = marksIndex + 1;
            if(marksIndex == marks.length - 1){
                nextIndex = 0;
            }
            // 计算两点之间的方向
            var heading = bearing(marks[marksIndex].lat, marks[marksIndex].lng, marks[nextIndex].lat, marks[nextIndex].lng);
            // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值
            var pitch = Cesium.Math.toRadians(pitchValue);
            // 给定飞行一周所需时间，比如10s, 那么每秒转动度数
            var angle = (heading - Cesium.Math.toDegrees(viewer.camera.heading)) / 2;
            // 时间间隔2秒钟
            setExtentTime(1);
            // 相机的当前heading
            var initialHeading = viewer.camera.heading;
            var Exection = function TimeExecution() {
                // 当前已经过去的时间，单位s
                var delTime = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime, viewer.clock.startTime);
                var heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;

                var originLat = nextIndex == 0 ? marks[marks.length - 1].lat : marks[nextIndex-1].lat;
                var originLng = nextIndex == 0 ? marks[marks.length - 1].lng : marks[nextIndex-1].lng;
                var endPosition = Cesium.Cartesian3.fromDegrees(
                    originLng,
                    originLat,
                    marks[nextIndex].height
                );
                viewer.scene.camera.setView({
                    destination: endPosition,
                    orientation: {
                        heading : heading,
                        pitch : pitch
                    }
                });
                if (Cesium.JulianDate.compare(viewer.clock.currentTime, viewer.clock.stopTime) >= 0) {
                    viewer.clock.onTick.removeEventListener(Exection);
                    marksIndex = ++marksIndex >= marks.length ? 0 : marksIndex;
                    flyExtent();
                }
            };
            viewer.clock.onTick.addEventListener(Exection);
            var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            handler.setInputAction(function (movement) {
                viewer.clock.onTick.removeEventListener(Exection);
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
        // 设置飞行的时间到viewer的时钟里
        function setExtentTime(time){
            var startTime = Cesium.JulianDate.fromDate(new Date());
            var stopTime = Cesium.JulianDate.addSeconds(startTime, time, new Cesium.JulianDate());
            viewer.clock.startTime = startTime.clone();  // 开始时间
            viewer.clock.stopTime = stopTime.clone();     // 结速时间
            viewer.clock.currentTime = startTime.clone(); // 当前时间
            //viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
            viewer.clock.multiplier = _self.speed;
            //viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。

        }
        /** 相机视角飞行 结束 **/

        /** 飞行时 camera的方向调整(heading) 开始 **/
        // Converts from degrees to radians.
        function toRadians(degrees) {
            return degrees * Math.PI / 180;
        }

        // Converts from radians to degrees.
        function toDegrees(radians) {
            return radians * 180 / Math.PI;
        }

        function bearing(startLat, startLng, destLat, destLng){
            startLat = toRadians(startLat);
            startLng = toRadians(startLng);
            destLat = toRadians(destLat);
            destLng = toRadians(destLng);

            var y = Math.sin(destLng - startLng) * Math.cos(destLat);
            var x = Math.cos(startLat) * Math.sin(destLat) - Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
            var brng = Math.atan2(y, x);
            var brngDgr = toDegrees(brng);
            return (brngDgr + 360) % 360;
        }
    },

};