import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { EmailDto } from "./emailDto";
import { Observable } from "rxjs";

@Injectable()
export class MailerService {

    public httpClient = inject(HttpClient)
    private httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    postEmailContent(emailDto: EmailDto): Observable<any> {

        // return this.httpClient.post<EmailDto>("http://35.163.180.116:3000/email", JSON.stringify(emailDto), { headers: httpHeaders })
        return this.httpClient.post<EmailDto>("http://localhost:3000/email", JSON.stringify(emailDto), { headers: this.httpHeaders })
    }
}