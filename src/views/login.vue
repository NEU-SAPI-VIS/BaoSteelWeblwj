<template>
  <div class="login-container">
    <div class="layer">
      <div class="some-space">
        <div class="form">
          <h2>基于大数据可视化的厚板性能<br />质量智能监控与异常诊断系统</h2>
          <div class="item">
            <i class="fa fa-user fa-2x"></i>
            <input autocomplete="off" type="text" class="input" v-model="userInfo.name" placeholder="请输入用户名" />
          </div>
          <div class="item">
            <i class="fa fa-key fa-2x"></i>
            <input autocomplete="off" type="password" class="input" v-model="userInfo.pwd" maxlength="20" @keyup.enter="login" placeholder="请输入密码" />
          </div>
          <button class="loginBtn" @click.stop="login">
            立即登录
          </button>
        </div>
      </div>
    </div>

    <vue-particles color="#6495ED" :particleOpacity="0.7" :particlesNumber="80" shapeType="circle" :particleSize="4" linesColor="#6495ED" :linesWidth="1" :lineLinked="true" :lineOpacity="0.6" :linesDistance="150" :moveSpeed="3"
      :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
    </vue-particles>

    <bgAnimation />
    <!-- 
    <modal title="提示" :content="modalContent" :visible.sync="visible" @confirm="confirm">
    </modal> -->

  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex"
import bgAnimation from 'components/login/bgAnimation.vue';
export default {
  name: 'Login',
  components: { bgAnimation },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted() {
  },
  methods: {
    login() {
      if (this.userInfo.name == 'liucheng613' && this.userInfo.pwd == 'woshimima') {
        this.$router.push('/visual')
      } else {
        this.$message.error('用户名或密码错误');
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  .layer {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  #particles-js {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
  }
  .some-space {
    color: white;
    font-weight: 100;
    letter-spacing: 2px;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1001;
    -webkit-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0);

    -ms-animation: cloud 2s 3s ease-in infinite alternate;
    -moz-animation: cloud 2s 3s ease-in infinite alternate;
    -webkit-animation: cloud 2s 3s ease-in infinite alternate;
    -o-animation: cloud 2s 3s ease-in infinite alternate;
    -webkit-animation: cloud 2s 3s ease-in infinite alternate;
    animation: cloud 2s 3s ease-in infinite alternate;

    .form {
      width: 460px;
      height: auto;
      background: rgba(36, 36, 85, 0.5);
      margin: 0 auto;
      padding: 35px 30px 25px;
      box-shadow: 0 0 25px rgba(255, 255, 255, 0.5);
      border-radius: 10px;
      h2 {
        line-height: 1.5em;
      }
      .item {
        display: flex;
        align-items: center;
        margin-bottom: 25px;
        border-bottom: 1px solid #d3d7f7;
        i {
          color: #d3d7f7;
          margin-right: 10px;
        }
      }
      h2 {
        text-align: center;
        font-weight: normal;
        font-size: 26px;
        color: #d3d7f7;
        padding-bottom: 35px;
      }
      .input {
        font-size: 16px;
        line-height: 30px;
        width: 100%;
        color: #d3d7f7;
        outline: none;
        border: none;
        background-color: rgba(0, 0, 0, 0);
        padding: 10px 0;
      }
      .loginBtn {
        width: 100%;
        padding: 12px 0;
        border: 1px solid #d3d7f7;
        font-size: 16px;
        color: #d3d7f7;
        cursor: pointer;
        background: transparent;
        border-radius: 4px;
        margin-top: 10px;
        &:hover {
          color: #fff;
          background: #0090ff;
          border-color: #0090ff;
        }
      }
      .tip {
        font-size: 12px;
        padding-top: 20px;
      }
    }
  }
}

input::-webkit-input-placeholder {
  color: #d3d7f7;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #d3d7f7;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #d3d7f7;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #d3d7f7;
}

@-ms-keyframes cloud {
  0% {
    -ms-transform: translate(-50%, -50%);
  }
  40% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  100% {
    -ms-transform: translate(-50%, -40%);
  }
}
@-moz-keyframes cloud {
  0% {
    -moz-transform: translate(-50%, -50%);
  }
  40% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  100% {
    -moz-transform: translate(-50%, -40%);
  }
}
@-o-keyframes cloud {
  0% {
    -o-transform: translate(-50%, -50%);
  }
  40% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  100% {
    -o-transform: translate(-50%, -40%);
  }
}
@-webkit-keyframes cloud {
  0% {
    -webkit-transform: translate(-50%, -50%);
  }
  40% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  100% {
    -webkit-transform: translate(-50%, -40%);
  }
}
@keyframes cloud {
  0% {
    transform: translate(-50%, -50%);
  }
  40% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -40%);
  }
}
</style>
