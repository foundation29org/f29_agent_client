import { Component, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/Subscription';
import { OpenAiService } from 'app/shared/services/openAi.service';

interface Message {
  text: string;
  isUser: boolean;
  citations?: Array<{text: string}>;
}

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
  messages: Message[] = [];
  conversation: any = [];
  message = '';
  private intervalId: any;
  messagesExpect: string = '';
  messagesExpectOutPut: string = '';
  callingOpenai: boolean = false;
  @ViewChild('messageTextarea') messageTextarea: ElementRef;

  constructor(public translate: TranslateService, public toastr: ToastrService, private openAiService: OpenAiService) {
    this.questions = [
      { value: '¿Qué es la Fundación 29?'},
      { value: '¿Cuál es la misión de la Fundación 29?'},
      { value: '¿Qué ha ocurrido en la última reunión de la Fundación?'}
    ]
  }


  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  processCitations(text: string, citations: Array<{text: string}>): string {
    return text.replace(/\[(\d+)\]/g, (match, index) => {
      const citationIndex = parseInt(index, 10);
      if (citations[citationIndex]) {
        const citation = citations[citationIndex];
        return `<span class="citation-number" data-citation-index="${citationIndex}">[${citationIndex}]<span class="tooltip-content">${citation}</span></span>`;
      }
      // Si no existe la cita correspondiente, devuelve el marcador original
      return match;
    });
  }

  adjustTextareaHeight(event: any): void {
    const textarea: HTMLTextAreaElement = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
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
        this.sending = false;
        console.log('entra')
        this.queryCopy = this.query;
        this.query = '';
        this.responseLangchain = res.data;
        const regex = /^```html\n|\n```$/g;
        this.responseLangchain = this.responseLangchain.replace(regex, '');
        this.responseLangchain = this.responseLangchain.replace(/【.*?】/g, "");
        console.log(res.citations)
        this.callingOpenai = false;
        this.messages.push({
          text: this.responseLangchain,
          isUser: false,
          citations: res.citations
        });
        this.conversation.push({"role": "user", "content": this.message})
        this.conversation.push({"role": "assistant", "content": res.data})
        this.message= '';
        console.log(this.sending)
          //this.scrollTo();
          
        

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
  // Reset the textarea height after sending the message
  if (this.messageTextarea) {
    this.messageTextarea.nativeElement.style.height = 'auto';
  }
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
