package hmd.support;

public class URLSupport {

    public static final String LOGIN_URL = "/login/login";

    // login 의 경우 통과
    public static final String[] EXCEPTION_URI = { "error", "login", "login-process", "boundary-area"};
    public static final String[] USER_STATUS_EXCEPTION_URI = { "/login/login", "/login/process-login", "/login/mobile-login", "/mobile/process-login"};
    // 로그 예외 URL, 사용이력, 이중화, 메인 위젯(main, ajax, widget 이건 너무 많아서 키워드로 Filter)
    public static final String[] LOG_EXCEPTION_URI = { "error", "access-log-list" };

    // 파일 업로딩 URL
    public static final String[] MULTIPART_REQUEST_URI = { "/layers/" };

//	public static final Pattern STATIC_RESOURCES = Pattern.compile("(^/js/.*)|(^/css/.*)|(^/images/.*)|(^/externlib/.*)|(/favicon.ico)");
}
