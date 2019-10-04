package hmd.service;

import java.util.List;

import hmd.domain.Crane;
import hmd.domain.CraneJip;
import hmd.domain.CraneTower;

public interface CraneService {

	/**
	 * 집크레인 조회
	 */
	List<CraneJip> getCraneJip();
	
	/**
	 * 타워크레인 조회
	 */
	List<CraneTower> getCraneTower();
	
	/**
	 * 타워크레인 조회
	 */
	List<Crane> getCrane();

}
