<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script id="templatePaintShopPopUp" type="text/x-handlebars-template">
	<div class="layerHeader">
        <h2 id="popTitle">{{attributes.shopType}} 도장공장 - {{id}}</h2>
        <button type="button" data-seq="{{id}}" id="paintshopPopCloseButton" class="layerClose" title="닫기">닫기</button>
    </div>
    <div class="layerContents">
        <ul class="view">
            <li>
    			<div id="paintshopPopContent">
						관리번호 : {{attributes.no}}<br>
						level0 : {{attributes.level0}}<br>
						level1 : {{attributes.level1}}<br>
						level2 : {{attributes.level2}}<br>
						가로(M) : {{attributes.width}}<br>
						세로(M) : {{attributes.length}}<br>
						높이(M) : ({{attributes.height}}<br>
						문 너비(M) : ({{attributes.doorWidth}}<br>
						문 높이(M) : ({{attributes.doorHeight}}<br>
						문 종류(M) : ({{attributes.doorType}}<br>
				</div>	
            </li>
        </ul>
    </div>
</script>