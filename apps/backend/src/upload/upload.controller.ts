import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Ensure upload directory exists
const uploadDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
}

@Controller('upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                cb(null, uploadDir);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                cb(null, `${uniqueSuffix}${ext}`);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return {
            url: `/uploads/${file.filename}`,
            name: file.originalname,
            size: file.size,
        };
    }
}
