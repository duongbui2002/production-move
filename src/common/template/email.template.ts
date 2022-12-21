export const urls = {
  redirectUrl: "http://localhost:3000/idea/",
  verifyAccountUrl: "",
  resetPasswordUrl: "",
};

export const notificationEmailContent = (
  redirectUrl: string,
  content: string
) => `
<html>
<head>
<style>
.controls-section {
    text-align: center;
}
</style>
</head>
<body>
  <div
    style="
      padding: 10px;
      border-radius: 10px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      width: 500px;
      box-shadow: 3px 4px 4px rgba(0, 0, 0, 0.05);
    "
  >
    <div
      style=""
    >
      <div style="margin-left: 210px">
          <img
            src="https://idde.me/img/logo.png"
            height="50"
          />
      </div>
      <h2  style="text-align: center; margin-top: 16px">
        ${content}
      </h2>
    </div>
    <h3 style="text-align: center; margin-top: 16px">
     
    </h3>
    <div class="controls-section">
      <a href="${redirectUrl}">
        <button
          id="button-link"
          style="
            background-color: #3e79f7;
            color: white;
            padding: 10px;
            border-radius: 10px;
            cursor: pointer;
            border: none !important;
          "
        >
          View content
        </button>
      </a>
    </div>
  </div>
</body>
</html>
`;
export const verifyEmailContent = (verifyAccountUrl: string) => `
<html>
<head>
<style>
.controls-section {
    text-align: center;
}
</style>
</head>
<body>
  <div
    style="
      padding: 10px;
      border-radius: 10px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      width: 500px;
      box-shadow: 3px 4px 4px rgba(0, 0, 0, 0.05);
    "
  >
    <div
      style=""
    >
      <div style="margin-left: 210px">
          <img
            src="https://idde.me/img/logo.png"
            height="50"
          />
      </div>
      <h2
        style="
          text-align: center;
          flex: 1;
          margin-bottom: 0;
          color: #1a3353;
          margin-left: 50%;
          transform: translateX(-50%);
        "
      >
        IDDE
      </h2>
    </div>
    <h3 style="text-align: center; margin-top: 16px">
      Click on the link below to verify your account!
    </h3>
    <div class="controls-section">
      <a href="${verifyAccountUrl}{verifyToken}">
        <button
          id="button-link"
          style="
            background-color: #3e79f7;
            color: white;
            padding: 10px;
            border-radius: 10px;
            cursor: pointer;
            border: none !important;
          "
        >
          Click to verify
        </button>
      </a>
    </div>
  </div>
</body>
</html>
`;

export const changePasswordContent = (resetPasswordUrl: string) => `
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                          <a href="#" title="logo" target="_blank">
                            <img width="60" src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png" title="logo" alt="logo">
                          </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <a href="${resetPasswordUrl}"
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>duongbui.com</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>
`;
