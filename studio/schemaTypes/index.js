import { product } from './product'
import { category } from './category'
import { banner } from './banner'
import { post } from './post'
import { settings } from './settings'
import { testimonial } from './testimonial'
import { faq } from './faq'
import { popupPromotion } from './popupPromotion'

export const schemaTypes = [
  // Content
  product,
  category,
  banner,
  popupPromotion,
  post,

  // Site Config
  settings,

  // Supporting
  testimonial,
  faq,
]
