## Installation

```bash
pnpm install

pnpm run prisma:schema

pnpm run prisma:migrate

pnpm run prisma:seed
```


## Running the app

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```

## Test

```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# test coverage
pnpm run test:cov
```

## Known Issues

1. Multer Configs

- The file handler module is not correctly functioning as a dynamic module, which leads to issues in passing multer configurations to it. As a result, multer options cannot be effectively passed to the file handler, and injecting them into other providers (e.g., controllers) makes them unavailable to be passed to the file interceptor at the endpoint level, preventing them from being applied.

- Fix: Define multer options as a constant object in a separate file, then import it into any controller

```TS
const initMulterOptions: MulterOptions = {
  limits: { fileSize: Number(process.env.MULTER_MAX_FILE_SIZE) ?? 2097152 },
  storage: diskStorage({
    destination,
    filename: (req: any, file: any, cb: any) => {
      if (!initMimeTypes.hasOwnProperty(file.mimetype))
        return cb(
          new BadRequestException('Error: File not supported'),
          file.originalname,
        );
      const name = file.originalname.split(' ').join('_').split('.')[0];
      const extension = initMimeTypes[file.mimetype];
      cb(null, name + '_' + Date.now() + '.' + extension);
    },
  }),
  dest: destination,
};
```

Then : (in the contoller)

```TS
// Import the initMulterOptions from the file
import { initMulterOptions } from './multer.interface';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', initMulterOptions))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Handle file upload logic
  }
}

```
