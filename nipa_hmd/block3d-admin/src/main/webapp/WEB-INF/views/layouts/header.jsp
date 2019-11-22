<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="hmd.domain.UserSession"%>

<% UserSession userSession = (UserSession)request.getSession().getAttribute(UserSession.KEY); %>
<div id="headerWrap">
    <div class="header">
        <h1 onclick="location.href='/facility/layer';">HMD 3D BLOCK(블록 가시화 시스템)</h1>
        <div class="user">
            <span class="admin">관리자</span>
            <%-- <b><%=userSession.getUserName() %></b>
            <button type="button">
<%
    if(userSession != null && userSession.getUserId() != null && !"".equals(userSession.getUserId())) {
%>
                <a href="/login/logout">로그아웃</a>
<%
    } else {
%>
                <a href="/login/login">로그인</a>
<%
    }
%>
            </button> --%>
            <b>관리자</b>
            <button type="button">
                <a href="/login/login">로그인</a>
            </button>
        </div>
    </div>
</div>