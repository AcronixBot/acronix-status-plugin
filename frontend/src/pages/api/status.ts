import type { NextRequest } from 'next/server'
import { resObjekt } from '../status'
export const config = {
    runtime: 'experimental-edge',
}
export default async function handler(req: NextRequest) {
    // Fetch data from external API
    const _res = await fetch(`<removed>`, {
        headers: {
            'Authorization': "Secret: <removed>"
        }
    })

    if (!_res.ok) {
        let data: resObjekt = {
            notes: [
                {
                    date: 'Now',
                    description: `The Endpoint for the Data is not available. ${_res.statusText}`,
                    title: 'No data',
                    type: 'Info'
                }
            ],
            status: []
        }
        return new Response(
            JSON.stringify(data),
            {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                },
            }
        )
    } else {
        const data = await _res.json()
        return new Response(
            JSON.stringify(data),
            {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                },
            }
        )
    }
}
