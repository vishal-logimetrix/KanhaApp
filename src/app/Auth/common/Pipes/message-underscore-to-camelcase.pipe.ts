import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'messageUnderscoreToCamelcase'
})
export class MessageUnderscoreToCamelcasePipe implements PipeTransform {

  transform(value: any): any {
   
    if(!value){
     return value;
    }else{
      return value.replace(/_/g, "")
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word: string, index: any){
        return word.toUpperCase();
      })
    }
  }

}
