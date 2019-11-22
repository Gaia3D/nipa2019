package hmd.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import hmd.common3d.conversion.ConversionLog;
import hmd.common3d.conversion.ConversionPolicy;
import hmd.domain.PageType;
import hmd.domain.Pagination;
import hmd.service.ConversionPolicyService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/")
public class ConversionController {
	
	@Autowired
	private ConversionPolicyService conversionService;

	@GetMapping(value = "conversion/policy")
	public String policy(HttpServletRequest request, Model model) throws Exception {
		
		ConversionPolicy conversionPolicy = conversionService.selectConversionPolicy();
		model.addAttribute("conversionPolicy", conversionPolicy);
		
		return "/conversion/policy";
	}
	
	@GetMapping(value = "conversion/logList")
	public String log(HttpServletRequest request, Model model) throws Exception {
		
		int totalLogCount = conversionService.selectConversionLogCount();
		
		int offset = 0;		// page - 1;
		int limit = 1;		// 한페이지에 보여할 리스트 갯수
		
		int totalPage = totalLogCount / limit;
		if (totalLogCount % limit > 0) {
			totalPage++;
		}
		
		Pagination pagination = new Pagination(request.getRequestURI(), ""/*getSearchParameters(PageType.LIST, request, userInfo)*/, totalLogCount, Long.valueOf(offset + 1).longValue(), limit);
		
		
		List<ConversionLog> conversionLogList = conversionService.selectConversionLogList(offset, limit);
		
		model.addAttribute("pagination", pagination);
		model.addAttribute("totalLogCount", totalLogCount);
		model.addAttribute("currentPage", offset + 1);
		model.addAttribute("totalPage", totalPage);
		model.addAttribute("conversionLogList", conversionLogList);
		
		return "/conversion/logList";
	}
	
	@GetMapping(value = "conversion/manual")
	public String manual(HttpServletRequest request, Model model) throws Exception {
		
		return "/conversion/manual";
	}
}
