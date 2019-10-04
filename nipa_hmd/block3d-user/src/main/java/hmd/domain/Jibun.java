package hmd.domain;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Jibun {

//	private String id;
//	private String mfgInd;
//	private int count;

    // 전체 건수
    private Integer totalCount;
    // 페이지 번호
    private Integer pageNo;
    // 한 페이지에 표시할 건수, 목록 페이지에서는 기본 10건
    private Integer pageRows = 10;
    // 한 페이지에 표시할 목록 건수, pageNo의 목록을 몇개까지 표시할건지 기본 10
    private Integer pageListCount = 10;
    // 페이지 처리를 위한 시작
    private Long offset;
    // 페이지별 표시할 건수
    private Long limit;

    private String orderWord;
    private String orderValue;


    // 고유키
    private Integer ogcFid;

    // 활성화 된 데이터
    private String enableYn;

    private String level0;

    // foregin key 로 사용하기 위해 추가한 고유값
    private String id;
    private String name;

    // geometry 를 text 변환할 때 사용할 좌표계
    private Integer epsg;

    private BigDecimal width;
    private BigDecimal length;
    private BigDecimal height;
    private BigDecimal floor;
    private BigDecimal areaBuild;
    private BigDecimal areaTotal;

    private String workplace;
    private String floors;

    private String wkbGeometry;
    // text 로 변환한 geometry
    private String textWkbGeometry;

    // 갱신일
    private String update;

}
