import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DataFormatterService {

  constructor() { }

  formatDate(date) { ///////YYYY-MM-DD
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  formatDateToString2(date){ ///////YYYY-MM-DD
    var split = date.split("-");
    
    var day = split[2];
    var month = this.formatMonthToString(split[1]);
    var year = split[0];

    return [day, month, year].join(' ');
  }

  formatTimestampToDate(input){
    var split = input.split(" ");
    
    var date = this.formatDateToString2(split[0]);
    var time = this.formatTime(split[1]);

    return [date, time].join(' ');
  }

  formatTimestampToDate2(input){
    var split = input.split(" ");
    
    return this.formatDateToString2(split[0]);
  }

  // formatTimestampToDate3(input){
  //   var split = input.split(" ");
    
  //   var date = split[0];
  //   var time = split[1];

  //   var splitDate = date.split("-");
  //   var day = splitDate[2];
  //   var month = splitDate[1];
  //   var year = splitDate[0];

  //   return day+month+year+time;
  //   // return [day, month, year].join('/')+" "+time;
  // }

  formatDateToTimestamp(input){
    var timestamp = new Date(input);

    return timestamp.valueOf();
  }

  formatTime(input){
    var split = input.split(".");
    
    var time = this.formatDateToString2(split[0]);

    return time;
  }

  formatMonthToString(month){

    if(month == "01"){
      return "Jan";
    }
    else if(month == "02"){
      return "Feb";
    }
    else if(month == "03"){
      return "Mar";
    }
    else if(month == "04"){
      return "Apr";
    }
    else if(month == "05"){
      return "Mei";
    }
    else if(month == "06"){
      return "Jun";
    }
    else if(month == "07"){
      return "Jul";
    }
    else if(month == "08"){
      return "Agt";
    }
    else if(month == "09"){
      return "Sept";
    }
    else if(month == "10"){
      return "Okt";
    }
    else if(month == "11"){
      return "Nov";
    }
    else if(month == "12"){
      return "Des";
    }
  }

  dateValidator(controlName1 : string, controlName2: string){
    return (formGroup: FormGroup) => {
      const startDate = formGroup.controls[controlName1];
      const endDate = formGroup.controls[controlName2];

      if (endDate.errors && !endDate.errors.dateValidator) {
          return;
      }
         
      if (startDate.value > endDate.value) {
        console.log(startDate.value);
        console.log(endDate.value);

        if(endDate.value != ''){
          startDate.setErrors({ dateValidator: true });
          endDate.setErrors({ dateValidator: true });
        }
        if(endDate.value == '' || endDate.value == null){
          startDate.setErrors(null);
          endDate.setErrors(null);
        }
         
      } else {
        startDate.setErrors(null);
        endDate.setErrors(null);
      }
      
      
    }
  }
}
