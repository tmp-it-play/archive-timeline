import htmlBasic from './html-basic.js'
import css from './css.js'
import screenForm from './screen-form.js'
import screenList from './screen-list.js'
import daoImpl from './dao-impl.js'
import dtoClass from './dto-class.js'
import sql from './sql.js'

export const practicalTopics = [htmlBasic, css, screenForm, screenList, daoImpl, dtoClass, sql]

export function getTopicById(id) {
  return practicalTopics.find(t => t.id === id) || null
}
