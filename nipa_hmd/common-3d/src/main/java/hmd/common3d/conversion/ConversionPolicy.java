package hmd.common3d.conversion;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ConversionPolicy {
	private Integer conversionPolicyId;
	private String conversionInputRepository;
	private String conversionOutputRepository;
	private String conversionSchedule;
}
