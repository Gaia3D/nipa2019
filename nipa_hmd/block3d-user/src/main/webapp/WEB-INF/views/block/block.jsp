<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div id="blockSearch">
    <form id="searchBlockForm" onsubmit="return false;">
    <ul class="section block" id="blockSearchArea" style="height: 165px;">
        <!-- <li>블록 찾기</li> -->
        <li>
            <label for="sornS"><input type="radio" id="sornS" name="sorn" value="S" checked="checked">호선</label>
            <label for="sornN"><input type="radio" id="sornN" name="sorn" value="N">비호선</label>
            <label for="sornJ"><input type="radio" id="sornJ" name="sorn" value="J">정반</label>
            <label for="sornM"><input type="radio" id="sornM" name="sorn" value="M">M/E 및 중조</label>
        </li>
        <li>
            <div id="shipNoCombo">
                <span>호선</span>
                <select id="selectShipNo" class="combo" data-min-length=0>
                    <option value="">전체</option>
                </select>
            </div>
        </li>
        <li>
            <div>
                <span class="label">블록</span>
                <select id="selectBlock" class="combo" data-min-length=0>
                    <option value="">전체</option>
                </select>
            </div>
        </li>
        <li>
            <button type="button" id="blockSearchButton" class="textBtn full">블록 검색</button>
        </li>
    </ul>
    </form>
    <div class="boardList" id="blockResultArea">
        <ul class="boardSub">
            <li>
                <label for="viewOnlySearchFeature">
                    <input type="checkbox" id="viewOnlySearchFeature"> 대상 블록만 보기
                </label>
            </li>
            <li>조회건수 : <span id="blockCount" class="spanBlue">0</span> 건</li>
        </ul>
        <table id="blockResultHeader">	<!-- 핸들바로 변경 필요. if문 -->
            <colgroup>
                <col width="90px">
                <col width="90px">
                <col width="70px">
                <col width="">
            </colgroup>
            <thead>
                <tr>
                    <th>사업장</th>
                    <th>호선</th>
                    <th>블록</th>
                    <th>지번</th>
                </tr>
            </thead>
        </table>
        <div class="searchArea">
            <table>
                <tbody id="blockResultBody">
                    <tr>
                        <td colspan="4">검색된 데이터가 없습니다.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    <%@include file="/WEB-INF/views/block/list-pagination.jsp"%>
    </div>
</div>

<!-- 레이어 / 툴팁 -->
<div id="tooltip" class="tooltip" style="display: none;"></div>
<!-- 레이어 / 상세조회 -->
<!--div id="pop" class="layer" style="display: none;position:absolute;">
    <div class="layerHeader">
        <h2 id="popTitle"></h2>
        <button type="button" id="popCloseButton" class="layerClose" title="닫기">닫기</button>
    </div>
    <div class="layerContents">
        <ul class="view">
            <li>
                <div id="popContents"></div>
            </li>
        </ul>
        <button type="button" id="popOpenProgress" class="textBtn full" data-on="공정정보펼치기" data-off="공정정보접기">공정정보펼치기</button>
        <div class="viewMore">
            <div id="popContentsDetail" style="display: none;"></div>
        </div>
    </div>
</div-->