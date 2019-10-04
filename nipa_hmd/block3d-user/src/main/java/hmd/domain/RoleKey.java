package hmd.domain;

public enum RoleKey {
	// 사용자 사이트 로그인 권한
	USER_LOGIN,
	// 블록/지번 조회 권한
	USER_BLOCK_READ,
	// T/P 관제 권한
	USER_TP_ALL,
	// 172 차량 관제 권한
	USER_172_ALL,
	// 자재배송 추적 권한
	USER_DELIVERY_ALL,
	// 시설물 관리 조회 권한
	USER_FACILITY_READ,
	// 레이어 조회 권한
	USER_LAYER_READ,
	// 개인별 GIS 설정 권한
	USER_POLICY_ALL
}
