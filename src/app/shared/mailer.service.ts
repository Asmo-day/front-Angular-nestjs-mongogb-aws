import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { EmailDto } from "../email/emailDto";
import { Observable } from "rxjs";
import { environment } from "../../environment";
import { UserDto } from "../users/userDto";

@Injectable({
    providedIn: 'root'
})
export class MailerService {
    
    baseUrl = environment.BASE_URL
    
    public httpClient = inject(HttpClient)
    
    postEmail(emailDto: EmailDto): Observable<any> {
        return this.httpClient.post<EmailDto>(this.baseUrl + 'email', JSON.stringify(emailDto))
    }
    
    postValidationEmail(userToValidate: UserDto): Observable<any> {
        return this.httpClient.post<EmailDto>(this.baseUrl + 'email/validation', JSON.stringify(userToValidate))
    }
}