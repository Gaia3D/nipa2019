package hmd.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import hmd.domain.APIError;
import hmd.domain.Block;
import hmd.domain.BlockPolicy;
import hmd.domain.CacheManager;
import hmd.domain.Pagination;
import hmd.domain.RoleKey;
import hmd.domain.SelectboxType;
import hmd.domain.UserGroupMenu;
import hmd.domain.UserSession;
import hmd.service.BlockPolicyService;
import hmd.service.BlockService;
import hmd.support.RoleSupport;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Controller
@RequestMapping("/")
public class Block3DController {
	
	@Autowired
    private BlockService blockService;
	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private BlockPolicyService blockPolicyService;
	/**
	    * 메인 페이지 이동
	 * @throws JsonProcessingException 
	    */
	    @GetMapping("main")
	    public String main(HttpServletRequest request, Model model) throws JsonProcessingException {
	    	log.info("start test");
	    	//crane list
	    	String strCraneList = objectMapper.writeValueAsString(CacheManager.getCraneList());
	    	
	    	model.addAttribute("crane", strCraneList);
	    	
	    	String roleCheckResult = roleValidator(request);
			if(roleCheckResult != null) return roleCheckResult;

	        HttpSession session = request.getSession();
	        UserSession userSession = (UserSession)session.getAttribute(UserSession.KEY);
	        //Integer userGroupId = userSession.getUserGroupId();
	        Integer userGroupId = 1;
	        
	        BlockPolicy blockPolicy = blockPolicyService.getBlockPolicy();

	        String gisPolicy = null;
	        String blockStyle = null;
	        String blockStatus = null;
	        String dockShape = CacheManager.getDockList();
	        String quayShape = CacheManager.getQuayList();
	        String baseLayers = null;
	        String labelList = CacheManager.getLabelList();


	        List<UserGroupMenu> userGroupMenuList = CacheManager.getUserGroupMenuList(userGroupId);
	        List<String> userGroupRoleKeyList = CacheManager.getUserGroupRoleKeyList(userGroupId);

	        //TODO : 나중에 policy 적용한 버전으로 만들기!
	        baseLayers = CacheManager.getBaseLayers();
	        	
	        try {
	            gisPolicy = objectMapper.writeValueAsString(CacheManager.getPolicy());
	            blockStyle = objectMapper.writeValueAsString(CacheManager.getBlockStyle());
	            blockStatus = objectMapper.writeValueAsString(CacheManager.getBlockStatus());
	        } catch (IOException e) {
	            // TODO: json null이면 처리필요
	            log.error("Block :: json error");
	        }

	        model.addAttribute("isSecure", request.isSecure());
	        model.addAttribute("userSession", userSession);
	        model.addAttribute("contentCacheVersion", blockPolicy.getContentCacheVersion());
	        model.addAttribute("blockStyle", blockStyle);
	        model.addAttribute("blockStatus", blockStatus);
	        model.addAttribute("gisPolicy", gisPolicy);
	        model.addAttribute("dockShape", dockShape);
	        model.addAttribute("quayShape", quayShape);
	        model.addAttribute("baseLayers", baseLayers);
	        model.addAttribute("labelList", labelList);
	        model.addAttribute("userGroupMenuList", userGroupMenuList);

	        // 블록/지번 조회 권한
	        model.addAttribute("isBlockRead", RoleSupport.isUserGroupRoleValid(userGroupRoleKeyList, RoleKey.USER_BLOCK_READ.name()));
	        return "/index";
	    }
	    
	    
	    /**
	     * 초기 셀렉트박스 요청
	     */
	     @GetMapping("init-data")
	     public ResponseEntity<?> initData(Block block) {
	         Map<String, List<Block>> result = new HashMap<>();
	         List<Block> shipNoList = null;
	         List<Block> blockList = null;
	         List<Block> jibunList = null;

	         try {
	 	        for(String selectboxValue : block.getSelectboxType()) {
	 	            if(SelectboxType.SHIPNO.name().equals(selectboxValue.toUpperCase())) {
	 	                shipNoList = blockService.selectboxShipNo(block);
	 	            } else if(SelectboxType.BLOCK.name().equals(selectboxValue.toUpperCase())) {
	 	                blockList = blockService.selectboxBlock(block);
	 	            } else if(SelectboxType.JIBUN.name().equals(selectboxValue.toUpperCase())) {
	 	                jibunList = blockService.selectboxJibun(block);
	 	            }
	 	        }

	 	        result.put("shipNo", shipNoList);
	 	        result.put("block", blockList);
	 	        result.put("jibun", jibunList);
	 	        return new ResponseEntity<>(result, HttpStatus.OK);
	 	    } catch (Exception e) {
	 	        return getErrorResponseEntity(e);
	 	    }
	     }

	     /**
	     * 블록 리스트 요청
	     */
	     @GetMapping("block-all")
	     public ResponseEntity<?> getBlockListAll(Block block) {
	     	try {
	     		return new ResponseEntity<>(CacheManager.getBlockList(), HttpStatus.OK);
	 	    } catch (Exception e) {
	 	        return getErrorResponseEntity(e);
	 	    }
	     }

	     /**
	     * 블록 리스트 요청
	     */
	     @GetMapping("block")
	     public ResponseEntity<?> getBlockList(HttpServletRequest request, Block block) {
	     	try {
	     		int totalCount = blockService.getBlockListCount(block);
	     		Pagination pagination = new Pagination(request.getRequestURI(), "", totalCount,
	     				Long.valueOf(block.getPageNo()).longValue(),
	     				Long.valueOf(block.getPageRows()).longValue(),
	     				Long.valueOf(block.getPageListCount()).longValue());
	             List<Block> blockList = blockService.getBlockList(block);

	     		Map<String, Object> result = new HashMap<>();
	             result.put("pagination", pagination);
	     		result.put("list", blockList);
	     		result.put("count", totalCount);
	     		return new ResponseEntity<>(result, HttpStatus.OK);
	 	    } catch (Exception e) {
	 	        return getErrorResponseEntity(e);
	 	    }
	     }

	     /**
	     * 블록 상세정보
	     */
	     @GetMapping("detail")
	     public ResponseEntity<?> detailBlock(Block block) {
	         try {
	     		return new ResponseEntity<>(blockService.detailBlock(block), HttpStatus.OK);
	 	    } catch (Exception e) {
	 	        return getErrorResponseEntity(e);
	 	    }
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
		  if(!RoleSupport.isUserGroupRoleValid(userGroupRoleKeyList,
		  RoleKey.USER_LOGIN.name())) { return "403"; }
		 
			/*
			List<String> userGroupRoleKeyList = CacheManager.getUserGroupRoleKeyList(userSession.getUserGroupId());
	        if(!RoleSupport.isUserGroupRoleValid(userGroupRoleKeyList, RoleKey.USER_BLOCK_READ.name())) {
				request.setAttribute("httpStatusCode", 403);
				return "/error/error";
			}
			*/
			return null;
		}
}
