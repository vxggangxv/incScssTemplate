$(function() {
    var headerUI = new HeaderUI('.page-main .header', '.floorstatus-count');
})

// function
var housekeeperPopup = {
    display : function(flag, obj) {
        var $obj = $('[data-target=' + obj + ']');
        
        switch (flag) {
            case true :
                $obj.css({display: 'table'});
                $obj.find('.popup-body').scrollTop(0);
                wheelFn(false);
                break;
            case false :
                $obj.css({display: 'none'});
                wheelFn(true);
                break;
            default : 
                console.log('unhandled flag');
        }
    }
}
function wheelFn(flag) {
    if (flag == false) {
        $('html').css({
            overflow: 'hidden'
        });
    }
    if (flag == true) {
        $('html').css({
            overflow: 'auto'
        });
    }

}

// ui
function HeaderUI(header, heightEl) {
    this.bodyEl = $('.page-main');
    this.header = $(header);
    this.heightEl = $(heightEl);

    this.init();
}
HeaderUI.prototype = {
    headerHtFn : function() {
        var _this = this;
        var headerHt = this.header.outerHeight();
        
        window.addEventListener('load', function(){setTimeout(scrollTo, 0, 0, 1);
        }, false);
        
        if (_this.heightEl.length) {
            var htArr = [];
            htArr.push(headerHt);
            $(_this.heightEl).each(function(index, item) {
                headerHt = headerHt + $(item).outerHeight();
                htArr.push(headerHt);
                $(item).css({
                    top: htArr[index]
                });
            })
        }
        
        _this.bodyEl.addClass('affix');
        _this.bodyEl.css({
            paddingTop: headerHt
        });
        return headerHt;
    },
    scrollFn : function() {
        var _this = this;
        $(window).on('scroll', function() {
            var scr = $(window).scrollTop();
            if (scr > 0) {
                if (_this.heightEl.length) {
                    _this.heightEl.addClass('over');
                } else {
                    _this.header.addClass('over');
                }
            } else {
                if (_this.heightEl.length) {
                    _this.heightEl.removeClass('over');
                } else {
                    _this.header.removeClass('over');
                }
            }

        });
    },
    init : function() {
        this.headerHtFn();
        this.scrollFn();
    }
}