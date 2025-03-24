/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
    sendMessage,
    createAgent,
    createUploadUrl,
    listMessages,
    listClientActions as listActions,
    completeClientAction as completeAction,
} from '../../client/mockSEG'
import {
    ListClientActionsInput,
    ListClientActionsOutput,
    ContentType,
    CompleteClientActionInput,
    CompleteClientActionOutput,
} from '../../../amazonqGumby/client/segclient'
import { getClientAction, createDownloadUrl } from '../../client/mockSEG'
import { GetClientActionOutput } from '../../../amazonqGumby/client/segclient'
import {
    ListMessagesInput,
    BatchGetMessagesOutput,
    SendMessageInput,
    SendMessageOutput,
} from '../../../amazonqGumby/client/segclient'

export const startAgent = async (): Promise<string> => {
    return createAgent()
}

export const sendMsgToAgent = async (input: SendMessageInput): Promise<SendMessageOutput> => {
    return sendMessage(input)
}

export const listMsgFromAgent = async (input: ListMessagesInput): Promise<BatchGetMessagesOutput> => {
    return listMessages(input)
}

export const completeClientAction = async (input: CompleteClientActionInput): Promise<CompleteClientActionOutput> => {
    return completeAction(input)
}

export const donwloadByArtifactId = async (artifactId: string): Promise<ReadableStream<Uint8Array> | null> => {
    const { url, headers, ContentType } = await createDownloadUrl({ artifactId })

    if (!url) {
        throw new Error('unable to obtain upload url from server')
    }

    const newHeaders = Object.fromEntries(
        Object.entries(headers || {})
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host
            // .filter(([key]) => key.toLowerCase() !== 'host')
            .map(([key, value]) => {
                const firstValue = Array.isArray(value) && value.length > 0 ? value[0] : ''
                return [key, firstValue]
            })
    )

    return fetch(url, {
        method: 'GET',
        headers: newHeaders,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return Promise.resolve(response.body)
        })
        .catch((err) => {
            throw new Error(`error downloading from s3 presigned url + ${err}`)
        })
}

async function bufferSha256ToBase64(buffer: Buffer): Promise<string> {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return btoa(String.fromCharCode.apply(undefined, hashArray))
}

export const uploadZipFile = async (zipFile: Buffer): Promise<string> => {
    const generatedSHA = await bufferSha256ToBase64(zipFile)
    const { url, headers, artifactId } = await createUploadUrl({
        contentType: 'ZIP',
        sha256Checksum: generatedSHA,
    })

    if (!url) {
        throw new Error('unable to obtain upload url from server')
    }

    const newHeaders = Object.fromEntries(
        Object.entries(headers || {})
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host
            // .filter(([key]) => key.toLowerCase() !== 'host')
            .map(([key, value]) => {
                const firstValue = Array.isArray(value) && value.length > 0 ? value[0] : ''
                return [key, firstValue]
            })
    )

    return fetch(url, {
        method: 'PUT',
        body: zipFile,
        headers: newHeaders,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return Promise.resolve(artifactId || 'No artifact id given from the server!')
        })
        .catch((err) => {
            throw new Error(`error uploading to s3 presigned url + ${err}`)
        })
}

export const listClientActions = async (input: ListClientActionsInput): Promise<GetClientActionOutput[]> => {
    const response = await listActions(input)

    const getActionPromises = response.actions.map((action) => {
        return getClientAction({ context: { ...input.context }, actionId: action.actionId })
    })

    const k = await Promise.all(getActionPromises).then((actions) => {
        return actions.map((action) => {
            return { actionDetail: action.actionDetail }
        })
    })

    return k
}
