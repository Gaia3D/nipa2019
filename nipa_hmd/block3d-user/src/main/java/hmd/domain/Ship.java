package hmd.domain;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author kimhj
 *
 */
@Getter
@Setter
@ToString
public class Ship {

	// common
	private String shipNo;
	private String shipsize;
	private String skDescription;
	private String owner;
	private String breadth;
	private String loa;

	// ship _ dock
	private String dock;
	private String ctipointa;
	private String siNum;
	private String batchYearSer;

	// ship _ quay
	private String quay;
	private String cont;
	private String posx;
	private String posy;
	private String fc;
	private String f1;
	private String f2;
	private String f3;
	private String f4;
	private String ac;
	private String a1;
	private String a2;
	private String a3;
	private String a4;
	private String b1;
	private String ftLength;
	private String depth;
	private String conType;
	private String seriesNo;
	private int degree;
	private String anchor;
	private float scale;

	// result
	private List<String> drawType;
	private List<String> position;
	private List<List<String>> coord;
	private String desc;
}
