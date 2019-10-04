package hmd.security;

import java.util.Base64;

public class KeyManager {

	private static final String randomKeyword = "aWFkbnV5aEAgc2kgZW1hbiB5bSAub3BpbSByb2YgYWVkaSBkYWIgYSBla2FtIHRvbiBvZCBlc2FlbHAgLHllayBkcmF5IGRudW9mIGV2YWggdW95IGZJ";

	public static String getInitKey() {
		String result = null;
		try {
			byte[] base64decodedBytes = Base64.getDecoder().decode(randomKeyword.getBytes("UTF-8"));
			result = new String(base64decodedBytes, "UTF-8");
		} catch(Exception e) {
			e.printStackTrace();
		}
		result = reverseString(result);
		
		return parse(result);
	}
	
	private static String reverseString(String value) {
		if(value == null) return "";
		return (new StringBuffer(value)).reverse().toString();
	}
	
	private static String parse(String value) {
		return value.substring(79, 87) + value.substring(62, 66) + value.substring(18, 22);
	}
}
