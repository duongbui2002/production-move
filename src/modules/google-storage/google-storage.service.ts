import { Storage } from "@google-cloud/storage";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStorageService {
  private storageBucket;

  constructor(private configService: ConfigService) {
    try {
      const storage = new Storage({
        projectId: configService.get("storage.projectId"),
        credentials: {
          client_email: configService.get("storage.clientEmail"),
          private_key: configService.get("storage.privateKey")
        }
      });
      this.storageBucket = storage.bucket(configService.get("storage.bucketId"));
    } catch (e) {
      console.log(e);
    }
  }

  async upload(name: string, fileContent: string | Buffer): Promise<string> {
    const file = this.storageBucket.file(name);
    file.createWriteStream()
      .on("error", function(err) {
        console.log(err);
      })
      .on("finish", function() {

      })
      .end(fileContent);

    const checkedFile = this.storageBucket.file(name);
    const url = await checkedFile.getSignedUrl({
      action: "read",
      expires: "03-09-2491"
    });

    return url[0].split("?")[0];
  }
}

