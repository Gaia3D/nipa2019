package hmd.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Crane {
	private int craneId;
	private String division;
	private String deptName;
	private String type;
	private String place;
	private float height;
	private float length;
	private float weight;
	private String purchaseYear;
	private int purchaseAmount;
	private String maker;
	private String craneType;
}
