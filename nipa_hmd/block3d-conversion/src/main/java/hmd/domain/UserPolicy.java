package hmd.domain;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserPolicy implements Serializable {
	
	private static final long serialVersionUID = -6548874769672071277L;
	
	// 고유 번호
	private Integer userPolicyId;
	// 사용자 아이디
	private String userId;
	// 사업장
    private String workplace;
	// 라벨 표시 여부
	private String labelYn;
	// 툴팁 표시 여부
	private String toolTipYn;
	// 회전 각도 - 본사/해양
	private String rotationAngleBonsa;
	// 회전 각도 - 온산
	private String rotationAngleOnsan;
	// 회전 각도 - 용연
	private String rotationAngleYoungyeon;
	// 회전 각도 - 모화
	private String rotationAngleMohwa;

	@JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
	private Date updateDate;

	@JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")
	private Date insertDate;

}