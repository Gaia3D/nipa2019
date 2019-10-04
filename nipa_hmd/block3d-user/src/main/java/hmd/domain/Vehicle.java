package hmd.domain;

import java.math.BigDecimal;

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
public class Vehicle {

    // 경도
    private BigDecimal lat;
    // 위도
    private BigDecimal lon;
    // 전체 카운트
    private Integer totalCount;

    private Integer countCarry;

    private Integer countWait;

    private Integer countStop;

    private Integer rowNumber;

}
