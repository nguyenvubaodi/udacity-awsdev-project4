import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { deleteTodo } from '../../businessLogic/todos.mjs'

const deleteTodoHandler = async (event) => {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  await deleteTodo(userId, todoId)
  
  return {
    statusCode: 204,
    body: JSON.stringify({
      message: "Delete successfully."
  })
  }
}

export const handler = middy(deleteTodoHandler)
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))