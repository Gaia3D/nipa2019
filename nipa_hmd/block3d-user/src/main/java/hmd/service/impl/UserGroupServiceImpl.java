package hmd.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hmd.domain.UserGroup;
import hmd.domain.UserGroupMenu;
import hmd.domain.UserGroupRole;
import hmd.persistence.postgresql.UserGroupMapper;
import hmd.service.UserGroupService;

@Service
public class UserGroupServiceImpl implements UserGroupService {

	@Autowired
	private UserGroupMapper userGroupMapper;
	
	/**
	 * 사용자 그룹 목록
	 * 
	 * @param userGroup
	 * @return
	 */
	@Transactional(value="postgresTransactionManager", readOnly = true)
    public List<UserGroup> getListUserGroup(UserGroup userGroup) {
		return userGroupMapper.getListUserGroup(userGroup);
	}
	
    @Transactional(value="postgresTransactionManager", readOnly = true)
    public UserGroup getUserGroup(String userId) {
        return userGroupMapper.getUserGroupByUserId(userId);
    }
   
    /**
     * 사용자 그룹 메뉴
     * @param userGroupMenu
     * @return
     */
    @Transactional(value="postgresTransactionManager", readOnly = true)
    public List<UserGroupMenu> getListUserGroupMenu(UserGroupMenu userGroupMenu) {
    	return userGroupMapper.getListUserGroupMenu(userGroupMenu);
    }
    
    /**
     * 사용자 그룹 Role
     * @param userGroupRole
     * @return
     */
    @Transactional(value="postgresTransactionManager", readOnly = true)
    public List<UserGroupRole> getListUserGroupRole(UserGroupRole userGroupRole) {
    	return userGroupMapper.getListUserGroupRole(userGroupRole);
    }
    
    /**
	 * 사용자 그룹 Role Key 목록
	 * @param userGroupRole
	 * @return
	 */
    @Transactional(value="postgresTransactionManager", readOnly = true)
    public List<String> getListUserGroupRoleKey(UserGroupRole userGroupRole) {
    	return userGroupMapper.getListUserGroupRoleKey(userGroupRole);
    }
}
