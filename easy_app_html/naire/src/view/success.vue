<template>
  <div class="success">
      <img src="../assets/images/success.png" alt="成功" />
  </div>
</template>

<script>
export default {
  name: 'success',
  mounted () {
    setTimeout(() => {
      this.$router.push('/naireList')
    }, 3000)
  }
}
</script>

<style lang="scss">
.success {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
}
</style>
