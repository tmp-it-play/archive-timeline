import screenForm from './screen-form.js'
import screenList from './screen-list.js'
import daoImpl from './dao-impl.js'
import dtoClass from './dto-class.js'
import sql from './sql.js'
import css from './css.js'

export const practicalTopics = [screenForm, screenList, daoImpl, dtoClass, sql, css]

export function getTopicById(id) {
  return practicalTopics.find(t => t.id === id) || null
}
