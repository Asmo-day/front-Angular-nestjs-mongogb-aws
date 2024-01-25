import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EmailDto } from "./emailDto";
import { JsonPipe } from "@angular/common";
import { Observable } from "rxjs";

@Injectable()
export class MailerService {

    constructor(private httpClient: HttpClient) {

    }

    postEmailContent(emailDto: EmailDto): Observable<EmailDto> {
        let httpHeaders = new HttpHeaders({
            'Content-Type' : 'application/json'
       }); 
        return this.httpClient.post<EmailDto>("http://localhost:3000/users", JSON.stringify(emailDto), {headers: httpHeaders})
    }
}