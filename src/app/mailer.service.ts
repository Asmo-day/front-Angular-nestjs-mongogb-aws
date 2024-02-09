import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { EmailDto } from "./emailDto";
import { Observable } from "rxjs";

@Injectable()
export class MailerService {

    private httpClient = inject(HttpClient)

    postEmailContent(emailDto: EmailDto): Observable<EmailDto> {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        // return this.httpClient.post<EmailDto>("http://35.163.180.116:3000/email", JSON.stringify(emailDto), { headers: httpHeaders })
        return this.httpClient.post<EmailDto>("http://localhost:3000/email", JSON.stringify(emailDto), { headers: httpHeaders })
    }
}