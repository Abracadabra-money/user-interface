<template>
  <div class="loader">Loading...</div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.loader,
.loader:before,
.loader:after {
  width: 2em;
  height: 2em;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: load7 1.8s infinite ease-in-out;
  animation: load7 1.8s infinite ease-in-out;
}
.loader {
  color: #ffffff;
  font-size: 6px;
  margin: 0;
  position: relative;
  text-indent: -9999em;
  -webkit-transform: translateZ(0) translateY(-100%);
  -ms-transform: translateZ(0) translateY(-100%);
  transform: translateZ(0) translateY(-100%);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
  line-height: 0;
}
.loader:before,
.loader:after {
  content: "";
  position: absolute;
  top: 0;
}
.loader:before {
  left: -3em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loader:after {
  left: 3em;
}

@keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
</style>
