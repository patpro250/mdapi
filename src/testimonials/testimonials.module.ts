import { Module } from '@nestjs/common';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialsService } from './testimonials.service';
import { Testimonial } from '../entity/testimonial.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [TestimonialsController],
  imports: [TypeOrmModule.forFeature([Testimonial])],
  providers: [TestimonialsService],
})
export class TestimonialsModule {}
