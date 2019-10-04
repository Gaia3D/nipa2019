// 세자리 콤마
function addComma(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 정규식: 부호와 소수점을 포함한 숫자
function regexOnlyNumber() {
	return /^[+-]?\d*(\.?\d*)$/;
}

//val이 defined고 숫자가 아닐경우 false
function checkInterfareNumberOrUndefined(val) {
	var numberRegex = regexOnlyNumber();
	return val && !numberRegex.test(val); 
}
// 정규식: 부호를 포함한 경위도 범위
function regexLonLat() {
	return /^[-+]?(360?|[0-9]|([1-9][0-9])|([1-2][0-9]?\d)|(3[0-5]?\d))$/;
}

// ajax 오류 공통 처리
function ajaxErrorHandler(request) {
	alert(request.responseJSON.error.message);
	// 세션이 없는 경우 로그인 페이지로 이동
    if(request.responseJSON.statusCode !== undefined && request.responseJSON.statusCode === 401) {
    	window.location.href = "/login/login";
    	return;
    }
}

// 현대 미포조선 내 사업장인지 확인
function isWithInWorkplace() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			console.log(position.coords.latitude + ' ' + position.coords.longitude);
			$.ajax({
				context: this,
				url: "/mobile/boundary-area?longitude=" + position.coords.longitude + "&latitude=" + position.coords.latitude,
				type: 'GET',
				headers: {'X-Requested-With': 'XMLHttpRequest'},
			    dataType: 'json',
				success: function(res) {
					console.log("============== res: " + res);
					if(res == false) {
						console.log("현재 사업장 영역 내에 있지 않아 모바일 서비스를 이용할 수 없습니다.");
						goLoginPage("현재 사업장 영역 내에 있지 않아 모바일 서비스를 이용할 수 없습니다.");
						return false;
					} else {
						return true;
					}
				},
		        error: function(request, status, error) {
		        	return true;
		        	// alert message, 세션이 없는 경우 로그인 페이지로 이동 - common.js
		        	//ajaxErrorHandler(request);
		        }
			});
			
		}, function(error) {
 			console.log("GPS 위치를 얻는데 실패하였습니다. \n GPS 위치를 확인 할 수 없어 모바일 서비스를 이용할 수 없습니다.");
 			goLoginPage("GPS 위치를 얻는데 실패하였습니다. \n GPS 위치를 확인 할 수 없어 모바일 서비스를 이용할 수 없습니다.");
			console.error(error);
			return false;
		}, {
			enableHighAccuracy: false,
			maximumAge: 0,
			timeout: Infinity
		});
	} else {
		console.log("GPS 위치를 확인 할 수 없어 모바일 서비스를 이용할 수 없습니다.");
		goLoginPage("GPS 위치를 확인 할 수 없어 모바일 서비스를 이용할 수 없습니다.");
		return false;
	}
	
	function goLoginPage(msg) {
		alert(msg);
		location.href = "/login/login";
		return;
	}
}