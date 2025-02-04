import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Agency, AgencyRelationship } from '../entities';
import { CreateAgencyDto } from '../dto/create-agency.dto';
import { UpdateAgencyDto } from '../dto/update-agency.dto';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
    @InjectRepository(AgencyRelationship)
    private agencyRelationshipRepository: Repository<AgencyRelationship>,
    private dataSource: DataSource,
  ) {}

  async create(createAgencyDto: CreateAgencyDto): Promise<Agency> {
    const existingAgency = await this.agencyRepository.findOneBy({
      email: createAgencyDto.email,
    });
    if (existingAgency) {
      throw new ConflictException('An agency with this email already exists');
    }

    return await this.dataSource.transaction(async (manager) => {
      const agency = new Agency();
      agency.name = createAgencyDto.name;
      agency.email = createAgencyDto.email;
      agency.phone = createAgencyDto.phone;
      agency.level = createAgencyDto.level;
      agency.street = createAgencyDto.street;
      agency.ward = createAgencyDto.ward;
      agency.district = createAgencyDto.district;
      agency.city = createAgencyDto.city;
      agency.password = createAgencyDto.password;

      if (createAgencyDto.parent_id) {
        const parentAgency = await manager.findOneBy(Agency, {
          id: createAgencyDto.parent_id,
        });
        if (!parentAgency) {
          throw new NotFoundException('Parent agency not found');
        }
        agency.parent = parentAgency;
      }

      const savedAgency = await manager.save(Agency, agency);

      if (createAgencyDto.parent_id) {
        const relationship = new AgencyRelationship();
        relationship.parent = savedAgency.parent;
        relationship.child = savedAgency;
        await manager.save(AgencyRelationship, relationship);
      }

      delete savedAgency.password;
      return savedAgency;
    });
  }

  async findAll(): Promise<Agency[]> {
    const agencies = await this.agencyRepository.find();
    return agencies.map((agency) => {
      delete agency.password;
      return agency;
    });
  }

  async findOne(id: number): Promise<Agency> {
    const agency = await this.agencyRepository.findOne({
      where: { id },
    });
    delete agency.password;

    return agency;
  }

  async update(id: number, updateAgencyDto: UpdateAgencyDto): Promise<void> {
    return await this.dataSource.transaction(async (manager) => {
      const agency = await manager.findOneBy(Agency, { id });
      if (!agency) {
        throw new NotFoundException('Agency not found');
      }

      Object.assign(agency, updateAgencyDto);

      if (updateAgencyDto.parent_id) {
        const parentAgency = await manager.findOneBy(Agency, {
          id: updateAgencyDto.parent_id,
        });
        if (!parentAgency) {
          throw new NotFoundException('Parent agency not found');
        }
        agency.parent = parentAgency;

        // Check if relationship exists
        const existingRelationship = await manager.findOneBy(
          AgencyRelationship,
          {
            child: { id: agency.id },
          },
        );

        if (existingRelationship) {
          existingRelationship.parent = parentAgency;
          await manager.save(AgencyRelationship, existingRelationship);
        } else {
          const relationship = new AgencyRelationship();
          relationship.parent = parentAgency;
          relationship.child = agency;
          await manager.save(AgencyRelationship, relationship);
        }
      } else {
        agency.parent = null;
        await manager.delete(AgencyRelationship, { child: { id: agency.id } });
      }

      await manager.save(Agency, agency);
    });
  }

  async remove(id: number): Promise<void> {
    await this.agencyRelationshipRepository.delete({ parent: { id } });
    await this.agencyRelationshipRepository.delete({ child: { id } });
    await this.agencyRepository.delete(id);
  }

  async createRelationship(
    parentId: number,
    childId: number,
  ): Promise<AgencyRelationship> {
    const relationship = this.agencyRelationshipRepository.create({
      parent: { id: parentId },
      child: { id: childId },
    });
    return this.agencyRelationshipRepository.save(relationship);
  }

  async getChildren(parentId: number): Promise<Agency[]> {
    const query = `
      WITH RECURSIVE child_agencies AS (
        SELECT * FROM agencies WHERE id = ?
        UNION
        SELECT a.* FROM agencies a
        INNER JOIN child_agencies ca ON ca.id = a.parent_id
      )
      SELECT * FROM child_agencies WHERE id != ?;
    `;

    const children = await this.agencyRepository.query(query, [
      parentId,
      parentId,
    ]);

    const formattedChildren = children.map((children) => {
      delete children.hash_password;
      return children;
    });
    return formattedChildren;
  }

  async getParents(childId: number): Promise<Agency[]> {
    const query = `
      WITH RECURSIVE parent_agencies AS (
        SELECT * FROM agencies WHERE id = ?
        UNION
        SELECT a.* FROM agencies a
        INNER JOIN parent_agencies pa ON pa.parent_id = a.id
      )
      SELECT * FROM parent_agencies WHERE id != ?;
    `;

    const parents = await this.agencyRepository.query(query, [
      childId,
      childId,
    ]);

    const formattedParents = parents.map((parent) => {
      delete parent.hash_password;
      return parent;
    });
    return formattedParents;
  }
}
