import {Injectable} from "@nestjs/common";
import {OAuth2Client} from "google-auth-library";
import {ConfigService} from "@nestjs/config";
import * as nodemailer from "nodemailer";
import {changePasswordContent} from "@common/template/email.template";

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {
  }

  private async send(subject: string, to: string, html: string) {
    try {

      const clientId = this.configService.get("gmail.clientId");
      const clientSecret = this.configService.get("gmail.clientSecret");
      const user = this.configService.get("gmail.adminEmail");
      const refreshTokenEmail = this.configService.get("gmail.refreshTokenEmail");


      const myOAuth2Client = new OAuth2Client(
        clientId,
        clientSecret
      );
      myOAuth2Client.setCredentials({
        refresh_token: refreshTokenEmail
      });

      const mailOptions = {
        to,
        subject,
        html
      };

      //send mail

      const accessTokenObject = await myOAuth2Client.getAccessToken();
      let accessToken: string;
      if (typeof accessTokenObject.token === "string") {
        accessToken = accessTokenObject.token;
      } else {
        accessToken = "Error";
      }

      const newTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user,
          clientId,
          clientSecret,
          refreshToken: refreshTokenEmail,
          accessToken
        }
      });
      const info = await newTransport.sendMail(mailOptions);
    } catch (e: any) {
      console.log(e);
    }
  }

  async sendForgetPassword(url: string, to: string) {
    const html = changePasswordContent(url);
    await this.send("Forgot password", to, html);
  }

}
