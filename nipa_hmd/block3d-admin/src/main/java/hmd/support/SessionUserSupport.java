package hmd.support;

import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpSession;

import lombok.extern.slf4j.Slf4j;

/**
 * 중복 로그인 방지를 위해 사용자의 아이디와 세션 아이디를 관리
 * @author jeongdae
 *
 */
@Slf4j
public class SessionUserSupport {
	
	public static ConcurrentHashMap<String, HttpSession> loginUsersMap = new ConcurrentHashMap<String, HttpSession>();

	/**
	 * 로그인 아이디로 생성된 세션이 존재하는 확인
	 * @param userId
	 * @return
	 */
	public static boolean isExistSession(String userId) {
		return loginUsersMap.containsKey(userId);
	}

	/**
	 * 동일 아이디로 생성된 세션이 존재할 경우 파기
	 * @param userId
	 */
	public static void invalidateSession(String userId) {
		HttpSession session = SessionUserSupport.loginUsersMap.get(userId);
		session.invalidate();
		loginUsersMap.remove(userId);
	}
	
	/**
	 * 현재 접속자 수
	 * @return
	 */
	public int getSessionCount() {
		return loginUsersMap.size();
	}
}
