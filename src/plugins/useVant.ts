import { App } from 'vue'
import {
  Form,
  RadioGroup,
  Radio,
  Cell,
  CellGroup,
  Icon,
  Dialog,
  Progress,
  ConfigProvider
} from 'vant'
import 'vant/es/dialog/style'

const comps = [
  Form,
  RadioGroup,
  Radio,
  Cell,
  CellGroup,
  Icon,
  Dialog,
  Progress,
  ConfigProvider
]

export function useVant(app: App<Element>) {
  comps.forEach((comp) => {
    app.use(comp)
  })
}
