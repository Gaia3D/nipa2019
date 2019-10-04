var PaintShop = function(obj, id, factory){
	this.id = id;
	this.attributes = obj;
	this.attributes.isVisible = true;
	this.model = factory;
	
}

PaintShop.prototype = Object.create(Mago3D.BasicFactory.prototype);
PaintShop.prototype.contructor = PaintShop;


PaintShop.prototype.popUp = function(){
		var source = $('#templatePaintShopPopUp').html();
		if(!HMD.Layer.PaintShop.popupTemplate){
			HMD.Layer.popupTemplate = Hadlebars.compile(source);
		}
		
		var selectionManager = managerFactory.getMagoManager().selectionManager; 
		selectionManager.clearCurrents();
		selectionManager.currentGeneralObjectSelected = factory;
		
		var h = HMD.crane.popupTemplate(this);
	    $('#paintshopPop').html('').html(h).show().css('height','270px');
	
}

PaintShop.prototype.testCall = function(){
	
	
}

function getPaintFactoryLayer(viewer, layerName){

	var geo_server_wfs_url = HMD.getGeoServerUrl() + '/wfs';
	var param = {
			service : 'WFS',
			version : '2.0.0',
			request : 'GetFeature',
			typeName : layerName,
			outputFormat : 'application/json',
			srsName : 'EPSG:900913'
	};
		
	var queryString = $.param(param);
	
	$.ajax({
        url: geo_server_wfs_url + "?" + queryString,
        type: 'GET',
		success : function(response){
			getPaintFactoryData(viewer, response, layerName, geo_server_wfs_url);
		}
    });
}
var drawFactoryModel = function(x,y,z,height,geoCoordsArray,edgeIdxOfDoor,name){
	var manager = managerFactory.getMagoManager();
	if(!manager.configInformation) {
		manager.configInformation = Mago3D.MagoConfig.getPolicy();
	}
	if(manager.getGl() === undefined){
		manager.sceneState.gl = manager.scene.context._gl;
	}
	var geoLocDataManager = new Mago3D.GeoLocationDataManager();//geoCoord.getGeoLocationDataManager();
	var geoLocData = geoLocDataManager.newGeoLocationData("noName");
	//var cartographciPosition = Cesium.Cartographic.fromCartesian(position);
	
	if (manager.modeler === undefined)
	{ manager.modeler = new Mago3D.Modeler(); }
	var resultObj = Mago3D.BasicFactory.getFactoryDimensionsByGeoCoordsArray(geoCoordsArray, edgeIdxOfDoor, manager);
	resultObj.factoryHeight = height;
	var doorWidth = resultObj.factoryWidth * 0.8;
	
	var materialsManager = manager.materialsManager;
	var materialName = "basicFactoryRoof";
	var material = materialsManager.getOrNewMaterial(materialName);
	
	
	if (material.diffuseTexture === undefined)
	{ 
		material.diffuseTexture = new Mago3D.Texture(); 
		material.diffuseTexture.textureTypeName = "diffuse";
		material.diffuseTexture.textureImageFileName = "mipoFactoryRoof.jpg"; // Gaia3dLogo.png
		var imagesPath = "." + materialsManager.imagesPath + "/" + material.diffuseTexture.textureImageFileName;
		var flipYTexCoord = true;
		Mago3D.TexturesManager.loadTexture(imagesPath, material.diffuseTexture, managerFactory.getMagoManager(), flipYTexCoord);
	}
	  
	var frontWallOptions = {
		"hasOpening"    : true,
		"openingWidth"  : doorWidth,
		"openingHeight" : height * 0.6
	};
	  
	/*var options = {
		"hasGround"        : true,
		"roofMinHeight"    : resultObj.factoryHeight*0.75,
		"frontWallOptions" : frontWallOptions
	};*/
	/**
	 * @type{Array.<wallOption>}
	 */
	var wallOptions = [];
	
	/**
	 * wallOption.
	 * @typedef {Object} wallOption
	 * @property {string} type Required.  // front, rear, left, right
	 * @property {openingInfo||Array.<openingInfo>} openingInfo 
	 */
	/**
	 * openingInfo.
	 * @typedef {Object} openingInfo
	 * @property {number} width
	 * @property {number} height 
	 * @property {number} offset. 배열로 사용 시 필수, 단일 오브젝트로 사용 시 선택(offset선언 안하면 벽의 가운데에 입구 위치).
	 */
	wallOptions.push({
		//type : (name == "9P/SHOP" || name == "10P/SHOP" || name == "11P/SHOP") ? 'rear':'front', <- 9월23일 보고용 해당 공장 문 뒤로
		type : 'front', // front, rear, left, right
		openingInfo : {width : doorWidth,height : height * 0.6}  // front, rear, left, right
	});
	
	var options = {
		"hasGround"        : true,
		"roofMinHeight"    : resultObj.factoryHeight*0.75,
		"wallOptions" : wallOptions
	};
	  
 	
	options.roofOptions = {
		"material": material
	};
	geoLocData = Mago3D.ManagerUtils.calculateGeoLocationData(x, y, z, resultObj.headingDeg, 0, 0, geoLocData, manager);
	//var factory = manager.modeler.newBasicFactory(resultObj.factoryWidth, resultObj.factoryLength, resultObj.factoryHeight, options);
	var factory = new Mago3D.BasicFactory(resultObj.factoryWidth, resultObj.factoryLength, resultObj.factoryHeight, options);
	factory.geoLocDataManager = geoLocDataManager;
	manager.modeler.addObject(factory);
	return factory;
	
}
function convertFromWebMercatorToWGS84(position){ // change from 3857 to 4326
	var wmp = new Cesium.WebMercatorProjection();
	var carto = wmp.unproject(new Cesium.Cartesian3(position.x,position.y,position.z));
	var cart3 = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude), carto.height);	
	var cartographciPosition = Cesium.Cartographic.fromCartesian(cart3);
	return {
		"x" : Cesium.Math.toDegrees(cartographciPosition.longitude), 
		"y" : Cesium.Math.toDegrees(cartographciPosition.latitude),
		"z" : cartographciPosition.height
	};
}
function getPaintFactoryData(viewer, response, layerName, url) {
        var featuresArray = response.features;
        for(let j = 0 ; j < featuresArray.length ; j++){
        	(function(j){
				var coordinateList = featuresArray[j].geometry.coordinates[0][0];
				var name = featuresArray[j].properties.name;
				var entityProperties = featuresArray[j].properties;
				var bbox = {
						"minX" : featuresArray[j].properties.bbox[0],
						"minY" : featuresArray[j].properties.bbox[1],
						"maxX" : featuresArray[j].properties.bbox[2],
						"maxY" : featuresArray[j].properties.bbox[3]
				};
				var center = {
						"x" : (parseFloat(bbox.minX) + parseFloat(bbox.maxX))/2,
						"y" : (parseFloat(bbox.minY) + parseFloat(bbox.maxY))/2
					};
					
				if(name.includes('무벽사')){	
					//continue;
				} 
				else{
					var dimensionLayerName;
					if(layerName === 'hmd:layer_b_shop'){
						dimensionLayerName = 'hmd:b_shop_dimension';
					}
					else if(layerName === 'hmd:layer_p_shop'){
						dimensionLayerName = 'hmd:p_shop_dimension';
					}
					else if(layerName === 'hmd:layer_m_shelter'){
						dimensionLayerName = 'hmd:m_shelter_dimension';
					}
					param = {
						service : 'WFS',
						version : '2.0.0',
						request : 'GetFeature',
						typeName : dimensionLayerName,
						outputFormat : 'application/json',
						srsName : 'EPSG:900913',
						cql_filter : 'ogc_fid = ' + featuresArray[j].properties.id
					};

					queryString = $.param(param);
					//console.log(url+"?"+queryString);
	        		$.get(url+"?"+queryString).then(function(result){
	        			//console.log(result);
						var shopHeight = 15;
						var shopDirection = 0;
	        			if(result.features.length > 0){
							 shopHeight = result.features[0].properties.shop_size_h;
							 shopDirection = result.features[0].properties.shop_door_pos;
	        			}
	        			if(coordinateList.length != 5){
	                		//추후에 구현 예정. factory model로 말고.
							//dataEntityPaintShop
							
							if(result.features.length > 0 && result.features[0].geometry !== null){
								coordinateList = result.features[0].geometry.coordinates[0];
								var manager = managerFactory.getMagoManager();
								if(!manager.configInformation) {
									manager.configInformation = Mago3D.MagoConfig.getPolicy();
								}
								if (manager.modeler === undefined)
								{ manager.modeler = new Mago3D.Modeler(); }
								
								var geoLocDataManager = new Mago3D.GeoLocationDataManager();//geoCoord.getGeoLocationDataManager();
								var geoLocData = geoLocDataManager.newGeoLocationData("noName");
								
								var resultPosition = convertFromWebMercatorToWGS84(new Cesium.Cartesian3(center.x,center.y,0));
								var geoCoord0 = convertFromWebMercatorToWGS84(new Cesium.Cartesian3(coordinateList[0][0],coordinateList[0][1],0));
								geoCoord0 = new Mago3D.GeographicCoord(geoCoord0.x,geoCoord0.y,geoCoord0.z);
								var geoCoord1 = convertFromWebMercatorToWGS84(new Cesium.Cartesian3(coordinateList[1][0],coordinateList[1][1],0));
								geoCoord1 = new Mago3D.GeographicCoord(geoCoord1.x,geoCoord1.y,geoCoord1.z);
								var geoCoord2 = convertFromWebMercatorToWGS84(new Cesium.Cartesian3(coordinateList[2][0],coordinateList[2][1],0));
								geoCoord2 = new Mago3D.GeographicCoord(geoCoord2.x,geoCoord2.y,geoCoord2.z);
								var geoCoord3 = convertFromWebMercatorToWGS84(new Cesium.Cartesian3(coordinateList[3][0],coordinateList[3][1],0));
								geoCoord3 = new Mago3D.GeographicCoord(geoCoord3.x,geoCoord3.y,geoCoord3.z);
								//console.log(featuresArray[j].properties.level0,name);
								//console.log([geoCoord0,geoCoord1,geoCoord2,geoCoord3]);
								var newFactory = drawFactoryModel(resultPosition.x,resultPosition.y,0,shopHeight,[geoCoord0,geoCoord1,geoCoord2,geoCoord3],shopDirection,name);
								newFactory.name = name;
								newFactory.id = layerName + '#' + j;
								HMD.Layer.PaintShop[layerName] = HMD.Layer.PaintShop[layerName] || [];
								HMD.Layer.PaintShop[layerName].push(newFactory);
							}
							else{
								var degreePositionsArray = [];
							
								for(var k = 0 ; k < coordinateList.length ; k++){
									var point = convertFromWebMercatorToWGS84(new Cesium.Cartesian3(coordinateList[k][0],coordinateList[k][1],0));
									point.z = 0;
									degreePositionsArray.push(point.x,point.y,point.z);
								}
								
								var singleShop = viewer.entities.add({
									name : name,
									polygon : {
										hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(degreePositionsArray),
										extrudedHeight : shopHeight,
										material : Cesium.Color.SILVER.withAlpha(1.0)
										//material : Cesium.Color.fromBytes(207,207,207,1.0)
									}
								});
								
								HMD.Layer.PaintShop[layerName] = HMD.Layer.PaintShop[layerName] || [];
								HMD.Layer.PaintShop[layerName].push(singleShop);
							}
							
						}
	                	else{               		
	                    	var manager = managerFactory.getMagoManager();
	                    	if(!manager.configInformation) {
	                    		manager.configInformation = Mago3D.MagoConfig.getPolicy();
	                    	}
	                    	if (manager.modeler === undefined)
	                    	{ manager.modeler = new Mago3D.Modeler(); }
	                    	
	                    	var geoLocDataManager = new Mago3D.GeoLocationDataManager();//geoCoord.getGeoLocationDataManager();
	                    	var geoLocData = geoLocDataManager.newGeoLocationData("noName");
	                    	
	                    	var resultPosition = convertFromWebMercatorToWGS84(new Cesium.Cartesian3(center.x,center.y,0));
	                        var geoCoord0 = convertFromWebMercatorToWGS84(new Cesium.Cartesian3(coordinateList[0][0],coordinateList[0][1],0));
	                    	geoCoord0 = new Mago3D.GeographicCoord(geoCoord0.x,geoCoord0.y,geoCoord0.z);
	                    	var geoCoord1 = convertFromWebMercatorToWGS84(new Cesium.Cartesian3(coordinateList[1][0],coordinateList[1][1],0));
	                    	geoCoord1 = new Mago3D.GeographicCoord(geoCoord1.x,geoCoord1.y,geoCoord1.z);
	                    	var geoCoord2 = convertFromWebMercatorToWGS84(new Cesium.Cartesian3(coordinateList[2][0],coordinateList[2][1],0));
	                    	geoCoord2 = new Mago3D.GeographicCoord(geoCoord2.x,geoCoord2.y,geoCoord2.z);
	                    	var geoCoord3 = convertFromWebMercatorToWGS84(new Cesium.Cartesian3(coordinateList[3][0],coordinateList[3][1],0));
	                    	geoCoord3 = new Mago3D.GeographicCoord(geoCoord3.x,geoCoord3.y,geoCoord3.z);
	                    	//console.log(featuresArray[j].properties.level0,name);
	                    	//console.log([geoCoord0,geoCoord1,geoCoord2,geoCoord3]);
	                    	var newFactory = drawFactoryModel(resultPosition.x,resultPosition.y,0,shopHeight,[geoCoord0,geoCoord1,geoCoord2,geoCoord3],shopDirection,name);
	                    	newFactory.name = name;
	                    	newFactory.id = layerName + '#' + j;
	                    	HMD.Layer.PaintShop[layerName] = HMD.Layer.PaintShop[layerName] || [];
							HMD.Layer.PaintShop[layerName].push(newFactory);
	                	}
	        		});
				}
        	})(j);
		}
}