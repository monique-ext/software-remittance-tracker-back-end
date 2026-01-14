import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Remittance } from "../entity/remittance.entity";
import { Model, Types } from 'mongoose';


@Injectable()
export class RemittanceService {
    constructor(
        @InjectModel(Remittance.name) private readonly _remittance: Model<Remittance>

    ) { }

    async store(params) {

        if (typeof params === "string") {
            try {
                params = JSON.parse(params);
            } catch (err) {
                throw new Error("Payload inválido. Não foi possível fazer JSON.parse");
            }
        }

        const filename = params.result[0].filename;

        const area = /^.{3}f/i.test(filename) ? "rh" : "tesouraria";
        const save = new this._remittance({ ...params.result[0], area: area })
        await save.save()
        return params
    }

    async index(role) {
        if (role === "admin") role = undefined;
        if (role === "tes") role = "tesouraria";
        if (role === "rh") role = "rh";

        const filter: any = {};
        if (role !== undefined && role !== null) {
            filter.area = role;
        }

        const listRemittance = await this._remittance
            .find(filter)
            .sort({ date_created: -1 })
            .lean();

        return listRemittance;
    }
}