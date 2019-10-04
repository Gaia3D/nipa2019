package hmd.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hmd.common3d.conversion.ConversionPolicy;
import hmd.persistence.postgresql.ConversionPolicyMapper;
import hmd.service.ConversionPolicyService;

@Service
public class ConversionPolicyServiceImpl implements ConversionPolicyService {
	
	@Autowired
	private ConversionPolicyMapper conversionPolicyMapper;

	@Override
	public ConversionPolicy selectConversionPolicy() throws Exception {
		// TODO Auto-generated method stub
		return conversionPolicyMapper.selectConversionPolicy();
	}

}
