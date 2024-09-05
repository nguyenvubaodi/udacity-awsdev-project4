import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { createTodo } from '../../businessLogic/todos.mjs'

const createTodoHandler = async (event) => {
  const userId = getUserId(event)
  const body = JSON.parse(event.body)
  const todo = await createTodo(userId, body)

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: todo
    })
  }
}

export const handler = middy(createTodoHandler)
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))