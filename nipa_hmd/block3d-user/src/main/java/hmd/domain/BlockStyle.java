package hmd.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BlockStyle {

	// 사업장
	private String mfgInd;
	// 블록 배경 색 - C601
	private String bgColor;
	// 블록 배경 색 - C699 ----------------> 미포 소스 내에 하드코딩 되어있음, 블록의 호선을 제외한 정반, 비호선의 색상
	private String bgColorEtc;
	// 블록 선 색상 - C602
	private String borderColor;
	// 블록 선 두께 - C603
	private String borderWidth;
	// 폰트 색깔 - C606
	private String fontColor;
	// 폰트 정의 - C607
	private String fontFamily;
	// 폰트 크기 - C608
	private String fontSize;
	// 폰트 두께 - C609
	private String fontWeight;

	// 공정단계
	private String stageText;
	// 색상 코드
	private String stageCode;

}
