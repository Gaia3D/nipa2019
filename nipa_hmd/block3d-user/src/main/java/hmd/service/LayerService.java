package hmd.service;

import java.util.List;

import hmd.domain.Layer;

public interface LayerService {

    /**
    * 레이어 리스트 조회
    * @param layer
    * @return
    */
    List<Layer> getListLayer(Layer layer);
}
