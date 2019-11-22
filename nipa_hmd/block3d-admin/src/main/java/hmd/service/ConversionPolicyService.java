package hmd.service;

import java.util.List;

import hmd.common3d.conversion.ConversionLog;
import hmd.common3d.conversion.ConversionPolicy;

public interface ConversionPolicyService {
	
	/**
	 * <pre>
	 * 3D 설계파일 변환정책 조회
	 * </pre>
	 * @return
	 * @throws Exception
	 */
	public ConversionPolicy selectConversionPolicy() throws Exception;
	
	/**
	 * <pre>
	 * 3D 설계파일 변환 로그 레코드 수
	 * </pre>
	 * @return
	 * @throws Exception
	 */
	public int selectConversionLogCount() throws Exception;
	
	/**
	 * <pre>
	 * 3D 설계파일 변환 로그 쿼리
	 * </pre>
	 * @param offset
	 * @param limit
	 * @return
	 * @throws Exception
	 */
	public List<ConversionLog> selectConversionLogList(int offset, int limit) throws Exception;

}
