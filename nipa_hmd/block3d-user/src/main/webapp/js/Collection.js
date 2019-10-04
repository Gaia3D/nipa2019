/**
* @param {Array<T>=} opt_array Array.
*/
var Collection = function(opt_array) {
	this.array_ = opt_array ? opt_array : [];
}

Collection.prototype.getLength = function () {
	return this.array_.length;
}

Collection.prototype.clear = function () {
	this.array_ = [];
}

Collection.prototype.setArray = function (array) {
	this.array_ = array;
}

Collection.prototype.forEach = function (func,thisArgs) {
	if(!func || typeof func !== 'function') return false;
	
	var that = this;
	var arr = that.array_;
	for(var i =0,len=arr.length; i < len; ++i) {
		func.call( thisArgs ? thisArgs : that, arr[i], i, arr);
	}
}

Collection.prototype.getItem = function (seq) {
	return this.array_[seq];
}