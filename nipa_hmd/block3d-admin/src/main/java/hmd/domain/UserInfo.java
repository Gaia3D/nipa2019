package hmd.domain;

import java.io.Serializable;
import java.util.Date;

import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonFormat;

import hmd.util.FormatUtil;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserInfo implements Serializable {

	private static final long serialVersionUID = 8349597082356588759L;
	
	private Search search;
	
	// 고유번호(사번)
	@NotBlank(message="아이디는 필수 입력 값 입니다.")
	private String userId;
	@NotBlank(message="비밀번호는 필수 입력 값 입니다.")
	private String password;
	// 사용자 그룹 고유번호
	private Integer userGroupId;
	private String userGroupName;
	// 이름
	private String userName;
	// 부서번호
	private String deptNo;
	// 부서명
	private String deptName;
	// 직급
	private String position;
	// 사용자 상태. 0:사용중, 1:사용중지(관리자), 2:잠금(비밀번호 실패횟수 초과), 3:휴면(로그인 기간), 4:만료(사용기간 종료), 5:삭제(화면 비표시, policy.user_delete_type=0), 6:임시비밀번호
	private String status;
	// 현재 사용자 상태값
	private String dbStatus;
	// 로그인 횟수
	private Integer loginCount;
	// 로그인 실패 횟수
	private Integer failLoginCount;
	// 마지막 로그인 날짜
	@JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
	private Date lastLoginDate;
	// 수정일
	@JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
	private Date updateDate;
	// 등록일
	@JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
	private Date insertDate;
	
	public String getViewLastLoginDate() {
		if(getLastLoginDate() == null) {
			return "";
		}
		
		String tempDate = FormatUtil.getViewDateyyyyMMddHHmmss(getLastLoginDate());
		return tempDate.substring(0, 19);
	}
	
	public String getViewInsertDate() {
		if(getInsertDate() == null) {
			return "";
		}
		
		String tempDate = FormatUtil.getViewDateyyyyMMddHHmmss(getInsertDate());
		return tempDate.substring(0, 19);
	}
}
