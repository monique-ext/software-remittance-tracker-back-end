import { prop } from '@typegoose/typegoose';

export class Remittance {

    @prop({ required: false, trim: true })
    filename: string;

    @prop({ required: false })
    result?: boolean;

    @prop({ required: false, trim: true })
    area?: string;

    @prop({ required: false, default: () => new Date() })
    date_created?: Date;

    @prop({ required: false })
    processed?: boolean;
}
