(function() {
    // 지도 확대/축소
    $('#zoomin, #zoomout').on('click', function() {
        var direction = $(this).attr('id');
        HMD.Tools.setZoom(direction);
    });

    // 측정
    $('#measureLine, #measureArea').on('click', function() {
        var $target = $(this);
        clearDrawGeometry();

        if($target.hasClass('on')) {
            $target.removeClass('on');
            clearMeasure();
        } else {
            $target.addClass('on');
            $('.measures').not($target).removeClass('on');

            // vector layer
            var measureLayer = HMD.GIS.getLayerById('measure_layer');
            if(!measureLayer) {
                addMeasureLayer();
            }
            // add interaction
            var type = $target.data('type');
            addDrawInteraction(type);
        }
    });

    // 초기화
    $('.reset').on('click', function() {
        clearMeasure();
    });

    // 지도 회전 좌/우
    $('#rotateLeft, #rotateRight').on('click', function() {
        var currentDegree = $('#rotateInput').val()*1;
        if($(this).attr('id') == "rotateRight") {
            var addDegree = 10;
        } else {
            var addDegree = -10;
        }
        var afterDegree = currentDegree + addDegree;

        if(afterDegree <= -180) {
            afterDegree = 360 + afterDegree;
        } else if(afterDegree > 180) {
            afterDegree = afterDegree - 360;
        }
        HMD.Tools.setRotate(afterDegree);
    });

    // 지도 회전 입력
    $('#rotateInput').on('keyup', function(e) {
        if (e.keyCode === 13) {
            var degree = $(this).val()*1;

            var regex = regexOnlyNumber();
            if(!regex.test(degree)) {
                alert("회전각이 적절하지 않습니다.");
                return false;
            }

            // validation
            // degree > 360
            HMD.Tools.setRotate(degree);
        }
    });

    // 지도 회전 초기화
    $('#rotateReset').on('click', function() {
        HMD.Tools.setRotate(0);
    });

})();

HMD.Tools = (function() {
    var map = HMD.Map;
    var view = map.getView();

    return {

        // 지도 확대 축소
        setZoom: function(direction) {
            var zoom = 0;
            var zoomFactor = 0.5;
            var currentZoom = view.getZoom();
            if(direction === 'zoomin') {
                zoom = currentZoom + zoomFactor;
            } else if(direction === 'zoomout') {
                zoom = currentZoom - zoomFactor;
            }

            view.animate({
                zoom: zoom,
                duration: 250
            });
        },

        // 지도 회전
        setRotate: function(degree, duration, zoom) {
            var radian = degree * Math.PI / 180;
            var rotation = radian;
            if(!duration) {
            	duration = 200;
            }
            if(!zoom) {
            	zoom = view.getZoom();
            }

            view.animate({
                rotation: rotation,
                duration: duration,
                zoom: zoom
            });

            this.changeRotateResetStyle(rotation);
            // 인풋값 입력
            $('#rotateInput').val(degree);
            // 방향 초기화 버튼도 함께 회전
            $('#rotateReset').css('transform', 'rotate(' + degree*1 + 'deg)');
        },

        changeRotateResetStyle: function(rotation) {
            if(rotation === 0) {
                $('#rotateReset').removeClass("on");
            } else {
                $('#rotateReset').addClass("on");
            }
        }
    }
})();

var sketch;
var helpTooltipElement;
var helpTooltip;
var measureTooltipElement;
var measureTooltip;

function addMeasureLayer() {
    var layer = new ol.layer.Vector({
        id: 'measure_layer',
        zIndex: 80,
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ff0000',
                width: 3
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ff0000'
                })
            })
        })
    });
    HMD.Map.addLayer(layer);
}

var pointerMoveHandler = function(evt) {
    if (evt.dragging) {
        return;
    }

    var helpMsg = '지도를 클릭하세요.';
    var continuePolygonMsg = '측정할 면적을 클릭하고, 더블 클릭하면 종료됩니다.';
    var continueLineMsg = '측정할 거리를 클릭하고, 더블 클릭하면 종료됩니다.';

    if (sketch) {
        var geom = (sketch.getGeometry());
        if (geom instanceof ol.geom.Polygon) {
            helpMsg = continuePolygonMsg;
        } else if (geom instanceof ol.geom.LineString) {
            helpMsg = continueLineMsg;
        }
    }

    if(helpTooltipElement) {
        helpTooltip.setPosition(evt.coordinate);
        helpTooltipElement.innerHTML = helpMsg;
        helpTooltipElement.classList.remove('hidden');
    }

};

//HMD.Map.on('pointermove', pointerMoveHandler);

HMD.Map.getViewport().addEventListener('mouseout', function() {
    if(helpTooltipElement) {
        helpTooltipElement.classList.add('hidden');
    }
});


function addDrawInteraction(type) {
    var listener;
    var layer = HMD.GIS.getLayerById('measure_layer');
    var draw = new ol.interaction.Draw({
        source: layer.getSource(),
        type: type,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        }),
        layers: [layer]
    });
    HMD.Map.addInteraction(draw);
    createMeasureTooltip();
    createHelpTooltip();

    draw.on('drawstart', function(evt) {
        // set sketch
        sketch = evt.feature;

        /** @type {ol.Coordinate|undefined} */
        var tooltipCoord = evt.coordinate;

        listener = sketch.getGeometry().on('change', function(evt) {
            var geom = evt.target;
            var output;
            if (geom instanceof ol.geom.Polygon) {
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });
    }, this);

    draw.on('drawend', function() {
        measureTooltipElement.className = 'tooltip tooltip-static';
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
        ol.Observable.unByKey(listener);
    }, this);
}

/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
    if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'mtooltip hidden';
    helpTooltip = new ol.Overlay({
        id: 'measure-tooltip',
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    HMD.Map.addOverlay(helpTooltip);
}


/**
 * Creates a new measure tooltip
 */
function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'mtooltip mtooltip-measure';
    measureTooltip = new ol.Overlay({
        id: 'info-tooltip',
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    HMD.Map.addOverlay(measureTooltip);
}

function clearOverlay() {
    HMD.Map.getOverlays().getArray().slice(0).forEach(function(overlay, a, b) {
        // Overlay 삭제
        if(overlay && (overlay.getId() === 'info-tooltip' || overlay.getId() === 'measure-tooltip')) {
            HMD.Map.removeOverlay(overlay);
        }
    });
}

function clearDrawGeometry() {
    HMD.Map.getInteractions().forEach(function(interaction) {
        // Draw interaction 삭제
        if(interaction instanceof ol.interaction.Draw) {
            HMD.Map.removeInteraction(interaction);
        }
    });
}

function clearMeasure() {
    $('.measures').removeClass('on');
    var layer = HMD.GIS.getLayerById('measure_layer');
    if(layer) {
        layer.getSource().clear();
    }
    HMD.GIS.getLayerById('facility_highlight_layer').getSource().clear();
    clearDrawGeometry();
    clearOverlay();
}