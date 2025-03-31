import {
    Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { APP, GPT_REQUESTS, } from '@app/common/constants/events';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
    ChatPromptDto,
} from '@app/common/dto/create-user.dto';


@Controller('/gpt')
export class GptController {
  constructor(
    @Inject(APP.GPT_SERVICE) private readonly gptClient: ClientProxy, // Injecting the ClientProxy
  ) {}

  @Post('/prompt')
  async prompt(@Body() payload: ChatPromptDto) {
    try {
      const response = await firstValueFrom(
        this.gptClient.send(GPT_REQUESTS.PROMPT_GPT, payload),
      );

      return response;
    } catch (error) {
      console.error('Error fetching users', error);
      throw error; // Handle errors appropriately
    }
  }


}
