import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { generateUploadUrl } from '../../businessLogic/todos.mjs'

const generateUploadUrlHandler = async (event) => {
  const todoId = event.pathParameters.todoId
  const url = await generateUploadUrl(todoId)

  return {
    statusCode: 201,
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}

export const handler = middy(generateUploadUrlHandler)
  .use(httpErrorHandler())
  .use(cors({
      credentials: true
  }))