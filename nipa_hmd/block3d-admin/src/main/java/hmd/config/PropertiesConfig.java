package hmd.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import lombok.Data;

@Data
@Configuration
@PropertySource("classpath:hmd.properties")
@ConfigurationProperties(prefix = "hmd")
public class PropertiesConfig {

    private String osType;
    // 로그인 등 레거시 시스템의 경우 로컬, 개발환경에서는 mock을 사용하고 운영에서는 실제 소스를 사용
    private boolean mockEnable;
    private boolean callRemoteEnable;
    private String serverIp;
    
    // http, https
    private String restTemplateMode;
    
    private String restAuthKey;

    private String outputDir;
    private String logBaseDir;
    private String logBaseName;

    private String uploadDir;

    private String gdalCmdPath;

    private String mapDefaultLayer;

    private String gisRestServer;
}
