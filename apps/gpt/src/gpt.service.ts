import { ICommandPrompt } from '@app/common/dto/gpt.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class GptService {

      constructor(
        private readonly aiChatService: GptService,
        @Inject('ORDER_SERVICE') private readonly orderService: ClientProxy,
        @Inject('INVENTORY_SERVICE') private readonly inventoryService: ClientProxy,
      ) {}

    detectService(prompt: string): string {
        const lowerPrompt = prompt.toLowerCase();
    
        if (lowerPrompt.includes('order') || lowerPrompt.includes('track my order')) {
          return 'order';
        }
        if (lowerPrompt.includes('stock') || lowerPrompt.includes('available')) {
          return 'inventory';
        }
    
        return 'unknown';
      }

    async runCommandPrompt(payload: ICommandPrompt) {
      const { service, prompt } = payload
      let response;
      if (service === 'order') {
        response = await this.orderService.send({ cmd: 'order_info' }, { prompt }).toPromise();
      } else if (service === 'inventory') {
        response = await this.inventoryService.send({ cmd: 'inventory_status' }, { prompt }).toPromise();
      } else {
        response = "I couldn't understand the request.";
      }
      
      return { service, response };
      }

}
