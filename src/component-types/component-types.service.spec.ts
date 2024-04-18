import { Test, TestingModule } from '@nestjs/testing';
import { ComponentTypesService } from './component-types.service';

describe('ComponentTypesService', () => {
  let service: ComponentTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComponentTypesService],
    }).compile();

    service = module.get<ComponentTypesService>(ComponentTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
