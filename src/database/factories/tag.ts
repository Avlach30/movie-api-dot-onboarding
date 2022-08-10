import { randMusicGenre } from '@ngneat/falso';
import { define } from 'typeorm-seeding';

import { generateDateNow } from '../../utils/date-now';
import { Tag } from '../../entities/tag.entity';

define(Tag, () => {
  const tag = new Tag();
  tag.name = randMusicGenre();

  tag.created_at = generateDateNow();
  tag.updated_at = generateDateNow();

  return tag;
});
