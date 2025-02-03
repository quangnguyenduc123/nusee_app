import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsIn } from 'class-validator';
import { CategoryStatus } from '../constant';

// DTO for updating a category
export class UpdateCategoryDto {
    @ApiProperty({ example: 'Electronics', description: 'Category name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'All electronic items', description: 'Category description', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'active', description: 'Status active and inactive' })
    @IsIn(['active', 'inactive'], { message: 'Status must be either "active" or "inactive".' })
    status: CategoryStatus;
}
