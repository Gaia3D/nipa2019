package hmd.domain;

import javax.validation.constraints.Max;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 운영 정책
 * TODO 도메인 답게 나누자.
 * @author jeongdae
 *
 */
@Getter
@Setter
@ToString
public class BlockPolicy {
    public static final String Y = "Y";

    // 보안 세션 하이재킹 처리. 0 : 미사용, 1 : 사용(기본값), 2 : OTP 추가 인증
    public static final String SECURITY_SESSION_HIJACKING_NOT_USE = "0";
    public static final String SECURITY_SESSION_HIJACKING_USE = "1";
    public static final String SECURITY_SESSION_HIJACKING_OTP = "2";

	// 고유번호
    private Integer blockPolicyId;

    private String geoserverDataUrl;
    private String geoserverDataWorkspace;
    private String geoserverDataStore;

    private String layerCoordinate;
    private String layerDefaultMap;

    private String securitySessionTimeoutYn;	// 보안 세션 타임아웃. Y : 사용, N 미사용(기본값)
    private String securitySessionTimeout;	// 보안 세션 타임아웃 시간. 30분
    // 로그인 사용자 IP 체크 유무. Y : 사용, N 사용안함(기본값)
    private String securityUserIpCheckYn;
    // 사용자 IP 허용 범위. 콤마(,)로 구분
    private String securityUserIpRange;
    private String securitySessionHijacking;	// 보안 세션 하이재킹 처리. 0 : 미사용, 1 : 사용(기본값), 2 : OTP 추가 인증

    private Integer contentCacheVersion;	// css, js 갱신용 cache version.
    private String contentLayerGroupRoot;	// layer 그룹 최상위 그룹명

    private String userUploadType;	// 업로딩 가능 확장자. tif,tfw,png,pgw,jpg,jpeg,jgw 등
    @Max(2048)
    private Long userUploadMaxFilesize;	// 최대 업로딩 사이즈(단위M). 기본값 500M
    @Max(50)
    private Integer userUploadMaxCount;	// 1회, 최대 업로딩 파일 수. 기본값 50개
    
    private String insertDate;	// 등록일

    public String getViewInsertDate() {
        if(this.insertDate == null || "".equals( insertDate)) {
            return "";
        }
        return insertDate.substring(0, 19);
    }

}
