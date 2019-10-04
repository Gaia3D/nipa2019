package hmd.service.impl;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import hmd.domain.Crane;
import hmd.domain.CraneJip;
import hmd.domain.CraneTower;
import hmd.domain.Policy;
import hmd.persistence.postgresql.CraneMapper;
import hmd.service.CraneService;

/**
 * @author kimhj
 * 호선 형상 조회
 */
@Service
public class CraneServiceImpl implements CraneService {

    @Autowired
    private CraneMapper craneMapper;

    /**
     * 집크레인 조회
     * @return
     */
    @Transactional(readOnly=true)
    public List<CraneJip> getCraneJip() {
    	return craneMapper.getCraneJip();
    }
    
    /**
     * 타워크레인 조회
     * @return
     */
    @Transactional(readOnly=true)
    public List<CraneTower> getCraneTower() {
    	return craneMapper.getCraneTower();
    }
    
    /**
     * 크레인 조회
     * @return
     */
    @Transactional(readOnly=true)
    public List<Crane> getCrane() {
    	List<CraneJip> jips = getCraneJip();
    	
    	List<CraneTower> towers = getCraneTower();
    	
    	List<Crane> result = new ArrayList<Crane>();
    	
    	for(CraneJip jip : jips) {
    		jip.setCraneType("JIP");
    		result.add(jip);
    	}
    	
    	for(CraneTower tower : towers) {
    		tower.setCraneType("TOWER");
    		result.add(tower);
    	}
    	
    	return result;
    }
    
    /**
     * layer 가 등록 되어 있지 않은 경우 rest api 를 이용해서 layer를 등록
     * @throws Exception
     */
     private void registerLayer() throws Exception {

             // 신규 등록
             HttpHeaders headers = new HttpHeaders();
             headers.setContentType(MediaType.APPLICATION_XML);
             // geoserver basic 암호화 아이디:비밀번호 를 base64로 encoding
             headers.add("Authorization", "Basic " + Base64.getEncoder().encodeToString("admin:geoserver".getBytes()));


             List<HttpMessageConverter<?>> messageConverters = new ArrayList<HttpMessageConverter<?>>();
             //Add the String Message converter
             messageConverters.add(new StringHttpMessageConverter());
             //Add the message converters to the restTemplate

             RestTemplate restTemplate = new RestTemplate();
             restTemplate.setMessageConverters(messageConverters);

             HttpEntity<String> entity = new HttpEntity<>( headers);
             String url = "http://dj.gaia3d.com:18080/geoserver/rest/workspaces/hmd/datastores/hmd";

             ResponseEntity<?> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
             
             System.out.println(response.toString());
     }
}