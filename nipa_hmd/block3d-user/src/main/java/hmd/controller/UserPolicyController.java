package hmd.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import hmd.domain.APIError;
import hmd.domain.CacheManager;
import hmd.domain.RoleKey;
import hmd.domain.UserPolicy;
import hmd.domain.UserSession;
import hmd.service.UserPolicyService;
import hmd.support.RoleSupport;

@RequestMapping("/")
@Controller
public class UserPolicyController {

    @Autowired
    UserPolicyService userPolicyService;

    @PostMapping("user-policies")
    public ResponseEntity<?> updateUserPolicy(HttpServletRequest request, UserPolicy userPolicy) {
        try {
        	String roleCheckResult = roleValidator(request);
    		if(roleCheckResult != null) {
    			Map<String, Object> result = new HashMap<>();
    	        result.put("statusCode", HttpStatus.FORBIDDEN.value());
    	        result.put("error", new APIError("권한이 존재하지 않습니다."));
    	        return new ResponseEntity<>(result, HttpStatus.FORBIDDEN);
    		}

            UserSession userSession = (UserSession) request.getSession().getAttribute(UserSession.KEY);
            String userId = userSession.getUserId();
            String workplace = userPolicy.getWorkplace();
            String rotationAngle = request.getParameter("rotationAngle");

            if("1".equals(workplace)) userPolicy.setRotationAngleBonsa(rotationAngle);
            else if("5".equals(workplace)) userPolicy.setRotationAngleOnsan(rotationAngle);
            else if("8".equals(workplace)) userPolicy.setRotationAngleYoungyeon(rotationAngle);
            else if("6".equals(workplace)) userPolicy.setRotationAngleMohwa(rotationAngle);
            userPolicy.setUserId(userId);

            userPolicyService.updateUserPolicy(userPolicy);

            userSession.getUserPolicy().setLabelYn(userPolicy.getLabelYn());
            userSession.getUserPolicy().setBlockLabelYn(userPolicy.getBlockLabelYn());
            userSession.getUserPolicy().setToolTipYn(userPolicy.getToolTipYn());
            if("1".equals(workplace)) userSession.getUserPolicy().setRotationAngleBonsa(userPolicy.getRotationAngleBonsa());
            else if("5".equals(workplace)) userSession.getUserPolicy().setRotationAngleOnsan(userPolicy.getRotationAngleOnsan());
            else if("8".equals(workplace)) userSession.getUserPolicy().setRotationAngleYoungyeon(userPolicy.getRotationAngleYoungyeon());
            else if("6".equals(workplace)) userSession.getUserPolicy().setRotationAngleMohwa(userPolicy.getRotationAngleMohwa());

            return new ResponseEntity<>(HttpStatus.OK.value(), HttpStatus.OK);

        } catch(Exception e) {
            e.printStackTrace();
            Map<String, Object> result = new HashMap<>();
            result.put("statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value());
            result.put("error", new APIError(e.getCause() != null ? e.getCause().getMessage() : e.getMessage()));
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("user-layers")
    public ResponseEntity<?> updateUserLayer(HttpServletRequest request, UserPolicy userPolicy) {
    	try {
    		UserSession userSession = (UserSession) request.getSession().getAttribute(UserSession.KEY);
    		String userId = userSession.getUserId();
    		userPolicy.setUserId(userId);
			userPolicyService.updateUserLayer(userPolicy);
    		return new ResponseEntity<>(HttpStatus.OK.value(), HttpStatus.OK);
    	} catch(Exception e) {
    		e.printStackTrace();
    		Map<String, Object> result = new HashMap<>();
    		result.put("statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value());
    		result.put("error", new APIError(e.getCause() != null ? e.getCause().getMessage() : e.getMessage()));
    		return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    }

    private String roleValidator(HttpServletRequest request) {
		UserSession userSession = (UserSession)request.getSession().getAttribute(UserSession.KEY);
		List<String> userGroupRoleKeyList = CacheManager.getUserGroupRoleKeyList(userSession.getUserGroupId());
        if(!RoleSupport.isUserGroupRoleValid(userGroupRoleKeyList, RoleKey.USER_POLICY_ALL.name())) {
			return "403";
		}
		return null;
	}
}
