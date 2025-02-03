import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Config } from '../entities/config.entity';
import { UpdateConfigDTO } from '../dto/update-config.dto';
@Injectable()
export class ConfigServerService {
  constructor(
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>,
  ) {}

  async findAll(): Promise<Config> {
    const configs = await this.configRepository.find();
    if(configs.length) {
      return configs[0];
    }
    return null;
  }

  async update(data: UpdateConfigDTO): Promise<Config> {
    const config = await this.configRepository.find();
    if(!config.length) {
      const newConfig = await this.configRepository.save(data);
      return newConfig;
    }
    const configId = config[0].id;
    await this.configRepository.update(configId, data);
    return this.configRepository.findOneBy({id: configId});
  }

}
