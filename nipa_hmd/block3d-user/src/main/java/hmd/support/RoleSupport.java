package hmd.support;

import java.util.List;

import hmd.domain.RoleKey;
import hmd.domain.UserGroupRole;

/**
 * Role Check
 * @author Cheon JeongDae
 *
 */
public class RoleSupport {

	/**
	 * 사용자 그룹 Role 체크
	 * @param listUserGroupRole
	 * @param roleKey
	 * @return
	 */
	public static boolean isUserGroupRoleValid(List<UserGroupRole> listUserGroupRole, RoleKey roleKey) {
		boolean isExist = false;
		for(UserGroupRole userGroupRole : listUserGroupRole) {
			if(roleKey.name().equals(userGroupRole.getRoleKey())) {
				isExist = true;
			}
		}
		return isExist;
	}
	
	/**
	 * 사용자 그룹 Role 체크
	 * @param listUserGroupRoleKey
	 * @param roleKey
	 * @return
	 */
	public static boolean isUserGroupRoleValid(List<String> listUserGroupRoleKey, String roleKey) {

		return listUserGroupRoleKey.contains(roleKey);
	}
}
