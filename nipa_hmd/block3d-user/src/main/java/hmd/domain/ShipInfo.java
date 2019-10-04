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
public class ShipInfo {

	private List<Ship> ship;
	private List<Float> pixelBound;
	private String mfgInd;
	private String areagrp;
}
