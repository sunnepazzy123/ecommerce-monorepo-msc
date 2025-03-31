import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GptService } from './gpt.service';
import { GPT_REQUESTS } from '@app/common/constants/events';

@Controller()
export class GptController {
  
  constructor(
    private readonly aiChatService: GptService,
  ) {}

  @MessagePattern(GPT_REQUESTS.PROMPT_GPT)
  async handleChatRequest(data: { prompt: string }) {
    // Step 1: Use AI/NLP to determine which service to call
    const messageGpt = await this.aiChatService.detectService(data.prompt);
    const result = await this.aiChatService.runCommandPrompt(messageGpt)
    return result;
  }
}
