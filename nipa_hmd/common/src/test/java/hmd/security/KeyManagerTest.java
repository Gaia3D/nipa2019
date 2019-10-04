package hmd.security;

import java.util.Base64;

import org.junit.Test;

public class KeyManagerTest {

	@Test
	public void test() throws Exception {
		String key = KeyManager.getInitKey();
		System.out.println(key);
		
		String encryptKey = "aWFkbnV5aEAgc2kgZW1hbiB5bSAub3BpbSByb2YgYWVkaSBkYWIgYSBla2FtIHRvbiBvZCBlc2FlbHAgLHllayBkcmF5IGRudW9mIGV2YWggdW95IGZJ";
		byte[] base64decodedBytes = Base64.getDecoder().decode(encryptKey.getBytes("UTF-8"));
		String result = new String(base64decodedBytes, "UTF-8");
		result = (new StringBuffer(result)).reverse().toString();
		System.out.println("1 ===== " + result);
		result = result.substring(79, 87) + result.substring(62, 66) + result.substring(18, 22);
		System.out.println("2 ===== " + result);
	}

	@Test
	public void keyEncript() throws Exception {
		String key = "If you have found yard key, please do not make a bad idea for mipo. my name is @hyundai";
		System.out.println("key = " + key);
		String reverseKey =  new StringBuffer(key).reverse().toString();
		System.out.println("reverseKey = " + reverseKey);
		String encryptKey = new String(Base64.getEncoder().encode(reverseKey.getBytes("UTF-8")));
		System.out.println("encryptKey = " + encryptKey);
	}
}
