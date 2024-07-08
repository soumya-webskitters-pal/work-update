$(function () {
  const timeDelay = 500;
  const sound = "images/chat.mp3";

  $("#getStart").on("click", function () {
    $("#botStartup").fadeOut(200);
    setTimeout(function () {
      $("#botContainer").fadeIn().addClass("show");
      print(0);
      setTimeout(function () {
        print(1);
      }, timeDelay * 2.5);
    }, 200);
  });

  $(document).on('click', '.checkbox input[type="radio"]', function () {
    if ($(this).prop("checked", true)) {
      let selectedIndex = $(this).attr("value"),
        name = $(this).attr("name"),
        txt = $(this).next().text(),
        el = $(".chat_list:visible").eq($(".chat_list:visible").length - 1);

      $(".checkbox input[type='radio']").each(function () {
        if ($(this).attr("name") == name) {
          $(this).parents(".chat_list").addClass("disable");
        }
      });

      let tr_el = $("[data-id='" + selectedIndex + "']").attr("data-end");

      setTimeout(function () {
        chat(el, txt);
      }, timeDelay);
      setTimeout(function () {
        print(selectedIndex);
        if (tr_el == "true") {
          setTimeout(function () {
            print("thankyou1");
            setTimeout(function () {
              print("thankyou2");
            }, timeDelay * 2.5);
          }, timeDelay * 2.5);
        }
        if (selectedIndex == "restart") {
          setTimeout(function () {
            $(".chat_list:not(.bot)").remove();
            $(".checkbox input[type='radio']").prop("checked", false);
            $(".chat_list").removeClass("disable").hide();
            print(0);
            setTimeout(function () {
              print(1);
            }, timeDelay * 2.5);
          }, timeDelay * 5);
        }
      }, timeDelay * 2.5);
    }
  });

  function chat(target, MyChat) {
    setTimeout(function () {
      target.after('<div class="chat_list disable"><div class="chat_list_inner"><figure><img src="images/user.png" alt=""></figure><p>' + MyChat + '</p></div></div>');
      new Audio(sound).play();
    }, timeDelay);
  }

  function print(printId) {
    setTimeout(function () {
      $("[data-id='" + printId + "']").fadeIn(800);
      new Audio(sound).play();
      document.getElementById("chatList").scrollTo(0, document.getElementById("chatList").scrollHeight);
    }, timeDelay);
  }
});