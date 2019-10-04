package hmd.persistence.postgresql;

import java.util.List;

import org.springframework.stereotype.Repository;

import hmd.domain.UserGroup;
import hmd.domain.UserGroupMenu;
import hmd.domain.UserGroupRole;

/**
 * 사용자 그룹
 * 
 * @author jeongdae
 *
 */
@Repository
public interface UserGroupMapper {

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
	UserGroup getUserGroupByUserId(String userId);
	
	/**
	 * 사용자 그룹 메뉴 권한 목록
	 * 
	 * @param userGroupMenu
	 * @return
	 */
	List<UserGroupMenu> getListUserGroupMenu(UserGroupMenu userGroupMenu);
	
	/**
	 * 사용자 그룹 Role 목록
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
