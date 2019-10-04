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
@MapperScan(basePackages="hmd.persistence.postgresql", sqlSessionFactoryRef = "postgresqlSqlSessionFactory")
@Configuration
@ComponentScan(	basePackages = {"hmd.service, hmd.persistence.postgresql"},
              includeFilters = {	@Filter(type = FilterType.ANNOTATION, value = Component.class),
                                  @Filter(type = FilterType.ANNOTATION, value = Service.class),
                                  @Filter(type = FilterType.ANNOTATION, value = Repository.class) },
              excludeFilters = @Filter(type = FilterType.ANNOTATION, value = Controller.class) )
public class PostgresqlDataSourceConfig {

    @Value("${spring.datasource.block3d.driver-class-name}")
    private String postgresDriverClassName;
    @Value("${spring.datasource.block3d.url}")
    private String postgresqlUrl;
    @Value("${spring.datasource.block3d.username}")
    private String postgresqlUsername;
    @Value("${spring.datasource.block3d.password}")
    private String postgresqlPassword;
    @Value("${spring.datasource.block3d.hikari.maximum-pool-size}")
    private Integer postgresqlMaximumPoolSize;
    @Value("${spring.datasource.block3d.hikari.minimum-idle}")
    private Integer postgresqlMinimumIdle;


    @Bean
    public DataSource postgresqlDataSource() {

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName(postgresDriverClassName);
        dataSource.setJdbcUrl(Crypt.decrypt(postgresqlUrl));
        dataSource.setUsername(Crypt.decrypt(postgresqlUsername));
        dataSource.setPassword(Crypt.decrypt(postgresqlPassword));
        dataSource.setMaximumPoolSize(postgresqlMaximumPoolSize);
        dataSource.setMinimumIdle(postgresqlMinimumIdle);

        return dataSource;
    }

    @Bean(name = "postgresTransactionManager")
    public DataSourceTransactionManager postgresTransactionManager() {
        log.info(" ### RootConfig postgresTransactionManager ### ");
        final DataSourceTransactionManager transactionManager = new DataSourceTransactionManager(postgresqlDataSource());
        return transactionManager;
    }

    @Bean(name = "postgresqlSqlSessionFactory")
    public SqlSessionFactory postgresqlSqlSessionFactory() throws Exception {
        log.info(" ### Postgresql sqlSessionFactory ### ");
        SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
        factory.setDataSource(postgresqlDataSource());
        factory.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mybatis/postgresql/*.xml"));
        factory.setConfigLocation(new PathMatchingResourcePatternResolver().getResource("mybatis-config-postgresql.xml"));
        return factory.getObject();
    }

}
