<template>
  <DefaultLayout>
    <template #header>
      <AppHeader title="일정 수정" :back="true" backTo="calendars/info" />
    </template>

    <div class="calendar-form-page">
      <div class="page-top-space"></div>

      <CalendarForm v-if="form":form="form" mode="input">

      <div class="button-area">
        <AppButton text="저장" @click="saveCalendar" />
      </div>
      </CalendarForm>

      <div class="page-bottom-space"></div>
    </div>
    <template #footer>
      <AppFooter />
    </template>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import AppButton from '@/components/commons/AppButton.vue';
import CalendarForm from '@/components/calendars/CalendarForm.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from '@/layouts/AppFooter.vue';

const route = useRoute();
const router = useRouter();

const form = ref(null);

const fetchCalendar = async () => {
  try {
    const res = await axios.get(
      `http://localhost:3000/calendars/${route.params.id}`
    );
    form.value = res.data;
    console.log(form.value);
  } catch (error) {
    console.log(error);
  }
};

const saveCalendar = async () => {
  try {
    await axios.put(
      `http://localhost:3000/calendars/${route.params.id}`,
      form.value
    );

    router.push({
      name: 'calendars/info',
      params: { id: route.params.id },
    });
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchCalendar();
});

</script>

<style scoped>
.calendar-form-page {
  padding: 0 18px 22px;
  background-color: #f3f3f3;
  box-sizing: border-box;
  min-height: 100%;
}

.button-area {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.page-top-space {
  height: 56px;
}

.page-bottom-space {
  height: 60px;
}
</style>
