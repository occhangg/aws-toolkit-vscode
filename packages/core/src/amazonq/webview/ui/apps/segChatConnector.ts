/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseConnector } from './baseConnector'
import { TabType } from '../storages/tabsStorage'

export class Connector extends BaseConnector {
    override getTabType(): TabType {
        return 'seg'
    }

    /**
     * Send a message to the extension to initiate the SEG functionality
     */
    public seg(tabID: string) {
        this.sendMessageToExtension({
            command: 'seg',
            tabID,
        })
    }
}
