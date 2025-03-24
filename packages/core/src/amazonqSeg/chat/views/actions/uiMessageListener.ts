/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { MessageListener } from '../../../../amazonq/messages/messageListener'
import { ExtensionMessage } from '../../../../amazonq/webview/ui/commands'
import { ChatControllerEventEmitters } from '../../controller/controller'

type UIMessage = ExtensionMessage & {
    tabID?: string
}

export interface UIMessageListenerProps {
    readonly chatControllerEventEmitters: ChatControllerEventEmitters
    readonly webViewMessageListener: MessageListener<any>
}

export class UIMessageListener {
    private segControllerEventsEmitters: ChatControllerEventEmitters | undefined
    private webViewMessageListener: MessageListener<any>

    constructor(props: UIMessageListenerProps) {
        this.segControllerEventsEmitters = props.chatControllerEventEmitters
        this.webViewMessageListener = props.webViewMessageListener

        // Listen to events from the webview
        this.webViewMessageListener.onMessage((msg) => {
            this.handleMessage(msg)
        })
    }

    private handleMessage(msg: ExtensionMessage) {
        switch (msg.command) {
            case 'seg':
                this.seg(msg)
                break
            case 'new-tab-was-created':
                this.tabOpened(msg)
                break
            case 'tab-was-removed':
                this.tabClosed(msg)
                break
            case 'auth-follow-up-was-clicked':
                this.authClicked(msg)
                break
            case 'form-action-click':
                this.formActionClicked(msg)
                break
            case 'chat-prompt':
                this.processChatPrompt(msg)
                break
            case 'response-body-link-click':
                this.linkClicked(msg)
                break
        }
    }

    private processChatPrompt(msg: UIMessage) {
        this.segControllerEventsEmitters?.processHumanChatMessage.fire({
            message: msg.chatMessage,
            tabID: msg.tabID,
        })
    }

    private seg(msg: UIMessage) {
        this.segControllerEventsEmitters?.segSelected.fire({
            tabID: msg.tabID,
        })
    }

    private tabOpened(msg: UIMessage) {
        this.segControllerEventsEmitters?.tabOpened.fire({
            tabID: msg.tabID,
        })
    }

    private tabClosed(msg: UIMessage) {
        this.segControllerEventsEmitters?.tabClosed.fire({
            tabID: msg.tabID,
        })
    }

    private authClicked(msg: UIMessage) {
        this.segControllerEventsEmitters?.authClicked.fire({
            tabID: msg.tabID,
            authType: msg.authType,
        })
    }

    private formActionClicked(msg: UIMessage) {
        this.segControllerEventsEmitters?.formActionClicked.fire({
            ...msg,
        })
    }

    private linkClicked(msg: UIMessage) {
        this.segControllerEventsEmitters?.linkClicked.fire({
            ...msg,
        })
    }
}
