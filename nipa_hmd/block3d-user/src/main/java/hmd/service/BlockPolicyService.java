package hmd.service;

import hmd.domain.BlockPolicy;

public interface BlockPolicyService {

	/**
    * 운영 정책 조회
    *
    * @return
    */
	BlockPolicy getBlockPolicy();
}
