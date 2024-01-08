import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageUnderscoreToCamelcasePipe } from '../Pipes/message-underscore-to-camelcase.pipe';
// import { AlertService } from './alert.service';
import { MessageTranslationPipe } from '../Pipes/message-translation.pipe';

@Injectable({
  providedIn: 'root'
})
export class ServerValidationService {

  constructor(private httpClient: HttpClient,
    private ustString: MessageUnderscoreToCamelcasePipe,
    private messageProp: MessageTranslationPipe) {

  }


  parseValidation(messageTitle: string, resposneData: any) {

    let messageBody = "";
    // console.log(JSON.stringify(resposneData));
    if (typeof resposneData == "object") {

      for (const key in resposneData) {
        
        let validationValue = resposneData[key];
        let validationValues = validationValue.split('~');
        let validKey = '';

        if (validationValues[0] != undefined) {
          validKey = validationValues[0];
          if (validationValues[0] == 'not-empty' || validationValues[0] == 'require') {
            validKey = 'validRequire';
          } else if (validationValues[0] == 'unique') {
            validKey = 'validUnique';
          } else if (validationValues[0] == 'length') {
            validKey = 'validLength';
          } else if (validationValues[0] == 'numeric') {
            validKey = 'validNumber';
          } else if (validationValues[0] == 'alpha') {
            validKey = 'validAlpha';
          }
        }
        
        if (this.messageProp.transform(validKey) == validKey) {

          messageBody = messageBody + this.ustString.transform(key) + " " + resposneData[key] + "<br />";
          
        }
        else {

          if (validationValues.length > 1) {
            validationValues = validationValues.filter(function (key: any, value: any) {
              return value != 0;
            });
            validKey = validKey + '~' + validationValues.join('~');
          }
          messageBody = messageBody + this.valdiationMessage(key, validKey) + "<br />";
        }
      }
    } else {

      if (this.messageProp.transform(resposneData) != resposneData) {
        messageBody = this.valdiationMessage(resposneData);
      } else {
        messageBody = resposneData;
      }

    }

  }

  private valdiationMessage(key: string, validationLabel: string = "") {

    // console.log("valdiationMessage Key: "+key);
    // console.log("valdiationMessage validationLabel: "+validationLabel);

    let validationMsg = this.getValidationMsg(validationLabel);

    return this.messageProp.transform(key) + ' ' + validationMsg;

  }

  private getValidationMsg(labelKey: string) {
    let validation = labelKey;
    
    let keyArray = labelKey.split('~');
    if (this.messageProp.transform(labelKey, [{ returnAsInput: true }]) != labelKey && this.messageProp.transform(keyArray[0]) == keyArray[0]) {
      validation = this.messageProp.transform(labelKey);
    } else {
      let validMsg = this.messageProp.transform(keyArray[0]);
      let replaceValue = keyArray[1] != undefined ? this.messageProp.transform(keyArray[1]) : "";
      let replaceValueOther = keyArray[2] != undefined ? this.messageProp.transform(keyArray[2]) : "";
      validation = validMsg.replace('##replace##', replaceValue);
      validation = validation.replace('##replace_2##', replaceValueOther);
    }
    return validation;
  }

}
