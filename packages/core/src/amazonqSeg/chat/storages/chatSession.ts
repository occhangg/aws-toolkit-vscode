/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Session } from '../session/session'

export class ChatSessionManager {
    private static instance: ChatSessionManager
    private session: Session

    private constructor() {
        this.session = new Session()
    }

    public static get Instance(): ChatSessionManager {
        if (!ChatSessionManager.instance) {
            ChatSessionManager.instance = new ChatSessionManager()
        }
        return ChatSessionManager.instance
    }

    public getSession(): Session {
        return this.session
    }

    public setActiveTab(tabID: string): string {
        this.session.tabID = tabID
        return tabID
    }

    public removeActiveTab(): void {
        this.session.tabID = undefined
    }
}
