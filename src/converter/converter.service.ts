import { Injectable } from '@nestjs/common';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import { createReadStream, createWriteStream } from 'fs';
import * as json2csv from 'json2csv';

@Injectable()
export class ConverterService {
  async parseCsv(filePath: string): Promise<any[]> {
    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => {
          const name = (data.first_name && data.last_name) ? `${data.first_name} ${data.last_name}` : data.email;
          delete data.first_name;
          delete data.last_name;
          data.name = name;
  
          if (data.x_studio_date_enregistrement) {
            const dateRegistered = new Date(data.x_studio_date_enregistrement);
            const formattedDate = dateRegistered.toISOString().split('T')[0];
            data.x_studio_date_enregistrement = formattedDate;
          }
  
          if (data.phone) {
            data.phone = data.phone.replace(/\D/g, '');
          }
  
          results.push(data);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async parseCsvLivraison(filePath: string): Promise<any[]> {
    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => {
          const name = (data.first_name && data.last_name) ? `${data.first_name} ${data.last_name}` : data.email;
          delete data.first_name;
          delete data.last_name;
          data.name = name;
  
          if (data.x_studio_date_enregistrement) {
            const dateRegistered = new Date(data.x_studio_date_enregistrement);
            const formattedDate = dateRegistered.toISOString().split('T')[0];
            data.x_studio_date_enregistrement = formattedDate;
          }
  
          if (data.phone) {
            data.phone = data.phone.replace(/\D/g, '');
          }
  
          results.push(data);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  
  async convertToCsvFileLivraison(data: any[], outputPath: string): Promise<void> {
    try {
      const fields = ["id", "x_studio_id_woocommerce", "x_studio_refc", "x_studio_user_login", "name","email", "x_studio_date_enregistrement", "phone", "x_studio_source", "company_type", "category_id", "type"];
      const opts = { fields, delimiter: ';' };
      const csv = json2csv.parse(data, opts);
      const outputStream = createWriteStream(outputPath);
      outputStream.write(csv);
      outputStream.end();
      console.log(`Conversion JSON vers CSV réussie. Fichier CSV créé à ${outputPath}`);
    } catch (error) {
      console.error('Erreur lors de la conversion JSON vers CSV :', error);
      throw error;
    }
  }

  async convertToCsvFile(data: any[], outputPath: string): Promise<void> {
    try {
      const fields = ["id", "x_studio_id_woocommerce", "x_studio_refc", "x_studio_user_login", "name","email", "x_studio_date_enregistrement", "phone", "x_studio_source", "company_type", "category_id", "type"];
      const opts = { fields, delimiter: ';' };
      const csv = json2csv.parse(data, opts);
      const outputStream = createWriteStream(outputPath);
      outputStream.write(csv);
      outputStream.end();
      console.log(`Conversion JSON vers CSV réussie. Fichier CSV créé à ${outputPath}`);
    } catch (error) {
      console.error('Erreur lors de la conversion JSON vers CSV :', error);
      throw error;
    }
  }
}
