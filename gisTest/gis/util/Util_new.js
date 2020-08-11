
var ZT= window.ZT= ZT|| {};

(function(){
	 
		var Utils = 
	
		ZT.Utils = function(){
		
		}
		
		//openlayer3 polyline坐标转化为线查询字符串
		Utils.getPolyLineString = function(Coordinates){
			if(!Coordinates){
				return;
			}
			var extent ='';
    		for(var i=0;i < Coordinates.length;i++){
    			extent += Coordinates[i].join(' ') + ',';
    		}
    		extent = extent.substr(0,extent.length - 1);
    		extent = 'LINESTRING(' +  extent + ')';
    		return extent;
		}
		
		Utils.animationMove = function(zoomSize,coordinates){
			viewer.camera.flyTo({
				destination:Cesium.Cartesian3.fromDegrees(coordinates[0] * 1, coordinates[1] * 1,1182.57803),
			});
		}
		
		
		//openlayer3 polygon坐标转化为空间查询字符串
		Utils.getPolyGonString = function(Coordinates){
			if(!Coordinates){
				return;
			}
			var extent ='';
    		for(var i=0;i < Coordinates.length;i++){
    			extent += Coordinates[i].join(' ') + ',';
    		}
    		extent = extent.substr(0,extent.length - 1);
    		extent = 'POLYGON((' +  extent + '))';
    		return extent;
		}
		Utils.getPolyGonString2 = function(Coordinates){
			if(!Coordinates){
				return;
			}
			var extent ='';
    		for(var i=0;i < Coordinates.length;i++){
    			extent +='(';
    			for(var j=0;j < Coordinates[i].length;j++){
    				extent += Coordinates[i][j][0] +" "+ Coordinates[i][j][1] + ",";
    			}
    			extent = extent.substr(0,extent.length - 1);
    			extent += "),";
    		}
    		extent = extent.substr(0,extent.length - 1);
    		extent = 'POLYGON(' +  extent + ')';
    		return extent;
		}
		
		Utils.Ajax = function(){
			function request(url,opt){
				function fn(){}
				var async   = opt.async !== false,
				method  = opt.method    || 'POST',
				data    = opt.data      || null,
				success = opt.success   || fn,
				failure = opt.failure   || fn;
				method  = method.toUpperCase();
				if(method == 'GET' && data){
					url += (url.indexOf('?') == -1 ? '?' : '&') + data;
					data = null;
				}
				var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
				xhr.onreadystatechange = function(){
					_onStateChange(xhr,success,failure);
				};
				xhr.open(method,url,async);
				if(method == 'POST'){
					xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
				}
				xhr.send(data);
				return xhr;
			}
			function _onStateChange(xhr,success,failure){
				if(xhr.readyState == 4){
					var s = xhr.status;
					if(s>= 200 && s < 300){
						success(xhr);
					}else{
						failure(xhr);
					}
				}else{}
			}
			return {request:request};  
}
		
		//去空格
		Utils.trim = function(s){
			return s.replace(/(^\s*)|(\s*$)/g, "");
		}
	
		//字符串是否为正整数
		Utils.IsPositiveNum = function(s){
			if(s!=null){
				var r,re;
				re = /\d*/i; //\d表示数字,*表示匹配多个数字
				r = s.match(re);
				return (r==s)?true:false;
			}
			return false;
		}
		
		//字符串是否为数字
		Utils.IsNum = function(s){
			if (s!=null && s!="")
			{
				return !isNaN(s);
			}
			return false;
		}

	//wgs84转gcj02
	Utils.gps84_To_Gcj02 = function(lon,lat){
		
		var pi = 3.1415926535897932384626;
		var a = 6378245.0;
		var ee = 0.00669342162296594323;

		var dLat = transformLat(lon - 105.0, lat - 35.0);
		var dLon = transformLon(lon - 105.0, lat - 35.0);
		var radLat = lat / 180.0 * pi;
		var magic = Math.sin(radLat);
		magic = 1 - ee * magic * magic;
		var sqrtMagic = Math.sqrt(magic);
		dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
		dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
		var mgLat = lat + dLat;
		var mgLon = lon + dLon;
		return [mgLon, mgLat];

		function transformLon(x,y){
			var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
			ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
			ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
			ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0
					* pi)) * 2.0 / 3.0;
			return ret;
		}

		function transformLat(x,y){
			var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y
			+ 0.2 * Math.sqrt(Math.abs(x));
			ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
			ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
			ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
			return ret;
		}
	}

	//gcj02转wgs84
	Utils.gcj02_To_Gps84 = function(lon,lat){
		
		var pi = 3.1415926535897932384626;
		var a = 6378245.0;
		var ee = 0.00669342162296594323;
		
		var gps = transform(lon,lat);
		var lontitude = lon * 2 - gps[0];
		var latitude = lat * 2 - gps[1];
		return [lontitude,latitude];

		function transform(lon,lat) {
			var dLat = transformLat(lon - 105.0, lat - 35.0);
			var dLon = transformLon(lon - 105.0, lat - 35.0);
			var radLat = lat / 180.0 * pi;
			var magic = Math.sin(radLat);
			magic = 1 - ee * magic * magic;
			var sqrtMagic = Math.sqrt(magic);
			dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
			dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
			var mgLat = lat + dLat;
			var mgLon = lon + dLon;
			return [mgLon,mgLat];
		}
		
		function transformLon(x,y){
			var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
			ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
			ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
			ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0
					* pi)) * 2.0 / 3.0;
			return ret;
		}

		function transformLat(x,y){
			var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y
			+ 0.2 * Math.sqrt(Math.abs(x));
			ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
			ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
			ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
			return ret;
		}
	}
    //坐标投影转换，参数：[lon, lat]
	Utils.transformPoint  = function (pnt) {
//        var clientGISKind = window.gisAdapter.gisType;
        if (clientGISKind =="OFFLINEGIS") {
            var coord = ol.proj.transform(ZT.Utils.gps84_To_Gcj02(pnt[0], pnt[1]), 'EPSG:4326', 'EPSG:3857');
            return coord;
        }
        else {
            return pnt;
        }
    }
	
    //坐标投影转换，参数：[lon, lat]
	Utils.transformOffToESPG  = function (pnt) {
      //  var clientGISKind = window.gisAdapter.gisType;
        if (clientGISKind =="OFFLINEGIS") {
			var coord = ol.proj.transform([pnt[0], pnt[1]], 'EPSG:3857', 'EPSG:4326');
			coord = ZT.Utils.gcj02_To_Gps84(coord[0],coord[1]);
            return coord;
        }
        else {
            return pnt;
        }
    }
	
    //线宽度转换espg->offline
	Utils.transformLineWidth  = function (lineWidth) {
      //  var clientGISKind = window.gisAdapter.gisType;
        if (clientGISKind =="OFFLINEGIS") {
        	lineWidth = lineWidth/ 0.224816*25009.068;
            return lineWidth;
        }
        else {
            return lineWidth;
        }
    }

	//polygon offline->espg
	Utils.getPolygonWkt = function (wkt) {
	    if (clientGISKind =="OFFLINEGIS") {
        var format = new ol.format.WKT();
        var feature = format.readFeature(wkt);
        var geom = feature.getGeometry();
        var temp = geom.getCoordinates();
        var  pntList= temp[0];
        var  pntListNew = [];
        for(var i= 0;i<pntList.length;i++){
        	var point = ZT.Utils.transformOffToESPG(pntList[i]);
        	pntListNew.push(point);
        }
        var pntlistString = ZT.Utils.getPolyGonString(pntListNew);
        return pntlistString;
	    }else{
	    	return	wkt;
	    }
    }
})();