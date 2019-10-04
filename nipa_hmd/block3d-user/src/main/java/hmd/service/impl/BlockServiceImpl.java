package hmd.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hmd.domain.Block;
import hmd.domain.BlockStyle;
import hmd.persistence.oracle.BlockMapper;
import hmd.service.BlockService;

/**
 * @author kimhj
 * 블록 정보를 검색 및 조회하는 기능입니다.
 */
@Service
public class BlockServiceImpl implements BlockService {

    @Autowired
    private BlockMapper blockMapper;

    //@Autowired
    //private BlockPgMapper blockPgMapper;

    /** 호선 셀렉트박스 조회  **/
    @Transactional(value="oracleTransactionManager", readOnly=true)
    public List<Block> selectboxShipNo(Block block) {
        return blockMapper.selectboxShipNo(block);
    }

    /** 블록 셀렉트박스 조회  **/
    @Transactional(value="oracleTransactionManager", readOnly=true)
    public List<Block> selectboxBlock(Block block) {
        return blockMapper.selectboxBlock(block);
    }

    /** 지번 셀렉트박스 조회  **/
    @Transactional(value="oracleTransactionManager", readOnly=true)
    public List<Block> selectboxJibun(Block block) {
        return blockMapper.selectboxJibun(block);
    }

    /** 블록 목록 전체 조회  **/
    @Transactional(value="oracleTransactionManager", readOnly=true)
    public List<Block> getBlockListAll(Block block) {
        return blockMapper.getBlockListAll(block);
    }

    /** 블록 목록 조회  **/
    @Transactional(value="oracleTransactionManager", readOnly=true)
    public List<Block> getBlockList(Block block) {
    	return blockMapper.getBlockList(block);
    }

    /** 블록 건수 조회  **/
    @Transactional(value="oracleTransactionManager", readOnly=true)
    public int getBlockListCount(Block block) {
    	return blockMapper.getBlockListCount(block);
    }

    /** 블록 상세 정보  **/
    @Transactional(value="oracleTransactionManager", readOnly=true)
    public List<Block> detailBlock(Block block) {
        return blockMapper.detailBlock(block);
    }

    /** 블록 스타일  **/
    @Transactional(value="oracleTransactionManager", readOnly=true)
    public List<BlockStyle> getBlockStyle() {
    	return blockMapper.getBlockStyle();
    }

    /** 블록 색상  **/
    @Transactional(value="oracleTransactionManager", readOnly=true)
    public List<BlockStyle> getBlockStatus() {
    	return blockMapper.getBlockStatus();
    }
}
