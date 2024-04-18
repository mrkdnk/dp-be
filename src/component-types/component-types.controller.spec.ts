import { Test, TestingModule } from '@nestjs/testing';
import { ComponentTypesController } from './component-types.controller';

describe('ComponentTypesController', () => {
  let controller: ComponentTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComponentTypesController],
    }).compile();

    controller = module.get<ComponentTypesController>(ComponentTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
