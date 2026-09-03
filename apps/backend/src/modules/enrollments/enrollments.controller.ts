import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Enrollment } from './entities/enrollment.entity';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new enrollment' })
  @ApiResponse({
    status: 201,
    description: 'Enrollment created successfully',
    type: Enrollment,
  })
  @ApiBadRequestResponse({
    description:
      'Invalid input, inactive student/course, or already enrolled',
  })
  @ApiNotFoundResponse({ description: 'Student or course not found' })
  async create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all enrollments' })
  @ApiQuery({
    name: 'studentId',
    required: false,
    description: 'Filter by student ID',
  })
  @ApiQuery({
    name: 'courseId',
    required: false,
    description: 'Filter by course ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of enrollments',
    type: [Enrollment],
  })
  async findAll(
    @Query('studentId') studentId?: string,
    @Query('courseId') courseId?: string,
  ) {
    if (studentId) {
      return this.enrollmentsService.findByStudent(studentId);
    }

    if (courseId) {
      return this.enrollmentsService.findByCourse(courseId);
    }

    return this.enrollmentsService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active enrollments' })
  @ApiResponse({
    status: 200,
    description: 'List of active enrollments',
    type: [Enrollment],
  })
  async findActive() {
    return this.enrollmentsService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an enrollment by ID' })
  @ApiParam({ name: 'id', description: 'Enrollment ID' })
  @ApiResponse({
    status: 200,
    description: 'Enrollment found',
    type: Enrollment,
  })
  @ApiNotFoundResponse({ description: 'Enrollment not found' })
  async findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an enrollment' })
  @ApiParam({ name: 'id', description: 'Enrollment ID' })
  @ApiResponse({
    status: 200,
    description: 'Enrollment updated successfully',
    type: Enrollment,
  })
  @ApiNotFoundResponse({ description: 'Enrollment not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async update(
    @Param('id') id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentsService.update(id, updateEnrollmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel an enrollment' })
  @ApiParam({ name: 'id', description: 'Enrollment ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Enrollment canceled successfully',
  })
  @ApiNotFoundResponse({ description: 'Enrollment not found' })
  async remove(@Param('id') id: string) {
    await this.enrollmentsService.remove(id);
  }
}
