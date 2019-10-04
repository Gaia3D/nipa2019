$(function(){
    //지번 목록 전체 가져오기
    //getSelectJibunList();

	$('[data-nav=jibunSearch]').click(function() {
		loadJibunAll();
	});

    // 지번 콤보 버튼 클릭
    $('#jibunCombo').on('click', '.ui-combobox-button', function() {
       var jibun = $('#selectJibun').siblings().children('.ui-combobox-input').val();
       if(!jibun) {
          alert('지번을 한자리 이상 입력해주세요.');
       }
    });

    // 지번 검색 버튼 클릭
    $('#jibunSearchButton').on('click', function() {
        var valid = validationJibun();
        if(valid) {
            searchJibun();
        }
    });

    // 지번 위치로 이동
    $('#jibunResultBody').on('click', '.move', function() {
        var index = $("#jibunResultBody tr.move").index(this);
        $('#jibunResultBody tr').not(this).css('background-color', '#ffffff');
        flyToJibun(index);
    });
});

function loadJibunAll() {
    var url = '/jibuns';

    $.ajax({
        url: url,
        type: 'GET',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function(res){
            addJibunCombo(res);
        },
        error: function(request, status, error) {
        	// alert message, 세션이 없는 경우 로그인 페이지로 이동 - common.js
        	ajaxErrorHandler(request);
        }
    });
}

function addJibunCombo(res) {
    var h = '';
    if(res.length > 0) {
    	h += '<option value="">전체</option>';
    	for(var i=0, l=res.length; i<l; i++) {
    		h += '<option value="'+ res[i] +'">' + res[i] + '</option>';
    	}
    }
    $('#selectJibun').empty().append(h);
}

function validationJibun() {
    var valid = false;
    var jibun = $('#selectJibun').siblings().children('.ui-combobox-input').val();
    if(jibun) {
        valid = true;
    } else {
        alert('지번을 입력해주세요.');
    }
    return valid;
}

function searchJibun(pageNo) {
	var pageNo = (pageNo === undefined) ? 1 : pageNo;

    // default options
    var options = {};
    options.pageNo = pageNo;
    options.pageRows = 10;
    options.pageListCount = 5;

    // search options
    var name = $('#selectJibun').siblings().children('.ui-combobox-input').val();
    var url = '/jibuns/' + name;

    $.ajax({
        url: url,
        type: 'GET',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: options,
        success: function(res){
            initHighlightLayer();
            addJibunTable(res);
        },
        error: function(request, status, error) {
        	// alert message, 세션이 없는 경우 로그인 페이지로 이동 - common.js
        	ajaxErrorHandler(request);
        }
    });
}

/*function initHighlightLayer() {
    //var layer = HMD.GIS.getLayerById('highlight_layer');
	var layer;
    if(layer) {
        layer.getSource().clear();
    } else {
        var highlightLayer = new ol.layer.Vector({
            id: 'highlight_layer',
            zIndex : 48,
            source: new ol.source.Vector({
                features: new ol.Collection()
            })
        });
        HMD.Map.addLayer(highlightLayer);
    }
}*/

function initHighlightLayer(){
	var layer = HMD.highlight[0];
	if(layer){
		layer.removeAll();
	}
}

function addJibunTable(res) {
    // add table
    var list = res.list;
    var count = res.count;

    var h = '';
    if(list.length > 0 ) {
        for(var i=0, l=list.length; i<l; i++) {
            h += '<tr class="move">'
            h +=    '<td class = "level0">'+ list[i].workplace +'</td>'
            h +=    '<td class = "name">'+ list[i].name +'</td>'
            h +=    '<td class="wkt" style="display:none">'+ list[i].textWkbGeometry +'</td>'
            h +=    '<td class="id" style="display:none">'+ list[i].ogcFid +'</td>'
            h += '</tr>'
        }

        $('#jibunCount').text(addComma(count));

        // TODO: 정리 필요, 핸들바의 each에서 start end 값 줄수 있도록 수정할 예정
        res.pagination.pageList = [];
        var start = res.pagination.startPage;
        var end = res.pagination.endPage;
        for(i = start; i <= end; i++) {
        	res.pagination.pageList.push(i);
        }

        // 페이징
        var pageTemplate = Handlebars.compile($("#templatePaginationJibun").html());
        var pageHtml = pageTemplate(res);
        $("#pageContentsJibun").html('').append(pageHtml);
    } else {
        h += '<tr>';
        h +=    '<td colspan="4">검색된 데이터가 없습니다.</td>';
        h += '</tr>';

        $('#jibunCount').text(0);
    }

    $('#jibunResultBody').empty().append(h);

    if(count === 1) {
        flyToJibun(0);
    }
}

// 지번의 위치로 이동한다.
function flyToJibun(index) {
   var $target = $('#jibunResultBody tr.move:eq('+index+')');
   $target.css('background-color', '#ebeff8');
   var wkt = $target.find('.wkt').text();
   var name = $target.find('.name').text();
   var ogc_fid = $target.find('.id').text();
   var level0 = $target.find('.level0').text();
    
   printEntity(level0,name,ogc_fid,"hmd:layer_lot_number");
   
   //HMD.GIS.flyToGeometry(geometry);
}

//검색한 지번 피쳐를 표시해주고, 그 피쳐를 리턴한다.
function addJibunFeature(wkt) {
   var layer = HMD.GIS.getLayerById('highlight_layer');
   var feature = HMD.GIS.getFeatureFromWkt(wkt);
   feature.setStyle(jibunStyle());
   layer.getSource().clear();
   layer.getSource().addFeature(feature);
   return feature;
}
function getMiddlePoint(array){
	for(var point in array){
		
	}
}
function jibunStyle() {
   var style = new ol.style.Style({
      fill: new ol.style.Fill({color: 'rgba(0, 84, 255, 0.2)'}),
      stroke: new ol.style.Stroke({color: 'rgba(0, 84, 255, 1)', width: 2})
   });
   return style;
}

function printEntity(level0, name, ogc_fid,layerName){
	var viewer = HMD.Viewer;
    initHighlightLayer();
    setJsonDataSourceForJibun(viewer,layerName,null,"layer_lot_number"+'.'+ogc_fid,null,function(e){
        var entities = e.entities.values;
        HMD.highlight[0] = e.entities;
        var color = Cesium.Color.YELLOW;
        //var color = Cesium.Color.fromBytes(207,207,207,1.0);
		//var color = Cesium.Color.SILVER.withAlpha(1.0);
		var entity = entities[0];
        entity.polygon.material = color;
        entity.polygon.outline = false;    
        var movePoint = entity.polygon.hierarchy.getValue().positions[0];
        movePoint = convertFromCartesianToDegree(movePoint);
        viewer.camera.flyTo(
        {
        	destination : new Cesium.Cartesian3.fromDegrees(movePoint.x,movePoint.y,50)
        }
        );
        viewer.camera.zoomOut(100000);
        
        
    });
}

function convertFromCartesianToDegree(position){
	var cartographciPosition = Cesium.Cartographic.fromCartesian(position);
	return {
		"x" : Cesium.Math.toDegrees(cartographciPosition.longitude), 
		"y" : Cesium.Math.toDegrees(cartographciPosition.latitude),
		"z" : cartographciPosition.height
	};
}



function setJsonDataSourceForJibun(viewer, layerName, cql, featureid, opt, entityFunc) {
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
	if(featureid){
		param.featureid = featureid;
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
		viewer.dataSources.add(e);
    });
}