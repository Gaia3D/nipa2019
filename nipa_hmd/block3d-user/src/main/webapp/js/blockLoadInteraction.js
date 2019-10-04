var BlockLoad = function(){
	Interaction.call(this);
	
	this.hasTree = false;
}

BlockLoad.prototype = Object.create(Interaction.prototype);
BlockLoad.prototype.contructor = BlockLoad;

BlockLoad.prototype.init = function(){
}

BlockLoad.prototype.makeTree = function(list){
	if(!this.hasTree) {
		var shipBlockObj = {};
		for(var i in list) {
			var block = list[i];
			
			if(block.sorn != 'S') continue;
			var shipNo = block.shipNo;
			
			if(!shipBlockObj[shipNo]) {
				shipBlockObj[shipNo] = [];
			}
			
			shipBlockObj[shipNo].push(block);
		}
		
		var html = '';
		for(var shipNo in shipBlockObj) {
			if(!shipBlockObj.hasOwnProperty(shipNo)) continue;
			var blockList = shipBlockObj[shipNo];
			
			html += '<li class="rootLayer off" data-depth="1">';
			html += '<p class="depthOne"><span class="folder"></span>호선 - ' + shipNo + '</p>';
			
			html += '<ul>';
			for(var i in blockList) {
				var block = blockList[i];
				html += '<li class="nodepth">';
				html += '<p>' + block.block + '</p>';
				html += '</li>';
			}
			html += '</ul>';
		}
		$('.blockLoadList').empty().append(html);
		this.hasTree = true;
	}
}

BlockLoad.prototype.startLoad = function(shipNo, blockNo) {
	var magoManager = managerFactory.getMagoManager();
	var block = magoManager.hierarchyManager.getNodeByDataKey('workshop.json', 'B11P');
	this.setBlock(block);
	this.setActive(true);
}
BlockLoad.prototype.setHandler = function() {
	var that = this;
	var scene = HMD.Viewer.scene;
	if(that.active) {
		var block = that.getBlock();
		var geoLocDataManager = block.data.geoLocDataManager;
		var currentGeoLocData = geoLocDataManager.getCurrentGeoLocationData();
		var magoManager = managerFactory.getMagoManager();
		
		var firstGeo = new Mago3D.GeographicCoord();
		firstGeo.copyFrom(currentGeoLocData.geographicCoord);
		var secondGeo = new Mago3D.GeographicCoord();
		secondGeo.copyFrom(currentGeoLocData.geographicCoord);
		secondGeo.altitude = 0;
		
		var geoList = new Mago3D.GeographicCoordsList([firstGeo, secondGeo]);
		
		
		var geoLocDataManager = new Mago3D.GeoLocationDataManager();//geoCoord.getGeoLocationDataManager();
		var geoLocData = geoLocDataManager.newGeoLocationData("noName");
		geoLocData = Mago3D.ManagerUtils.calculateGeoLocationData(firstGeo.longitude, firstGeo.latitude, firstGeo.altitude, 0, 0, 0, geoLocData, magoManager);
		
		geoList.geoLocDataManager = geoLocDataManager;
		geoList.makeLines(magoManager);
		magoManager.modeler.addObject(geoList);
		
		that.handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
		scene.canvas.style.cursor = 'none'
		that.handler.setInputAction(function(movement){
			var ray = HMD.Viewer.camera.getPickRay(movement.endPosition);
			var strWorldPoint = scene.globe.pick(ray, scene);
			if(strWorldPoint) {
				var geoCoord = Mago3D.Globe.CartesianToGeographicWgs84(strWorldPoint.x, strWorldPoint.y, strWorldPoint.z, undefined, true);
				
				var firstGeo = new Mago3D.GeographicCoord();
				firstGeo.copyFrom(geoCoord);
				firstGeo.altitude = currentGeoLocData.geographicCoord.altitude;
				var secondGeo = new Mago3D.GeographicCoord();
				secondGeo.copyFrom(geoCoord);
				secondGeo.altitude = 0;
				
				geoList.geographicCoordsArray = [firstGeo,secondGeo];
				
				block.changeLocationAndRotation(geoCoord.latitude, geoCoord.longitude, currentGeoLocData.geographicCoord.altitude, currentGeoLocData.heading, currentGeoLocData.pitch, currentGeoLocData.roll, magoManager);
			}
		},Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		
		document.addEventListener('keydown', function(event) {
			// For Heading
			if (event.keyCode === 'X'.charCodeAt(0)) {
				that.rotateBlock('x');
			} else if (event.keyCode === 'C'.charCodeAt(0)){
				that.rotateBlock('y');
			} else if (event.keyCode === 'Z'.charCodeAt(0)){
				that.rotateBlock('z');
			} else if (event.keyCode === 'W'.charCodeAt(0)){
				var firstGeo = new Mago3D.GeographicCoord();
				firstGeo.copyFrom(currentGeoLocData.geographicCoord);
				firstGeo.altitude = currentGeoLocData.geographicCoord.altitude+5;
				var secondGeo = new Mago3D.GeographicCoord();
				secondGeo.copyFrom(currentGeoLocData.geographicCoord);
				secondGeo.altitude = 0;
				
				geoList.geographicCoordsArray = [firstGeo,secondGeo];
				
				block.changeLocationAndRotation(currentGeoLocData.geographicCoord.latitude, currentGeoLocData.geographicCoord.longitude, currentGeoLocData.geographicCoord.altitude+5, currentGeoLocData.heading, currentGeoLocData.pitch, currentGeoLocData.roll, magoManager);
			} else if (event.keyCode === 'S'.charCodeAt(0)){
				var firstGeo = new Mago3D.GeographicCoord();
				firstGeo.copyFrom(currentGeoLocData.geographicCoord);
				firstGeo.altitude = currentGeoLocData.geographicCoord.altitude-5;
				var secondGeo = new Mago3D.GeographicCoord();
				secondGeo.copyFrom(currentGeoLocData.geographicCoord);
				secondGeo.altitude = 0;
				
				geoList.geographicCoordsArray = [firstGeo,secondGeo];
				
				block.changeLocationAndRotation(currentGeoLocData.geographicCoord.latitude, currentGeoLocData.geographicCoord.longitude, currentGeoLocData.geographicCoord.altitude-5, currentGeoLocData.heading, currentGeoLocData.pitch, currentGeoLocData.roll, magoManager);
			}
		});
	} else {
		that.handler.destroy();
		that.handler = undefined;
		scene.canvas.style.cursor = 'default'
	}
}
//
BlockLoad.prototype.setActive = function(active) {
	this.active = active;
	
	this.setHandler();
}

Mago3D.GeographicCoordsList.prototype.render = function(magoManager, shader, renderType, glPrimitive) {
	this.renderLines(magoManager, shader, renderType, false, false);
}