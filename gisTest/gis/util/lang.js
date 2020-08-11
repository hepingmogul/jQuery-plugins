/**
 * @(#)lang.js
 * 
 * @description: 国际化
 * @author:  
 * @version: 1.0
 * @modify: MODIFIER'S NAME YYYY/MM/DD 修改内容简述
 * @Copyright: 版权信息
 */

var mapModuleLangs = new Array();  
mapModuleLangs["zh_CN"]=new Array();  
mapModuleLangs["en"]=new Array();  
//attributequery.js
mapModuleLangs["zh_CN"]["attributequery.keywords"] = "请输入关键字";
mapModuleLangs["en"]["attributequery.keywords"] = "Please enter the key words";
mapModuleLangs["zh_CN"]["attributequery.gisserver"] = "GIS服务器已停";
mapModuleLangs["en"]["attributequery.gisserver"] = "The GIS server has been stopped";
mapModuleLangs["zh_CN"]["attributequery.noresults"] = "无符合条件的结果";
mapModuleLangs["en"]["attributequery.noresults"] = "No matching results";
//attriSearchShot.js
mapModuleLangs["zh_CN"]["attriSearchShot.roadname"] = "道路名称";
mapModuleLangs["en"]["attriSearchShot.roadname"] = "Road Name";
mapModuleLangs["zh_CN"]["attriSearchShot.searchdistance"] = "搜索距离";
mapModuleLangs["en"]["attriSearchShot.searchdistance"] = "Distance";
mapModuleLangs["zh_CN"]["attriSearchShot.meter"] = "米";
mapModuleLangs["en"]["attriSearchShot.meter"] = "meters";
mapModuleLangs["zh_CN"]["attriSearchShot.searchbyroadname"] = "查询统计-按道路名称查询";
mapModuleLangs["en"]["attriSearchShot.searchbyroadname"] = "Results-Search by road name";
mapModuleLangs["zh_CN"]["attriSearchShot.minlon"] = "最小经度";
mapModuleLangs["en"]["attriSearchShot.minlon"] = "Min Longitude";
mapModuleLangs["zh_CN"]["attriSearchShot.maxlon"] = "最大经度";
mapModuleLangs["en"]["attriSearchShot.maxlon"] = "Max Longitude";
mapModuleLangs["zh_CN"]["attriSearchShot.minlat"] = "最小纬度";
mapModuleLangs["en"]["attriSearchShot.minlat"] = "Min Latitude";
mapModuleLangs["zh_CN"]["attriSearchShot.maxlat"] = "最大纬度";
mapModuleLangs["en"]["attriSearchShot.maxlat"] = "Max Latitude";
mapModuleLangs["zh_CN"]["attriSearchShot.searchbylonlat"] = "查询统计-按经纬度查询";
mapModuleLangs["en"]["attriSearchShot.searchbylonlat"] = "Results-Search by LonLat";
mapModuleLangs["zh_CN"]["attriSearchShot.devicename"] = "设备名称";
mapModuleLangs["en"]["attriSearchShot.devicename"] = "Device Name";
mapModuleLangs["zh_CN"]["attriSearchShot.searchbydevicename"] = "查询统计-按设备名称查询";
mapModuleLangs["en"]["attriSearchShot.searchbydevicename"] = "Results-Search by device name";
mapModuleLangs["zh_CN"]["attriSearchShot.searchgeoinformation"] = "地理查询";
mapModuleLangs["en"]["attriSearchShot.searchgeoinformation"] = "Geo Query";
mapModuleLangs["zh_CN"]["attriSearchShot.keyword"] = "关键字";
mapModuleLangs["en"]["attriSearchShot.keyword"] = "keyword";
mapModuleLangs["zh_CN"]["attriSearchShot.enterkeyword"] = "请输入关键字";
mapModuleLangs["en"]["attriSearchShot.enterkeyword"] = "Please enter a keyword";
mapModuleLangs["zh_CN"]["attriSearchShot.keywordnospace"] = "关键字中不能包含空格或特殊符号";
mapModuleLangs["en"]["attriSearchShot.keywordnospace"] = "The keyword can not contain spaces or special characters";

mapModuleLangs["zh_CN"]["attriSearchShot.nodevicelist"] = "没有获取到设备列表";
mapModuleLangs["en"]["attriSearchShot.nodevicelist"] = "No device list found";
mapModuleLangs["zh_CN"]["attriSearchShot.enterroadname"] = "请输入道路名";
mapModuleLangs["en"]["attriSearchShot.enterroadname"] = "Please enter the road name";
mapModuleLangs["zh_CN"]["attriSearchShot.roadnospace"] = "道路名中不能包含空格或特殊符号";
mapModuleLangs["en"]["attriSearchShot.roadnospace"] = "Road name cant not contain spaces or special characters";
mapModuleLangs["zh_CN"]["attriSearchShot.enterdistance"] = "请输入搜索距离";
mapModuleLangs["en"]["attriSearchShot.enterdistance"] = "Please  enter the distance";
mapModuleLangs["zh_CN"]["attriSearchShot.distanceisdigit"] = "搜索距离必须是数字";
mapModuleLangs["en"]["attriSearchShot.distanceisdigit"] = "The Distance must be a digit";
mapModuleLangs["zh_CN"]["attriSearchShot.distancegreaterzero"] = "搜索距离必须大于零";
mapModuleLangs["en"]["attriSearchShot.distancegreaterzero"] = "The Distance must be greater than zero";
mapModuleLangs["zh_CN"]["attriSearchShot.distanceislarge"] = "搜索距离过大";
mapModuleLangs["en"]["attriSearchShot.distanceislarge"] = "The Distance is too large";
mapModuleLangs["zh_CN"]["attriSearchShot.distanceisinteger"] = "搜索距离必须是整数";
mapModuleLangs["en"]["attriSearchShot.distanceisinteger"] = "The Distance must be an integer";
mapModuleLangs["zh_CN"]["attriSearchShot.enterlonlatextent"] = "请输入经纬度范围";
mapModuleLangs["en"]["attriSearchShot.enterlonlatextent"] = "Please enter the latitude and longitude of the extent";
mapModuleLangs["zh_CN"]["attriSearchShot.lonlatisdigit"] = "经纬度必须是数字";
mapModuleLangs["en"]["attriSearchShot.lonlatisdigit"] = "LonLat must be a digit";
mapModuleLangs["zh_CN"]["attriSearchShot.lonlatextent"] = "经纬度范围必须在-180至180，-90至90之间";
mapModuleLangs["en"]["attriSearchShot.lonlatextent"] = "The longitude and latitude range must be between -180 to 180, -90 to 90";
mapModuleLangs["zh_CN"]["attriSearchShot.minlonlessmaxlon"] = "最小经度不能大于最大经度";
mapModuleLangs["en"]["attriSearchShot.minlonlessmaxlon"] = "The minimum longitude must be less than the maximum latitude";
mapModuleLangs["zh_CN"]["attriSearchShot.minlatlessmaxlat"] = "最小纬度不能大于最大纬度";
mapModuleLangs["en"]["attriSearchShot.minlatlessmaxlat"] = "The minimum latitude must be less than the maximum latitude";
mapModuleLangs["zh_CN"]["attriSearchShot.enterdevicename"] = "请输入设备名称";
mapModuleLangs["en"]["attriSearchShot.enterdevicename"] = "Please enter the device name";
mapModuleLangs["zh_CN"]["attriSearchShot.devicenospace"] = "设备名称中不能包含空格或特殊符号";
mapModuleLangs["en"]["attriSearchShot.devicenospace"] = "Device name cant not contain spaces or special characters";
mapModuleLangs["zh_CN"]["attriSearchShot.gisstop"] = "GIS服务器意外停止";
mapModuleLangs["en"]["attriSearchShot.gisstop"] = "The GIS server has been stopped unexpectedly";
mapModuleLangs["zh_CN"]["attriSearchShot.noresults"] = "无符合条件的结果";
mapModuleLangs["en"]["attriSearchShot.noresults"] = "No matching results";
mapModuleLangs["zh_CN"]["attriSearchShot.results"] = "查询结果";
mapModuleLangs["en"]["attriSearchShot.results"] = "Results";
mapModuleLangs["zh_CN"]["attriSearchShot.nocoordinate"] = "该设备没有设置坐标";
mapModuleLangs["en"]["attriSearchShot.nocoordinate"] = "No Coordinate is set at the device";
mapModuleLangs["zh_CN"]["attriSearchKakou.searchbycarplate"] = "轨迹查询-按号牌号码查询";
mapModuleLangs["en"]["attriSearchKakou.searchbycarplate"] = "Results-Search by car plate";
mapModuleLangs["zh_CN"]["attriSearchKakou.carImageWin"] = "过车图像";
mapModuleLangs["en"]["attriSearchKakou.carImageWin"] = "Car Image";
mapModuleLangs["zh_CN"]["attriSearchKakou.blackListAlarmInfoWin"] = "黑名单告警信息";
mapModuleLangs["en"]["attriSearchKakou.blackListAlarmInfoWin"] = "BlackList Alarm Info";
mapModuleLangs["zh_CN"]["attriSearchKakou.blackListTrack"] = "实时黑名单告警追踪";
mapModuleLangs["en"]["attriSearchKakou.blackListTrack"] = "Realtime BlackList Alarm Track";
mapModuleLangs["zh_CN"]["toolbar.hphm"] = "号牌号码";
mapModuleLangs["en"]["toolbar.hphm"] = "CarPlate";
mapModuleLangs["zh_CN"]["attriSearchKakou.startime"] = "开始时间";
mapModuleLangs["en"]["attriSearchKakou.startime"] = "Start Time";
mapModuleLangs["zh_CN"]["attriSearchKakou.endime"] = "结束时间";
mapModuleLangs["en"]["attriSearchKakou.endime"] = "End Time";

mapModuleLangs["zh_CN"]["attriSearchShot.pleaseinputpage"] = "请输入页码";
mapModuleLangs["en"]["attriSearchShot.pleaseinputpage"] = "Please enter a page number";
mapModuleLangs["zh_CN"]["attriSearchShot.inputmustbeadigit"] = "输入必须是数字";
mapModuleLangs["en"]["attriSearchShot.inputmustbeadigit"] = "The input must be a digit";

mapModuleLangs["zh_CN"]["attriSearchShot.inputmustbeanpositivenumber"] = "输入必须是正数";
mapModuleLangs["en"]["attriSearchShot.inputmustbeanpositivenumber"] = "The input must be an positive number";

mapModuleLangs["zh_CN"]["attriSearchShot.inputmustbeaninteger"] = "输入必须是整数";
mapModuleLangs["en"]["attriSearchShot.inputmustbeaninteger"] = "The input must be an integer";
mapModuleLangs["zh_CN"]["attriSearchShot.pageisoutofrange"] = "页码超出范围";
mapModuleLangs["en"]["attriSearchShot.pageisoutofrange"] = "The page is out of range";

//gpshistory.js
mapModuleLangs["zh_CN"]["gpshistory.interval"] = "请选择间隔时间";
mapModuleLangs["en"]["gpshistory.interval"] = "Please enter the interval";
//mapModuleLangs["zh_CN"]["gpshistory.policeid"] = "请输入警号";
//mapModuleLangs["en"]["gpshistory.policeid"] = "Please enter the police ID";
mapModuleLangs["zh_CN"]["gpshistory.starttime"] = "请指定开始时间";
mapModuleLangs["en"]["gpshistory.starttime"] = "Please enter the the start time";
mapModuleLangs["zh_CN"]["gpshistory.endtime"] = "请指定结束时间";
mapModuleLangs["en"]["gpshistory.endtime"] = "Please enter the the end time";
mapModuleLangs["zh_CN"]["gpshistory.startearlyend"] = "开始时间不能晚于结束时间";
mapModuleLangs["en"]["gpshistory.startearlyend"] = "Start time can not be later than the end time";
mapModuleLangs["zh_CN"]["gpshistory.gisstop"] = "GIS服务器意外停止";
mapModuleLangs["en"]["gpshistory.gisstop"] = "The GIS server has been stopped unexpectedly";
mapModuleLangs["zh_CN"]["gpshistory.noresults"] = "无符合条件的结果";
mapModuleLangs["en"]["gpshistory.noresults"] = "No matching results";
mapModuleLangs["zh_CN"]["gpshistory.startpoint"] = "起点";
mapModuleLangs["en"]["gpshistory.startpoint"] = "Start";
mapModuleLangs["zh_CN"]["gpshistory.endpoint"] = "终点";
mapModuleLangs["en"]["gpshistory.endpoint"] = "End";
mapModuleLangs["zh_CN"]["gpshistory.lon"] = "经度";
mapModuleLangs["en"]["gpshistory.lon"] = "Longitude";
mapModuleLangs["zh_CN"]["gpshistory.lat"] = "纬度";
mapModuleLangs["en"]["gpshistory.lat"] = "Latitude";
mapModuleLangs["zh_CN"]["gpshistory.speed"] = "速度";
mapModuleLangs["en"]["gpshistory.speed"] = "Speed";
mapModuleLangs["zh_CN"]["gpshistory.time"] = "时间";
mapModuleLangs["en"]["gpshistory.time"] = "Time";
//gpsmonitor.js
mapModuleLangs["zh_CN"]["gpsmonitor.devicename"] = "设备名称";
mapModuleLangs["en"]["gpsmonitor.devicename"] = "Device Name";
mapModuleLangs["zh_CN"]["gpsmonitor.vehicletrace"] = "车载设备跟踪";
mapModuleLangs["en"]["gpsmonitor.vehicletrace"] = "Vehicle device tracking";
mapModuleLangs["zh_CN"]["gpsmonitor.nodevicelist"] = "没有获取到设备列表";
mapModuleLangs["en"]["gpsmonitor.nodevicelist"] = "No device list found";
mapModuleLangs["zh_CN"]["gpsmonitor.gisstop"] = "GIS服务器意外停止";
mapModuleLangs["en"]["gpsmonitor.gisstop"] = "The GIS server has been stopped unexpectedly";
mapModuleLangs["zh_CN"]["gpsmonitor.databasenoresult"] = "数据库中没有移动设备";
mapModuleLangs["en"]["gpsmonitor.databasenoresult"] = "No device list found";
mapModuleLangs["zh_CN"]["gpsmonitor.startgps"] = "点击开启GPS实时跟踪";
mapModuleLangs["en"]["gpsmonitor.startgps"] = "Click to enable GPS tracking";
mapModuleLangs["zh_CN"]["gpsmonitor.historytrace"] = "历史轨迹";
mapModuleLangs["en"]["gpsmonitor.historytrace"] = "History Trace";
mapModuleLangs["zh_CN"]["gpsmonitor.starttime"] = "开始时间";
mapModuleLangs["en"]["gpsmonitor.starttime"] = "Start Time";
mapModuleLangs["zh_CN"]["gpsmonitor.endtime"] = "结束时间";
mapModuleLangs["en"]["gpsmonitor.endtime"] = "End Time";
mapModuleLangs["zh_CN"]["gpsmonitor.interval"] = "间隔时间";
mapModuleLangs["en"]["gpsmonitor.interval"] = "Interval";
mapModuleLangs["zh_CN"]["gpsmonitor.oneoffoursecond"] = "0.25秒";
mapModuleLangs["en"]["gpsmonitor.oneoffoursecond"] = "0.25 seconds";
mapModuleLangs["zh_CN"]["gpsmonitor.halfsecond"] = "0.5秒";
mapModuleLangs["en"]["gpsmonitor.halfsecond"] = "0.5seconds";
mapModuleLangs["zh_CN"]["gpsmonitor.onesecond"] = "1秒";
mapModuleLangs["en"]["gpsmonitor.onesecond"] = "1 second";
mapModuleLangs["zh_CN"]["gpsmonitor.twosecond"] = "2秒";
mapModuleLangs["en"]["gpsmonitor.twosecond"] = "2 seconds";
mapModuleLangs["zh_CN"]["gpsmonitor.threesecond"] = "3秒";
mapModuleLangs["en"]["gpsmonitor.threesecond"] = "3 seconds";
mapModuleLangs["zh_CN"]["gpsmonitor.foursecond"] = "4秒";
mapModuleLangs["en"]["gpsmonitor.foursecond"] = "4 seconds";
mapModuleLangs["zh_CN"]["gpsmonitor.fivesecond"] = "5秒";
mapModuleLangs["en"]["gpsmonitor.fivesecond"] = "5 seconds";
mapModuleLangs["zh_CN"]["gpsmonitor.enterdevicename"] = "请输入设备名称";
mapModuleLangs["en"]["gpsmonitor.enterdevicename"] = "Please enter the device name";
mapModuleLangs["zh_CN"]["gpsmonitor.devicenospace"] = "设备名称中不能包含空格或特殊符号";
mapModuleLangs["en"]["gpsmonitor.devicenospace"] = "Device name can not contain spaces or special characters";
mapModuleLangs["zh_CN"]["gpsmonitor.noresults"] = "无符合条件的结果";
mapModuleLangs["en"]["gpsmonitor.noresults"] = "No matching results";
mapModuleLangs["zh_CN"]["gpsmonitor.selectvehicledevice"] = "请选择车载设备";
mapModuleLangs["en"]["gpsmonitor.selectvehicledevice"] = "Please select the vehicle device";
mapModuleLangs["zh_CN"]["gpsmonitor.gpstracestart"] = "GPS实时跟踪开启";
mapModuleLangs["en"]["gpsmonitor.gpstracestart"] = "GPS tracking has been enabled";
mapModuleLangs["zh_CN"]["gpsmonitor.lon"] = "经度";
mapModuleLangs["en"]["gpsmonitor.lon"] = "Longitude";
mapModuleLangs["zh_CN"]["gpsmonitor.lat"] = "纬度";
mapModuleLangs["en"]["gpsmonitor.lat"] = "Latitude";
mapModuleLangs["zh_CN"]["gpsmonitor.speed"] = "速度";
mapModuleLangs["en"]["gpsmonitor.speed"] = "Speed";
//gpstrack.js
mapModuleLangs["zh_CN"]["gpstrack.enterpoliceid"] = "请输入警号";
mapModuleLangs["en"]["gpstrack.enterpoliceid"] = "Please enter the police ID";
mapModuleLangs["zh_CN"]["gpstrack.noresults"] = "无符合条件的结果";
mapModuleLangs["en"]["gpstrack.noresults"] = "No matching results";
mapModuleLangs["zh_CN"]["gpstrack.start"] = "起点";
mapModuleLangs["en"]["gpstrack.start"] = "Start";
mapModuleLangs["zh_CN"]["gpstrack.end"] = "终点";
mapModuleLangs["en"]["gpstrack.end"] = "End";
//measure.js
mapModuleLangs["zh_CN"]["measure.distance"] = "测量距离";
mapModuleLangs["en"]["measure.distance"] = "Measure Distance";
mapModuleLangs["zh_CN"]["measure.area"] = "测量面积";
mapModuleLangs["en"]["measure.area"] = "Measure Area";
mapModuleLangs["zh_CN"]["measure.results"] = "测量结果";
mapModuleLangs["en"]["measure.results"] = "Results";
//roundcatch.js
mapModuleLangs["zh_CN"]["roundcatch.nodeviceresults"] = "没有获取到设备列表";
mapModuleLangs["en"]["roundcatch.nodeviceresults"] = "No device list found";
mapModuleLangs["zh_CN"]["roundcatch.crimeplace"] = "请选择犯罪点";
mapModuleLangs["en"]["roundcatch.crimeplace"] = "Please select a crime place";
mapModuleLangs["zh_CN"]["roundcatch.roundupradius"] = "请输入围捕半径";
mapModuleLangs["en"]["roundcatch.roundupradius"] = "Please enter the Radiuses";
mapModuleLangs["zh_CN"]["roundcatch.radiusdigit"] = "围捕半径需要输入数字";
mapModuleLangs["en"]["roundcatch.radiusdigit"] = "The round up radius must be a digit";
mapModuleLangs["zh_CN"]["roundcatch.radiusgreaterzero"] = "围捕半径必须大于零";
mapModuleLangs["en"]["roundcatch.radiusgreaterzero"] = "The round up radius must be greater than zero";
mapModuleLangs["zh_CN"]["roundcatch.radiuslarge"] = "围捕半径距离过大";
mapModuleLangs["en"]["roundcatch.radiuslarge"] = "The round up radius distance is too large";
mapModuleLangs["zh_CN"]["roundcatch.radiusinteger"] = "围捕半径需要输入整数";
mapModuleLangs["en"]["roundcatch.radiusinteger"] = "the round up radius must be an integer";
mapModuleLangs["zh_CN"]["roundcatch.secondlargerfirst"] = "二级围捕半径必须比一级围捕半径大";
mapModuleLangs["en"]["roundcatch.secondlargerfirst"] = "The second level radius must be larger than the first level radius";
mapModuleLangs["zh_CN"]["roundcatch.gisstop"] = "GIS服务器意外停止";
mapModuleLangs["en"]["roundcatch.gisstop"] = "The GIS server has been stopped unexpectedly";
mapModuleLangs["zh_CN"]["roundcatch.gisdatabasestop"] = "GIS数据库意外停止";
mapModuleLangs["en"]["roundcatch.gisdatabasestop"] = "The GIS database has been stopped unexpectedly";
mapModuleLangs["zh_CN"]["roundcatch.noresults"] = "无符合条件的结果";
mapModuleLangs["en"]["roundcatch.noresults"] = "No matching results";
mapModuleLangs["zh_CN"]["roundcatch.secondsmall"] = "二级围捕半径设置过小";
mapModuleLangs["en"]["roundcatch.secondsmall"] = "The second level radius is set too small";
mapModuleLangs["zh_CN"]["roundcatch.firstsmall"] = "一级围捕半径设置过小";
mapModuleLangs["en"]["roundcatch.firstsmall"] = "The first level radius is set too small";
//searchStat.js
mapModuleLangs["zh_CN"]["searchStat.searchresults"] = "查询统计";
mapModuleLangs["en"]["searchStat.searchresults"] = "Search Results";
mapModuleLangs["zh_CN"]["searchStat.bylonlatextent"] = "按经纬度范围";
mapModuleLangs["en"]["searchStat.bylonlatextent"] = "query by the range of latitude and longitude";
mapModuleLangs["zh_CN"]["searchStat.bydeviceid"] = "按设备编号";
mapModuleLangs["en"]["searchStat.bydeviceid"] = "Search by device number";
mapModuleLangs["zh_CN"]["searchStat.roadname"] = "道路名称";
mapModuleLangs["en"]["searchStat.roadname"] = "Road Name";
mapModuleLangs["zh_CN"]["searchStat.byroad"] = "按道路";
mapModuleLangs["en"]["searchStat.byroad"] = "Search by road ";
mapModuleLangs["zh_CN"]["searchStat.minlon"] = "最小经度";
mapModuleLangs["en"]["searchStat.minlon"] = "Min longitude";
mapModuleLangs["zh_CN"]["searchStat.maxlon"] = "最大经度";
mapModuleLangs["en"]["searchStat.maxlon"] = "Max longitude";
mapModuleLangs["zh_CN"]["searchStat.minlat"] = "最小纬度";
mapModuleLangs["en"]["searchStat.minlat"] = "Min Latitude";
mapModuleLangs["zh_CN"]["searchStat.maxlat"] = "最大纬度";
mapModuleLangs["en"]["searchStat.maxlat"] = "Max Latitude";
mapModuleLangs["zh_CN"]["searchStat.search"] = "查询";
mapModuleLangs["en"]["searchStat.search"] = "Search";
mapModuleLangs["zh_CN"]["searchStat.searchbylonlat"] = "查询统计-按经纬度查询";
mapModuleLangs["en"]["searchStat.searchbylonlat"] = "Results-Search by LonLat";
mapModuleLangs["zh_CN"]["searchStat.from"] = "从";
mapModuleLangs["en"]["searchStat.from"] = "from";
mapModuleLangs["zh_CN"]["searchStat.to"] = "到";
mapModuleLangs["en"]["searchStat.to"] = "to";
mapModuleLangs["zh_CN"]["searchStat.searchbydeviceid"] = "查询统计-按设备编号查询";
mapModuleLangs["en"]["searchStat.searchbydeviceid"] = "Results-Search by device ID";
mapModuleLangs["zh_CN"]["searchStat.enterroadname"] = "请输入道路名";
mapModuleLangs["en"]["searchStat.enterroadname"] = "please enter the road name";
mapModuleLangs["zh_CN"]["searchStat.nodevicelist"] = "没有获取到设备列表";
mapModuleLangs["en"]["searchStat.nodevicelist"] = "No device list found";
mapModuleLangs["zh_CN"]["searchStat.enterdeviceid"] = "请输入设备编号";
mapModuleLangs["en"]["searchStat.enterdeviceid"] = "please enter the device ID";
mapModuleLangs["zh_CN"]["searchStat.enterlonlatextent"] = "请输入经纬度范围";
mapModuleLangs["en"]["searchStat.enterlonlatextent"] = "Please enter the latitude and longitude of the extent";
mapModuleLangs["zh_CN"]["searchStat.noresults"] = "无符合条件的结果";
mapModuleLangs["en"]["searchStat.noresults"] = "No matching results";
mapModuleLangs["zh_CN"]["searchStat.attriresults"] = "属性查询结果";
mapModuleLangs["en"]["searchStat.attriresults"] = "Attribute Search results";
mapModuleLangs["zh_CN"]["searchStat.devicenocoordinate"] = "该设备没有设置坐标";
mapModuleLangs["en"]["searchStat.devicenocoordinate"] = "No Coordinate is set at the device";
mapModuleLangs["zh_CN"]["searchStat.firstpage"] = "首页";
mapModuleLangs["en"]["searchStat.firstpage"] = "First";
mapModuleLangs["zh_CN"]["searchStat.prepage"] = "上页";
mapModuleLangs["en"]["searchStat.prepage"] = "previous";
mapModuleLangs["zh_CN"]["searchStat.nextpage"] = "下页";
mapModuleLangs["en"]["searchStat.nextpage"] = "Next";
mapModuleLangs["zh_CN"]["searchStat.lastpage"] = "尾页";
mapModuleLangs["en"]["searchStat.lastpage"] = "Last";
mapModuleLangs["zh_CN"]["searchStat.goto"] = "跳转";
mapModuleLangs["en"]["searchStat.goto"] = "Goto";
//toolbar.js
mapModuleLangs["zh_CN"]["toolbar.closemenu"] = "关闭菜单";  
mapModuleLangs["en"]["toolbar.closemenu"] = "Close Menu";
mapModuleLangs["zh_CN"]["toolbar.pan"] = "漫游";  
mapModuleLangs["en"]["toolbar.pan"] = "Pan";
mapModuleLangs["zh_CN"]["toolbar.fullextent"] = "全图";  
mapModuleLangs["en"]["toolbar.fullextent"] = "Full Extent"; 
mapModuleLangs["zh_CN"]["toolbar.zoomin"] = "放大";  
mapModuleLangs["en"]["toolbar.zoomin"] = "Zoom In"; 
mapModuleLangs["zh_CN"]["toolbar.zoomout"] = "缩小";  
mapModuleLangs["en"]["toolbar.zoomout"] = "Zoom Out"; 
mapModuleLangs["zh_CN"]["toolbar.measuredist"] = "距离量算";  
mapModuleLangs["en"]["toolbar.measuredist"] = "Distance"; 
mapModuleLangs["zh_CN"]["toolbar.measurearea"] = "面积量算";  
mapModuleLangs["en"]["toolbar.measurearea"] = "Area"; 
mapModuleLangs["zh_CN"]["toolbar.print"] = "打印";  
mapModuleLangs["en"]["toolbar.print"] = "Print"; 
mapModuleLangs["zh_CN"]["toolbar.clear"] = "清除图形";  
mapModuleLangs["en"]["toolbar.clear"] = "Clear";
mapModuleLangs["zh_CN"]["toolbar.top"] = "置顶";  
mapModuleLangs["en"]["toolbar.top"] = "Top";
mapModuleLangs["zh_CN"]["toolbar.searchbyroad"] = "按道路查询";  
mapModuleLangs["en"]["toolbar.searchbyroad"] = "Search By Road";
mapModuleLangs["zh_CN"]["toolbar.searchbylonLat"] = "按经纬度查询";  
mapModuleLangs["en"]["toolbar.searchbylonLat"] = "Search By LonLat";
mapModuleLangs["zh_CN"]["toolbar.searchbydevice"] = "按设备名称查询";  
mapModuleLangs["en"]["toolbar.searchbydevice"] = "Search By Device";
mapModuleLangs["zh_CN"]["toolbar.searchbyroad_V5"] = "道路查询";  
mapModuleLangs["en"]["toolbar.searchbyroad_V5"] = "Search By Road";
mapModuleLangs["zh_CN"]["toolbar.searchbylonLat_V5"] = "坐标查询";  
mapModuleLangs["en"]["toolbar.searchbylonLat_V5"] = "Search By LonLat";
mapModuleLangs["zh_CN"]["toolbar.searchbydevice_V5"] = "名称查询";  
mapModuleLangs["en"]["toolbar.searchbydevice_V5"] = "Search By Device";
mapModuleLangs["zh_CN"]["toolbar.circleselect"] = "圆形选择";  
mapModuleLangs["en"]["toolbar.circleselect"] = "Circle Select";
mapModuleLangs["zh_CN"]["toolbar.rectangleselect"] = "矩形选择";  
mapModuleLangs["en"]["toolbar.rectangleselect"] = "Rectangle Select";
mapModuleLangs["zh_CN"]["toolbar.polygonselect"] = "自由选择"; 
mapModuleLangs["en"]["toolbar.polygonselect"] = "Polygon Select";
mapModuleLangs["zh_CN"]["toolbar.clear2"] = "清除"; 
mapModuleLangs["en"]["toolbar.clear2"] = "Clear";
mapModuleLangs["zh_CN"]["toolbar.clickingmapsetting"] = "点击地图设置";  
mapModuleLangs["en"]["toolbar.clickingmapsetting"] = "Clicking Map Setting";
mapModuleLangs["zh_CN"]["toolbar.clickingmapsetting_V5"] = "获取";  
mapModuleLangs["en"]["toolbar.clickingmapsetting_V5"] = "Clicking Map Setting";
mapModuleLangs["zh_CN"]["toolbar.start"] = "起点";  
mapModuleLangs["en"]["toolbar.start"] = "Start";
mapModuleLangs["zh_CN"]["toolbar.end"] = "终点";  
mapModuleLangs["en"]["toolbar.end"] = "End";
mapModuleLangs["zh_CN"]["toolbar.tolerance"] = "容差";  
mapModuleLangs["en"]["toolbar.tolerance"] = "Tolerance";
mapModuleLangs["zh_CN"]["toolbar.meter"] = "米";  
mapModuleLangs["en"]["toolbar.meter"] = "meters";
mapModuleLangs["zh_CN"]["toolbar.selectcrimeplace"] = "请先选择犯罪点";  
mapModuleLangs["en"]["toolbar.selectcrimeplace"] = "Please select a crime place";
mapModuleLangs["zh_CN"]["toolbar.crimeplace"] = "犯罪点";  
mapModuleLangs["en"]["toolbar.crimeplace"] = "Crime Place";
mapModuleLangs["zh_CN"]["toolbar.firstlevelradius"] = "一级围捕半径";  
mapModuleLangs["en"]["toolbar.firstlevelradius"] = "First Level Radius";
mapModuleLangs["zh_CN"]["toolbar.secondlevelradius"] = "二级围捕半径";  
mapModuleLangs["en"]["toolbar.secondlevelradius"] = "Second Level Radius";
mapModuleLangs["zh_CN"]["toolbar.cartrack"] = "轨迹查询";  
mapModuleLangs["en"]["toolbar.cartrack"] = "CarTrack Search";
mapModuleLangs["zh_CN"]["toolbar.listenalarm"] = "黑名单告警";  
mapModuleLangs["en"]["toolbar.listenalarm"] = "Listen Blacklist Alarm";
mapModuleLangs["zh_CN"]["toolbar.notlistenalarm"] = "取消告警";  
mapModuleLangs["en"]["toolbar.notlistenalarm"] = "Cancel Blacklist Alarm";
mapModuleLangs["zh_CN"]["toolbar.blackListTrack"] = "告警追踪";  
mapModuleLangs["en"]["toolbar.blackListTrack"] = "Alarm Track";
mapModuleLangs["zh_CN"]["toolbar.clearTrack"] = "清除轨迹";  
mapModuleLangs["en"]["toolbar.clearTrack"] = "CarTrack Clear";


//index_print.html
mapModuleLangs["zh_CN"]["index_print.mapprint"] = "地图打印";  
mapModuleLangs["en"]["index_print.mapprint"] = "Map Print";
mapModuleLangs["zh_CN"]["index_print.print"] = "打印";  
mapModuleLangs["en"]["index_print.print"] = "Print";
mapModuleLangs["zh_CN"]["index_print.note"] = "备注";  
mapModuleLangs["en"]["index_print.note"] = "Note";
//index html
mapModuleLangs["zh_CN"]["index.refresh"] = "刷新";  
mapModuleLangs["en"]["index.refresh"] = "Refresh";
mapModuleLangs["zh_CN"]["index.modifycoordinate"] = "修改经纬度";  
mapModuleLangs["en"]["index.modifycoordinate"] = "Modify Coordinate";
mapModuleLangs["zh_CN"]["index.clearcoordinate"] = "取消定位";  
mapModuleLangs["en"]["index.clearcoordinate"] = "Clear Coordinate";
mapModuleLangs["zh_CN"]["index.modifychannelname"] = "修改通道名称";  
mapModuleLangs["en"]["index.modifychannelname"] = "Modify Channel Name";
mapModuleLangs["zh_CN"]["index.modifysitename"] = "修改设备名称";  
mapModuleLangs["en"]["index.modifysitename"] = "Modify Site Name";
mapModuleLangs["zh_CN"]["index.devicelist"] = "设备列表";  
mapModuleLangs["en"]["index.devicelist"] = "Device List";

mapModuleLangs["zh_CN"]["index.imagelist"] = "电子地图";  
mapModuleLangs["en"]["index.imagelist"] = "ImageMap List";
mapModuleLangs["zh_CN"]["index.uploadMap"] = "上传地图"; 
mapModuleLangs["en"]["index.uploadMap"] = "upload iamgeMap";
mapModuleLangs["zh_CN"]["index.deletelist"] = "删除地图"; 
mapModuleLangs["en"]["index.deletelist"] = "delete iamgeMap";
mapModuleLangs["zh_CN"]["index.changePicName"] = "修改名称"; 
mapModuleLangs["en"]["index.changePicName"] = "change map name";
mapModuleLangs["zh_CN"]["index.locate"] = "定位显示"; 
mapModuleLangs["en"]["index.locate"] = "locate iamgeMap";
mapModuleLangs["zh_CN"]["index.playvideo"] = "打开视频"; 
mapModuleLangs["en"]["index.playvideo"] = "play video";
mapModuleLangs["zh_CN"]["index.deletedevice"] = "删除设备"; 
mapModuleLangs["en"]["index.deletedevice"] = "delete device";
mapModuleLangs["zh_CN"]["index.gismapHead"] = "GIS地图";  
mapModuleLangs["en"]["index.gismapHead"] = "GIS Map";

//eyeshot_updateLonLat.html
mapModuleLangs["zh_CN"]["eyeshot_updateLonLat.lon"] = "经度";  
mapModuleLangs["en"]["eyeshot_updateLonLat.lon"] = "Longitude";
mapModuleLangs["zh_CN"]["eyeshot_updateLonLat.lat"] = "纬度";  
mapModuleLangs["en"]["eyeshot_updateLonLat.lat"] = "Latitude";
mapModuleLangs["zh_CN"]["eyeshot_updateLonLat.ok"] = "确定";  
mapModuleLangs["en"]["eyeshot_updateLonLat.ok"] = "OK";
mapModuleLangs["zh_CN"]["eyeshot_updateLonLat.cancel"] = "取消";  
mapModuleLangs["en"]["eyeshot_updateLonLat.cancel"] = "Cancel";
mapModuleLangs["zh_CN"]["eyeshot_updateLonLat.channelname"] = "设备通道名称";  
mapModuleLangs["en"]["eyeshot_updateLonLat.channelname"] = "Channel Name";

//spatialquery.js
mapModuleLangs["zh_CN"]["spatialquery.nodevicelistfound"] = "没有获取到设备列表";  
mapModuleLangs["en"]["spatialquery.nodevicelistfound"] = "No device list found";
mapModuleLangs["zh_CN"]["spatialquery.nomatchingresults"] = "无符合条件的结果";  
mapModuleLangs["en"]["spatialquery.nomatchingresults"] = "No matching results";
mapModuleLangs["zh_CN"]["spatialquery.searchresult"] = "查询结果";  
mapModuleLangs["en"]["spatialquery.searchresult"] = "Search Results";
mapModuleLangs["zh_CN"]["spatialquery.GISserverstoppedunexpectedly"] = "GIS服务器意外停止";  
mapModuleLangs["en"]["spatialquery.GISserverstoppedunexpectedly"] = "The GIS server has been stopped unexpectedly";
mapModuleLangs["zh_CN"]["spatialquery.nomatchingresults"] = "无符合条件的结果";  
mapModuleLangs["en"]["spatialquery.nomatchingresults"] = "No matching results";
mapModuleLangs["zh_CN"]["spatialquery.nocoordinateissetatdevice"] = "该设备没有设置坐标";  
mapModuleLangs["en"]["spatialquery.nocoordinateissetatdevice"] = "No Coordinate is set at the device";

//sp.js
mapModuleLangs["zh_CN"]["sp.start"] = "起点";  
mapModuleLangs["en"]["sp.start"] = "start";
mapModuleLangs["zh_CN"]["sp.end"] = "终点";  
mapModuleLangs["en"]["sp.end"] = "end";
mapModuleLangs["zh_CN"]["sp.selected"] = "已选择";  
mapModuleLangs["en"]["sp.selected"] = "Selected";
mapModuleLangs["zh_CN"]["sp.enterstartroad"] = "请输入起点所在道路";  
mapModuleLangs["en"]["sp.enterstartroad"] = "please enter the start road";
mapModuleLangs["zh_CN"]["sp.enterendroad"] = "请输入终点所在道路";  
mapModuleLangs["en"]["sp.enterendroad"] = "please enter the end road";
mapModuleLangs["zh_CN"]["sp.roadnamecannotcontains"] = "道路名中不能包含空格或特殊符号";  
mapModuleLangs["en"]["sp.roadnamecannotcontains"] = "Road name can not contain spaces or special characters";
mapModuleLangs["zh_CN"]["sp.GISserverstoppedunexpectedly"] = "GIS服务器意外停止";  
mapModuleLangs["en"]["sp.GISserverstoppedunexpectedly"] = "The GIS server has been stopped unexpectedly";
mapModuleLangs["zh_CN"]["sp.nomatchingresult"] = "无符合条件的结果";  
mapModuleLangs["en"]["sp.nomatchingresult"] = "No matching result";
mapModuleLangs["zh_CN"]["sp.selectthestart"] = "选择起点";  
mapModuleLangs["en"]["sp.selectthestart"] = "select the start";
mapModuleLangs["zh_CN"]["sp.selecttheend"] = "选择终点";  
mapModuleLangs["en"]["sp.selecttheend"] = "select the end";
mapModuleLangs["zh_CN"]["sp.results"] = "查询道路结果";  
mapModuleLangs["en"]["sp.results"] = "Results";
mapModuleLangs["zh_CN"]["sp.nodevicelistfound"] = "没有获取到设备列表";  
mapModuleLangs["en"]["sp.nodevicelistfound"] = "No device list found";
mapModuleLangs["zh_CN"]["sp.setstartingpoint"] = "请选取起点";  
mapModuleLangs["en"]["sp.setstartingpoint"] = "please set the starting point";
mapModuleLangs["zh_CN"]["sp.settheendingpoint"] = "请选取终点";  
mapModuleLangs["en"]["sp.settheendingpoint"] = "please set the ending  point";
mapModuleLangs["zh_CN"]["sp.tolerancestartingpointendingpoint"] = "当前容差和起始点条件下无符合的结果";  
mapModuleLangs["en"]["sp.tolerancestartingpointendingpoint"] = "No matching results in the conditions of the tolerance, the starting point and ending point";
mapModuleLangs["zh_CN"]["sp.startingpointendingpoint"] = "当前起始点条件下无符合的结果";  
mapModuleLangs["en"]["sp.startingpointendingpoint"] = "No matching results in the conditions of the starting point and ending point";
mapModuleLangs["zh_CN"]["sp.note"] = "注：绿色虚线部分表示连线，不代表实际路线";  
mapModuleLangs["en"]["sp.note"] = "Note:The green dotted lines represent the connection, do not mean the actual routes";
mapModuleLangs["zh_CN"]["sp.note_V5"] = "注：绿色虚线部分表示连线，不代表实际路线";  
mapModuleLangs["en"]["sp.note_V5"] = "Note:The green dotted lines represent the connection, do not mean the actual routes";
mapModuleLangs["zh_CN"]["sp.policerouteanalysisresult"] = "出警分析结果";  
mapModuleLangs["en"]["sp.policerouteanalysisresult"] = "Police Route Analysis Result";
mapModuleLangs["zh_CN"]["sp.totallength"] = "总长度";  
mapModuleLangs["en"]["sp.totallength"] = "Total Length";
mapModuleLangs["zh_CN"]["sp.meter"] = "米";  
mapModuleLangs["en"]["sp.meter"] = "meters";
mapModuleLangs["zh_CN"]["sp.setthetolerance"] = "请设置容差";  
mapModuleLangs["en"]["sp.setthetolerance"] = "Please set the to tolerance";
mapModuleLangs["zh_CN"]["sp.tolerancemustbedigit"] = "容差必须是数字";  
mapModuleLangs["en"]["sp.tolerancemustbedigit"] = "The Tolerance must be a digit";
mapModuleLangs["zh_CN"]["sp.tolerancegreaterthanzero"] = "容差必须大于零";  
mapModuleLangs["en"]["sp.tolerancegreaterthanzero"] = "The Tolerance must be greater than zero";
mapModuleLangs["zh_CN"]["sp.thetoleranceislarge"] = "容差过大";  
mapModuleLangs["en"]["sp.thetoleranceislarge"] = "The Tolerance is too large";
mapModuleLangs["zh_CN"]["sp.toleranceinteger"] = "容差必须是整数";  
mapModuleLangs["en"]["sp.toleranceinteger"] = "The Tolerance must be an integer";

//setslayer.js
mapModuleLangs["zh_CN"]["sp.GISstoppedunexpectedly"] = "GIS服务器意外停止";  
mapModuleLangs["en"]["sp.GISstoppedunexpectedly"] = "The GIS server has been stopped unexpectedly";
mapModuleLangs["zh_CN"]["sp.name"] = "名称";  
mapModuleLangs["en"]["sp.name"] = "Name";
mapModuleLangs["zh_CN"]["sp.channel"] = "通道";  
mapModuleLangs["en"]["sp.channel"] = "Channel";
mapModuleLangs["zh_CN"]["sp.longitude"] = "经度";  
mapModuleLangs["en"]["sp.longitude"] = "Lon";
mapModuleLangs["zh_CN"]["sp.latitude"] = "纬度";  
mapModuleLangs["en"]["sp.latitude"] = "Lat";
mapModuleLangs["zh_CN"]["sp.noCB_SendMsgToClient"] = "客户端缺失CB_SendMsgToClient函数，不能支持与GIS进行交互";  
mapModuleLangs["en"]["sp.noCB_SendMsgToClient"] = "No CB_SendMsgToClient function ,it can not interact with the GIS";
mapModuleLangs["zh_CN"]["sp.nodevice"] = "没有获取到设备列表";  
mapModuleLangs["en"]["sp.nodevice"] = "No device list found";
mapModuleLangs["zh_CN"]["sp.siteInfo"] = "站点信息";  
mapModuleLangs["en"]["sp.siteInfo"] = "Site Info";
mapModuleLangs["zh_CN"]["sp.kkbh"] = "卡口编号";  
mapModuleLangs["en"]["sp.kkbh"] = "Site Number";
mapModuleLangs["zh_CN"]["sp.kkwz"] = "卡口位置";  
mapModuleLangs["en"]["sp.kkwz"] = "Site Location";
mapModuleLangs["zh_CN"]["sp.passcarInfo"] = "过车信息";  
mapModuleLangs["en"]["sp.passcarInfo"] = "Pass Car Info";
mapModuleLangs["zh_CN"]["sp.hphm"] = "号牌号码";
mapModuleLangs["en"]["sp.hphm"] = "Car Plate";
mapModuleLangs["zh_CN"]["sp.jgsk"] = "经过时刻";  
mapModuleLangs["en"]["sp.jgsk"] = "Pass Time";
mapModuleLangs["zh_CN"]["sp.hpys"] = "号牌颜色";
mapModuleLangs["en"]["sp.hpys"] = "Car Plate Color";
mapModuleLangs["zh_CN"]["sp.csys"] = "车身颜色";  
mapModuleLangs["en"]["sp.csys"] = "Car Body Color";
mapModuleLangs["zh_CN"]["sp.clsd"] = "车辆速度";  
mapModuleLangs["en"]["sp.clsd"] = "Car Speed";
mapModuleLangs["zh_CN"]["sp.cllx"] = "车辆类型";  
mapModuleLangs["en"]["sp.cllx"] = "Car Type";
mapModuleLangs["zh_CN"]["sp.cdmc"] = "经过车道";  
mapModuleLangs["en"]["sp.cdmc"] = "Pass Lane";
mapModuleLangs["zh_CN"]["sp.gctx"] = "过车图像";  
mapModuleLangs["en"]["sp.gctx"] = "Car Image";
mapModuleLangs["zh_CN"]["sp.ssgc"] = "实时过车";  
mapModuleLangs["en"]["sp.ssgc"] = "Current Pass Car";
mapModuleLangs["zh_CN"]["sp.blackListAlarm"] = "黑名单告警信息";  
mapModuleLangs["en"]["sp.blackListAlarm"] = "Blacklist Alarm Info";
mapModuleLangs["zh_CN"]["sp.gjsj"] = "报警时间";  
mapModuleLangs["en"]["sp.gjsj"] = "Alarm Time";
mapModuleLangs["zh_CN"]["sp.bjlx"] = "报警类型";  
mapModuleLangs["en"]["sp.bjlx"] = "Alarm Time";

//pageConfig.js
mapModuleLangs["zh_CN"]["pageConfig.failtoclearcoordinate"] = "取消设备定位失败";  
mapModuleLangs["en"]["pageConfig.failtoclearcoordinate"] = "Fail to clear coordinate";
mapModuleLangs["zh_CN"]["pageConfig.failtoclearsitecoordinate"] = "取消站点定位失败";  
mapModuleLangs["en"]["pageConfig.failtoclearsitecoordinate"] = "Fail to clear site coordinate";
mapModuleLangs["zh_CN"]["pageConfig.failtomodifycoordinate"] = "修改经纬度失败";  
mapModuleLangs["en"]["pageConfig.failtomodifycoordinate"] = "Fail to modify coordinate";
mapModuleLangs["zh_CN"]["pageConfig.enterChannelName"] = "请输入通道名称";  
mapModuleLangs["en"]["pageConfig.enterChannelName"] = "please enter the Channel Name";
mapModuleLangs["zh_CN"]["pageConfig.channelName"] = "通道名称";  
mapModuleLangs["en"]["pageConfig.channelName"] = "Channel Name";
mapModuleLangs["zh_CN"]["pageConfig.channelNameExisted"] = "该通道名称已经存在，请修改为其他名称！";  
mapModuleLangs["en"]["pageConfig.channelNameExisted"] = "The Channel Name has been Existed,please enter a different Channel Name";
mapModuleLangs["zh_CN"]["pageConfig.channelNametooLong"] = "通道名称超过限定长度！";  
mapModuleLangs["en"]["pageConfig.channelNametooLong"] = "The Channel Name's characters must be limited in 48";
mapModuleLangs["zh_CN"]["pageConfig.failedUpdateChannelName"] = "修改设备通道名称失败！";  
mapModuleLangs["en"]["pageConfig.failedUpdateChannelName"] = "Fail to modify Channel Name";
mapModuleLangs["zh_CN"]["pageConfig.lon"] = "经度";  
mapModuleLangs["en"]["pageConfig.lon"] = "Longitude";
mapModuleLangs["zh_CN"]["pageConfig.lat"] = "纬度";  
mapModuleLangs["en"]["pageConfig.lat"] = "Latitude";
mapModuleLangs["zh_CN"]["pageConfig.close"] = "关闭";  
mapModuleLangs["en"]["pageConfig.close"] = "Close";
mapModuleLangs["zh_CN"]["pageConfig.manageSelect"] = "管理状态下，不能定位";  
mapModuleLangs["en"]["pageConfig.manageSelect"] = "In the management of state, not be able to locate the coordinates";
mapModuleLangs["zh_CN"]["pageConfig.manageOpenVideo"] = "管理状态下，不能打开视频";  
mapModuleLangs["en"]["pageConfig.manageOpenVideo"] = "In the management of state, can not open the video";
mapModuleLangs["zh_CN"]["pageConfig.notManageUpdateEquip"] = "非管理状态下，不能修改设备信息";  
mapModuleLangs["en"]["pageConfig.notManageUpdateEquip"] = "Not in the management of state, can not update the equipment infomation";
mapModuleLangs["zh_CN"]["pageConfig.notManageUpdateSite"] = "非管理状态下，不能修改站点信息";  
mapModuleLangs["en"]["pageConfig.notManageUpdateSite"] = "Not in the management of state, can not update the site infomation";

//check.js
mapModuleLangs["zh_CN"]["check.canNotBeNull"] = "不能为空！";  
mapModuleLangs["en"]["check.canNotBeNull"] = " can not be null";
mapModuleLangs["zh_CN"]["check.canNotSpaecialCharacter"] = "不能填写非法字符";  
mapModuleLangs["en"]["check.canNotSpaecialCharacter"] = " can not enter special characters";
mapModuleLangs["zh_CN"]["check.lonlatisdigit"] = "必须是数字";
mapModuleLangs["en"]["check.lonlatisdigit"] = " must be a digit";
mapModuleLangs["zh_CN"]["check.lonextent"] = "范围在73.0508333至135.0013889之间";
mapModuleLangs["en"]["check.lonextent"] = " range must be between 73.0508333 to 135.0013889";
mapModuleLangs["zh_CN"]["check.latextent"] = "范围在3.0836111至53.0508333之间";
mapModuleLangs["en"]["check.latextent"] = " range must be between 3.0836111 to 53.0508333";

var langcssprefix = "";
if(langType=="en")langcssprefix = "-en";

var roundupanalyse = "";
if(langType=="en")roundupanalyse = "-en";

var zhoren = "";
if(langType=="en")zhoren = "en/";

var gpstrace = "";
if(langType=="en")gpstrace = "-en";

/**
 * 获取国际化消息
 * */
function geti18nMsg(key){
	
	var msg = mapModuleLangs[langType][key];
	
	return msg;
	
}