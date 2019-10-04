/**
 * <pre>
 * 이슈조회 및 등록 기능
 * </pre>
 */
$(function() {
	// 초기화
	
	// 레이아웃 설정
	$(window).resize(function() {
		// 브라우저 사이즈가 변경될 때 마다 호출됨
	}).resize();
	
	// 데이터 설정
	
	// 이벤트 핸들러 등록
	
	// ***************************************** //
	// 조회 탭
	// ***************************************** //
	// 이슈 검색 버튼 클릭
	$('#issueSearchButton').on('click', handlerIssueSearch);
});

/**
 * 이슈 검색
 * @returns
 */
function handlerIssueSearch() {
	alert(1);
}
