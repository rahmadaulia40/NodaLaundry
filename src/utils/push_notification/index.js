import axios from "axios"
import { Firebase } from "../../config"

export const push_notification=(title, token)=>{
    const data_message = {
        to: token,
        notification:{
            body : title,
            title :'Noda Laundry',
            android : {
                priority : "high"
            },
        direct_boot_ok: true,
        sound : "enabled",
        icon : "https://firebasestorage.googleapis.com/v0/b/noda-laundry-98475.appspot.com/o/logo%2FLogo.png?alt=media&token=df111146-91fa-48dc-b136-3e96fb75154f"
        }
    }
    axios({
        method: "POST",
        url: Firebase.URL_MESSAGE,
        headers: Firebase.HEADER_MESSAGE,
        data : data_message,
    })
}