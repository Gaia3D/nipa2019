<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!-- 툴바 지도 기능 -->
<div class="ctrlWrap">
    <!-- <div class="moving">
        <button type="button" title="블록이동" id="checkBlockMove" class="">블록이동</button>
    </div> -->
    <div class="zoom">
        <!-- <button type="button" class="zoomall" title="전체보기">전체보기</button> -->
        <button type="button" id="mapCtrlZoomIn" class="zoomin" title="확대">확대</button>
        <button type="button" id="mapCtrlZoomOut" class="zoomout" title="축소">축소</button>
        <button type="button" class="reset" title="초기화">초기화</button>
        <button type="button" id="mapCtrlDistance" class="measures distance" data-type="LineString" title="거리">거리</button>
        <button type="button" id="mapCtrlArea" class="measures area" data-type="Polygon" title="면적">면적</button>
    </div>
    <div class="rotate">
        <button type="button" id="rotateReset" class="rotateReset " title="방향초기화">방향 초기화</button>
        <input type="text" id="rotateInput" placeholder="0">&deg;
        <input type="text" id="pitchInput" placeholder="0">&deg;
        <button type="button" id="rotateLeft" class="rotateLeft" data-direction="-18" title="왼쪽으로 회전">왼쪽으로 회전</button>
        <button type="button" id="rotateRight" class="rotateRight" data-direction="18" title="오른쪽으로 회전">오른쪽으로 회전</button>
    </div>
	<div class="index">
		<button type="button" title="범례" class="on">범례</button>
	</div>

</div>

<!-- S: 레이어 / 거리 -->
		<div id="distanceLayer" class="option" data-id="distance" style="top:55px; right: 23px; display:none;">
			<div class="layerHeader">
				<h2 class="hide">거리측정</h2>
				<!-- 측정 전
				<button type="button" class="disableA">초기화</button>
				-->
				<!-- 측정 후 -->
				<button type="button" class="focusA">초기화</button>
				<button type="button" class="layerClose" title="닫기">닫기</button>
			</div>
			<div class="layerContents">
				<div class="measure distance">
					거리단위
					<select id="distanceFactor">
						<option value="1" selected="selected">m (미터)</option>
						<option value="1000">km (킬로미터)</option>
						<option value="1852">nmi (해리)</option>
						<option value="0.0254">in (인치)</option>
						<option value="0.3048">ft (피트)</option>
						<option value="0.9144">yd (야드)</option>
						<option value="1609.344">mi (마일)</option>
					</select>
					<br>
					<span>0 m</span>
				</div>
			</div>
		</div>
		<!-- E: 레이어 / 거리 -->

		<!-- S: 레이어 / 면적 -->
		<div id="areaLayer" class="option" data-id="area" style="top:55px; right: 23px; display:none;">
			<div class="layerHeader">
				<h2 class="hide">면적측정</h2>
				<!-- 측정 전
				<button type="button" class="disable">초기화</button>
				-->
				<!-- 측정 후 -->
				<button type="button" class="focusA">초기화</button>
				<button type="button" class="layerClose" title="닫기">닫기</button>
			</div>
			<div class="layerContents">
				<div class="measure area">
					면적측정
					<select id="areaFactor">
						<option value="1" selected="selected">m² (제곱미터)</option>
						<option value="1e+6">km² (제곱킬로미터)</option>
						<option value="0.8361">yd² (제곱야드)</option>
						<option value="2.59e+6">mi² (제곱마일)</option>
						<option value="4046.856">acre (에이커)</option>
						<option value="10000">ha (헥타르)</option>
					</select>
					<br>
					<span>0 m²</span>
				</div>
			</div>
		</div>
		<!-- E: 레이어 / 면적 -->


<!-- 마우스 포지션  -->
<div><div id="mouse-position"></div></div>

<!-- 항공영상 촬영일자 -->
<div id="airPhotoDate" class="airPhotoDate"></div>

<!-- 범례 - 현재 사용 X -->
<div class="labelLayer" style="display: ;">
    <div class="layerHeader">
        <h3><b>범례</b></h3>
        <button type="button" class="layerClose" title="닫기">닫기</button>
    </div>
    <div class="layerContents">
    	<ul class="category">
    		<li>호선</li>
    	</ul>
   		<ul id="legendBlock"></ul>
    	<ul class="category">
    		<li>수심</li>
    	</ul>
   		<ul>
   			<li><img src="/images/depth_0.png">8.0 미만</li>
			<li><img src="/images/depth_1.png">8.0	~ 8.1</li>
			<li><img src="/images/depth_2.png">8.1 ~ 8.2</li>
			<li><img src="/images/depth_3.png">8.2 ~ 8.3</li>
			<li><img src="/images/depth_4.png">8.3 ~ 8.4</li>
			<li><img src="/images/depth_5.png">8.4 ~ 8.5</li>
			<li><img src="/images/depth_6.png">8.5 이상</li>
   		</ul>
    </div>
</div>

<!-- 접기 펼치기 버튼 - 현재 사용 X -->
<div class="navBtn">
    <button type="button" class="on" title="보기">보기</button>
</div>