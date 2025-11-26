import Mailgen from "mailgen"
import nodemailer from "nodemailer"
 const sendemail = async (option)=>{
const mailgenerator = new Mailgen({
    theme:"default",
   product:{
    name:"task manager",
    link:"https://taskmanagerlink.com"
   } 

})
const emailtextual = mailgenerator.generatePlaintext(option.mailgencontent)
const emailhtml= mailgenerator.generate(option.mailgencontent)
const transportr =nodemailer.createTransport({
    host:process.env.MAIL_TRAP_SMTP_HOST,
    port:process.env.MAIL_TRAP_SMTP_PORT,
    auth:{
        user:process.env.MAIL_TRAP_SMTP_USERNAME,
        pass:process.env.MAIL_TRAP_SMTP_PASSWORD
    }
})


const mail={
    from:"ask Manager <no-reply@taskmanagTer.com>",
    to: option.email,
    subject:option.subject,
    text:emailtextual,
    html:emailhtml 
}
try {
    console.log("Sending email to:", option.email)

  await  transportr.sendMail(mail)
} catch (error){
    console.error("Email servicre failed make sur u have provide correct mailtrap credential ")
    console.error(error)
}
 }
const emailverificationgencoontent=(username,verificationurl)=>{

    return {
        body:{
            name :username,
            intro: 'Welcome to Mailgen! We\'re very excited to have you on board.',
            action :{
                instructions:'To verify please click on the buttonm',
                button:{
                    color:"#4df85eff",
                    text:"Verify Your Email",
                    link:verificationurl

                },
            },
            outro:"Need Help or question Just reply to this mail , we would love to  help",
        }
    }
}


const forgertpasssgencoontent=(username,passwordreseturl)=>{

    return {
        body:{
            name :username,
            intro: 'We have recievesd to  reset your password .',
            action :{
                instruction:'To reset Click on the following nutton ',
                button:{
                    color:"#4df85eff",
                    text:"Reset your password",
                    link:passwordreseturl

                },
            },
        },
        outro:"Need Help or question Just reply to this mail , we would love to  help",
    }
}

export{
    emailverificationgencoontent,
    forgertpasssgencoontent,
    sendemail
}