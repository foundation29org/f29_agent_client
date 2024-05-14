import { Component} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/Subscription';
import { OpenAiService } from 'app/shared/services/openAi.service';

@Component({
  selector: 'app-land-page',
  templateUrl: './land-page.component.html',
  styleUrls: ['./land-page.component.scss'],
  providers: [OpenAiService]
})

export class LandPageComponent {

  sending: boolean = false;
  private subscription: Subscription = new Subscription();

  query: string = '';
  queryCopy: string = '';
  responseLangchain: string = '';
  searchopenai: boolean = false;
  isComplexSearch: boolean = false;
  questions: any = [];
  messages = [];
  conversation: any = [];
  message = '';
  private intervalId: any;
  messagesExpect: string = '';
  messagesExpectOutPut: string = '';
  callingOpenai: boolean = false;
  constructor(public translate: TranslateService, public toastr: ToastrService, private openAiService: OpenAiService) {
    this.questions = [
      { value: '¿Qué es la Fundación 29?'},
      { value: '¿Cuál es la misión de la Fundación 29?'},
      { value: '¿Qué ha ocurrido en la última reunión de la Fundación?'}
    ]
  }


  selectSuggestion(question) {
    var tempComplex = this.isComplexSearch
    //this.query = question.value;
    this.message = question.value;
    this.messages.push({
      text: this.message,
      isUser: true
    });
    this.isComplexSearch = true;
    this.search();
    this.isComplexSearch = tempComplex;
  }

  search() {
    this.callingOpenai = true;
    console.log(this.query)
    this.query = this.message;
    console.log(this.isComplexSearch)
    this.sending = true;
    this.searchopenai = false;
    
    let query = { 
      "conversation": this.conversation, "isComplexSearch": this.isComplexSearch, "question": this.query
   };
    this.responseLangchain = '';
    this.subscription.add(this.openAiService.postOpenAi3(query)
      .subscribe((res: any) => {
        console.log(res)
        if(res.data.indexOf("I don't know") !=-1 || res.data.indexOf("No sé") !=-1 ) {
          this.searchopenai = true;
          let value = { value: this.query, isComplexSearch: this.isComplexSearch };
          this.subscription.add(this.openAiService.postOpenAi(value)
            .subscribe((res: any) => {
              this.queryCopy = this.query;
              this.query = '';
              this.responseLangchain = res.choices[0].message.content;
              const regex = /^```html\n|\n```$/g;
              this.responseLangchain = this.responseLangchain.replace(regex, '');
              this.responseLangchain = this.responseLangchain.replace(/【.*?】/g, "");
              this.callingOpenai = false;
              this.messages.push({
                text: this.responseLangchain,
                isUser: false
              });
              this.conversation.push({"role": "user", "content": this.message})
              this.conversation.push({"role": "assistant", "content": res.choices[0].message.content})
              this.message= '';
              this.sending = false;
              this.scrollTo();
            }, (err) => {
              this.sending = false;
              console.log(err);
              this.toastr.error('', this.translate.instant("generics.error try again"));

            }));
        } else {
          this.sending = false;
          console.log('entra')
          this.queryCopy = this.query;
          this.query = '';
          this.responseLangchain = res.data;
          const regex = /^```html\n|\n```$/g;
          this.responseLangchain = this.responseLangchain.replace(regex, '');
          this.responseLangchain = this.responseLangchain.replace(/【.*?】/g, "");

          this.callingOpenai = false;
          this.messages.push({
            text: this.responseLangchain,
            isUser: false
          });
          this.conversation.push({"role": "user", "content": this.message})
          this.conversation.push({"role": "assistant", "content": res.data})
          this.message= '';
          console.log(this.sending)
          //this.scrollTo();
          
        }

      }, (err) => {
        this.sending = false;
        this.callingOpenai = false;
        console.log(err);
        this.toastr.error('', this.translate.instant("generics.error try again"));
      }));

  }

  async scrollTo() {
    await this.delay(200);
    document.getElementById('initcontentIntro').scrollIntoView({ behavior: "smooth" });
}

delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


sendMessage() {
  if (!this.message) {
    return;
  }

  this.messages.push({
    text: this.message,
    isUser: true
  });
  this.statusChange();
  this.search();
}

private statusChange() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
  }
  this.messagesExpectOutPut = '';
  
  this.messagesExpect = this.translate.instant('generics.We are generating');
  this.delay(100);
  const words = this.messagesExpect.split(' ');
  let index = 0;
  
  this.intervalId = setInterval(() => {
    if (index < words.length && (this.callingOpenai)) {
      const word = words[index];
      this.messagesExpectOutPut += (index > 0 ? ' ' : '') + word;
      index++;
    } else {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }, 20);
}

async deleteChat() {
  this.messages = [];
  this.conversation = [];
}


}
