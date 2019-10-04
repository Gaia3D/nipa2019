<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<ul class="craneList">
    <!-- layer 삽입되는 영역==> layer.js ==> createLayerHtmlParents() -->
    <li class="rootLayer on layer_tile" data-depth="1" data-crane-type="JIP">
       	<p class="depthOne"><span class="folder"></span>집크레인<span class="toggle on"></span></p>
       	<ul>
       		<li class="on" data-depth="11" data-division="DOCK">
	        	<p><span class="folder"></span>DOCK<span class="toggle on"></span></p>
	        	<ul></ul>
	    	</li>
	    	<li class="off" data-depth="12" data-division="QUAY">
	        	<p><span class="folder"></span>QUAY<span class="toggle on"></span></p>
	        	<ul></ul>
	    	</li>
       	</ul>
   	</li>
    <li class="rootLayer off layer_tile" data-depth="1" data-crane-type="TOWER">
       	<p class="depthOne"><span class="folder"></span>타워크레인<span class="toggle on"></span></p>
       	<ul>
       		<li class="off" data-depth="11" data-division="DOCK">
	        	<p><span class="folder"></span>DOCK<span class="toggle on"></span></p>
	        	<ul></ul>
	    	</li>
	    	<li class="off" data-depth="12" data-division="QUAY">
	        	<p><span class="folder"></span>QUAY<span class="toggle on"></span></p>
	        	<ul></ul>
	    	</li>
       	</ul>
   	</li>
	<%@include file="/WEB-INF/views/simulation/simulation-crane-template.jsp"%>
</ul>