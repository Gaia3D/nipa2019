package hmd.persistence.postgresql;

import java.util.List;

import org.springframework.stereotype.Repository;

import hmd.domain.CraneJip;
import hmd.domain.CraneTower;

@Repository
public interface CraneMapper {

    /**
    * 집크레인 호출
    *
    * @return
    */
	List<CraneJip> getCraneJip();
	
	/**
    * 집크레인 호출
    *
    * @return
    */
	List<CraneTower> getCraneTower();
}
