package hmd.domain;

import java.util.ArrayList;

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
public class Block {
	// 사업장
	private String mfgInd;
	// 사업장2 (본사의 경우 본사/해양 두개의 사업장이 있음)
	private String subMfgInd;
	// 작업장
	private String areagrp;

	// 호선 구분
	private String sorn;
	// 호선
	private String shipNo;
	// 블록
	private String block;
	// 지번
	private String jibun;
	// 정반 (블록을 싣는 판)
	private String plateid;
	// 블록 폴리곤 좌표
	private String ctipoint;
	// 블록 공정상태
	private String stgCd;
	// 블록 지연상태
	private String delayYn;

	// 상세정보 - 일반
	private String infoNormal;
	// 상세정보 - 공정
	private String infoProgress;

	private int pageNo;
	private int pageRows;
	private int pageListCount;

	private Search search;

	// TODO: 작명필요. 셀렉트박스를 불러올 때, 한번에 불러오기위해서 사용하는 값.
	// ['shipNo', 'block', 'jibun']
	private ArrayList<String> selectboxType;


}
