package hmd.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Search {

	// 총건수
	private Long totalCount;

	// 페이지 처리를 위한 시작
	private Long offset;
	// 페이지별 표시할 건수
	private Long limit;

	/********** 검색 조건 ************/
	private String searchWord;
	// 검색 옵션. 0 : 일치, 1 : 포함
	private String searchOption;
	private String searchValue;
	private String startDate;
	private String endDate;
	private String orderWord;
	private String orderValue;
	private Long listCounter = 10l;

}
