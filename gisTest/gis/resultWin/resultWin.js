//@ sourceURL=resultWin.js
//上面这行代码必须加上，不然用用google浏览器调试可能找不到这个js文件

/**
 * @(#)resultWin.js
 * 
 * @description:选择工具查询结果
 * @author: 尹飞 2019/09/27
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */
var resultWinControl = null;
$(function () {
	resultWinControl = new ResultWinControl();
});
var ResultWinControl = function(){
	this.initialize.apply(this, arguments);
}

ResultWinControl.prototype ={
	domObj : null,
	
	//当前页标签
	groupList_curPageLabel:null,
	
	//总页数标签
	groupList_pagesLabel:null,	
	
	//总数标签
	totalCountText:null,
	
	//上页按钮
	groupList_prePageBtn :null,		
	
	//下页按钮
	groupList_nextPageBtn :null,	
	
	//确定
	groupList_okBtn : null,

	//清除
	groupList_cancelBtn : null,
	
	//结果框
	listResultWinObj : null,
	
	//查询结果集
	pus : [],

	//框选结果集
	drawPus : [],
	
	//关闭按钮点击后各个功能的回调函数
	close_callback : null,
	
	//确定按钮点击后各个功能的回调函数
	ok_callback : null,
	
	//取消按钮点击后各个功能的回调函数
	cancel_callback : null,

	initialize : function(){

		this.domObj = $('#yanpanUnionResultWin_copy');

		//当前页标签
		this.groupList_curPageLabel = this.domObj.find('span[aliasid="groupList_curPageLabel"]');	
	
		//总页数标签
		this.groupList_pagesLabel = this.domObj.find('span[aliasid="groupList_pagesLabel"]');
		
		//总数标签
		this.totalCountText = this.domObj.find('span[aliasid="totalCountText"]');	

		//上页按钮
		this.groupList_prePageBtn = this.domObj.find('p[aliasid="groupList_prePageBtn"]');
		
		//下页按钮
		this.groupList_nextPageBtn = this.domObj.find('p[aliasid="groupList_nextPageBtn"]');
		
		//结果框
		this.listResultWinObj =  this.domObj.find("#listResultWin"); 
		
		//确定
		this.groupList_okBtn = this.domObj.find('div[aliasid="groupList_okBtn"]');
		//清除
		this.groupList_cancelBtn = this.domObj.find('div[aliasid="groupList_cancelBtn"]');
		
		//框选按钮
		this.chooseAreaList = this.domObj.find('#tb_chooseArea');
		
		//设置设备框选结果框位置
		this.domObj.css({
			"left" : "500px",
			"top" : window.innerHeight-parent.$(".DWHeader").height()-this.domObj.height()+this.domObj.find(".plusArea").height()-30+"px",
		});
		
		var _self = this;
		//关闭按钮
		var closeBtnObj = this.domObj.find('.windowIcon04');
		closeBtnObj.unbind("click");
		closeBtnObj.click(function(){
			if(typeof(_self.close_callback) == "function"){
				_self.close_callback();
				// 清除注册事件
		    	delete this.close_callback;
			}
			_self.closeSchRsWin();
			drawControl.clear();
		});
		//框选按钮点击事件
		_self.chooseAreaList.find("dd").each(function(){
			$(this).bind('click',function(){
				var op = $(this).attr('_type');
				if(op == "Clear"){
					drawControl.clear();
					_self.clear();
				} else {
					_self.closeSchRsWin();
					if (typeof _self.searchType != 'undefined' && (_self.searchType.indexOf("policeOfficer") > -1 || _self.searchType.indexOf("policeCar") > -1)) {
						drawControl.addDrawInteraction(op, "",  _self.searchType);
					} else {
						drawControl.addDrawInteractionForTs(op);
					}
				}
			});
		});
		
		//拖拽
		$('#yanpanUnionResultWin_copy').draggable({
			handle:'#yanpanUnionResultWinTittleDiv'
		});
	},
	spatialQuery: function (type, extent,searchType) {
		var _self = this;
		var url;
		var data = "";
		if (typeof searchType != 'undefined' && (searchType.indexOf("policeOfficer") > -1 || searchType.indexOf("policeCar") > -1)) {
			data = "pointType=" + searchType;
			_self.searchType = searchType;
		} else {
			data = "pointType=" + _self.getPonitType().join(",");
		}
		if(type){
			if(type == "Box"){ //矩形框选
				if (typeof searchType != 'undefined' && (searchType.indexOf("policeOfficer") > -1 || searchType.indexOf("policeCar") > -1)) {
					url = ctx + "/police/queryDeviceByRect.do";
					data = data + "&extent=" + extent;
				} else {
					url = ctx + "/gis/queryDeviceByRect.do";
					data = data + "&extent=" + extent;
				}
			} else if(type == "Circle"){ //圆形框选
				if (typeof searchType != 'undefined' && (searchType.indexOf("policeOfficer") > -1 || searchType.indexOf("policeCar") > -1)) {
					url = ctx + "/police/queryDeviceByCircle.do";
					data = data + "&extent=" + extent;
				} else {
					url = ctx + "/gis/queryDeviceByCircle.do";
					data = data + "&extent=" + extent;
				}
			} else if(type == "Polygon"){ //多边形框选
				var transform = new ol.format.WKT();
				var rect = transform.readGeometry(extent).getExtent();
				if (typeof searchType != 'undefined' && (searchType.indexOf("policeOfficer") > -1 || searchType.indexOf("policeCar") > -1)) {
					url = ctx + "/police/queryDeviceByPolygonAndExtent.do";
					data = data + "&extent=" + rect.toString() + "&polygon=" + extent;
				} else {
					url = ctx + "/gis/queryDeviceByPolygonAndExtent.do";
					data = data + "&extent=" + rect.toString() + "&polygon=" + extent;
				}
			} else if(type == "LineString"){ //线周边框选
				url = ctx + "/gis/getlinebuffer.do";
			}
		}
		ZT.Utils.Ajax().request(url, {
			data: data,
			success: function (resobj) {
				var content = eval("(" + resobj.response + ")");
				_self.equipResultAll(content.resp);
			},
		});
	},

	spatialQueryForTs: function (type, extent,searchType) {
		var _self = this;
		var url;
		//var data = "pointType=" + _self.getPonitType().join(",");
		var params = $("#searchDeviceResultParam").serializeJson();
		if (typeof searchType != 'undefined' && (searchType.indexOf("policeOfficer") > -1 || searchType.indexOf("policeCar") > -1)) {
			_self.searchType = searchType;
		}
		if(params.deviceTypes==""){
			params.deviceTypes = "videoSurveillance,electronicPolice,intelligentEntry"
		}
		var devicetypes = params.deviceTypes.split(",");
		var data = {};
		for (var i = 0; i <devicetypes.length ; i++) {
			data[devicetypes[i]] = "2";
		}

		if(type){
			if(type == "Box"){ //矩形框选
				url = ctx + "/gis/queryDeviceByRect.do";
				//data = data + "&extent=" + extent;
			} else if(type == "Circle"){ //圆形框选
				url = ctx + "/gis/queryDeviceByCircle.do";
				//data = data + "&extent=" + extent;
			} else if(type == "Polygon"){ //多边形框选
				url = ctx + "/gis/queryDeviceByPolygonAndExtent.do";
				var transform = new ol.format.WKT();
				var rect = transform.readGeometry(extent).getExtent();
				//data = data + "&extent=" + rect.toString() + "&polygon=" + extent;
				$.ajax({
					url: url,
					type: "post",
					traditional:true,
					data:  {"pointParam": JSON.stringify(data), "extent": rect.toString(), "polygon": extent},
					success: function (resobj) {
						_self.equipResultAll(resobj.resp);
					}
				});
				return;
			} else if(type == "LineString"){ //线周边框选
				url = ctx + "/gis/getlinebuffer.do";
			}
		}
		$.ajax({
			url: url,
			type: "post",
			traditional:true,
			data:  {"pointParam": JSON.stringify(data), "extent": extent},
			success: function (resobj) {
				_self.equipResultAll(resobj.resp);
			}
		});
		/*ZT.Utils.Ajax().request(url, {
			data: data,
			method: 'POST',
			success: function (resobj) {
				var content = eval("(" + resobj.response + ")");
				_self.equipResultAll(content.resp);
			},
		});*/
	},

	/**
	 * 获取地图上显示的设备的设备类型
	 */
	getPonitType: function () {
		pointType = [];
		$(function () {
			$("#deviceTypesList").find(".active").each(function (k) {
				if (k < $("#deviceTypesList").find(".active").length) {
					pointType.push($(this).attr("data-type"));
				}
			});
		});
		return pointType;
	},
	/**
	 * 地图选择设备
	 * @param setsList
	 */
	equipResultAll : function(setsList){
		var _self=this;
		_self.domObj.show();
		//暂时屏蔽，然后如果框选的结果要能累加的话再打开
		/*if(setsList){
			for(var i=0;i<setsList.length;i++){
				var flog = false;
				for(var j=0;j<_self.pus.length;j++){
					if(_self.pus[j].pointId == setsList[i].pointId){
						flog = true;
					}
				}
				if(!flog){
					_self.pus.push(setsList[i]);
				}
			}
		}*/
		_self.pus = [].concat(setsList);
		_self.equipResultByPage(1,10);
	},

	//结果框中移除设备
	removeResult:function(setsList){
		var _self=this;
		var temp = [];
		for(var i=0;i<_self.pus.length;i++){
			var flog = false;
			for(var j=0;j<setsList.length;j++){
				if(_self.pus[i].pointId == setsList[j].id || _self.pus[i].id == setsList[j].id){
					flog = true;
				}
			}
			if(!flog){
				temp.push(_self.pus[i]);
			}
		}
		_self.pus = [].concat(temp);
		_self.equipResultByPage(1,10);
	},
    //结果框中添加设备
	addResult:function(setsList){
		var _self=this;
		var temp = [];
		if(setsList){
			for(var i=0;i<setsList.length;i++){
				var flog = false;
				for(var j=0;j<_self.pus.length;j++){
					if(_self.pus[j].pointId == setsList[i].pointId){
						flog = true;
					}
				}
				if(!flog){
					temp.push(setsList[i]);
				}
			}
		}
		_self.pus = temp.concat(_self.pus);
		_self.equipResultByPage(1,10);
	},
	
	equipResultByPage: function(curPage,pageSize){
		var _self = this;
		var flog = 0;
		var totalCount = _self.pus.length;
		var equipmentList = _self.pus.slice((curPage - 1) * pageSize,
				curPage * pageSize);
		
		var resambleHtml = '';
		if(equipmentList.length ==0){
			var resambleHtml = '';
			resambleHtml+='<li> ';
			resambleHtml+=' <p  hidefocus="true" style="text-indent:10px;text-align: center;margin-left: -18px;width: 100%;height: 300px;line-height: 300px;"> ';
			resambleHtml+= "该范围内没有设备";
			resambleHtml+=' </p> ';
			resambleHtml+='</li> ';
			this.listResultWinObj.html(resambleHtml);
			this.domObj.show();

			this.totalCountText.html(0);

			this.groupList_curPageLabel.html(0);
			//总页数标签
			this.groupList_pagesLabel.html(0);	
			//在窗口show之前，根据操作类型判断按钮呈现样式
			this.domObj.find(".governBtns #ok").html("确&nbsp;&nbsp;定");
			this.groupList_cancelBtn.show();
		}else{

			for(var i=0;i<equipmentList.length;i++){
				var tmpObj = equipmentList[i];
				tmpObj.name = (tmpObj.NAME || tmpObj.name);
				tmpObj.pointId = (tmpObj.POINTID || tmpObj.pointId);
				tmpObj.lon = (tmpObj.LON || tmpObj.lon);
				tmpObj.lat = (tmpObj.LAT || tmpObj.lat);
				tmpObj.regionId = (tmpObj.REGIONID || tmpObj.regionId);
				tmpObj.pointId = (tmpObj.POINTID || tmpObj.pointId);
				tmpObj.state = (tmpObj.STATE || tmpObj.state);
				tmpObj.devType = (tmpObj.DEVTYPE || tmpObj.devType);
				if(undefined==tmpObj.devType&&undefined!=tmpObj.type){
					if(tmpObj.type=="VAN"){
						tmpObj.devType=125
					}else if(tmpObj.type=="TGS"){
						tmpObj.devType=120
					}
				}

				resambleHtml+='<dl id="equimentList'+i+'" ';
				resambleHtml+='cname="'+tmpObj.name+'"   pointId="'+tmpObj.pointId+'" lon="'+tmpObj.lon+'"  lat="'+tmpObj.lat+'"  regionId="'+tmpObj.regionId+'"   puid="'+tmpObj.pointId+'" cur="'+i+'">';
				// 在线离线背景图标
				if(!tmpObj.state || tmpObj.state == "0" || tmpObj.state == "113"){
					//0:采集杆设备;1:社会资源点;120:卡口;123:ETC围栏;124:WIFI围栏;117:报警箱;121:电子围栏;119:IVS人脸识别;132:IPC摄像机
					if(tmpObj.devType == "120" ){//120：卡口
						resambleHtml+=' <dt style="margin-left: 0px;"  class="electronicPolice_off"> </dt> ';
					} else if(tmpObj.devType == "125"){   //125：VAN车辆分析前端
						resambleHtml+=' <dt style="margin-left: 0px;"  class="intelligentEntry_off"> </dt>';
					}else if(tmpObj.devType == "policeOfficer"){
						resambleHtml+=' <dt style="margin-left: 0px;"  class="policeOfficer_off"> </dt>';
					}else if(tmpObj.devType == "policeCar"){
						resambleHtml+=' <dt style="margin-left: 0px;"  class="policeCar_off"> </dt>';
					}else if(tmpObj.devType == "drivingGuidance"){
						resambleHtml+=' <dt style="margin-left: 0px;"  class="drivingGuidance_off"> </dt>';
					}else if(tmpObj.devType == "888"){//信号机
						resambleHtml+=' <dt style="margin-left: 0px;"  class="signalControl_off"> </dt>';
					}else if(tmpObj.devType == "146"){//高空瞭望
						resambleHtml+=' <dt style="margin-left: 0px;"  class="highSkyDetector_off"> </dt>';
					}else if(tmpObj.devType == "143"){//违章停车
						resambleHtml+=' <dt style="margin-left: 0px;"  class="illegalParking_off"> </dt>';
					}else if(tmpObj.devType == "148"){//视频检测
						resambleHtml+=' <dt style="margin-left: 0px;"  class="videoDetection_off"> </dt>';
					}else if(tmpObj.devType == "147"){//微波检测
						resambleHtml+=' <dt style="margin-left: 0px;"  class="microwaveDetection_off"> </dt>';
					}else if(tmpObj.devType == "144"){//违法鸣笛
						resambleHtml+=' <dt style="margin-left: 0px;"  class="illegalWhistling_off"> </dt>';
					}else if(tmpObj.devType == "142"){//不礼让行人
						resambleHtml+=' <dt style="margin-left: 0px;"  class="notComityPedestrian_off"> </dt>';
					}else if(tmpObj.devType == "149"){//行人关爱
						resambleHtml+=' <dt style="margin-left: 0px;"  class="pedestrianCare_off"> </dt>';
					}else if(tmpObj.devType == "145"){//行人闯红灯
						resambleHtml+=' <dt style="margin-left: 0px;"  class="peopleRedLight_off"> </dt>';
					}else if(tmpObj.devType == "150"){//可变车道
						resambleHtml+=' <dt style="margin-left: 0px;"  class="variableLane_off"> </dt>';
					}else {	//117:报警箱、132:IPC摄像机 及其他
						resambleHtml+=' <dt style="margin-left: 0px;" class="DEFAULT_off"> </dt>';
					}
				}else{
					if(tmpObj.devType == "120"){//120：卡口
						resambleHtml+=' <dt  style="margin-left: 0px;" class="electronicPolice_on"> </dt>';
					}else if(tmpObj.devType == "125"){  //125：VAN车辆分析前端
						resambleHtml+=' <dt  style="margin-left: 0px;" class="intelligentEntry_on"> </dt> ';
					}else if(tmpObj.devType == "policeOfficer"){
						resambleHtml+=' <dt style="margin-left: 0px;"  class="policeOfficer_on"> </dt>';
					}else if(tmpObj.devType == "policeCar"){
						resambleHtml+=' <dt style="margin-left: 0px;"  class="policeCar_on"> </dt>';
					}else if(tmpObj.devType == "drivingGuidance"){
						resambleHtml+=' <dt style="margin-left: 0px;"  class="drivingGuidance_on"> </dt>';
					}else if(tmpObj.devType == "888"){//信号机
						resambleHtml+=' <dt style="margin-left: 0px;"  class="signalControl_on"> </dt>';
					}else if(tmpObj.devType == "146"){//高空瞭望
						resambleHtml+=' <dt style="margin-left: 0px;"  class="highSkyDetector_on"> </dt>';
					}else if(tmpObj.devType == "143"){//违章停车
						resambleHtml+=' <dt style="margin-left: 0px;"  class="illegalParking_on"> </dt>';
					}else if(tmpObj.devType == "148"){//视频检测
						resambleHtml+=' <dt style="margin-left: 0px;"  class="videoDetection_on"> </dt>';
					}else if(tmpObj.devType == "147"){//微波检测
						resambleHtml+=' <dt style="margin-left: 0px;"  class="microwaveDetection_on"> </dt>';
					}else if(tmpObj.devType == "144"){//违法鸣笛
						resambleHtml+=' <dt style="margin-left: 0px;"  class="illegalWhistling_on"> </dt>';
					}else if(tmpObj.devType == "142"){//不礼让行人
						resambleHtml+=' <dt style="margin-left: 0px;"  class="notComityPedestrian_on"> </dt>';
					}else if(tmpObj.devType == "149"){//行人关爱
						resambleHtml+=' <dt style="margin-left: 0px;"  class="pedestrianCare_on"> </dt>';
					}else if(tmpObj.devType == "145"){//行人闯红灯
						resambleHtml+=' <dt style="margin-left: 0px;"  class="peopleRedLight_on"> </dt>';
					}else if(tmpObj.devType == "150"){//可变车道
						resambleHtml+=' <dt style="margin-left: 0px;"  class="variableLane_on"> </dt>';
					}else {	//117:报警箱、132:IPC摄像机 及其他
						resambleHtml+=' <dt  style="margin-left: 0px;" class="DEFAULT_on"> </dt>';
					}
				}
				resambleHtml+=' <dd class="fr"><p  id="equipListSelect_'+i+'" cur="'+i+'" puid="'+tmpObj.pointId+'" regionId="'+tmpObj.regionId+'"  class="CheckBoxStyle01 CheckBoxStyle01_on"></p></dd>';
				resambleHtml+='<dd>'+ tmpObj.name+'</dd>';
				resambleHtml+='</dl> ';
			}
			_self.listResultWinObj.html(resambleHtml);
			for(var i=0;i<equipmentList.length;i++){
				$('#equipListSelect_'+i).data("data",equipmentList[i]);
			}
			 
			this.domObj.find(".governBtns #ok").html("确&nbsp;&nbsp;定");
			this.groupList_cancelBtn.show();
			
			this.domObj.show();
			if(totalCount % pageSize ==0 ){
				totalPage = parseInt(totalCount/pageSize);
			}else{
				totalPage = parseInt(totalCount/pageSize) + 1;
			}

			//当前页标签
			this.groupList_curPageLabel.html(curPage);
			//总页数标签
			this.groupList_pagesLabel.html(totalPage);
			//总个数标签
			this.totalCountText.html(totalCount);
			//点击某一行定位
			for(var i=0;i<equipmentList.length;i++){
				$('#equimentList'+i).click(function(){
					var tmp_self = $(this);
					var tmpLon = tmp_self.attr("lon");
					var tmpLat = tmp_self.attr("lat");
					var pointId = tmp_self.attr("pointId");

					if(tmpLon!="null"&&tmpLon!=null && tmpLon!=0 && tmpLon!= "undefined"
						&& tmpLat!="null"&&tmpLat!=null && tmpLat!=0 && tmpLat!= "undefined"){
						ZT.Utils.animationMove(null,[tmpLon*1,tmpLat*1]);
						if(typeof flashControl != "undefined" && flashControl != null){
							flashControl.circleRipple(tmpLon*1,tmpLat*1,pointId+"_1","blue","WGS84");
						}
					}else{
						tipsInfoShowOrHide("该卡口没有配坐标。");
					}
				});
			}
			//勾选某一行
			for(var i=0;i<equipmentList.length;i++){
				$('#equipListSelect_'+i).click(function(evt){
					evt.stopPropagation();
					evt.cancelBubble = true;
					var $this = $(this);
					if($(this).hasClass("CheckBoxStyle01_on")){
						$(this).removeClass("CheckBoxStyle01_on");
						for(var j in _self.pus){
							if($this.attr("puid") == _self.pus[j].pointId)
								_self.pus.splice(j,1);
						}
					} else {
						$(this).addClass("CheckBoxStyle01_on");
						_self.pus.push($(this).data("data"));
					}
				});
			}

			//上一页
			this.groupList_prePageBtn.unbind("click");
			this.groupList_prePageBtn.click(function(){
				if(curPage==1){
					return;
				}else{
					_self.equipResultByPage(curPage-1,pageSize);
				}
			});

			//下一页
			this.groupList_nextPageBtn.unbind("click");
			this.groupList_nextPageBtn.click(function(){
				if(curPage==totalPage){
					return;
				}else{
					_self.equipResultByPage(curPage+1,pageSize);
				}
			});
		}
		//取消
		this.groupList_cancelBtn.unbind("click").click(function(){
			if(typeof(_self.cancel_callback) == "function"){
				_self.cancel_callback();
			}
			drawControl.clear();
			if(flashControl){
				flashControl.clearAll();
			}
			_self.clear();
			_self.closeSchRsWin();
		});
		//确定
		this.groupList_okBtn.unbind("click");
		this.groupList_okBtn.click(function(){
			var pus = _self.pus;
			if(typeof(_self.ok_callback) == "function"){
				_self.ok_callback([].concat(pus));
			}
			//_self.closeSchRsWin();
			drawControl.clear();
		});
	},
	resize : function(){
		var _self = this;
		var difHeight = _self.domObj.height() - $("body").height();
		if (difHeight > 0) {
			_self.domObj.find(".GIS_PopupsContent").height(_self.domObj.find(".GIS_PopupsContent").height() - difHeight);
		}
	},
	/**
    关掉搜索结果框
    */
    closeSchRsWin : function(){
    	var _self = this;
    	this.domObj.hide();
    	if (typeof flashControl != 'undefined' && flashControl) {
			flashControl.clearAll();
		}
    },
    /**
     打开搜索结果框
     */
    showSchRsWin : function(){
        var _self = this;
        this.domObj.show();
    },
	//隐藏关闭按钮
    hideCloseBtn : function(){
		this.domObj.find(".PopUpClose02").hide();
	},
    setOnOk : function(callback){
    	this.ok_callback = callback;
    },
    setOnCancel : function(callback){
    	this.cancel_callback = callback;
    },
	clear:function(){
    	this.pus = [];
		this.listResultWinObj.html("");
		//当前页标签
		this.groupList_curPageLabel.html(0);
		//总页数标签
		this.groupList_pagesLabel.html(0);
		//总个数标签
		this.totalCountText.html(0);
	},
	
	CLASS_NAME : "ResultWinControl"
}
