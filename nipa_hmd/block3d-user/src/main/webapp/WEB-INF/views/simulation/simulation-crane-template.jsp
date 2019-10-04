<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script id="templateCraneLayerList" type="text/x-handlebars-template">
	{{#ifMatch type 'JIP'}}
    	<li class="nodepth craneLayer on">
        	<p data-seq="{{id}}"><span></span>{{attributes.craneId}}호</p>
			<div>
				<label for="jip_crane_main_{{id}}"><input type="radio" name="jip_crane_{{id}}" id="jip_crane_main_{{id}}" value="MAIN" checked />Main</label>
				<label for="jip_crane_aux_{{id}}"><input type="radio" name="jip_crane_{{id}}" id="jip_crane_aux_{{id}}" value="AUX"/>Aux</label>
				<button type="button" id="jip_crane_{{id}}" class="textBtn">이동</button>
			<div>
    	</li>
    {{/ifMatch}}
	{{#ifMatch type 'TOWER'}}
    	<li class="nodepth craneLayer on">
        	<p data-seq="{{id}}"><span></span>{{attributes.craneId}}호</p>
			<div>
				<button type="button" id="tower_crane_{{id}}" class="textBtn">이동</button>
			<div>
    	</li>
    {{/ifMatch}}
</script>