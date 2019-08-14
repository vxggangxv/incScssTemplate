$(function() {

	// input autocomplete off
	$('input').attr('autocomplete','off');
	$('input[readonly]').css('background', '#efefef');
	popClsFn();
	datePick();
	ascending();
    tabFn();
    dropMenu();
	quickMenuPop();

	// 클래스 기능 구현
	var groupDraggable = new GroupDraggable('.fn-draggable .cell:not(.no-drag)', '.fn-droppable');

});

// 팝업 기능 등록
var popFn = {
	show: function(obj_name) {
		$(obj_name).show();
	},
	show_flag: function(obj_name, obj_this, flag) {
        if (flag == false) {
            $(obj_this).closest(".pop-container").children(".bg-back").hide();
        }
		$(obj_name).show();
    },
    close_flag: function(obj_name, obj_this, flag) {
        if (flag == true) {
            $(obj_name).closest(".pop-container").children(".bg-back").show();
        }
        $(obj_name).show();
		$(obj_this).closest(".pop-container").hide();
	}
}


var page = {
	layer: function(a, b, c) {
		//if(a == 'pkg') {
		//	var c = $(c.closest("tr")).index();
		//}

		chk = $('.pop-container').length;

		if(chk < 1) {
			$.ajax({		
				type: 'post',
				url: '/_new/views/layer/',
				data: 'a=' + a + '&b=' + b + '&c=' + c,
				success: function(e) {
					$('#layer').html(e);
				}
			});
		} else {
			page.layer2(a, b, c);
		}	
	},

	layer2: function(a, b, c) {
		$.ajax({		
			type: 'post',
			url: '/_new/views/layer/',
			data: 'a=' + a + '&b=' + b + '&c=' + c,
			success: function(e) {
				$('#layer2').html(e);
			}
		});
	},
	
	close: function() {
		chk = $('.pop-container').length;

		if(chk > 1) {
			$('.pop-container').eq(1).remove();
		} else {
			$('.pop-container').eq(0).remove();
		}		
	},

	excel: function(a) {
		var path = '/_new/views/excel/export.php';

		$.ajax({		
			type: 'post',
			url: '/_new/views/excel/',
			data: $('#' + a).serialize(),
			success: function(e) {
				console.log(e);
				$('#excel_download').attr('src', path + e);
			}
		});	
	},

	favorites: function(a, b, c) {
		$.ajax({		
			type: 'post',
			url: '/_new/views/',
			data: 'mode=favorites&a=' + a + '&b=' + b + '&c=' + c,
			success: function(r) {
				location.reload();
			}
		});
	},
	
	move: function(e) {
		$.ajax({		
			type: 'post',
			url: '/inc/state.php',
			data: 'mode=login&log=move&a=' + e,
			success: function(r) {
				location.reload();
			}
		});
	}
}




// 팝업 닫기 기능
function popClsFn() {
	var containerName = ".pop-container, .dialog-container",
		popContainer = $(containerName),
        btn_cls = popContainer.find(".fn-cls");
        
    btn_cls.on("click", function() {
        if ($(this).closest(containerName).hasClass('pop-container')) {
            $(this).closest(containerName).hide();
        }
        if ($(this).closest(containerName).hasClass('dialog-container')) {
            if ($(this).closest(containerName).children('.dialog-wrapper').length < 2) {
                $(this).closest(containerName).hide();
            }
            $(this).closest('.dialog-wrapper').remove();
        }
    });
	
	popContainer.find(".bg-back").on("click", function() {
		$(this).closest(containerName).hide();
	});
}

// 달력 ui
function datePick() {
    $.datepicker.setDefaults({
        dateFormat: 'yy-mm-dd',
        prevText: '이전 달',
        nextText: '다음 달',
        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        showMonthAfterYear: true,
        yearSuffix: '년'
    });
	$( "input.date-ui" ).datepicker({
		dateFormat: 'yy-mm-dd'
    });	



    $('#sdate').datepicker({
		minDate: 0,
		onSelect: function() {
			$.ajax({
				type: 'post',
				url: '/_new/views/',
				data: 'mode=rsv-date&sdate=' + this.value + '&edate=' + $('#edate').val()+ '&room=' + $('#room').val(),
				success: function(r) {
					var data = r.split('|');

					r_rate1 = data[1];
					r_rate2 = removeCommas($('#r-rate2').val());
					r_rate3 = removeCommas($('#r-rate3').val());

					total	= addCommas(parseInt(r_rate1) + parseInt(r_rate2) + parseInt(r_rate3));

					$('#r-rate1').val(addCommas(r_rate1));
					$('#rate').val(total);

					rsv.convert(total, 'convert');
					
					$('input[name=nights]').val(data[0]);
					$('input[name=info-r]').val(data[2]);

					if(data[0] < 1)		$('input[name=rent]').prop('checked', true);
					else				$('input[name=rent]').prop('checked', false);
				}
			});
		},

		onClose: function(selectedDate) {
			$('#edate').datepicker('option', 'minDate', selectedDate);
		}
	});

	$('#edate').datepicker({
		minDate: 0,
		onSelect: function() {
			$.ajax({
				type: 'post',
				url: '/_new/views/',
				data: 'mode=rsv-date&sdate=' + $('#sdate').val() + '&edate=' + this.value + '&room=' + $('#room').val(),
				success: function(r) {
					var data = r.split('|');
										
					r_rate1 = data[1];
					r_rate2 = removeCommas($('#r-rate2').val());
					r_rate3 = removeCommas($('#r-rate3').val());

					total	= addCommas(parseInt(r_rate1) + parseInt(r_rate2) + parseInt(r_rate3));

					$('#r-rate1').val(addCommas(r_rate1));
					$('#rate').val(total);

					rsv.convert(total, 'convert');
				
					$('input[name=nights]').val(data[0]);
					$('input[name=info-r]').val(data[2]);

					if(data[0] < 1)		$('input[name=rent]').prop('checked', true);
					else				$('input[name=rent]').prop('checked', false);
				}
			});
		},

		onClose: function( selectedDate ) {
			$('#sdate').datepicker('option', 'maxDate', selectedDate);
		}   
	
		
	});
}

// 결과 오름차순 토글
function ascending() {
	$(".order-ui").on("click", function() {
		$(this).toggleClass("ascending");
	});
}

// 탭 기능
function tabFn() {
	var box = "";
	$(".tab-list > .tab").on("click", function() {
		var idx = $(this).index();
        box = $(this).closest(".fn-tabShow");
        
        if (box.length > 0) {
            box.find(".item-list > div").eq(idx).addClass("on").siblings().removeClass("on");
            box.find(".item-list > div").eq(idx).show().siblings().hide();
        }

		$(this).addClass("on").siblings().removeClass("on");
	});
}

// dep 클릭 기능
function depUlClk() {
    // 클릭 on 기능
    var item = $("[class*=dep-] > li > a");
    item.on("click", function() {
        item.removeClass("on");
        $(this).toggleClass("on");
    });
    // 폴더 expand 기능
    $(".fn-fold .icon-treeArr").on("click", function() {
        // console.log("ok");
        if ( $(this).hasClass("indent") == true ) {
            $(this).removeClass("indent").addClass("expand");
        } else if ( $(this).hasClass("expand") == true ) {
            $(this).removeClass("expand").addClass("indent");
        }
        $(this).closest("a").next().toggleClass("expand");
    });
}

function depTblClk() {
    // 클릭 on 기능
    $(".fn-fold tr").on("click", function() {
        $(this).toggleClass("on").siblings().removeClass("on");
    });

    // 폴더 expand 기능
    $(".fn-fold .icon-treeArr").on("click", function () {
        // console.log("ok");
        var lineRef = $(this).closest("tr").attr("ref");
        console.log(lineRef);

        // 아이콘 변경 및 목록 펼치기
        if ($(this).hasClass("indent") == true) {
            console.log("indent : " + $(this).hasClass("indent"));
            $(this).removeClass("indent").addClass("expand");
            if (lineRef == "line000") {
                $(".fn-fold tr.dep-2").show();
            } else {
                lineRef += "-0";
                console.log(lineRef);
                $(".fn-fold tr[ref='" + lineRef + "']").show();
            }
        } else if ($(this).hasClass("expand") == true) {
            console.log("expand : " + $(this).hasClass("expand"));
            $(this).removeClass("expand").addClass("indent");
            if (lineRef == "line000") {
                $(".fn-fold tr[ref]").not("tr[ref='line000']").hide();
                $(".fn-fold .icon-treeArr").removeClass("expand").addClass("indent");
            } else {
                lineRef += "-0";
                console.log(lineRef);
                $(".fn-fold tr[ref*='" + lineRef + "']").hide();
                $(".fn-fold tr[ref*='" + lineRef + "']").find(".icon-treeArr").removeClass("expand").addClass("indent");
            }
        }

    });
}

// drop메뉴 기능
function dropMenu() {
    var dropBox = $('.inp-drop-box'),
        resetBtn = dropBox.find('.ic-del');
    dropBox.find('.form-input').click(function() {
        $(this).next().show();
    });
    dropBox.find('.drop-menu > li').click(function() {
        var txtVal = $(this).text();
        $(this).parent().prev().val(txtVal);
        $(this).parent().filter('.drop-menu').hide();
    });
    resetBtn.click(function() {
        $(this).siblings().filter('.form-input').val('');
        $(this).siblings().filter('.drop-menu').hide();
    });
    $(document).on('click', function(e){
        if ( !$(e.target).is('.inp-drop-box .form-input') && !$(e.target).is('.inp-drop-box .drop-menu > li') ) {
            dropBox.find('.drop-menu').hide();
        }
    });
}

function quickMenuPop() {
    // 룹 별 마우스 우측 클릭시
    var menuIdx = 0,
        lnb = $('.lnb');
    lnb.find(".menu > li").on('mousedown', function(e) {
        if (  (event.button == 2) || (event.which == 3) ) {
            // console.log('마우스 오른쪽 클릭 사용 x')
            menuIdx = $(this).index();
			//console.log(menuIdx);
            $(document).on('contextmenu', function() {
                return false;
            });
            var posTop = e.clientY,
                posLeft = e.clientX;
            if ( (posTop + $('.qm-pop').outerHeight() ) > $(window).height() ) {
                posTop = posTop - $('.qm-pop').outerHeight();
                $('.qm-pop').css({
                    "left": posLeft,
                    "top": posTop,
                    "position": "fixed"
                }).show();
            } else {
                $('.qm-pop').css({
                    "left": posLeft,
                    "top": posTop,
                    "position": "fixed"
                }).show();
            }
        }
    });
    // 상태 팝업 클릭시
    $('.qm-pop .qm-list > li').on('click', function(e) {
        // room.status(roomNo, $(e.target).attr('class'));
        if( $(this).attr('ref') == 'deleteAll' ) {
            page.favorites(3, '', '');
        } else  {
			page.favorites(2, menuIdx, '');
        }
        $(this).closest('.qm-pop').hide();
    });
   
    // 팝업 영역 제외 클릭 시 사라짐
    $(document).on('click', function(e){
        if ( !$(e.target).is('.qm-pop .qm-list > li') ) {
            $('.qm-pop').hide();
        }
    });

}

//  groupDraggable 클래스 UI 기능 구현
function GroupDraggable(dragItem, dropArea) {
	this.dragItem = $(dragItem);
	this.dropArea = $(dropArea);
	this.dragUiText = '';
	this.dropHolderHtml = $('<div class="drop-holder-text">그룹화할 항목을 끌어다 놓아주세요.</div>');
	this.addGroup_wrap = $(
		'.draggable-wrap .grid-toolbar' +
		', ' +
		'.draggable-wrap .grid-head' +
		', ' +
		'.draggable-wrap .grid-contents' + 
		', ' +
		'.draggable-wrap .grid-total'
	);
	this.dragWrap = $('.draggable-wrap');
	this.addGroup_hdTbl = this.dragWrap.find('.grid-head .grid-tbl');
	this.addGroup_col = this.dragWrap.find('.grid-tbl > colgroup');
	this.addGroup_tr = this.dragWrap.find('.rowgroup > tr');
	this.addItem_wd = 25;
	this.addItem_col = '<col class="grouping-row" style="width: ' + this.addItem_wd + 'px">';
	this.addItem_tr = '<td class="grouping-row"></td>';
	this.addGroup_contents = this.dragWrap.find('.grid-contents .grid-tbl');
	this.contentColgroup = this.addGroup_contents.find('> colgroup');
	this.contentRowgroup = this.addGroup_contents.find('> .rowgroup');

	this.init();
}
GroupDraggable.prototype = {
	constructor : GroupDraggable,
	folderFn : function() {
		var _this = this;
		_this.dragWrap.on('click', '.grouping-folder', function() {
			var grouping_point = $(this).closest('tr').nextUntil('tr.grouping-dep-1');
			$(this).toggleClass('fold');
			if ($(this).hasClass('fold')) {
				grouping_point.find('.grouping-folder').addClass('fold');
				grouping_point.hide();
			} else {
				grouping_point.find('.grouping-folder').removeClass('fold');
				grouping_point.show();
			}
		});
	},
	dragBtnLength : function() {
		var dragBtnLength  = $('.fn-droppable .fn-drag-btn').length;
		return dragBtnLength;
	},
	dropHolderPrepend : function() {
		this.dropHolderHtml.prependTo(this.dropArea);
	},
	dropHolderFn : function() {
		var dragBtnLength = this.dragBtnLength();
		if (!dragBtnLength) {
			this.dropHolderPrepend();
		}
	},
	dropHolderPrepend: function() {
		this.dropHolderHtml.prependTo(this.dropArea);
	},
	dropHolderRemove: function() {
		this.dropArea.find('.drop-holder-text').remove();
	},
	dragFn : function() {
		var _this = this;
		_this.dragItem.draggable({
			cursorAt: { left: 5 },
			revert: "invalid",
			stack: _this.dragItem,
			helper: "clone",
			widget: true,
			start: function (event, ui) {
				var dragBtnLength = _this.dragBtnLength();
				if (!dragBtnLength) {
					_this.dropHolderHtml.prependTo(_this.dropArea);
				}
			},
			stop: function (event, ui) {
				var dragBtnLength = _this.dragBtnLength();
				if (dragBtnLength) {
					_this.dropHolderRemove();
				}
				var currentObj = $(this);
				var currentText = $(this).text();
				// console.log(currentText);
				var dragBtn = $(".fn-drag-btn");
				dragBtn.filter(function() {
					if ($(this).text() == currentText) {
						currentObj.draggable('disable');
					}
				})
			}
		});
	},
	dropFn : function() {
		var _this = this;
		_this.dropArea.droppable({
			accept: _this.dragItem,
			greedy: true,
			drop: function (event, ui) {
				_this.dragUiText = ui.draggable.text();
				var dropItem = $('<a href="javascript:;" class="fn-drag-btn">' + _this.dragUiText + '<span class="icon ic-x"></span></a>');
				var droppable = $(this);
				dropItem.clone().appendTo(droppable);

				_this.addGroup_col.prepend(_this.addItem_col);
				_this.addGroup_tr.prepend(_this.addItem_tr);
				_this.addGroup_wrap.css({ width: '+=' + _this.addItem_wd })
				var wrapWd = _this.addGroup_wrap.outerWidth();
				_this.addGroup_hdTbl.css({ width: (wrapWd - 17) })

				var dragBtn = $(".fn-drag-btn");
				var colLength = _this.contentColgroup.children('col').length;
				var dragBtnLength = dragBtn.length;
				// 드래그 전 colLength - 1
				// console.log(colLength);
				// console.log(dragBtnLength);

				if (dragBtnLength == 1) {
					var addGroup_dep = 
					'<tr class="grouping-dep-' + dragBtnLength + '">' +
					'<td class="ta-left dep-item" colspan="' + colLength + '">' +
					'<div class="cell">' +
					'<span class="grouping-folder"></span>' + _this.dragUiText +
					'</div>' +
					'</td>' +
					'</tr>';
					_this.contentRowgroup.prepend(addGroup_dep);
				} else {
					var addItem_td = '';
					for (var i = 1; i < dragBtnLength ; i++) {
						addItem_td += _this.addItem_tr;
					}
					var addGroup_dep = 
					'<tr class="grouping-dep-' + dragBtnLength + '">' +
					addItem_td +
					'<td class="ta-left dep-item" colspan="' + (colLength-(dragBtnLength-1)) + '">' +
					'<div class="cell">' +
					'<span class="grouping-folder"></span>' + _this.dragUiText +
					'</div>' +
					'</td>' +
					'</tr>';
					
					_this.contentRowgroup.find('tr[class*=grouping-dep] > td.dep-item').each(function(index, item) {
						var itemColspan = parseInt($(item).attr('colspan'), 10);
						$(item).attr('colspan', itemColspan+1);
					});
					_this.contentRowgroup.find('tr.grouping-dep-' + (dragBtnLength-1)).after(addGroup_dep);

				}
			},
		});
	},
	sortableFn : function() {
		var _this = this;
		_this.dropArea.sortable({
			axis: 'x',
			cursorAt: {left: 5},
			contain_thisnt: 'parent',
			update: function(event, ui) {
				console.log('순서 변경 이벤트 발생');
			}
			// start: function(e, ui){
			// 	ui.placeholder.height(ui.item.outerHeight());
			// }
		}).disableSelection();
	},
	removeBtnFn : function() {
		var _this  = this;
		_this.dropArea.on('click', '.fn-drag-btn .ic-x', function() {
			var currentText = $(this).closest('.fn-drag-btn').text();
			var dragBtnLength = _this.dragBtnLength();

			_this.addGroup_col.each(function(index, item) {
				$(item).find('col').eq(0).remove();
			});
			_this.addGroup_tr.each(function(index, item) {
				$(item).find('td.grouping-row').eq(0).remove();
			});
			_this.addGroup_wrap.css({ width: '-=' + _this.addItem_wd })
			var wrapWd = _this.addGroup_wrap.outerWidth();
			_this.addGroup_hdTbl.css({ width: (wrapWd - 17) })

			_this.contentRowgroup.find('tr.grouping-dep-' + dragBtnLength).remove();

			_this.contentRowgroup.find('tr[class*=grouping-dep] > td.dep-item').each(function(index, item) {
				var itemColspan = parseInt($(item).attr('colspan'), 10);
				$(item).attr('colspan', itemColspan-1);
			});
			
			$(this).closest('a').remove();
			var dragBtnLength_after = _this.dragBtnLength();
			if (dragBtnLength_after == 0) {
				_this.dropHolderPrepend();
				_this.dragItem.draggable('enable');
			} else {
				_this.dropHolderRemove();
			}
			_this.dragItem.filter(function() {
				if ($(this).text() == currentText) {
					$(this).draggable('enable');
				}
			})
		});
	},
	init : function() {
		this.folderFn();
		this.dropHolderFn();
		this.dragFn();
		this.dropFn();
		this.sortableFn();
		this.removeBtnFn();
	}
}


function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function removeCommas(x) {
    if(!x || x.length == 0) return "";
    else return x.split(",").join("");
}

var winpop = {
	info: function(i, k) {
		$.ajax({		
			type: 'post',
			url: '/_new/views/',
			data: 'mode=room-change&a=' + $('select[name=room]').val() + '&b=' + i + '&c=' + k,
			success: function(r) {
				$('#change').html(r);
				console.log(r);
			}
		});		
	},

	select: function(e) {
		$('#show', opener.document).val(e);
		$('input[name=m_ho]', opener.document).val(e);
		self.close();
	},

	change: function() {
	
	}
}

var rsv = {
	name: function(a) {
		$.ajax({		
			type: 'post',
			url: '/_new/views/',
			data: 'mode=rsv-name&a=' + a,
			success: function(r) {
				data = r.split('||');

				$('#p-1').html(data[0]);
				$('#p-2').html(data[1]);
			}
		});
	},

	guest: function(a) {
		$.ajax({		
			type: 'post',
			url: '/_new/views/',
			data: 'mode=rsv-guest&a=' + a,
			success: function(r) {
				data = $.parseJSON(r);
				stay = data.nights + ' nights (' + data.count + ') / ' + data.chkin + ' (' + data.room + ') / ' + addCommas(parseInt(data.rate1) + parseInt(data.rate2));

				$('input[name=name]').val(data.name);
				$('input[name=email]').val(data.email);
				$('input[name=tel]').val(data.tel);
				$('input[name=birth]').val(data.birth);
				$('input[name=passport]').val(data.passport);
				$('input[name=car]').val(data.car);
				$('#stay').html(stay);
			}
		});
	},

	night: function() {
		var chk = $('input[name=chkin]').val();
	
		if(!chk) {
			alert('체크인 날짜를 입력해주세요.')	
			$('input[name=chkin]').focus();
			return;
		}
		
		if($('input[name=nights]').val() < 1)		$('input[name=rent]').prop('checked', true);
		else										$('input[name=rent]').prop('checked', false);

		$.ajax({		
			type: 'post',
			url: '/_new/views/',
			data: 'mode=rsv-nights&date=' + chk + '&night=' + $('input[name=nights]').val() + '&room=' + $('#room').val() + '&rent=' + $('input[name=rent]:checked').val(),
			success: function(r) {
				var data = r.split('|');

				r_rate1 = data[1];
				r_rate2 = removeCommas($('#r-rate2').val());
				r_rate3 = removeCommas($('#r-rate3').val());

				total	= addCommas(parseInt(r_rate1) + parseInt(r_rate2) + parseInt(r_rate3));

				$('#r-rate1').val(addCommas(r_rate1));
				$('#rate').val(total);

				rsv.convert(total, 'convert');

				$('input[name=chkout]').val(data[0]);	
				$('input[name=info-r]').val(data[2]);
			}
		});
	},

	rent: function() {
		if($('input[name=rent]').is(':checked') == true) {
			$('input[name=nights]').val(0);
		} else {
			$('input[name=nights]').val(1);		
		}

		rsv.night();
	},

	category: function(e) {
		$.ajax({		
			type: 'post',
			url: '/_new/views/',
			data: 'mode=rsv-category&opt=' + e,
			success: function(r) {
				$('#temp').html(r);				
				if(e == '대매사') {
					rsv.agency('오픈마켓');
				} else {
					$('#agency').html('');
				}
			}
		});
	},

	agency: function(e) {
		$.ajax({		
			type: 'post',
			url: '/_new/views/',
			data: 'mode=rsv-agency&opt=' + e,
			success: function(r) {
				$('#agency').html(r);
			}
		});
	},

	convert: function(e, i) {
		var k = e.replace(/[^0-9]/g,'');

		$.ajax({		
			type: 'post',
			url: '/_new/views/',
			data: 'mode=rsv-convert&num=' + k,
			success: function(r) {
				$('#' + i).html(r + '원');
			}
		});			
	},

	reg: function() {
		if(!$('input[name=name]').val()) {
			alert('게스트 이름을 입력해주세요.');
			$('input[name=name]').focus();
			return;
		}

		if(!$('input[name=chkin]').val()) {
			alert('체크인 날짜를 선택해주세요.');
			$('input[name=chkin]').focus();
			return;
		}

		if(!$('input[name=chkout]').val()) {
			alert('체크아웃 날짜를 선택해주세요.');
			$('input[name=chkout]').focus();
			return;
		}

		if(!$('input[name=person]').val()) {
			alert('투숙인원을 입력해주세요.');
			$('input[name=person]').focus();
			return;
		}

		if(!$('input[name=rate]').val()) {
			alert('요금을 입력해주세요.');
			$('input[name=rate]').focus();
			return;
		}

		$.ajax({		
			type: 'post',
			url: '/_new/views/',
			data: $('#reg').serialize(),
			success: function(r) {
				data = r.split('||');

				alert('예약건이 접수되었습니다.');

				$('#reserve').html(data[0]);

				if($('input[name=type]').val() == '단체') {
					rsv.group($('input[name=rsvn]').val());
				} else {
					$('#ass').html(data[1]);
				}
			}
		});
	},

	update: function() {
		$.ajax({	
			type: 'post',
			url: '/_new/views/',
			data: $('#update').serialize(),
			success: function(r) {
				alert('수정되었습니다.');
				$('#reserve').html(r);

				console.log(r);

				if($('input[name=type]').val() == '단체') {
					rsv.group($('input[name=rsvn]').val());
				}
			}
		});
	},

	group: function(e) {
		$.ajax({		
			type: 'post',
			url: '/_new/views/',
			data: 'mode=rsv-group&a=' + e,
			success: function(r) {
				$('#stay').html(r);
			}
		});
	},

	account: function(e) {
		$.ajax({		
			type: 'post',
			url: '/_new/views/',
			data: 'mode=rsv-account&keyword=' + e,
			success: function(r) {
				$('#account').html(r);
			}
		});
	},

	booker: function(e) {
		$.ajax({		
			type: 'post',
			url: '/_new/views/',
			data: 'mode=rsv-booker&a=' + e,
			success: function(r) {		
				var data = $.parseJSON(r);
				$('input[name=account]').val(data.name);
				$('input[name=bname]').val(data.bname);
				$('input[name=bmail]').val(data.bmail);
				$('input[name=btel]').val(data.bphone);
				$('input[name=bfax]').val(data.bfax);
				$('select[name=method]').val(data.method);
				$('select[name=card]').val(data.card);
				$('input[name=card1]').val(data.card1);
				$('input[name=card2]').val(data.card2);
				$('input[name=card3]').val(data.card3);
				$('input[name=card4]').val(data.card4);
				$('input[name=pass]').val(data.pass);
				$('input[name=mm]').val(data.mm);
				$('input[name=yy]').val(data.yy);
				$('input[name=ssn]').val(data.ssn);
				$('#btn').html(data.btn);
				$('#account').hide();
			}
		});
	},

	cancel: function() {
		var idx = Array();
		var cnt = 0;
		var box = $('.rsv-cancel');

		for(i = 0; i < box.length; i++)
		{
			if(box[i].checked == true) {
				idx[cnt] = box[i].value;
				cnt++;
			}
		}

		if(cnt < 1) {
			alert('취소할 예약건을 선택해주세요.');
			return;
		} else {
			if(confirm('선택하신 예약건을 취소하시겠습니까?') == true) {
				$.ajax({		
					type: 'post',
					url: '/_new/views/',
					data: 'mode=rsv-cancel&a=' + idx,
					success: function(r) {
						alert('취소되었습니다.');
						$('#reserve').html(r);
					}
				});
			}
		}		
	},

	all: function() {
		var chk		= $('#r-cancel').prop('checked');

		if(chk){
			$('.rsv-cancel').prop('checked', true);
		} else {
			$('.rsv-cancel').prop('checked', false);
		}
	}
}

var pkg = {
	list: function(e, i) {
		$.ajax({	
			type: 'post',
			url: '/_new/views/',
			data: 'mode=pkg-list&menu=' + e + '&idx=' + i,
			success: function(r) {
				$('#pkg-list').html(r);
			}
		});
	},

	search: function(e, i) {
		if(!$('input[name=keyword]').val()) { 
			alert('검색어를 입력해주세요.');
			$('input[name=keyword]').focus();
			return;
		}

		$.ajax({	
			type: 'post',
			url: '/_new/views/',
			data: $('#sform').serialize(),
			success: function(r) {
				$('#pkg-list').html(r);
			}
		});
	},

	clr: function() {
		$('input[name*=pkg]').val('');
		var tr = $('.del').parent().parent().parent();
	
		r_rate1 = removeCommas($('#r-rate1').val());
		r_rate2 = 0;
		r_rate3 = removeCommas($('#r-rate3').val());

		total	= addCommas(parseInt(r_rate1) + parseInt(r_rate2) + parseInt(r_rate3));

		$('#r-rate2').val(0);
		$('#rate').val(total);
		rsv.convert(total, 'convert');

		tr.remove();
		$('#info-p').val('');
	},

	add: function() {
		$.ajax({	
			type: 'post',
			url: '/_new/views/',
			data: 'mode=pkg-add',
			success: function(r) {
				// $('.name-tbl > tbody').append(r);
				$(r).insertBefore($('#tr-price'));
			}
		});
	},

	del: function(e) {	
		//var idx = $(e.closest("tr")).index();
		// var tr = $(e).parent().parent().parent();

		$.ajax({	
			type: 'post',
			url: '/_new/views/',
			data: 'mode=pkg-del&a=' + e + '&b='+ $('#info-p').val(),
			success: function(r) {
				var data = $.parseJSON(r);

				r_rate1 = removeCommas($('#r-rate1').val());
				r_rate2 = removeCommas(data.total);
				r_rate3 = removeCommas($('#r-rate3').val());

				total	= addCommas(parseInt(r_rate1) + parseInt(r_rate2) + parseInt(r_rate3));

				$('#r-rate2').val(addCommas(data.total));
				$('#rate').val(total);
				rsv.convert(total, 'convert');

				$('#info-p').val(data.fnb);
				$('#' + e).remove();
				//tr.remove();				
			}
		});
	},

	choice: function(a, b, c) {
		$.ajax({	
			type: 'post',
			url: '/_new/views/',
			data: 'mode=pkg-choice&a=' + a + '&b=' + $('#sdate').val() + '&c=' + $('#info-p').val() + '&d=' + b,
			success: function(r) {
				var data = $.parseJSON(r);

				r_rate1 = removeCommas($('#r-rate1').val());
				r_rate2 = removeCommas(data.total);
				r_rate3 = removeCommas($('#r-rate3').val());

				total	= addCommas(parseInt(r_rate1) + parseInt(r_rate2) + parseInt(r_rate3));

				$('#r-rate2').val(addCommas(data.total));
				$('#rate').val(total);
				rsv.convert(total, 'convert');
				
				$('#' + b).find('.form-input.package').val(data.title);
				//$('#pkg').find('tr').eq(b).find('.form-input.package').val(data.title);
				$('#info-p').val(data.fnb);

				page.close();
				
			


				/*
				var arr	 = new Array();
				var data = $.parseJSON(r);
				r_rate	= removeCommas($('#r-rate1').val());
				s_rate	= removeCommas($('#r-rate2').val());

				service	= parseInt(s_rate) + parseInt(data.rate);
					
				$('#r-rate2').val(addCommas(service));
				$('#pkg').find('tr').eq(b).find('.form-input.package').val(data.title);
				//$('#info-s').val(data.fnb);

				var total_rate = addCommas(parseInt(r_rate) + parseInt(service));

				$('#rate').val(total_rate);
				rsv.convert(total_rate, 'convert');


				var pkg = new Object();

				pkg.day		= $('#sdate').val();
				pkg.num		= data.num;
				pkg.comp	= 'N';
				pkg.qry		= 1;
				pkg.rate	= data.rate;
				arr.push(pkg);

				var service	= JSON.stringify(arr);
				$('#info-p').val(service);

			
				console.log(r);
				page.close();
				*/	
			}
		});
	}
}

var bill = {
	list: function(e) {
		$.ajax({	
			type: 'post',
			url: '/_new/views/',
			data: 'mode=rate-pkg&a=' + e,
			success: function(r) {
				var data = r.split('||');

				$('#s-list').empty();
				$('#s-list').append(data[0]);
				bill.txt(data[1]);
			}
		});
	},

	all: function(e) {
		var chk		= $(e).prop('checked');
		var name	= $(e).attr('name');
		var obj		= (name == 'r') ? 'r-' : 's-';

		if(chk){
			$('input[name^=' + obj + ']').prop('checked', true);
		} else {
			$('input[name^=' + obj + ']').prop('checked', false);
		}

		$('input[name^=' + obj + ']').parent().parent().parent().toggleClass('delete');


	},

	room: function() {
		if(!$('#r-change').val()) {
			alert('적용할 수치를 입력해주세요.');
			$('#r-change').focus();
			return;
		}

		k = $('input[name^=r-]:checked').length;

		if(k < 1) {
			alert('적용할 날짜를 선택해주세요.');
			return;
		} else {			
			option	= $('#opts').val();
			change	= $('#r-change').val();
			price	= 0;

			$('input[name^=r-]').each(function(e) {
				if($('input[name^=r-]').eq(e).is(':checked') == true) {
					if(option == 1) {
						$('#z-' + e).html(change);
					} else if(option == 2) {
						temp1 = removeCommas($('#z-' + e).text());
						temp2 = removeCommas(change);
						temp3 = parseInt(temp1) - (parseInt(temp1) * parseInt(temp2) / 100);

						$('#z-' + e).html(addCommas(temp3));
					} else if(option == 3) {
						temp1 = removeCommas($('#z-' + e).text());
						temp2 = removeCommas(change);
						temp3 = parseInt(temp1) - parseInt(temp2);

						$('#z-' + e).html(addCommas(temp3));
					} else if(option == 4) {
						temp1 = removeCommas($('#z-' + e).text());
						temp2 = removeCommas(change);
						temp3 = parseInt(temp1) + parseInt(temp2);

						$('#z-' + e).html(addCommas(temp3));
					}				
				}

				price += parseInt(removeCommas($('#z-' + e).text()));
			});

			$('#r-add-total').html(addCommas(price));
		}
	},

	comp: function(k) {
		price = 0;

		if(k == 1) {
			$('input[id^=c-]').each(function(e) {
				if($('input[id^=c-]').eq(e).is(':checked') == true) {
					$('#p-' + e).html(0);
				}
			});

			$('input[name^=r-]').each(function(e) {
				price += parseInt(removeCommas($('#p-' + e).text()));
			});

			$('#r-add-total').html(addCommas(price));
		} else {
			$('.s-comp').each(function(e) {
				if($('.s-comp').eq(e).is(':checked') == true) {
					$('.s-price').eq(e).html(0);
					$('.s-total').eq(e).html(0);
				}
				
				price += parseInt(removeCommas($('.s-total').eq(e).text()));
			});


			$('#s-add-total').html(addCommas(price));
		}
	},

	txt: function(a) {
		//var title = $('#s-list option:checked').text();
		//$('#s-goods').val(title);

		$.ajax({	
			type: 'post',
			url: '/_new/views/',
			data: 'mode=rate-service&a=' + a,
			success: function(r) {
				var data = $.parseJSON(r);

				$('#s-goods').val(data.title);
				$('#s-rate').val(data.rate);
				bill.comp(2);
			}
		});
	},

	service: function(e) {
		if(!$('#s-goods').val()) {
			alert('서비스 품목을 선택해주세요.');
			$('#s-goods').focus();
			return;
		}

		if(!$('#s-rate').val()) {
			alert('가격을 입력해주세요.');
			$('#s-rate').focus();
			return;
		}

		if(!$('#s-qty').val()) {
			alert('수량을 입력해주세요.');
			$('#s-qty').focus();
			return;
		}

		if($('#s-qty').val() < 1) {
			$('#s-qty').val(1);
		}

		rate	= removeCommas($('#s-rate').val());
		qty		= removeCommas($('#s-qty').val());

		$.ajax({	
			type: 'post',
			url: '/_new/views/',
			data: 'mode=rate-add&a=' + e + '&b=' + $('#sdate').val() + '&c=' + $('#edate').val() + '&d=' + $('#s-list').val() + '&e=' + rate + '&f=' + qty,
			success: function(r) {
				$('#s-add').append(r);
				bill.comp(2);
			}
		});
		
		var arr1 = new Array();
		room_price = 0;

		$('input[name^=r-]').each(function(e) {
			var obj = new Object();
			
			obj.day		= $('#d-' + e).text();
			obj.comp	= $('#c-' + e).text();
			obj.rate	= removeCommas($('#p-' + e).text());

			room_price += parseInt(obj.rate);

			arr1.push(obj);
		});

		var room = JSON.stringify(arr1);
		var r_price = addCommas(room_price);

		$('#info-r').val(room);
		$('#rate').val(r_price);
		rsv.convert(r_price, 'convert');
	},

	reload: function(a) {
		obj = (a == 1) ? 'r-add' : 's-add';

		$.ajax({	
			type: 'post',
			url: '/_new/views/',
			data: 'mode=rate-reload&a=' + a + '&b=' + $('#info-r').val(),
			success: function(r) {
				data = r.split('|');
				$('#' + obj).html(data[0]);
				$('#' + obj + '-total').html(data[1]);
			}
		});
	},

	chk: function(e) {
		$(e).parent().parent().parent().toggleClass('delete');
	},

	del: function() {
		price = 0;
		k = $('input[name^=s-]:checked').length;

		if(k > 0) {
			$('.delete').remove();
		}

		bill.comp(2);
	},

	save: function() {
		var arr1 = new Array();
		var arr2 = new Array();

		room_price = 0;
		service_price = 0;

		$('input[name^=r-]').each(function(e) {
			var obj1 = new Object();
			
			obj1.day	= $('#d-' + e).text();
			obj1.comp	= ($('#c-' + e).is(':checked') == true) ? 'Y' : 'N';
			obj1.rate	= removeCommas($('#z-' + e).text());

			room_price += parseInt(obj1.rate);

			arr1.push(obj1);
		});

		var room	= JSON.stringify(arr1);
		$('#r-rate1').val(addCommas(room_price));
		$('#info-r').val(room);

		pkg = $('input[name^=s-]').length;

		if(pkg > 0) {
			$('input[name^=s-]').each(function(i) {
				var obj2 = new Object();
				
				obj2.day	= $('.dd-').eq(i).text();
				obj2.num	= $('.s-num').eq(i).val();
				obj2.comp	= ($('.s-comp').eq(i).is(':checked') == true) ? 'Y' : 'N';
				obj2.rate	= removeCommas($('.s-price').eq(i).text());
				obj2.qty	= removeCommas($('.s-qty').eq(i).text());

				price = parseInt(obj2.rate) * parseInt(obj2.qty);
				
				service_price += parseInt(price);

				arr2.push(obj2);
			});

			var service	= JSON.stringify(arr2);
			$('#r-rate3').val(addCommas(service_price));
			$('#info-s').val(service);
		} else {
			service_price = 0
			$('#r-rate3').val(0);
			$('#info-s').val('');
		}
		
		total = addCommas(parseInt(room_price) + parseInt(removeCommas($('#r-rate2').val())) + parseInt(service_price));

		$('#rate').val(total);
		rsv.convert(total, 'convert');
		page.close();
	}
}

var cmt = {
	msg: function(e, i) {
		if(e == 1) {
			if(!$('input[name=memo]').val()) {
				alert('내용을 입력해주세요.');
				$('input[name=memo]').focus();
				return;
			}

			$.ajax({		
				type: 'post',
				url: '/_new/views/',
				data: $('#mform').serialize(),
				success: function(r) {
					var data = r.split('||');

					$('#list').html(data[0]);
					$('#message').html(data[1]);
					$('input[name=memo]').val('');
				}
			});
		} else if(e == 2) {			
			if(confirm('선택하신 게시물을 삭제하시겠습니까?') == true) {
				$.ajax({		
					type: 'post',
					url: '/_new/views/',
					data: 'mode=comment&a=' + e + '&b=' + i,
					success: function(r) {
						var data = r.split('||');

						$('#list').html(data[0]);
						$('#message').html(data[1]);
						alert('삭제되었습니다.');
					}
				});
			} 		
		} else if(e == 3) {
			$('input[name=a]').val(e);
			$('input[name=temp]').val(i);
			$.ajax({		
				type: 'post',
				url: '/_new/views/',
				data: $('#mform').serialize(),
				success: function(r) {
					var data = r.split('||');

						$('#list').html(data[0]);
						$('#message').html(data[1]);
						alert('수정되었습니다.');
				}
			});
		}
	}
}

var global = {
	cls: function(i, e, k) {
		$.ajax({		
			type: 'post',
			url: '/_new/views/',
			data: 'mode=acc-market&e=' + e + '&i=' + i + '&k=' + k,
			success: function(r) {
				$('#' + i).empty();
				$('#' + i).append(r);
				global.combo('');
			}
		});
	},

	combo: function(e) {
		$.ajax({		
			type: 'post',
			url: '/_new/views/',
			data: 'mode=acc-combo&a=' + e,
			success: function(r) {
				$('#s-account').empty();
				$('#s-account').append(r);
			}
		});
	},

	is_void: function(a) {
		if(confirm('취소처리 하시겠습니까?') == true) {
			$.ajax({		
				type: 'post',
				url: '/_new/views/',
				data: 'mode=void&a=' + a,
				success: function(r) {
					alert('취소되었습니다.');
					console.log(r);
				}
			});
		} 
	},

	change: function(i, k) {
		$.ajax({		
			type: 'post',
			url: '/_new/views/front/inc/',
			data: 'mode=room-change&a=' + $('select[name=room]').val() + '&b=' + i + '&c=' + k,
			success: function(r) {
				$('#change').html(r);
			}
		});	
	},

	guest: function() {
		$.ajax({		
			type: 'post',
			url: '/_new/views/',
			data: $('#gform').serialize(),
			success: function(r) {
				alert('수정되었습니다.')
				location.reload();
			}
		});
	}
}