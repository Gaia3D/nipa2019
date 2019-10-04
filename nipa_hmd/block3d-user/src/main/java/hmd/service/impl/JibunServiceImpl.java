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
import hmd.domain.Jibun;
import hmd.service.JibunService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class JibunServiceImpl implements JibunService {

	@Autowired
	private ObjectMapper objectMapper;

    @Autowired
    private PropertiesConfig propertiesConfig;

    @Autowired
    private RestTemplate restTemplate;

    @Transactional(readOnly = true)
    public List<String> getJibunListAll(Jibun jibun) {
    	List<String> jibunIdList = new ArrayList<>();
    	try {
    		String url = propertiesConfig.getGisRestServer() + "/api/jibuns/ids";

    		ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
    		HttpStatus statusCode = response.getStatusCode();

    		// TODO 이건 별로 맘에 안들지만, 지금은 이대로 하고 추후 리팩토링 하자.
    		if(statusCode == HttpStatus.OK) {
    			log.info("@@@@@@@@@@@@@@@@@@@@ success statusCode = {}", statusCode.value());
    			jibunIdList = objectMapper.readValue(response.getBody(), new TypeReference<List<String>>() {});
    		} else {
    			log.info("@@@@@@@@@@@@@@@@@@@@ fail statusCode = {}", statusCode.value());
    			log.info("@@@@@@@@@@@@@@@@@@@@ fail response = {}", response.getBody());
    		}
    	} catch(Exception e) {
    		e.printStackTrace();
    	}
    	return jibunIdList;
    }

    @Transactional(readOnly = true)
    public List<Jibun> getJibunList(Jibun jibun) {
        List<Jibun> jibunList = new ArrayList<>();
        try {
        	StringBuilder stringBuilder = new StringBuilder()
                    .append("name")
                    .append("=")
                    .append(jibun.getName())
                    .append("&")
		            .append("pageNo")
		            .append("=")
		            .append(jibun.getPageNo())
                    .append("&")
		            .append("pageRows")
		            .append("=")
		            .append(jibun.getPageRows())
                    .append("&")
		            .append("pageListCount")
		            .append("=")
		            .append(jibun.getPageListCount());

            String url = propertiesConfig.getGisRestServer() + "/api/jibuns?" + stringBuilder.toString();

    		ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
    		HttpStatus statusCode = response.getStatusCode();

            // TODO 이건 별로 맘에 안들지만, 지금은 이대로 하고 추후 리팩토링 하자.
            if(statusCode == HttpStatus.OK) {
    			log.info("@@@@@@@@@@@@@@@@@@@@ success statusCode = {}", statusCode.value());
    			jibunList = objectMapper.readValue(response.getBody(), new TypeReference<List<Jibun>>() {});
            } else {
                log.info("@@@@@@@@@@@@@@@@@@@@ fail statusCode = {}", statusCode.value());
                log.info("@@@@@@@@@@@@@@@@@@@@ fail response = {}", response.getBody());
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
        return jibunList;
    }

    @Transactional(readOnly = true)
    public int getJibunListCount(Jibun jibun) {
    	int count = 0;
    	try {
    		String url = propertiesConfig.getGisRestServer() + "/api/jibuns/" + jibun.getName() + "/count";

    		ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
    		HttpStatus statusCode = response.getStatusCode();

    		// TODO 이건 별로 맘에 안들지만, 지금은 이대로 하고 추후 리팩토링 하자.
    		if(statusCode == HttpStatus.OK) {
    			log.info("@@@@@@@@@@@@@@@@@@@@ success statusCode = {}", statusCode.value());
				count = objectMapper.readValue(response.getBody(), Integer.class);
    		} else {
    			log.info("@@@@@@@@@@@@@@@@@@@@ fail statusCode = {}", statusCode.value());
    			log.info("@@@@@@@@@@@@@@@@@@@@ fail response = {}", response.getBody());
    		}
    	} catch(Exception e) {
    		e.printStackTrace();
    	}
    	return count;
    }
}
