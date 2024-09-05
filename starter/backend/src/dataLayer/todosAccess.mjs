import { createLogger } from "../utils/logger.mjs"
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { getUploadUrl } from "../fileStorage/attachmentUtils.mjs"

const logger = createLogger('DATA PROCESSING')
const todosTable = process.env.TODOS_TABLE
const todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX
const dbClient = AWSXRay.captureAWSv3Client(new DynamoDB())
const docClient = DynamoDBDocument.from(dbClient)

export const todosAccess = {
    // CREATE
    async createTodo(todo) {
        logger.info('Create new todo.')

        try {
            await docClient.put({
                TableName: todosTable,
                Item: todo
            })
            return todo
        } catch (error) {
            logger.error('Can not add new todo!!')
            throw new Error(error.message)
        }
    },
    // REFER
    async getTodos(userId) {
        logger.info('Get all todo.')
        try {
            const command = await docClient.query({
                TableName: todosTable,
                IndexName: todosCreatedAtIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            return command.Items
        } catch (error) {
            logger.error('Can not get all todo!!')
            throw new Error(error.message)
        }
    },
    // UPDATE
    async updateTodo(userId, todoId, body) {
        logger.info('Update the todo.')

        try {
            await docClient.update({
                TableName: todosTable,
                Key: {
                    userId,
                    todoId,
                },
                UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
                ExpressionAttributeNames: {
                    '#name': 'name',
                    '#dueDate': 'dueDate',
                    '#done': 'done'
                },
                ExpressionAttributeValues: {
                    ':name': body.name,
                    ':dueDate': body.dueDate,
                    ':done': body.done
                },
                ReturnValues: 'ALL_NEW'
            })
            return "Updated!!"
        } catch (error) {
            logger.error('Can not update the todo!!')
            throw new Error(error.message)
        }
    },
    // DELETE
    async deleteTodo(userId, todoId) {
        logger.info('Delete the todo.')

        try {
            await docClient.delete({
                TableName: todosTable,
                Key: {
                    userId,
                    todoId
                }
            })
            return "Deleted!!"
        } catch (error) {
            logger.error('Can not delete the todo!!')
            throw new Error(error.message)
        }
    },
    // UPLOAD IMAGE
    async getUploadUrl(todoId) {
        logger.info('Generate the uploaded image URL.')

        try {
            return await getUploadUrl(todoId)
        } catch (error) {
            logger.error('Can not upload image or update DB!!')
            throw new Error(error.message)
        }
    }
}