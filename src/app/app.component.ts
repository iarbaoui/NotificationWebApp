import { Component, OnInit, Pipe} from '@angular/core';
import { MessagingService } from './shared/services/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  message;

  constructor(private msgService: MessagingService){}

  ngOnInit(): void {
    this.msgService.getPermission();
    this.msgService.getUser();
    this.msgService.receiveMessage();
    this.message = this.msgService.currentMessage;
  }

  title = 'NotificationWebApp';
}
