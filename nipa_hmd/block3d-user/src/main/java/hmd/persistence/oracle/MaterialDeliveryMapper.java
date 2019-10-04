package hmd.persistence.oracle;

import java.util.List;

import org.springframework.stereotype.Repository;

import hmd.domain.MaterialDelivery;

/**
 * 자재 배송 조회
 * @author PSH
 *
 */
@Repository
public interface MaterialDeliveryMapper {

    /**
    * 호선 번호 조회
    *
    * @param transDate
    * @return
    */
    public List<MaterialDelivery> getListShipNo(String transDate);

    /**
    * por번호 조회
    *
    * @param material
    * @return
    */
    public List<MaterialDelivery> getListPorNo(MaterialDelivery material);

    /**
    * 신청부서 조회
    *
    * @param transDate
    * @return
    */
    public List<MaterialDelivery> getListApplyDepartMent(String transDate);

    /**
    * 신청 팀 조회
    *
    * @param material
    * @return
    */
    public List<MaterialDelivery> getListApplyTeam(MaterialDelivery material);

    /**
    * 자재배송 리스트 조회(por)
    *
    * @param material
    * @return
    */
    public List<MaterialDelivery> getListMaterialDeliveryByPor(MaterialDelivery material);

    /**
     * 자재배송 카운트(por)
     * @param material
     * @return
     */
    public int getListMaterialDeliveryByPorCount(MaterialDelivery material);

    /**
     * 자재배송 리스트 조회(신청팀)
     *
     * @param material
     * @return
     */
     public List<MaterialDelivery> getListMaterialDeliveryByApplyTeam(MaterialDelivery material);

     /**
      * 자재배송 카운트(신청팀)
      * @param material
      * @return
      */
     public int getListMaterialDeliveryByApplyTeamCount(MaterialDelivery material);

    /**
    * 자재배송 속성정보 조회
    *
    * @param trnsId
    * @return
    */
    public List<MaterialDelivery> getMaterialDeliveryInfoById(MaterialDelivery material);
}
