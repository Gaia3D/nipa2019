var drawFactoryModel = function(x,y,z,height,geoCoordsArray,edgeIdxOfDoor){
	var manager = managerFactory.getMagoManager();
	if(!manager.configInformation) {
		manager.configInformation = Mago3D.MagoConfig.getPolicy();
	}
	var geoLocDataManager = new Mago3D.GeoLocationDataManager();//geoCoord.getGeoLocationDataManager();
	var geoLocData = geoLocDataManager.newGeoLocationData("noName");
	//var cartographciPosition = Cesium.Cartographic.fromCartesian(position);
	
	if (manager.modeler === undefined)
	{ manager.modeler = new Mago3D.Modeler(); }
	var resultObj = Mago3D.BasicFactory.getFactoryDimensionsByGeoCoordsArray(geoCoordsArray, edgeIdxOfDoor, manager);
	//console.info(resultObj);
	resultObj.factoryHeight = height;
	var doorWidth = resultObj.factoryWidth * 0.8;
	var options = {
		"hasGround"       : true,
		"roofMinHeight"   : resultObj.factoryHeight*0.75,
		"frontDoorWidth"  : doorWidth,
		"frontDoorHeight" : resultObj.factoryHeight*0.65
	};
	geoLocData = Mago3D.ManagerUtils.calculateGeoLocationData(x, y, z, resultObj.headingDeg, 0, 0, geoLocData, manager);
	var factory = manager.modeler.newBasicFactory(resultObj.factoryWidth, resultObj.factoryLength, resultObj.factoryHeight, options);
	factory.geoLocDataManager = geoLocDataManager;
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

//TODO: ogc_fid in (1,2,3,4,5,6,7,8,10,12,14,16) 와 같이 요청보내면 한번 요청에 필요한 정보 다 가져와짐. 최대한 네트워크상에 요청을 줄어야함.
function getPaintFactoryData(viewer, response, layerName, url) {
        var featuresArray = response.features;
        for(let j = 0 ; j < featuresArray.length ; j++){
        	(function(j){
				var coordinateList = featuresArray[j].geometry.coordinates[0][0];
				var name = featuresArray[j].properties.name;
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
							var newFactory = drawFactoryModel(resultPosition.x,resultPosition.y,0,shopHeight,[geoCoord0,geoCoord1,geoCoord2,geoCoord3],shopDirection);
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
								name : featuresArray[j].properties.name,
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
                    	var newFactory = drawFactoryModel(resultPosition.x,resultPosition.y,0,shopHeight,[geoCoord0,geoCoord1,geoCoord2,geoCoord3],shopDirection);
                    	HMD.Layer.PaintShop[layerName] = HMD.Layer.PaintShop[layerName] || [];
						HMD.Layer.PaintShop[layerName].push(newFactory);
                	}
        		});
				}
        	})(j);
		}
}

function printLayer(viewer,data, layerName){
    for(let i = 0 ; i < data.length ; i++){
        (function(index){
            if(data[index].parent>= 21 && data[index].parent <= 25 ){
                var buildingLayerName = "hmd:" + data[index].layerKey;
                if(buildingLayerName !== 'hmd:layer_b_shop' && buildingLayerName !== 'hmd:layer_p_shop' && buildingLayerName !== 'hmd:layer_m_shelter'){
                    setJsonDataSource(viewer,buildingLayerName,null,null,function(e){
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
                }
                
            }
        })(i);

    }
}


function getBBox(coordinateList){
	var minX = coordinateList[0][0];
	var minY = coordinateList[0][1];
	var maxX = coordinateList[0][0];
	var maxY = coordinateList[0][1];
	for(i = 1 ; i < coordinateList[0].length; i++){
		if(coordinateList[i][0] < minX){
			minX = coordinateList[i][0];
		}
		if(coordinateList[i][1] < minY){
			minY = coordinateList[i][1];
		}
		if(coordinateList[i][0] > maxX){
			maxX = coordinateList[i][0];
		}
		if(coordinateList[i][1] > maxY){
			maxY = coordinateList[i][1];
		}		
	}
	return {
		"minX" : minX,
		"minY" : minY,
		"maxX" : maxX,
		"maxY" : maxY
	};
	
}

function cartesianToWindowPixel(cartesian3) {
	var canvas = managerFactory.getViewer().scene.canvas;
	var camera = managerFactory.getViewer().camera;
	var frustum = camera.frustum;
	var view = camera.viewMatrix;
	var model = Cesium.Matrix4.IDENTITY;
	var modelView = new Cesium.Matrix4();
	var projection = frustum.projectionMatrix;
	var modelViewProjectionMatrix = new Cesium.Matrix4();
	var viewportTransformation = new Cesium.Matrix4();

	modelView = Cesium.Matrix4.multiply(view, model, modelView);
	modelViewProjectionMatrix = Cesium.Matrix4.multiply(projection, modelView, modelViewProjectionMatrix);
	viewportTransformation = Cesium.Matrix4.computeViewportTransformation({ x : 0, y : 0, width : canvas.clientWidth, height : canvas.clientHeight }, 0.0, 1.0, viewportTransformation);

	var result = Cesium.Transforms.pointToWindowCoordinates(modelViewProjectionMatrix, viewportTransformation, cartesian3);
	return result;
}

function showClickPosition() {return false;}