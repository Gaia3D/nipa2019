package hmd.security;

import org.junit.Test;

public class CryptTest {

	@Test
	public void test() {
//		System.out.println(Crypt.encrypt("jdbc:mariadb://localhost/transport"));
//		System.out.println("user : " + Crypt.encrypt("test"));
//		System.out.println("password : " + Crypt.encrypt("test"));
//		
//		System.out.println(Crypt.decrypt("VisSFDP+8GqC9Pdnr6q5fQ=="));
//		
//		System.out.println("gis : " + Crypt.encrypt("jdbc:postgresql://localhost:5432/gis"));
		
		System.out.println("pg url: " + Crypt.decrypt("97eacKjoIvE+wzk5L0/3BPOufQ1LiDZl84Rzt18QCpCwZmd4bAhwRP85t7VHmnIC"));
		System.out.println("pg user: " + Crypt.decrypt("cvH67DYjqA/huOOBPPPYtg=="));
		System.out.println("pg pw: " + Crypt.decrypt("cvH67DYjqA/huOOBPPPYtg=="));
		
		// Mocf058K2sOHdq7iY09RWM2h7mAZ4ifViFFoRfKu0mzIwT142HIagh1tbI//dKf96FczLbQRjFbcB/vUeO0B6A==
		
		//System.out.println(Crypt.encrypt("jdbc:oracle:thin:@dj.gaia3d.com:15210:gaia3d11g"));
		
		System.out.println("oracle url: " + Crypt.decrypt("Mocf058K2sOHdq7iY09RWM2h7mAZ4ifViFFoRfKu0mzIwT142HIagh1tbI//dKf96FczLbQRjFbcB/vUeO0B6A=="));
		System.out.println("oracle user: " + Crypt.decrypt("UU+maA6GZHDSLn2jz5i+fA=="));
		System.out.println("oracle pw: " + Crypt.decrypt("UU+maA6GZHDSLn2jz5i+fA=="));
		System.out.println("gis : " + Crypt.encrypt("jdbc:postgresql://localhost:5432/gis"));
		
		
		System.out.println(Crypt.decrypt("97eacKjoIvE+wzk5L0/3BPOufQ1LiDZl84Rzt18QCpAB8qdsGuFkvoQRLQ+MTwcj"));
		System.out.println(Crypt.decrypt("97eacKjoIvE+wzk5L0/3BPOufQ1LiDZl84Rzt18QCpCwZmd4bAhwRP85t7VHmnIC"));
		
	}
}
