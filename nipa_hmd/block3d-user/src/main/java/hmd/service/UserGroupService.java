package hmd.service;

import java.util.List;

import hmd.domain.UserGroup;
import hmd.domain.UserGroupMenu;
import hmd.domain.UserGroupRole;

/**
 * 사용자 그룹 메뉴, Role 조회
 * @author Cheon JeongDae
 *
 */
public interface UserGroupService {

	/**
	 * 사용자 그룹 목록
	 * 
	 * @param userGroup
	 * @return
	 */
	List<UserGroup> getListUserGroup(UserGroup userGroup);
	
    /**
     * 사용자 그룹 정보 취득
     * @param userId
     * @return
     */
    UserGroup getUserGroup(String userId);

    /**
     * 사용자 그룹 메뉴
     * @param userGroupMenu
     * @return
     */
    List<UserGroupMenu> getListUserGroupMenu(UserGroupMenu userGroupMenu);
    
    /**
     * 사용자 그룹 Role
     * @param userGroupRole
     * @return
     */
    List<UserGroupRole> getListUserGroupRole(UserGroupRole userGroupRole);
    
    /**
	 * 사용자 그룹 Role Key 목록
	 * @param userGroupRole
	 * @return
	 */
	List<String> getListUserGroupRoleKey(UserGroupRole userGroupRole);
}
