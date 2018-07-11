$(document).ready(function () {
  ////////////////
  // FORM VALIDATIONS
  ////////////////

  // jQuery validate plugin
  // https://jqueryvalidation.org


  // GENERIC FUNCTIONS
  ////////////////////

  var validateErrorPlacement = function (error, element) {
    error.addClass('ui-input__validation');
    error.appendTo(element.parent("div"));
  }
  var validateHighlight = function (element) {
    $(element).parent('div').addClass("has-error");
  }
  var validateUnhighlight = function (element) {
    $(element).parent('div').removeClass("has-error");
  }
  var validateSubmitHandler = function (form) {
    $(form).addClass('loading');
    $.ajax({
      type: "POST",
      url: $(form).attr('action'),
      data: $(form).serialize(),
      success: function (response) {
        $(form).removeClass('loading');
        var data = $.parseJSON(response);
        if (data.status == 'success') {
          // do something I can't test
        } else {
          $(form).find('[data-error]').html(data.message).show();
        }
      }
    });
  }

  var validatePhone = {
    required: true,
    normalizer: function (value) {
      var PHONE_MASK = '+X (XXX) XXX-XXXX';
      if (!value || value === PHONE_MASK) {
        return value;
      } else {
        return value.replace(/[^\d]/g, '');
      }
    },
    minlength: 11,
    digits: true
  };

  ////////
  // FORMS


  $(".advice-form-js").validate({
    errorPlacement: validateErrorPlacement,
    highlight: validateHighlight,
    unhighlight: validateUnhighlight,
    submitHandler: validateSubmitHandler,
    rules: {
      name: "required",
      email: {
        required: true,
        email: true
      },
      phone: validatePhone
    },
    messages: {
      name: "Заполните это поле",
      email: {
        required: "Заполните это поле",
        email: "Email содержит неправильный формат"
      },
      phone: {
        required: "Заполните это поле",
        minlength: "Введите корректный телефон"
      }
    }
  });


  $("[reviews-form-js]").validate({
    errorPlacement: validateErrorPlacement,
    highlight: validateHighlight,
    unhighlight: validateUnhighlight,
    submitHandler: validateSubmitHandler,
    rules: {
      reviews_name: "required",
      reviews_surname: "required",
      reviews_email: {
        required: true,
        email: true
      },
      reviews_message: "required"
    },
    messages: {
      reviews_name: "Заполните это поле",
      reviews_surname: "Заполните это поле",
      reviews_email: {
        required: "Заполните это поле",
        email: "Email содержит неправильный формат"
      },
      reviews_message: "Заполните это поле"
    }
  });


  $("[faq-form-js]").validate({
    errorPlacement: validateErrorPlacement,
    highlight: validateHighlight,
    unhighlight: validateUnhighlight,
    submitHandler: validateSubmitHandler,
    rules: {
      faq_subject: "required",
      faq_email: {
        required: true,
        email: true
      },
      faq_message: "required"
    },
    messages: {
      faq_subject: "Заполните это поле",
      faq_email: {
        required: "Заполните это поле",
        email: "Email содержит неправильный формат"
      },
      faq_message: "Заполните это поле"
    }
  });


  $("[about-form-js]").validate({
    errorPlacement: validateErrorPlacement,
    highlight: validateHighlight,
    unhighlight: validateUnhighlight,
    submitHandler: validateSubmitHandler,
    rules: {
      request_name: "required",
      request_email: {
        required: true,
        email: true
      },
    },
    messages: {
      request_name: "Заполните это поле",
      request_email: {
        required: "Заполните это поле",
        email: "Email содержит неправильный формат"
      },
    }
  });


  $("[ticket-form-js]").validate({
    errorPlacement: validateErrorPlacement,
    highlight: validateHighlight,
    unhighlight: validateUnhighlight,
    submitHandler: validateSubmitHandler,
    rules: {
      ticket_subject: "required",
      ticket_department: "required",
      ticket_name: "required",
      ticket_message: "required",
      ticket_email: {
        required: true,
        email: true
      },
    },
    messages: {
      ticket_subject: "Заполните это поле",
      ticket_department: "Заполните это поле",
      ticket_name: "Заполните это поле",
      ticket_message: "Заполните это поле",
      ticket_email: {
        required: "Заполните это поле",
        email: "Email содержит неправильный формат"
      },
    }
  });


  $("[newMessageTicket-js]").validate({
    errorPlacement: validateErrorPlacement,
    highlight: validateHighlight,
    unhighlight: validateUnhighlight,
    submitHandler: validateSubmitHandler,
    rules: {
      support_mess: {
        required: true,
        minlength: 3
      }
    },
    messages: {
      support_mess: {
        required: "Заполните это поле",
        minlength: "Введите минимум 3 символов"
      }
    }
  });


  $("[sign-form-js]").validate({
    errorPlacement: validateErrorPlacement,
    highlight: validateHighlight,
    unhighlight: validateUnhighlight,
    submitHandler: validateSubmitHandler,
    rules: {
      signin_password: {
        required: true,
        minlength: 8
      },
      signin_email: {
        required: true,
        email: true
      },
    },
    messages: {
      signin_password: {
        required: "Заполните это поле",
        minlength: "Введите минимум 8 символов"
      },
      signin_email: {
        required: "Заполните это поле",
        email: "Email содержит неправильный формат"
      },
    }
  });


  $("[register-form-js]").validate({
    errorPlacement: validateErrorPlacement,
    highlight: validateHighlight,
    unhighlight: validateUnhighlight,
    submitHandler: validateSubmitHandler,
    rules: {
      register_name: "required",
      register_sname: "required",
      register_surname: "required",
      register_phone: validatePhone,
      register_email: {
        required: true,
        email: true
      },
      register_pass: {
        required: true,
        minlength: 8
      },
      register_passRepeat: {
        equalTo: "#register_pass"
      },
      register_day: "required",
      register_month: "required",
      register_year: "required",
      register_robot: "required",
      register_approve: "required",
    },
    messages: {
      register_name: "Заполните это поле",
      register_sname: "Заполните это поле",
      register_surname: "Заполните это поле",
      register_phone: {
        required: "Заполните это поле",
        minlength: "Введите корректный телефон"
      },
      register_email: {
        required: "Заполните это поле",
        email: "Email содержит неправильный формат"
      },
      register_pass: {
        required: "Заполните это поле",
        minlength: "Введите минимум 8 символов"
      },
      register_passRepeat: {
        equalTo: "Пожалуйста, введите то же значение снова"
      },
      register_day: "Заполните это поле",
      register_month: "Заполните это поле",
      register_year: "Заполните это поле",
      register_robot: "Заполните это поле",
      register_approve: "",
    }
  });

});
