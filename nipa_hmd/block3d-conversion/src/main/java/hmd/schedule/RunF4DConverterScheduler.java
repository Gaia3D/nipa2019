package hmd.schedule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import hmd.common3d.conversion.ConversionPolicy;
import hmd.service.ConversionPolicyService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RunF4DConverterScheduler {
	
	@Autowired
	private ConversionPolicyService conversionPolicyService;
	
	/**
	 * f4dconverter 실행 스케줄러
	 * 매일 자정에 실행
	 * @throws Exception
	 */
	@Scheduled(cron="0 0 0 * * ?")
	public void runF4DConverter() throws Exception {
		
		ConversionPolicy conversionPolicy = conversionPolicyService.selectConversionPolicy();
		
		System.out.println("==================");
		System.out.println("Fixed rate task - " + System.currentTimeMillis() / 1000);
		System.out.println(conversionPolicy.getConversionInputRepository());
	}

}
