<div class="spin-container">
	<img src="/logo.svg" class="logo-image" alt="ReVanced Logo" />
</div>

<style>
.spin-container {
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%, -50%);
  z-index: 1000;
}
.logo-image {
  animation: rotate 2s linear infinite;
  width: 75vmin;
  height: 75vmin;
}
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>
