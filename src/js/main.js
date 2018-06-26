$(document).ready(function(){

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  // BREAKPOINT SETTINGS
  var bp = {
    mobileS: 375,
    mobile: 568,
    tablet: 768,
    desktop: 992,
    wide: 1336,
    hd: 1680
  };

  var easingSwing = [.02, .01, .47, 1]; // default jQuery easing for anime.js

  ////////////
  // READY - triggered when PJAX DONE
  ////////////
  function pageReady(){
    legacySupport();
    updateHeaderActiveClass();
    initHeaderScroll();

    initPopups();
    initSliders();
    initScrollMonitor();
    initMasks();
    initLazyLoad();

    initMasonry('[masonry-blog-js]', '.blogs__block');
    initMasonry('[masonry-testimonials-js]', '.testimonials__block');
    initMasonry('[masonry-print-js]', '.print__block');
    initMasonry('[masonry-faq-js]', '.quesAns__block');

    filterMasonry("[blogs-pagination-js]", "[masonry-blog-js]", ".blogs__block");
    filterMasonry("[quesAns-pagination-js]", "[masonry-faq-js]", ".quesAns__block");

    inputRangeInit();

    // development helper
    _window.on('resize', debounce(setBreakpoint, 200))

    // AVAILABLE in _components folder
    // copy paste in main.js and initialize here

    // initTeleport();
    // parseSvg();
    // revealFooter();
    // _window.on('resize', throttle(revealFooter, 100));
  }

  // this is a master function which should have all functionality
  pageReady();


  // some plugins work best with onload triggers
  _window.on('load', function(){
    // your functions
  });


  //////////
  // COMMON
  //////////

  function legacySupport(){
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: true,
      refreshDebounceWait: 150,
      appendToBody: true
    });
  }


  // Prevent # behavior
	_document
    .on('click', '[href="#"]', function(e) {
  		e.preventDefault();
  	})
    .on('click', 'a[href^="#section"]', function() { // section scroll
      var el = $(this).attr('href');
      $('body, html').animate({
          scrollTop: $(el).offset().top}, 1000);
      return false;
    })


  // HEADER SCROLL
  // add .header-static for .page or body
  // to disable sticky header
  function initHeaderScroll(){
    _window.on('scroll', throttle(function(e) {
      var vScroll = _window.scrollTop();
      var header = $('.header').not('.header--static');
      var headerHeight = header.height();
      var firstSection = _document.find('.page__content div:first-child()').height() - headerHeight;
      var visibleWhen = Math.round(_document.height() / _window.height()) >  2.5

      if (visibleWhen){
        if ( vScroll > headerHeight ){
          header.addClass('is-fixed');
        } else {
          header.removeClass('is-fixed');
        }
        if ( vScroll > firstSection ){
          header.addClass('is-fixed-visible');
        } else {
          header.removeClass('is-fixed-visible');
        }
      }
    }, 10));
  }


  // HAMBURGER TOGGLER
  _document.on('click', '[hamburger-js]', function(e){
    $(e.currentTarget).toggleClass('is-active');
    // $('.mobile-navi').toggleClass('is-active');
  });

  function closeMobileMenu(){
    $('[js-hamburger]').removeClass('is-active');
    $('.mobile-navi').removeClass('is-active');
  }

  // SET ACTIVE CLASS IN HEADER
  // * could be removed in production and server side rendering when header is inside barba-container
  function updateHeaderActiveClass(){
    $('.header__menu li').each(function(i,val){
      if ( $(val).find('a').attr('href') == window.location.pathname.split('/').pop() ){
        $(val).addClass('is-active');
      } else {
        $(val).removeClass('is-active')
      }
    });
  }


  //
  // MASONRY
  // ====================
  /**
   *
   * @param gridName - {String}
   * @param blockName - {String}
   */
  function initMasonry(gridName, blockName) {
    $(gridName).masonry({
      itemSelector: blockName,
      gutter: 18,
      horizontalOrder: true
    });
  }
  // ====================


  //
  // BLOGS/FAQ PAGINATION
  // ====================
  /**
   *
   * @param bntName - {String}
   * @param masonryName - {String}
   * @param blockName - {String}
   */
  function filterMasonry(bntName, masonryName, blockName) {
    _document.on("click", bntName, function(e) {
      var elem = $(e.currentTarget),
        attrElem = elem.attr("data-pagination"),
        blogBlock = $(blockName),
        masonryGrid = $(masonryName);

      $(bntName).removeClass("is-active");
      elem.addClass("is-active");

      if($(_window).width() > 767) {
        var masonryGridOption = {
          itemSelector: blockName + '.is-show',
          gutter: 18,
          horizontalOrder: true
        };
        masonryGrid.masonry(masonryGridOption);
      }

      if(attrElem === "all") {

        blogBlock
          .removeClass("is-hide")
          .addClass("is-show");

      } else {

        blogBlock
          .removeClass("is-hide")
          .addClass("is-show")
          .each(function(idx, val) {
            var elemAttr = $(val).attr("data-filter");

            if(elemAttr.indexOf(attrElem) === -1) {
              $(val)
                .addClass("is-hide")
                .removeClass("is-show");
          }
        });
      }

      if($(_window).width() > 767) {
        masonryGrid
          .masonry('reloadItems')
          .masonry('layout');
      }
    });
  }
  // ====================


  //
  // SLIDERS
  // ====================
  _document.on("click", "[about-btn-js]", function(e) {
    var elem = $(e.currentTarget),
      elemAttr = elem.attr("data-pagin"),
      boxContainer = $("[about-box-js]");

    $("[about-btn-js]").removeClass("is-active");
    elem.addClass("is-active");

    boxContainer.removeClass("is-active");
    $(".main__row-box[data-main='" + elemAttr + "']").addClass("is-active");
  });
  // ====================


  // CALC TABS
  // ====================
  _document.on("click", "[tabs-btn-js]", function(e) {
    var elem = $(e.currentTarget),
      elemAttr = elem.attr("data-tabs-btn");

    $("[tabs-btn-js]").removeClass("is-active");
    elem.addClass("is-active");
  });
  // ====================


  //
  // ====================
  var objOptionBLock = [
    {
      color : 'rgba(58, 103, 217, 0.65)',
      left : '0',
      height : '131px'
    },
    {
      color : 'rgba(58, 103, 217, 0.84)',
      left : '240px',
      height : '171px'
    },
    {
      color : 'rgba(58, 103, 217, 1)',
      left : '480px',
      height : '229px'
    },
    {
      color : 'rgba(16, 173, 180, 1)',
      left : '720px',
      height : '329px'
    },
    {
      color : 'rgba(58, 103, 217, 0.91)',
      left : '960px',
      height : '208px'
    },
  ];
  function lineBlockTmpl(idx, width, left, right) {
    return `
      <div
        style="
          left: ${left || objOptionBLock[idx].left};
          right: ${right || 'auto'};
          width: ${width || '240px'};
          height: ${objOptionBLock[idx].height};
          background-color: ${objOptionBLock[idx].color};
        "
        class="main__line main__line-${idx}"
      ></div>
    `
  }
  function createMainBlock() {
    var defaultSizeBlock = 1200,
      _winWidth = _window.width(),
      mainBlockContainer = $("[main-line-js]"),
      defaultBlockContainer = mainBlockContainer.find(".main__line-box");

    var diffSize = (_winWidth - defaultSizeBlock) / 2,
      need = diffSize / 240,
      arrNum = [];

    // DEFAULT BLOCK - center...
    for(var i = 0, len = objOptionBLock.length; i < len; i++) {
      defaultBlockContainer.append(lineBlockTmpl(
        i,
        "",
        "",
        ""
      ));
    }

    // CALC NEED BLOCK LEFT AND RIGHT...
    for(var j = 0; j < need; j++) {
      var tmpNum = need;

      tmpNum - j;

      if((tmpNum - j) > 1) {
        arrNum.push(240);
      } else {
        arrNum.push(parseInt((need - j) * 240));
      }
    }

    // POSITION RIGHT BLOCK...
    for(
      var k = 0, len = arrNum.length, countStart = arrNum.length, sum = 0;
      k < len;
      k++, countStart--
    ) {

      sum += arrNum[countStart - 1];

      mainBlockContainer.append(lineBlockTmpl(
        k,
        arrNum[k] + "px",
        "auto",
        (arrNum[k] === 240) ? (sum) + "px" : 0 + "px"
      ));
    }

    // POSITION LEFT BLOCK...
    for(
      var l = 0, len = arrNum.length, countStart = arrNum.length, countEnd = objOptionBLock.length - 1, sum = 0;
      l < len;
      l++, countStart--, countEnd--
    ) {

      sum += arrNum[countStart - 1];

      mainBlockContainer.prepend(lineBlockTmpl(
        countEnd,
        arrNum[l] + "px",
        (arrNum[l] === 240) ? (sum) + "px" : 0 + "px",
        "auto"
      ));
    }
  }
  function clearMainBLock() {
    $("[main-line-js] .main__line").remove();
  }
  $(_window).on("load resize", function() {
    if($(_window).width() >= 768) {
      clearMainBLock();
      createMainBlock();
    }
  });
  // ====================


  //
  // ====================
  function inputRangeInit() {
    $('input[type=range]').on('input', function(e){
      var min = e.target.min,
        max = e.target.max,
        val = e.target.value;

      $(e.target).css({
        'backgroundSize': (val - min) * 100 / (max - min) + '% 100%'
      });
    }).trigger('input');
  }
  // ====================


  //
  // ====================
  let swiperBlog = 0,
    swiperTestimonials = 0,
    swiperPrint = 0,
    swiperReasons = 0;

  function initSwiperBlog() {
    swiperBlog = new Swiper('.swiper-blog-js', {
      wrapperClass: "swiper-wrapper",
      slideClass: "blogs__block",
      direction: 'horizontal',
      loop: false,
      watchOverflow: true,
      setWrapperSize: false,
      spaceBetween: 18,
      slidesPerView: 'auto',
      normalizeSlideIndex: true,
      grabCursor: true,
      freeMode: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
    })
  }
  function initSwiperTestimonials() {
    swiperTestimonials = new Swiper('.swiper-testimonials-js', {
      wrapperClass: "swiper-wrapper",
      slideClass: "testimonials__block",
      direction: 'horizontal',
      loop: false,
      watchOverflow: true,
      setWrapperSize: false,
      spaceBetween: 18,
      slidesPerView: 'auto',
      normalizeSlideIndex: true,
      grabCursor: true,
      freeMode: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
    })
  }
  function initSwiperPrint() {
    swiperPrint = new Swiper('.swiper-print-js', {
      wrapperClass: "swiper-wrapper",
      slideClass: "print__block",
      direction: 'horizontal',
      loop: false,
      watchOverflow: true,
      setWrapperSize: false,
      spaceBetween: 18,
      slidesPerView: 'auto',
      normalizeSlideIndex: true,
      grabCursor: true,
      freeMode: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
    })
  }
  function initSwiperReasons() {
    swiperReasons = new Swiper('.swiper-reasons-js', {
      wrapperClass: "swiper-wrapper",
      slideClass: "reasons__box",
      direction: 'horizontal',
      loop: false,
      watchOverflow: true,
      setWrapperSize: false,
      spaceBetween: 18,
      slidesPerView: 'auto',
      normalizeSlideIndex: true,
      grabCursor: true,
      freeMode: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
    })
  }

  $(_window).on("load resize", function() {
    let msnrGridBlog = $("[masonry-blog-js]"),
      msnrGridTestimonials = $("[masonry-testimonials-js]"),
      msnrGridPrint = $("[masonry-print-js]");

    if($(_window).width() < 768) {

      initSwiperBlog();
      initSwiperTestimonials();
      initSwiperPrint();
      initSwiperReasons();

      msnrGridBlog.masonry('destroy');
      msnrGridTestimonials.masonry('destroy');
      msnrGridPrint.masonry('destroy');

    } else {
      if(swiperBlog !== 0) {
        swiperBlog.destroy();
      }

      if(swiperTestimonials !== 0) {
        swiperTestimonials.destroy();
      }

      if(swiperPrint !== 0) {
        swiperPrint.destroy();
      }


      if(swiperReasons !== 0) {
        swiperReasons.destroy();
      }

      initMasonry('[masonry-blog-js]', '.blogs__block');
      initMasonry('[masonry-testimonials-js]', '.testimonials__block');
      initMasonry('[masonry-print-js]', '.print__block');
      initMasonry('[masonry-faq-js]', '.quesAns__block');
    }
  });
  // ====================


  //
  // ====================
  function funcName() {}
  _document.on("click", "", function(e) {});
  // ====================


  //////////
  // SLIDERS
  //////////
  function initSliders(){
    var slickNextArrow = '<div class="slick-prev"><svg class="ico ico-back-arrow"><use xlink:href="img/sprite.svg#ico-back-arrow"></use></svg></div>';
    var slickPrevArrow = '<div class="slick-next"><svg class="ico ico-next-arrow"><use xlink:href="img/sprite.svg#ico-next-arrow"></use></svg></div>'

    // General purpose sliders
    $('[js-slider]').each(function(i, slider){
      var self = $(slider);

      // set data attributes on slick instance to control
      if (self && self !== undefined) {
        self.slick({
          autoplay: self.data('slick-autoplay') !== undefined ? true : false,
          dots: self.data('slick-dots') !== undefined ? true : false,
          arrows: self.data('slick-arrows') !== undefined ? true : false,
          prevArrow: slickNextArrow,
          nextArrow: slickPrevArrow,
          infinite: self.data('slick-infinite') !== undefined ? true : true,
          speed: 300,
          slidesToShow: 1,
          accessibility: false,
          adaptiveHeight: true,
          draggable: self.data('slick-no-controls') !== undefined ? false : true,
          swipe: self.data('slick-no-controls') !== undefined ? false : true,
          swipeToSlide: self.data('slick-no-controls') !== undefined ? false : true,
          touchMove: self.data('slick-no-controls') !== undefined ? false : true
        });
      }

    })

    // other individual sliders goes here
    $('[js-myCustomSlider]').slick({

    })

  }

  //////////
  // MODALS
  //////////

  function initPopups(){
    // Magnific Popup
    var startWindowScroll = 0;
    $('[js-popup]').magnificPopup({
      type: 'inline',
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: true,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'popup-buble',
      callbacks: {
        beforeOpen: function() {
          startWindowScroll = _window.scrollTop();
          // $('html').addClass('mfp-helper');
        },
        close: function() {
          // $('html').removeClass('mfp-helper');
          _window.scrollTop(startWindowScroll);
        }
      }
    });

    $('[js-popup-gallery]').magnificPopup({
  		delegate: 'a',
  		type: 'image',
  		tLoading: 'Загрузка #%curr%...',
  		mainClass: 'popup-buble',
  		gallery: {
  			enabled: true,
  			navigateByImgClick: true,
  			preload: [0,1]
  		},
  		image: {
  			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
  		}
  	});
  }

  function closeMfp(){
    $.magnificPopup.close();
  }

  ////////////
  // UI
  ////////////

  // textarea autoExpand
  _document
    .one('focus.autoExpand', '.ui-group textarea', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', '.ui-group textarea', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
        this.rows = minRows + rows;
    });

  // Masked input
  function initMasks(){
    $("[js-dateMask]").mask("99.99.99",{placeholder:"ДД.ММ.ГГ"});
    $("input[type='tel']").mask("+7 (000) 000-0000", {placeholder: "+7 (___) ___-____"});
  }


  ////////////
  // SCROLLMONITOR - WOW LIKE
  ////////////
  function initScrollMonitor(){
    $('.wow').each(function(i, el){

      var elWatcher = scrollMonitor.create( $(el) );

      var delay;
      if ( $(window).width() < 768 ){
        delay = 0
      } else {
        delay = $(el).data('animation-delay');
      }

      var animationClass = $(el).data('animation-class') || "wowFadeUp";

      var animationName = $(el).data('animation-name') || "wowFade";

      elWatcher.enterViewport(throttle(function() {
        $(el).addClass(animationClass);
        $(el).css({
          'animation-name': animationName,
          'animation-delay': delay,
          'visibility': 'visible'
        });
      }, 100, {
        'leading': true
      }));
    });

  }


  //////////
  // LAZY LOAD
  //////////
  function initLazyLoad(){
    _document.find('[js-lazy]').Lazy({
      threshold: 500,
      enableThrottle: true,
      throttle: 100,
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      effectTime: 350,
      // visibleOnly: true,
      // placeholder: "data:image/gif;base64,R0lGODlhEALAPQAPzl5uLr9Nrl8e7...",
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      },
      beforeLoad: function(element){
        // element.attr('style', '')
      }
    });
  }

  //////////
  // BARBA PJAX
  //////////

  Barba.Pjax.Dom.containerClass = "page";

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {
      var deferred = Barba.Utils.deferred();

      anime({
        targets: this.oldContainer,
        opacity : .5,
        easing: easingSwing, // swing
        duration: 300,
        complete: function(anim){
          deferred.resolve();
        }
      })

      return deferred.promise
    },

    fadeIn: function() {
      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility : 'visible',
        opacity : .5
      });

      anime({
        targets: "html, body",
        scrollTop: 0,
        easing: easingSwing, // swing
        duration: 150
      });

      anime({
        targets: this.newContainer,
        opacity: 1,
        easing: easingSwing, // swing
        duration: 300,
        complete: function(anim) {
          triggerBody()
          _this.done();
        }
      });
    }
  });

  // set barba transition
  Barba.Pjax.getTransition = function() {
    return FadeTransition;
  };

  Barba.Prefetch.init();
  Barba.Pjax.start();

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {

    pageReady();
    closeMobileMenu();

  });

  // some plugins get bindings onNewPage only that way
  function triggerBody(){
    $(window).scroll();
    $(window).resize();
  }

  //////////
  // DEVELOPMENT HELPER
  //////////
  function setBreakpoint(){
    var wHost = window.location.host.toLowerCase()
    var displayCondition = wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0
    if (displayCondition){
      console.log(displayCondition)
      var wWidth = _window.width();

      var content = "<div class='dev-bp-debug'>"+wWidth+"</div>";

      $('.page').append(content);
      setTimeout(function(){
        $('.dev-bp-debug').fadeOut();
      },1000);
      setTimeout(function(){
        $('.dev-bp-debug').remove();
      },1500)
    }
  }

});
