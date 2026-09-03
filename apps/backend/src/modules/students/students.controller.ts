import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({
    status: 201,
    description: 'Student created successfully',
    type: Student,
  })
  @ApiBadRequestResponse({ description: 'Email or CPF already registered' })
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({
    status: 200,
    description: 'List of all students',
    type: [Student],
  })
  async findAll() {
    return this.studentsService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active students' })
  @ApiResponse({
    status: 200,
    description: 'List of active students',
    type: [Student],
  })
  async findActive() {
    return this.studentsService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student found',
    type: Student,
  })
  @ApiNotFoundResponse({ description: 'Student not found' })
  async findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student updated successfully',
    type: Student,
  })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @ApiBadRequestResponse({ description: 'Email or CPF already registered' })
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete (soft delete) a student' })
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Student deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Student not found' })
  async remove(@Param('id') id: string) {
    await this.studentsService.remove(id);
  }
}
