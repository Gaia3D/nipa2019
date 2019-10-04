var Interaction = function(){
	/**
	 * 선택된 블록
	 * @type{Mago3D.Node}
	 */
	this.block;
	
	/**
	 * 활성화 여부
	 * @type{boolean} showSelectedObject 함수는 block.js에 있음
	 */
	this.active = false;
	
	this.init();
}
Interaction.prototype.init = function() {
	return false;
}
Interaction.prototype.blockBackup = function() {
	var block = this.getBlock();
	var geoLocDataManager = block.data.geoLocDataManager;
	var geoLocData = geoLocDataManager.getCurrentGeoLocationData();
	
	var backUpData = new Mago3D.GeoLocationData('origin');
	backUpData.copyFrom(geoLocData);
	
	geoLocDataManager.backup = backUpData;
}
Interaction.prototype.blockInit = function() {
	var block = this.getBlock();
	if(block) {
		var geoLocDataManager = block.data.geoLocDataManager;
		var backup = geoLocDataManager.backup;
		
		var geoGraphicCoord = backup.geographicCoord;
		block.changeLocationAndRotation(geoGraphicCoord.latitude, geoGraphicCoord.longitude, geoGraphicCoord.altitude, backup.heading, backup.pitch, backup.roll, managerFactory.getMagoManager());
		geoLocDataManager.backup = undefined;
	}
	
	this.dirty = false;
}
Interaction.prototype.rotateBlock = function(type) {
	var block = this.getBlock();
	if(block) {
		var geoLocDataManager = block.data.geoLocDataManager;
		var geoLocData = geoLocDataManager.getCurrentGeoLocationData();
		
		var heading = parseFloat(geoLocData.heading);
		var pitch = parseFloat(geoLocData.pitch);
		var roll = parseFloat(geoLocData.roll);
		
		heading = (type == 'z') ?  heading + 90 : heading;
		heading = (heading > 360) ?  heading - 360 : heading;
		pitch = (type == 'x') ?  pitch + 90 : pitch;
		pitch = (pitch > 360) ?  pitch - 360 : pitch;
		roll = (type == 'y') ?  roll + 90 : roll;
		roll = (roll > 360) ?  roll - 360 : roll;
		
		var geoGraphicCoord = geoLocData.getGeographicCoords();
		block.changeLocationAndRotation(geoGraphicCoord.latitude, geoGraphicCoord.longitude, geoGraphicCoord.altitude, heading, pitch, roll, managerFactory.getMagoManager());
	}
}
Interaction.prototype.getBlock = function() {
	return this.block;
}
Interaction.prototype.setBlock = function(block) {
	if(block && this.block) {
		this.blockInit();
	}
	
	this.block = block;
	
	if(block) {
		this.blockBackup();
	}
}
Interaction.prototype.getActive = function() {
	return this.active;
}
Interaction.prototype.setActive = function(active) {
	this.active = active;
}