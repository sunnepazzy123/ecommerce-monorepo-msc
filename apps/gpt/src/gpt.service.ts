import { APP, PRODUCT_REQUESTS } from '@app/common/constants/events';
import { ICommandPrompt } from '@app/common/dto/gpt.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import OpenAI from "openai";




@Injectable()
export class GptService {
  private deepseekApiUrl: string;
  private openai: OpenAI

  constructor(
    @Inject(APP.ORDER_SERVICE) private readonly orderService: ClientProxy,
    @Inject(APP.INVENTORY_SERVICE) private readonly inventoryService: ClientProxy,
    @Inject(APP.PRODUCT_SERVICE) private readonly productService: ClientProxy,
    private configService: ConfigService
  ) {
    this.deepseekApiUrl = this.configService.get('DEEPSEEK_API_URL')
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async detectService(prompt: string) {
    const lowerPrompt = prompt.toLowerCase();
    const messageGpt = {
      service: '',
      intent: lowerPrompt
    }

    try {

      if (lowerPrompt.includes('order') || lowerPrompt.includes('track my order')) {
        messageGpt.service = 'order'
        return messageGpt;
      }
      if (lowerPrompt.includes('products') || lowerPrompt.includes('products')) {
        messageGpt.service = 'products'
        return messageGpt;
      }
      return messageGpt
    } catch (error) {
      return messageGpt
    }


  }

  async runCommandPrompt(payload: ICommandPrompt) {

    let response;

    if (payload.service === 'products') {
      response = this.productService.send(PRODUCT_REQUESTS.GET_PRODUCTS, payload);
    }

    return response
  }

}
