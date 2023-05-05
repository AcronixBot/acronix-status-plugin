import { BaseApiEndpoint } from './BaseEndpoint.js'
import { Express, Request, Response, NextFunction } from 'express';
import { CronJob } from "cron";
import statusCollection from '../../../src/database/status.js'
import { Client } from 'discord.js';
interface StatusResponse {
    status: MonitorData[],
    notes: NoteData[] | null
}

type status = 'Up' | 'Down' | 'Minor Outage'

enum Status {
    UP = 'Up',
    DOWN = 'Down',
    MINOROUTAGE = 'Minor Outage'
}

interface MonitorData {
    label: string,
    responseTime: number[],
    status: status
}

interface NoteData {
    type: 'Info' | 'Warn' | 'Note'
    title: string,
    description: string,
    date: Date | string | number
}

export class StatusEndpoint extends BaseApiEndpoint {
    constructor(api: Express) {
        super({
            expressApp: api,
            mode: 'get',
            path: '/web/status',
            private: true,
        })
    }

    public override do(): void {
        if (this.private) {
            this.api.get(this.path, this.middleware, this.use)
        } else {
            this.api.get(this.path, this.use)
        }
    }

    public override middleware(req: Request, res: Response, next: NextFunction) {
        if (req.headers.authorization && req.headers.authorization === `Secret: <removed>`) {
            next();
        } else {
            res.sendStatus(403)
        }
    }


    public override async use(req: Request, res: Response): Promise<void> {
        let acceesKey = req.headers.authorization.split(': ')[1];
        let collections = await combineStatusAndNotes(acceesKey);
        res.status(200).send(collections)
    }
}

/**
 * When Saving the responsTimes, i format them so i dont format them here
 * @returns 
 */
export async function combineStatusAndNotes(key: string): Promise<StatusResponse> {
    let collections = await statusCollection.find({ acceesKey: key });
    if (!collections) {
        let obj: StatusResponse = {
            status: [],
            notes: [
                {
                    date: new Date().toUTCString(),
                    description: `Status data for everything is not avalible`,
                    title: `Data is not Avalible`,
                    type: 'Warn'
                }
            ]
        }
        return obj;
    } else {
        if (collections.length === 0) {
            let obj: StatusResponse = {
                status: [],
                notes: [
                    {
                        date: new Date().toUTCString(),
                        description: `Status data for everything is not avalible`,
                        title: `Data is not Avalible`,
                        type: 'Warn'
                    }
                ]
            }
            return obj;
        } else {
            let obj: StatusResponse = {
                status: [],
                notes: []
            }
            for (const collection of collections) {
                obj.status.push({
                    label: collection.type,
                    responseTime: collection.responsTimes,
                    status: collection.status as status
                })
                if (collection.status === Status.MINOROUTAGE) {
                    obj.notes.push({
                        date: new Date().toUTCString(),
                        description: `${collection.type}: Check the Support Server for news.`,
                        title: Status.MINOROUTAGE,
                        type: 'Note'
                    })
                } else if (collection.status === Status.DOWN) {
                    obj.notes.push({
                        date: new Date().toUTCString(),
                        description: `${collection.type}: This is not a planned Downtime in the most cases. Please visit th Support Server for more Informations`,
                        title: Status.DOWN,
                        type: 'Warn'
                    })
                }
            }
            return obj;
        }
    }
}

/**
 * 
 * @param type 
 * @param newMs is the average ms from the day 
 * @returns 
 */
export async function updateStatusDatabase(type: 'BOT' | 'API', newMs: number) {
    let collection = await statusCollection.findOne({ acceesKey: '<removed>', type: type })
    if (!collection) {
        let newCollection = await statusCollection.create({
            acceesKey: '<removed>',
            responsTimes: [newMs],
            status: 'Up',
            type: type
        })
        return newCollection;
    } else {
        let filter = updateAMS(newMs, collection.responsTimes)
        let updatedCollection = await statusCollection.findOneAndUpdate({
            acceesKey: '<removed>',
            type: type
        }, {
            $set: {
                responsTimes: filter,
            }
        })
        return updatedCollection;
    }
}

//req to set newMs in updateStatusDatabase()
export function CronUpdateBotPing(client: Client) {
    new CronJob('@daily',
        async () => {
            await updateStatusDatabase('BOT', Math.round(client.ws.ping))
        },
        null,
        true,
        'America/Los_Angeles'
    )
}


function updateAMS(ms: number, arr: number[]) {
    if (arr.length >= 21) {
        //?delete the first (oldest) elemtnt from the array
        arr.shift()
        //?push the new ms to the end of the array 
        arr.push(ms)
    } else {
        //?push the new ms to the end of the array 
        arr.push(ms)
    }
    //?return the new array
    return arr
}
