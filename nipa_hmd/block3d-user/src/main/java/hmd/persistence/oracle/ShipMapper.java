package hmd.persistence.oracle;

import java.util.List;

import org.springframework.stereotype.Repository;

import hmd.domain.Ship;
import hmd.domain.ShipInfo;

/**
 * @author kimhj
 * 호선 정보 조회
 */
@Repository
public interface ShipMapper {

	List<Ship> getDockList(ShipInfo param);

	List<Ship> getQuayList(ShipInfo param);

}
