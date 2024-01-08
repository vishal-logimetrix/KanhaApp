import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { MessageUnderscoreToCamelcasePipe } from './message-underscore-to-camelcase.pipe';
import MessagePropertyJSON from '../../../../assets/message.en.json';
@Pipe({
  name: 'messageTranslation'
})
export class MessageTranslationPipe implements PipeTransform {

  messageProperty: any = [];
  constructor(private _httpClient: HttpClient, private mustc: MessageUnderscoreToCamelcasePipe){

  }

  transform(value: any, ...args: any[]): any {
    this.messageProperty = MessagePropertyJSON;
    try {
      if (this.messageProperty[value] != undefined) {
        return this.messageProperty[value];
      }else{
        return this.mustc.transform(value);
      }
    } catch (error) {

    }

  }

}
