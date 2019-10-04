package hmd.persistence.postgresql;

import org.springframework.stereotype.Repository;

import hmd.domain.BlockPolicy;

@Repository
public interface BlockPolicyMapper {

    /**
    * 운영 정책 조회
    *
    * @return
    */
	BlockPolicy getBlockPolicy();
}
