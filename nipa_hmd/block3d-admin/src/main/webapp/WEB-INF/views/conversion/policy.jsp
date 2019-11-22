<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglib.jsp" %>
<%@ include file="/WEB-INF/views/common/config.jsp" %>

<!DOCTYPE html>
<html lang="${accessibility}">
<head>
	<meta charset="utf-8">
	<meta name="referrer" content="origin">
	<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
	<meta name="robots" content="index,nofollow"/>
	<title>설계파일 변환 관리 | 현대 미포 조선</title>
	<link rel="shortcut icon" href="/images/favicon.ico">
	<%-- <link rel="stylesheet" href="../css/style.css?cacheVersion=${policy.contentCacheVersion}"/>
	<link rel="stylesheet" href="../css/fontawesome-free-5.2.0-web/css/all.min.css?cacheVersion=${policy.contentCacheVersion}">
	
	<script type="text/javascript" src="../js/common.js?cacheVersion=${policy.contentCacheVersion}"></script>
	<script type="text/javascript" src="../externlib/jquery-3.3.1/jquery.min.js?cacheVersion=${policy.contentCacheVersion}"></script>
	<script type="text/javascript" src="../externlib/handlebars-4.1.2/handlebars.js?cacheVersion=${policy.contentCacheVersion}"></script>
	<script type="text/javascript" src="../js/menu.js?cacheVersion=${policy.contentCacheVersion}"></script>
	<script type="text/javascript" src="../js/message.js?cacheVersion=${policy.contentCacheVersion}"></script> --%>
	<link rel="stylesheet" href="../css/style.css"/>
	<!-- <link rel="stylesheet" href="../css/fontawesome-free-5.2.0-web/css/all.min.css"> -->
	<link rel="stylesheet" href="../externlib/jquery-ui-1.12.1/jquery-ui.min.css"/>
	
	<script type="text/javascript" src="../js/common.js"></script>
	<script type="text/javascript" src="../externlib/jquery-3.3.1/jquery-3.3.1.min.js"></script>
	<script type="text/javascript" src="../externlib/jquery-ui-1.12.1/jquery-ui.min.js"></script>
	<script type="text/javascript" src="../externlib/handlebars-4.1.2/handlebars.js"></script>
	<!-- <script type="text/javascript" src="../js/menu.js"></script>
	<script type="text/javascript" src="../js/message.js"></script> -->
	<script type="text/javascript">
		$(document).ready(function() {
			//$('#tabs').tabs();
	    });
	</script>
</head>
<body>
<%@ include file="/WEB-INF/views/layouts/header.jsp" %>
<div id="contentsWrap">
    <%@ include file="/WEB-INF/views/layouts/left-menu.jsp" %>
    <div class="contents">
        <!-- db 자동화 구성해야 함 -->
        <h2 class="hide">설계파일 변환관리</h2>
        <div class="titleWrap">
            <h3>변환 설정</h3>
            <ul class="location">
                <li><a href="/conversion/policy">홈</a></li>
                <li>변환 설정</li>
            </ul>
        </div>
		<!-- db 자동화 구성해야 함 -->
		<div class='boardForm policy'>
			<form:form id="updateConversionPolicy" modelAttribute="conversionPolicy" method="post" onsubmit="return false;">
				<div id="conversionPolicy">
					<table>
						<colgroup>
							<col style="width: 25%">
							<col style="width: 50%">
						</colgroup>
						<tr>
							<th>
								<form:label path="revRepository">설계파일 저장소</form:label>
								<span class="must">*</span>
							</th>
							<td>
								<span>${conversionPolicy.revRepository}</span>
							</td>
						</tr>
						<tr>
							<th>
								<form:label path="conversionInputRepository">설계파일 로컬저장소</form:label>
								<span class="must">*</span>
							</th>
							<td>
								<span>${conversionPolicy.conversionInputRepository}</span>
							</td>
						</tr>
						<tr>
							<th>
								<form:label path="conversionOutputRepository">변환파일 로컬저장소</form:label>
								<span class="must">*</span>
							</th>
							<td>
								<span>${conversionPolicy.conversionOutputRepository}</span>
							</td>
						</tr>
						<tr>
							<th>
								<form:label path="f4dRepository">변환파일 최종저장소</form:label>
								<span class="must">*</span>
							</th>
							<td>
								<span>${conversionPolicy.f4dRepository}</span>
							</td>
						</tr>
						<tr> 
							<th>
								<form:label path="conversionLogRepository">변환 로그파일 저장소</form:label>
								<span class="must">*</span>
							</th>
							<td>
								<span>${conversionPolicy.conversionLogRepository}</span>
							</td>
						</tr>
						<tr>
							<th>
								<form:label path="converterRepository">변환모듈(F4DConverter) 경로</form:label>
								<span class="must">*</span>
							</th>
							<td>
								<span>${conversionPolicy.converterRepository}</span>
							</td>
						</tr>
					</table>
					<div class="centerBtn">
                        <button class="point" type="submit" onclick="updateConversionPolicy()">수정</button>
					</div>
				</div>
			</form:form>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/layouts/footer.jsp" %>
</body>

</html>