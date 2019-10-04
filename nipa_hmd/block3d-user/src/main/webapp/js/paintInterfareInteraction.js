var PaintInterfare = function(){
	Interaction.call(this);
}

PaintInterfare.prototype = Object.create(Interaction.prototype);
PaintInterfare.prototype.contructor = PaintInterfare;
PaintInterfare.prototype.init = function() {
	this.startObserver();
}

PaintInterfare.prototype.startObserver = function() {
	var that = this;
	
	var target = document.getElementById('simulationContent');
	var config = { attributes: true, subtree:true, attributeOldValue:true};
	
	this.observer = new MutationObserver(function(mutations) {
		for(var i in mutations){
			var mut = mutations[i];
			var target = mut.target;
			//if(target.id == 'simulationContent' || target.id == 'paintInterfare') {
				if(!$('.paintCantList').is(':visible') && !$('#paintInterfare').is(':visible') && that.getActive()){
					that.blockInit();
					
					that.setActive(false);
					that.setBlock(undefined);
					changeObjectInfoViewModeAPI(managerFactory,false);
					
					var magoManager = managerFactory.getMagoManager();
					var modelerObjects = magoManager.modeler.objectsArray;
					
					for(var i in modelerObjects) {
						var modelerObject = modelerObjects[i];
						if(modelerObject instanceof Crane){
							modelerObject.setVisible(true);
						} else {
							modelerObject.attributes.isVisible = true;
							if(modelerObject instanceof Mago3D.BasicFactory) {
								modelerObject.removeMesh('tempPrisim');
							}
						}
					}
					$('#paintInterfareResult').hide();
				}
			//}
		}
	});
	this.observer.observe(target, config);
}
PaintInterfare.prototype.startPaintInterfare = function() {
	var block = this.getBlock();
	
	if(block) {
		this.setPaintSetMode();
	} else {
		$('#paintLayerBlockName').text('');
		$('#simulationContent .paintList').hide();
		$('#paintInterfareResult').hide();
		$('#simulationContent .paintCantList').show();
	}
	
	this.active = true;
	changeObjectInfoViewModeAPI(managerFactory,true);
}
PaintInterfare.prototype.setPaintSetMode = function() {
	var block = this.getBlock();
	var blockId = block ? block.data.nodeId :'B11P';
	var shipId = block ? block.data.projectId : 'workshop.json';
	var blockName = shipId + ' ' + blockId;
	$('#paintLayerBlockName').text(blockName);
	//block.js에 있음
	addFactory();
	$('#paintInterfareResult').hide();
	$('#simulationContent .paintCantList').hide();
	$('#simulationContent .paintList').show();
}

//쪼깨야함
PaintInterfare.prototype.interfare = function() {
	var numberRegex = regexOnlyNumber();
	
	//tp 높이
	var tpHeight = parseFloat($('#blockChkTpHeight').val());
	if(checkInterfareNumberOrUndefined(tpHeight)) {
		alert('TP높이는 숫자만 입력가능합니다.');
		$('#blockChkTpHeight').focus();
		return false;
	}
	//정반 높이
	var jbHeight = parseFloat($('#blockChkPlateHeight').val());
	if(checkInterfareNumberOrUndefined(jbHeight)) {
		alert('정반높이는 숫자만 입력가능합니다.');
		$('#blockChkPlateHeight').focus();
		return false;
	}
	//안전율
	var safePct = parseFloat($('#blockChkSafePct').val());
	if(checkInterfareNumberOrUndefined(safePct)) {
		alert('안전율은 숫자만 입력가능합니다.');
		$('#blockChkSafePct').focus();
		return false;
	}
	
	safePct = safePct / 100;
	var factoryId = $('#blockChkFactories').val();
	if(!factoryId){
		alert('도장공장을 선택해주세요.');
		return false;
	}
	
	var layerName = factoryId.split('#')[0];
	var features = HMD.Layer.PaintShop[layerName];
	var factory;
	for(var i in features) {
		var feature = features[i];
		if(feature instanceof Mago3D.BasicFactory) {
			if(feature.id == factoryId){
				factory = feature;
				break;
			}
			
		}
	}
	
	var magoManager = managerFactory.getMagoManager();
	var modelerObjects = magoManager.modeler.objectsArray;
	
	//임시 F4D 정보
	var block = this.getBlock();
	if(!block) {
		block = magoManager.hierarchyManager.getNodeByDataKey('workshop.json', 'B11P');
		this.setBlock(block);
	}
	
	var blockGeoLocDataManager = block.data.geoLocDataManager;
	var blockGeoLocData = block.data.geoLocDataManager.getCurrentGeoLocationData();
	
	var blockId = block.data.nodeId;
	var shipId = block.data.projectId;
	
	for(var i in modelerObjects) {
		var modelerObject = modelerObjects[i];
		if(modelerObject instanceof Crane){
			modelerObject.setVisible(false);
		} else {
			modelerObject.attributes.isVisible = false;
			if(modelerObject instanceof Mago3D.BasicFactory) {
				modelerObject.removeMesh('tempPrisim');
			}
		}
	}
	factory.attributes.isVisible = true;
	
	//프리즘 메쉬 시작
	var prop = factory.getOpeningProperties('front');
	if(!prop){
		factory.makeMesh();
		prop = factory.getOpeningProperties('front');
	}
	var profile = prop.openeingProfile2d;
	
	var distance = 20;
	var mesh = Mago3D.Modeler.getExtrudedMesh(profile, distance, 1, undefined, true, true, undefined);
	mesh.name = "tempPrisim";
	factory.objectsArray.push(mesh);
	factory.objectsMap[mesh.name] = mesh;
	
	mesh.rotate(90, 1, 0, 0);
	mesh.translate(-factory.width*0.5, -factory.length*0.5+0.4, 0);
	mesh.setOneColor(0, 1, 0.2, 0.1);
	//프리즘 메쉬 끝
	
	var centerWC = prop.centerWC;
	var normalWC = prop.normalWC;
	
	var gldm = factory.geoLocDataManager;
	var gld = gldm.getCurrentGeoLocationData();
	
	var cameraUpLC = new Mago3D.Point3D(0,0,1);
	var resultCameraUPWC = gld.rotMatrix.transformPoint3D(cameraUpLC, resultCameraUPWC);
	
	var tempUp = new Mago3D.Point3D(resultCameraUPWC.x, resultCameraUPWC.y, resultCameraUPWC.z);
	//tempUp.unitary();
	
	var destWCX = centerWC.x + (normalWC.x*25);
	var destWCY = centerWC.y + (normalWC.y*25);
	var destWCZ = centerWC.z + (normalWC.z*25);
	
	var ch = 40;
	destWCX = destWCX + (tempUp.x*ch);
	destWCY = destWCY + (tempUp.y*ch);
	destWCZ = destWCZ + (tempUp.z*ch);
	
	var direcOrginWCX = centerWC.x + (normalWC.x*12.5);
	var direcOrginWCY = centerWC.y + (normalWC.y*12.5);
	var direcOrginWCZ = centerWC.z + (normalWC.z*12.5);
	
	var direcX = direcOrginWCX - destWCX;
	var direcY = direcOrginWCY - destWCY;
	var direcZ = direcOrginWCZ - destWCZ;
	
	var direcNormalPoint = new Mago3D.Point3D(direcX,direcY,direcZ);
	direcNormalPoint.unitary();
	
	var destWC = new Mago3D.Point3D(destWCX, destWCY, destWCZ);
	
	var firstCP = direcNormalPoint.crossProduct(tempUp,firstCP);
	var secondCP = firstCP.crossProduct(direcNormalPoint,secondCP);
	
	var absoluteHeading = !this.dirty ? gld.heading + blockGeoLocData.heading : blockGeoLocData.heading;
	var absolutePitch = !this.dirty ? gld.pitch + blockGeoLocData.pitch : blockGeoLocData.pitch;
	var absoluteRoll = !this.dirty ? gld.roll + blockGeoLocData.roll : blockGeoLocData.roll;
	if(!this.dirty) changeLocationAndRotationAPI(managerFactory, shipId, blockId, undefined, undefined, undefined, absoluteHeading, absolutePitch, absoluteRoll);
	
	this.dirty = true;
	
	// Must calculate localRotationMatrix, using pitch, roll, heading angles.
	var geolocDataLocal = new Mago3D.GeoLocationData();
	geolocDataLocal.heading = blockGeoLocData.heading - gld.heading;
	geolocDataLocal.pitch = blockGeoLocData.pitch - gld.pitch;
	geolocDataLocal.roll = blockGeoLocData.roll - gld.roll;
	
	if(block.data.onlyPosDataArray === undefined)
	{
		var bbox = block.data.bbox;
		block.data.onlyPosDataArray = [];
		block.data.onlyPosDataArray[0] = bbox.minX;
		block.data.onlyPosDataArray[1] = bbox.minY;
		block.data.onlyPosDataArray[2] = bbox.minZ;
		block.data.onlyPosDataArray[3] = bbox.maxX;
		block.data.onlyPosDataArray[4] = bbox.maxY;
		block.data.onlyPosDataArray[5] = bbox.maxZ;
	}
	
	var onlyPosDataArray = block.data.onlyPosDataArray;
	var rotMatrixLC =geolocDataLocal.getRotMatrixLC();
	var rotPosDataArray =  rotMatrixLC.rotateXYZDataArray(onlyPosDataArray);
	blockGeoLocData.rotMatrixLC = undefined; 
	var rotBbox = Mago3D.BoundingBox.getBBoxByXYZDataArray(rotPosDataArray);
	var maxX = rotBbox.getXLength();
	var maxY = rotBbox.getYLength();
	var maxZ = rotBbox.getZLength();
	var halfZ = maxZ / 2;
	
	managerFactory.getViewer().camera.flyTo({
	    destination : new Cesium.Cartesian3(destWCX, destWCY, destWCZ),
	    orientation : {
	    	direction : new Cesium.Cartesian3(direcNormalPoint.x, direcNormalPoint.y, direcNormalPoint.z),
	    	up : new Cesium.Cartesian3(secondCP.x, secondCP.y, secondCP.z)
	    },
	    duration : 1,
	    complete : function() {
	    	var geoCoords = [];
	    	
	    	var geo1 = Mago3D.ManagerUtils.pointToGeographicCoord(new Mago3D.Point3D(centerWC.x + (normalWC.x*30),centerWC.y + (normalWC.y*30),centerWC.z + (normalWC.z*30)));
	    	var geo2 = Mago3D.ManagerUtils.pointToGeographicCoord(new Mago3D.Point3D(centerWC.x,centerWC.y,centerWC.z));
	    	
	    	geo1.altitude = tpHeight + halfZ;
	    	geo2.altitude = tpHeight + halfZ;
	    	
	    	geoCoords.push(geo1);
	    	geoCoords.push(geo2);
	    	
	    	var path3d = new Mago3D.Path3D(geoCoords);
			var animationOption = {
				animationType                : Mago3D.CODE.animationType.PATH,
				path                         : path3d,
				linearVelocityInMetersSecond : 20,
				autoChangeRotation : false
			};
	    	changeLocationAndRotationAPI(managerFactory, shipId, blockId, undefined, undefined, undefined, undefined, undefined, undefined, animationOption);
	    	
	    	//계산, 분리
	    	var blockTotalHeight = tpHeight + jbHeight + maxZ;
	    	var openingHeight = factory.options.wallOptions[0].openingInfo.height;
	    	//safePct
	    	var ratio = blockTotalHeight / openingHeight;
	    	
	    	var interFareResultType;
	    	if(safePct > ratio) {
	    		interFareResultType = 0;
	    	} else if(safePct < ratio && ratio < 1) {
	    		interFareResultType = 1;
	    	} else {
	    		interFareResultType = 2;
	    	}
	    	
	    	$('#openingHeight').text(openingHeight);
	    	$('#blockTotalHeight').text(blockTotalHeight);
	    	
	    	var viewer = managerFactory.getViewer();
	    	Cesium.Label.enableRightToLeftDetection = true;
	    	var labelPos = Cesium.Cartesian3.fromDegrees(geo2.longitude, geo2.latitude, 15);
	    	var labelId;
	    	if(interFareResultType == 0) {
	    		$('#interfareResult').text('안전').css('color','#03CF5D');
	    		
	    		var myLabelEntity = viewer.entities.add({
	    			label: {
	    				id: 'interfareResult',
	    				text: '안전',
	    				font: 'bold 40px sans-serif',
	    				outlineColor:Cesium.Color.WHITE,
	    				outlineWidth:2.0,
	    				fillColor : Cesium.Color.GREEN,
	                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
	                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
	                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
	    			},
    				position : labelPos
    			});
	    		labelId = myLabelEntity.id;
	    	} else if( interFareResultType == 1){
	    		$('#interfareResult').text('위험').css('color','#FFF766');
	    		
	    		var myLabelEntity = viewer.entities.add({
	    			label: {
	    				id: 'interfareResult',
	    				text: '위험',
	    				font: 'bold 40px sans-serif',
	    				outlineColor:Cesium.Color.WHITE,
	    				outlineWidth:2.0,
	    				fillColor : Cesium.Color.YELLOW,
	                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
	                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
	                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
	    			},
    				position : labelPos
    			});
	    		labelId = myLabelEntity.id;
	    	} else {
	    		$('#interfareResult').text('불가').css('color','#C00000');
	    		
	    		var myLabelEntity = viewer.entities.add({
	    			label: {
	    				id: 'interfareResult',
	    				text: '불가',
	    				font: 'bold 40px sans-serif',
	    				outlineColor:Cesium.Color.WHITE,
	    				outlineWidth:2.0,
	    				fillColor : Cesium.Color.RED,
	                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
	                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
	                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
	    			},
    				position : labelPos
    			});
	    		labelId = myLabelEntity.id;
	    	}
	    	
	    	setTimeout(function(){
	    		viewer.entities.removeById(labelId);
	    	}, 3000);
	    	
	    	$('#paintInterfareResult').show();
	    }
	});
}