package hmd.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import com.zaxxer.hikari.HikariDataSource;

import hmd.security.Crypt;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@MapperScan(basePackages="hmd.persistence.oracle", sqlSessionFactoryRef = "oracleSqlSessionFactory")
@Configuration
@ComponentScan(	basePackages = {"hmd.service, hmd.persistence.oracle"},
              includeFilters = {	@Filter(type = FilterType.ANNOTATION, value = Component.class),
                                  @Filter(type = FilterType.ANNOTATION, value = Service.class),
                                  @Filter(type = FilterType.ANNOTATION, value = Repository.class) },
              excludeFilters = @Filter(type = FilterType.ANNOTATION, value = Controller.class) )
public class OracleDataSourceConfig {

    @Value("${spring.datasource.oracle.driver-class-name}")
    private String oracleDriverClassName;
    @Value("${spring.datasource.oracle.url}")
    private String oracleUrl;
    @Value("${spring.datasource.oracle.username}")
    private String oracleUsername;
    @Value("${spring.datasource.oracle.password}")
    private String oraclePassword;
    @Value("${spring.datasource.oracle.hikari.maximum-pool-size}")
    private Integer oracleMaximumPoolSize;
    @Value("${spring.datasource.oracle.hikari.minimum-idle}")
    private Integer oracleMinimumIdle;

    @Primary
    @Bean
    public DataSource oracleDataSource() {

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName(oracleDriverClassName);
        dataSource.setJdbcUrl(Crypt.decrypt(oracleUrl));
        dataSource.setUsername(Crypt.decrypt(oracleUsername));
        dataSource.setPassword(Crypt.decrypt(oraclePassword));
        dataSource.setMaximumPoolSize(oracleMaximumPoolSize);
        dataSource.setMinimumIdle(oracleMinimumIdle);

        return dataSource;
    }

    @Primary
    @Bean(name = "oracleTransactionManager")
    public DataSourceTransactionManager oracleTransactionManager() {
        log.info(" ### RootConfig transactionManager ### ");
        final DataSourceTransactionManager transactionManager = new DataSourceTransactionManager(oracleDataSource());
        return transactionManager;
    }

    @Primary
    @Bean(name = "oracleSqlSessionFactory")
    public SqlSessionFactory oracleSqlSessionFactory() throws Exception {
        log.info(" ### Oracle sqlSessionFactory ### ");
        SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
        factory.setDataSource(oracleDataSource());
        factory.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mybatis/oracle/*.xml"));
        factory.setConfigLocation(new PathMatchingResourcePatternResolver().getResource("mybatis-config-oracle.xml"));
        return factory.getObject();
    }

}
