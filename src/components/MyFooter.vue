<template>
  <footer>
    <div class="container">
      <div class="row">
        <div class="col-md-4 col-sm-4 text-center">
          2025 &copy; - <a href="#" style="margin-left: 4px">SXY</a>
        </div>
        <div class="col-md-4 col-sm-4 text-center">
          <a
            style="color: #6c757d; text-decoration: none"
            target="_blank"
            href="http://beian.miit.gov.cn/"
          >
            鲁ICP备2025169195号-1
          </a>
        </div>
        <div class="col-md-4 col-sm-4">
          <ul class="social-share" style="text-align: center">
            <li>
              <a href="#"><i class="bi bi-wechat" title="sxy13370658284"></i></a>
            </li>
            <li>
              <a href="#"><i class="bi bi-tencent-qq" title="2195007463"></i></a>
            </li>
            <li>
              <a href="#"><i class="bi bi-envelope" title="2195007463@qq.com"></i></a>
            </li>
            <li>
              <a href="https://github.com/ARotterGoodMan" target="_blank" title="ARotterGoodMan">
                <i class="bi bi-github"></i
              ></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup></script>

<style scoped>
footer {
  background-color: #1e1e1e;
  color: #ffffff;
  font-size: 14px;
  font-weight: 300;
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 50px;
  z-index: 99999;
}

footer div:first-child {
  line-height: 40px;
}

footer a {
  color: #d2924c;
  font-size: 16px;
  font-weight: 400;
  text-decoration: none;
}

footer a:hover {
  color: #e4840d;
}

footer .social-share {
  margin-top: 4px;
}

footer ul {
  margin-bottom: 0;
}

footer .social-share li a i {
  background-color: #ffffff;
  border-radius: 50%;
  border: 1px solid #1e1e1e;
  display: inline-block;
  font-size: 15px;
  line-height: 30px;
  width: 30px;
  height: 30px;
}

footer .social-share li a i:hover {
  background-color: #af6f20;
  color: #ffffff;
}

footer .footer-nav {
  float: right;
  /*margin-top: 10px;*/
}

footer .footer-nav li {
  display: inline-block;
  list-style: none;
  margin-left: 15px;
}

@media (max-width: 767px) {
  footer {
    text-align: center;
  }

  footer .footer-nav {
    float: none;
    padding: 0;
  }

  footer .social-share {
    margin: 20px 0;
  }
}
</style>
