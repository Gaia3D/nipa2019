package hmd.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CraneTower extends Crane {
	private String footType;
	private float maxLoadLength;
	private int maxLoadWeight;
	private float maxRadiusLength;
	private int maxRadiusWeight;
	private String driveMethod;
}
