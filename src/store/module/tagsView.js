import { defineStore } from 'pinia'
import { routes as defaultRoutes } from '@/router'
const useTagsViewStore = defineStore(
  'tag-view',
  {
    state: () => ({
      visitedViews: [],
      cachedViews: [],
      routes: defaultRoutes
    }),
    actions: {
      addView(view) {
        this.addVisitedView(view)
        this.addCachedView(view)
      },
      addVisitedView(view) {
        if (this.visitedViews.some(v => v.path === view.path)) return
        console.log(view)
        this.visitedViews.push(
          Object.assign({}, view, {
            title: view.meta.title || 'no-name'
          })
        )
      },
      addCachedView(view) {
        if (this.cachedViews.includes(view.name)) return
        if (!view.meta.noCache) {
          this.cachedViews.push(view.name)
        }
      },
      updateVisitedView(view) {
        for (let v of this.visitedViews) {
          if (v.path === view.path) {
            v = Object.assign(v, view)
            break
          }
        }
      }
    }
  }
)
export default useTagsViewStore