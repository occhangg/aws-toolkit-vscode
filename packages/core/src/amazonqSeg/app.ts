/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import * as vscode from 'vscode'
import { AmazonQAppInitContext } from '../amazonq/apps/initContext'
import { MessagePublisher } from '../amazonq/messages/messagePublisher'
import { MessageListener } from '../amazonq/messages/messageListener'
import { ChatControllerEventEmitters, SegController } from './chat/controller/controller'
import { AppToWebViewMessageDispatcher } from './chat/views/connector/connector'
import { Messenger } from './chat/controller/messenger/messenger'
import { UIMessageListener } from './chat/views/actions/uiMessageListener'
import { debounce } from 'lodash'
import { AuthUtil } from '../codewhisperer/util/authUtil'
import { ChatSessionManager } from './chat/storages/chatSession'

export function init(appContext: AmazonQAppInitContext) {
    const segChatControllerEventEmitters: ChatControllerEventEmitters = {
        segSelected: new vscode.EventEmitter<any>(),
        authClicked: new vscode.EventEmitter<any>(),
        formActionClicked: new vscode.EventEmitter<any>(),
        commandSentFromIDE: new vscode.EventEmitter<any>(),
        tabOpened: new vscode.EventEmitter<any>(),
        tabClosed: new vscode.EventEmitter<any>(),
        processHumanChatMessage: new vscode.EventEmitter<any>(),
        linkClicked: new vscode.EventEmitter<any>(),
    }

    const dispatcher = new AppToWebViewMessageDispatcher(appContext.getAppsToWebViewMessagePublisher())
    const messenger = new Messenger(dispatcher)

    new SegController(segChatControllerEventEmitters, messenger, appContext.onDidChangeAmazonQVisibility.event)

    const segChatUIInputEventEmitter = new vscode.EventEmitter<any>()

    new UIMessageListener({
        chatControllerEventEmitters: segChatControllerEventEmitters,
        webViewMessageListener: new MessageListener<any>(segChatUIInputEventEmitter),
    })

    appContext.registerWebViewToAppMessagePublisher(new MessagePublisher<any>(segChatUIInputEventEmitter), 'seg')

    const debouncedEvent = debounce(async () => {
        const authenticated = (await AuthUtil.instance.getChatAuthState()).amazonQ === 'connected'
        let authenticatingSessionID = ''

        if (authenticated) {
            const session = ChatSessionManager.Instance.getSession()

            if (session.isTabOpen() && session.isAuthenticating) {
                authenticatingSessionID = session.tabID!
                session.isAuthenticating = false
            }
        }

        messenger.sendAuthenticationUpdate(authenticated, [authenticatingSessionID])
    }, 500)

    AuthUtil.instance.secondaryAuth.onDidChangeActiveConnection(() => {
        return debouncedEvent()
    })
}
