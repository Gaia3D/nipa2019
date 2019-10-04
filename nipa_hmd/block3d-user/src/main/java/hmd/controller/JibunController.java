package hmd.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import hmd.domain.APIError;
import hmd.domain.CacheManager;
import hmd.domain.Jibun;
import hmd.domain.Pagination;
import hmd.service.JibunService;

@Controller
@RequestMapping("/")
public class JibunController {

    @Autowired
    private JibunService jibunService;

    /**
     * 지번 전체 목록 요청
     */
    @GetMapping("jibuns")
    public ResponseEntity<?> getJibunListAll(HttpServletRequest request, Jibun jibun) {
    	try {
    		return new ResponseEntity<>(CacheManager.getJibunList(), HttpStatus.OK);
    	} catch (Exception e) {
	        return getErrorResponseEntity(e);
    	}
    }

    /**
    * 지번 목록 요청
    */
    @GetMapping("jibuns/{name}")
    public ResponseEntity<?> getJibunList(HttpServletRequest request, Jibun jibun) {
        try {
        	int totalCount = jibunService.getJibunListCount(jibun);
    		Pagination pagination = new Pagination(request.getRequestURI(), "", totalCount,
    				Long.valueOf(jibun.getPageNo()).longValue(),
    				Long.valueOf(jibun.getPageRows()).longValue(),
    				Long.valueOf(jibun.getPageListCount()).longValue());
            List<Jibun> jibunIdList = jibunService.getJibunList(jibun);

    		Map<String, Object> result = new HashMap<>();
            result.put("pagination", pagination);
    		result.put("list", jibunIdList);
    		result.put("count", totalCount);
    		return new ResponseEntity<>(result, HttpStatus.OK);
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
}
