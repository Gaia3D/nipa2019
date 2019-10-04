package hmd;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSessionBindingListener;

import org.apache.catalina.Context;
import org.apache.catalina.connector.Connector;
import org.apache.tomcat.util.descriptor.web.SecurityCollection;
import org.apache.tomcat.util.descriptor.web.SecurityConstraint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.web.filter.HiddenHttpMethodFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import hmd.config.PropertiesConfig;
import hmd.domain.OSType;
import hmd.filter.XSSFilter;
import hmd.listener.Gaia3dHttpSessionBindingListener;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootApplication
public class Block3DAdminApplication extends SpringBootServletInitializer {
	
	@Value("${server.port}")
	private Integer serverPort;
	@Value("${server.http.port}")
    private int serverHttpPort;
	
	@Autowired
	private PropertiesConfig propertiesConfig;

	public static void main(String[] args) {
		SpringApplication.run(Block3DAdminApplication.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(Block3DAdminApplication.class);
	}
	
	/**
	 * Cross-Origin Resouces Sharing
	 * @return
	 */
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedMethods("GET", "POST", "PUT", "DELETE").allowedOrigins("*")
					.allowedHeaders("*");
			}
		};
	}
	
	@Bean
    public FilterRegistrationBean<XSSFilter> xSSFilter() {
		FilterRegistrationBean<XSSFilter> registrationBean = new FilterRegistrationBean<>(new XSSFilter());
		
		List<String> urls = getUrlList();
		
		registrationBean.setUrlPatterns(urls);
		//registrationBean.addUrlPatterns(/*);
		return registrationBean;
    }
    
    @Bean
	public FilterRegistrationBean<HiddenHttpMethodFilter> hiddenHttpMethodFilter() {
		FilterRegistrationBean<HiddenHttpMethodFilter> registrationBean = new FilterRegistrationBean<>(new HiddenHttpMethodFilter());
		List<String> urls = getUrlList();
		
		registrationBean.setUrlPatterns(urls);
		//registrationBean.addUrlPatterns("/*");
		return registrationBean;
	}
    
    @Bean
	public HttpSessionBindingListener httpSessionBindingListener() {
		log.info(" $$$ Block3DAdminApplication registerListener $$$ ");
		return new Gaia3dHttpSessionBindingListener();
	}
	
	@Bean
	public ServletWebServerFactory containerFactory() {
		String osType = propertiesConfig.getOsType();
		
		if(OSType.WINDOW.name().equals(osType)) {
			TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory();
		    tomcat.addAdditionalTomcatConnectors(createHttpConnector());
		    return tomcat;
		} else {
			TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory() {
		        @Override
		        protected void postProcessContext(Context context) {
		        	SecurityConstraint securityConstraint = new SecurityConstraint();
		        	securityConstraint.setUserConstraint("CONFIDENTIAL");
		        	SecurityCollection collection = new SecurityCollection();
		        	collection.addPattern("/*");
		        	securityConstraint.addCollection(collection);
		        	context.addConstraint(securityConstraint);
		        }
		    };
		    
		    tomcat.addAdditionalTomcatConnectors(createHttpConnector());
		    return tomcat;
		}
	}
	
	private Connector createHttpConnector() {
		String osType = propertiesConfig.getOsType();
		
		Connector connector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
		if(!OSType.WINDOW.name().equals(osType)) {
			connector.setScheme("http");
		}
		connector.setPort(serverHttpPort);
		if(!OSType.WINDOW.name().equals(osType)) {
			connector.setSecure(false);
			connector.setRedirectPort(serverPort);
		}
		return connector;
	}
	
	private List<String> getUrlList() {
		List<String> urls = new ArrayList<>();
		urls.add("/user/*");
		urls.add("/access/*");
		urls.add("/roles/*");
		urls.add("/role/*");
		urls.add("/menus/*");
		urls.add("/facility/*");
		urls.add("/block-policy");
		urls.add("/statistic/*");
		return urls;
	}
}