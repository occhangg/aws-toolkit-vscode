/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { SEGSDK } from '../../amazonqGumby/client/seg'
import { CompleteClientActionInput, CompleteClientActionOutput } from '../../amazonqGumby/client/segclient'
import {
    CreateUploadUrlOutput,
    CreateUploadUrlInput,
    ListMessagesInput,
    ListClientActionsInput,
    ListClientActionsOutput,
    GetClientActionInput,
    CreateDownloadUrlInput,
    CreateDownloadUrlOutput,
} from '../../amazonqGumby/client/segclient'
import {
    BatchGetMessagesOutput,
    SendMessageInput,
    SendMessageOutput,
    GetClientActionOutput,
} from '../../amazonqGumby/client/segclient'

export const createAgent = async (): Promise<string> => {
    const client = await SEGSDK()

    return client
        .startTransformBuilder()
        .promise()
        .then((res) => {
            const k = 1
            return res.$response.data?.definitionId ?? 'no data from api'
        })
        .catch((err) => {
            throw new Error(err)
        })
}

export const createUploadUrl = async (input: CreateUploadUrlInput): Promise<CreateUploadUrlOutput> => {
    const client = await SEGSDK()

    return client
        .createUploadUrl(input)
        .promise()
        .then((res) => {
            const k = 1
            return res
        })
        .catch((err) => {
            throw new Error(err)
        })
}

export const createDownloadUrl = async (input: CreateDownloadUrlInput): Promise<CreateDownloadUrlOutput> => {
    const client = await SEGSDK()

    return client
        .createDownloadUrl(input)
        .promise()
        .then((res) => {
            const k = 1
            return res
        })
        .catch((err) => {
            throw new Error(err)
        })
}

export const listMessages = async (input: ListMessagesInput): Promise<BatchGetMessagesOutput> => {
    const client = await SEGSDK()

    const msgs = await client
        .listMessages(input)
        .promise()
        .then((res) => {
            const k = 1
            return res
        })
        .catch((err) => {
            throw new Error(err)
        })
    return client
        .batchGetMessages({
            context: {
                ...input.context,
            },
            messageIds: msgs.messageIds || [],
        })
        .promise()
        .then((res) => {
            const k = 1
            return res
        })
        .catch((err) => {
            throw new Error(err)
        })
}

export const sendMessage = async (input: SendMessageInput): Promise<SendMessageOutput> => {
    const client = await SEGSDK()

    return client.sendMessage(input).promise()
}

export const listClientActions = async (input: ListClientActionsInput): Promise<ListClientActionsOutput> => {
    const client = await SEGSDK()

    const msg = await client
        .listClientActions(input)
        .promise()
        .then((res) => {
            const k = 1
            return res
        })
        .catch((err) => {
            throw new Error(err)
        })

    return msg
}

export const getClientAction = async (input: GetClientActionInput): Promise<GetClientActionOutput> => {
    const client = await SEGSDK()

    return await client
        .getClientAction(input)
        .promise()
        .then((res) => {
            const k = 1
            return res
        })
        .catch((err) => {
            throw new Error(err)
        })
}

export const completeClientAction = async (input: CompleteClientActionInput): Promise<CompleteClientActionOutput> => {
    const client = await SEGSDK()

    return await client
        .completeClientAction(input)
        .promise()
        .then((res) => {
            const k = 1
            return res
        })
        .catch((err) => {
            throw new Error(err)
        })
}
