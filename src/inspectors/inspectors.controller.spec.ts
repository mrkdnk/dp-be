import { Test, TestingModule } from '@nestjs/testing';
import { InspectorsController } from './inspectors.controller';

describe('InspectorsController', () => {
  let controller: InspectorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InspectorsController],
    }).compile();

    controller = module.get<InspectorsController>(InspectorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
