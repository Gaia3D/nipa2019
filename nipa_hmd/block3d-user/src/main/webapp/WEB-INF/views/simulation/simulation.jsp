<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="btnGroup">
	<!-- 사용자 설정 정보 ==> settings.js -->
	<button class="textBtn" data-type="crane" id="simulCraneBtn">크레인</button>
	<button class="textBtnSub" data-type="paint" id="simulPaintBtn">도장공장간섭</button>
	<button class="textBtnSub" data-type="block" id="simulBlockBtn">블록</button>
</div>
<%@include file="/WEB-INF/views/simulation/simulation-crane.jsp"%>
<%@include file="/WEB-INF/views/simulation/simulation-paint.jsp"%>
<%@include file="/WEB-INF/views/simulation/simulation-block.jsp"%>