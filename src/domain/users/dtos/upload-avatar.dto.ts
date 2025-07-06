import { IsNotEmpty, IsString } from "class-validator";

export class UploadAvatarDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    avatarUrl: string;
}
