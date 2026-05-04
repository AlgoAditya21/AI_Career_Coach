import {inngest} from '@/lib/inngest/client'
import { helloworld } from '@/lib/inngest/functions'
import {serve} from 'inngest/next'

const handler = serve({
    client:inngest,
    functions:[
        helloworld
    ],
})

export const GET = handler
export const POST = handler
export const PUT = handler