$(document).ready(function() {
	var h = '';
	for(var i in HMD.Legend.blockStatus) {
		var status = HMD.Legend.blockStatus[i];
		h += '<li><span class="legend" style="background-color: rgb(' + status.bgColor + ');"></span>' + status.stageText + '</li>';
	}
	$('#legendBlock').append(h);
});