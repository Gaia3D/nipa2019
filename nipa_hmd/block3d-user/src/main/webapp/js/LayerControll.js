function LayerControll(viewer) {
	//local geoserver에 데이터가 없어 개발서버 url로 변경
	var geo_server_wms_url = HMD.getGeoServerUrl() + '/wms';
    var geo_server_parameters_service = "WMS";
    var geo_server_parameters_version = "1.1.1";
    var geo_server_parameters_request = "GetMap";
    var geo_server_parameters_transparent = "true";
    var geo_server_parameters_format = "image/png";
    var queryString = "enable_yn='Y'";
    
    var wmsParams = {
        service: geo_server_parameters_service,
        version: geo_server_parameters_version,
        request: geo_server_parameters_request,
        transparent: geo_server_parameters_transparent,
        format: geo_server_parameters_format,
        tiled:true
    }

    var default3DLayer = [{
        name: "3차원 객체",
        show: true
    }];
    
	var getBaseLayerKeys = function(type) {
        var list = HMD.Layer.base;
        return list.reduce(function(array, layer) {	// reduce: ie9부터 지원
            if(layer.type === type) {
                array.push(layer.key);
            }
            return array;
        }, []);
    }
    initLayerPrint();
    function initLayerPrint(){
    	var tileLayerKeys = getBaseLayerKeys('tile');
        var wmsLayerKeys = getBaseLayerKeys('wms');
        var wfsLayerKeys = getBaseLayerKeys('wfs');
        var canvasLayerKeys = getBaseLayerKeys('canvas');
        var dataLayerKeys = getBaseLayerKeys('data');
        
        var tileLayerList = [];
        var wmsLayerList = [];
        printBaseMap(); // 배경지도 출력
        registerFacilityList(); // facility 목록 저장
        createLayersAtOnceWFS(wfsLayerKeys);
        createLayersAtOnceCanvas(canvasLayerKeys);
        //createLayersAtOnceWMS(wmsLayerKeys);
        //printBuildings();
        //createLayers(wmsLayerList);
    }
     
    function printBaseMap(){
    	var droneMap = ["2018_drone_photo"];
    	var aerialMap = ["2018_headquarter","2018_mohwa","2018_onsan","2018_yongyeon"];
    	var ngiiMap = ["2018_ngii_photo"];
    	
    	var droneMapString = droneMap.join(',');
    	var aerialMapString = aerialMap.join(',');
    	var ngiiMapString = ngiiMap.join(',');
    	
    	var imageryLayers = viewer.imageryLayers;
    	
    	var imageryLayerNgii = imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
			url : geo_server_wms_url,
			layers : ngiiMapString,
			parameters : wmsParams,
			enablePickFeatures : false
    	}));
    	
    	var imageryLayerAerial = imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
			url : geo_server_wms_url,
			layers : aerialMapString,
			parameters : wmsParams,
			enablePickFeatures : false

    	}));
    	
    	var imageryLayerDrone = imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
			url : geo_server_wms_url,
			layers : droneMapString,
			parameters : wmsParams,
			enablePickFeatures : false
        }));
        
        var tileLayerKeys = getBaseLayerKeys('tile');

        if(tileLayerKeys.indexOf("2018_drone_photo") > -1){
            imageryLayerDrone.show = true;    
        }
        else{
            imageryLayerDrone.show = false;
        }
        
        if(tileLayerKeys.indexOf("2018_aerial_photo") > -1){
            imageryLayerAerial.show = true; 	   
        }
        else{
            imageryLayerAerial.show = false; 	
        }

        if(tileLayerKeys.indexOf("2018_ngii_photo") > -1){
            imageryLayerNgii.show = true;	   
        }
        else{
            imageryLayerNgii.show = false;	
        }
    	
    	HMD.Layer.baseMap["2018_drone_photo"] = imageryLayerDrone;
    	HMD.Layer.baseMap["2018_aerial_photo"] = imageryLayerAerial;
    	HMD.Layer.baseMap["2018_ngii_photo"] = imageryLayerNgii;
    }

    function checkBaseFacility(layerName){
        var baseMapWMS = getBaseLayerKeys('wms');
        if(baseMapWMS.indexOf(layerName) > -1){
            return true;
        }
        else{
            return false;
        }
    }
    
    function isFacility(layerName){
    	if(layerName in HMD.Layer.Shop){
    		return true;
    	}
    	return false;
    }
    
    function isPaintShop(layerName){
    	if(layerName === "hmd:layer_b_shop" || layerName === "hmd:layer_p_shop" || layerName === "hmd:layer_m_shelter"){
    		return true;
    	}
    	return false;
    }

    function printBuildings(){       
        for(let i = 0 ; i < Object.keys(HMD.Layer.Shop).length ; i++){
            (function(index){
            	var data = Object.values(HMD.Layer.Shop);
            	var viewer = HMD.Viewer;
                var buildingLayerName = "hmd:" + data[index].layerKey;
                if(checkBaseFacility(buildingLayerName)){
                    if(buildingLayerName !== 'hmd:layer_b_shop' && buildingLayerName !== 'hmd:layer_p_shop' && buildingLayerName !== 'hmd:layer_m_shelter'){
                        if(buildingLayerName === "hmd:layer_office_room" || buildingLayerName === "hmd:layer_site_office"){
                        	var dimensionLayerName;
                        	if(buildingLayerName === "hmd:layer_office_room"){
                        		dimensionLayerName = "hmd:office_room_dimension";
                        	}
                        	else if(buildingLayerName === "hmd:layer_site_office"){
                        		dimensionLayerName = "hmd:site_office_dimension";
                        	}
                        	setJsonDataSource(viewer,buildingLayerName,null,null,function(e){
                                var entities = e.entities.values;
                                //var color = Cesium.Color.fromRandom({alpha : 1.0});
                                //var color = Cesium.Color.fromBytes(207,207,207,1.0);
                                var color = Cesium.Color.SILVER.withAlpha(1.0);
                                for(let i = 0 ; i < entities.length ; i++){
                                    var entity = e.entities.values[i];                                   
                                    if(!entity._name.includes('무벽')){
                                        (function(i){         	
                                        	var param = {
                                					service : 'WFS',
                                					version : '2.0.0',
                                					request : 'GetFeature',
                                					typeName : dimensionLayerName,
                                					outputFormat : 'application/json',
                                					srsName : 'EPSG:900913',
                                					cql_filter : 'ogc_fid = ' + entity._id.split('.')[1]
                                				};
                                        	queryString = $.param(param);
                                        	var url = HMD.getGeoServerUrl() + '/wfs';
                                        	$.get(url+"?"+queryString).then(function(result){
                                        		var entity = e.entities.values[i]; 
                                        		if(result.features.length > 0){
                                        			entity.polygon.extrudedHeight = result.features[0].properties.shop_size_h;
                                        		}
                                        		else{
                                        			entity.polygon.extrudedHeight = 3;   
                                        		}
                                        	});
                                        })(i);
                                        entity.polygon.material = color;
                                        entity.polygon.outline = false; 
                                    }
                                               
                                }
                            });
                        	
                        }
                        else{
                        	setJsonDataSource(viewer,buildingLayerName,null,null,function(e){
                                var entities = e.entities.values;
                                //var color = Cesium.Color.fromRandom({alpha : 1.0});
                                //var color = Cesium.Color.fromBytes(207,207,207,1.0);
                                var color = Cesium.Color.SILVER.withAlpha(1.0);
                                for(var i in entities){
                                    var entity = entities[i];
                                    if(!entity._name.includes('무벽')){
                                        entity.polygon.extrudedHeight = 3;                                
                                    }
                                    entity.polygon.material = color;
                                    entity.polygon.outline = false;            
                                }
                            });
                        }
                    }
                }
            })(i);
    
        }
    }
    function registerFacilityList(){
        $.ajax({
			url: '/layer/list',
			type: 'GET',
			headers: {'X-Requested-With': 'XMLHttpRequest'},
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			cache: false,	// ie동작오류보완
			success: function(res){
				// html 생성
				var data = res.list;
                for(let i = 0 ; i < data.length ; i++){
                    (function(index){
                        if(data[index].parent>= 21 && data[index].parent <= 25 ){
                            var buildingLayerName = "hmd:" + data[index].layerKey;
                                if(buildingLayerName !== 'hmd:layer_b_shop' && buildingLayerName !== 'hmd:layer_p_shop' && buildingLayerName !== 'hmd:layer_m_shelter'){
                                    HMD.Layer.Shop[buildingLayerName] = data[index];
                            }
                        }
                    })(i);
                }
                var wmsLayerKeys = getBaseLayerKeys('wms');
                createLayersAtOnceWMS(wmsLayerKeys);
                printBuildings();
			},
			error: function(request, status, error) {
				// alert message, 세션이 없는 경우 로그인 페이지로 이동 - common.js
				ajaxErrorHandler(request);
			}
		});
    }
    function createLayersAtOnceWMS(layers, isShow){
    	var layerList = [];
    	for(var i = 0 ; i < layers.length ; i++){
    		if(!isFacility(layers[i]) && !isPaintShop(layers[i])){
    			layerList.push(layers[i]);
    		}
    	}
    	var layerListString = layerList.join(',');
		var imageryLayers = viewer.imageryLayers;
		var imageryProvider = imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
			url : geo_server_wms_url,
			layers : layerListString,
			parameters : wmsParams,
			show : isShow,
			enablePickFeatures : false
			
		}));
		//console.info(imageryProvider);
		HMD.Layer.ImageLayer = imageryProvider;
		//HMD.Layer.PrintedLayers = HMD.Layer.PrintedLayers||[];
		HMD.Layer.PrintedLayers = HMD.Layer.PrintedLayers.concat(layerList);
		//setTimeout("deleteSingleLayer(layerList,'hmd:layer_lot_number',imageryProvider)",3000);		
	}
    function createLayersAtOnceWFS(layers){
    	for(var i = 0 ; i < layers.length ; i++){
    		(function(i){
    			var layerName = layers[i];
    			if(layerName != "hmd:layer_crane"){
    				if(layerName == "hmd:layer_dock"){
    					//setJsonDataSource2(HMD.Viewer,layerName,null,null);
    				}else{
    					setJsonDataSource(HMD.Viewer,layerName,null,null,function(e){
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
    				}
    			}
    		})(i);
    	}
    }
    function createLayersAtOnceCanvas(layers){
    	for(var i = 0 ; i < layers.length ; i++){
    		(function(i){
    			var layerName = layers[i];
    			var geoLayerKey = layerName;
    			
    			if(layerName === 'hmd:layer_full_ship_guay'){
    				geoLayerKey = 'hmd:layer_full_ship_quay';
    				layers[i] = 'layer_full_ship_quay';
    			}
    			
				setJsonDataSource(HMD.Viewer,geoLayerKey,null,null,function(e){
                    var entities = e.entities.values;
                    //var color = Cesium.Color.fromRandom({alpha : 1.0});
                    //var color = Cesium.Color.fromBytes(207,207,207,1.0);
                    var color = Cesium.Color.WHITE.withAlpha(0.5);
                    for(var i in entities){
                        var entity = entities[i];
                        entity.polygon.material = color;
                        entity.polygon.outline = true;            
                    }
                });
    		})(i);
    	}
    }
    
    //createLayers(defaultImgLayer);
	
	function createLayers(layers, param) {
		var ll = layers.join(',');
		
		var imageryLayerInstance = new Cesium.ImageryLayer(new Cesium.WebMapServiceImageryProvider({
    		url : geo_server_wms_url,
    		layers : ll,
    		parameters : param,
    		enablePickFeatures : false
    	}), {
    		show : true
    	});
		viewer.imageryLayers.add(imageryLayerInstance);
	}

   
	/*function createLayers(layers,isShow) {
        for (var i = 0, len = layers.length; i < len; i++) {
        //for (var i =5; i >= 0; i--) {
            var layer = viewer.imageryLayers.addImageryProvider(layers[i].provider);
            layer.alpha = Cesium.defaultValue(layers[i].alpha, layers[i].alpha);
            //layer.show = Cesium.defaultValue(layers[i].show, true);
            layer.show = isShow;
            layer.name = layers[i].name;

            //var query = makeQueryString(layers[i]);
            *//** 
             * if (query !== "") {
                layer._imageryProvider._resource._queryParameters.env = query;
                layer._imageryProvider._tileProvider._resource._queryParameters.env = query;
            }
            *//*
        }
    }*/
    
    function makeQueryString(style) {
        var result = "";
        if (style.color !== undefined && style.color !== null) {
            result += "color:" + style.color + ";";
        }
        if (style.line !== undefined && style.line !== null) {
            result += "stroke-width:" + style.line + ";";
        }

        return result;
    }
}
