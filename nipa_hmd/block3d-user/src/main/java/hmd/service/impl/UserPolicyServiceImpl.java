package hmd.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import hmd.domain.Policy;
import hmd.domain.UserPolicy;
import hmd.persistence.postgresql.UserPolicyMapper;
import hmd.service.PolicyService;
import hmd.service.UserPolicyService;
import hmd.support.CompareTo;

@Service
public class UserPolicyServiceImpl implements UserPolicyService {

	@Autowired
	private ObjectMapper objectMapper;
	
    @Autowired
    private PolicyService policyService;

	@Autowired
	private UserPolicyMapper userPolicyMapper;

    @Transactional(value="postgresTransactionManager", readOnly = true)
    public UserPolicy getUserPolicy(String userId) {
        UserPolicy userPolicy = userPolicyMapper.getUserPolicy(userId);
        if(userPolicy == null) userPolicy = new UserPolicy();

        return userPolicy;
    }

    @Transactional(value="postgresTransactionManager")
    public int updateUserPolicy(UserPolicy userPolicy) {
    	UserPolicy dbUserPolicy = userPolicyMapper.getUserPolicy(userPolicy.getUserId());

		// TODO upsert
		if(dbUserPolicy == null) {
			return userPolicyMapper.insertUserPolicy(userPolicy);
		} else {
			return userPolicyMapper.updateUserPolicy(userPolicy);
		}
    }

    @Transactional(value="postgresTransactionManager")
    public int updateUserLayer(UserPolicy userPolicy) {

    	// input data
		ArrayList<HashMap<String, String>> layerList = userPolicy.getBaseLayerList();

		// add workspace
    	Policy policy = policyService.getPolicy();
    	String dataWorkspace = policy.getGeoserverDataWorkspace() + ":";
        for (HashMap<String, String> layer : layerList) {
        	String key = layer.get("key");
        	if(!key.contains(dataWorkspace)) {	// 작업공간이 없으면, 작업공간 추가
        		layer.put("key", dataWorkspace + key);	// 기존 key 정보를 덮어씀
        	}
        }

		// sort
		Collections.sort(layerList, new CompareTo());

		try {
        	String baseLayers = objectMapper.writeValueAsString(layerList);
    		userPolicy.setBaseLayers(baseLayers);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}

    	// TODO upsert
    	UserPolicy dbUserPolicy = userPolicyMapper.getUserPolicy(userPolicy.getUserId());
    	if(dbUserPolicy == null) {
    		return userPolicyMapper.insertUserLayer(userPolicy);
    	} else {
    		return userPolicyMapper.updateUserLayer(userPolicy);
    	}
    }
}
