package hmd.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/")
public class ConversionController {
	
	@GetMapping("manual-conversion")
	@ResponseBody
	public String manualConversion(HttpServletRequest request, Model model) {
		
		String[] command = new String[] {"cmd.exe", "/C", "start"};
		ProcessBuilder builder = new ProcessBuilder(command);
		try {
			Process process = builder.start();
			process.waitFor();
			
			InputStream psout = process.getInputStream();
			
			byte[] buffer = new byte[1024];
	        int n = 0;
	        while ((n = psout.read(buffer)) != -1) {
	        	System.out.write(buffer, 0, n);
	        }
	        
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return "manual conversion";
	}

}
