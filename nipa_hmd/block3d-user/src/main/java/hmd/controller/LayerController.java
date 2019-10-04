package hmd.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import hmd.domain.APIError;
import hmd.domain.CacheManager;
import hmd.domain.Layer;
import hmd.domain.RoleKey;
import hmd.domain.UserPolicy;
import hmd.domain.UserSession;
import hmd.service.UserPolicyService;
import hmd.support.RoleSupport;

@Controller
@RequestMapping("/layer/")
public class LayerController {

	@Autowired
	private ObjectMapper objectMapper;

    @Autowired
    private UserPolicyService userPolicyService;

    /**
     * 레이어 목록 요청
     */
    @GetMapping("list")
    public ResponseEntity<?> getLayerList(HttpServletRequest request) {
        HttpSession session = request.getSession();
        UserSession userSession = (UserSession)session.getAttribute(UserSession.KEY);

        try {
        	String roleCheckResult = roleValidator(request);
    		if(roleCheckResult != null) {
    			Map<String, Object> result = new HashMap<>();
    	        result.put("statusCode", HttpStatus.FORBIDDEN.value());
    	        result.put("error", new APIError("권한이 존재하지 않습니다."));
    	        return new ResponseEntity<>(result, HttpStatus.FORBIDDEN);
    		}

            Map<String, Object> result = new HashMap<>();
			List<Layer> cacheLayerList = CacheManager.getLayerList();
			//임시 아이디 상수
			String userId = "ADMIN";
			UserPolicy userPolicy = userPolicyService.getUserPolicy(userId);

			// 사용자 저장 정보가 있으면
			if(userPolicy != null && (userPolicy.getBaseLayers() != null && !"".equals(userPolicy.getBaseLayers())) ) {
     			// 사용자가 가진 Layer 설정 정보
     			String userLayer = userPolicy.getBaseLayers();
     			List<Map<String, String>> userLayerList = objectMapper.readValue(userLayer, new TypeReference<List<Map<String, String>>>() {});

     			// 전체 레이어 목록과 사용자 레이어 목록을 비교하여, on/off 변경
     			List<Layer> resultLayerList = getUserLayerList(cacheLayerList, userLayerList);
     			result.put("list", resultLayerList);

     		// 사용자 저장 정보가 없으면
     		} else {
     			//임시 user agent 상수
     			String agent = "PC";
     			if("PC".equals(agent)) {
    				for(Layer layer : cacheLayerList) {
    					layer.setDefaultYn(layer.getBlockDefaultYn());
    				}
    			} else {
    				for(Layer layer : cacheLayerList) {
    					layer.setDefaultYn(layer.getMobileDefaultYn());
    				}
    			}
     			result.put("list", cacheLayerList);
     		}
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return getErrorResponseEntity(e);
        }
    }

    /**
     * 시스템 디폴트로 설정된 레이어 목록 요청
     */
    @GetMapping("list/default")
    public ResponseEntity<?> getLayerDefaultList(HttpServletRequest request) {
        try {
	    	String baseLayers = null;
			baseLayers = CacheManager.getBaseLayers();
	        return new ResponseEntity<>(baseLayers, HttpStatus.OK);
	    } catch (Exception e) {
	        return getErrorResponseEntity(e);
	    }
    }

    // 전체 레이어 목록과 사용자 레이어 목록을 비교하여, on/off 변경
    private List<Layer> getUserLayerList(List<Layer> cacheLayerList, List<Map<String, String>> userLayerList) {
    	for(Layer layer : cacheLayerList) {
    		String key = layer.getLayerKey();
    		layer.setDefaultYn("Y");
			/*
			 * for(int i=0, l=userLayerList.size(); i<l; i++) {
			 * if(userLayerList.get(i).get("key").contains(key)) { layer.setDefaultYn("Y");
			 * break; } }
			 */
    	}
    	return cacheLayerList;
    }

    private ResponseEntity<?> getErrorResponseEntity(Exception e) {
        e.printStackTrace();
        Map<String, Object> result = new HashMap<>();
        result.put("statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value());
        result.put("error", new APIError(e.getCause() != null ? e.getCause().getMessage() : e.getMessage()));

        return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private String roleValidator(HttpServletRequest request) {
		UserSession userSession = (UserSession)request.getSession().getAttribute(UserSession.KEY);
		//List<String> userGroupRoleKeyList = CacheManager.getUserGroupRoleKeyList(userSession.getUserGroupId());
		
		List<String> userGroupRoleKeyList = CacheManager.getUserGroupRoleKeyList(1);
        if(!RoleSupport.isUserGroupRoleValid(userGroupRoleKeyList, RoleKey.USER_LOGIN.name())) {
			return "403";
		}
		return null;
	}
}
