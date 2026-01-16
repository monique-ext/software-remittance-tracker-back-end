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

        // Define área com base no padrão do filename
        const area = /^.{3}f/i.test(filename) ? "rh" : "tesouraria";

        // Verifica status para definir processed
        const status = params.result[0].result;
        const result = status === "ok"; 

        // Cria objeto para salvar
        const save = new this._remittance({
            ...params.result[0],
            area: area,
            result: result
        });

        await save.save();
        return params;
    }

    async index(filters: any = {}) {
        const { role, filename, result, dataInicial, dataFinal, page = 1, limit = 10 } = filters;
        const query: any = {};

        // Área (role)
        if (role && role !== "admin") {
            query.area = role === "tes" ? "Tesouraria" : role === "rh" ? "Rh" : role;
        }

        // Filename (regex)
        if (filename) {
            query.filename = { $regex: filename, $options: "i" };
        }

        // Status (result)
        if (result !== undefined && result !== null) {
            query.result = result;
        }

        // Filtro por período
        if (dataInicial && !dataFinal) {
            // Apenas dataInicial → só aquele dia
            const startDate = new Date(`${dataInicial}T00:00:00.000Z`);
            const endDate = new Date(`${dataInicial}T23:59:59.999Z`);
            query.date_created = { $gte: startDate, $lte: endDate };
        } else if (!dataInicial && dataFinal) {
            // Apenas dataFinal → a partir dessa data até hoje
            const startDate = new Date(`${dataFinal}T00:00:00.000Z`);
            const today = new Date(); // até agora
            query.date_created = { $gte: startDate, $lte: today };
        } else if (dataInicial && dataFinal) {
            // Intervalo completo
            const startDate = new Date(`${dataInicial}T00:00:00.000Z`);
            const endDate = new Date(`${dataFinal}T23:59:59.999Z`);
            query.date_created = { $gte: startDate, $lte: endDate };
        }

        const skip = (page - 1) * limit;
        console.log(query)
        const [response, total] = await Promise.all([
            this._remittance.find(query).sort({ date_created: -1 }).skip(skip).limit(limit).lean(),
            this._remittance.countDocuments(query)
        ]);

        return { total, page, limit, response };
    }
}