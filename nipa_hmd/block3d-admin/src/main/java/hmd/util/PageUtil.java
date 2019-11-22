package hmd.util;

import java.util.HashMap;
import java.util.Map;

/**
 * API 요청을 위한 페이지 처리
 * @author Cheon JeongDae
 *
 */
public class PageUtil {

	public static Map<String, Object> getPagination(Integer totalCount) {
		return getPagination(totalCount, 1);
	}
	
	public static Map<String, Object> getPagination(Integer totalCount, Integer pageNo) {
		return getPagination(totalCount, pageNo, 10, 10);
	}
	
	/**
	 * @param totalCount 전체 건수
	 * @param pageNo 페이지 번호
	 * @param pageRows 한 페이지에 표시할 건수, 목록 페이지에서는 기본 10건
	 * @param pageListCount 한 페이지에 표시할 목록 건수, pageNo의 목록을 몇개까지 표시할건지 기본 10
	 * @return
	 */
	public static Map<String, Object> getPagination(Integer totalCount, Integer pageNo, Integer pageRows, Integer pageListCount) {
		
		if(pageNo == null) pageNo = 1;
		if(pageRows == null) pageRows = 10;
		if(pageListCount == null) pageListCount = 1;
		
		Map<String, Object> map = new HashMap<>();
		
		// 게시물 번호
		Integer rowNumber;
		// 처음
		Integer firstPage = 1;
		// 끝
		Integer lastPage;
		// 페이지 시작
		Integer startPage;
		// 페이지 종료
		Integer endPage;
		// 이전
		Integer prePageNo;
		// 다음
		Integer nextPageNo;
		// 이전 페이지 존재여부 Flag
		boolean existPrePage = false;
		// 다음 페이지 존재여부 Flag
		boolean existNextPage = false;
		
		// 페이지 처리를 위한 시작
		Integer offset;
		Integer pageIndex;
		
		rowNumber = totalCount - (pageNo - 1) * pageRows;
		offset = (pageNo - 1) * pageRows;
		
		lastPage = 0;
		if(totalCount != 0) {
			if(totalCount % pageRows == 0) {
				lastPage = (totalCount / pageRows);
			} else {
				lastPage = (totalCount / pageRows) + 1;
			}
		}
		
		startPage = ((pageNo - 1) / pageListCount) * pageListCount + 1;
		endPage = ((pageNo - 1) / pageListCount) * pageListCount + pageListCount;
		if(endPage > lastPage) {
			endPage = lastPage;
		}
		
		Integer remainder = 0;
		prePageNo = 0;
		if(pageNo > pageListCount) {
			// TODO 이전을 눌렀을때 현재 페이지 - 10 이 아닌 항상 1, 11, 21... 형태로 표시하고 싶을때
			remainder = pageNo % pageListCount;
			prePageNo = pageNo - pageListCount - remainder + 1;
			// TODO 이전을 눌렀을때 현재 페이지 - 10 형태로 표시하고 싶을경우 3, 13, 23 ...
//			prePageNo = pageNo - pageListCount;
			existPrePage = true;
		}
		
		nextPageNo = 0;
		if(lastPage > pageListCount && pageNo <= ((lastPage / pageListCount) * pageListCount)) {
			if(lastPage >= (startPage + pageListCount)) {
				if(pageNo % pageListCount == 0) {
					// TODO 다음을 눌렀을때 현재 페이지 + 10 이 아닌 항상 11, 21, 31... 형태로 표시하고 싶을때
					nextPageNo = pageNo + 1;
				} else {
					// TODO 다음을 눌렀을때 현재 페이지 + 10 이 아닌 항상 11, 21, 31... 형태로 표시하고 싶을때
					if(lastPage >= pageNo + pageListCount) {
						remainder = pageNo % pageListCount;
						nextPageNo = pageNo + pageListCount - remainder + 1;
						// TODO 다음을 눌렀을때 현재 페이지 + 10 형태로 표시하고 싶을경우 13, 23, 33 ...
	//					nextPageNo = pageNo + pageListCount;
					} else {
						remainder = lastPage % pageListCount;
						nextPageNo = lastPage - remainder + 1;
						// TODO 다음을 눌렀을때 현재 페이지 + 10 형태로 표시하고 싶을경우 13, 23, 33 ...
	//					nextPageNo = lastPage;
					}
				}
				existNextPage = true;
			}
		}
		
		if(totalCount == 0) {
			pageNo = 0;
		}
		
		map.put("offset", offset);
		map.put("limit", pageRows);
		
		return map;
	}
}
