import { Injectable } from '@nestjs/common';

@Injectable()
export class ErrorMessageService {
  errorMessages: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public clearErrorMessages() {
    this.errorMessages.length = 0;
  }

  public addErrorMessage(errmsg) {
    this.errorMessages.push(errmsg);
  }

  public getErrorMessages() {
    return this.errorMessages;
  }
}
