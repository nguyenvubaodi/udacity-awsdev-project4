import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { updateTodo } from '../../businessLogic/todos.mjs'

const updateTodoHandler = async (event) => {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const body = JSON.parse(event.body)

  await updateTodo(userId, todoId, body)

  return {
    statusCode: 204,
    body: JSON.stringify({
      message: "Updated successfully."
    })
  }
}

export const handler = middy(updateTodoHandler)
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))