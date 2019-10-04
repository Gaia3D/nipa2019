package hmd.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 자재 배송
 * @author PSH
 *
 */
@Getter
@Setter
@ToString
public class MaterialDelivery {

    //호선
    private String shipNo;
    //por번호
    private String porNo;
    //신청부서
    private String deptNm;
    //신청부서 코드
    private String deptCd;
    //신청팀
    private String respNm;
    //신청팀코드
    private String sosog;
    //배송번호
    private String trnsNo;
    //배송일시
    private String transDt;
    //배송상태
    private String trnsStatus;
    //배송요청일
    private String trnsReqDt;
    //배송요청장소
    private String trnsReqLoc;
    //배송위치 (TODO:물류지번 restapi 필요)
    private String trnsLoc;
    //블록
    private String block;
    //품명 및 사양
    private String matlSpec;
    //단위
    private String matlUnit;
    //배송요쳥수량
    private String trnsReqQty;
    //요청년월
    private String trnsReqYymm;
    //요천번호
    private String trnsReqSerNo;
    //경도
    private String lat;
    //위도
    private String lng;
    //검색 날짜
    private String searchDate;

    private int pageNo;
    private int pageRows;
    private int pageListCount;
}
