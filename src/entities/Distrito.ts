import { BaseModel } from "./BaseModel.js"

export class Distrito extends BaseModel {
    name: string

    constructor(data: Partial<Distrito>) {
        super()
        this.name = data.name
    }
}