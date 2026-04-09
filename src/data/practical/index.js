import html from './html.js'
import css from './css.js'
import jsp from './jsp.js'
import dao from './dao.js'
import sql from './sql.js'
import servlet from './servlet.js'

export const practicalTopics = [html, css, jsp, dao, sql, servlet]

export function getTopicById(id) {
  return practicalTopics.find(t => t.id === id) || null
}
