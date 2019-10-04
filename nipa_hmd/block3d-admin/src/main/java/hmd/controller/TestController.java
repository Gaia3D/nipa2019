package hmd.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Controller
@RequestMapping("/")
public class TestController {
	@Autowired
	private ObjectMapper objectMapper;

	/**
	    * 메인 페이지 이동
	    */
	    @GetMapping("/")
	    public String main(HttpServletRequest request, Model model) {
	    	log.info("start test");

	        return "/index";
	    }
}
