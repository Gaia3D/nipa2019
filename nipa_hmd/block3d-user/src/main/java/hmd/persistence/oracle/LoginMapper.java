package hmd.persistence.oracle;

import org.springframework.stereotype.Repository;

import hmd.domain.UserInfo;
import hmd.domain.UserSession;

/**
 * 로그인 처리 기능
 * @author kimhj
 */
@Repository
public interface LoginMapper {

    /**
     * 로그인 세션 정보를 취득
     * @param userInfo
     * @return
     */
    UserSession getUser(UserInfo userInfo);
}
