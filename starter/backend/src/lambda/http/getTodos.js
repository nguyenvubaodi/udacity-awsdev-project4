import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { getTodos } from '../../businessLogic/todos.mjs'

const getTodosHandler = async (event) => {
  const userId = getUserId(event)
  const todos = await getTodos(userId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos
    })
  }
}

export const handler = middy(getTodosHandler)
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))