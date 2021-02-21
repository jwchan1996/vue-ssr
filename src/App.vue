<template>
  <div id="app">
    <!-- <h1>{{ message }}</h1>
    <h2>客户端动态交互</h2>
    <div>
      <input v-model="message" />
    </div>
    <div>
      <button @click="onClick">点击测试</button>
    </div> -->

    <ul>
      <li>
        <router-link to='/'>Home</router-link>
      </li>
      <li>
        <router-link to='/about'>About</router-link>
      </li>
    </ul>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: '飘香豆腐'
    }
  },
  methods: {
    onClick() {
      console.log('Hello World!')
    }
  }
}
</script>

<style>

</style>