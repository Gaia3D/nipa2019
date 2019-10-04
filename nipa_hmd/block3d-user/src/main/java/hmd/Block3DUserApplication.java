package hmd;

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
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import hmd.config.PropertiesConfig;
import hmd.domain.OSType;
import hmd.listener.Gaia3dHttpSessionBindingListener;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@EnableScheduling
@SpringBootApplication
public class Block3DUserApplication extends SpringBootServletInitializer {
	
	@Value("${server.port}")
	private Integer serverPort;
	@Value("${server.http.port}")
    private int serverHttpPort;
	
	@Autowired
	private PropertiesConfig propertiesConfig;

    public static void main(String[] args) {
        SpringApplication.run(Block3DUserApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Block3DUserApplication.class);
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

//    @Bean
//	public FilterRegistrationBean<HiddenHttpMethodFilter> hiddenHttpMethodFilter() {
//		FilterRegistrationBean<HiddenHttpMethodFilter> registrationBean = new FilterRegistrationBean<>(new HiddenHttpMethodFilter());
//		List<String> urls = getUrlList();
//		
//		registrationBean.setUrlPatterns(urls);
//		//registrationBean.addUrlPatterns("/*");
//		return registrationBean;
//	}
    
    @Bean
	public HttpSessionBindingListener httpSessionBindingListener() {
		log.info(" $$$ Block3DUserApplication registerListener $$$ ");
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
	
//	private List<String> getUrlList() {
//		List<String> urls = new ArrayList<>();
//		urls.add("/main");
//		return urls;
//	}
}