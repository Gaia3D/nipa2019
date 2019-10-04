package hmd.domain;

import java.util.List;
import java.util.Map;

/**
 * TODO 귀찮고, 전부 select 성 데이터고 관리자가 혼자라서 getInstance를 사용하지 않았음. 바람직 하지는 않음
 * 환경 설정 관련 모든 요소를 캐시 처리
 *
 * @author jeongdae
 *
 */
public class CacheManager {

    private volatile static CacheManager cacheManager = new CacheManager();;

    private CacheManager() {
    }
    
    
    // 사용자 그룹별 메뉴 목록
    private Map<Integer, List<UserGroupMenu>> userGroupMenuMap = null;
    // 사용자 그룹별 Role 목록
    private Map<Integer, List<String>> userGroupRoleMap = null;
    private List<Layer> layerList = null;
    private String baseLayers = null;
    private String mobileBaseLayers = null;
    private List<Crane> craneList = null;
    private List<BlockStyle> blockStyle = null;
    private List<BlockStyle> blockStatus = null;
    private String dockList = null;
    private String quayList = null;
    private String labelList = null;
    private Policy policy = null;
    private List<String> jibunList = null;
    private List<Block> blockList = null;
    
    public static String getDockList() {
        return cacheManager.dockList;
    }

    public static void setDockList(String dockList) {
        cacheManager.dockList = dockList;
    }
    public static List<String> getUserGroupRoleKeyList(Integer userGroupId) {
        return cacheManager.userGroupRoleMap.get(userGroupId);
    }
    public static Map<Integer, List<String>> getUserGroupRoleMap() {
        return cacheManager.userGroupRoleMap;
    }
    public static void setUserGroupRoleMap(Map<Integer, List<String>> userGroupRoleMap) {
        cacheManager.userGroupRoleMap = userGroupRoleMap;
    }

    public static List<Layer> getLayerList() {
		return cacheManager.layerList;
	}
	public static void setLayerList(List<Layer> layerList) {
		cacheManager.layerList = layerList;
	}

	public static String getBaseLayers() {
        return cacheManager.baseLayers;
    }
    public static void setBaseLayers(String baseLayers) {
        cacheManager.baseLayers = baseLayers;
    }

	public static String getMobileBaseLayers() {
		return cacheManager.mobileBaseLayers;
	}
	public static void setMobileBaseLayers(String mobileBaseLayers) {
		cacheManager.mobileBaseLayers = mobileBaseLayers;
	}
	public static List<Crane> getCraneList() {
		return cacheManager.craneList;
	}
	public static void setCraneList(List<Crane> craneList) {
		cacheManager.craneList = craneList;
	}
	public static Policy getPolicy() {
        return cacheManager.policy;
    }
    public static void setPolicy(Policy policy) {
        cacheManager.policy = policy;
    }
    public static Map<Integer, List<UserGroupMenu>> getUserGroupMenuMap() {
        return cacheManager.userGroupMenuMap;
    }
    public static List<UserGroupMenu> getUserGroupMenuList(Integer userGroupId) {
        return cacheManager.userGroupMenuMap.get(userGroupId);
    }
    public static void setUserGroupMenuMap(Map<Integer, List<UserGroupMenu>> userGroupMenuMap) {
        cacheManager.userGroupMenuMap = userGroupMenuMap;
    }
    
    public static String getLabelList() {
		return cacheManager.labelList;
	}
	public static void setLabelList(String labelList) {
		cacheManager.labelList = labelList;
	}
	
	public static List<BlockStyle> getBlockStyle() {
		return cacheManager.blockStyle;
	}
	public static void setBlockStyle(List<BlockStyle> blockStyle) {
		cacheManager.blockStyle = blockStyle;
	}
	
	public static String getQuayList() {
        return cacheManager.quayList;
    }

    public static void setQuayList(String quayList) {
        cacheManager.quayList = quayList;
    }
    public static List<BlockStyle> getBlockStatus() {
		return cacheManager.blockStatus;
	}
	public static void setBlockStatus(List<BlockStyle> blockStatus) {
		cacheManager.blockStatus = blockStatus;
	}
	public static List<String> getJibunList() {
		return cacheManager.jibunList;
	}
	public static void setJibunList(List<String> jibunList) {
		cacheManager.jibunList = jibunList;
	}
    public static List<Block> getBlockList() {
        return cacheManager.blockList;
    }
    public static void setBlockList(List<Block> blockList) {
        cacheManager.blockList = blockList;
    }
}
