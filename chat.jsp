<%@ page language="java" import="java.util.*,java.io.*,org.apache.commons.lang.StringUtils" pageEncoding="utf-8"%>
<%@ page isELIgnored="false"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
		<title></title>
		<jsp:include page="public.jsp" />
		<link href="../../css/styles/style.css" rel="stylesheet" type="text/css" />
		<link href="../../css/style/jquery.jscrollpane.codrops1.css" rel="stylesheet" type="text/css" />
		<link href="../../js/lib/ligerUI/skins/Gray/css/all.css" rel="stylesheet" type="text/css" /> 
		<link href="../../css/ucagent/chat.css" rel="stylesheet" type="text/css" /> 
		<link href="../../js/lib/ligerUI/skins/Gray/css/dialog.css" rel="stylesheet" type="text/css" /> 
		<style>
			/* 新增 */
			#layout{
			   margin-left:2px;
			}
			
		</style>
		<%
			// jobId
			String jobId = StringUtils.trimToEmpty(request.getParameter("jobId"));
			if ("undefined".equals(jobId)) {
				jobId = "";
			}
			// 客户编号
			String customerNumber = StringUtils.trimToEmpty(request.getParameter("customerNumber"));
			if ("undefined".equals(customerNumber)) {
				customerNumber = "";
			}
			// 坐席编号
			String agentNumber = StringUtils.trimToEmpty(request.getParameter("agentNumber"));
			if ("undefined".equals(agentNumber)) {
				agentNumber = "";
			}
			
			String direction = StringUtils.trimToEmpty(request.getParameter("direction"));
			if ("undefined".equals(direction)) {
				direction = "";
			}
			
			String agentServiceId = StringUtils.trimToEmpty(request.getParameter("agentServiceId"));
			if ("undefined".equals(agentServiceId)) {
				agentServiceId = "";
			}
			
			String position = StringUtils.trimToEmpty(request.getParameter("position"));
			if ("undefined".equals(position)) {
				position = "";
			}
			// 登录用户账号
			String nickname = StringUtils.trimToEmpty(request.getParameter("nickname"));
			if ("undefined".equals(nickname)) {
				nickname = "";
			}
			// 连接状态
			String connectFlag = StringUtils.trimToEmpty(request.getParameter("connectFlag"));
			if ("undefined".equals(connectFlag) || connectFlag == "") {
				connectFlag = "0";
			}
			//2016/11/01    设置用户信息    begin
			String sourceType = StringUtils.trimToEmpty(request.getParameter("sourceType"));
			if ("undefined".equals(sourceType) || sourceType == "") {
				sourceType = "";
			}
			String sourceContent = StringUtils.trimToEmpty(request.getParameter("sourceContent"));
			if ("undefined".equals(sourceContent) || sourceContent == "") {
				sourceContent = "";
			}
			// 客户联系方式
			String customerContact = StringUtils.trimToEmpty(request.getParameter("customerContact"));
			if ("undefined".equals(customerContact) || customerContact == "") {
				customerContact = "";
			}
			// 设置工单编号
			String appNo = StringUtils.trimToEmpty(request.getParameter("appNo"));
			if ("undefined".equals(appNo) || appNo == "") {
				appNo = "";
			}
			// ip地址
			String ipAddr = StringUtils.trimToEmpty(request.getParameter("ipAddr"));
			if ("undefined".equals(ipAddr) || ipAddr == "") {
				ipAddr = "";
			}
			// 默认用电编号
			String cusAccount = StringUtils.trimToEmpty(request.getParameter("cusAccount"));
			if ("undefined".equals(cusAccount) || cusAccount == "") {
				cusAccount = "";
			}
			// 行政区域
			String areaNo = StringUtils.trimToEmpty(request.getParameter("areaNo"));
			if ("undefined".equals(areaNo) || areaNo == "") {
				areaNo = "";
			}
			
			// 行政区域描述
			String area_desc = StringUtils.trimToEmpty(request.getParameter("area_desc"));
			if ("undefined".equals(area_desc) || areaNo == "") {
				area_desc = "";
		    }			
			// 接口调用标识
			String t = StringUtils.trimToEmpty(request.getParameter("t")); 
			//2016/11/01    设置用户信息    end
			
			// userId
			String userId = StringUtils.trimToEmpty(request.getParameter("userId"));
			if ("undefined".equals(userId) || userId == "") {
				userId = "";
			}
			String userTel = StringUtils.trimToEmpty(request.getParameter("userTel"));
			if ("undefined".equals(userTel) || userTel == "") {
				userTel = "";
			}
		%>
		<script type="text/javascript">
			var jobId = "<%=jobId%>";
			var customerNumber = "<%=customerNumber%>";
			var agentNumber = "<%=agentNumber%>";
			var direction = "<%=direction%>";
			var agentServiceId = "<%=agentServiceId%>";
			var position = "<%=position%>";
			var nickname = "<%=nickname%>";
			var connectFlag = "<%=connectFlag%>";
			var sourceType ="<%=sourceType%>";
			var customerContact ="<%=customerContact%>";
			var appNo = "<%=appNo %>";
			var ipAddr = "<%=ipAddr %>";
			var cusAccount = "<%=cusAccount %>";
			var areaNo = "<%=areaNo %>";
			var area_desc = "<%=area_desc %>";
			var sourceContent = '<%=sourceContent %>';
			var t = "<%=t %>";
			var userId = '<%=userId %>';
			var userTel='<%=userTel%>';
		</script>
	</head>
	<body>
		<input id="appNo" name="appNo" type="hidden" />
		<input id="jobId" type="hidden" value="${agent.jobId}"/>
		<input id="sourceType" type="hidden" value="${agent.sourceType}"/>
		<input id="serviceType" type="hidden" value="${agent.serviceType}"/>
		<input id="customerNumber" type="hidden" value="${agent.customerNumber}"/>
		<input id="agentNumber" type="hidden" value="${agent.agentNumber}"/>
		<input id="fromNumber" type="hidden" value="${agent.fromNumber}"/>
		<input id="toNumber" type="hidden" value="${agent.toNumber}"/>
		<input id="agentServiceId" type="hidden" value="${agent.agentServiceId}"/>
		<input id="connectFlag" type="hidden" value="${agent.connectFlag}"/>
	
		<!-- chat begin -->
		<div id="layout">
			<div position="left" title='<span class="user_nickName">用户名:(<%=nickname %>)</span>&nbsp;<div id="wkstButton">编辑工单</div>'>
				<div id="chat-in-net" name="chat-in-net" >
					<!-- 这里是聊天内容的填充部分 -->
					<div class="chat-cntent" style="overflow: auto;">
						<ul class="chat-cntent-con" id="chat-cntent-con">
							
						</ul>
						<div id="chat_end" style="height:0px; overflow:hidden"></div>
					</div>
					<div class="send-msg">
						<!-- <select id="chatLan_type" name="chatLan_type" class="chat-greeting" >
			            </select> -->
			            <div id="topmenu"></div>
			            <a title="表情" style="float:left;_margin: 0px 2px;*margin: 0px 2px;" class="icon-emotion"></a>
						<!-- <input id="show_chatlan" name="show_chatlan" type="checkbox" checked="checked" style="float:left; margin:5px 0 0 3px;_margin:0px 0 0 3px;*margin:0px 0 0 3px;" />
						<span style="float:left; margin:3px 0 0 1px" >快捷键</span> -->
						<a  hidefocus="true" id="btnCapture" href="javascript:StartCapture()"></a>
						<!--  常用语搜索框  start-->
						<div class="gover_search">
					        <!--<span class="search_t">关键词匹配搜索</span>-->
					        <input type="text" class="input_search_key" id="gover_search_key" placeholder="请输入关键词直接搜索" />
					        <div class="search_suggest" id="gov_search_suggest">
					            <ul>
					            </ul>
					        </div>
						</div>
						<!--  常用语搜索框  end-->
						<div class="btn-operate" style="display: inline-block; float: right; margin-right: 5px;">
							<a href="javascript:" class="btn-self btn-self-grey" id="transAgent" style="top: 0px;">转接座席</a>
							<a href="javascript:" class="btn-self btn-self-grey" id="transQueue" style="top: 0px;">转接队列</a>
							<!-- <a href="javascript:" class="btn-self btn-self-grey" id="show-history" data-show="true" style="top: 0px;">历史记录</a> -->
							<a href="javascript:" class="btn-self btn-self-grey" id="satBtn" style="top: 0px;">满意度</a>
							<a href="javascript:" class="btn-self btn-self-grey" id="hangupBtn" style="top: 0px;">挂断</a>
						</div>
					</div>
					<div class="input-msg">
						<div class="putin" id="putin" placeholder="输入..." contenteditable="true" style="overflow:auto; outline-style: none;"></div>
							<!-- 发送按钮	 -->
							<!-- start -->		
						 <div class="container" tabindex=1>
							    <div class="content_btn">
							         <span id="sendBtn">发送</span><div id="triangle"></div>
							    </div>
				        </div>
				        <div class="jump">
							    <input type="checkbox" name="show_chatlan" id="show_chatlan" checked="checked"/>
							    <label for="show_chatlan" >按Enter键发送</label>
				       </div>
						<!-- over  --> 
						<div id="chat-history">
							<ul id="records">
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div position="center">
				<div id="tab2" style="overflow: hidden; border: 1px solid #A3C0E8;">
					<div title="用户资料">
						<div>
							<div id="listRightbox1">
								<form id="form2"></form>
								<div id="manyCons"  style='position:absolute;left:120px;color:#388478;font-size:16px;font-weight:bold;cursor:pointer'>查看更多</div>
							</div>
						</div>
					</div>
					<div title="服务历史" >
						<div class="box">
							<div id="listRightbox2">
							      <div id="sv" style="overflow-y:auto;overflow-x:hidden;width:37%;height:50%;"></div>
							</div>
							<div id="manyServ"  style='position:absolute;left:120px;color:#388478;font-size:16px;font-weight:bold;cursor:pointer'>查看更多</div>
						</div>
					</div>
					<div title="停电信息" >
						<div class="box">
							<div id="listRightbox3"> 
							     <div id="ml" style="overflow-y:auto;overflow-x:hidden;width:37%;height:50%;"></div> 
							</div>
							<div id="manyPower"  style='position:absolute;left:120px;color:#388478;font-size:16px;font-weight:bold;cursor:pointer'>查看更多</div> 
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="bottomBar"><img class="bottomBar" src="../../css/img/u1618.png"></img></div>
		 <!-- /chart end -->
		 <script src="../../js/ucagent/removeCssStyle.js" type="text/javascript"></script>
		 <script src="../../js/ucagent/autoPromptUsexpl.js" type="text/javascript"></script>
		<script src="../../js/utilFunction/aes.js" type="text/javascript"></script>
		<script src="../../js/utilFunction/mode-ecb.js" type="text/javascript"></script>
		<script src="/SGMC/tsupport_csonline/js/singlemakeup/ligerui.all.js" type="text/javascript"></script> 
		<script src="../../js/lib/ligerUI/js/plugins/ligerForm.js" type="text/javascript"></script>
		<script src="../../js/assets/jquery.jscrollpane.min.js" type="text/javascript"></script>
		<script src="../../js/assets/jquery.mousewheel.js" type="text/javascript"></script>
		<script src="../../js/assets/ScrollUtil.js" type="text/javascript"></script>
		<script src="../../js/assets/jquery.slimscroll.min.js" type="text/javascript"></script>
		<script src="../../js/dwr/jquery.qqFace.js" type="text/javascript"></script>
		<script src="../../js/ucagent/pic.js" type="text/javascript"></script> 
		<script src="../../js/capture/js/jquery.md5.js" type="text/javascript"></script>
		<script src="../../js/capture/js/jquery.json-2.3.min.js" type="text/javascript"></script>
		<script src="../../js/capture/js/niuniucapture.js" type="text/javascript"></script>
		<script src="../../js/capture/js/capturewrapper.js" type="text/javascript"></script>
		<script src="../../js/ucagent/AgentBarImpl.js" type="text/javascript"></script>
		<script src="../../js/ucagent/webchat.js" type="text/javascript"></script> 
		<script src="../../js/ucagent/chat.js" type="text/javascript"></script> 
		<script src="../../js/ucagent/transfer.js" type="text/javascript"></script> 
	</body>
</html>