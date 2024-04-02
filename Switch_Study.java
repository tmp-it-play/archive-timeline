package sec06;

public class Switch_Study {

	public static void old_switch(String[] agrs) {
		old_whoIsIt("호랑이");
		old_whoIsIt("참새");
		old_whoIsIt("고등어");
		old_whoIsIt("곰팡이");
	}

	static void old_whoIsIt(String bio) {
		String kind = "";
		switch (bio) {
		case "호랑이":
		case "사자":
			kind = "포유류";
			break;
		case "독수리":
		case "참새":
			kind = "조류";
			break;
		case "고등어":
		case "연어":
			kind = "어류";
			break;
		default:
			System.out.print("어이쿠! ");
			kind = "...";
		}
		System.out.printf("%s는 %s이다.\n", bio, kind);
	}

	public static void new_switch(String[] agrs) {
		whoIsIt("호랑이");
		whoIsIt("참새");
		whoIsIt("고등어");
		whoIsIt("곰팡이");
	}

	static void whoIsIt(String bio) {
		String kind = "...";
		switch (bio) {
		case "호랑이", "사자" -> kind = "포유류";
		case "독수리", "참새" -> kind = "조류";
		case "고등어", "연어" -> kind = "어류";
		default -> System.out.printf("어이쿠! ");
		}
		System.out.printf("%s는 %s이다.\n", bio, kind);
	}
}
