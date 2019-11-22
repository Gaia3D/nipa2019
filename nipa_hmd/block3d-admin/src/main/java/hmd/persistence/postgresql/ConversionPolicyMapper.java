package hmd.persistence.postgresql;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import hmd.common3d.conversion.ConversionLog;
import hmd.common3d.conversion.ConversionPolicy;

@Repository
public interface ConversionPolicyMapper {
	
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
	 * @param parameterMap
	 * @return
	 * @throws Exception
	 */
	public List<ConversionLog> selectConversionLogList(Map<String, Object> parameterMap) throws Exception;

}
