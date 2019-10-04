package hmd.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hmd.domain.BlockPolicy;
import hmd.persistence.postgresql.BlockPolicyMapper;
import hmd.service.BlockPolicyService;

@Service
public class BlockPolicyServiceImpl implements BlockPolicyService {

    @Autowired
    private BlockPolicyMapper blockPolicyMapper;

    /**
    * 운영 정책 조회
    * @return
    */
    @Transactional(readOnly=true)
    public BlockPolicy getBlockPolicy() {
        return blockPolicyMapper.getBlockPolicy();
    }
}
