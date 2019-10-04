<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script id="templateFacilityPopInfo" type="text/x-handlebars-template">
<div class="layerHeader">
        <h2 id="popTitle">{{name}} - {{id}}호</h2>
        <button type="button" data-seq="{{id}}" id="popCloseButton" class="layerClose" title="닫기">닫기</button>
</div>
<div class="layerContents">
<ul class="view">
 <table>
    <colgroup>
        <col style="width: 15%" >
        <col style="width: 35%" >
        <col style="width: 15%" >
        <col style="width: 35%" >
    </colgroup>
    <tr>
        <th scope="row">
            <label>관리 번호</label>
        </th>
        <td>
            {{id}}
        </td>
        <th scope="row">
            <label>품명</label>
        </th>
        <td>
            {{name}}
        </td>
    </tr>
    <tr>
       <th scope="row">
           <label>가로</label>
       </th>
       <td>
           {{width}}
       </td>
       <th scope="row">
           <label>세로</label>
       </th>
       <td>
           {{length}}
       </td>
    </tr>
    <tr>
       <th scope="row">
           <label>높이</label>
       </th>
       <td>
           {{height}}
       </td>
       <th scope="row">
           <label>층수</label>
       </th>
       <td>
           {{floor}}
       </td>
    </tr>
    <tr>
       <th scope="row">
           <label>건축면적</label>
       </th>
       <td>
           {{areaBuild}}
       </td>
       <th scope="row">
           <label>연면적</label>
       </th>
       <td>
           {{areaTotal}}
       </td>
    </tr>
    <tr>
       <th scope="row">
           <label>시공사</label>
       </th>
       <td>
           {{construct}}
       </td>
       <th scope="row">
           <label>설계사</label>
       </th>
       <td>
           {{architect}}
       </td>
    </tr>
    <tr>
       <th scope="row">
           <label>사업장</label>
       </th>
       <td>
           {{workplace}}
       </td>
       <th scope="row">
           <label>관리부서</label>
       </th>
       <td>
           {{manage}}
       </td>
    </tr>
    <tr>
       <th scope="row">
           <label>사용승인일</label>
       </th>
       <td>
           {{authDate}}
       </td>
       <th scope="row">
           <label>허가번호</label>
       </th>
       <td>
           {{authNo}}
       </td>
    </tr>
    <tr>
        <th scope="row">
            <label>구조형식</label>
        </th>
        <td>
            {{structure}}
        </td>
        <th scope="row">
            <label>내부마감(바닥)</label>
        </th>
        <td>
            {{intFloor}}
        </td>
    </tr>
    <tr>
        <th scope="row">
            <label>내부마감(천정)</label>
        </th>
        <td>
            {{intCeil}}
        </td>
        <th scope="row">
            <label>외부마감</label>
        </th>
        <td>
            {{ext}}
        </td>
    </tr>
    <tr>
        <th scope="row">
            <label>층별면적</label>
        </th>
        <td>
            {{floors}}
        </td>
    </tr>
<<<<<<< HEAD
</table> 

</ul>
     
</div>
=======
</table>
>>>>>>> a079ffc05e82a726c84e17a90223c1fab0ce285e
</script>