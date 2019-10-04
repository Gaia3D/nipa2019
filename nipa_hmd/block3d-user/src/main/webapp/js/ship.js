HMD.Ship = {

	// extent 변화에 따라 캔버스 크기 변화량 계산
	getZoomScale: function(shipType, resolution, projection, pixelRatio) {
		var pixelBounds = HMD[shipType].pixelBound;
		var saveGeoBounds = HMD[shipType].geoBound;

		// pixel boundary 정의 ==> 도크가 픽셀값으로 되어 있음. 픽셀의 min,max를 서버에서 계산하여 가져옴
		pixelBounds = [[pixelBounds[0],pixelBounds[1]], [pixelBounds[2],pixelBounds[3]]];
		var pixelBoundsWidth = pixelBounds[1][0] - pixelBounds[0][0];
		var pixelBoundsHeight = pixelBounds[1][1] - pixelBounds[0][1];

		// geometry boundary 정의 ==> 픽셀로 된 값의 좌표를 얻어옴 (현재 좌표계를 기준으로 함 - 5187)
		// geometry boundary는 zoom 레벨이 변경되었을 때, 크기를 유지하기 위해 필요한 값이므로 초기 값을 재사용함
		var geoBounds = [];
		var firstGeoBounds = [];
		if(saveGeoBounds.length === 0) {
			// 픽셀으로부터 좌표값을 얻음
			var map = HMD.Map;
			var geoBoundsLeftBottom = map.getCoordinateFromPixel(pixelBounds[0]);
			var geoBoundsRightTop = map.getCoordinateFromPixel(pixelBounds[1]);
			geoBounds = [geoBoundsLeftBottom, geoBoundsRightTop];
			// 초기값을 저장하여 비교값으로 사용
			HMD[shipType].geoBound = geoBounds;
		} else {
			geoBounds = saveGeoBounds;
		}

		// geometry boundary 크기 계산
	    var geoBoundsLeftBottom = geoBounds[0];
	    var geoBoundsRightTop = geoBounds[1];
		var geoBoundsWidth = geoBoundsRightTop[0] - geoBoundsLeftBottom[0];
		if (geoBoundsWidth < 0) {
	        var extent = HMD.GIS.getCurProj().getExtent();
	        geoBoundsWidth += ol.extent.getWidth(extent);
		}
		var geoBoundsHeight = geoBoundsRightTop[1] - geoBoundsLeftBottom[1];

		// pixel boundary와 geometry boundary를 활용하여 zoom scale을 계산
		var widthResolution = geoBoundsWidth / pixelBoundsWidth;
		var heightResolution = geoBoundsHeight / pixelBoundsHeight;
		var r = Math.max(widthResolution, heightResolution);
		var zoomScale = r / (resolution / pixelRatio);

		return zoomScale;
	},

	// 호선을 그릴 canvas 위치/회전각 정의
	definePosition: function(context, canvas, standardInfo, pixelRatio) {
		var map = HMD.Map;
		var scale = standardInfo.scale;
		var degree = standardInfo.degree;
		var pixelAnchor = standardInfo.pixelAnchor;
		var canvasWidth = canvas.getAttribute('width');
		var canvasHeight = canvas.getAttribute('height');

		// 지도 회전각 및 크기 계산
		var ro = map.getView().getRotation();
		var mapExtent = map.getView().calculateExtent(map.getSize());
		var mapCenter = ol.extent.getCenter(mapExtent);
		var mapCenterPixel = map.getPixelFromCoordinate(mapCenter);
	  	context.translate(canvasWidth/2, canvasHeight/2);
	  	context.rotate(-ro);	// 지도 회전을 clear
	  	context.translate(-mapCenterPixel[0]*pixelRatio, -mapCenterPixel[1]*pixelRatio);

	  	// 호선의 위치 및 각도 정의
		context.translate(pixelAnchor[0], pixelAnchor[1]);
		context.rotate((degree) * (Math.PI/180) + ro);

		return context;
	},

	// 스케일을 적용하여 좌표 반환
	applyScale: function(coord, scale) {
		var convertCoord = [];
		for (var i=0; i<coord.length; i++) {
			var point = coord[i].split(',');
			point[0] = (point[0] * 1) * scale;
			point[1] = (point[1] * 1) * scale;
			convertCoord.push(point);
	    }
		return convertCoord;
	},

	// 실제 canvas에 그림을 그리는 부분
	drawShipShape: function(shipType, canvas, context, ship, zoomScale, pixelRatio, pixelScale) {
		// draw
		var coord = ship.coord;
		var scale = (pixelScale * zoomScale);
		for(var j=0, len=coord.length; j<len; j++) {
			var drawType = ship.drawType[j];	// bezier, line
			var position = ship.position[j];	// front:선수, upper:선체상단, after:선미, bottom:선체하단
			if(drawType === 'bezier') {
				// 곡선
				if(position==='front') {
					this.drawFrontByBezier(context, coord[j], scale);
				} else {
					this.drawAfterByBezier(context, coord[j], scale);
				}
			} else {
				// 직선
				this.drawShipByLine(context, coord[j], scale, pixelRatio);

				// 텍스트
				var showText = this.showText(shipType, position, ship.cont);
				if(showText){
					var text = ship.desc;
					var textPoint = this.applyScale(coord[j], scale);
					this.drawText(shipType, context, textPoint, text, pixelRatio);
				}
			}
		}
	},

	// 곡선을 그림 bezier (선수)
	drawFrontByBezier: function(context, originCoord, scale) {
		var cut = originCoord.length/4;
		var coord = this.applyScale(originCoord, scale);

		for (var i=0; i<coord.length; i++) {
			context.moveTo(coord[i+0][0], coord[i+0][1]);
			context.bezierCurveTo(coord[i+1][0], coord[i+1][1], coord[i+2][0], coord[i+2][1], coord[i+3][0], coord[i+3][1]);

			i += cut - 1;	// 4: 4개씩 끊음. bezier공식 적용을 위하여..
		}
	},

	// 곡선을 그림 bezier (선미)
	drawAfterByBezier: function(context, originCoord, scale) {
		var coord = this.applyScale(originCoord, scale);

		// 꼬리
		context.moveTo(coord[0][0], coord[0][1]);
		context.bezierCurveTo(coord[1][0], coord[1][1], coord[2][0], coord[2][1], coord[3][0], coord[3][1]);
		context.bezierCurveTo(coord[4][0], coord[4][1], coord[5][0], coord[5][1], coord[6][0], coord[6][1]);

		context.lineTo(coord[9][0], coord[9][1]);
		context.bezierCurveTo(coord[10][0], coord[10][1], coord[11][0], coord[11][1], coord[12][0], coord[12][1]);
		context.bezierCurveTo(coord[13][0], coord[13][1], coord[14][0], coord[14][1], coord[15][0], coord[15][1]);
	},

	// 직선을 그림 (선체 상단, 선체 하단)
	drawShipByLine: function(context, originCoord, scale, pixelRatio) {
		var coord = this.applyScale(originCoord, scale);

		context.moveTo(coord[0][0], coord[0][1]);
		context.lineTo(coord[1][0], coord[1][1]);

		return coord;
	},

	// text를 그리는 위치 확인 (선체 상단 또는 선체 하단). Dock/Quay, upper/bottom, 맵의 각도, 현재 zoom레벨에 따라 결정
	showText: function(shipType, position, cont) {
		var showText = false;

		// 맵의 정보
		var view = HMD.Map.getView();
		var zoom = view.getZoom();
		var rotation = view.getRotation()*180/Math.PI;

		// 각도 0도를 기준으로, 호선의 글자를 뒤집어줌
		var reverseRotation = (rotation > 0);
		if(shipType==='Dock') {
			if((reverseRotation && position==='bottom') || (!reverseRotation && position==='upper')) {
				// 블록이 있을때는 도크 호선의 글자를 숨김 (13줌 미만)
				if(zoom > 11 && zoom < 13) {
					showText = true;
				}
			}
		} else if(shipType==='Quay') {
			if((reverseRotation && ((cont === 'S' && position==='bottom') || (cont === 'P' && position==='upper')))
					|| (!reverseRotation && ((cont === 'S' && position==='upper') || (cont === 'P' && position==='bottom')))) {
				if(zoom > 11) {
					showText = true;
				}
			}
		}

		return showText;
	},

	// 호선 정보 텍스트 추가
	drawText: function(shipType, context, pixelCoord, text, pixelRatio) {
		// 맵의 정보
		var view = HMD.Map.getView();
		var zoom = view.getZoom();
		var rotation = view.getRotation()*180/Math.PI;
		var resolution = view.getResolution();
		var resolutionForZoom = view.getResolutionForZoom();

		// 각도 0도를 기준으로, 호선의 글자를 뒤집어줌
		var REVERSE = 1;
		var reverseRotation = (rotation > 0);
		if(reverseRotation) {
			REVERSE = -1;
		}

		// 텍스트가 위치할 곳
		var textPosition = [];
		if(pixelCoord[0][0]*REVERSE < pixelCoord[1][0]*REVERSE) {
			textPosition = [pixelCoord[0][0]-10, pixelCoord[0][1]];
		} else {
			textPosition = [pixelCoord[1][0]+10, pixelCoord[1][1]];
		}

		// 폰트 사이즈 결정
		var textMargin = 5;
		var fontSize = resolutionForZoom / resolution / zoom / 45;		// 45: 상수
		var textMargin = fontSize * 1.5;

		// 폰트 정의
		var desc = text.split('***');
		var fontStyle = (fontSize * pixelRatio) +'px "NanumGothic"';
		textMargin = textMargin * pixelRatio;

		// 그리기
		context.save();
		context.font = fontStyle;
		context.fillStyle = 'black';
		context.textBaseline = 'top';
		if(reverseRotation) {
			// 180도 뒤집기 (180*Math.PI/180)
			context.rotate(Math.PI);
		}
		context.fillText(desc[0], textPosition[0]*REVERSE,  textPosition[1]*REVERSE);
		context.fillText(desc[1], textPosition[0]*REVERSE, (textPosition[1]*REVERSE + textMargin));
		context.restore();
	}
}
