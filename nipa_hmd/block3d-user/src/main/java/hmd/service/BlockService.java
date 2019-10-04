package hmd.service;

import java.util.List;

import hmd.domain.Block;
import hmd.domain.BlockStyle;

/**
 * @author kimhj
 * 블록 정보를 검색 및 조회하는 기능입니다.
 */
public interface BlockService {
    /** 호선 셀렉트박스 조회 **/
    List<Block> selectboxShipNo(Block block);

    /** 블록 셀렉트박스 조회  **/
    List<Block> selectboxBlock(Block block);

    /** 지번 셀렉트박스 조회  **/
    List<Block> selectboxJibun(Block block);

    /** 블록 목록 전체 조회  **/
    List<Block> getBlockListAll(Block block);

    /** 블록 목록 조회  **/
    List<Block> getBlockList(Block block);

    /** 블록 건수 조회  **/
    int getBlockListCount(Block block);

    /** 블록 상세 정보  **/
    List<Block> detailBlock(Block block);

    /** 블록 스타일  **/
	List<BlockStyle> getBlockStyle();

	/** 블록 색상  **/
	List<BlockStyle> getBlockStatus();
}
