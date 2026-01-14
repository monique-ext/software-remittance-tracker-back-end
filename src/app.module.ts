import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { RemittanceController } from "./remittance/controller/remittance.controller";
import { RemittanceService } from "./remittance/service/remittance.service";
import { Remittance } from "./remittance/entity/remittance.entity";
import { getModelForClass } from "@typegoose/typegoose";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(
      "mongodb+srv://spic:eW43%5EH9f%5Ck-_@cosmosdbpangu.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000",
      {
        dbName: "remittance",
      },
    ),
    MongooseModule.forFeature([
      { name: Remittance.name, schema: getModelForClass(Remittance).schema },
    ]),
  ],
  controllers: [RemittanceController],
  providers: [RemittanceService],
})
export class AppModule { }
