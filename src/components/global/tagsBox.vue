<template>
  <el-tag v-for="tag in dynamicTags.label" :key="tag" :closable="dynamicTags.state == '编辑'" :disable-transitions="false" @close="handleClose(tag)" class="tag">
    {{ tag }}
  </el-tag>
  <el-input
    v-if="inputVisible"
    ref="InputRef"
    v-model="inputValue"
    size="small"
    @keyup.enter="handleInputConfirm"
    @blur="handleInputConfirm"
    style="width: 100px" />
  <el-button v-else class="button-new-tag" size="small" @click="showInput">+ {{ props.text ?? "新增标签" }}</el-button>
</template>

<script setup>
const inputValue = ref("");
const dynamicTags = defineModel();
const props = defineProps(["text"]);
const inputVisible = ref(false);
const InputRef = ref(null);

const handleClose = (tag) => {
  dynamicTags.value.label.splice(dynamicTags.value.label.indexOf(tag), 1);
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value.input.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.label.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};
</script>

<style lang="scss" scoped>
.tag {
  margin-right: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
}
</style>
