import { prop } from '@typegoose/typegoose';

export class Remittance {

    @prop({ required: false, trim: true })
    filename: string;

    @prop({ required: false, trim: true })
    result?: string;

    @prop({ required: false, trim: true })
    area?: string;

    @prop({ required: false, default: () => new Date() })
    date_created?: Date;
}
