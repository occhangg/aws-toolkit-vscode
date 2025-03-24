/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { UiMessagePublisher } from '../../../../amazonq/messages/messagePublisher'
import { ChatItemType } from '../../../../amazonq/commons/model'

export interface CodeReference {
    filePath: string
    lineNumber: number
    content: string
}

export interface ChatMessage {
    type: ChatItemType
    tabID?: string
    message?: string
    messageID?: string
}

export class AppToWebViewMessageDispatcher {
    private readonly publisher: UiMessagePublisher<any>

    constructor(publisher: UiMessagePublisher<any>) {
        this.publisher = publisher
    }

    public sendChatMessage(message: ChatMessage) {
        this.publisher.publish({
            command: 'chat-response',
            ...message,
        })
    }

    public sendAuthenticationUpdate(authenticated: boolean, tabIDs: string[]) {
        this.publisher.publish({
            command: 'auth-update',
            authenticated,
            tabIDs,
        })
    }

    public sendChatInputEnabled(tabID?: string, enabled: boolean = true) {
        this.publisher.publish({
            command: 'chat-input-enabled',
            tabID,
            enabled,
        })
    }

    public sendCommandMessage(data: any) {
        this.publisher.publish({
            command: 'command-response',
            ...data,
        })
    }
}
