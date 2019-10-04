$(document).ready(function (){
    // 레이어 목록 가져오기
    $('#layerMenu').on('click', function() {
        getLayerList();
    });

    // 하위 영역 on/off
    $('#layerContent').on('click', '.mapLayer p', function(e) {
    	e.stopPropagation();
    	var $target = $(this).parent('li');
    	$target.toggleClass('on');
    });

    // tile 레이어 토글 (배경영상)
    $('#layerContent').on('click', '.tileLayer p', function(e) {
    	e.stopPropagation();
    	var $target = $(this).parent('li');

    	if($target.hasClass('nodepth')) {
    		var hasClassOn = $target.hasClass('on');
    		var layerId = $target.data('target-layer');
    		var layerKey = $target.data('layer-name');
    	    //var layer = HMD.GIS.getLayerById(layerId);
    	    var layer = HMD.Layer.baseMap[layerKey];
    	    
    	    if(layer.show){
    	    	layer.show = false;
    	    }
    	    else{
    	    	layer.show = true;
    	    }
    	    
    		/*if(!layer) {
    	    	layer = HMD.GIS.addTileLayer(layerKey);
    	    }
	    	layer.setVisible(hasClassOn);
    		 * */

    	    //항공영상 촬영날짜 표시
	        if(hasClassOn){
	            $("#airPhotoDate").show();
	            $("#airPhotoDate").text($target[0].innerText);
	        } else {
	            if($("#drone_layer").hasClass("on")) $("#airPhotoDate").text("드론영상(2017년 9월)");
	            else if($("#aerial_layer").hasClass("on")) $("#airPhotoDate").text("항공영상(2018년 12월)");
	            else $("#airPhotoDate").hide();
	        }
    	}
    });
    function isFacility(layerName){
    	if(layerName in HMD.Layer.Shop){
    		return true;
    	}
    	return false;
    }
    // wms 레이어 토글
    $('#layerContent').on('click', '.wmsLayer p', function(e) {
        e.stopPropagation();
        var $target = $(this).parent('li');

        if($target.hasClass('nodepth')) {
    	    var hasClassOn = $target.hasClass('on');
        	var layerId = $target.data('target-layer');
    	    //var layer = HMD.GIS.getLayerById(layerId);
    	    var layerKey = $target.data('layer-name');
    	    var parent = $target.data('parent');
    	    var zIndex = $target.data('z-index');
    	    var viewType = $target.data('view-type');
    	    var label = $target.data('label');
    	    var geoLayerKey = "hmd:" + layerKey;
    	    if(layerKey !== 'layer_b_shop' && layerKey !== 'layer_p_shop' && layerKey !== 'layer_m_shelter'){
    	    	if(isFacility(geoLayerKey)){ //빌딩이다
					 var flag = false;
					 var index = -1;
					 for(var i = 0 ; i < HMD.Viewer.dataSources.length ; i++){
						if(HMD.Viewer.dataSources.get(i).name === geoLayerKey ){
							index = i;
							break;
						}
					 }
					
					 if(index > -1){ // 이미 존재한다
						//불러와서 show만 off
						HMD.Viewer.dataSources.get(index).show = !HMD.Viewer.dataSources.get(index).show;
					 }
					 else{
						 //새로 불러온다.

						 //1. setJsonDataSource로 불러온다.
						 setJsonDataSource(HMD.Viewer,geoLayerKey,null,null,function(e){
                            var entities = e.entities.values;
                            //var color = Cesium.Color.fromRandom({alpha : 1.0});
                            //var color = Cesium.Color.fromBytes(207,207,207,1.0);
                            var color = Cesium.Color.SILVER.withAlpha(1.0);
                            for(var i in entities){
                                var entity = entities[i];
                                if(!entity._name.includes('무벽')){
                                    entity.polygon.extrudedHeight = 15;                                
                                }
                                entity.polygon.material = color;
                                entity.polygon.outline = false;            
                            }
                        });
						 //2. printedLayers에는 building인 애들은 넣지 말까...? 얘네는 extrusion 때문에 따로 관리해야되니까...
					 }
    	    		
    	    		
    	    	}
    	    	else{ // 아니다
    	    		var imageryLayer = HMD.Layer.ImageLayer;
            	    
            	    var layerList = HMD.Layer.PrintedLayers;
            	    var index = layerList.indexOf(geoLayerKey);
            	    if(index > -1){
            	    	layerList.splice(index,1);
            	    }
            	    else{
            	    	layerList.push(geoLayerKey);
            	    }
            	    
            	    var layerString = layerList.join(',');
            	    
            	    
            	    var newImageryLayer = HMD.Viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
            			url :  HMD.getGeoServerUrl()+ '/wms',
            			layers : layerString,
            			parameters : HMD.getWMSParams()

                	}));
            	    HMD.Viewer.imageryLayers.remove(imageryLayer,true);
            	    HMD.Layer.ImageLayer = newImageryLayer;
    	    	}
    	    }
    	    else{    	    	
	    		for(var i = 0 ; i < HMD.Layer.PaintShop[geoLayerKey].length; i++){
	    			var paintShop = HMD.Layer.PaintShop[geoLayerKey][i];
	    			if(paintShop instanceof Mago3D.BasicFactory){
	    				paintShop.attributes.isVisible = !paintShop.attributes.isVisible;
	    			}
	    			else{
	    				paintShop.show = !paintShop.show;
	    			}    	    			
	    		}
    	    }
    	    
    	    /*// layer on/off
    	    var object = {'key': layerKey, 'zIndex': zIndex, 'type': viewType};
    	    HMD.GIS.wmsLayerOnOff(object, hasClassOn);

    	    // label on/off
    	    if (HMD.Layer.label[parent] && label === 'Y') {
    	    	var isVisible = (HMD.UserPolicy.labelYn === 'Y') && hasClassOn;
    	    	var labelLayer = HMD.GIS.getLayerById('label_' + parent);
    	    	if(!labelLayer) {
        	    	HMD.GIS.addLabelLayer(parent);
        	    }
    	    	HMD.GIS.labelLayerOnOff(layerKey, isVisible, parent);
    	    }*/
        }
    });

    // wfs 레이어 토글
    $('#layerContent').on('click', '.wfsLayer p', function(e) {
    	e.stopPropagation();
    	var $target = $(this).parent('li');

    	if($target.hasClass('nodepth')) {
    		var hasClassOn = $target.hasClass('on');
    		var layerId = $target.data('target-layer');
    	    var layerKey = $target.data('layer-name');
    	    
    	    var geoLayerKey = "hmd:" + layerKey;

			 var index = -1;
			 for(var i = 0 ; i < HMD.Viewer.dataSources.length ; i++){
				if(HMD.Viewer.dataSources.get(i).name === geoLayerKey ){
					index = i;
					break;
				}
			 }
			
			 if(index > -1){ // 이미 존재한다
				//불러와서 show만 off
				HMD.Viewer.dataSources.get(index).show = !HMD.Viewer.dataSources.get(index).show;
			 }
			 else{
				 //새로 불러온다.
	
				 //1. setJsonDataSource로 불러온다.
				 setJsonDataSource(HMD.Viewer,geoLayerKey,null,null,function(e){
	               var entities = e.entities.values;
	               //var color = Cesium.Color.fromRandom({alpha : 1.0});
	               //var color = Cesium.Color.fromBytes(207,207,207,1.0);
	               var color = Cesium.Color.BLACK.withAlpha(1.0);
	               for(var i in entities){
	                   var entity = entities[i];
	                   entity.polygon.material = color;
	                   entity.polygon.outline = false;            
	               }
	           });
				 //2. printedLayers에는 building인 애들은 넣지 말까...? 얘네는 extrusion 때문에 따로 관리해야되니까...
			 }
		    /*var layer = HMD.GIS.getLayerById(layerId);
		    if(!layer) {
		    	layer = HMD.GIS.addWfsLayer(layerKey);
		    }
		    layer.setVisible(hasClassOn);*/
	    	}
    });

    // 캔버스 레이어 토글
    $('#layerContent').on('click', '.canvasLayer p', function(e) {
        e.stopPropagation();
        var $target = $(this).parent('li');

        if($target.hasClass('nodepth')) {
            var hasClassOn = $target.hasClass('on');
            var layerId = $target.data('target-layer');
    	    var layerKey = $target.data('layer-name');
    	    var geoLayerKey = "hmd:" + layerKey;

			 var index = -1;
			 for(var i = 0 ; i < HMD.Viewer.dataSources.length ; i++){
				if(HMD.Viewer.dataSources.get(i).name === geoLayerKey ){
					index = i;
					break;
				}
			 }
			
			 if(index > -1){ // 이미 존재한다
				//불러와서 show만 off
				HMD.Viewer.dataSources.get(index).show = !HMD.Viewer.dataSources.get(index).show;
			 }
			 else{
				 //새로 불러온다.
	
				 //1. setJsonDataSource로 불러온다.
				 setJsonDataSource(HMD.Viewer,geoLayerKey,null,null,function(e){
	               var entities = e.entities.values;
	               //var color = Cesium.Color.fromRandom({alpha : 1.0});
	               //var color = Cesium.Color.fromBytes(207,207,207,1.0);
	               var color = Cesium.Color.BLACK.withAlpha(1.0);
	               for(var i in entities){
	                   var entity = entities[i];
	                   entity.polygon.material = color;
	                   entity.polygon.outline = false;            
	               }
	           });
				 //2. printedLayers에는 building인 애들은 넣지 말까...? 얘네는 extrusion 때문에 따로 관리해야되니까...
			 }
        }
    });

    // 블록/이동체 토글
    $('#layerContent').on('click', '.dataLayer p', function(e) {
        e.stopPropagation();
        var $target = $(this).parent('li');

        if($target.hasClass('nodepth')) {
            var hasClassOn = $target.hasClass('on');
            toggleDataLayer($target, hasClassOn);
        }
    });
});

// 레이어 메뉴 목록 조회
function getLayerList() {
	if(!HMD.Layer.draw) {
		HMD.Layer.draw = true;

	    $.ajax({
	        url: '/layer/list',
	        type: 'GET',
	        headers: {'X-Requested-With': 'XMLHttpRequest'},
	        contentType: "application/json; charset=utf-8",
	        dataType: 'json',
	        cache: false,	// ie동작오류보완
	        success: function(res){
	        	// html 생성
	            createLayerHtml(res.list);
	        },
	        error: function(request, status, error) {
	        	// alert message, 세션이 없는 경우 로그인 페이지로 이동 - common.js
	        	ajaxErrorHandler(request);
	        }
	    });
	}
}

//레이어 메뉴 html 생성
function createLayerHtml(res) {
	var source = $("#templateLayerList").html();
    var template = Handlebars.compile(source);
    for(var i=0, len=res.length; i<len; i++) {
        var h = '';
        var selector = '';

        h += template(res[i]);

        if(res[i].depth === 1) {
            selector = $('#layerContent > ul');
            selector.append(h);
        } else {
            //selector = $('[data-depth=' + res[i].parent + '] > ul');
        	selector = $('#layerContent li[data-depth=' + res[i].parent + '] > ul');
            selector.append(h);
        }
    }
}

// 블록 데이터 on/off
function toggleDataLayer(obj, hasClassOn) {
	var layerKey = $(obj).data('target-layer');
    var targerLayerList = [];

    if(hasClassOn) {
        var isChecked = $('#viewOnlySearchFeature').is(':checked');
        if(isChecked){
            targerLayerList = [layerKey + '_highlight'];
        } else {
            targerLayerList = [layerKey];
        }
    } else {
        targerLayerList = [layerKey, layerKey + '_highlight'];
    }

    /*for(var i=0, len=targerLayerList.length; i<len; i++){
        var zoom = HMD.Map.getView().getZoom();
		HMD.GIS.getLayerById(targerLayerList[i]).setVisible(hasClassOn);
    }*/
    
    //temp source
    var magoManager = managerFactory.getMagoManager();
    var hierarchyManager = magoManager.hierarchyManager;
    if(hierarchyManager.staticModelsManager && hierarchyManager.staticModelsManager.staticModelsMap) {
    	var modelMap = hierarchyManager.staticModelsManager.staticModelsMap;
        var nodes = hierarchyManager.nodesArray;
        for(var model in modelMap) {
        	if(model != 'craneModel') {
        		for(var i in nodes) {
        			var node = nodes[i];
        			if(node.data.projectId === model) {
        				node.data.attributes.isVisible = hasClassOn;
        			}
        		}
        	}
        }
    }
}

// 레이어 전체 끄기
function turnOffAllLayer() {
	//handlerClosePopup();
	var imageLayer = HMD.Layer.ImageLayer;
	if(imageLayer !== null){
		var viewer = HMD.Viewer;
		//var idx = viewer.imageryLayers.indexOf(imageLayer);
		viewer.imageryLayers.remove(imageLayer,true);
		//imageryProvider._imageryProvider._layers="";		
	}
	$('#layerContent .nodepth.on').each(function() {
		$(this).find('p').trigger('click');
	});
}

// 시스템 설정으로 레이어 on/off 변경
function resetAllLayer() {
	$.ajax({
        url: '/layer/list/default',
        type: 'GET',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function(res){
        	// 전체 끄고
        	turnOffAllLayer();
        	// 해당 레이어 on
        	var list = res;
        	list.forEach(function(layer) {
        		// workspace 삭제
            	if(layer.key.indexOf(HMD.Policy.geoserverDataWorkspace) > -1) {
            		layer.key = layer.key.replace(HMD.Policy.geoserverDataWorkspace + ':', '');
                }
        		var target = $('#layerContent [data-layer-name="'+layer.key+'"]');
        		if(!target.hasClass('on')) {
        			$(target).find('p').trigger('click');
        		}
        	});
        },
        error: function(request, status, error) {
        	// alert message, 세션이 없는 경우 로그인 페이지로 이동 - common.js
        	ajaxErrorHandler(request);
        }
    });
}
function setJsonDataSource(viewer, layerName, cql, opt, entityFunc) {
    var geo_server_wfs_url = HMD.getGeoServerUrl() + '/wfs';
	var param = {
			service : 'WFS',
			version : '2.0.0',
			request : 'GetFeature',
			typeName : layerName,
			outputFormat : 'application/json',
			srsName : 'EPSG:900913'
	};
	if(cql) {
		param.CQL_FILTER = cql;
	}
	var queryString = $.param(param);
	
	opt = opt||{};
	opt.clampToGround = true;
	
	if(!Cesium.GeoJsonDataSource.crsNames['urn:ogc:def:crs:EPSG::900913']) {
		Cesium.GeoJsonDataSource.crsNames['urn:ogc:def:crs:EPSG::900913'] = function webMercatorToCartesian3(coordinates){
			var wmp = new Cesium.WebMercatorProjection();
			var carto = wmp.unproject(new Cesium.Cartesian3(coordinates[0], coordinates[1], 0));
			return Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude), carto.height);
		}
	}

	Cesium.GeoJsonDataSource.load(geo_server_wfs_url + '?' + queryString, opt).then(function(e){
		if(entityFunc && typeof entityFunc == 'function') entityFunc.call(undefined, e);
		if(layerName == 'hmd:layer_dock'){
			console.info(e);
		}
		e.name = layerName;
		viewer.dataSources.add(e);
    });
}
function setJsonDataSource2(viewer, layerName, cql, opt, entityFunc) {
    var geo_server_wfs_url = HMD.getGeoServerUrl() + '/wfs';
	var param = {
			service : 'WFS',
			version : '2.0.0',
			request : 'GetFeature',
			typeName : layerName,
			outputFormat : 'application/json',
			srsName : 'EPSG:900913'
	};
	if(cql) {
		param.CQL_FILTER = cql;
	}
	var queryString = $.param(param);
	
	opt = opt||{};
	opt.clampToGround = true;
	
	if(!Cesium.GeoJsonDataSource.crsNames['urn:ogc:def:crs:EPSG::900913']) {
		Cesium.GeoJsonDataSource.crsNames['urn:ogc:def:crs:EPSG::900913'] = function webMercatorToCartesian3(coordinates){
			var wmp = new Cesium.WebMercatorProjection();
			var carto = wmp.unproject(new Cesium.Cartesian3(coordinates[0], coordinates[1], 0));
			return Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude), carto.height);
		}
	}

	Cesium.GeoJsonDataSource.load(geo_server_wfs_url + '?' + queryString, opt).then(function(e){
		//geoCoord.makeDefaultGeoLocationData();
		//var excavation = this.modeler.getExcavation();
		//var geoCoordsList = excavation.getGeographicCoordsList();
		//geoCoordsList.addGeoCoord(geoCoord);
		//geoCoordsList.makeLines(this);\
		var positions = e.entities.values[0].polygon.hierarchy._value.positions;
		var mm = managerFactory.getMagoManager();
		mm.init(mm.scene.context._gl);
		var excavation = mm.modeler.getExcavation();
		var geoCoordsList = excavation.getGeographicCoordsList();
		for(var i in positions) {
			var position = positions[i];
			var geoCoord = Mago3D.ManagerUtils.pointToGeographicCoord(position);
			geoCoord.altitude = -20;
			geoCoord.makeDefaultGeoLocationData();
			geoCoordsList.addGeoCoord(geoCoord);
		}
		geoCoordsList.makeLines(mm);
		excavation.makeExtrudeObject(mm);
    });
}