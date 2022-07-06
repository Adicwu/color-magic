<template>
  <div ref="selfEl" class="test">
    <div class="test-title">
      <b>Taylor Hartman</b>
      <p>泰勒·哈特曼</p>
    </div>
    <div class="test-desc">
      <h2>哈特曼性格素描档案</h2>
      <p>填写时请尽可能的详实，在 认识真实的自己 上欺骗自己是毫无意义的。</p>
      <ul>
        <li>请尽可能依你最早的回忆来回答</li>
        <li>别犹豫，也别参考他人的想法</li>
        <li>果断的标出你感觉最熟悉的想法和行动</li>
      </ul>
    </div>
    <div class="test-progress">
      <van-config-provider
        :theme-vars="{
          'progress-height': '4px',
          'progress-color': 'rgb(0 0 0 / 49%)',
          'progress-background-color': 'transparent'
        }"
      >
        <van-progress :show-pivot="false" :percentage="progress" />
      </van-config-provider>
    </div>

    <van-form>
      <div class="form-title">
        性格的力量与局限
        <p>*请从四个选项中选择最符合您的一项</p>
      </div>
      <van-radio-group
        v-for="(item, index) in resultOne"
        :key="index"
        :ref="(e) => radioGroups.push(e)"
        v-model="item.value"
      >
        <van-cell-group inset>
          <van-cell
            v-for="(cel, i) in POWER_LIMIT[index]"
            :key="i"
            :class="{ active: item.value === i }"
            :title="cel"
            clickable
            @click="changeRadio(item, i)"
          >
            <template #right-icon>
              <van-radio :name="i">
                <template #icon>
                  <div
                    class="radio-circle"
                    :class="{ active: item.value === i }"
                  ></div>
                </template>
              </van-radio>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-form>
    <van-form class="form-q">
      <div class="form-title">
        情境
        <p>*请尝试涉身其境，选择您的做法</p>
      </div>
      <template v-for="(item, index) in resultTwo" :key="index">
        <div class="form-q__title">
          {{ index + 1 }}. {{ SITUATION[index].q }}
        </div>
        <van-radio-group :ref="(e) => radioGroups.push(e)" v-model="item.value">
          <van-cell-group inset>
            <van-cell
              v-for="(cel, i) in SITUATION[index].v"
              :key="i"
              :class="{ active: item.value === i }"
              :title="cel"
              clickable
              @click="changeRadio(item, i)"
            >
              <template #right-icon>
                <van-radio :name="i">
                  <template #icon>
                    <div
                      class="radio-circle"
                      :class="{ active: item.value === i }"
                    ></div>
                  </template>
                </van-radio>
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </template>
    </van-form>
    <van-form class="form-result">
      <div class="form-title">
        全部的总分<a :class="{ isSelected }">{{
          isSelected ? '测试完毕' : '未完成'
        }}</a>
      </div>
      <ul>
        <li style="color: #f94c66">红 ({{ resultCount[0] }})</li>
        <li style="color: #1363df">蓝 ({{ resultCount[1] }})</li>
        <li style="color: #fff">白 ({{ resultCount[2] }})</li>
        <li style="color: #ffee63">黄 ({{ resultCount[3] }})</li>
      </ul>
    </van-form>

    <transition
      enter-active-class="animate__fadeInRight"
      leave-active-class="animate__fadeOutRight"
    >
      <div
        v-if="state.scrollEnd && state.helperVisible"
        class="test-helper"
        @click="toFisrtUnselect"
      >
        <van-icon name="fail" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { POWER_LIMIT, SITUATION } from '@/static/colorTest'
import { Dialog, RadioGroup } from 'vant'

const selfEl = ref<HTMLElement>()
const radioGroups = ref<(InstanceType<typeof RadioGroup> | any)[]>([])

const state = reactive({
  scrollEnd: false,
  helperVisible: true
})
const resultOne = reactive(
  POWER_LIMIT.map(() => ({
    value: -1
  }))
)
const resultTwo = reactive(
  SITUATION.map(() => ({
    value: -1
  }))
)

const allReuslt = computed(() => [...resultOne, ...resultTwo])
const resultCount = computed(() =>
  allReuslt.value.reduce<Record<string | number, number>>(
    (totol, item) => {
      totol[item.value]++
      return totol
    },
    {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      '-1': 0
    }
  )
)
const isSelected = computed(() =>
  allReuslt.value.every((item) => item.value !== -1)
)
const progress = computed(() => {
  const count = allReuslt.value.length
  return +(((count - resultCount.value[-1]) / count) * 100).toFixed(0)
})

const mainScroll = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement
  if (clientHeight + scrollTop === scrollHeight) {
    state.scrollEnd = true
    selfEl.value!.removeEventListener('scroll', mainScroll)
  }
}
const toFisrtUnselect = () => {
  const firstIndex = allReuslt.value.findIndex((item) => item.value === -1)
  if (firstIndex === -1) return
  const firstEl = radioGroups.value[firstIndex]?.$el as HTMLElement
  firstEl &&
    firstEl.scrollIntoView({
      block: 'center'
    })
}
const changeRadio = (e: typeof resultOne[0], v: number) => {
  e.value = v
  isSelected.value && (state.helperVisible = false)
}

onMounted(() => {
  selfEl.value!.addEventListener('scroll', mainScroll)
  Dialog({
    title: '注意，如对此测试无兴趣，请尽早退出',
    message:
      '此测试尚在开发阶段，只有结果展示，没有结果分析。如想了解具体解答，可参考《色彩密码》一书'
  })
})
</script>
<style lang="less" scoped>
.test {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: #f7f8f8;

  &-title {
    position: fixed;
    width: 100%;
    height: 200px;
    background: #8b80b6;
    z-index: 1;
    border-bottom-right-radius: 140px;
    padding: 20px;
    box-sizing: border-box;

    b {
      font-size: 36px;
      color: #fff;
    }

    p {
      padding-top: 4px;
      color: rgba(255, 255, 255, 0.837);
    }
  }

  &-desc {
    position: relative;
    margin: 140px 30px 50px 30px;
    background: #fff;
    z-index: 2;
    box-shadow: 0 0 10px #8b80b664;
    border-radius: 8px;
    padding: 16px 24px;
    padding-bottom: 24px;
    box-sizing: border-box;

    h2 {
      font-size: 20px;
    }

    p {
      color: #c1c5cd;
      font-size: 12px;
      line-height: 16px;
    }

    ul {
      font-size: 15px;
      color: #333;
      padding-top: 10px;

      li {
        display: inline-block;
        margin-top: 12px;
        border-bottom: 1px solid #333;
      }
    }
  }

  &-helper {
    position: fixed;
    top: 30%;
    right: 20px;
    width: 50px;
    height: 50px;
    background-color: #fff;
    border-radius: 50%;
    z-index: 10;
    box-shadow: 0 0 24px rgba(220, 20, 60, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    color: crimson;
    font-size: 30px;
    animation-duration: 0.25s;
  }

  &-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 8;

    ::v-deep(.van-progress) {
      border-radius: 0;
    }
  }

  .form-title {
    position: relative;
    font-size: 24px;
    font-weight: 800;
    color: #3a4356;
    z-index: 4;
    text-align: center;
    letter-spacing: 8px;
    p {
      font-size: 12px;
      color: #999;
      letter-spacing: 2px;
    }
  }

  .form-q {
    &__title {
      position: relative;
      margin: 0 20px;
      background: #fff;
      color: #3a4356;
      padding: 10px;
      margin-top: 40px;
      z-index: 4;
      font-size: 20px;
      border-left: 6px solid #8b80b6;
      box-shadow: -4px -4px 14px rgba(0, 0, 0, 0.2);
      border-radius: 4px;

      &::after {
        content: '：';
      }
    }

    ::v-deep(.van-cell-group) {
      margin-top: 14px;
    }
  }

  .form-result {
    ul {
      margin: 30px 20px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      justify-items: center;
      font-size: 18px;
      font-weight: 800;
      background: #000;
      padding: 30px 0;
      border-radius: 6px;
    }

    .form-title {
      a {
        font-size: 14px;
        color: crimson;
        letter-spacing: 0;
      }
    }

    .isSelected {
      color: #3ec70b !important;
    }
  }

  ::v-deep(.van-cell-group) {
    position: relative;
    z-index: 3;
    margin: 30px 20px;
    box-shadow: 0 10px 16px rgba(0, 0, 0, 0.1);

    .van-cell {
      transition: all 0.25s;
      padding: 20px 16px;

      .van-cell__title {
        padding-right: 14px;
      }

      &.active {
        background-color: #8b80b6;
        color: #fff;

        .van-cell__title {
          span {
            font-weight: 800;
          }
        }
      }
    }

    .van-radio {
      overflow: unset;
    }
  }

  .radio-circle {
    position: relative;
    height: 100%;
    aspect-ratio: 1/1;
    border-radius: 50%;
    border: 1px solid #363f53;
    box-sizing: border-box;
    transform: scale(1.5);

    &::before {
      .mask(1, #fff);
      border-radius: 50%;
      transform: scale(0.65);
    }

    &.active {
      border-color: #fff;
    }
  }

  &::after {
    content: '';
    position: relative;
    display: block;
    width: 100%;
    height: 120px;
  }
}
</style>
