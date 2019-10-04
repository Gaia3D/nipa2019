package hmd.config;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.time.Duration;

import javax.net.ssl.SSLContext;

import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.TrustStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.Ordered;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import hmd.interceptor.ConfigInterceptor;
import hmd.interceptor.LogInterceptor;
import hmd.interceptor.SecurityInterceptor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@EnableWebMvc
@Configuration
@ComponentScan(basePackages = { "hmd.config, hmd.api, hmd.controller, hmd.interceptor, hmd.validator" }, includeFilters = {
		@Filter(type = FilterType.ANNOTATION, value = Component.class),
		@Filter(type = FilterType.ANNOTATION, value = Controller.class),
		@Filter(type = FilterType.ANNOTATION, value = RestController.class)})
public class ServletConfig implements WebMvcConfigurer {
	
	@Autowired
	private PropertiesConfig propertiesConfig;
	
	/*
	 * @Autowired private ConfigInterceptor configInterceptor;
	 * 
	 * @Autowired private SecurityInterceptor securityInterceptor;
	 * 
	 * @Autowired private LogInterceptor logInterceptor;
	 */
	
	@Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		log.info(" @@@ ServletConfig addInterceptors not yet doing @@@@ ");
		
		/*
		 * registry.addInterceptor(securityInterceptor) .addPathPatterns("/**")
		 * .excludePathPatterns("/login/**", "/css/**", "/externlib/**", "/images/**",
		 * "/js/**"); registry.addInterceptor(logInterceptor) .addPathPatterns("/**")
		 * .excludePathPatterns("/login/**", "/css/**", "/externlib/**", "/images/**",
		 * "/js/**"); registry.addInterceptor(configInterceptor) .addPathPatterns("/**")
		 * .excludePathPatterns("/login/**", "/css/**", "/externlib/**", "/images/**",
		 * "/js/**");
		 */
    }
	
	@Bean
	@ConditionalOnMissingBean(InternalResourceViewResolver.class)
	public InternalResourceViewResolver viewResolver() {
		log.info(" @@@ ServletConfig viewResolver @@@");
		InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
		viewResolver.setPrefix("/WEB-INF/views");
		viewResolver.setSuffix(".jsp");
		viewResolver.setOrder(3);
		
		return viewResolver;
	}
	
//	@Bean
//	public HandlebarsViewResolver viewResolver() {
//		HandlebarsViewResolver handlebarsViewResolver = new HandlebarsViewResolver();
//		handlebarsViewResolver.setPrefix("/WEB-INF/templates");
//		handlebarsViewResolver.setSuffix(".html");
//		handlebarsViewResolver.setOrder(1);
//		handlebarsViewResolver.setCache(false);
//		
//		handlebarsViewResolver.registerHelper("math", new MathHelper());
//		handlebarsViewResolver.registerHelpers(ConditionalHelpers.class);
//		
//		return handlebarsViewResolver;
//	}
	
	// TODO nashorn 적용 하다 실패. https://github.com/kingbbode/spring-nashorn-isomorphic
//	@Bean
//	public ViewResolver viewResolver() {
//		ScriptTemplateViewResolver viewResolver = new ScriptTemplateViewResolver();
//		viewResolver.setPrefix("/WEB-INF/templates");
//		viewResolver.setSuffix(".html");
//		viewResolver.setOrder(1);
//		viewResolver.setCache(false);
//		return viewResolver;
//	}
//	
//	@Bean
//	public ScriptTemplateConfigurer handlebarsConfigurer() { 
//		ScriptTemplateConfigurer configurer = new ScriptTemplateConfigurer();
//		configurer.setEngineName("nashorn");
//		configurer.setScripts("/static/polyfill.js", 
//				"/META-INF/resources/webjars/handlebars/4.0.11-1/handlebars.js",
//				"/static/render.js");
//		configurer.setRenderFunction("render");
//		configurer.setSharedEngine(false);
//		return configurer;
//	}

	@Bean
	public LocaleResolver localeResolver() {
		SessionLocaleResolver sessionLocaleResolver = new SessionLocaleResolver();
		return sessionLocaleResolver;
	}

	@Bean
	public ReloadableResourceBundleMessageSource messageSource(){
		ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
		messageSource.setBasename("classpath:/messages/messages");
		messageSource.setDefaultEncoding("UTF-8");
		return messageSource;
	}

	@Bean
	public MessageSourceAccessor getMessageSourceAccessor(){
		ReloadableResourceBundleMessageSource m = messageSource();
		return new MessageSourceAccessor(m);
	}
	
	@Override
    public void addViewControllers(ViewControllerRegistry registry) {
		//registry.addViewController("/").setViewName("forward:/login/login");
		registry.addViewController("/").setViewName("/index");
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
    }
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		log.info(" @@@ ServletConfig addResourceHandlers @@@");
		registry.addResourceHandler("/css/**").addResourceLocations("/css/");
		registry.addResourceHandler("/externlib/**").addResourceLocations("/externlib/");
		registry.addResourceHandler("/images/**").addResourceLocations("/images/");
		registry.addResourceHandler("/js/**").addResourceLocations("/js/");
		
//		registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
	}
	
	@Bean
	public ObjectMapper objectMapper() {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		
		return objectMapper;
	}
	
	/**
	 * TODO rest-template-mode 값으로 결정 하는게 아니라 request.isSecure 로 http, https 를 판별해서 결정 해야 하는데....
	 *      그럴경우 bean 설정이 아니라.... 개별 코드에서 판별을 해야 함 ㅠ.ㅠ
	 * @return
	 * @throws KeyStoreException
	 * @throws NoSuchAlgorithmException
	 * @throws KeyManagementException
	 */
	@Bean
    public RestTemplate restTempate() throws KeyStoreException, NoSuchAlgorithmException, KeyManagementException {
    	// https://github.com/jonashackt/spring-boot-rest-clientcertificate/blob/master/src/test/java/de/jonashackt/RestClientCertTestConfiguration.java
    	
    	String restTemplateMode = propertiesConfig.getRestTemplateMode();
    	RestTemplate restTemplate = null;
    	RestTemplateBuilder builder = new RestTemplateBuilder(new CustomRestTemplateCustomizer());
    	if("http".equals(restTemplateMode)) {
    		restTemplate = builder.errorHandler(new RestTemplateResponseErrorHandler())
						.setConnectTimeout(Duration.ofMillis(10000))
	            		.setReadTimeout(Duration.ofMillis(10000))
	            		.build();
    	} else {
    		TrustStrategy acceptingTrustStrategy = (X509Certificate[] chain, String authType) -> true;
	    	SSLContext sslContext = org.apache.http.ssl.SSLContexts.custom().loadTrustMaterial(null, acceptingTrustStrategy).build();
	 
	    	SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(sslContext);
	    	CloseableHttpClient httpClient = HttpClients.custom().setSSLSocketFactory(csf).build();
	 
	    	HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
	        requestFactory.setHttpClient(httpClient);
	        
	    	restTemplate = builder.errorHandler(new RestTemplateResponseErrorHandler())
						.setConnectTimeout(Duration.ofMillis(10000))
	            		.setReadTimeout(Duration.ofMillis(10000))
	            		.build();
			restTemplate.setRequestFactory(requestFactory);
    	}
    	
		return restTemplate;
    }
}
