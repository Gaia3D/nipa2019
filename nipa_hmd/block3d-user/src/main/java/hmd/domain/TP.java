package hmd.domain;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author kimhj
 *
 */
@Getter
@Setter
@ToString(callSuper=true)
public class TP extends Vehicle {

    // 1 은 정상, 2 validation 오류(longitude = 0,latitude = 0), 3 api error
    private String gisStatus;

    //tp
    private String tp;
    // tp 위치정보 날짜
    private String tpDate;
    // tp 이름
    private String tpName;
    //총중량
    private Float weighttotal;
    // 사업장ID
    private String mfgInd;
    // 시작날짜
    private String sdte;
    // 종료날짜
    private String edte;
    // 작업 진행 상태 코드[A: 운반신청,W: 검증완료(확정),S: 배차완료,M: 운반중,T: 운반완료]
    private String transtatus;
    // 작업 진행 상태 코드 명
    private String transtatusName;
    // 계획/긴급구분 (계획:S, 비계획:U)
    private String su;
    // 호선/비호선 구분[S:호선, J:정반, N:비호선]
    private String sorn;
    // 호선(비호선)
    private String shipNo;
    // 블록(비호선품목) (묶음블록인 경우 ",")
    private String block;
    // 품목코드
    private String plateid;
    // 현위치
    private String curjbn;
    // 신청 이동위치 (FINISH_JIBUN)
    private String reqjbn;
    // 하차(이동) 위치
    private String movjbn;
    // 조정 순번
    private Integer jobNo;
    // 중량
    private Integer wgt;
    // 위치 보정 경도
    private BigDecimal correctLat;
    // 위치 보정 위도
    private BigDecimal correctLon;

    private String searchStartDate;

    private String searchEndDate;

    private Integer moveTime;

}
