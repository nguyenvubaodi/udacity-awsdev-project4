import * as uuid from 'uuid'
import { createLogger } from '../utils/logger.mjs'
import { todosAccess } from '../dataLayer/todosAccess.mjs'

const logger = createLogger('CRUD Business Logic')
const bucketName = process.env.BUCKET_NAME

// CREATE
export async function createTodo(userId, body) {
    logger.info('Create Processing.')
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
    const todo = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: attachmentUrl,
        ...body
    }
    return await todosAccess.createTodo(todo)
}
// REFER
export async function getTodos(userId) {
    logger.info('Get all processing.')
    return await todosAccess.getTodos(userId)
}
// UPDATE
export async function updateTodo(userId, todoId, body) {
    logger.info('Update processing.')
    return await todosAccess.updateTodo(userId, todoId, body)
}
// DELETE
export async function deleteTodo(userId, todoId) {
    logger.info('Delete processing.')
    return await todosAccess.deleteTodo(userId, todoId)
}
// UPLOAD IMAGE
export async function generateUploadUrl(todoId) {
    logger.info('Upload processing.')
    return await todosAccess.getUploadUrl(todoId)
}