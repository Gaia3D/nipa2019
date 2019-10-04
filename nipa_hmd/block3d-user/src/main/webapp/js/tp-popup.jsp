<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div id="tpPopContents"></div>
<script id="templateTpPopup" type="text/x-handlebars-template">
<table>
    <colgroup>
        <col style="width:30%"><col style="width:20%"><col style="width:15%" ><col style="width:35%">
    </colgroup>
    <tr>
        <th scope="row"><label>TP</label></th>
        <td>{{tp}}</td>
        <th scope="row"><label>TP 이름</label></th>
        <td>{{tpName}}</td>
    </tr>
    <tr>
        <th scope="row"><label>사업장</label></th>
        <td>{{mfgInd}}</td>
        <th scope="row"><label>시작시각</label></th>
        <td>{{sdte}}</td>
    </tr>
    <tr>
        <th scope="row"><label>완료시각</label></th>
        <td>{{edte}}</td>
        <th scope="row"><label>진행상태</label></th>
        <td>{{transtatus}}</td>
    </tr>
    <tr>
        <th scope="row"><label>계획/비계획</label></th>
        <td>{{su}}</td>
        <th scope="row"><label>호선구분</label></th>
        <td>{{sorn}}</td>
    </tr>
    <tr>
        <th scope="row"><label>호선</label></th>
        <td>{{shipNo}}</td>
        <th scope="row"><label>블록</label></th>
        <td>{{block}}</td>
    </tr>
    <tr>
        <th scope="row"><label>정반</label></th>
        <td>{{plateid}}</td>
        <th scope="row"><label>현위치</label></th>
        <td>{{curjbn}}</td>
    </tr>
    <tr>
        <th scope="row"><label>이동요구위치</label></th>
        <td>{{reqjbn}}</td>
        <th scope="row"><label>이동위치</label></th>
        <td>{{movjbn}}</td>
    </tr>
    <tr>
        <th scope="row"><label>조정번호</label></th>
        <td>{{jobNo}}</td>
        <th scope="row"><label>중량</label></th>
        <td>{{wgt}}</td>
    </tr>
</table>
</script>