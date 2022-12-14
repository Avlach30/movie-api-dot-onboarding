import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Studio } from 'src/entities/movie-studio.entity';
import { generateDateNow } from 'src/utils/date-now';
import { AddMovieStudioDto } from 'src/dto/add-new-studio.dto';

@Injectable()
export class StudioService {
  constructor(
    @InjectRepository(Studio) private movieStudioRepository: Repository<Studio>,
  ) {}

  async addStudio(addNewStudioDto: AddMovieStudioDto, req: any) {
    const admin = req.user.isUserAdmin;
    if (!admin) throw new ForbiddenException('Forbidden to access, only admin');

    const newStudio = await this.movieStudioRepository.create({
      studioNumber: addNewStudioDto.studio_number,
      seatCapacity: addNewStudioDto.seat_capacity,
      created_at: generateDateNow(),
      updated_at: generateDateNow(),
    });

    await this.movieStudioRepository.save(newStudio);

    return {
      data: newStudio,
      message: 'Add new movie studio successfully',
    };
  }
}
