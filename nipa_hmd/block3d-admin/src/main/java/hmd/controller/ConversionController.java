package hmd.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import hmd.common3d.conversion.ConversionPolicy;
import hmd.service.ConversionPolicyService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/")
public class ConversionController {
	
	@Autowired
	private ConversionPolicyService conversionService;

	@GetMapping(value = "conversion/manage")
	public String manage(HttpServletRequest request, Model model) throws Exception {
		
		ConversionPolicy conversionPolicy = conversionService.selectConversionPolicy();
		model.addAttribute("conversionPolicy", conversionPolicy);
		
		return "/conversion/manage";
	}
}
