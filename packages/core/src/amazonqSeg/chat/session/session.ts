/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ConversationState {
    READY = 'READY',
    PROCESSING = 'PROCESSING',
    ERROR = 'ERROR',
}

export class Session {
    public tabID: string | undefined
    public conversationState: ConversationState
    public isAuthenticating: boolean

    constructor() {
        this.conversationState = ConversationState.READY
        this.isAuthenticating = false
    }

    public isTabOpen(): boolean {
        return this.tabID !== undefined
    }
}
