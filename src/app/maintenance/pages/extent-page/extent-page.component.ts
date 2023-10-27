import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-extent-page',
  templateUrl: './extent-page.component.html',
  styleUrls: ['./extent-page.component.css'],
})
export class ExtentPageComponent {
  constructor(private configService: ConfigService) {}
}
