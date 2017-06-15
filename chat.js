/*查询接口需要数据*/  
var powerOffInfo="";//停电信息
var serverWskt="";//服务历史
var orgNo="";//供电单位编码
var proNo="";//省市标识
var orgName="";//供电单位名称
var consNo="";//用户编号 
//在线制单句柄
var wkst;
//历史记录所需参数
var firstSerachFlag = true;   //判断是否为第一次查询  第一次查询插入提示语句
//取begintime，打下时间戳，点击查询按钮，只查询从这个begintime之前的历史会话记录
var beginTime = new Date().format("Y-m-d")+" 23:59:59";
var endTime = new Date(new Date().getTime()-7*24*3600*1000).format("Y-m-d H:i:s");
var menuBar;  //常用语菜单栏对象
$(function() {
	//初始化去除发送文本样式的控件
	removeCssStyle('contenteditable');
	/*   初始化 */
	webchat.insertMiddleHistoryMessage("<div><a id='loadMore' hidefocus='true' onClick='getChatRecord();return false;' href='javascript:void(0)'><font color='blue'>点击加载更多历史记录</a></div>");
	firstMsgDis();
	captureInit();
	if(t!=1){
		if(cusAccount){
		consNo=cusAccount.split("|")[0];  
		orgNo=cusAccount.split("|")[1];
		orgNoToOrgName(orgNo);
		orgNoToTarget(orgNo);
		}
		lay(); 
		consInfoQuery(); 
		// 常用语初始化
		nomalSentence();
	} 
	$("#tab2").ligerTab({
		onAfterSelectTabItem : function(tabid) {
			if (tabid == 'tabitem2'){ 
				serverWkt();
			}else if(tabid == 'tabitem3'){
				powerOffQuery();
			}
		}
	});
	$("#manyCons").click(function(){
		parent.manyQueryOpen(orgNo,orgName,consNo,'1');
	});
	$("#manyServ").click(function(){
		parent.manyQueryOpen(orgNo,orgName,consNo,'2');
	});
	$("#manyPower").click(function(){
		parent.manyQueryOpen(orgNo,orgName,consNo,'3');
	});
	// 聊天消息发送按钮
	$("#sendBtn").on("click",'',{connectFlag:connectFlag}, webchat.sendMsg); 
	// QQ表情
	$('.icon-emotion').qqFace(webchat.qqFace);
	// 挂断-完成
	$("#hangupBtn").on("click",webchat.hangup);
	
	//满意度推送
	$("#satBtn").on("click",webchat.satisfaction);
	// 显示历史记录
	$("#show-history").on("click",'',{fromNumber:customerNumber,toNumber:agentNumber},webchat.historyRec);
	// 聊天框的Enter事件
	// 快捷键是否被勾选
	
	$(".putin").on("keypress",'',{connectFlag:connectFlag,flg:'0'},webchat.pressEnter);
	//转接坐席
	$("#transAgent").click(function(){
		parent.transAgent(jobId);
	});
	//转接队列
	$("#transQueue").click(function(){
		parent.transferQueue(jobId);
	});
	
	//实例化输入提示的JS,参数为进行查询操作时要调用的函数名
	 var searchSuggest =  new oSearchSuggest(sendKeyWordToBack);
	   
	//这是一个模似函数，实现向后台发送ajax查询请求，并返回一个查询结果数据，传递给前台的JS,再由前台JS来展示数据。本函数由程序员进行修改实现查询的请求
	//参数为一个字符串，是搜索输入框中当前的内容
	function sendKeyWordToBack(keyword){
		var aData = [];
		getUseExp(keyword,function(json){
			var useExpJsons = json.useExpList;
			if(useExpJsons && useExpJsons.length > 0){
				for(var i=0 ; i<useExpJsons.length ; i++){
					aData.push( "[" + useExpJsons[i].groupName + "] " +useExpJsons[i].content );
				}
			}
		});
	    //将返回的数据传递给实现搜索输入框的输入提示js类
	    searchSuggest.dataDisplay(aData);
	}
	
});

// 异步获取常用语的服务端接口
function getUseExp(keyword,callback){
	var urlPath = '/SGMC/tsupport_csonline/rest/cusAccessCtrl/autoQueryUseExp';
	var url = urlPath +"?content="+keyword;
	doJsonPostUseExp(url, function(result){
	   callback(result);
	});
};

function doJsonPostUseExp(url, callback){
		$.ajax({
			type : "POST",
			url : url,
			traditional: true,
			async : false,
			dataType : 'json',
			success : function(map){
				 callback(map);
			},
			error : function(obj){
				$.ligerDialog.error("系统异常，请联系管理员");
			}
		});
};


// 聊天页面的布局
function lay(){   
	$("#layout").ligerLayout({
		leftWidth:1055, 
		height:737
	});
	$("#tab2").ligerTab({});
	var form1;
	var form3;
	// 创建表单结构
	form1 = $("#form2").ligerForm({
				width:'100%',
				labelWidth : 110,
				inputWidth : 0,
				space : 0,  
				fields : [	
						{
							group : "用户接入信息", 
							label : '用户姓名',
							afterContent : nickname,
							name : "UnitsOnOrder1",
							type : "label", 
							newline : true 
						},
						{
							label : "用户来源",
							afterContent : sourceContent,
							name : "UnitsOnOrder2",
							type : "label",
							newline : true
						},
						{
							label : "行政区划",
							afterContent : area_desc, 
							name : "UnitsOnOrder3",
							type : "label"
						},
						{
							group : "用户档案信息",
							label : '用户名称',
							afterContent : '',
							name : "UnitsOnOrder4",
							type : 'label',
							newline : true
						}, {
							label : "用户编号",
							afterContent : '',
							name : "UnitsOnOrder5",
							type : "label",
							newline : true
						}, {
							label : "用电地址",
							afterContent : '',
							name : "UnitsOnOrder6",
							type : "label",
							newline : true
						},{
							label : "所属供电公司",
							afterContent : '',
							name : "UnitsOnOrder7",
							type : "label",
							newline : true
						}, {
							label : "用户电源线路",
							afterContent : '',
							name : "UnitsOnOrder8",
							type : "label",
							newline : true
						},{
							label : "用电类型", 
							afterContent:'',
							name : "UnitsOnOrder9",
							type : "label",
							newline : true
						}, {
							label : "缴费方式",
							afterContent : '',
							name : "UnitsOnOrder10",
							type : "label",
							newline : true
						},{
							label : "客户停电状态",
							afterContent : '',
							name : "UnitsOnOrder11",
							type : "label",
							newline : true
						}
						],
				validate : false 
			}); 
	$("div[class='l-group']").css({
		"width":"100%",
		"border":"1px solid #CCE9E6"
		});
	$("#seachText").parent().children("div").eq(2).children("div").eq(0).removeClass().addClass('l-icon-search');
	$("#seachText").parent().children("div").eq(2).children("div").eq(0).attr("style","height:100%");
	//打开在线制单页面
	$("#wkstButton").click(function(){
		wkstOpen();
	});
}  
// 在线制单
function wkstOpen(){
	//自己当前会话的单子，默认为true
	var flag = true;
	ligerDialogOpen('/SGMC/tsupport_csonline/rest/ucAgentCtrl/switchWkstJsp?wkstNo='+appNo+"&readonly="+flag,'在线制单',650,950,105,70);
}
// 关闭tab页触发挂机事件
function closeTab(){
	parent.$.agentBar.sendMessageToCus("close", jobId, agentNumber, customerNumber, "", "0",function(obj){
		if(obj.resultCode == 0){
			connectFlag == "0"
			$("#hangupBtn").html("完成");
		} else {
			var message = '挂断失败!';
			$.ligerDialog.error(message);
				insertSysMsg(jobId, agentServiceId, message);
		}
	});
}

//坐席发送截图
function insertCap(message){
	var records = $(".chat-cntent-con");
	parent.$.agentBar.sendImageToCus("send", jobId,agentNumber , customerNumber, message,
			"1","1",function(result){
		if (result.resultCode == "0") {
			//成功处理 
			//插入基本提示信息
			var time =  new Date().format("Y-m-d H:i:s");
			var userName_agent = "坐席";
			var msg = ' <li class="from-myself clearfix"> '
		        + ' <a href="javascript:" class="person-pic float-right"><img src="../../css/img/user/histable.png"></a> '
			          + ' <div class="content float-right"> '
			              + ' <span class="user-send"> '
			              + ' <a href="javascript:" class="nameAndTime">' + userName_agent + " "
			              + time + '</a> '
			              +  "<img class='newImage' id='captureImg' src='data:image/gif;base64,"+message+"' onmouseleave='mouseleave_cap(\"data:image/gif;base64,"+message+"\")' onmouseenter='mouseenter_cap(\"data:image/gif;base64,"+message+"\")' ondblclick='window.open(\"data:image/gif;base64,"+message+"\")'></img>"
			              +  ' </span> '
			           + ' </div> ';
			records.append(msg);
			$(".putin").html('');
			 document.getElementById("chat_end").scrollIntoView(false);
		} else {
			// 失败处理 
			$.ligerDialog.error("发送失败");
		}
	
	});
	
	
}

function mouseenter_cap(str){
	$("body").append("<img  id='bigimage' style='display:none;position:absolute; z-index:99999999;' src='"+str+"'/>");
    var pic = document.getElementById("bigimage");
  //改变小图片的透明度为0.5
  //$("#captureImg").fadeTo('slow',0.5);
    //judge(event,pic);
  $(pic).css({
	  top:event.pageY +20  ,
      left:event.pageX - $(pic).width() - 20
  });
    $(pic).fadeIn('slow');
}

function mouseleave_cap(){
	 //将变暗的图片复原
    $("#captureImg").fadeTo('slow',1);
    //移除新增的p标签
    $("#bigimage").remove();
}

//初始化常用语
function nomalSentence(){
//	$("#chatLan_type").append("<option value='0'>--常用语--</option>");
//	var url = '/SGMC/tsupport_csonline/rest/useExpCtrl/initNormalSentense';
//	var dataRes = {};
//	var retStr = webchat.myAjax(url,dataRes);
//	if(retStr.flg){
//		for(i=0;i<retStr.map.list.length;i++){
//			$("#chatLan_type").append("<option value='"+retStr.map.list[i].id+"'>"+retStr.map.list[i].content+"</option>");
//		}
//	}else{
//		$.ligerDialog.error("系统异常，请联系管理员");
//	}
	/*$.ajax({
		type : "POST",
		url : '/SGMC/tsupport_csonline/rest/useExpCtrl/initNormalSentense',
		async : false,
		dataType : 'json',
		success : function(map){
			for(i=0;i<map.list.length;i++){
			$("#chatLan_type").append("<option value='"+map.list[i].id+"'>"+map.list[i].content+"</option>");
			}
		},
		error : function(obj){
			$.ligerDialog.error("系统异常，请联系管理员");
		}
	}); */
//	$("#chatLan_type").change(function(){
//		if($(this).attr("value")!=0){
//			var txt = $("#chatLan_type").find("option:selected").text();
//			$(".putin").append(txt);
//			//选中第一项，重新激活change事件
//			$("#chatLan_type").children("option:[value='0']")[0].selected=true;
//		}
//		
//	});
	//声明menu对象
	var menu={};
	$.ajax({
		type : "POST",
		url : '/SGMC/tsupport_csonline/rest/useExpCtrl/initGroupSelect', 
		async : false,
		dataType : 'json',
		success : function(map){ 
			//不要使用foreach遍历，产生变量o可能产生原型中的属性值字符串     remove
			for(var i=0 ; i<map.menus.length ; i++){
				for(var o=0 ; o<map.menus[i].children.length ; o++ ){
					map.menus[i].children[o].click=function(){
//						console.log(map.menus[i].children[o]);
//						console.log(map.menus[i].children[o].text);
//						$("#putin").append(map.menus[i].children[o].text);
						var startIndex = this.text.indexOf(".");
						var endIndex = this.text.length;
						var str = this.text.substring(startIndex+1,endIndex);
						$("#putin").append(str);
				};
				}
			}
			
			menu.width = 140;
			menu.items =  map.menus;
		},
		error : function(obj){
			$.ligerDialog.warn("系统异常，请联系管理员");
		}
	}); 
	
	 
	
	menuBar =  $("#topmenu").ligerMenuBar({ items: [
	                                              { text: '常用语', menu: menu }
	                                          ]
	                                      });
	//设置一级下拉框高度，溢出产生滚动条
	$(".l-menu[ligeruiid] > .l-menu-inner").css({
		"height":"138px",
		"overflow-y":"scroll"
	});
	
	//设置二级下来菜单框的宽度
	$(".l-menu[ligeruiparentmenuitemid]").css({
		"width":"400px",
	});
	
	$(".l-menu[ligeruiparentmenuitemid] > .l-menu-inner").css({
		"height":"95px",
		"overflow-y":"scroll"
	});
      
}
//html页面从上至下执行，绑定事件的时候，已经找到了dom节点
$("#triangle").click(function () {
    if($(".jump").css("display") == "none"){
    	//append相当于移动dom节点，把jump节点移到triangle的子节点下面，点击子元素$(".jump")时，发生事件冒泡，触发父元素$("#triangle")的click事件
        $(this).append($(".jump").css({"display":"block"}));
    }else{
        $(".jump").css({"display":"none"});
    }
});

//tabindex  h5属性
//通过给发送按钮设置tabindex属性，点击后，就可以使之获取焦点，点击triangle三角后，由于事件冒泡的缘故，使父元素获取焦点事件
$(".container").blur(function() {
	$(".jump").css({"display":"none"});
});

function firstMsgDis(){//第一条消息显示
	var records = $(".chat-cntent-con");
	if(parent.firstMsg_cus){
	var str_length=parent.firstMsg_cus.length;
	for(var i=0;i<str_length;i++){
		records.append(parent.firstMsg_cus[i]);
	}
	}
	//临时数组置为空
	parent.firstMsg_cus=[];
}
function ligerDialogOpen(url,title,height,width,left,top){
		wkst = $.ligerDialog.open({
			height:height,
	        width: width,
	        left:left,
	        top:top,
	        title : title,
	        url: url, 
	        showMax: false,
	        showToggle: true,
	        showMin: false,
	        isDrag : true,
	        isHidden:false,
	        isResize: true,
	        slide: false,
	        onCollapseed : function(){
	        	$(".l-window-mask").css("display","none");
	        },
	        onExtended :function(){
	        	$(".l-window-mask").css("display","block");
	        }
	    });
}
/*接口需要方法*/ 
Date.prototype.Format = function(fmt){//时间验证    
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

function orgNoToTarget(u_orgNo){//供电单位转换省市标识 
	if(u_orgNo){
		$.ajax({
			type : "POST",
			url : "/SGMC/tsupport_csonline/rest/regionCtrl/region",
			async : false,
			data:{ 
				 orgNo:u_orgNo
				},
			dataType : 'json',
			success : function(json){
				proNo=json; 
			},
			error : function(obj){
				$.ligerDialog.error("供电单位转换省市标识异常，请联系管理员");
			}
		});
	}
} 
function serverWkt(){
	if(orgNo&&proNo&&consNo){
	var endDate=new Date().Format("yyyy-MM-dd")+" 23:59:59";
	var bgnDate=new Date(new Date().getTime()-7*24*3600*1000).Format("yyyy-MM-dd")+" 00:00:00";
	var pageNum="1";
	var rowNum="20";
	var orgNo1=orgNo;
	var mobile=userTel; 
	$.ajax({
			type:"post",
			url:"/SGMC/tsupport_csonline/rest/userChannelInfoQueryCtrl/queryDetailInfo",
			async:true,
			data:{
				serviceCode:'0101039',
				provinceNo:proNo,
				orgNo:proNo,
				sevreqId:"",
				appNo:"",
				srvMode:"",
				busiTypeCode:"",
				status:"",
				mobile:"",
				consNo:consNo,
				relaType:"",
				empNo:"",
				endDate:endDate,
				bgnDate:bgnDate,
				pageNum:pageNum,
				rowNum:rowNum
				},
			dataType:"json",
			success:function(json){ 
				$("#sv").empty(); 
				serverWskt=json;
				/*按时间排序展示*/
				if(serverWskt.Rows){
					var rows=serverWskt.Rows;
					rows.sort(function(a,b){
						return Date.parse(b.reqTime)-Date.parse(a.reqTime);//时间正序
					});
					for(var i=0;i<window.serverWskt.Total;i++){
						var a="<div  style='width:98%;margin-bottom:5px;padding:5px;'><p style='padding:5px;'><h4><font color='blue'>"
							  +rows[i].reqTime+
						      "</font></h4></p><p style='padding:5px;'>联系人名称:"
							  +rows[i].contactName+
							  "</p><p style='padding:5px;'>工单类型:"
							  +rows[i].busiTypeCodeName+ 
							  "</p><p style='padding:5px;'>联系地址:"
							  +rows[i].contactAdd+
							  "</p><p style='padding:5px;'>联系电话:"
							  +rows[i].tel+ 
							  "</p><p><hr></p></div>";  
						var c=$("#sv");
						c.append(a); 
					 }
				}
			}
		});
	}
}
function powerOffQuery(){ //停电信息查询 
		if(proNo&&orgNo){
		var startStopDate=new Date().Format("yyyy-MM-dd")+" 00:00:00"; 
		var endStopDate=new Date(new Date().getTime()+6*24*3600*1000).Format("yyyy-MM-dd")+" 23:59:59";
		var pageNum="1";
		var rowNum="20";
		var isSubOrg="1";
		var orgNo2=orgNo;
		$.ajax({
				type:"post",
				url:"/SGMC/tsupport_csonline/rest/powerOffCtrl/queryPowerOff",
				async:true,
				data:{
					serviceCode:'0104026',
					provinceNo:proNo,
					startStopDate:startStopDate,
					endStopDate:endStopDate,
					start:"",
					end:"",
					poweroffId:"",
					areaNo:"",
					orgNo:orgNo2,
					isSubOrg:isSubOrg,
					lineNo:"",
					lineName:"",
					powerOffType:"",
					scope:"",
					powerOffArea:"",
					pageNum:pageNum,
					rowNum:rowNum
					},
				dataType:"json",
				success:function(json){ 
					$("#ml").empty(); 
					powerOffInfo=json;
					/*按时间排序展示*/
					if(powerOffInfo.Rows){
						var rows=powerOffInfo.Rows;
						rows.sort(function(a,b){
							return Date.parse(b.startTime)-Date.parse(a.startTime);//时间正序
						});
						for(var i=0;i<window.powerOffInfo.Total;i++){
							var startTime=rows[i].startTime;
							if(!startTime){
								startTime="";
							}
							var orgName=rows[i].orgName;
							if(!orgName){
								orgName="";
							}
							var stopTime=rows[i].stopTime;
							if(!stopTime){
								stopTime="";
							}
							var poweroffReason=rows[i].poweroffReason;
							if(!poweroffReason){
								poweroffReason="";
							}
							var scope=rows[i].scope;
							if(!scope){
								scope="";
							}
							var powerOffArea=rows[i].powerOffArea;
							
							if(!powerOffArea){
								powerOffArea="";
							}
							var a="<div  style='width:98%;margin-bottom:5px;padding:5px;'><p style='padding:5px;'><h4><font color='blue'>"
								  +startTime+
							      "</font></h4></p><p style='padding:5px;'>停电单位:"
								  +orgName+
								  "</p><p style='padding:5px;'>停电时间:"
								  +startTime+
								  " 至  "
								  +stopTime+
								  "</p><p style='padding:5px;'>停电原因:"
								  +poweroffReason+
								  "</p><p style='padding:5px;'>停电范围:"
								  +scope+
								  "</p><p style='padding:5px;'>停电区域:"
								  +powerOffArea+
								  "</p><p><hr></p></div>";  
							var c=$("#ml");
							c.append(a); 
						 }
					}
				}
			});
		}
}
function  consInfoQuery(){//用户档案信息初始化
    if(consNo&&proNo){
    	$.ajax({
			type:"post",
			url:"/SGMC/tsupport_csonline/rest/querysCtrl/custInfo",
			async : true,
			data:{
				serviceCode:'0104004',
				provinceNo:proNo,
				consNo:consNo,
				madeNo:""
				},
			dataType:"json",
			success:function(json){ 
				if(json.consName){
					 $("#form2\\|3").text(json.consName);
				 }
				if(json.consNo){
					 $("#form2\\|4").text(json.consNo);
				 }
				if(json.elecAddr){
					 $("#form2\\|5").text(json.elecAddr);
				 }
				if(json.orgName){
					 $("#form2\\|6").text(json.orgName);
				 }
				if(json.lineName){
					 $("#form2\\|7").text(json.lineName);
				 }
				if(json.elecType){
					 $("#form2\\|8").text(json.elecType);
				 }
				if(json.paYmode){
					 $("#form2\\|9").text(json.paYmode);
				 }
				if(json.powerOffCode){
					 $("#form2\\|10").text(json.powerOffCode);
				 }  
			}
		});
    }	
}
function orgNoToOrgName(o_orgNo){
	if(o_orgNo){
		$.ajax({
			type : "POST",
			url : "/SGMC/tsupport_csonline/rest/regionCtrl/orgToName",
			async : false,
			data:{ 
				 orgNo:o_orgNo
				},
			dataType : 'json',
			success : function(json){
				orgName=json; 
			},
			error : function(obj){
				$.ligerDialog.error("供电单位转换省市标识异常，请联系管理员");
			}
		});
	}
}

/*坐席端历史记录插入*/
function getChatRecord(){
	 var allChilds = $("#chat-cntent-con").children("li");
	 //取begintime，打下时间戳，点击查询按钮，只查询从这个begintime之前的历史会话记录
     var historyTime = allChilds.eq(0).find(".historyTime").text();
    loadhistory(historyTime);
   }

function loadhistory(historyTime){
	if(firstSerachFlag){
		webchat.insertMiddleHistoryMessage("<font class='MoreChat_style'>-------------聊天历史记录-------------</font>"); 
	}
	firstSerachFlag = false;
	getHistoryMsg_web(historyTime,function(json){
		/* 先清空历史记录 */
		//$("#historyDiv").html("");
		var chatHtml = "";
		 var totalRows = json.Total;
		 //   resultCode目前的功能是检查是否查出数据    
		   //以后的功能做错误检测       resultCode:0 后台正常查询       resultCode:1  后台报错  
		if(json.resultCode=="0"){
             //显示结果
   			var smsDetails = json.Rows;
             //当前页的遍历数目
             var curItemsCount = json.curItemsCount;
			if(totalRows>0){
				for (var j = 0; j <curItemsCount; j++) {
					var chatRecord = smsDetails[j];
					var  beginTime= chatRecord.beginTime;
					//截取时间字符串，去掉小数点
					var endIndex = (beginTime.lastIndexOf(".")==-1)?beginTime.length:beginTime.lastIndexOf(".");
					var time = beginTime.substring(0,endIndex);
					
					var fromNumber = chatRecord.fromNumber;
					var img_big;
					var img_small;
					var img_url;
					if(chatRecord.contentType==1){
						//历史记录的截图地址
						img_big=chatRecord.content.split("|")[0];
						img_small=chatRecord.content.split("|")[1];
						img_big_path=chatRecord.url+img_big;
						img_small_path=chatRecord.url+img_small;
					}
					//座席发送的内容
					if(webchat.isAgent(fromNumber)){
						if(chatRecord.contentType==0){
							var content = webchat.replaceAllImages_text(chatRecord.content);
							webchat.insertAgentHistoryRecordMsg(content,time,chatRecord.userName);
						}else if(chatRecord.contentType==1){
							webchat.insertAgentHistoryRecordPic(img_small_path,img_big_path,time,chatRecord.userName);
						}
						
					//客户发送的内容
					}else{
						//解密从u3c_sms_details返回的加密后的拼接字符串
						var firstIndex = chatRecord.userName.indexOf("|");
						/*var lastIndex =  chatRecord.userName.lastIndexOf("|");*/
						var custName = Decrypt(chatRecord.userName.substring(0,firstIndex),'csonlinecsonline');
						if(chatRecord.contentType==0){
							var content = webchat.replaceAllImages_text(chatRecord.content);
							webchat.insertCusHistoryRecordMsg(content,time,custName);
						}else if(chatRecord.contentType==1){
							webchat.insertCusHistoryRecordPic(img_small_path,img_big_path,time,custName);
						}else{
							webchat.insertCusHistoryFile(chatRecord.content,chatRecord.url,time,custName);		
							
						}
						
						
					}
				}
			}else{
				webchat.insertMiddleHistoryMessage("<font class='noMoreChat_style'>没有查询到历史聊天记录!</font>");
			}
			

		}else{
			webchat.insertMiddleHistoryMessage("<font class='noMoreChat_style'>没有查询到历史聊天记录!</font>");
		}
	});
	//remove load more button
	$("#loadMore").remove();
	 webchat.insertMiddleHistoryMessage("<div><a id='loadMore' hidefocus='true' onClick='getChatRecord();return false;' href='javascript:void(0)'><font color='blue'>点击加载更多历史记录</a></div>");
     //判断如果没有数据，则禁用a标签
     var noChat = $(".middle").children();
	 if(noChat.hasClass("noMoreChat_style")){
			$("#loadMore").remove();
	  }
};
   
  /*  异步回调历史记录信息 */
  // 获取历史聊天记录接口 提供服务端接口
function getHistoryMsg_web(historyTime,callback){
//userId 取全局变量
var urlPath = '/SGMC/tsupport_csonline/rest/ucAgentCtrl/getHisRecords';
/**
 * beginTime:global variable ,current enter time
 * endTime: global variable , serven days ago time
 * historyTime: history record time
 * userId : chat.js  global variable
 */
var url = urlPath +"?userId="+userId+"&beginTime="+beginTime+"&endTime="+endTime+"&historyTime="+historyTime;
doJsonGetRecord(url, function(result){
callback(result);
});
};
  /** ****************webdchat 返回值处理函数******************* */
function doJsonGetRecord(url, callback){
$.ajax({
	type : "POST",
	url : url,
	traditional: true,
	async : false,
	dataType : 'json',
	success : function(map){
		 callback(map);
	},
	error : function(obj){
		$.ligerDialog.error("系统异常，请联系管理员");
	}
});
};