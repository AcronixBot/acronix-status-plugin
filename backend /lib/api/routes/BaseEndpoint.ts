import { Express, Request, Response, NextFunction } from 'express';

interface BaseApiEndpointOptions {
    path: string,
    mode: 'get' | 'post'
    expressApp: Express;
    private: boolean
}

export class BaseApiEndpoint {
    public path: string = "";
    public mode: string = "";
    public private: boolean = false;
    public header: string = "";
    public api: Express;
    constructor(options: BaseApiEndpointOptions) {
        this.path = options.path;
        this.mode = options.mode;
        this.private = options.private;
        this.api = options.expressApp;
    }

    
    
    // api.use / get / post, etc...
    public do() {
        //
    }

    /**handles cookies */
    public middleware(req: Request, res: Response, next: NextFunction) {
        //
    }

    /** 
     * what should happens after the endpoint gets called
    */
    public use(req: Request, res: Response) {
        //
    }

}
