package hmd.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hmd.common3d.conversion.ConversionLog;
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

	@Override
	public int selectConversionLogCount() throws Exception {
		// TODO Auto-generated method stub
		return conversionPolicyMapper.selectConversionLogCount();
	}

	@Override
	public List<ConversionLog> selectConversionLogList(int offset, int limit) throws Exception {
		// TODO Auto-generated method stub
		
		Map<String, Object> parameterMap = new HashMap<String, Object>();
		parameterMap.put("offset", offset);
		parameterMap.put("limit", limit);
		
		return conversionPolicyMapper.selectConversionLogList(parameterMap);
	}

}
