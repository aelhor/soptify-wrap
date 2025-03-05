import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from './services';

@Module({
    providers: [
        PrismaService,

    ],
    exports: [
        PrismaService,

    ]
})
export class SharedModule implements NestModule {

    configure(consumer: MiddlewareConsumer) {

    }
}
