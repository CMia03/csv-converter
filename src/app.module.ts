import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConverterModule } from './converter/converter.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConverterModule,  
    ConfigModule.forRoot({
    isGlobal: true, // Permet d'injecter ConfigService dans tous les modules
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
