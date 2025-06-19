<template>
  <component :is="showLayout ? DefaultLayout : 'div'">
    <router-view />
  </component>
</template>

<script>
import DefaultLayout from './layouts/DefaultLayout.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
  components: { DefaultLayout },
  setup() {
    const route = useRoute();

    const showLayout = computed(() => {
      return route.path !== '/login';
    });

    return { showLayout, DefaultLayout };
  }
};


</script>