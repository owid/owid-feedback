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
    if (event.httpMethod === "POST") {
        const data = JSON.parse(event.body)

        if (data.message && data.message.length) {
            let shortMessage = data.message.split(" ").slice(0, 10).join(" ")
            if (shortMessage.length < data.message.length)
                shortMessage += "..."
    
            sendMail({
                from: `OWID Feedback <feedback@ourworldindata.org>`,
                replyTo: `${data.name} <${data.email}>`,
                to: "info@ourworldindata.org",
                subject: `User Feedback: ${shortMessage}`,
                text: data.message
            }).then(() => console.log("Message sent"))
            .catch((err) => console.error(err))    
        }
    }

    callback(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, X-Requested-With"
        },
        statusCode: 200,
        body: "done",
    });    
};

export { handler }