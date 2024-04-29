
import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common'
import { ConverterService } from './converter.service';
import { Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { createReadStream, createWriteStream } from 'fs';
import { Express } from 'express';
import { join } from 'path'; 
import * as nodemailer from 'nodemailer';
import * as uuid from 'uuid';

@Controller('converter')
export class ConverterController {
  private transporter;
  constructor(private readonly converterService: ConverterService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.HOST_SMTP,
      port: 465,
      secure: true,
      auth: {
          user: process.env.IDENTIFIANT_SMTP, 
          pass: process.env.SMTP_PASS,
      }
  })
  }

  @Post('/import')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Body('destinataire') destinataire: string
  ) {
    try {
      if (!file) {
        throw new Error('No file uploaded.');
      }
      const filePath = file.path;
      const convertedFileName = await this.converterService.parseCsv(filePath);
      const uniqueId = uuid.v4(); 
      const timestamp = new Date().getTime(); 

      const outputPath = `D:/CathyLi/IT - Projet/Seb/Mes projets/csv-converter/chemin/contrat_${timestamp}_${uniqueId}.csv`;
      const json = []

      convertedFileName.forEach(element => {
        const jsonObj = {
          "id": element.id,
          "x_studio_id_woocommerce": element.x_studio_id_woocommerce,
          "x_studio_refc": element.x_studio_refc,
          "x_studio_user_login": element.x_studio_user_login,
          "email": element.email,
          "x_studio_date_enregistrement": element.x_studio_date_enregistrement,
          "phone": element.phone,
          "x_studio_source": element.x_studio_source,
          "company_type":element.company_type,
          "category_id": element.category_id,
          "type": element.type,
          "name": element.name,
        };
      
      json.push(jsonObj)
      });
      await this.converterService.convertToCsvFile(json, outputPath);
      const mailOptions = {
        from: process.env.IDENTIFIANT_SMTP, 
        to: destinataire,
        subject: 'Mail de test',
        text: 'Voici votre fichier CSV en pièce jointe.',
        attachments: [
          {
            filename: `contrat_${timestamp}_${uniqueId}.csv`,
            path: outputPath
          }
        ]
      };

      const resultat = await this.transporter.sendMail(mailOptions)
      console.log("resultat", resultat)
      res.status(200).json({
        success: true,
        message: 'Mail envoyé',
        // data: {
        //   outputPath: outputPath
        // }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la conversion',
        data: error.message
      });
    }
  }

  @Get('convert')
  async convertJsonToCsv(): Promise<string> {
    const jsonData = [
      { name: 'John', age: 30, city: 'New York' },
      { name: 'Alice', age: 25, city: 'Los Angeles' },
      { name: 'Bob', age: 35, city: 'Chicago' },
    ];

    const outputPath = 'D:/CathyLi/IT - Projet/Seb/Mes projets/csv-converter/chemin/output.csv';
    await this.converterService.convertJsonToCsv(jsonData, outputPath);
    return `CSV file generated at ${outputPath}`;
  }
}