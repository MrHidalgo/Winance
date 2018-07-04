$(document).ready(function () {

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
  function pageReady() {
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
    initMasonry('[masonry-support-js]', '.support__box');

    filterMasonry("[blogs-pagination-js]", "[masonry-blog-js]", ".blogs__block");
    filterMasonry("[quesAns-pagination-js]", "[masonry-faq-js]", ".quesAns__block");
    filterMasonry("[support-pagination-js]", "[masonry-support-js]", ".support__box");

    inputRangeInit();
    closeMobileMenu();

    swiperMasonryInit();

    cabinetPagination("[partners-size-js]");
    cabinetPagination("[partner-format-js]");
    cabinetPagination("[bill-filter-js]");
    cabinetPagination("[investment-filter-js]");

    technologyHoverBlock();
    technologyHoverTimeLine();

    initSelect();
    billFilterTable();
    investmentFilterBlock();

    // initTypograf();

    initShowMore();

    editFormCabinetInformation();

    initCopyText("[copy-btn-js]");

    if($(".calc").length > 0) {
      initCalc();
    }

    viewportControl();
    _window.on('resize', debounce(viewportControl, 200));

    // development helper
    _window.on('resize', debounce(setBreakpoint, 200));

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
  _window.on('load', function () {
    // your functions
  });


  //////////
  // COMMON
  //////////

  function legacySupport() {
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
    .on('click', '[href="#"]', function (e) {
      e.preventDefault();
    })
    .on('click', 'a[href^="#section"]', function () { // section scroll
      var el = $(this).attr('href');
      $('body, html').animate({
        scrollTop: $(el).offset().top
      }, 1000);
      return false;
    })


  // HEADER SCROLL
  // add .header-static for .page or body
  // to disable sticky header
  function initHeaderScroll() {
    _window.on('scroll', throttle(function (e) {
      var vScroll = _window.scrollTop();
      var header = $('.header').not('.header--static');
      var headerHeight = header.height();
      var firstSection = _document.find('.page__content div:first-child()').height() - headerHeight;
      var visibleWhen = Math.round(_document.height() / _window.height()) > 2.5

      if (visibleWhen) {
        if (vScroll > headerHeight) {
          header.addClass('is-fixed');
        } else {
          header.removeClass('is-fixed');
        }
        if (vScroll > firstSection) {
          header.addClass('is-fixed-visible');
        } else {
          header.removeClass('is-fixed-visible');
        }
      }
    }, 10));
  }


  // HAMBURGER TOGGLER
  _document.on('click', '[hamburger-js]', function (e) {
    $(e.currentTarget).toggleClass('is-active');
    $("[nav-mobile-js]").toggleClass("is-show");
    $("body, html").toggleClass("is-hideScroll");
  });

  function closeMobileMenu() {
    $("[hamburger-js]").removeClass('is-active');
    $("[nav-mobile-js]").removeClass("is-show");
    $("body, html").removeClass("is-hideScroll");
  }

  // SET ACTIVE CLASS IN HEADER
  // * could be removed in production and server side rendering when header is inside barba-container
  function updateHeaderActiveClass() {
    $('.header__menu li').each(function (i, val) {
      if ($(val).find('a').attr('href') == window.location.pathname.split('/').pop()) {
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
    _document.on("click", bntName, function (e) {
      var elem = $(e.currentTarget),
        attrElem = elem.attr("data-pagination"),
        blogBlock = $(blockName),
        masonryGrid = $(masonryName);

      $(bntName).removeClass("is-active");
      elem.addClass("is-active");

      var masonryGridOption = {
        itemSelector: blockName + '.is-show',
        gutter: 18,
        horizontalOrder: true
      };

      if ($(_window).width() > 767) {
        masonryGrid.masonry(masonryGridOption);
      }

      if($(".support__box").length > 0) {
        masonryGrid.masonry(masonryGridOption);
      }

      if (attrElem === "all") {

        blogBlock
          .removeClass("is-hide")
          .addClass("is-show");

      } else {

        blogBlock
          .removeClass("is-hide")
          .addClass("is-show")
          .each(function (idx, val) {
            var elemAttr = $(val).attr("data-filter");

            if (elemAttr.indexOf(attrElem) === -1) {
              $(val)
                .addClass("is-hide")
                .removeClass("is-show");
            }
          });

        if($(".support__box").length > 0) {
          masonryGrid
            .masonry('reloadItems')
            .masonry('layout');
        }
      }

      if ($(_window).width() > 767) {
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
  _document.on("click", "[about-btn-js]", function (e) {
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
  _document.on("click", "[tabs-btn-js]", function (e) {
    var elem = $(e.currentTarget),
      elemAttr = elem.attr("data-tabs-btn");

    $("[tabs-btn-js]").removeClass("is-active");
    elem.addClass("is-active");

    $(".calc__tabs-body").removeClass("is-active");
    $(".calc__tabs-body[data-tabs-body='" + elemAttr + "']").addClass("is-active");
  });
  // ====================


  //
  // ====================
  var objOptionBLock = [
    {
      color: 'rgba(58, 103, 217, 0.65)',
      left: '0',
      height: '131px'
    },
    {
      color: 'rgba(58, 103, 217, 0.84)',
      left: '240px',
      height: '171px'
    },
    {
      color: 'rgba(58, 103, 217, 1)',
      left: '480px',
      height: '229px'
    },
    {
      color: 'rgba(16, 173, 180, 1)',
      left: '720px',
      height: '329px'
    },
    {
      color: 'rgba(58, 103, 217, 0.91)',
      left: '960px',
      height: '208px'
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
        class="animated slideInUp main__line main__line-${idx}"
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
      arrNum = [],
      arrNumReverse = [];

    // DEFAULT BLOCK - center...
    for (var i = 0, len = objOptionBLock.length; i < len; i++) {
      defaultBlockContainer.append(lineBlockTmpl(
        i,
        "",
        "",
        ""
      ));
    }

    // CALC NEED BLOCK LEFT AND RIGHT...
    for (var j = 0; j < need; j++) {
      var tmpNum = need;

      tmpNum - j;

      if ((tmpNum - j) > 1) {
        arrNum.push(240);
        arrNumReverse.unshift(240);
      } else {
        arrNum.push(parseInt((need - j) * 240));
        arrNumReverse.unshift(parseInt((need - j) * 240));
      }
    }


    // POSITION RIGHT BLOCK...
    for (
      var k = 0, lenRight = arrNum.length, countStartRight = arrNum.length, sumRight = 0;
      k < lenRight;
      k++, countStartRight--
    ) {

      sumRight += arrNum[countStartRight - 1];

      mainBlockContainer.append(lineBlockTmpl(
        k,
        arrNum[k] + "px",
        "auto",
        (arrNum[k] === 240) ? (sumRight) + "px" : 0 + "px"
      ));
    }


    // POSITION LEFT BLOCK...
    if (arrNumReverse.length !== 0) {
      var sumLeft = arrNumReverse.reduce(function (previousValue, currentValue, index, array) {
        return previousValue + currentValue;
      });
    }

    for (
      var l = 0, lenLeft = arrNumReverse.length, countStartLeft = arrNumReverse.length, countEndLeft = objOptionBLock.length - 1;
      l < lenLeft;
      l++, countStartLeft--, countEndLeft--
    ) {

      sumLeft -= arrNumReverse[countStartLeft - 1];

      mainBlockContainer.prepend(lineBlockTmpl(
        countEndLeft,
        arrNumReverse[countStartLeft - 1] + "px",
        (arrNumReverse[countStartLeft - 1] === 240) ? (sumLeft) + "px" : 0 + "px",
        "auto"
      ));
    }

    stickyMainText(".main__line-1", ".main__line-col--0");
    stickyMainText(".main__line-2", ".main__line-col--1");
    stickyMainText(".main__line-3", ".main__line-col--2");
  }

  function clearMainBLock() {
    $("[main-line-js] .main__line").remove();
  }

  function stickyMainText(blockClassName, textClassName) {
    let leftWrapOffset = $(".main__line-box").offset().left,
      leftOffsetElem = $(".main__line-box " + blockClassName).offset().left,
      textBlock = $(textClassName);

    textBlock.css({
      "left": leftOffsetElem - leftWrapOffset
    });
  }

  $(_window).on("load resize", function () {
    if ($(_window).width() >= 768) {
      if ($(".homepage .main").length > 0) {
        clearMainBLock();
        createMainBlock();
      }
    }
  });
  // ====================


  //
  // ====================
  function inputRangeInit() {
    $('input[type=range]').on('input', function (e) {
      var min = e.target.min,
        max = e.target.max,
        val = e.target.value;

      $(e.target).css({
        'backgroundSize': (val - min) * 100 / (max - min) + '% 100%'
      });
    }).trigger('input');
  }

  // ====================
  // ====================
  function resizeInputs(elem) {
    let text = elem.val().replace(/\s+/g, ' '),
      i = elem.next('i');

    let width = i.width();

    if(text !== '') {
      i.text(text);
    } else {
      i.text("");
    }

    width = i.width();
    elem.css('width', width + 8);
  }

  function initCalcValue(rangeNameElem, inputDataElem) {
    let monthRange = $(rangeNameElem),
      monthRangeVal = monthRange.val(),
      monthRangeMax = monthRange.max,
      monthRangeMin = monthRange.min;

    let monthDataElem = $(inputDataElem);

    monthDataElem.value = monthRangeVal;
    monthRange.css({
      'backgroundSize': (monthRangeVal - monthRangeMin) * 100 / (monthRangeMax - monthRangeMin) + '% 100%'
    });
    resizeInputs(monthDataElem);
  }

  function changeInputDataVal(inputElem, minVal, maxVal, defaultVal) {
    $(inputElem).on("input", function(e) {
      console.log(`changeInputDataVal`);
      let elem = $(e.target),
        elemVal = elem.val(),
        rangeElem = elem.closest(".calc__tabs-col").find("input[type='range']"),
        rangeMax = rangeElem[0].max,
        rangeMin = rangeElem[0].min;

      if(elemVal >= minVal && elemVal <= maxVal) {
        rangeElem.val(elemVal);
        rangeElem.css({
          'backgroundSize': (elemVal - rangeMin) * 100 / (rangeMax - rangeMin) + '% 100%'
        });
      } else {
        rangeElem.val(defaultVal);
        rangeElem.css({
          'backgroundSize': '0% 100%'
        });
      }

      resizeInputs(elem);
    });
  }

  function limitValueInput(inputDataElem, minVal) {
    $(inputDataElem).on("blur", function(e) {
      let elem = $(e.target);

      if(elem.val() === "") {
        elem.val(minVal);
      }
    });
  }

  function maskInput(inputElem, maxVal) {
    $(inputElem).mask(maxVal, {
      translation: {
        'Z': {
          pattern: /[0-9]/,
          optional: true
        }
      }
    });
  }

  function rangeInput(rangeName, inputDataElem) {
    $(rangeName).on("input", function(e) {
      let elem = $(e.target),
        elemVal = (elem.val()),
        monthData = $(inputDataElem);

      monthData.val(elemVal);
      resizeInputs(monthData);
    });
  }

  /**
   * INIT CALC DATA
   */
  function initCalc() {
    maskInput("[maskMonth-js]", "ZZ");
    maskInput("[maskSumRu-js]", 'ZZZZZZZ');
    maskInput("[maskSumEn-js]", 'ZZZZZZ');
    maskInput("[maskSumEu-js]", 'ZZZZZZ');

    changeInputDataVal("[monthDataRu-calc-js]", 1, 12, "1");
    changeInputDataVal("[sumDataRu-calc-js]", 100, 5000000, "100");
    changeInputDataVal("[monthDataEn-calc-js]", 1, 12, "1");
    changeInputDataVal("[sumDataEn-calc-js]", 100, 100000, "100");
    changeInputDataVal("[monthDataEu-calc-js]", 1, 12, "1");
    changeInputDataVal("[sumDataEu-calc-js]", 100, 100000, "100");

    limitValueInput("[monthDataRu-calc-js]", "1");
    limitValueInput("[sumDataRu-calc-js]", "100");
    limitValueInput("[monthDataEn-calc-js]", "1");
    limitValueInput("[sumDataEn-calc-js]", "100");
    limitValueInput("[monthDataEu-calc-js]", "1");
    limitValueInput("[sumDataEu-calc-js]", "100");

    rangeInput("[monthRangeRu-calc-js]", "[monthDataRu-calc-js]");
    rangeInput("[sumRangeRu-calc-js]", "[sumDataRu-calc-js]");
    rangeInput("[monthRangeEn-calc-js]", "[monthDataEn-calc-js]");
    rangeInput("[sumRangeEn-calc-js]", "[sumDataEn-calc-js]");
    rangeInput("[monthRangeEu-calc-js]", "[monthDataEu-calc-js]");
    rangeInput("[sumRangeEu-calc-js]", "[sumDataEu-calc-js]");

    initCalcValue("[monthRangeRu-calc-js]", "[monthDataRu-calc-js]");
    initCalcValue("[sumRangeRu-calc-js]", "[sumDataRu-calc-js]");
    initCalcValue("[monthRangeEn-calc-js]", "[monthDataEn-calc-js]");
    initCalcValue("[sumRangeEn-calc-js]", "[sumDataEn-calc-js]");
    initCalcValue("[monthRangeEu-calc-js]", "[monthDataEu-calc-js]");
    initCalcValue("[sumRangeEu-calc-js]", "[sumDataEu-calc-js]");
  }
  // ====================


  //
  // ====================
  let swiperBlog = 0,
    swiperTestimonials = 0,
    swiperPrint = 0,
    swiperFaq = 0,
    swiperReasons = 0;

  function initSwiperBlog() {
    swiperBlog = new Swiper('.swiper-blog-js', {
      wrapperClass: "swiper-wrapper",
      slideClass: "blogs__block",
      direction: 'horizontal',
      loop: false,
      watchOverflow: true,
      setWrapperSize: false,
      // spaceBetween: 18,
      slidesPerView: 'auto',
      normalizeSlideIndex: true,
      grabCursor: true,
      freeMode: true
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
      // spaceBetween: 18,
      slidesPerView: 'auto',
      normalizeSlideIndex: true,
      grabCursor: true,
      freeMode: true
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
      // spaceBetween: 18,
      slidesPerView: 'auto',
      normalizeSlideIndex: true,
      grabCursor: true,
      freeMode: true
    })
  }

  function initSwiperFaq() {
    swiperFaq = new Swiper('.swiper-faq-js', {
      wrapperClass: "swiper-wrapper",
      slideClass: "quesAns__block",
      direction: 'horizontal',
      loop: false,
      watchOverflow: true,
      setWrapperSize: false,
      // spaceBetween: 18,
      slidesPerView: 'auto',
      normalizeSlideIndex: true,
      grabCursor: true,
      freeMode: true
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
      // spaceBetween: 18,
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

  function swiperMasonryInit() {
    $(_window).on("load resize", function () {

      function masonryOpt(blockName) {
        return {
          itemSelector: blockName,
          gutter: 18,
          horizontalOrder: true
        };
      }

      var msnrGridBlog = $("[masonry-blog-js]"),
        msnrGridTestimonials = $("[masonry-testimonials-js]"),
        msnrGridFaq = $("[masonry-faq-js]"),
        msnrGridPrint = $("[masonry-print-js]");

      if ($(_window).width() < 768) {
        initSwiperBlog();
        initSwiperTestimonials();
        initSwiperPrint();
        initSwiperReasons();
        initSwiperFaq();

        if (msnrGridBlog.length) {
          msnrGridBlog.masonry('destroy');
        }
        if (msnrGridTestimonials.length) {
          msnrGridTestimonials.masonry('destroy');
        }
        if (msnrGridPrint.length) {
          msnrGridPrint.masonry('destroy');
        }
        if (msnrGridFaq.length) {
          msnrGridFaq.masonry('destroy');
        }

      } else {

        if ($(".swiper-blog-js").length > 0 && swiperBlog !== 0) {
          swiperBlog.destroy(true, true);
          swiperBlog = 0;
        }
        if ($(".swiper-testimonials-js").length > 0 && swiperTestimonials !== 0) {
          swiperTestimonials.destroy(true, true);
          swiperTestimonials = 0;
        }
        if ($(".swiper-print-js").length > 0 && swiperPrint !== 0) {
          swiperPrint.destroy(true, true);
          swiperPrint = 0;
        }
        if ($(".swiper-faq-js").length > 0 && swiperFaq !== 0) {
          swiperFaq.destroy(true, true);
          swiperFaq = 0;
        }
        if ($(".swiper-reasons-js").length > 0 && swiperReasons !== 0) {
          swiperReasons.destroy(true, true);
          swiperReasons = 0;
        }

        msnrGridBlog.masonry(masonryOpt('.blogs__block'));
        msnrGridTestimonials.masonry(masonryOpt('.testimonials__block'));
        msnrGridPrint.masonry(masonryOpt('.print__block'));
        msnrGridFaq.masonry(masonryOpt('.quesAns__block'));
      }
    });
  }
  // ====================


  //
  // ====================
  _document.on("click", "[main-tabs-js]", function (e) {
    let elem = $(e.currentTarget),
      elemAttrVal = elem.attr("data-id");

    $("[main-tabs-js]").removeClass("is-active");
    elem.addClass("is-active");

    $(".tabs__container").removeClass("is-active");
    $(".tabs__container-" + elemAttrVal).addClass("is-active");
  });
  // ====================


  //
  // ====================
  function technologyHoverBlock() {
    $("[hover-tech-js] [hover-elem-js]").hover(
      function(e) {
        let elem = $(e.currentTarget),
          elemAttrId = elem.attr("data-hover-id"),
          elemAttrBlock = elem.attr("data-hover-block");

        let hoverElem = $("[find-hover-js][data-hover-id='" + elemAttrId + "']");

        let timeLineBlocks = $("[timeline-hover-js]");


        timeLineBlocks.addClass("is-opacity");
        $("[timeline-hover-js][data-block='" + elemAttrBlock + "']").removeClass("is-opacity");

        $("[find-hover-js]").removeClass("is-hover");
        hoverElem.addClass("is-hover");
      },
      function(e) {
        $("[find-hover-js]").removeClass("is-hover");
        $("[timeline-hover-js]").removeClass("is-opacity");
      }
    );
  }
  function technologyHoverTimeLine() {
    $("[timeline-hover-js]").not("[timeline-hover-js][data-block='']").hover(
      function(e) {
        let elem = $(e.currentTarget),
          elemAttrId = elem.attr("data-block");

        let timeLineBlocks = $("[timeline-hover-js]");

        $("[find-hover-js][data-hover-id='" + elemAttrId + "']").addClass("is-hover");

        timeLineBlocks.addClass("is-opacity");
        $("[timeline-hover-js][data-block='" + elemAttrId + "']").removeClass("is-opacity");
      },
      function(e) {
        $("[find-hover-js]").removeClass("is-hover");
        $("[timeline-hover-js]").removeClass("is-opacity");
      }
    );
  }
  // ====================


  //
  // ====================
  function initSelect() {
    $("[selectric-js]")
      .selectric({
        inheritOriginalWidth: true,
        onInit: function(event) {
          let elem = $(event),
            elemWidth = elem[0].offsetWidth;

          elem.closest(".selectric-wrapper").css({
            width: (elemWidth < 200) ? elemWidth + (38 / 2) : elemWidth + 38
          })
        }
      });
  }
  // ====================


  // ====================
  function cabinetPagination(btnName) {
    _document.on("click", btnName, function(e) {
      let elem = $(e.target);

      $(btnName).removeClass("is-active");
      elem.addClass("is-active");
    })
  }
  // ====================


  // ====================
  function billFilterTable() {
    _document.on("click", "[bill-filter-js]", function (e) {
      let elem = $(e.target),
        elemAttr = elem.attr("data-pagination");

      let table = $("[bill-table-js]"),
        tableRow = $("[bill-table-js] .bill__table-row"),
        tableRowFilter = $("[bill-table-js] .bill__table-row[data-filter='" + elemAttr + "']");

      tableRow.css({
        display : "flex"
      });
      tableRowFilter.css({
        display : "none"
      });
    });
  }
  // ====================


  // ====================
  function investmentFilterBlock() {
    _document.on("click", "[investment-filter-js]", function (e) {
      let elem = $(e.target),
        elemAttr = elem.attr("data-pagination");

      let investmentBlock = $("[investment-block-js]");

      if(elemAttr === "all") {
        investmentBlock.show();
      } else {
        investmentBlock.hide();
        $(".investment__block[data-filter='" + elemAttr + "']").show();
      }
    });
  }
  // ====================


  // ====================
  function initTypograf() {
    var tp = new Typograf({
      locale: ['ru', 'en-US']
    });

    var elem = document.querySelector('.page__content');

    elem.innerHTML = tp.execute(elem.innerHTML);
  }
  // ====================


  // ====================
  function testimonialsTemplate(classMod){
    return `
      <a class="testimonials__block testimonials__block-${classMod}" title="" href="#">
        <div class="testimonials__block-header">
          <div class="testimonials__block-left">
            <div class="testimonials__block-icon"><i class="icon-user"></i></div>
          </div>
          <div class="testimonials__block-right">
            <p>Артем Коновалов</p>
            <p>Начинающий инвестор</p>
          </div>
        </div>
        <div class="testimonials__block-body">
          <p>За 2,5 года площадка StartTrack привлекла в 39 компаний более 940 млн рублей. Площадка является посредником, предоставляет сервис и инфраструктуру, а договорные отношения между инвесторами и компаниями-заемщиками регулируются ГК РФ.</p>
        </div>
      </a>
    `;
  }

  function blogTemplate(classMod) {
    return `
      <a class="blogs__block is-show blogs__block-${classMod}" href="blogDetailsWImage.html" data-filter="business">
        <div class="blogs__block-header">
          <p>Бизнес-планы – готовые <br>примеры вашего предприятия <br>с расчетами</p>
        </div>
        <div class="blogs__block-body">
          <p>От эффективности вашего поведения на рынке зависит ваш заработок. Поэтому придерживаться правильной политики при трейдинге – значит обеспечить себе доход. Выбрать ее достаточно сложно, так как экономика никогда не стоит на месте, все постоянно меняется.</p>
        </div>
        <div class="blogs__block-footer">
          <div class="blogs__block-footer--left">
            <div class="blogs__block-badge">
              <p><span>#</span> Бизнес</p>
            </div>
          </div>
          <div class="blogs__block-footer--right">
            <div class="blogs__block-date">
              <p>12 августа 2018</p>
            </div>
          </div>
        </div>
      </a>
    `;
  }

  function pressTemplate(classMod) {
    return `
      <a class="print__block print__block-${classMod}" title="" href="press.html">
        <div class="print__block-header"><img class="print__block-image" src="./img/img-logo-0__press.png" srcset="./img/img-logo__press@2x.png 2x" title="" alt=""></div>
        <div class="print__block-body">
          <p>«ВЭБ Инновации» проинвестирует в StartTrack 200 млн рублей. Сегодня через площадку StartTrack проходит 60% коллективных инвестиций в РФ в малый и средний бизнес. Инвестиционный потенциал площадки и 2000 аккредитованных инвесторов превышает 7 миллиардов рублей.</p>
        </div>
      </a>
    `;
  }

  function faqTemplate(classMod) {
    return `
      <a class="quesAns__block is-show quesAns__block-${classMod}" href="#" data-filter="investors">
        <div class="quesAns__block-header">
          <p>Бизнес-планы – готовые <br>примеры вашего предприятия с расчетами</p>
        </div>
        <div class="quesAns__block-body">
          <p>Отметим, что все приведенные цифры приблизительны и могут отличаться в зависимости от региона. Итак, обратимся к первичной информации: Первоначальные вложения составят около 2 миллионов. Окупаемость – порядка двух лет. Необходимая площадь...</p>
        </div>
      </a>
    `;
  }

  function showMore(btnName, appendContainer, countBlockName, templateName) {
    _document.on("click", btnName, function (e) {
      let blockMainName = $(appendContainer),
        count = blockMainName.find(countBlockName).length,
        content = templateName(count);

      if(count < 12) {
        blockMainName
          .append(content)
          .masonry("reloadItems")
          .masonry("layout");
      } else {
        return false;
      }
    });
  }

  function initShowMore() {
    showMore("[testimonials-more-js]", "[masonry-testimonials-js]", ".testimonials__block", testimonialsTemplate);
    showMore("[blogs-more-js]", "[masonry-blog-js]", ".blogs__block", blogTemplate);
    showMore("[press-more-js]", "[masonry-print-js]", ".print__block", pressTemplate);
    showMore("[faq-more-js]", "[masonry-faq-js]", ".quesAns__block", faqTemplate);
  }
  // ====================


  // ====================
  function editFormCabinetInformation() {
    _document.on("click", "[edit-form-js]", function (e) {
      let _form = $("[form-info-js]"),
        _formInput = _form.find("input"),
        _formInputParent = _formInput.closest(".form__field");

      _formInput.each(function(idx, val) {
        $(val).removeAttr("readonly");
      });

      _formInputParent.removeClass("form__field--readonly");
    });
  }
  // ====================


  // ====================
  function initCopyText(copyBtnName) {
    new ClipboardJS(copyBtnName);
  }
  // ====================


  // ====================
  function funcName() {
  }

  _document.on("click", "", function (e) {
  });
  // ====================


  // ====================
  // ====================

  //////////
  // SLIDERS
  //////////

  function initSliders() {
    var slickNextArrow = '<div class="slick-prev"><svg class="ico ico-back-arrow"><use xlink:href="img/sprite.svg#ico-back-arrow"></use></svg></div>';
    var slickPrevArrow = '<div class="slick-next"><svg class="ico ico-next-arrow"><use xlink:href="img/sprite.svg#ico-next-arrow"></use></svg></div>'

    // General purpose sliders
    $('[js-slider]').each(function (i, slider) {
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
    $('[js-myCustomSlider]').slick({})

  }

  //////////
  // MODALS
  //////////

  function initPopups() {
    var startWindowScroll = 0;

    $('[playVideo-js]').magnificPopup({
      type: 'iframe',
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: false,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'popup-buble',
      patterns: {
        youtube: {
          index: 'youtube.com/',
          id: 'v=', // String that splits URL in a two parts, second part should be %id%
          src: '//www.youtube.com/embed/%id%?autoplay=1&controls=0&showinfo=0' // URL that will be set as a source for iframe.
        }
      }
    });

    $('[review-btn-js]').magnificPopup({
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
  }

  function closeMfp() {
    $.magnificPopup.close();
  }

  ////////////
  // UI
  ////////////

  // textarea autoExpand
  _document
    .one('focus.autoExpand', '.ui-group textarea', function () {
      var savedValue = this.value;
      this.value = '';
      this.baseScrollHeight = this.scrollHeight;
      this.value = savedValue;
    })
    .on('input.autoExpand', '.ui-group textarea', function () {
      var minRows = this.getAttribute('data-min-rows') | 0, rows;
      this.rows = minRows;
      rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
      this.rows = minRows + rows;
    });

  // Masked input
  function initMasks() {
    $("[js-dateMask]").mask("99.99.99", {placeholder: "ДД.ММ.ГГ"});
    $("input[type='tel']").mask("+7 (000) 000-0000", {placeholder: "+7 (___) ___-____"});

    $("[js-mask-number]").mask("#");

    _document
      .on('keydown', '[js-mask-price]', function(e){
        // https://stackoverflow.com/questions/22342186/textbox-mask-allow-number-only
        // Allow: backspace, delete, tab, escape, enter and .
        // dissallow . (190) for now
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
          // Allow: Ctrl+A
          (e.keyCode == 65 && e.ctrlKey === true) ||
          // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
          return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
        }
        if ( $(this).val().length > 10 ){
          e.preventDefault();
        }
      })
      .on('keyup', '[js-mask-price]', function(e){
        // if number is typed format with space
        if ($(this).val().length > 0){
          $(this).val( $(this).val().replace(/ /g,"") );
          $(this).val( $(this).val().replace(/\B(?=(\d{3})+(?!\d))/g, " ") );
        }
      })
  }

  function viewportControl(){
    var viewportMeta = _document.find('meta[name="viewport"]');
    if ( !viewportMeta.length > 0 ) return

    if (_window.width() < 360) {
      viewportMeta.attr('content', 'width=360, initial-scale=1, minimum-scale=1, user-scalable=no');
    } else {
      viewportMeta.attr('content', 'width=device-width, initial-scale=1, minimum-scale=1, user-scalable=no');
    }
  }

  ////////////
  // SCROLLMONITOR - WOW LIKE
  ////////////
  function initScrollMonitor() {
    $('.wow').each(function (i, el) {

      var elWatcher = scrollMonitor.create($(el));

      var delay;
      if ($(window).width() < 768) {
        delay = 0
      } else {
        delay = $(el).data('animation-delay');
      }

      var animationClass = $(el).data('animation-class') || "wowFadeUp";

      var animationName = $(el).data('animation-name') || "wowFade";

      elWatcher.enterViewport(throttle(function () {
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
  function initLazyLoad() {
    _document.find('[js-lazy]').Lazy({
      threshold: 500,
      enableThrottle: true,
      throttle: 100,
      scrollDirection: 'vertical',
      effect: 'fadeIn',
      effectTime: 350,
      // visibleOnly: true,
      // placeholder: "data:image/gif;base64,R0lGODlhEALAPQAPzl5uLr9Nrl8e7...",
      onError: function (element) {
        console.log('error loading ' + element.data('src'));
      },
      beforeLoad: function (element) {
        // element.attr('style', '')
      }
    });
  }

  //////////
  // BARBA PJAX
  //////////

  Barba.Pjax.Dom.containerClass = "page";

  var FadeTransition = Barba.BaseTransition.extend({
    start: function () {
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function () {
      var deferred = Barba.Utils.deferred();

      anime({
        targets: this.oldContainer,
        opacity: .5,
        easing: easingSwing, // swing
        duration: 300,
        complete: function (anim) {
          deferred.resolve();
        }
      })

      return deferred.promise
    },

    fadeIn: function () {
      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility: 'visible',
        opacity: .5
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
        complete: function (anim) {
          triggerBody()
          _this.done();
        }
      });
    }
  });

  // set barba transition
  Barba.Pjax.getTransition = function () {
    return FadeTransition;
  };

  Barba.Prefetch.init();
  Barba.Pjax.start();

  Barba.Dispatcher.on('newPageReady', function (currentStatus, oldStatus, container, newPageRawHTML) {

    pageReady();
    closeMobileMenu();

  });

  // some plugins get bindings onNewPage only that way
  function triggerBody() {
    $(window).scroll();
    $(window).resize();
  }

  //////////
  // DEVELOPMENT HELPER
  //////////
  function setBreakpoint() {
    var wHost = window.location.host.toLowerCase()
    var displayCondition = wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0
    if (displayCondition) {
      // console.log(displayCondition)
      var wWidth = _window.width();

      var content = "<div class='dev-bp-debug'>" + wWidth + "</div>";

      $('.page').append(content);
      setTimeout(function () {
        $('.dev-bp-debug').fadeOut();
      }, 1000);
      setTimeout(function () {
        $('.dev-bp-debug').remove();
      }, 1500)
    }
  }

});
