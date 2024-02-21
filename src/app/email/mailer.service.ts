import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { EmailDto } from "./emailDto";
import { Observable } from "rxjs";
import { environment } from "../../environment";

@Injectable()
export class MailerService {

    baseUrl = environment.BASE_URL

    public httpClient = inject(HttpClient)

    postEmailContent(emailDto: EmailDto): Observable<any> {
        return this.httpClient.post<EmailDto>(this.baseUrl + 'email', JSON.stringify(emailDto))
    }
}