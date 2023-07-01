(function ($) {

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($('#spinner').length > 0) {
        $('#spinner').removeClass('show');
      }
    }, 1000);
  };
  spinner();


  // 联系滚动到底部
  $('.contact').click(function () {
    $('html, body').animate({scrollTop: '2000px'}, 200);
    return false;
  });
  // 自动切换表单
  var s_signup = document.getElementsByClassName('s--signup');
  var cont = document.getElementsByClassName('cont')[0];
  // 登录滚动
  $('.login').click(function () {
    $('html, body').animate({scrollTop: cont.scrollHeight + 270}, 200);
    // 自动切换表单
    if (s_signup.length !== 0) {
      document.querySelector('.cont').classList.toggle('s--signup');
    }
    return false;
  });
  // 注册滚动
  $('.signIn').click(function () {
    $('html, body').animate({scrollTop: cont.scrollHeight + 270}, 200);
    // 自动切换表单
    if (s_signup.length === 0) {
      document.querySelector('.cont').classList.toggle('s--signup');
    }
    return false;
  });
  // 小屏幕注册滚动
  $('.min').click(function () {
    // 自动切换表单
    if (s_signup.length === 0) {
      document.querySelector('.cont').classList.toggle('s--signup');
    }
    return false;
  });
  // 倒计时
  var timerCount = 60;
  // 计时器
  var timerInterval = undefined;
  // 更换文字
  var verification = document.getElementsByClassName('send-verification')[0];
  // 发送验证码
  $('.send-verification').click(function () {
    if (timerInterval) {
      return;
    }
    var regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    var email = document.getElementsByName('signupEmail')[0].value;
    // 判断格式
    if (!regEmail.test(email)) {
      window.parent.postMessage(JSON.stringify({type: 'msg', msg: '邮箱格式错误'}), '*');
      return;
    }
    // 发送验证码
    window.parent.postMessage(JSON.stringify({type: 'emailCode', email}), '*');
    timerCount = 60;
    timerInterval = window.setInterval(() => {
      timerCount -= 1;
      verification.innerHTML = timerCount;
      if (timerCount <= 0) {
        verification.innerHTML = '发送验证码';
        window.clearInterval(timerInterval);
        timerInterval = undefined;
      }
    }, 1000);
  });
  var loading = false;
  var loginInnerHTML = document.getElementsByClassName('submit-sign-in')[0];
  // 登录
  $('.submit-sign-in').click(function () {
    if (loading) {
      return;
    }
    const formData = {
      type: 'login',
      name: document.getElementsByName('name')[0].value,
      password: document.getElementsByName('password')[0].value,
    };
    loading = true;
    loginInnerHTML.innerHTML = 'Loading...';
    window.parent.postMessage(JSON.stringify(formData), '*');
  });
  var signupInnerHTML = document.getElementsByClassName('submit-sign-up')[0];
  // 注册
  $('.submit-sign-up').click(function () {
    if (loading) {
      return;
    }
    const formData = {
      type: 'signIn',
      signupName: document.getElementsByName('signupName')[0].value,
      signupEmail: document.getElementsByName('signupEmail')[0].value,
      signupPassword: document.getElementsByName('signupPassword')[0].value,
      signupCode: document.getElementsByName('signupCode')[0].value
    };
    loading = true;
    signupInnerHTML.innerHTML = 'Loading...';
    window.parent.postMessage(JSON.stringify(formData), '*');
  });

  // qq登录
  $('.qq').click(function () {
    const formData = {
      type: 'qq',
    };
    window.parent.postMessage(JSON.stringify(formData), '*');
  });
  // github登录
  $('.github').click(function () {
    const formData = {
      type: 'github',
    };
    window.parent.postMessage(JSON.stringify(formData), '*');
  });

  document.querySelector('.img__btn').addEventListener('click', function () {
    document.querySelector('.cont').classList.toggle('s--signup');
  });
  window.addEventListener('message', (event) => {
    if (event.data === 'email') {
      verification.innerHTML = '发送验证码';
      window.clearInterval(timerInterval);
      timerInterval = undefined;
    } else if (event.data === 'signIn') {
      loading = false;
      signupInnerHTML.innerHTML = '注册';
    } else if (event.data === 'login') {
      loading = false;
      loginInnerHTML.innerHTML = '登录';
    }
  });
  // Initiate the wowjs
  new WOW().init();


  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 45) {
      $('.navbar').addClass('sticky-top shadow-sm');
    } else {
      $('.navbar').removeClass('sticky-top shadow-sm');
    }
  });

})(jQuery);

