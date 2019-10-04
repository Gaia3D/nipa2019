<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div id="jibunSearch" style="display:none;">
      <form id="searchJibunForm" onsubmit="return false;">
      <ul class="section jibun" id="jibunSearchArea">
          <!-- <li>지번 찾기</li> -->
          <li>
              <div id="jibunCombo">
                  <span>지번</span>
                  <select id="selectJibun" name="id" class="combo" data-min-length=1>
                      <option value="">전체</option>
                  </select>
              </div>
          </li>
          <li></li>
          <li>
              <button type="button" id="jibunSearchButton" class="textBtn full">지번 검색</button>
          </li>
      </ul>
      </form>
      <div class="boardList" id="jibunResultArea">
          <ul class="boardSub">
              <li>조회건수 : <span id="jibunCount" class="spanBlue">0</span> 건</li>
          </ul>
          <table>
              <colgroup>
                  <col width="180px">
                  <col width="">
              </colgroup>
              <thead>
                  <tr>
                      <th>사업장</th>
                      <th>지번</th>
                  </tr>
              </thead>
          </table>
          <div class="searchArea">
              <table>
                  <colgroup>
                      <col width="180px">
                      <col width="">
                  </colgroup>
                  <tbody id="jibunResultBody">
                      <tr>
                          <td colspan="2">검색된 데이터가 없습니다.</td>
                      </tr>
                  </tbody>
              </table>
          </div>
	    <%@include file="/WEB-INF/views/block/jibun-pagination.jsp"%>
      </div>
</div>