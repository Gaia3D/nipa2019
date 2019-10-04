package hmd.domain;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 레이어
 * @author Cheon JeongDae
 *
 */
@Getter
@Setter
@ToString
public class Layer implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -4668268071028609827L;
	
	private String open = "open";
	private String nodeType = "folder";
	private String updateType;
	private String writeMode;
	
	private Integer layerId;
	// layer 키(확장용)
	private String layerKey;
	// layer 명
	private String layerName;
	// 레이어 표시 타입. wms(기본), wfs, canvas
    private String viewType;
	// layer 스타일. 임시(현재는 색깔만 넣고, 추후 확장 예정)
	private String layerStyle;
	// geometry type
	private String geometryType;
	// ui control 용
	private String ancestor;
	private Integer parent;
	private String parentName;
	private Integer depth;
	private Integer viewOrder;
	// 레이어 표시 우선 순위
	private Integer zIndex;
	
	// shape 파일 등록 가능 유무
	private String shapeInsertYn;
	private String viewShapeInsertYn;
	private String useYn;
	private String viewUseYn;
	
	// 기본 레이어
	private String defaultYn;
	// 블럭 기본 레이어 적용 유무. Y : 사용, N : 미사용
	private String blockDefaultYn;
	// 시설물 기본 레이어 적용 유무. Y : 사용, N : 미사용
	private String facilityDefaultYn;
	// 레이블 표시 유무. Y : 표시, N : 비표시(기본값)
	private String labelDisplayYn;
	// 모바일 기본 레이어 적용 유무. Y : 사용, N : 미사용
	private String mobileDefaultYn;
	
	// 정보 입력 상태. 0: 계층구조만 등록, 1: layer 정보 입력 완료
	private String status;
	
	// 좌표계
	private String coordinate;
	private String description;
	// 담당 부서
	private String managementDept;
	// 담당자 아이디
	private String managementUserId;
	// 담당자(부) 아이디
	private String managementSubUserId;
	// 업로딩 아이디
	private String userId;
	@JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
	private Date updateDate;
	@JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
	private Date insertDate;
}
