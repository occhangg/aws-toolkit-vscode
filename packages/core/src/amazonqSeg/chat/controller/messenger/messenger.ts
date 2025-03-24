/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppToWebViewMessageDispatcher } from '../../views/connector/connector'
import { ChatItemType } from '../../../../amazonq/commons/model'
import { FeatureAuthState } from '../../../../codewhisperer'

export interface SegNamedMessages {
    type: ChatItemType
    tabID?: string
    message?: string
    messageID?: string
}

export class Messenger {
    private readonly dispatcher: AppToWebViewMessageDispatcher

    constructor(dispatcher: AppToWebViewMessageDispatcher) {
        this.dispatcher = dispatcher
    }

    public sendAnswer(data: SegNamedMessages) {
        this.dispatcher.sendChatMessage({
            type: data.type,
            tabID: data.tabID,
            message: data.message,
        })
    }

    public sendErrorMessage(message: string, tabID?: string) {
        this.dispatcher.sendChatMessage({
            type: 'answer',
            tabID: tabID,
            message: message,
        })
    }

    public sendAuthNeededExceptionMessage(authState: FeatureAuthState, tabID?: string) {
        this.dispatcher.sendChatMessage({
            type: 'answer',
            tabID: tabID,
        })
    }

    public sendAuthenticationUpdate(authenticated: boolean, tabIDs: string[]) {
        this.dispatcher.sendAuthenticationUpdate(authenticated, tabIDs)
    }

    public sendChatInputEnabled(tabID?: string, enabled: boolean = true) {
        this.dispatcher.sendChatInputEnabled(tabID, enabled)
    }

    public sendCommandMessage(data: any) {
        this.dispatcher.sendCommandMessage(data)
    }
}
