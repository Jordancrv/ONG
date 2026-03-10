import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  @Post('message')
  async sendMessage(@Body() body: { message: string }) {
    // TODO: integrate with chat service provider
    return { status: 'queued', echo: body.message };
  }
}
