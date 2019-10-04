package hmd.config;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.time.Duration;
import java.util.List;

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
import org.springframework.mobile.device.DeviceHandlerMethodArgumentResolver;
import org.springframework.mobile.device.DeviceResolverHandlerInterceptor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
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

import hmd.interceptor.SecurityInterceptor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@EnableWebMvc
@Configuration
@ComponentScan(basePackages = { "hmd.config, hmd.controller, hmd.interceptor" }, includeFilters = {
        @Filter(type = FilterType.ANNOTATION, value = Component.class),
        @Filter(type = FilterType.ANNOTATION, value = Controller.class),
        @Filter(type = FilterType.ANNOTATION, value = RestController.class)})
public class ServletConfig implements WebMvcConfigurer {
	
	@Autowired
	private PropertiesConfig propertiesConfig;
	
	@Autowired
	private SecurityInterceptor securityInterceptor;

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

    @Bean
    public DeviceResolverHandlerInterceptor deviceResolverHandlerInterceptor() {
        return new DeviceResolverHandlerInterceptor();
    }

    @Bean
    public DeviceHandlerMethodArgumentResolver deviceHandlerMethodArgumentResolver() {
        return new DeviceHandlerMethodArgumentResolver();
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(deviceHandlerMethodArgumentResolver());
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
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(securityInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/login/**", "/css/**", "/externlib/**", "/images/**", "/js/**", "/manual/**");
        registry.addInterceptor(deviceResolverHandlerInterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns("/css/**", "/externlib/**", "/images/**", "/js/**", "/manual/**");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/main");
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/css/**").addResourceLocations("/css/");
        registry.addResourceHandler("/externlib/**").addResourceLocations("/externlib/");
        registry.addResourceHandler("/images/**").addResourceLocations("/images/");
        registry.addResourceHandler("/js/**").addResourceLocations("/js/");
        registry.addResourceHandler("/manual/**").addResourceLocations("/manual/");

//        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
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
