<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="snb">
    <ul>
<%-- <c:forEach var="userGroupMenu" items="${cacheUserGroupMenuList }" varStatus="status">
	<c:if test="${userGroupMenu.depth == 1 }">
		<li id="${userGroupMenu.htmlId }" onclick="location.href='${userGroupMenu.url }'">${userGroupMenu.name }</li>
	</c:if>
</c:forEach> --%>
		<li id="conversionPolicy" onclick="location.href='/conversion/policy'">변환 설정</li>
		<li id="conversionLog" onclick="location.href='/conversion/logList'">변환 로그</li>
		<li id="ManualConversion" onclick="location.href='/conversion/manual'">수동 변환</li>
    </ul>
</div>

<script type="text/javascript">
    var currentUrl = location.href;
    var targetMenu;
    /* if( currentUrl.indexOf("/user/list-group") >= 0
            || currentUrl.indexOf("/user/groups") >= 0
            || currentUrl.indexOf("/user/group") >= 0 ) {
        targetMenu = 'userGroupMenu';
    } else if( currentUrl.indexOf("/user/list") >= 0
    		|| currentUrl.indexOf("/user/input") >= 0
			|| currentUrl.indexOf("/user/modify") >= 0) {
            targetMenu = 'userMenu';
    } else if( currentUrl.indexOf("/access/list") >= 0 ) {
        targetMenu = 'logMenu';
    } else if( currentUrl.indexOf("/menu/list") >= 0
            || currentUrl.indexOf("/menus") >= 0
            || currentUrl.indexOf("/menu/input") >= 0 ) {
        targetMenu = 'menuMenu';
    } else if( currentUrl.indexOf("/role/list") >= 0
            || currentUrl.indexOf("/roles") >= 0
            || currentUrl.indexOf("/role/input") >= 0 ) {
        targetMenu = 'roleMenu';
    } else if( currentUrl.indexOf("/block-policy") >= 0 ) {
        targetMenu = 'blockPolicyMenu';
    } else if( currentUrl.indexOf("/facility") >= 0) {
        targetMenu = 'facilityMenu';
    } else if( currentUrl.indexOf("/statistic") >= 0) {
        targetMenu = 'statisticMenu';
    } */
    if (currentUrl.indexOf("/conversion/policy") >= 0) {
        targetMenu = 'conversionPolicy';
    } else if (currentUrl.indexOf("/conversion/logList") >= 0) {
        targetMenu = 'conversionLog';
    } else {
        targetMenu = 'ManualConversion';
    }

    $('#'+ targetMenu +'').addClass('selected');
</script>