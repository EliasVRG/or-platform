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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({
    status: 201,
    description: 'Course created successfully',
    type: Course,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({
    status: 200,
    description: 'List of all courses',
    type: [Course],
  })
  async findAll() {
    return this.coursesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active courses' })
  @ApiResponse({
    status: 200,
    description: 'List of active courses',
    type: [Course],
  })
  async findActive() {
    return this.coursesService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'Course found',
    type: Course,
  })
  @ApiNotFoundResponse({ description: 'Course not found' })
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({
    status: 200,
    description: 'Course updated successfully',
    type: Course,
  })
  @ApiNotFoundResponse({ description: 'Course not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete (soft delete) a course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Course deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Course not found' })
  async remove(@Param('id') id: string) {
    await this.coursesService.remove(id);
  }
}
