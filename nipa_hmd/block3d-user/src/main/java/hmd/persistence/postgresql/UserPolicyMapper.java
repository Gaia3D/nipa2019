package hmd.persistence.postgresql;

import org.springframework.stereotype.Repository;

import hmd.domain.UserPolicy;

@Repository
public interface UserPolicyMapper {

	/**
	 * 사용자 설정 정보 취득
	 * @param userId
	 * @return
	 */
	UserPolicy getUserPolicy(String userId);

	/**
	 * 사용자 설정 등록
	 * @param userPolicy
	 * @return
	 */
	int insertUserPolicy(UserPolicy userPolicy);

	/**
	 * 사용자 설정 수정
	 * @param userPolicy
	 * @return
	 */
	int updateUserPolicy(UserPolicy userPolicy);

	/**
	 * 사용자 레이어 설정 등록
	 * @param userPolicy
	 * @return
	 */
	int insertUserLayer(UserPolicy userPolicy);

	/**
	 * 사용자 레이어 설정 수정
	 * @param userPolicy
	 * @return
	 */
	int updateUserLayer(UserPolicy userPolicy);

}
