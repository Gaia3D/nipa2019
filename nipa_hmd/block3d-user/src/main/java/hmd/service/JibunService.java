package hmd.service;

import java.util.List;

import hmd.domain.Jibun;

public interface JibunService {

	/**
	 * 지번 전체 목록 요청
	 * @param jibun
	 * @return
	 */
	List<String> getJibunListAll(Jibun jibun);

    /**
    * 지번 목록 요청
    * @param jibun
    * @return
    */
	List<Jibun> getJibunList(Jibun jibun);

	/**
	 * 지번 건수 요청
	 * @param jibun
	 * @return
	 */
	int getJibunListCount(Jibun jibun);

}
