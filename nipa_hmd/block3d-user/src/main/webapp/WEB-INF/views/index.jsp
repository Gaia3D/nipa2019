<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/common/taglib.jsp" %>
<%@ include file="/WEB-INF/views/common/config.jsp" %>
<!DOCTYPE html>
<html lang="${accessibility}">
    <head>
        <meta charset="utf-8">
        <meta content="IE=edge" http-equiv="X-UA-Compatible">
        <title>3D블록가시화시스템  | 현대 미포 조선</title>
        <link rel="stylesheet" href="../externlib/jquery-ui-1.12.1/jquery-ui.css?cacheVersion=${contentCacheVersion}">
        <link rel="stylesheet" href="../css/style.css?cacheVersion=${contentCacheVersion}">
        <link rel="stylesheet" href="../css/glyph/glyphicon.css?cacheVersion=${contentCacheVersion}"/>
		<link rel="stylesheet" href="../externlib/cesium/Widgets/widgets.css" />
    </head>
<body>
	<div class="header">
        <h1 class="logo">HMD 3D(3D 블록 가시화 시스템)</h1>
        <div class="user">
            <span>개발중</span>
			<a href="./manual/block-user.pdf" target="_blank">도움말</a>
			<a href="/login/login">로그인</a>
        </div>
    </div>
<div id = "mapWrap">
	
	<div id="magoContainer" class="map">
		<!-- 레이어 / 상세조회 -->
		<div id="pop" class="layer" style="display: none;position:absolute;">
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
		        <button type="button" id="popOpenPaint" class="textBtn" data-on="도장공장간섭펼치기" data-off="도장공장간섭접기">도장공장간섭</button>
		        <button type="button" id="popBlockMoveToLoad" class="textBtn" data-on="" data-off="">적재시뮬레이션</button>
		        <button type="button" id="popOpenProgress" class="textBtn full" data-on="공정정보펼치기" data-off="공정정보접기">공정정보펼치기</button>
		        <div class="viewMore">
		            <div id="popContentsDetail" style="display: none;"></div>
		        </div>
		        <!-- <div class="viewMore">
		            <div id="popPaintDetail" style="display: none;">
		            	<ul class="view">
		            		<li>
					            <div>
					                <span>TP높이(M)</span>
					                <input type="text" id="blockChkTpHeight" value="5" />
					            </div>
					        </li>
					        <li>
					            <div>
					                <span>정반높이(M)</span>
					                <input type="text" id="blockChkPlateHeight" value="2" />
					            </div>
					        </li>
					        <li>
					            <div>
					                <span>도장공장</span>
					                <select id="blockChkFactories" class="combo" data-min-length=0>
					                    <option value="">전체</option>
					                </select>
					            </div>
					        </li>
					        <li>
					            <div>
					                <span>안전율설정(%)</span>
					                <input type="text" id="blockChkSafePct" value="5" />
					            </div>
					        </li>
					        <li>
					            <button type="button" id="blockFactoryChkButton" class="textBtn full">간섭 체크 실행</button>
					        </li>
		            	</ul>
		            </div>
		        </div> -->
		    </div>
		</div>
	</div>
	<!-- NAVWRAP -->
	<div class="navWrap on"><!-- 메뉴 on시 확장됨, class="on"과 함께 #gnbWrap의 left:110px 변경 -->
		<ul class="nav">
			<%-- <c:forEach items="${userGroupMenuList}" var="menu">
			    <c:set var="onClass" value="${menu.htmlId == 'blockMenu'? 'on': ''}" />
			    <li id="${menu.htmlId}" class="${menu.cssClass} ${onClass}" data-nav="${menu.htmlContentId}" title="${menu.name}"><span>${menu.name}</span></li>
			</c:forEach> --%>
			<%-- 임시로 하드코딩 --%>
			<li id="blockMenu" class="block on" data-nav="blockContent" title="블록"><span>블록</span></li>
			<li id="layerMenu" class="layers" data-nav="layerContent" title="레이어" ><span>레이어</span></li>
			<li id="simulationMenu" class="facility" data-nav="simulationContent" title="시뮬레이션"><span>시뮬레이션</span></li>
			<li id="issueMenu" class="setup" data-nav="issueContent" title="이슈관리"><span>이슈</span></li>
		</ul>
	</div>
	<!-- E: NAV WRAP -->
	 
	<div class="contentsWrap" id="contentsWrap">
		<!-- S: 블록 -->
        <div id="blockContent" class="contents" >
            <ul id="searchTab" class="tab">
                <li class="on" data-nav="blockSearch">블록</li>
                <li class="" data-nav="jibunSearch">지번</li>
            </ul>
            <%@include file="/WEB-INF/views/block/block.jsp"%>
            <%@include file="/WEB-INF/views/block/jibun.jsp"%>
        </div>
		<!-- S: 레이어 -->
            <div id="layerContent" class="contents" style="display:none;overflow-y: auto">
                <%@include file="/WEB-INF/views/layer/layer.jsp"%>
            </div>
        <div id="simulationContent" class="contents" style="display:none;">
            <%@include file="/WEB-INF/views/simulation/simulation.jsp"%>
        </div>
		<!-- S: 이슈  -->
		<div id="issueContent" class="contents" style="display:none;">
			<ul id="issueTab" class="tab">
				<li class="on" data-nav="issueSearch">조회</li>
				<li class="" data-nav="issueRegister">등록</li>
			</ul>
			<%@include file="/WEB-INF/views/issue/issueSearch.jsp"%>
			<%@include file="/WEB-INF/views/issue/issueRegister.jsp"%>
		</div>
	</div>
	<!--CTRLWRAP -->
    <div class="workplace" style="position: absolute; top: 0px; left:440px;">
		<select id="selectMfgInd" name="mfgInd">
			<option value="1" data-sub="7" data-areagrp="A100">본사/해양</option>
			<option value="5" data-sub="5" data-areagrp="A500">온산</option>
			<option value="8" data-sub="8" data-areagrp="A800">용연</option>
			<option value="6" data-sub="6" data-areagrp="A600">모화</option>
		</select>
	</div>
	<!-- 지도 기능 -->
	<%@include file="/WEB-INF/views/toolbar/toolbar.jsp"%>
</div>

<div id="facilityPop" class="layer">
    <%@include file="/WEB-INF/views/popup/attribute-popup.jsp"%>
</div>
<div id="paintshopPop" class="layer">
    <%@include file="/WEB-INF/views/popup/paintshop-popup-template.jsp"%>
</div>
<div id="cranePop" class="layer">
    <%@include file="/WEB-INF/views/popup/crane-popup-template.jsp"%>
</div>

</body>

<canvas id="objectLabel"></canvas>

<script type="text/javascript" src="../externlib/cesium/Cesium.js"></script>
<script type="text/javascript" src="../externlib/mago3djs/mago3d.js"></script>
<script type="text/javascript" src="../externlib/turfjs/turf.min.js"></script>
<script type="text/javascript" src="../externlib/jquery-3.3.1/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="../externlib/jquery-ui-1.12.1/jquery-ui.min.js"></script>
<script type="text/javascript" src="../externlib/handlebars-4.1.2/handlebars.js"></script>
<script type="text/javascript" src="../js/Tooltip.js"></script>
<script type="text/javascript" src="../js/autoComplete.js"></script>
<script type="text/javascript" src="../js/LayerControll.js"></script>
<script type="text/javascript" src="../js/MapControll.js"></script>

<script type="text/javascript" src="../js/temp.js"></script>
<script type="text/javascript" src="../js/Collection.js"></script>
<script type="text/javascript" src="../js/crane.js"></script>
<script type="text/javascript" src="../js/Interaction.js"></script>
<script type="text/javascript" src="../js/paintInterfareInteraction.js"></script>
<script type="text/javascript" src="../js/blockLoadInteraction.js"></script>

<script>
var HMD = HMD||{
	 Policy: JSON.parse('${gisPolicy}'),
	    UserPolicy: {
	    	mfgInd: "${userSession.mfgInd}",
	    	labelYn: "${userSession.userPolicy.labelYn}"? "${userSession.userPolicy.labelYn}" : 'Y',
	    	blockLabelYn: "${userSession.userPolicy.blockLabelYn}"? "${userSession.userPolicy.blockLabelYn}" : 'Y',
	    	toolTipYn: "${userSession.userPolicy.toolTipYn}"? "${userSession.userPolicy.toolTipYn}" : 'Y',
	    	rotationAngleBonsa: "${userSession.userPolicy.rotationAngleBonsa}",
	    	rotationAngleOnsan: "${userSession.userPolicy.rotationAngleOnsan}",
	    	rotationAngleYoungyeon: "${userSession.userPolicy.rotationAngleYoungyeon}",
	    	rotationAngleMohwa: "${userSession.userPolicy.rotationAngleMohwa}"
	    },
	Layer : {
		draw : false,
		base : validDockWfs(JSON.parse('${baseLayers}')),
		label: JSON.parse('${labelList}'),
		baseMap : {},
		PaintShop : [],
		PaintShopProperties : {},
		Shop : {},
		PrintedLayers : []
	},
	getGeoServerUrl : function() {
        //var policy = this.Policy;
        //return policy.geoserverDataUrl + '/' + policy.geoserverDataWorkspace;
        return 'http://dj.gaia3d.com:18080/geoserver/hmd';
    },
    highlight : [],
    Block: {},
    Ship: {},
    getWMSParams : function(){
    	return {
			service: "WMS",
			version: "1.1.1",
			request: "GetMap",
			transparent: "true",
			format: "image/png",
			tiled:true
		};
    },
    highlight : [],
    paintInterfare : new PaintInterfare(),
    blockLoad : new BlockLoad()
};

$(document).ready(function() {
    //이동체 첫번째 탭 on주고 display
    $("#vehicleSearchTab li").first().addClass("on");
    $('#'+$("#vehicleSearchTab li").first().attr("data-nav")).show();
});
var DataEntityPaintShop = {};
var drawHelper = null;

var managerFactory = null;
var imagePath = "./images";
var dataInformationUrl = "./js/resource";
magoStart(null, "magoContainer", {
	infoBox : false,
	navigationHelpButton : false,
	scene3DOnly : true,
	selectionIndicator : false,
	baseLayerPicker : false,
	homeButton : false,
	fullscreenButton : false,
	geocoder : false
});
var intervalCount = 0;
var timerId = setInterval("startMogoUI()", 1000);
$(document).ready(function() {

	$('#selectMfgInd').change(function() {

		var option = $(this).val();
		
		if(option === "1"){
			HMD.Viewer.camera.flyTo({
				destination : Cesium.Cartesian3.fromDegrees(129.399853,35.504654,150)
			});
		}
		else if(option === "5"){
			HMD.Viewer.camera.flyTo({
				destination : Cesium.Cartesian3.fromDegrees(129.358657,35.428494,150)
			});
		}
		else if(option === "8"){
			HMD.Viewer.camera.flyTo({
				destination : Cesium.Cartesian3.fromDegrees(129.367380,35.467081,150)
			});
		}
		else if(option === "6"){
			HMD.Viewer.camera.flyTo({
				destination : Cesium.Cartesian3.fromDegrees(129.330256,35.668869,150)
			});
		}

	});

});

function startMogoUI() {
	intervalCount++;
	if(managerFactory != null && managerFactory.getMagoManagerState() === Mago3D.CODE.magoManagerState.READY) {
		var viewer = managerFactory.getViewer();
		
		//var limitRectangle = Cesium.Rectangle.fromDegrees(128.824844, 35.381110, 129.717631, 37.002658);
		//viewer.scene.globe.cartographicLimitRectangle = limitRectangle;
		
		
		viewer.camera.changed.addEventListener(adjustHeightForTerrain);
		viewer.camera.moveEnd.addEventListener(adjustHeightForTerrain);
		
		HMD.Viewer = viewer;
		LayerControll(viewer);		
		MapControll(viewer);
		CraneCollection.filterCraneTemp(JSON.parse('${crane}'));
		
		getPaintFactoryLayer(viewer,'hmd:layer_b_shop');
		getPaintFactoryLayer(viewer,'hmd:layer_p_shop');
		getPaintFactoryLayer(viewer,'hmd:layer_m_shelter');

		//getPaintFactoryLayer(viewer, 'hmd:layer_machine_room');
		
		//9월23일 보고용 전체 지번에 블락뿌리기
		//temp();
		
		var clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
		
		viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement){
	        // 새로운 모델 선택
	        var pickedFeature = viewer.scene.pick(movement.position); 
	   		if(pickedFeature !== undefined && pickedFeature.primitive.show === true){
				var properties = pickedFeature.id._properties;
			
				var propertiesNames = pickedFeature.id._properties._propertyNames;
				var setOfProperties = {};
				for(var i = 0 ; i < propertiesNames.length; i++){
					//setOfProperties.add({propertiesNames[i], properties[propertiesNames[i]].getValue()});
					setOfProperties[propertiesNames[i]] = properties[propertiesNames[i]].getValue();
				}
				console.log(setOfProperties);
				var source = $("#templateFacilityPopInfo").html();
				
			    if(!HMD.Layer.popupTemplate) {
			    	HMD.Layer.popupTemplate = Handlebars.compile(source);
			    }
			    
			    var h = HMD.Layer.popupTemplate(setOfProperties);
			    $('#facilityPop').html('').html(h).show().css('height','310px', 'position','absolute','witdh','350px','z-indx','5','bottom','50px');	
				
	   		}
	   		else{
	   			$('#facilityPop').html('').html(h).show().css('display','none');
	   			/*
	   			var selectedObject = managerFactory.getMagoManager().selectionManager.getSelectedGeneral();
	   			if(selectedObject instanceof Mago3D.BasicFactory){
	   				var paintShopId = selectedObject.id;
	   				var paintShopProperty = HMD.Layer.PaintShopProperties[paintShopId];
	   				paintShopProperty.width = selectedObject.width;
	   				paintShopProperty.height = selectedObject.height;
	   				paintShopProperty.length = selectedObject.length;
	   				if(paintShopProperty.workplace === null){
	   					paintShopProperty.workplace = paintShopProperty.level0;
	   				}
	   				var source = $("#templateFacilityPopInfo").html();
	   				
	   				if(!HMD.Layer.popupTemplate) {
				    	HMD.Layer.popupTemplate = Handlebars.compile(source);
				    }
				    
				    var h = HMD.Layer.popupTemplate(paintShopProperty);
				    $('#facilityPop').html('').html(h).show().css('height','310px', 'position','absolute','witdh','350px','z-indx','5','bottom','50px');	
	   				
	   				console.log(paintShopProperty);
	   			}
	   			*/
	   				
	   		}
	        console.log(pickedFeature);
	        
	    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


		//9월23일 보고용 전체 지번에 블락뿌리기
		//temp();

		
		clearInterval(timerId);
		console.log(" managerFactory != null, managerFactory.getMagoManagerState() = " + managerFactory.getMagoManagerState() + ", intervalCount = " + intervalCount);
		return;
	}
	console.log("--------- intervalCount = " + intervalCount);
}
// mago3d 시작, 정책 데이터 파일을 로딩
function magoStart(viewer, renderDivId, options) {
	$.ajax({
		url: dataInformationUrl + "/threeDimensionIndex.json",
		type: "GET",
		dataType: "json",
		success: function(serverPolicy){
			//managerFactory = new Mago3D.ManagerFactory(viewer, renderDivId, serverPolicy, null, null, null);	
			loadData(viewer, renderDivId, serverPolicy, options);		
		},
		error: function(e){
			alert(e.responseText);
		}
	});
}
function temp() {
	var blocks = ['F4D_B11P','F4D_2E31'];
	for(var i in blocks) {
		var block = blocks[i];
		var projectId = 'block_'+block;
		var addStaticModelOption = {
			projectId : projectId, //필수정보, 프로젝트id, 부모키
			projectFolderName : 'mipo', //필수정보, 프로젝트폴더명
			buildingFolderName : block//필수정보, f4d파일폴더명
		}
		addStaticModelAPI(managerFactory, addStaticModelOption);
	}
	
	
	var geo_server_wfs_url = HMD.getGeoServerUrl() + '/wfs';
	var param = {
			service : 'WFS',
			version : '2.0.0',
			request : 'GetFeature',
			typeName : 'hmd:layer_lot_number',
			outputFormat : 'application/json',
			srsName : 'EPSG:900913'
	};

	var queryString = $.param(param);
	
	if(!Cesium.GeoJsonDataSource.crsNames['urn:ogc:def:crs:EPSG::900913']) {
		Cesium.GeoJsonDataSource.crsNames['urn:ogc:def:crs:EPSG::900913'] = function webMercatorToCartesian3(coordinates){
			var wmp = new Cesium.WebMercatorProjection();
			var carto = wmp.unproject(new Cesium.Cartesian3(coordinates[0], coordinates[1], 0));
			return Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude), carto.height);
		}
	}

	Cesium.GeoJsonDataSource.load(geo_server_wfs_url + '?' + queryString).then(function(e){
		var entities = e.entities.values;
		for(var i in entities) {
			var entity = entities[i];
			var positions = entity.polygon.hierarchy.getValue().positions;
			var minx = Infinity;
			var miny = Infinity;
			var minz = Infinity;
			var maxx = -Infinity;
			var maxy = -Infinity;
			var maxz = -Infinity;
			
			for(var j in positions) {
				var position = positions[j];
				if(position.x < minx) minx = position.x;
				if(position.y < miny) miny = position.y;
				if(position.z < minz) minz = position.z;
				
				if(position.x > maxx) maxx = position.x;
				if(position.y > maxy) maxy = position.y;
				if(position.z > maxz) maxz = position.z;
			}
			
			var bbox = new Mago3D.BoundingBox();
			bbox.set(minx,miny,minz,maxx,maxy,maxz);
			var center = bbox.getCenterPoint();
			
			var geographic = Mago3D.Globe.CartesianToGeographicWgs84(center.x, center.y, center.z);
			var randomIdx = Math.floor(Math.random() * 2);
			var block = blocks[randomIdx];
			var instStaticModelOption = {
				projectId : 'block_'+block, //필수정보, 프로젝트id, 부모키
				instanceId : entity.name, //필수정보, 인스턴스 id, 본인 키
				longitude : geographic.longitude, //필수정보, longitude
				latitude : geographic.latitude, //필수정보, latitude
				height :0, //옵션, height
				heading : 0, //옵션, heading
				pitch : 0, //옵션, pitch
				roll : 0 //옵션, roll
			}
			instantiateStaticModelAPI(managerFactory, instStaticModelOption);
		}
    });
}
function createManagerFactory(viewer, renderDivId, serverPolicy, projectIdArray, projectDataArray, projectDataFolderArray, imagePath, options) {
	managerFactory = new Mago3D.ManagerFactory(viewer, renderDivId, serverPolicy, projectIdArray, projectDataArray, projectDataFolderArray, imagePath, options);
}

function loadData(viewer, renderDivId, serverPolicy, options) {
	if(serverPolicy.geo_data_default_projects === null || serverPolicy.geo_data_default_projects.length < 1) {
		managerFactory = new Mago3D.ManagerFactory(viewer, renderDivId, serverPolicy, null, null, null, imagePath, options);	
	} else {
		var defaultProjectArray = serverPolicy.geo_data_default_projects;
		var projectIdArray = new Array(defaultProjectArray.length);
		var projectDataArray = new Array(defaultProjectArray.length);
		var projectDataFolderArray = new Array(defaultProjectArray.length);
		
		var dataCount = 0;
		defaultProjectArray.forEach(function(projectId, index) {
			projectIdArray[index] = projectId;
			//console.log("url = " + dataInformationUrl + projectId);
			$.ajax({
				url: dataInformationUrl +"/" + projectId,
				type: "GET",
				dataType: "json",
				success: function(serverData) {
					//console.log("index = " + index + ", data = " + serverData);
					projectDataArray[index] = serverData;
					projectDataFolderArray[index] = serverData.data_key;
					if(defaultProjectArray.length === (dataCount + 1)) {
						createManagerFactory(viewer, renderDivId, serverPolicy, projectIdArray, projectDataArray, projectDataFolderArray, imagePath, options);
					}
					dataCount++;
				},
				error: function(e){
					alert(e.responseText);
				}
			});
		});
	}
}
//
function validDockWfs(layers) {
	for(var i in layers) {
		var layer = layers[i];
		if(layer.key == 'hmd:layer_dock'){
			layer.type = 'wfs';
			break;
		}
	}
	return layers;
}
</script>
<script type="text/javascript" src="../js/common.js"></script>
<script type="text/javascript" src="../js/uiControll.js"></script>
<script type="text/javascript" src="../js/layers.js"></script>

<script type="text/javascript" src="../js/paintshop.js"></script>

<script type="text/javascript" src="../js/block.js"></script>
<script type="text/javascript" src="../js/jibun.js"></script>
<script type="text/javascript" src="../js/issue.js"></script>
<script type="text/javascript" src="../js/simulation.js"></script>
<script type="text/javascript" src="../js/issue.js"></script>
<script type="text/javascript" src="../js/handlebarsHelper.js?cacheVersion=${contentCacheVersion}"></script>
</html>