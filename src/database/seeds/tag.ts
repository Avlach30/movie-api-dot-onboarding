import { Tag } from '../../entities/tag.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class InitializeTag implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(Tag)().createMany(5);
  }
}
