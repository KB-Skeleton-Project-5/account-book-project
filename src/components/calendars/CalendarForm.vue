<template>
  <div class="form-card">

    <div class="wrapper">
      <label>제목</label>

      <input
        v-if="mode === 'input'"
        type="text"
        v-model="form.title"
      />

      <div
        v-else
        class="value-box"
      >
        {{ form.title }}
      </div>
    </div>

    <div class="wrapper">
      <label>날짜</label>

      <input
        v-if="mode === 'input'"
        type="date"
        v-model="form.date"
      />

      <div
        v-else
        class="value-box"
      >
        {{ form.date }}
      </div>
    </div>

    <div class="wrapper">
      <label>시간</label>

      <input
        v-if="mode === 'input'"
        type="time"
        v-model="form.time"
      />

      <div
        v-else
        class="value-box"
      >
        {{ form.time }}
      </div>
    </div>

    <div class="wrapper">
      <label>입출금내역</label>

      <input
        v-if="mode === 'input'"
        type="text"
        v-model="form.expenseId"
      />

      <div
        v-else
        class="value-box"
      >
        {{ form.expenseId }}
      </div>
    </div>

    <div class="wrapper">
      <label>메모</label>

      <textarea
        v-if="mode === 'input'"
        v-model="form.memo"
      ></textarea>

      <div
        v-else
        class="value-box textarea-value"
      >
        {{ form.memo }}
      </div>
    </div>
    <slot/>
  </div>
</template>

<script setup>

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },

  mode: {
    type: String,
    default: 'input', // input | value
  },
});

const { form, mode } = props;

</script>

<style scoped>
.form-card {
  background-color: #f3ecd6;
  border-radius: 14px;
  padding: 22px 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.wrapper label {
  font-size: 14px;
  font-weight: 500;
  color: #222;
}

.wrapper input {
  width: 100%;
  height: 44px;
  background-color: #f3f3f3;
  border: none;
  padding: 0 12px;
  box-sizing: border-box;
}

.wrapper textarea {
  width: 100%;
  min-height: 100px;
  background-color: #f3f3f3;
  border: none;
  padding: 12px;
  box-sizing: border-box;
  resize: none;
}

/* info용 */

.value-box {
  width: 100%;
  min-height: 44px;
  background-color: #f3f3f3;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.textarea-value {
  min-height: 100px;
  align-items: flex-start;
}

.wrapper input:focus,
.wrapper textarea:focus {
  outline: none;
}
</style>