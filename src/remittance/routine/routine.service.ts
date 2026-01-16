import { Injectable, OnModuleInit } from '@nestjs/common';
import cron from 'node-cron';
import axios from 'axios';
import { InjectModel } from "@nestjs/mongoose";
import { Remittance } from '../entity/remittance.entity';
import { Model } from 'mongoose';

@Injectable()
export class NexxeraCronService implements OnModuleInit {
    constructor(
        @InjectModel(Remittance.name) private readonly remittanceModel: Model<Remittance>
    ) { }

    onModuleInit() {
        // ✅ Inicia o cron quando o módulo é carregado
        // console.log('to aq')
        // this.startCronJob();
    }

    startCronJob() {
        // Para teste: roda a cada minuto
        cron.schedule('* * * * *', async () => {
            console.log('Rodando cron Nexxera...');
            await this.checkNexxeraFiles();
        });

        // Para produção: a cada 2 horas
        // cron.schedule('0 */2 * * *', async () => {
        //   console.log('Rodando cron Nexxera...');
        //   await this.checkNexxeraFiles();
        // });
    }

    async checkNexxeraFiles() {
        try {
            const initialDate = new Date();
            initialDate.setDate(initialDate.getDate() - 1);
            const finalDate = new Date();

            const url = `https://api-sandbox.nexxera.com/skyline/api/v1/files?initial_date=01-01-2026&final_date=14-01-2026`;

            const response = await axios.get(url, {
                headers: {
                    'service-token': 'UEFDSUZJQ0guUEFDSUZJQ0g6WlJCWW1lUHRUVzRqRnFJa21UZzZVRENDZWZLREpaS2Y='
                }
            });

            const files = response.data;
            console.log(files)
            if (files.result.length > 0) {
                for (const file of files.result) {
                    const { filename, in_mailbox } = file;
                    const baseName = filename.replace(/\.(rem|ret)$/i, '');

                    const remittance = await this.remittanceModel.findOne({
                        filename: { $regex: `^${baseName}`, $options: 'i' }
                    });
                    console.log(baseName) // valida como q a cris valida a nomenclatura
                    if (remittance) {
                        remittance.processed = in_mailbox;
                        await remittance.save();
                        console.log(`Atualizado: ${filename} -> processed = ${in_mailbox}`);
                    }
                }
            }

        } catch (error) {
            console.error('Erro ao verificar arquivos Nexxera:', error);
        }
    }

    private formatDate(date: Date): string {
        return date.toLocaleDateString('pt-BR').replace(/\//g, '-');
    }
}
