package hmd.config;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import hmd.domain.Block;
import hmd.domain.BlockStyle;
import hmd.domain.CacheManager;
import hmd.domain.Crane;
import hmd.domain.Jibun;
import hmd.domain.Layer;
import hmd.domain.MenuTarget;
import hmd.domain.Policy;
import hmd.domain.RoleTarget;
import hmd.domain.UserGroup;
import hmd.domain.UserGroupMenu;
import hmd.domain.UserGroupRole;
import hmd.domain.YOrN;
import hmd.service.BlockService;
import hmd.service.CraneService;
import hmd.service.JibunService;
import hmd.service.LayerService;
import hmd.service.PolicyService;
import hmd.service.UserGroupService;
import hmd.support.CompareTo;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CacheConfig {

	@Autowired
	private CraneService craneService;
	
	@Autowired
	private PolicyService policyService;
	
	@Autowired
	private LayerService layerService;
	
	@Autowired
    private UserGroupService userGroupService;
	
	@Autowired
    private BlockService blockService;

    @Autowired
    private JibunService jibunService;
	
	@Autowired
    private ObjectMapper objectMapper;

    public static final String LOCALHOST = "localhost";

    @PostConstruct
    public void init() {
        log.info("*************************************************");
        log.info("************ Block3D User Cache Init Start *************");
        log.info("*************************************************");

        crane();
        policy();
        layer();
        block();
        jibun();
        userGroupMenuAndRole();
        
        log.info("*************************************************");
        log.info("************* Block3D User Cache Init End **************");
        log.info("*************************************************");
    }

    private void crane() {
        List<Crane> craneList = craneService.getCrane();
        CacheManager.setCraneList(craneList);
    } 
    private void policy() {
        Policy policy = policyService.getPolicy();
        CacheManager.setPolicy(policy);
    }
    /**
     * 레이어
     */
    private void layer() {
        // layer 전체 목록
        List<Layer> layerList = layerService.getListLayer(new Layer());

        Policy policy = policyService.getPolicy();
        String dataWorkspace = policy.getGeoserverDataWorkspace() + ":";

        List<Map<String, String>> baseLayerList = new ArrayList<>();
        List<Map<String, String>> mobileBaseLayerList = new ArrayList<>();
        Map<String, List<String>> labelList = new HashMap<>();
        String Y = YOrN.Y.name();
        String KEY = "key";
        String ZINDEX = "zIndex";
        String TYPE = "type";
        for (Layer layer : layerList) {

            if (Y.equals(layer.getShapeInsertYn())) {
                // base layer 검색
                if (Y.equals(layer.getBlockDefaultYn())) {
                    Map<String, String> temp = new HashMap<>();
                    temp.put(KEY, dataWorkspace + layer.getLayerKey());
                    temp.put(ZINDEX, layer.getZIndex().toString());
                    temp.put(TYPE, layer.getViewType());
                    baseLayerList.add(temp);
                }

                // mobile base layer 검색
                if (Y.equals(layer.getMobileDefaultYn())) {
                    Map<String, String> temp = new HashMap<>();
                    temp.put(KEY, dataWorkspace + layer.getLayerKey());
                    temp.put(ZINDEX, layer.getZIndex().toString());
                    temp.put(TYPE, layer.getViewType());
                    mobileBaseLayerList.add(temp);
                }
                
             // label 검색
                if (Y.equals(layer.getLabelDisplayYn())) {
                    String ancestor = layer.getAncestor();
                    String layerKey = dataWorkspace + layer.getLayerKey();

                    if(labelList.get(ancestor) == null) {
                        List<String> temp = new ArrayList<>();
                        temp.add(layerKey);
                        labelList.put(ancestor, temp);
                    } else {
                        labelList.get(ancestor).add(layerKey);
                    }
                }
            }
        }

        // base layer 정렬
        Collections.sort(baseLayerList, new CompareTo());

        // mobile base layer 정렬
        Collections.sort(mobileBaseLayerList, new CompareTo());

        String baseLayers = "";
        String mobileBaseLayers = "";
        String labelListString = "";
        try {
            baseLayers = objectMapper.writeValueAsString(baseLayerList);
            mobileBaseLayers = objectMapper.writeValueAsString(mobileBaseLayerList);
            labelListString = objectMapper.writeValueAsString(labelList);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        CacheManager.setBaseLayers(baseLayers);
        CacheManager.setMobileBaseLayers(mobileBaseLayers);
        CacheManager.setLayerList(layerList);
        CacheManager.setLabelList(labelListString);
    }
    
    /**
     * 사용자 그룹, 메뉴, Role
     */
    private void userGroupMenuAndRole() {
        UserGroup inputUserGroup = new UserGroup();
        inputUserGroup.setUseYn(YOrN.Y.name());
        List<UserGroup> userGroupList = userGroupService.getListUserGroup(inputUserGroup);

        Map<Integer, List<UserGroupMenu>> userGroupMenuMap = new HashMap<>();
        Map<Integer, List<String>> userGroupRoleMap = new HashMap<>();

        UserGroupMenu userGroupMenu = new UserGroupMenu();
        userGroupMenu.setParent(-1);
        userGroupMenu.setMenuTarget(MenuTarget.USER.getValue());

        UserGroupRole userGroupRole = new UserGroupRole();
        userGroupRole.setRoleTarget(RoleTarget.USER.getValue());
        for(UserGroup userGroup : userGroupList) {
            Integer userGroupId = userGroup.getUserGroupId();

            userGroupMenu.setUserGroupId(userGroupId);
            List<UserGroupMenu> userGroupMenuList = userGroupService.getListUserGroupMenu(userGroupMenu);
            userGroupMenuMap.put(userGroupId, userGroupMenuList);

            userGroupRole.setUserGroupId(userGroupId);
            List<String> userGroupRoleKeyList = userGroupService.getListUserGroupRoleKey(userGroupRole);
            userGroupRoleMap.put(userGroupId, userGroupRoleKeyList);
        }

        CacheManager.setUserGroupMenuMap(userGroupMenuMap);
        CacheManager.setUserGroupRoleMap(userGroupRoleMap);
    }
    
    private void block() {
        List<Block> blockList = blockService.getBlockListAll(new Block());
        CacheManager.setBlockList(blockList);

        List<BlockStyle> blockStyle = blockService.getBlockStyle();
        CacheManager.setBlockStyle(blockStyle);

        List<BlockStyle> blockStatus = blockService.getBlockStatus();
        CacheManager.setBlockStatus(blockStatus);
    }

    private void jibun() {
        List<String> jibunList = jibunService.getJibunListAll(new Jibun());
        CacheManager.setJibunList(jibunList);
    }
}
