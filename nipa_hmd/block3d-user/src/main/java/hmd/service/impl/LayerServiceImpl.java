package hmd.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import hmd.config.PropertiesConfig;
import hmd.domain.Layer;
import hmd.service.LayerService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class LayerServiceImpl implements LayerService {

	@Autowired
	private ObjectMapper objectMapper;
	
    @Autowired
    private PropertiesConfig propertiesConfig;
    
    @Autowired
    private RestTemplate restTemplate;

    @Transactional(readOnly = true)
    public List<Layer> getListLayer(Layer layer) {

        List<Layer> layerList = new ArrayList<>();
        try {
        	String url = propertiesConfig.getGisRestServer() + "/api/layers";

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            HttpStatus statusCode = response.getStatusCode();

            // TODO 이건 별로 맘에 안들지만, 지금은 이대로 하고 추후 리팩토링 하자.
            if(statusCode == HttpStatus.OK) {
                layerList = objectMapper.readValue(response.getBody(), new TypeReference<List<Layer>>() {});

            } else {
                log.info("@@@@@@@@@@@@@@@@@@@@ fail statusCode = {}", statusCode.value());
                log.info("@@@@@@@@@@@@@@@@@@@@ fail response = {}", response.getBody());
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
        return layerList;
    }
}
