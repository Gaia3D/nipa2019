package hmd.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import hmd.config.PropertiesConfig;
import hmd.domain.Policy;
import hmd.service.PolicyService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PolicyServiceImpl implements PolicyService {

	@Autowired
	private ObjectMapper objectMapper;
	
    @Autowired
    private PropertiesConfig propertiesConfig;
    
    @Autowired
    private RestTemplate restTemplate;

    /**
    * GIS 인프라 운영정책
    * @return
    */
    @Transactional(readOnly = true)
    public Policy getPolicy() {

        Policy policy = new Policy();
        try {
        	String url = propertiesConfig.getGisRestServer() + "/api/policy";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            HttpStatus statusCode = response.getStatusCode();

            // TODO 이건 별로 맘에 안들지만, 지금은 이대로 하고 추후 리팩토링 하자.
            if(statusCode == HttpStatus.OK) {
                log.info("@@@@@@@@@@@@@@@@@@@@ success statusCode = {}", statusCode.value());
                policy = objectMapper.readValue(response.getBody(), Policy.class);
            } else {
                log.info("@@@@@@@@@@@@@@@@@@@@ fail statusCode = {}", statusCode.value());
                log.info("@@@@@@@@@@@@@@@@@@@@ fail response = {}", response.getBody());
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
        return policy;
    }
}
