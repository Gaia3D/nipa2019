package hmd.interceptor;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import hmd.domain.CacheManager;
import hmd.domain.Menu;
import hmd.domain.UserGroupMenu;
import hmd.domain.UserSession;

/**
 * 사이트 전체 설정 관련 처리를 담당
 *  
 * @author jeongdae
 *
 */
@Component
public class ConfigInterceptor extends HandlerInterceptorAdapter {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    	
    	String uri = request.getRequestURI();
    	if(uri.equals("/")) return true;
    	HttpSession session = request.getSession();
    	
    	// TODO 너무 비 효율 적이다. 좋은 방법을 찾자.
    	// 세션이 존재하지 않는 경우
    	UserSession userSession = (UserSession)session.getAttribute(UserSession.KEY);
    	if(userSession != null && userSession.getUserId() != null && !"".equals(userSession.getUserId())) {
	    	List<UserGroupMenu> userGroupMenuList = CacheManager.getUserGroupMenuList(userSession.getUserGroupId());
	    	
	    	Integer clickParentId = null;
			Integer clickMenuId = null;
			Integer clickDepth = null;
			Menu parentMenu = null;
			
			for(UserGroupMenu userGroupMenu : userGroupMenuList) {
				if(uri.equals(userGroupMenu.getUrl())) {
					clickMenuId = userGroupMenu.getMenuId();
					if(userGroupMenu.getDepth() == 1) {
						clickParentId = userGroupMenu.getMenuId();
					} else {
						clickParentId = Integer.valueOf(userGroupMenu.getParent().toString());
					}
					clickDepth = userGroupMenu.getDepth();
					
					if( userGroupMenu.getDepth() == 1 && (uri.indexOf("/main/index.do")>=0) ) {
						break;
					} else if( userGroupMenu.getDepth() == 2) {
						break;
					} else {
						continue;
					}
				}
			}
			
			request.setAttribute("clickMenuId", clickMenuId);
			request.setAttribute("parentMenu", parentMenu);
			request.setAttribute("cacheUserGroupMenuList", userGroupMenuList);
			request.setAttribute("cacheUserGroupMenuListSize", userGroupMenuList.size());
    	}
    	
        return true;
    }
}
