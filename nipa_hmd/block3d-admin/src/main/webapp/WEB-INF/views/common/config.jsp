<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.Locale"%>
<%@ page import="hmd.domain.SessionKey" %>
<%
    String accessibility = "ko-KR";
    String lang = "ko";
    request.setAttribute("lang", lang);
    request.setAttribute("accessibility", accessibility);
%>