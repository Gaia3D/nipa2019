package hmd.persistence.postgresql;

import org.springframework.stereotype.Repository;

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

}
