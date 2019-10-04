<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script id="templateCranePopup" type="text/x-handlebars-template">
	<div class="layerHeader">
        <h2 id="popTitle">{{attributes.craneType}} 크레인 - {{attributes.craneId}}호</h2>
        <button type="button" data-seq="{{id}}" id="cranePopCloseButton" class="layerClose" title="닫기">닫기</button>
    </div>
    <div class="layerContents">
        <ul class="view">
            <li>
				{{#ifMatch type 'JIP'}}
    				<div id="cranePopContent">
						구분 : {{attributes.division}}<br>
						관리부서 : {{attributes.deptName}}<br>
						TYPE : {{attributes.type}}<br>
						전고(M) : {{attributes.height}}<br>
						전장(M) : {{attributes.length}}<br>
						자중(TON) : {{attributes.weight}}<br>
						MAIN 최대부하 : ({{attributes.mainLoadShort}}~{{attributes.mainLoadLong}}) {{attributes.mainLoadWeight}} TON<br>
						MAIN 최대반경 : ({{attributes.mainRadiusLength}}) {{attributes.mainRadiusWeight}} TON<br>
						AUX 최대부하 : ({{attributes.auxLoadShort}}~{{attributes.auxLoadLong}}) {{attributes.auxLoadWeight}} TON<br>
						AUX 최대반경 : ({{attributes.auxRadiusLength}}) {{attributes.auxRadiusWeight}} TON<br>
					</div>
    			{{/ifMatch}}
				{{#ifMatch type 'TOWER'}}
    				<div id="cranePopContent">
						구분 : {{attributes.division}}<br>
						관리부서 : {{attributes.deptName}}<br>
						TYPE : {{attributes.type}}<br>
						전고(M) : {{attributes.height}}<br>
						전장(M) : {{attributes.length}}<br>
						자중(TON) : {{attributes.weight}}<br>
						최대부하 : ({{attributes.maxLoadLength}}) {{attributes.maxLoadWeight}} TON<br>
						최대반경 : ({{attributes.maxRadiusLength}}) {{attributes.maxRadiusWeight}} TON<br>
					</div>
    			{{/ifMatch}}
            </li>
        </ul>
        <button id="cranePopPositionMove" data-seq="{{id}}" class="textBtn">이동</button>
		<button id="cranePopPositionInit" data-seq="{{id}}" class="textBtn">초기화</button>
    </div>
</script>