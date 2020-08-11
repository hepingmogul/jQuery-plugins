/****************************************************************
 * 
 * 工具集合
 * 
 ****************************************************************/

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * 
 */

Date.prototype.format = function(fmt){
	var o = {
		"M+" : this.getMonth()+1,                 // 月份
		"d+" : this.getDate(),                    // 日
		"h+" : this.getHours(),                   // 小时
		"m+" : this.getMinutes(),                 // 分
		"s+" : this.getSeconds(),                 // 秒
		"q+" : Math.floor((this.getMonth()+3)/3), // 季度
		"S"  : this.getMilliseconds()             // 毫秒
	};
	if(/(y+)/.test(fmt)){
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
	}
	for(var k in o){
		if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		}
	}
	return fmt; 
};

/**
 * 长整形时间转换为字符串
 * 时间戳:138000012300 变为 "2015-08-06 14:10:25"字符串
 * 
 * @param dLong {Number}
 * @param includeMs {Boolean} 是否包括毫秒
 * @returns {String}
 */
function time2String(dLong, includeMs) {
	var d = new Date(dLong);
	// 非法格式，返回空串
	if(d == "Invalid Date"){
		return "";
	}
	if(includeMs){
		return d.format("yyyy-MM-dd hh:mm:ss.S");
	}else{
		return d.format("yyyy-MM-dd hh:mm:ss");
	}
}

/**
 * 号牌颜色转换
 */
function colorStyler(code){
	if(code == '2'){
		 return 'background-color:#3376ff;color:white;';
	}else if(code == '0'){
		return 'background-color:#ffffff;color:black;';
	}else if(code == '1'){
		return 'background-color:#f6f08b;color:black;';
	}else if(code == '3'){
		return 'background-color:#333333;color:white;';
	}
}

/**
 * 车辆速度转换
 */
function clsdFormatter(code){
	if(code == "-1")
		return "未测速"; 
	else
	    return (code && "" !=  code)?code + " km/h" : "";
}

/**
 * 设置默认查询时间
 */
var initStartTime = "";
var initEndTime = "";
function initDefaultTime(type){
    var times = getDefaultTimes();
    var defaultStartTime = times.st;
    var defaultEndTime = times.et;
    initStartTime = defaultStartTime;
    initEndTime = defaultEndTime;
    $('#fromDate').val(defaultStartTime);    
    $('#toDate').val(defaultEndTime); 
	$('#fromTime').val(defaultStartTime);    
    $('#toTime').val(defaultEndTime);
    $('#fromTime_Phone').val(defaultStartTime); 
    $('#toTime_Phone').val(defaultEndTime);
    $("#fromDate_people").val(defaultStartTime);    
    $("#toDate_people").val(defaultEndTime);
    if(type == 'fakePlate'){
    	$('#fromTime_job').datetimebox('setValue', defaultStartTime);    
    	$('#toTime_job').datetimebox('setValue', defaultEndTime); 
    }
}

/**
 * 获取默认时间
 */
function getDefaultTimes(){
	var now = new Date(); //获取系统日期，如Sat Jul 29 08:24:48 UTC+0800 2012
	var yy = now.getFullYear(); //截取年，即2012
	var MM = now.getMonth()+1; //截取月，即07
	var dd = now.getDate(); //截取日，即29
	if(MM<10)//目的是构造2012-12-04这样的日期
		MM = "0"+MM;
	if(dd<10)
		dd = "0"+dd;
	var hh = now.getHours(); //截取小时，即8
	var mm = now.getMinutes(); //截取分钟，即34
	var ss = now.getTime() % 60000;
	//获取时间，因为系统中时间是以毫秒计算的， 所以秒要通过余60000得到。
	ss = (ss - (ss % 1000)) / 1000; //然后，将得到的毫秒数再处理成秒
	if (hh < 10) hh = '0' + hh; //字符串
	if (mm < 10) mm = '0' + mm; //字符串
	if (ss < 10) ss = '0' + ss; //字符串
	var defaultStartTime = yy + "-" + MM + "-" + dd + " " + "00:00:00";
	var defaultEndTime = yy + "-" + MM + "-" + dd + " " + hh+":"+mm+":"+ss;
	var TodayEndTime = yy + "-" + MM + "-" + dd + " " + "23:59:59";
	var defaultDate = yy + "-" + MM + "-" + dd;
	return {st:defaultStartTime,et:defaultEndTime,dd:defaultDate,tn:TodayEndTime};
}

/**
 * 获取字符时间
 * @returns 
 */
function getDateSecondFormat(date){
	if(!date || null == date) return;
	
	var yy = date.getFullYear(); //截取年，即2012    
	var MM = date.getMonth()+1; //截取月，即07    
	var dd = date.getDate(); //截取日，即29 
	if(MM<10)//目的是构造2012-12-04这样的日期
		MM = "0"+MM;
	if(dd<10)
		dd = "0"+dd;
	var hh = date.getHours(); //截取小时，即8    
	var mm = date.getMinutes(); //截取分钟，即34    
	var ss = date.getTime() % 60000;    
	//获取时间，因为系统中时间是以毫秒计算的， 所以秒要通过余60000得到。    
	ss = (ss - (ss % 1000)) / 1000; //然后，将得到的毫秒数再处理成秒    
	if (hh < 10) hh = '0' + hh; //字符串    
	if (mm < 10) mm = '0' + mm; //字符串    
	if (ss < 10) ss = '0' + ss; //字符串    
	var dateStr = yy + "-" + MM + "-" + dd + " " + hh+":"+mm+":"+ss;	
	return dateStr;
}

/**
 * 判断两个时间的大小
 * 
 * @param fromTime
 * @param toTime
 * @returns {boolean}
 */
function compareTime(fromTime, toTime) {
	//判断起始日期是否大于结束日期
	if (fromTime != "" && typeof fromTime != undefined && toTime != ""
			&& typeof toTime != undefined) {
		
		var ft = toDate(fromTime);
		var tt = toDate(toTime);
		
		if (tt < ft) {
			$MsgBox.alert("警告", "“开始时间”不能大于“结束时间”，请重新选择");
			return false;
		}
	}
	return true;
}

/**
 * 数字验证
 * 
 * @param temp
 * @returns {boolean}
 */
function isInteger(temp) {
	var re = /[^\d]/;
	if (re.test(temp))
		return false;
	return true;
}

/**
 * 将字符串时间格式转换为Date类型
 * 
 * @param str
 * @returns {Date}
 */
function toDate(str) {
	var sd = str.split("-");
	var sd1 = sd[2].split(" ");
	var sd2 = sd1[1].split(":");
	return new Date(sd[0], sd[1] - 1, sd1[0], sd2[0], sd2[1], sd2[2]);
}

/**
 * 字符串截取
 * 
 * @param str
 * @param len
 * @returns {str}
 */
function getSubstr(str, len){
	if(!str || !len){
		return '';
	}
	var a = 0, i = 0, temp = '';
	for(i = 0; i < str.length; i++){
		if(str.charCodeAt(i) > 255){
			a += 2;
		}else{
			a++;
		}
		if(a>len){ return temp+'...';}
		temp += str.charAt(i);
	}
	return str;
}

/**
&nbsp;* 图片出错处理，可以重加载指定的图片。超过重试次数仍不能正常显示的，显示缺省图片。
&nbsp;* 示例<img onerror="showImgDelay(this,'1.jpg',2)" src="1.jpg">
&nbsp;* imgObj:img节点对象
&nbsp;* imgSrc:出错时加载的图片地址
&nbsp;* maxErrorNum:最大出错次数，防止出现死循环
&nbsp;*/
function showImgDelay(imgObj,imgSrc,maxErrorNum, type, isLarge){
	imgSrc = imgSrc.split('?')[0]+"?"+generateMixed(5);
    if(maxErrorNum>0){
        imgObj.onerror=function(){
            showImgDelay(imgObj,imgSrc,maxErrorNum-1);
        };
        setTimeout(function(){
            imgObj.src=imgSrc;
        },8000);
    }else{
        imgObj.onerror=null;
        if (type == "face") {
        	imgObj.src= (ctx?ctx:top.ctx) + "/images/common/carbox/face_nopic" + (isLarge?"_large":"") + ".png";
        } else if (type == "jdctx") {
        	imgObj.src= (ctx?ctx:top.ctx) + "/images/common/carbox/jdctx_nopic" + (isLarge?"_large":"") + ".png";
        }
    }
}

/**
 * 提示信息显隐*
 */
function tipsInfoShowOrHide(text){
	var defaultFadeOutTime = 5000;
	$(".tipInfo").html(text);
	$(".tipInfo").show();
	$(".tipInfo").fadeOut(defaultFadeOutTime);
}

/**
 *生成随机数
 */
var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
function generateMixed(n) {
   var res = "";
   for(var i = 0; i < n ; i ++) {
       var id = Math.ceil(Math.random()*35);
       res += chars[id];
   }
   return res;
}
/**
 * 显示正在分析onLoading提示
 *
 * @param 无
 * @return 无
 * @exception 无
 * @History: 无
 *
 */
function _showWait(){
	if($('#fade') && $('#fade').size()>0){
		return;
	}

	var fade= document.createElement("div");
	fade.id='fade';
	fade.className="black_overlay";

	document.body.appendChild(fade);

	fade.style.display='block';

	var divInit = document.createElement("div");
	divInit.id='loadingC';
	divInit.className="loadingC";
	divInit.innerHTML = '<img src="resource/images/eazymapwin/loading.gif" width="100" height="100" />';
	document.body.appendChild(divInit);

	divInit.style.display='block';
	divInit.style.left=(document.body.clientWidth-100)/2 +"px";
	divInit.style.top = (document.body.clientHeight-100)/2+"px";

}
/**
 * 隐藏正在分析onLoading提示
 *
 * @param 无
 * @return 无
 * @exception 无
 * @History: 无
 *
 */
function _hideWait(){


	var obj = document.getElementById("fade");
	if(obj){
		document.body.removeChild(obj);
//		OpenLayers.Element.destroy(obj);
	}

	obj = document.getElementById("loadingC");
	if(obj){
		document.body.removeChild(obj);
//		OpenLayers.Element.destroy(obj);
	}

}

/**
 * 图片加载失败时显示默认图片
 * @param imgObj
 * @param imgSrc
 * @param maxErrorNum
 * @param type
 * @param isLarge
 */
function showImgDelayByWrap(imgObj,imgSrc,maxErrorNum, type, isLarge){
	imgSrc = imgSrc.split('?')[0]+"?"+generateMixed(5);
	if(maxErrorNum>0){
		imgObj.onerror=function(){
			showImgDelay(imgObj,imgSrc,maxErrorNum-1);
		};
		setTimeout(function(){
			imgObj.src=imgSrc;
		},8000);
	}else{
		$(imgObj).css({
			"opacity" : "0"
		});
		imgObj.onerror=null;
		$(imgObj).wrap('<div style="height: 100%;" class="noImage0' + (type == "jdctx"?'2':'3') + '" ></div>');
	}
}

/**
 * 根据左下角坐标和右上角坐标将区域分成对角线大约为10公里的正方形，返回正方形的对角坐标集合
 * @param distance 要分割的正方形的对角线距离，米为单位
 * @param leftBottom  左下角坐标，范围： [(-180~180),(-90~90)]
 * @param rightTop    右上角坐标,范围：[(-180~180),(-90~90)]
 */
function getRectListByExtent(distance,leftBottom,rightTop){
	var TestClassSource = new ol.source.Vector({});
	var TestLayer = new ol.layer.Vector({
		name : "TestLayer",
		zIndex:102,
		source:TestClassSource
	});



	var length = distance/Math.sqrt(2);
	var wgs84Sphere = new ol.Sphere(6378137);
	var unitX = Number.parseFloat((length/wgs84Sphere.haversineDistance([116,29], [117,29])).toFixed(4));
	var unitY = Number.parseFloat((length/wgs84Sphere.haversineDistance([116,29], [116,30])).toFixed(4));
    var x1 = leftBottom[0];
	var x2 = rightTop[0];
	var y1 = leftBottom[1];
	var y2 = rightTop[1];
	var list = [];
	for(var x=x1;x<x2-unitX;x=x+unitX){
		for(var y=y1;y<y2-unitY;y=y+unitY){
			list.push(x+","+y+";"+(x+unitX)+","+(y+unitY));

			var zb = [];
			var coordinates = [[x,y],[Number.parseFloat(x+unitX),y],[Number.parseFloat(x+unitX),Number.parseFloat(y+unitY)],[x,Number.parseFloat(y+unitY)],[x,y]];
			for(var i=0;i<coordinates.length;i++ ){
				var coordinate = coordinates[i];
				if(clientGISKind==clientGISKinds.OFFLINEGIS
					&& (coordinate[0]*1 >= -180 && coordinate[0]*1 <= 180)
					&& (coordinate[1]*1 >= -90 && coordinate[1]*1 <= 90)){
					var cor = ol.proj.transform(ZT.Utils.gps84_To_Gcj02(coordinate[0],coordinate[1]), 'EPSG:4326', 'EPSG:3857');
				}else{
					var cor = [coordinate[0],  coordinate[1]];
				}
				zb.push(cor);
			}
			var feature = new ol.Feature({
				geometry: new ol.geom.Polygon([zb])
			});
			styles = [];
			styles.push(new ol.style.Style({
				geometry: new ol.geom.Polygon([zb]),
				stroke: new ol.style.Stroke({
					//color: '#ffcc33',
					color : '#759BE6',
					width: 2
				}),
				fill: new ol.style.Fill({
					color : 'rgba(255,255,255,0.2)'
				}),
			}));
			feature.setStyle(styles);
			TestClassSource.addFeature(feature);
		}
	}
	map.addLayer(TestLayer);

	return list;
}