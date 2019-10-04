var CraneCollection = function(cranes) {
	this.hasTree = false;
	Collection.call(this, cranes);
}

CraneCollection.prototype = Object.create(Collection.prototype);
CraneCollection.prototype.contructor = CraneCollection;

CraneCollection.prototype.createTreeHtml = function() {
	if(!this.hasTree) {
		var source = $("#templateCraneLayerList").html();
	    var template = Handlebars.compile(source);
	    this.forEach(function(crane){
	    	var h = '';
	        var selector = '';
	        h += template(crane);
	        selector = $('#simulationContent > ul.craneList > li[data-crane-type="' + crane.attributes.craneType + '"] > ul > li[data-division="' + crane.attributes.division + '"] > ul');
	        selector.append(h);
	    });
	    
	    this.hasTree = true;
	}
	$('.craneList').show();
}

CraneCollection.prototype.setVisible = function(seq, isVisible) {
	this.getItem(seq).setVisible(isVisible);
}

CraneCollection.prototype.setRangeMode = function(seq, mode) {
	this.getItem(seq).changeTubeInfo(mode);
}

CraneCollection.prototype.goto = function(seq) {
	this.getItem(seq).goto();
}
CraneCollection.prototype.initPosition = function(seq) {
	this.getItem(seq).initPosition();
}
CraneCollection.prototype.setMovable = function(seq, isMovable) {
	this.getItem(seq).setMovable(isMovable);
}
CraneCollection.prototype.eventEnd = function(seq) {
	this.getItem(seq).endCall();
}
CraneCollection.filterCraneTemp = function(cranes) {
	var f4dJibCraneProjectId = 'jibCraneModel';
	var f4dTowerCraneProjectId = 'towerCraneModel';
	
	addStaticModelAPI(managerFactory, {
		projectId : f4dJibCraneProjectId, //필수정보, 프로젝트id, 부모키
		projectFolderName : 'mipo', //필수정보, 프로젝트폴더명
		buildingFolderName : 'F4D_JibCrane_0'//필수정보, f4d파일폴더명
	});
	
	addStaticModelAPI(managerFactory, {
		projectId : f4dTowerCraneProjectId, //필수정보, 프로젝트id, 부모키
		projectFolderName : 'tc', //필수정보, 프로젝트폴더명
		buildingFolderName : 'F4D_TC010026_r1'//필수정보, f4d파일폴더명
	});
	$.ajax({
        url: './js/resource/layer_crane_rail_temp.geojson',
        type: 'GET',
        contentType: "application/json; charset=utf-8",
		dataType: 'json',
		success : function(response){
			var railes = turf.featureCollection(response.features);
			var filterCraneArray = [];
			
			var manager = managerFactory.getMagoManager();
			if(!manager.configInformation) {
				manager.configInformation = Mago3D.MagoConfig.getPolicy();
			}
			
			if (manager.modeler === undefined)
			{ manager.modeler = new Mago3D.Modeler(); }
			
			Cesium.GeoJsonDataSource.load('./js/resource/crane_temp.geojson').then(function(e){
				var entities = e.entities.values;
				var id = 0;
				for(var i in entities) {
					var entity = entities[i];
					var craneInfo = entity.properties.name.getValue();
					
					if(craneInfo.split('#').length < 2) continue;
					
					var craneName = craneInfo.split('#')[0];
					var craneId = craneInfo.split('#')[1];
					var craneType = craneName.split(' ')[0];
					craneType = craneType.toLowerCase() == 'jib' ? 'JIP' : craneType;
					var railFeats = railes.features
					for(var j in cranes) {
						var crane = cranes[j];
						if(crane.craneId == craneId && crane.craneType == craneType){
							var position = entity.position._value;
							
							var craneInstance = new Crane(crane, position, id);
							var cartographciPosition = Cesium.Cartographic.fromCartesian(position);
							var degreeLon = Cesium.Math.toDegrees(cartographciPosition.longitude);
							var degreeLat = Cesium.Math.toDegrees(cartographciPosition.latitude);
							var projectId = f4dTowerCraneProjectId;
							if(craneInstance.type === 'JIP') {
								var point = turf.point([degreeLon, degreeLat]);
								
								var minDistance = Infinity;
								var minLine = null;
								
								for(var k in railFeats){
									var line = railFeats[k];
									var d = turf.pointToLineDistance(point,line);
									if(d < minDistance){
										minDistance = d;
										minLine = line;
									}
								}
								var minGeom = minLine.geometry;
								var firstCoord = minGeom.coordinates[0];
								var lastCoord = minGeom.coordinates[minGeom.coordinates.length-1];
								
								craneInstance.attributes.movementRestriction = {};
								craneInstance.attributes.movementRestriction.element = new Mago3D.GeographicCoordSegment(new Mago3D.GeographicCoord(firstCoord[0], firstCoord[1], 0),new Mago3D.GeographicCoord(lastCoord[0], lastCoord[1], 0));
								
								projectId = f4dJibCraneProjectId;
							}
							
							filterCraneArray.push(craneInstance);
							manager.modeler.addObject(craneInstance);
							
							var instStaticModelOption = {
								projectId : projectId, //필수정보, 프로젝트id, 부모키
								instanceId : id, //필수정보, 인스턴스 id, 본인 키
								longitude : degreeLon, //필수정보, longitude
								latitude : degreeLat, //필수정보, latitude
								height : 0, //옵션, height
								heading : 0, //옵션, heading
								pitch : 0, //옵션, pitch
								roll : 0 //옵션, roll
							}
							instantiateStaticModelAPI(managerFactory, instStaticModelOption);
							
							craneInstance.attributes.hasStaticModel = true;
							craneInstance.attributes.instanceId = id;
							craneInstance.attributes.projectId = projectId;
							id++;
						}
					}
				}
				HMD.crane = new CraneCollection(filterCraneArray);
		    });
		}
    });
}

var Crane = function(obj, position, id) {
	this.id = id;
	
	this.position = position;
	this.type = obj.craneType;
	
	this.attributes = obj;
	this.attributes.isVisible = true;
	this.attributes.isMovable = false;
	
	this.init();
}

Crane.prototype = Object.create(Mago3D.ConcentricTubes.prototype);
Crane.prototype.contructor = Crane;

Crane.prototype.init = function() {
	//position을 이용하여 geolocdatamanager 생성
	var geoLocDataManager = this.getNewGeoLocDataManager();
	
	//main의 range 생성
	var option = {};
	option.height = this.attributes.height; 
	option.tubeInfos = this.getTubeInfo('MAIN');
	
	Mago3D.ConcentricTubes.call(this, option, geoLocDataManager);
}

Crane.prototype.getNewGeoLocDataManager = function(position) {
	var manager = managerFactory.getMagoManager();
	
	position = position ? position : this.position;
	
	var geoLocDataManager = new Mago3D.GeoLocationDataManager();//geoCoord.getGeoLocationDataManager();
	var geoLocData = geoLocDataManager.newGeoLocationData("noName");
	var cartographciPosition = Cesium.Cartographic.fromCartesian(position);
	geoLocData = Mago3D.ManagerUtils.calculateGeoLocationData(Cesium.Math.toDegrees(cartographciPosition.longitude), Cesium.Math.toDegrees(cartographciPosition.latitude), cartographciPosition.height, 0, 0, 0, geoLocData, manager);
	
	return geoLocDataManager;
}

Crane.prototype.setVisible = function(isVisible) {
	this.attributes.isVisible = isVisible;
	
	if(this.attributes.hasStaticModel) {
		setNodeAttributeAPI(managerFactory, this.attributes.projectId, this.attributes.instanceId, {isVisible:isVisible});
	}
}

Crane.prototype.setMovable = function(isMovable) {
	this.attributes.isMovable = isMovable;
}

Crane.prototype.changeTubeInfo = function(mode) {
	var tubeInfos = this.getTubeInfo(mode);
	this.initTube(tubeInfos);
}

Crane.prototype.goto = function() {
	var geoLocDataManager = this.getGeoLocDataManager();
	var currentGeoLocData = geoLocDataManager.getCurrentGeoLocationData();
	var geoGraphicCoord = currentGeoLocData.getGeographicCoords();
	
	managerFactory.getViewer().camera.flyTo({
	    destination : Cesium.Cartesian3.fromDegrees(geoGraphicCoord.longitude,geoGraphicCoord.latitude, 200),
	    duration : 1
	});
	var selectionManager = managerFactory.getMagoManager().selectionManager; 
	selectionManager.clearCurrents();
	selectionManager.currentGeneralObjectSelected = this;
	
	this.testCall();
}
Crane.prototype.initPosition = function() {
	var geoLocDataManager = this.getNewGeoLocDataManager();
	
	this.geoLocDataManager = geoLocDataManager;
	
	
	var currentGeoLocData = this.geoLocDataManager.getCurrentGeoLocationData();
	var geoGraphicCoord = currentGeoLocData.getGeographicCoords();
	
	if(this.attributes.hasStaticModel && isExistDataAPI(managerFactory, this.attributes.projectId, this.attributes.instanceId)) {
		changeLocationAndRotationAPI(managerFactory, this.attributes.projectId, this.attributes.instanceId, geoGraphicCoord.latitude, geoGraphicCoord.longitude, 0, 0, 0, 0);
	}
	
	for(var i in this.tubes) {
		this.tubes[i].geoLocDataManager = geoLocDataManager;
	}
}
Crane.prototype.testCall = function() {
	var source = $("#templateCranePopup").html();
	
    if(!HMD.crane.popupTemplate) {
    	HMD.crane.popupTemplate = Handlebars.compile(source);
    }
    
    var h = HMD.crane.popupTemplate(this);
    $('#cranePop').html('').html(h).show().css('height',this.type === 'JIP' ? '310px':'270px');
}
Crane.prototype.endCall = function() {
	this.setMovable(false);
	$('#cranePop').html('').hide();
	var selectionManager = managerFactory.getMagoManager().selectionManager; 
	selectionManager.currentGeneralObjectSelected = undefined;
}
Crane.prototype.getTubeInfo = function(mode) {
	var infos = [];
	
	if(mode === 'MAIN') {
		if(this.type === 'JIP') {
			infos.push({
				interiorRadius: this.attributes.mainLoadShort,
				exteriorRadius: this.attributes.mainLoadLong,
				color : {
					"r" : 0.2,
					"g" : 0.8, 
					"b" : 0.8,
					"a" : 0.4
				}
			});
			infos.push({
				interiorRadius: this.attributes.mainLoadLong,
				exteriorRadius: this.attributes.mainRadiusLength,
				color : {
					"r" : 0.8,
					"g" : 0.2, 
					"b" : 0.2,
					"a" : 0.4
				}
			});
		} else {
			infos.push({
				interiorRadius: this.attributes.maxLoadLength,
				exteriorRadius: this.attributes.maxRadiusLength,
				color : {
					"r" : 0.2,
					"g" : 0.8, 
					"b" : 0.8,
					"a" : 0.4
				}
			});
		}
	} else {
		var auxLong = this.attributes.auxLoadLong;
		var auxRadiusLength = this.attributes.auxRadiusLength;
		
		infos.push({
			interiorRadius: this.attributes.auxLoadShort,
			exteriorRadius: auxLong,
			color : {
				"r" : 0.2,
				"g" : 0.8, 
				"b" : 0.8,
				"a" : 0.4
			}
		});
		
		if(auxLong !== auxRadiusLength) {
			infos.push({
				interiorRadius: auxLong,
				exteriorRadius: auxRadiusLength,
				color : {
					"r" : 0.8,
					"g" : 0.2, 
					"b" : 0.2,
					"a" : 0.4
				}
			});
		}
	}
	
	return infos;
}