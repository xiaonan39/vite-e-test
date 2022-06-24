//平均功能-Hook
import { ref, watch } from "vue"
export function useAverage(addNum) {
  const averageNum = ref(0)
  watch(addNum, (addNum) => {
    averageFn(addNum)
  })
  const averageFn = (addNum) => {
    averageNum.value = addNum / 2
  }
  return {
    averageNum,
    averageFn,
  }
}
