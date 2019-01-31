import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda'

import * as nodemailer from 'nodemailer'

const {EMAIL_HOST, EMAIL_PORT, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD} = process.env

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT),
    secure: parseInt(EMAIL_PORT) === 465,
    auth: {
        user: EMAIL_HOST_USER,
        pass: EMAIL_HOST_PASSWORD
    }
})

export async function sendMail(options: nodemailer.SendMailOptions): Promise<any> {
    return new Promise((resolve, reject) => {
        transporter.sendMail(options, (err, info) => {
            if (err) return reject(err)
            else resolve(info)
        })
    })
}

const handler: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
    sendMail({
        from: "test@foo.com",
        to: "misprime@gmail.com",
        subject: "test",
        text: `some test feedback`
    }).then(() => console.log("Message sent"))
    .catch((err) => console.error(err))

    callback(null, {
        statusCode: 200,
        body: "done",
    });    
};

export { handler }