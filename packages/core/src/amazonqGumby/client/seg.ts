/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import * as SEGClient from './segclient'
import { AWSError, Credentials, Service } from 'aws-sdk'
import { ServiceOptions } from '../../shared/awsClientBuilder'
import globals from '../../shared/extensionGlobals'
import apiConfig = require('./service-2.json')

let client: SEGClient | undefined

const createSEGClient = async (): Promise<SEGClient> => {
    return (await globals.sdkClientBuilder.createAwsService(
        Service,
        {
            apiConfig: apiConfig,
            region: 'us-west-2',
            endpoint: 'http://zongrenl-segst.integ.amazon.com:10000',
        } as ServiceOptions,
        undefined
    )) as SEGClient
}

export const SEGSDK = async (): Promise<SEGClient> => {
    if (client) {
        return client
    }

    client = await createSEGClient()
    return client
}
