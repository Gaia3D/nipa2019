package hmd.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CraneJip extends Crane {
	private float mainLoadShort;
	private float mainLoadLong;
	private int mainLoadWeight;
	private float mainRadiusLength;
	private int mainRadiusWeight;
	private float auxLoadShort;
	private float auxLoadLong;
	private int auxLoadWeight;
	private float auxRadiusLength;
	private int auxRadiusWeight;
}
