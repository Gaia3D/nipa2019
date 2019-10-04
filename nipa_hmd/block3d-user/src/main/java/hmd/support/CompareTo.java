package hmd.support;

import java.util.Comparator;
import java.util.Map;

public class CompareTo implements Comparator<Map<String, String>>{

	public int compare(final Map<String, String> o1, final Map<String, String> o2) {
    	Integer i1 = Integer.parseInt(o1.get("zIndex"));
    	Integer i2 = Integer.parseInt(o2.get("zIndex"));
        return i1.compareTo(i2);
    }
}
