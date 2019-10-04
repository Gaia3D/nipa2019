<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<ul class="paintList section" id="paintInterfare">
    <!-- layer 삽입되는영역 ==> layer.js ==> createLayerHtmlParents() -->
    <li>
		<div>
			<span>블록 : </span>
			<span id="paintLayerBlockName" style="font-weight:900;"></span>
        </div>
    </li>
    <li>
		<div>
			<span>TP높이(M) : </span>
			<input type="text" id="blockChkTpHeight" value="1" />
        </div>
    </li>
    <li>
		<div>
			<span>정반높이(M) : </span>
			<input type="text" id="blockChkPlateHeight" value="0" />
		</div>
	</li>
	<li>
        <div>
            <span>도장공장 : </span>
            <select id="blockChkFactories" class="combo" data-min-length=0>
                <option value="">전체</option>
            </select>
        </div>
    </li>
    <li>
        <div>
            <span>안전율설정(%) : </span>
            <input type="text" id="blockChkSafePct" value="100" />
        </div>
    </li>
    <li class="blockRoateList">
        <button type="button" data-type="x" class="textBtnSub" style="width:30%;">x회전</button>
        <button type="button" data-type="y" class="textBtnSub" style="width:30%;">y회전</button>
        <button type="button" data-type="z" class="textBtnSub" style="width:30%;">z회전</button>
    </li>
    <li>
        <button type="button" id="blockFactoryChkButton" class="textBtn full">간섭 체크 실행</button>
    </li>
</ul>
<ul class="paintResultList section" id="paintInterfareResult" style="display:none">
    <!-- layer 삽입되는영역 ==> layer.js ==> createLayerHtmlParents() -->
    <li>
		<div>
			<span >공장 입구 높이</span>
			<span id="openingHeight" style="font-weight:900;">10.213413m</span>
        </div>
    </li>
    <li>
		<div>
			<span title="블록 높이 + TP높이 + 정반높이">블록 높이</span>
			<span id="blockTotalHeight" style="font-weight:900;">8.1233m</span>
        </div>
    </li>
    <li>
		<div>
			<span>결과</span>
			<span id="interfareResult" style="font-weight:900;">안전</span>
        </div>
    </li>
</ul>
<ul class="paintCantList section">
    <!-- layer 삽입되는 영역 ==> layer.js ==> createLayerHtmlParents() -->
    <li style="font-weight:900;">
		블록메뉴에서 블록 선택 후 '도장공장간섭'을 실행하거나 
		지도상에서 블록을 선택해주세요.
    </li>
</ul>