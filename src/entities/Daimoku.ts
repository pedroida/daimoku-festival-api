import { BaseModel } from "./BaseModel.js";

export class Daimoku extends BaseModel {
    memberCode?: string;
    memberName?: string;
    distritoId: string;
    date: Date;
    minutes: number;

    constructor(data: Partial<Daimoku>) {
        super();
        Object.assign(this, data);
    }
}