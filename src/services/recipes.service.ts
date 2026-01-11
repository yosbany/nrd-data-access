import { BaseService } from './base.service';
import { Recipe } from '../models';

export class RecipesService extends BaseService<Recipe> {
  constructor() {
    super('recipes');
  }
}
