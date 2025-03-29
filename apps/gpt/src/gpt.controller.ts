import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, ClientProxy } from '@nestjs/microservices';
import { GptService } from './gpt.service';


@Controller()
export class GptController {
  
  constructor(
    private readonly aiChatService: GptService,
    @Inject('ORDER_SERVICE') private readonly orderService: ClientProxy,
    @Inject('INVENTORY_SERVICE') private readonly inventoryService: ClientProxy,
  ) {}

  @MessagePattern({ cmd: 'ai_chat' })
  async handleChatRequest(data: { prompt: string }) {
    // Step 1: Use AI/NLP to determine which service to call
    const service = this.aiChatService.detectService(data.prompt);
    
    const result = await this.aiChatService.runCommandPrompt(service as any)
    return result;
  }
}
