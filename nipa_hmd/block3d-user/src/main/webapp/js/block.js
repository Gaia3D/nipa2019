$(function(){

    /********** 초기 로딩 **********/
	/**
	 * 이 부분 확인해 보세요.
	 * 이벤트 걸린 거 쓸 것들은 남겨두시고 안쓰는 건 삭제부탁합니다.
	 */
    //$('#selectMfgInd').val(HMD.UserPolicy.mfgInd);
    getSelectList(['shipNo', 'block']);	// 셀렉트박스 초기로딩 // 'jibun'
    loadBlockAll();

    /**
    * 이벤트 처리함수 명명규칙
    * prefix => handler
    */
    /********** 검색 이벤트 **********/
    // 사업장 셀렉트박스 변경
    // focus, blur 이유: 동일한 셀렉트박스를 선택해도, 이벤트가 동작하도록 하는 요구사항이 있었음
    $('#selectMfgInd').on('focus', function() {
    	HMD.Temp = $('#selectMfgInd').val();
    	$('#selectMfgInd').val('');
    }).on('change', function() {
    	HMD.Temp = $('#selectMfgInd').val();
    	changeWorkplaceEvent();
    }).on('blur', function() {
    	$('#selectMfgInd').val(HMD.Temp);
    });

    // 호선/비호선/정반/ME 변경
    $('input[type=radio][name=sorn]').on('change', handlerChangeShipGbn);

    // 호선ID 셀렉트박스 변경
    $('#selectShipNo').combobox({
        select: function(event, ui) {
            $('#selectBlock').val('');
            $('#selectBlock').siblings().children('.ui-combobox-input').val('');
            getSelectList(['block']);	// 셀렉트박스 초기로딩
        }
    });
    
    // 호선ID 셀렉트박스 변경 - 입력 값을 지웠을 경우 빈값이면 블록 목록 재조회
    $('#shipNoCombo').on('focusout', '.ui-combobox-input', handlerRefreshBlock);

    // 블록 검색 버튼 클릭
    $('#blockSearchButton').on('click', function() {
    	searchBlock();
    });

    // 공정정보 펼치기
    $('#popOpenProgress').on('click', handlerProgressBlock);

    // 간섭체크 펼치기
    $('#popOpenPaint').on('click', checkBlockPaintInterfere);
    
    // 간섭체크 실행
    $('#blockFactoryChkButton').on('click', function(){HMD.paintInterfare.interfare.call(HMD.paintInterfare)});
    
    $('#popBlockMoveToLoad').on('click',function(){HMD.blockLoad.startLoad.call(HMD.blockLoad,$('#pop').data('shipno'),$('#pop').data('block'))});
    // 상세정보 닫기
    $('#popCloseButton').on('click', handlerClosePopup);

    // 블록 위치로 이동
    $('#blockResultBody').on('click', '.move', handlerFlyToBlock);

    // 블록 이동 모드
    $('#checkBlockMove').on('click', handlerMovoToBlock);

    // 대상 블록만 보기
    $('#viewOnlySearchFeature').on('change', manageBlockLayer);
    
});

// 색상 변경 (마우스오버)
function handlerBlockHighlight(evt) {
    var selected = evt.selected;
    var deselected = evt.deselected;

    if (selected.length) {
        selected.forEach(function(feature) {
            if(feature) {
                var status = feature.get('status');
                feature.setStyle(feature.get(status + 'StyleOn'));
            }
        });
    }
    deselected.forEach(function(feature) {
        if(feature) {
            var status = feature.get('status');
            feature.setStyle(feature.get(status + 'Style'));
        }
    });
}

// 팝업 조회 (클릭)
function handlerBlockPopup(evt) {
    if(!$('#checkBlockMove').hasClass("on") && !$('.measures').hasClass("on")) {
        displayPopup(evt);
    }
}

// 사업장 셀렉트박스 변경
function changeWorkplaceEvent() {
	$('.ui-combobox-input').val('');
    getSelectList(['shipNo', 'block']);	// 셀렉트박스 초기로딩	// 'jibun'
    //HMD.GIS.moveToWorkplace();
}

// 호선/비호선/정반/ME 라디오 변경
function handlerChangeShipGbn() {
    $('#blockSearchArea .ui-combobox-input').val('');
    getSelectList(['shipNo', 'block']);	// 셀렉트박스 초기로딩
    clearBlockList();

    // 검색화면 변경
    var sorn = $('input[type=radio][name=sorn]:checked').val();
    if(sorn === 'J' || sorn === 'N') {
        var text = sorn === 'J' ? '정반' : '품목';
        $('#shipNoCombo').parent().hide();
        $('#selectBlock').siblings('span.label').text(text);
        $('#blockSearchButton').css('margin-top', '43px');	// TODO: css로 처리 필요
    } else {
        var text = '블록';
        $('#shipNoCombo').parent().show();
        $('#selectBlock').siblings('span.label').text(text);
        $('#blockSearchButton').css('margin-top', '0px');	// TODO: css로 처리 필요
    }
}

// 호선ID 셀렉트박스 변경 - 입력 값을 지웠을 경우 빈값이면 블록 목록 재조회
function handlerRefreshBlock() {
    var shipNo = $('#selectShipNo').siblings().children('.ui-combobox-input');
    if(!shipNo.val()) {
        $('#selectShipNo').val('');
        $('#selectBlock').siblings().children('.ui-combobox-input').val('');
        getSelectList(['block']);	// 셀렉트박스 초기로딩
    }
}

// 공정정보 펼치기
function handlerProgressBlock() {
    var activeProgressInfo = $('#popContentsDetail').is(':visible');
    if(!activeProgressInfo) {
    	if($('#popPaintDetail').is(':visible')) {
        	$('#popPaintDetail').hide();
            $('#popOpenPaint').text($('#popOpenPaint').data('on'));
            $('#popPaintDetail').parent('.viewMore').removeClass('on');
        }
    	
        $('#pop').css('height', '445px');
        $('#popContentsDetail').show();
        $('#popOpenProgress').text($('#popOpenProgress').data('off'));
        $('#popContentsDetail').parent('.viewMore').addClass('on');
    } else {
        $('#pop').css('height', '230px');
        $('#popContentsDetail').hide();
        $('#popOpenProgress').text($('#popOpenProgress').data('on'));
        $('#popContentsDetail').parent('.viewMore').removeClass('on');
    }

    detailProgressInfo();
}

//도장공장 간섭 펼치기
function handlerCheckBlockFactory() {
	$('.navWrap .nav #simulationMenu').trigger('click');
	$('#simulationContent .btnGroup #simulPaintBtn').trigger('click');
}

// 상세정보 닫기
function handlerClosePopup() {
	$('#pop').removeData('cartesian').hide();
	stopPopupMoveEvent();
}

// 블록 위치로 이동
function handlerFlyToBlock() {
	console.info(this);
    var index = $("#blockResultBody tr.move").index(this);
    $("#blockResultBody tr").not(this).css('background-color', '#ffffff');
    handlerClosePopup();
    flyToBlock(index);
}

// 블록 이동 모드
function handlerMovoToBlock() {
    HMD.GIS.clearSelectFeature();
    $('#pop').hide();
    $('#checkBlockMove').toggleClass("on");
}

// 대상 블록만 보기
function manageBlockLayer() {
	var blockLayer = HMD.GIS.getLayerById('layer_block');
	var blockLayerHighlight = HMD.GIS.getLayerById('layer_block_highlight');

	// 대상보기 체크박스 눌렀는지 확인
	var isChecked = $('#viewOnlySearchFeature').is(':checked');
	// 레이어가 켜져있는지 확인
	var isCurruntBlockView = (blockLayer.getVisible() || blockLayerHighlight.getVisible());

	// 블록 레이어 on/off
	blockLayer.setVisible(isCurruntBlockView && !isChecked);
	blockLayerHighlight.setVisible(isCurruntBlockView && isChecked);
}

/**************************************************************/

// 셀렉트박스 초기로딩
function getSelectList(selectboxType) {
    var options = {};
    options.shipNo = $('#selectShipNo').siblings().children('.ui-combobox-input').val();
    options.sorn = $('input[type=radio][name=sorn]:checked').val();
    options.selectboxType = selectboxType.join(',');

    $.ajax({
        url: '/init-data',
        type: 'GET',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        dataType: 'json',
        data: options,
        success: function(res){
            if(res.shipNo)	addShipNo(res.shipNo);
            if(res.block)	addBlock(res.block);
        },
        error: function(request, status, error) {
        	// alert message, 세션이 없는 경우 로그인 페이지로 이동 - common.js
        	ajaxErrorHandler(request);
        }
    });
}

function addShipNo(res) {
    HMD.Block.ship = res;
    var h = '';
    h += '<option value="">전체</option>';
    for(var i=0, l=res.length; i<l; i++) {
        var shipNo = res[i].shipNo;
        h += '<option value="'+ shipNo +'">' + shipNo + '</option>';
    }
    $('#selectShipNo').empty().append(h);
}

function addBlock(res) {
    HMD.Block.block = res;
    var h = '';
    h += '<option value="">전체</option>';
    for(var i=0, l=res.length; i<l; i++) {
        var block = res[i].block;
        h += '<option value="'+ block +'">' + block + '</option>';
    }
    $('#selectBlock').empty().append(h);
}

function addFactory() {
	if(!HMD.paintInterfare.hasFactoryList) {
		if(!$.isEmptyObject(HMD.Layer.PaintShop)) {
			var h = '<option value="">전체</option>';
			for(var layerName in HMD.Layer.PaintShop) {
				var features = HMD.Layer.PaintShop[layerName];
				for(var i in features) {
					var feature = features[i];
					if(feature instanceof Mago3D.BasicFactory) {
						h += '<option value="'+ feature.id +'">' + feature.name + '</option>';
					}
				}
			}
			
		    $('#blockChkFactories').empty().append(h);
		    HMD.paintInterfare.hasFactoryList = true;
		}
	}
	//$('#blockChkFactories').siblings().children('.ui-combobox-input').val('');
}

function checkBlockPaintInterfere() {
	var shipId = 'workshop.json';
	var blockId = 'B11P';
	
	HMD.paintInterfare.setBlock(getBlock(shipId,blockId));
	
	$('#simulationMenu').trigger('click');
	$('#simulPaintBtn').trigger('click');
}
 
// 화면 초기화
function clearBlockList() {
    addBlockList({list: []});
    //addBlockFeaturesByMatchOptions();
    $("#pageContentsBlock").html('');
}

//블록 초기로딩
function loadBlockAll() {
    $.ajax({
        url: '/block-all',
        type: 'GET',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        dataType: 'json',
        success: function(res){
        	var list = res;
            //addBlockFeatures(list, 'layer_block');
            HMD.Block.list = list;
            
            //블록 적재 시뮬레이션 트리생성
            HMD.blockLoad.makeTree(list);
        },
        error: function(request, status, error) {
        	// alert message, 세션이 없는 경우 로그인 페이지로 이동 - common.js
        	ajaxErrorHandler(request);
        }
    });
}

// 블록 검색
function searchBlock(pageNo) {
    var pageNo = (pageNo === undefined) ? 1 : pageNo;

    // default options
    var options = {};
    options.pageNo = pageNo;
    options.pageRows = 10;
    options.pageListCount = 5;

    // search options
    options.sorn = $('input[type=radio][name=sorn]:checked').val();
    options.shipNo = $('#selectShipNo').siblings().children('.ui-combobox-input').val();
    options.block = $('#selectBlock').siblings().children('.ui-combobox-input').val();

    $.ajax({
        url: '/block',
        type: 'GET',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        dataType: 'json',
        data: options,
        success: function(res){
            //initBlockLayer();
            HMD.Block.list = res.list;
            addBlockList(res, options);
            //addBlockFeaturesByMatchOptions(options);
        },
        error: function(request, status, error) {
        	// alert message, 세션이 없는 경우 로그인 페이지로 이동 - common.js
        	ajaxErrorHandler(request);
        }
    });
}

function addBlockFeatures(res, layerId) {
    var len = res.length;

    for(var i=0; i<len; i++) {
        var rawData = res[i].ctipoint;
        var originVertex = rawData.split(";");
        var transVertex = [];

        for(var j=0, l=originVertex.length; j<l; j++) {
            var coord = originVertex[j].split(",");
            var transCoord = HMD.GIS.transCoord4326ToCurProj(coord);
            transVertex.push(transCoord);
        }
        transVertex.push(transVertex[0]);

        var data = {};
        data.mfgInd = res[i].mfgInd;
        data.sorn 	= res[i].sorn;
        data.shipNo = res[i].shipNo;
        data.block 	= res[i].block;
        data.jibun 	= res[i].jibun;
        data.stgCd 	= res[i].stgCd;
        data.plateid = res[i].plateid;
        data.delayYn = res[i].delayYn;

        var feature = HMD.GIS.getFeatureByCoord('Polygon', transVertex);
        if(feature){
            feature.set('data', data);
            feature.set('status', 'default');
            feature = setFeatureStyle(feature, HMD.UserPolicy.blockLabelYn);
            var layer = HMD.GIS.getLayerById(layerId);
            layer.getSource().addFeature(feature);
        }
    }
}

function addBlockFeaturesByMatchOptions(options) {
    var features = HMD.GIS.getLayerById('layer_block').getSource().getFeatures();
    var highlightLayer = HMD.GIS.getLayerById('layer_block_highlight');
    highlightLayer.getSource().clear();

    if(options) {
        features.filter(function(feature, i) {
            var matchSearchOption = false;
            var data = feature.get('data');

            matchSearchOption = (!options.sorn || data.sorn === options.sorn) &&
                                (!options.shipNo || data.shipNo.indexOf(options.shipNo) === 0) &&	// === 0 : 전방일치
                                (!options.block  || data.block.indexOf(options.block)   === 0)
                                ||
                                // 정반 위에 블록이 있는 경우에는, 블록을 검색함
                                (options.sorn === "J" && data.sorn === 'S' && data.plateid != null);

            if(matchSearchOption) {
                // 대상 블록만 보기 레이어에도, 동일한 피쳐를 추가
                highlightLayer.getSource().addFeature(feature);
            }
        });
    }
}

function addBlockList(res) {
    var list = res.list;
    var count = res.count;
    var sorn = $('input[type=radio][name=sorn]:checked').val();

    // header
    var headerHtml = blockTableHeader(sorn);
    $('#blockResultHeader').empty().append(headerHtml);
    var rowSpan = $('#blockResultHeader col').length;

    // body
    var bodyHtml = '';
    if(list.length > 0 ) {
        for(var i=0, l=list.length; i<l; i++) {
            bodyHtml += blockTableBody(list[i]);
        }

        $('#blockCount').text(addComma(count));

        // TODO: 정리 필요, 핸들바의 each에서 start end 값 줄수 있도록 수정할 예정
        res.pagination.pageList = [];
        var start = res.pagination.startPage;
        var end = res.pagination.endPage;
        for(i = start; i <= end; i++) {
        	res.pagination.pageList.push(i);
        }

        // 페이징
        var pageTemplate = Handlebars.compile($("#templatePaginationBlock").html());
        var pageHtml = pageTemplate(res);
        $("#pageContentsBlock").html('').append(pageHtml);
    } else {
        bodyHtml += '<tr>';
        bodyHtml += 	'<td colspan=' + rowSpan + '>검색된 데이터가 없습니다.</td>';
        bodyHtml += '</tr>';

        $('#blockCount').text(0);
    }

    $('#blockResultBody').empty().append(bodyHtml);

    if(list.length === 1) {
        flyToBlock(0);
    }
}

function blockTableHeader(sorn) {
    var h = '';
    var text = '';

    switch(sorn) {
    case 'J' : text = '정반'; break;
    case 'N' : text = '품목'; break;
    default  : text = '블록'
    }

    if(sorn === 'S' || sorn === 'M') {	// 블록, M/E
        h += '<colgroup>'
        h +=     '<col width="90px">'
        h +=     '<col width="90px">'
        h +=     '<col width="70px">'
        h +=     '<col width="">'
        h += '</colgroup>'
        h += '<thead>'
        h +=     '<tr>'
        h += 		  '<th>사업장</th>'
        h += 	      '<th>호선</th>'
        h += 	      '<th>' + text + '</th>'
        h += 	      '<th>지번</th>'
        h +=	 '</tr>'
        h += '</thead>'
    } else {	// 정반, 비호선
        h += '<colgroup>'
        h +=     '<col width="120px">'
        h +=     '<col width="100px">'
        h +=     '<col width="">'
        h += '</colgroup>'
        h += '<thead>'
        h +=     '<tr>'
        h += 		  '<th>사업장</th>'
        h += 	      '<th>' + text + '</th>'
        h += 	      '<th>지번</th>'
        h +=	 '</tr>'
        h += '</thead>'
    }

    return h;
}

function blockTableBody(list) {
    var h = '';
    var text = '';
    var mfgIndCode = list.mfgInd === '7' ? '1' : list.mfgInd;
    var mfgIndText = $('#selectMfgInd option[value="' + mfgIndCode + '"]').text();

    if(list.sorn === 'S' || list.sorn === 'M') {	// 블록, M/E
        h += '<tr class="move">'
        h += 	'<td style="width:80px;">'+ mfgIndText +'</td>'
        h += 	'<td style="width:70px;">'+ list.shipNo +'</td>'
        h += 	'<td style="width:70px;">'+ list.block +'</td>'
        h += 	'<td>'+ list.jibun +'</td>'
        h += '</tr>'
    } else {	// 정반, 비호선
        h += '<tr class="move">'
        h += 	'<td style="width:110px;">'+ mfgIndText +'</td>'
        h += 	'<td style="width:90px;">'+ list.block +'</td>'
        h += 	'<td>'+ list.jibun +'</td>'
        h += '</tr>'
    }

    return h;
}

function initBlockLayer() {
    HMD.GIS.clearLayer('layer_block_highlight');
    var features = HMD.GIS.getLayerById('layer_block').getSource().getFeatures();
    features.map(function(feature) {
        feature.set('status', 'default');
        feature.setStyle(feature.get('defaultStyle'));
    });
}
//임시로 ctipoint로 센터 사용.
function flyToBlock(index) {
    $('#blockResultBody tr.move:eq('+index+')').css('background-color', '#ebeff8');

    var viewer = HMD.Viewer;
    var res = HMD.Block.list[index];
    
    var shipNo = res.shipNo;
    var blockNo = res.block;
    var jibun = res.jibun;
    
    var coords = getBlockCoords(res.ctipoint);
    var centroidFeature = getBlockCenter(coords);
    var centroidCoords = centroidFeature.geometry.coordinates;
    
    var lon = centroidCoords[0];
    var lat = centroidCoords[1];
    
    viewer.camera.flyTo({
	    destination : Cesium.Cartesian3.fromDegrees(lon, lat, viewer.camera.positionCartographic.height),
	    duration : 1,
	    complete : function() {
	    	var $popup = $('#pop');
	    	var cartesian = Cesium.Cartesian3.fromDegrees(lon, lat);
	    	
	    	//setPopupPostion(cartesian);
	    	$('#pop').show();
	    	$('#pop').data({shipno:shipNo,block:blockNo, jibun:jibun});
	    	$popup.data('cartesian', JSON.stringify(cartesian)).show();
	    	
	        //startPopupMoveEvent();
	        
	        detailBlock({
	        	shipNo : shipNo,
	        	block : blockNo,
	        	jibun : jibun
	        });
	    }
	});
}

function getBlockCoords(ctipoint) {
    var originVertex = ctipoint.split(";");
    var transVertex = [];

    for(var j=0, l=originVertex.length; j<l; j++) {
        var coord = originVertex[j].split(",");
        for(var i in coord) {
        	coord[i] = parseFloat(coord[i]);
        }
        transVertex.push(coord);
    }
    transVertex.push(transVertex[0]);
    
    return transVertex;
}
function getBlockCenter(coords) {
	var polygon = turf.polygon([coords]);
    return turf.centroid(polygon);
}
function defineStyle(match, feature) {
	if(match) {
        // 검색된 피쳐의 색상을 변경함
        feature.set('status', 'selected');
        feature.setStyle(feature.get('selectedStyle'));
	} else {
        feature.set('status', 'default');
        feature.setStyle(feature.get('defaultStyle'));
	}
}

function displayTooltip(evt) {
    var pixel = HMD.Map.getEventPixel(evt.originalEvent);
    var feature = HMD.Map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        var result = null;
        if(layer != null && (layer.get('id') === 'layer_block' || layer.get('id') === 'layer_block_highlight')){
            result = feature;
        }
        return result;
    });

    if (feature) {
        // 툴팁 on
        $("#tooltip").show();

        /***** 블록일 경우 *****/
        // 오버레이에 의한 위치 보정
        var overlay = HMD.Map.getOverlayById('tooltip-overlay');
        var element = overlay.getElement();
        var coordinate = evt.coordinate;
        overlay.setPosition(coordinate);	// 팝업 위치 설정

        // 팝업 정보
        var data = feature.get('data');
        displayTooltipInfo(data);

    } else {
        // 툴팁 off
    	HMD.GIS.clearOverlayPopup('tooltip-overlay', '#tooltip');
    }
};

function displayTooltipInfo(data) {
    $("#tooltip").html("호선: " + data.shipNo + "<br/>블록: " + data.block + "<br/>지번: " + data.jibun);
}

// 블록 상세정보 조회
function displayPopup(evt) {
    var pixel = HMD.Map.getEventPixel(evt.originalEvent);
    var feature = HMD.Map.forEachFeatureAtPixel(pixel, function(feature) {
        return feature;
    });

    if (feature) {
        // 팝업 정보
        var data = feature.get('data');
		handlerClosePopup();
        if(data && (data.sorn === 'S' || data.sorn === 'M')) {
            /***** 블록일 경우 *****/
            // 오버레이에 의한 위치 보정
            var overlay = HMD.Map.getOverlayById('popup-overlay');
            var element = overlay.getElement();
            var coordinate = evt.coordinate;
            overlay.setPosition(coordinate);	// 팝업 위치 설정

            detailBlock(data);
        }
    }
}

// 블록 상세정보 조회
function detailBlock(params) {
    $.ajax({
        url: '/detail',
        type: 'GET',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        dataType: 'json',
        data: params,
        success: function(res) {
        	var data = res;
            HMD.Block.detail = data;
            if(data.length > 0) {
				var detail = data[0].infoNormal;
				detail = detail.substr(0, detail.length -1);
				detail = detail.replace(/\n/g, '<br />');

				$('#pop').show();
				$('#popTitle').html(params.shipNo + " - "+ params.block);
				$('#popContents').html(detail + params.jibun);
				$('#popOpenProgress').show();

				if($('#popContentsDetail').is(':visible')) {
					detailProgressInfo();
				}

            } else {
            	var detail = '상세 정보가 없습니다.'
				$('#pop').show();
				$('#popTitle').html(params.shipNo + " - "+ params.block);
				$('#popContents').html(detail);
				$('#popOpenProgress').hide();
            }
        },
        error: function(request, status, error) {
        	// alert message, 세션이 없는 경우 로그인 페이지로 이동 - common.js
        	ajaxErrorHandler(request);
        }
    });
}

// 공정정보 펼치기
function detailProgressInfo(){
    var progress = HMD.Block.detail[0].infoProgress.split(" ===")[1];
    if(progress) {
        progress = progress.replace('\n','').replace(/\n/g, "<br />");
    }
    $('#popContentsDetail').empty().html(progress);
}

// 블록의 스타일 정의
function setFeatureStyle(feature, isText) {
    var data = feature.get('data');
    feature.set('defaultStyle', HMD.Block.style('default', data, isText).def());
    feature.set('defaultStyleOn', HMD.Block.style('default', data, isText).on());
    feature.set('selectedStyle', HMD.Block.style('selected', data, isText).def());
    feature.set('selectedStyleOn', HMD.Block.style('selected', data, isText).on());
    feature.setStyle(feature.get('defaultStyle'));
    return feature;
}

function refreshStyle(isText) {
	var layer = HMD.GIS.getLayerById('layer_block');
	var features = layer.getSource().getFeatures();
	for(var i in features) {
		setFeatureStyle(features[i], isText);
		features[i].set('status', 'default');
        features[i].setStyle(features[i].get('defaultStyle'));
	}
}

// TODO: ScreenSpaceEventHandler 여기도 쓰도 딴데도 쓰고하는데 겹치는 문제없는지 확인해야함
//HANDLER TEST START
function startPopupMoveEvent() {
	
	HMD.Block.popupMoveEventHandler = new Cesium.ScreenSpaceEventHandler(HMD.Viewer.canvas);
	var handler = HMD.Block.popupMoveEventHandler; 
	var isDragging = false;

	
	handler.setInputAction(function() {
		isDragging = true;
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
	handler.setInputAction(function() {
		isDragging = true;
    }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
	handler.setInputAction(function() {
		isDragging = true;
    }, Cesium.ScreenSpaceEventType.PINCH_START);
	handler.setInputAction(function() {
		isDragging = true;
    }, Cesium.ScreenSpaceEventType.RIGHT_DOWN);
	
	handler.setInputAction(function() {
		isDragging = false;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
	handler.setInputAction(function() {
		isDragging = false;
    }, Cesium.ScreenSpaceEventType.MIDDLE_UP);
	handler.setInputAction(function() {
		isDragging = false;
    }, Cesium.ScreenSpaceEventType.PINCH_END);
	handler.setInputAction(function() {
		isDragging = false;
    }, Cesium.ScreenSpaceEventType.RIGHT_UP);
	
	
	handler.setInputAction(function() {
        if($('#pop').is(':visible') && isDragging) {
        	var cartesian = JSON.parse($('#pop').data('cartesian'));
        	setPopupPostion(cartesian);
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	
	handler.setInputAction(function() {
        if($('#pop').is(':visible')) {
        	var cartesian = JSON.parse($('#pop').data('cartesian'));
        	setPopupPostion(cartesian);
        }
    }, Cesium.ScreenSpaceEventType.WHEEL);
}

function stopPopupMoveEvent() {
	if(HMD.Block.popupMoveEventHandler) HMD.Block.popupMoveEventHandler = undefined;
}

function setPopupPostion(cartesian) {
	var canvasPosition = HMD.Viewer.scene.cartesianToCanvasCoordinates(cartesian);
	if(canvasPosition) {
		var top = canvasPosition.y;
		top = top < 0 ? 0 : top;
		$('#pop').css({
	    	top : top + 'px',
	    	left : canvasPosition.x + 'px'
	    });
	}
}
//HANDLER TEST END

function showSelectedObject(projectId,dataKey,objectId,latitude,longitude,altitude,heading,pitch,roll) {
	var interfareActive = HMD.paintInterfare.getActive();
	if(interfareActive) {
		startPaintInferfare(projectId, dataKey);
	}
};
function startPaintInferfare(projectId, dataKey) {
	var block = getBlock(projectId,dataKey);
	
	if(block && block instanceof Mago3D.Node) {
		HMD.paintInterfare.setBlock(block);
		HMD.paintInterfare.setPaintSetMode();
	}
}

function getBlock(projectId, dataKey) {
	var block;
	var hierarchyManager = managerFactory.getMagoManager().hierarchyManager;
	var nodesArray = hierarchyManager.nodesArray;
	for(var i in nodesArray) {
		var node = nodesArray[i];
		if(node.data.projectId == projectId && node.data.nodeId == dataKey){
			block = node;
			break;
		}
	}
	return block;
}