import { Injectable } from '@nestjs/common';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import { createWriteStream } from 'fs';
import * as json2csv from 'json2csv';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ConverterService {
  async uploadFile(files: string): Promise<any[]> {
    // async uploadFile(files: Array<Express.Multer.File>) {
    const file1 = files[0];
    const file2 = files[1];

    console.log(file1, file2);
    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(file1)
        .pipe(csvParser())
        .on('data', (data) => {
          const name =
            data.first_name && data.last_name
              ? `${data.first_name} ${data.last_name}`
              : data.email;
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

          console.log(data);
          results.push(data);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    if (!file1) {
      throw new BadRequestException('Aucun fichier recto fourni.');
    }
    // const fileExt1 = extname(file1.originalname).toLowerCase();
    // const fileName1 = `${file1.originalname.split('.')[0]}_${transactionID}${fileExt1}`;
    // const filePath1 = `/cin/cin_upload/${fileName1}`;
    // const fileLink1 = `${process.env.HOST_LINK}/${filePath1}`;

    // // Traitement du fichier 2 (carte d'identité verso)
    // const fileExt2 = extname(file2.originalname).toLowerCase();
    // const fileName2 = `${file2.originalname.split('.')[0]}_${transactionID}${fileExt2}`;
    // const filePath2 = `/cin/cin_upload/${fileName2}`;
    // const fileLink2 = `${process.env.HOST_LINK}/${filePath2}`;
  }
  async parseCsv(filePath: string): Promise<any[]> {
    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => {
          const name =
            data.first_name && data.last_name
              ? `${data.first_name} ${data.last_name}`
              : data.email;
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
          const street =
            data.street && data.shipping_street_number
              ? `${data.street} ${data.shipping_street_number}`
              : '';
          delete data.street;
          delete data.shipping_street_number;
          data.street = street;

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

  async parseCsvFacture(filePath: string): Promise<any[]> {
    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => {
          const street =
            data.street && data.billing_street_number
              ? `${data.street} ${data.billing_street_number}`
              : '';
          delete data.street;
          delete data.billing_street_number;
          data.street = street;

          if (data.vat) {
            const cleanedVat = data.vat.replace(/\s/g, '').replace(/\D/g, '');
            data.vat = `BE${cleanedVat}`;
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

  async convertToCsvFileFacture(
    data: any[],
    outputPath: string,
  ): Promise<void> {
    try {
      const fields = [
        'parent_id/id',
        'id',
        'name',
        'vat',
        'street',
        'street2',
        'zip',
        'city',
        'country_id',
        'company_type',
        'type',
      ];
      const opts = { fields, delimiter: ';' };

      const csv = json2csv.parse(data, opts);
      const outputStream = createWriteStream(outputPath);
      outputStream.write(csv);
      outputStream.end();
      console.log(
        `Conversion JSON vers CSV réussie. Fichier CSV créé à ${outputPath}`,
      );
    } catch (error) {
      console.error('Erreur lors de la conversion JSON vers CSV :', error);
      throw error;
    }
  }

  async convertToCsvFileLivraison(
    data: any[],
    outputPath: string,
  ): Promise<void> {
    try {
      const fields = [
        'parent_id/id',
        'id',
        'name',
        'street',
        'street2',
        'zip',
        'city',
        'country_id',
        'company_type',
        'type',
      ];
      const opts = { fields, delimiter: ';' };

      const csv = json2csv.parse(data, opts);
      const outputStream = createWriteStream(outputPath);
      outputStream.write(csv);
      outputStream.end();
      console.log(
        `Conversion JSON vers CSV réussie. Fichier CSV créé à ${outputPath}`,
      );
    } catch (error) {
      console.error('Erreur lors de la conversion JSON vers CSV :', error);
      throw error;
    }
  }

  async convertToCsvFile(data: any[], outputPath: string): Promise<void> {
    try {
      const fields = [
        'id',
        'x_studio_id_woocommerce',
        'x_studio_refc',
        'x_studio_user_login',
        'name',
        'email',
        'x_studio_date_enregistrement',
        'phone',
        'x_studio_source',
        'company_type',
        'category_id',
        'type',
      ];
      const opts = { fields, delimiter: ';' };
      const csv = json2csv.parse(data, opts);
      const outputStream = createWriteStream(outputPath);
      outputStream.write(csv);
      outputStream.end();
      console.log(
        `Conversion JSON vers CSV réussie. Fichier CSV créé à ${outputPath}`,
      );
    } catch (error) {
      console.error('Erreur lors de la conversion JSON vers CSV :', error);
      throw error;
    }
  }
}
