$(document).ready(function (){
    // 레이어 목록 가져오기
    $('#simulationMenu').on('click', function() {
    	initSimulMenu();
    });
    
    $('#simulationContent .btnGroup button').click(function() {
    	if(!$(this).hasClass('textBtn')) {
    		$(this).siblings().removeClass('textBtn').addClass('textBtnSub');
    		$(this).addClass('textBtn').removeClass('textBtnSub');
    		initSimulMenu();
    	}
    });

    // 하위 영역 on/off
    $('#simulationContent').on('click', '.rootLayer p', function(e) {
    	e.stopPropagation();
    	var $target = $(this).parent('li');
    	$target.toggleClass('on');
    });
    
    // 그룹 on/off
    $('#simulationContent').on('click', '.rootLayer p span.toggle', function(e) {
    	e.stopPropagation();
    	var visible = !$(this).hasClass('on');
    	$(this).toggleClass('on');
    	var $parentLi = $(this).parent().parent();
    	
    	if($parentLi.hasClass('rootLayer')) {
    		var $toggleSpans = $parentLi.find('ul p span.toggle');
    		$toggleSpans.each(function(){
    			if(!visible) $(this).removeClass('on');
        		else $(this).addClass('on');
    		});
    	}
    	
    	$parentLi.find('ul li.nodepth').each(function() {
    		if(!visible) $(this).removeClass('on');
    		else $(this).addClass('on');
    		
    		var seq = $(this).find('p').data('seq');
    		var isVisible = visible;
        	
        	HMD.crane.setVisible(seq, isVisible);
    	});
    });
    
    //crane on/off
    $('#simulationContent').on('click', '.craneLayer p', function(e) {
    	e.stopPropagation();
    	var $parentLi = $(this).parent('li');
    	var seq = $(this).data('seq');
    	var isVisible = $parentLi.hasClass('on') 
    	
    	HMD.crane.setVisible(seq, isVisible);
    });
    
    //jib crane range mode 변경
    $('#simulationContent').on('change', '.craneLayer input[type="radio"]', function(e) {
    	e.stopPropagation();
    	var seq = $(this).parents('div:first').siblings('p').data('seq');
    	var val = $(this).val();
    	
    	HMD.crane.setRangeMode(seq, val);
    });
    
    //crane 위치로 이동 및 선택
    $('#simulationContent').on('click', '.craneLayer button', function(e) {
    	e.stopPropagation();
    	var seq = $(this).parents('div:first').siblings('p').data('seq');
    	HMD.crane.goto(seq);
    });
    
    //크레인 팝업 이동 버튼 토글
    $('#cranePop').on('click', '#cranePopPositionMove', function(e){
    	e.stopPropagation();
    	var seq = $(this).data('seq');
    	var isMovable = $(this).hasClass('on');
    	
    	HMD.crane.setMovable(seq, !isMovable);
    	
    	if(isMovable) {
    		$(this).text('이동');
    	} else {
    		$(this).text('정지');
    	}
    	$(this).toggleClass('on');
    });
    //크레인 팝업 위치 초기화.
    $('#cranePop').on('click', '#cranePopPositionInit', function(e){
    	e.stopPropagation();
    	var seq = $(this).data('seq');
    	HMD.crane.initPosition(seq);
    });
    
    $('#cranePop').on('click','#cranePopCloseButton', function(e){
    	e.stopPropagation();
    	var seq = $(this).data('seq');
    	HMD.crane.eventEnd(seq);
    });
    
    $('.blockRoateList button').click(function(){
    	var type = $(this).data('type');
    	HMD.paintInterfare.rotateBlock(type);
    });
    function initSimulMenu(){
    	hideContentUl();
    	var selectedType = $('#simulationContent .btnGroup .textBtn').data('type');
    	switch(selectedType) {
    		case 'crane' : {
    			HMD.crane.createTreeHtml();
    			break;
    		}
    		case 'paint' : {
    			HMD.paintInterfare.startPaintInterfare();
    			break;
    		}
    		case 'block' : {
    			$('.blockLoadList').show();
    			break;
    		}
    	}
    }
    function hideContentUl() {
    	$('#simulationContent > ul').each(function(){
    		$(this).hide();
    	});
    }
});