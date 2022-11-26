import { Module } from '@nestjs/common';
import { ExecutiveBoardService } from './executive-board.service';
import { ExecutiveBoardController } from './executive-board.controller';

@Module({
  providers: [ExecutiveBoardService],
  controllers: [ExecutiveBoardController]
})
export class ExecutiveBoardModule {}
