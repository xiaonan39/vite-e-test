import { Style, Stroke, Circle, Fill } from 'ol/style.js'

// 选中feature的高亮渲染
export const useSelectStyle = () => {
  return new Style({
    fill: new Fill({
      color: 'rgba(255,255,255,0.7)'
    }),
    stroke: new Stroke({
      color: '#3399CC',
      width: 3
    }),
    image: new Circle({
      // 圆点样式
      radius: 5,
      fill: new Fill({
        color: '#3399CC'
      })
    })
  })
}

// measure绘制时的样式
export const useMeasureStyle = () => {
  return new Style({
    fill: new Fill({
      // 区域填充色
      color: 'transparent'
    }),
    stroke: new Stroke({
      // 区域边框色
      color: '#f6003c',
      width: 2
    })
  })
}

// 普通绘制层的样式
export const useDrawLayerStyle = () => {
  return new Style({
    stroke: new Stroke({
      // #409eff
      color: '#409eff',
      width: 3
    }),
    fill: new Fill({
      color: 'transparent'
    }),
    image: new Circle({
      radius: 3,
      fill: new Fill({
        color: '#0f0'
      })
    })
  })
}

// ai层样式
export const useAiLayerStyle = () => {
  return new Style({
    stroke: new Stroke({
      // #409eff
      color: '#409eff',
      width: 3
    }),
    fill: new Fill({
      color: 'transparent'
    }),
    image: new Circle({
      radius: 3,
      fill: new Fill({
        color: '#0f0'
      })
    })
  })
}