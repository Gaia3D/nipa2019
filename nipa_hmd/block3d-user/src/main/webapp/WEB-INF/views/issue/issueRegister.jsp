<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div id="issueRegister" style="display:none;">
    <form id="registerIssueForm" onsubmit="return false;">
    <ul class="section issue" id="issueRegisterArea">
        <!-- 이슈등록 -->
        
        <li>
        	<div>
        		<span>제목</span>
        		<input type="text">
        	</div>
        </li>
        <li>
        	<div>
        		<span>내용</span>
        		<textarea rows="10" cols="10">aa</textarea>
        	</div>
        </li>
        
        
        
        <!-- <li>
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
        </li> -->
        <li>
            <button type="button" id="issueSearchButton" class="textBtn full">이슈 등록</button>
        </li>
    </ul>
    </form>
    <%-- <div class="boardList" id="issueResultArea">
        <ul class="boardSub">
            <li>조회건수 : <span id="blockCount" class="spanBlue">0</span> 건</li>
        </ul>
        <table id="issueResultHeader">	<!-- 핸들바로 변경 필요. if문 -->
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
                <tbody id="issueResultBody">
                    <tr>
                        <td colspan="4">검색된 데이터가 없습니다.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    <%@include file="/WEB-INF/views/issue/list-pagination.jsp"%>
    </div> --%>
</div>
