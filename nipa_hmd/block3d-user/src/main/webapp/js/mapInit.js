var MapInit = function(viewer, policy) {

    if (!(this instanceof MapInit)) {
        throw new Error("New 를 통해 생성 하십시오.");
    }

    // policy
    
    /*var geoserverDataUrl = policy.geoserverDataUrl;
    var geoserverDataWorkspace = policy.geoserverDataWorkspace;
    var geoserverDataStore = policy.geoserverDataStore;
    var coordinate = policy.layerTargetCoordinate;
    var layerInitMapCenter = stringToExtent(policy.layerInitMapCenter.split(","));
    var layerInitMapExtent = stringToExtent(policy.layerInitMapExtent.split(","));
    var layerInitMapExtentBonsa = stringToExtent(policy.layerInitMapExtentBonsa.split(","));
    var layerInitMapExtentOnsan = stringToExtent(policy.layerInitMapExtentOnsan.split(","));
    var layerInitMapExtentYongyeon = stringToExtent(policy.layerInitMapExtentYongyeon.split(","));
    var layerInitMapExtentMohwa = stringToExtent(policy.layerInitMapExtentMohwa.split(","));
*/
     
    // base map에서 필요한 레이어 추출
    var getBaseLayerKeys = function(type) {
        var list = HMD.Layer.base;
        return list.reduce(function(array, layer) {	// reduce: ie9부터 지원
            if(layer.type === type) {
                array.push(layer.key);
            }
            return array;
        }, []);
    }
    var tileLayerKeys = getBaseLayerKeys('tile');
    var wmsLayerKeys = getBaseLayerKeys('wms');
    var wfsLayerKeys = getBaseLayerKeys('wfs');
    var canvasLayerKeys = getBaseLayerKeys('canvas');
    var dataLayerKeys = getBaseLayerKeys('data');


    //TODO gridset geoserver restapi로 요청해서 적용하기
    var gridExtent = [108147.36663105823, 210531.46593547217, 259703.57842406473, 671516.0818542728];
    var startResolution = 600.2403853109382
    var resolutions = new Array(22);
    for (var i = 0, ii = resolutions.length; i < ii; ++i) {
        resolutions[i] = startResolution / Math.pow(2, i);
    }
    var tileGrid = new ol.tilegrid.TileGrid({
        extent: gridExtent,
        resolutions: resolutions
    });

    /**
     * 1. projection 정의
     * 2. view 정의
     * 3. layer 정의
     * 4. map 정의
     */

    var projCode = {
        // projection 목록
        'EPSG:5187': '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    };

    var proj = new ol.proj.Projection({
        code: coordinate,
        units: 'm',
        global: false,
        extent: layerInitMapExtent
    });

    var view = new ol.View({
        zoom: 12,
        maxZoom: 18,
        center: layerInitMapCenter,
        extent: layerInitMapExtent,
        projection : proj
    });

    var blockLayers = new ol.layer.Vector({
        id: 'layer_block',
        visible: false,
        zIndex : 40,
        maxResolution: 0.65,
        source: new ol.source.Vector({
            features: new ol.Collection()
        }),
        declutter: true
    });

    var tpLayer = new ol.layer.Vector({
        id: 'layer_tp',
        visible: true,
        zIndex : 50,
        source: new ol.source.Vector({
            features: new ol.Collection()
        })
    })
    
    blockLayers.on('change:visible', function() {
    });

/*    var blockHighlightLayers = new ol.layer.Vector({
        id: 'layer_block_highlight',
        visible: false,
        zIndex : 40,
        maxResolution: 0.65,
        source: new ol.source.Vector({
            features: new ol.Collection()
        }),
        declutter: true
    });

    var facilityHighlightLayer = new ol.layer.Vector({
        id: 'facility_highlight_layer',
        visible: true,
        zIndex : 40,
        source: new ol.source.Vector({
            features: new ol.Collection()
        }),
        style: [
            new ol.style.Style({
                fill: new ol.style.Fill({color: [255, 251, 137, 0.5]}), 			// yellow
                stroke: new ol.style.Stroke({color: [237, 85, 101, 1],width: 2})	// red
              }),
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 8,
                    fill: new ol.style.Fill({color: [255, 251, 137, 0.5]}), 			// yellow
                    stroke: new ol.style.Stroke({color: [237, 85, 101, 1],width: 2})	// r
                })
            })
        ]
    });

    var materialDeliveryLayer = new ol.layer.Vector({
        id: 'materialDelivery_layer',
        visible: true,
        zIndex : 50,
        source: new ol.source.Vector({
            features: new ol.Collection()
        })
    })

    *//**
     * layer zIndex
     * tile : 0
     * wms : 30
     * block, failicity : 40
     * canvas : 45
     * wfs 	  : 50
     * vehicle: 60
     *//*
*/    // 레이어 개수만큼 CQL 필터가 필요함
    var queryString = "enable_yn='Y'";
    var queryStrings = wmsLayerKeys.map(function(){ return queryString; }).join(';');	// map: ie9부터 지원
    var layers = [
        new ol.layer.Image({
            id: 'base_layer',
            visible: true,
            zIndex : 30,
            source: new ol.source.ImageWMS({
                url: geoserverDataUrl + '/' + geoserverDataWorkspace + '/wms',
                params: {
                    'VERSION' : '1.1.1',
                    'SRS': coordinate,
                    tiled: true,
                    layers: wmsLayerKeys,
                    query_layers : wmsLayerKeys,
                    CQL_FILTER: queryStrings
                }
            })
        }),

        new ol.layer.Image({
            id: 'facility_layer',
            visible: true,
            zIndex : 30,
            source: new ol.source.ImageWMS({
                url: geoserverDataUrl + '/' + geoserverDataWorkspace + '/wms',
                params: {
                    'VERSION' : '1.1.1',
                    'SRS': coordinate,
                    tiled: true,
                }
            })
        }),

        blockLayers,

        blockHighlightLayers,

        facilityHighlightLayer,

        materialDeliveryLayer,

        tpLayer
    ];

    var mouseOver = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove,
        features: ol.interaction.Select,
        layers: [blockLayers, blockHighlightLayers]
    });

    var mouseClick = new ol.interaction.Select({
        condition: ol.events.condition.click,
        layers: [materialDeliveryLayer]
    });

    var select = new ol.interaction.Select({
        condition: ol.events.condition.click,
        //condition: ol.events.condition.focus,	// 팝업 하면서 바로 이동
        features: ol.interaction.Select,
        toggleCondition: ol.events.condition.shiftKeyOnly,
        layers: [blockLayers, blockHighlightLayers],
        filter: function(e, a, b) {
            return $('#checkBlockMove').hasClass("on");
        }
    });

    // transform interaction 추가
    var transform = new ol.interaction.Transform({
        addCondition: ol.events.condition.altKeyOnly, // 다중선택 condition 설정
        layers: [blockLayers, blockHighlightLayers],
        hitTolerance: 0, // 선택 민감도(클수록 객체에서 마우스 포인트 멀어져도 선택)
        translateFeature: true, // 객체 클릭으로 이동
        scale: false, // 크기조절
        translate: false, // 이동 아이콘 클릭으로 이동
        rotate: false, // 회전
        stretch: false,
        filter: function(f, l) {
            var isFilter = false;
            var isTransformOn = $('#checkBlockMove').hasClass("on");
            var isTransformLayer = false;

            if(l) {
                var layerName = l.get('id');
                var layerList = ['layer_block', 'layer_block_highlight'];
                layerList.map(function(layer) {
                    if(layer === layerName) {
                        isTransformLayer = true;
                    }
                });
            }

            // 블록 이동이 켜져 있으면서, 블록 레이어면 true
            isFilter = (isTransformOn && isTransformLayer);
            return isFilter;
        }
    });

    // 블록 이동
    var translate = new ol.interaction.Translate({
        features: select.getFeatures()
    });

    // 지도 위 팝업
    var popupOverlay = new ol.Overlay({
        id: 'popup-overlay',
        element: document.getElementById('pop'),
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        },
        offset: [10, 10],
        positioning: 'top'
    });

    var tpPopUpOverlay = new ol.Overlay({
        id: 'tpPopup-overlay',
        element: document.getElementById('tpPopup'),
        offset: [10, 10],
        positioning: 'top'
    });

    var materialDeliveryPopupOverlay = new ol.Overlay({
        id: 'materialDeliveryPopup-overlay',
        element: document.getElementById('materialDeliveryPopup'),
        offset: [10, -20],
        positioning: 'top'
    });

    // 지도 위 툴팁
    var tooltipOverlay = new ol.Overlay({
        id: 'tooltip-overlay',
        element: document.getElementById('tooltip'),
        /*autoPan: true,
        autoPanAnimation: {
            duration: 250
        },*/
        offset: [10, 10],
        positioning: 'top'
    });

    // 지도 위 모바일 위치
    var myLocationOverlay = new ol.Overlay ({
        id: 'myLocation-overlay',
        element: document.getElementById('myLocationIcon'),
        positioning: 'top'
    });

 // 지도 위 팝업
    var facilityInfoPopup = new ol.Overlay({
        id: 'facilityInfo-overlay',
        element: document.getElementById('facilityInfoPopup'),
//        autoPan: true,
        autoPanAnimation: {
            duration: 250
        },
        offset: [10, 10],
        positioning: 'top'
    });

    var facilityClickPopup = new ol.Overlay({
        id: 'facilityClick-overlay',
        element: document.getElementById('facilityClickPopup'),
//        autoPan: true,
        autoPanAnimation: {
            duration: 250
        },
        offset: [10, 10],
        positioning: 'top'
    });

    // 마우스 좌표
    var mousePosition = new ol.control.MousePosition({
        className: 'mousePosition',
        coordinateFormat: function(coordinate) {
            return ol.coordinate.format(coordinate, '{x}, {y}　EPSG:4326', 6);
        },
        projection: ol.proj.get('EPSG:4326'),
        target: document.getElementById('mouse-position'),
        undefinedHTML: ' '
    });

    var controls = ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
        }), zoom: false, rotate: false
    }).extend([
        mousePosition
    ]);

    function stringToExtent(stringList) {
        var extentList = [];
        for( var i=0; i<stringList.length; i++) {
            extentList.push(parseFloat(stringList[i]));
        }

        return extentList;
    }

    // 지도객체
    var map;

    /**
     * public
     */
    return {
        projDefs: function() {
            Object.keys(projCode).forEach(function(key){	// 브라우저 호환성 - ie9~, chrome
                proj4.defs(key, projCode[key]);
            });
        },

        mouseOver: function(){
            return mouseOver;
        },

        mouseClick : function() {
            return mouseClick;
        },

        create: function(element) {
            // 좌표계 정의
            this.projDefs();

            // 맵 생성
            map = new ol.Map({
                controls: controls,	// 좌표 확인
                interactions: ol.interaction.defaults({mouseWheelZoom: false})
                                .extend([select, mouseOver, transform, mouseClick]),
                layers: layers,
                view: view,
                overlays: [tooltipOverlay, popupOverlay, tpPopUpOverlay, myLocationOverlay, facilityInfoPopup, facilityClickPopup, materialDeliveryPopupOverlay],
                target: element
            });

            // add label layer
            var labelKeys = Object.keys(HMD.Layer.label);	// keys: ie9 부터 사용 가능
            for(var i=0, l=labelKeys.length; i<l; i++) {
                var keys = labelKeys[i];
                var list = [];
                // base layer와 비교하여 초기 on/off 변경
                HMD.Layer.label[keys].filter(function(key) {	// filter: ie9 부터 사용 가능
                    if(wmsLayerKeys.indexOf(key) > -1) {
                        list.push(key);
                    }
                });
                HMD.Layer.label[keys] = list;

                // 있으면 add label layer
                if(list.length > 0) {
                    this.addLabelLayer(keys);
                }
            }

            // base layer로 등록된 tile 레이어만 추가됨
            for(var i=0, l=tileLayerKeys.length; i<l; i++) {
                var layerKey = tileLayerKeys[i];
                this.addTileLayer(layerKey);
            }

            // base layer로 등록된 wfs 레이어만 추가됨
            for(var i=0, l=wfsLayerKeys.length; i<l; i++) {
                var layerKey = wfsLayerKeys[i];
                this.addWfsLayer(layerKey);
            }

            // base layer로 등록된 block 레이어 on
            for(var i=0, l=dataLayerKeys.length; i<l; i++) {
                var layerKey = dataLayerKeys[i];
                this.dataLayerOnOff(layerKey);
            }

            return map;
        },

        addLabelLayer: function(keys) {
            var values = HMD.Layer.label[keys];
            var proj = this.getCurProj().getCode();
            var layer = new ol.layer.Vector({
                id: 'label_' + keys,
                visible: true,
                zIndex : 30,
                renderMode: 'vector',
                source: new ol.source.Vector({
                    format: new ol.format.GeoJSON(),
                    url: function(extent) {
                        var queryString = "enable_yn='Y'";
                        var url = geoserverDataUrl + '/' + geoserverDataWorkspace + '/wfs?service=WFS' +
                            '&version=1.1.0&request=GetFeature&typename=' + values.join(',') +
                            '&outputFormat=application/json&srsname=' + proj +
                            //'&bbox=' + extent.join(',') + ',' + proj ;
                            '&CQL_FILTER=' + queryString;
                        return url;
                    },
                    overlaps: false,
                    strategy: ol.loadingstrategy.bbox
                }),
                declutter: true,
                style: function(feature) {
                    var style = null;
                    var zoom = map.getView().getZoom();
                    if(zoom >= 13) {
                        style = new ol.style.Style({
                            text: new ol.style.Text({
                                textAlign: 'center',
                                textBaseline: 'middle',
                                text: feature.getProperties().name,
                                font: '10px NanumGothic',
                                fill: new ol.style.Fill({color: 'black'}),
                                stroke: new ol.style.Stroke({color: '#ffffff', width: 3}),
                                placement: 'point',
                                overflow: (keys==='layer_facility')?true:false
                            })
                        });
                    }
                    return style;
                }
            });
            map.addLayer(layer);
        },

        addTileLayer: function(layerKey) {
            // 레이어명에 작업공간이 있으면 제거
            layerKey = this.removeWorkspace(layerKey);

            var layer = new ol.layer.Tile({
                id: 'tile_' + layerKey,
                visible: true,
                zIndex : 0,
                source: new ol.source.TileWMS({
                    url : geoserverDataUrl + '/gwc/service/wms',
                    params : {
                        'FORMAT' : 'image/png',
                        'VERSION' : '1.1.1',
                        tiled : true,
                        styles : '',
                        SRS: this.getCurProj(),
                        WIDTH:256,
                        HEIGHT:256,
                        layers : [geoserverDataWorkspace + ":" + layerKey],
                    },
                    tileGrid: tileGrid
                })
            });
            map.addLayer(layer);
            return layer;
        },

        addWfsLayer: function(layerKey) {
            // 레이어명에 작업공간이 있으면 제거
            layerKey = this.removeWorkspace(layerKey);

            var layer = new ol.layer.Vector({
                id: layerKey,
                visible: true,
                zIndex : 50,
                renderMode: 'vertor',
                source: new ol.source.Vector({
                    format: new ol.format.GeoJSON(),
                    url: function(extent) {
                        var queryString = "enable_yn='Y'";
                        var url = geoserverDataUrl + '/' + geoserverDataWorkspace + '/wfs?service=WFS' +
                            '&version=1.1.0&request=GetFeature&typename=' + layerKey +
                            '&outputFormat=application/json&srsname=' + proj.getCode() +
                            //'&bbox=' + extent.join(',') + ',' + proj.getCode();
                            '&CQL_FILTER=' + queryString;
                        return url;
                    },
                    strategy: ol.loadingstrategy.bbox
                }),
                style: function(feature, resolution) {
                    if(layerKey === 'layer_crane') {
                        var featureRotate =  feature.getProperties().rotate;
                        var rotate = featureRotate ? featureRotate : 0;
                        var scale = view.getResolutionForZoom(12.6) / resolution;
                        var zoom = view.getZoom();
                        scale = 1 < scale ? 1 : scale;
                        var style = new ol.style.Style({
                            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                rotation: rotate,
                                scale : scale,
                                rotateWithView: true,
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                opacity: 1,
                                src: "/images/ico_crane.png",
                            })),
                        })
                        if(zoom > 12) {
                            var text = new ol.style.Text({
                                text: feature.getProperties().name,
                                font: "10px NanumGothic",
                                fill: new ol.style.Fill({color: 'black'}),
                                stroke: new ol.style.Stroke({color: '#ffffff', width: 3}),
                                offsetX: 10,
                                offsetY: 18
                            });
                            style.setText(text);
                        }
                        return style;
                    }
                    if(layerKey === 'layer_bus_stop') {
                        var style = null;
                        var zoom = view.getZoom();
                        var fontStyle = zoom * 1 + "px sans-serif";
                        var busNo =  feature.getProperties().name;
                        if(zoom > 12) {
                            style = new ol.style.Style({
                                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                                    anchorOrigin: 'bottom-left',
                                    anchorXUnits: 'fraction',
                                    anchorYUnits: 'pixels',
                                    scale : 0.8 * (zoom/10),
                                    opacity: 1,
                                    rotateWithView: false,
                                    src: "/images/ico_busstop.png"
                                })),
                                text: new ol.style.Text({
                                    text: busNo,
                                    font: fontStyle,
                                    fill: new ol.style.Fill({
                                        color: 'white'
                                    }),
                                    offsetY: -14
                                })
                            })
                        }
                        return style;
                    }
                }
            });

            map.addLayer(layer);
            return layer;
        },

        addCanvasLayer: function(layerKey) {
            // 레이어명에 작업공간이 있으면 제거
            layerKey = this.removeWorkspace(layerKey);

            var source = null;
            if(layerKey === 'layer_full_ship_dock') {
                source = new ol.source.ImageCanvas({
                    canvasFunction: canvasFunction,
                    projection: proj.getCode()
                });
            } else {
                source = new ol.source.ImageCanvas({
                    canvasFunction: canvasFunctionQuay,
                    projection: proj.getCode()
                });
            }
            var layer = new ol.layer.Image({
                id: 'canvas_' + layerKey,
                visible: true,
                zIndex : 45,
                source: source
            });

            map.addLayer(layer);
            return layer;
        },

        /**
         *
         * @param {string}
         * @param {string}
         */
        wmsLayerOnOff: function(object, visible) {
            if(!object){
                return false;
            }
            if(!object.zIndex) {
                object.zIndex = 10;
            }
            if(!object.type) {
                object.type = 'wms';
            }

            // 레이어명에 작업공간이 없으면 추가
            object.key = this.addWorkspace(object.key);

            var layerKey = object.key;
            var zIndex = object.zIndex;
            var viewType = object.type;

            var newLayerList = [];

            // 해당 레이어의 인덱스 확인
            var targetLayer = this.getLayerById('base_layer');
            var layerList = HMD.Layer.base.reduce(function(array, layer) {	// reduce: ie9부터 지원
                    array.push(layer.key);
                return array;
            }, []);
            var containsIndex = layerList.indexOf(layerKey);

            // on
            if(containsIndex === -1 && visible) {
                if(HMD.Layer.base.length === 0) {
                    HMD.Layer.base.push(object);
                } else {
                    for(var i=0, l=HMD.Layer.base.length; i<l; i++) {
                        if(HMD.Layer.base[i].zIndex*1 > zIndex) {
                            HMD.Layer.base.splice(i, 0, object);
                            break;
                        }
                        if(i===(l-1)) {
                            HMD.Layer.base.push(object);
                        }
                    }
                }

            }

            // off
            if(containsIndex !== -1 && !visible) {
                HMD.Layer.base.splice(containsIndex, 1);	// splice: ie 5.5부터 지원
            }

            var newLayerList = HMD.Layer.base.reduce(function(array, layer) {	// reduce: ie9부터 지원
                if(layer.type === 'wms') {
                    array.push(layer.key);
                }
                return array;
            }, []);

            var queryString = "enable_yn='Y'";
            var queryStrings = newLayerList.map(function(){ return queryString; }).join(';');	// map: ie9부터 지원
            targetLayer.getSource().updateParams({'layers': newLayerList});
            targetLayer.getSource().updateParams({'query_layers': newLayerList});
            targetLayer.getSource().updateParams({'CQL_FILTER': queryStrings});
            targetLayer.setVisible(newLayerList.length !== 0);
        },

        /**
         *
         * @param {string}
         * @param {string}
         */
        labelLayerOnOff: function(layerKey, visible, layerId) {
            if(!layerKey){
                return false;
            }

            // TODO: layer가 없으면 add해주는 로직이 이쪽에 있어야 함
            var newLayerList = [];

            // 레이어명에 작업공간이 없으면 추가
            layerKey = this.addWorkspace(layerKey);

            // 해당 레이어의 인덱스 확인
            var targetLayer = this.getLayerById('label_' + layerId);
            var layerList = HMD.Layer.label[layerId];
            var containsIndex = layerList.indexOf(layerKey);

            // layer list
            var newLayerList = layerList;

            // on
            if(containsIndex === -1 && visible) {
                newLayerList.push(layerKey);
            }

            // off
            if(containsIndex !== -1 && !visible) {
                newLayerList.splice(containsIndex, 1);
            }

            HMD.Layer.label[layerId] = newLayerList;
            targetLayer.getSource().clear();
            targetLayer.setVisible(newLayerList.length !== 0);
        },


        /**
         *
         * @param {string}
         * @param {string}
         */
        dataLayerOnOff: function(layerKey) {
            if(!layerKey){
                return false;
            }

            // 레이어명에 작업공간이 있으면 제거
            layerKey = this.removeWorkspace(layerKey);

            var layer = this.getLayerById(layerKey);
            if(layer != null) {
                layer.setVisible(true);
            }
        },

        /**
         * 명시적인 레이어 ID를 통해 Layer 객체를 얻는다.
         * @param   {string} layerID
         * @returns {Object} Layer
         */
        getLayerById: function(layerId) {
            var layer = null;

            if(layerId){
                var layers = map.getLayers().getArray();

                for(var i in layers){	 // 브라우저 호환성 - ie6~, chrome
                    if(layers[i].get('id') === layerId){
                        layer = layers[i];
                        break;
                    }
                }
            }

            return layer;
        },

        /**
         * 현재 맵의 좌표계를 얻는다.
         * @returns {Object} ol.Proj
         */
        getCurProj: function() {
            return map.getView().getProjection();
        },

        /**
         * 파라미터로 받은 좌표로 Feature를 생성하여 리턴한다.
         * @param   {string} geomType (Point, Polygon)
         * @param   {Array<string>} coord
         * @returns {Object} ol.Feature
         */
        getFeatureByCoord: function(geomType, coord) {
            // validation

            var shape = {
                'Point': new ol.geom.Point(coord),
                'LineString': new ol.geom.LineString(coord),
                'Polygon': new ol.geom.Polygon([coord])
            }

            var feature = new ol.Feature({
                geometry: shape[geomType]
            });

            return feature;
        },

        /**
         * 선택된 피쳐를 선택 해제한다.
         */
        clearSelectFeature: function() {
            map.getInteractions().forEach(function(interaction) {
                if(interaction instanceof ol.interaction.Select) {
                    // Select interaction의 Feature 삭제
                    interaction.getFeatures().clear();
                }
            });
        },

        /**
         * 팝업을 해제한다.
         */
        clearOverlayPopup: function(overlayName, element) {
            var overlay = map.getOverlayById(overlayName);
            if(overlay) {
                overlay.setPosition(undefined);
            }
            $(element).hide();
        },

        /**
         * 해당 레이어의 피쳐를 모두 삭제한다.
         * @param   {string} layerId
         */
        clearLayer: function(layerId) {
            var layer = this.getLayerById(layerId);
            layer.getSource().clear();
        },

        /**
         * 4326 좌표를 현재 맵의 좌표계로 변환한다.
         * @param   {Array<string>} coord
         * @returns {Array<string>} transCoord
         */
        transCoord4326ToCurProj: function(coord) {
            var transCoord = [];
            if(coord) {
                transCoord = ol.proj.transform(coord, "EPSG:4326", this.getCurProj());
            }
            return transCoord;
        },

        /**
         * WKT를 이용하여, 피쳐 생성
         * @param  {string} wkt
         * @return {Object} ol.Feature
         */
        getFeatureFromWkt: function(wkt){
            var format = new ol.format.WKT();
            var projection = HMD.GIS.getCurProj();

            var feature = format.readFeature(wkt, {
                dataProjection: projection,
                featureProjection: projection
            });
            return feature;
        },

        /**
         * 지오메트리의 위치로 이동
         * @param  {string} geometry
         */
        flyToGeometry: function(geometry){
            // 위치로 이동
            var view = map.getView();
            view.fit(geometry, HMD.Map.getSize());
            // 보정
            var zoom = view.getZoom();
            view.setZoom(zoom - 3);
        },

        /**
         * 사업장 위치 이동
         * @param {string} workplaceId 사업장ID
         */
        moveToWorkplace : function(workplaceId, duration, zoom) {
            if(!workplaceId) {
                workplaceId = $('#selectMfgInd').val();
            }

            var center = this.getCenterFromWorkplace(workplaceId);
            var degree = this.getDegreeFromWorkplace(workplaceId);

            view.setCenter(center);
            $("[name=rotationAngle]").val(degree);
            
            if(degree < 0){
            	degree += 360;
            }
            
            viewer.camera.setView({
                destination : Cesium.Rectangle.fromDegrees(west, south, east, north),
                orientation: {
                    heading : degree,
                    pitch : -90,
                    roll : 0
                }
            });
            //HMD.Tools.setRotate(degree, duration, zoom);	// params : degree, duration, zoom
        },

        /**
         * 사업장 센터 조회
         * @param {string} workplaceId 사업장ID
         */
        getCenterFromWorkplace : function(workplaceId) {
            var center = [];
            switch(workplaceId) {
                case "1":
                case "7": center = layerInitMapExtentBonsa; break;
                case "5": center = layerInitMapExtentOnsan; break;
                case "8": center = layerInitMapExtentYongyeon; break;
                case "6": center = layerInitMapExtentMohwa; break;
            }
            return center;
        },

        /**
         * 사업장 회전각 조회
         * @param {string} workplaceId 사업장ID
         */
        getDegreeFromWorkplace : function(workplaceId) {
            var degree = "";
            switch(workplaceId) {
                case "1":
                case "7": degree = HMD.UserPolicy.rotationAngleBonsa;	break;
                case "5": degree = HMD.UserPolicy.rotationAngleOnsan; break;
                case "8": degree = HMD.UserPolicy.rotationAngleYoungyeon; break;
                case "6": degree = HMD.UserPolicy.rotationAngleMohwa; break;
            }
            return degree;
        },

        /**
         * 레이어명에 작업공간이 없으면 추가
         * @param {string} layer key
         * @return {string} layer key
         */
        addWorkspace: function(layerKey) {
            var workspace = HMD.Policy.geoserverDataWorkspace;
            if(layerKey.indexOf(workspace) === -1) {
                layerKey = workspace + ':' + layerKey;
            }
            return layerKey;
        },

        /**
         * 레이어명에 작업공간이 있으면 제거
         * @param {string} layer key
         * @return {string} layer key
         */
        removeWorkspace: function(layerKey) {
            var workspace = HMD.Policy.geoserverDataWorkspace;
            if(layerKey.indexOf(workspace) > -1) {
                layerKey = layerKey.replace(workspace + ':', '');
            }
            return layerKey;
        }
    }
};
