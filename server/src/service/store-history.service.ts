import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Brackets, FindManyOptions, FindOneOptions } from 'typeorm';
import StoreHistory from '../domain/store-history.entity';
import { StoreHistoryRepository } from '../repository/store-history.repository';

const relationshipNames = [];
relationshipNames.push('product');
relationshipNames.push('store');

@Injectable()
export class StoreHistoryService {
    logger = new Logger('StoreHistoryService');

    constructor(@InjectRepository(StoreHistoryRepository) private storeHistoryRepository: StoreHistoryRepository) {}

    async findById(id: string): Promise<StoreHistory | undefined> {
        const options = { relations: relationshipNames };
        return await this.storeHistoryRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<StoreHistory>): Promise<StoreHistory | undefined> {
        return await this.storeHistoryRepository.findOne(options);
    }

    async findAndCount(
        options: FindManyOptions<StoreHistory>,
        filter = {},
        departmentVisible = [],
    ): Promise<[StoreHistory[], number]> {
        let queryString = '';
        Object.keys(filter).forEach((item, index) => {
            if (item === 'endDate' || item === 'startDate') return;
            queryString += `StoreHistory.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'OR '}`;
        });
        let andQueryString = '';

        if (departmentVisible.length > 0) {
            andQueryString += `StoreHistory.department IN ${JSON.stringify(departmentVisible)
                .replace('[', '(')
                .replace(']', ')')}`;
        }
        if (filter['endDate'] && filter['startDate']) {
            andQueryString += ` AND StoreHistory.createdDate  >= '${filter['startDate']}' AND  StoreHistory.createdDate <= '${filter['endDate']} 24:00:00'`;
        }
        const queryBuilder = this.storeHistoryRepository
            .createQueryBuilder('StoreHistory')
            .leftJoinAndSelect('StoreHistory.product', 'product')
            .leftJoinAndSelect('StoreHistory.store', 'store')
            .where(andQueryString)
            .orderBy(`StoreHistory.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
            .skip(options.skip)
            .take(options.take);

        const count = this.storeHistoryRepository
            .createQueryBuilder('StoreHistory')
            .where(andQueryString)
            .orderBy(`StoreHistory.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
            .skip(options.skip)
            .take(options.take);
        if (queryString) {
            queryBuilder.andWhere(
                new Brackets(sqb => {
                    sqb.where(queryString);
                })
            );
            count.andWhere(
                new Brackets(sqb => {
                    sqb.where(queryString);
                })
            );
        }

        const result = await queryBuilder.getManyAndCount();
        result[1] = await count.getCount();
        return result;

        // options.cache = 3600000
    }

    async save(storeHistory: StoreHistory): Promise<StoreHistory | undefined> {
        return await this.storeHistoryRepository.save(storeHistory);
    }

    async saveMany(storeHistories: StoreHistory[]): Promise<StoreHistory[] | undefined> {
        return await this.storeHistoryRepository.save(storeHistories);
    }

    async update(storeHistory: StoreHistory): Promise<StoreHistory | undefined> {
        return await this.save(storeHistory);
    }

    async delete(storeHistory: StoreHistory): Promise<StoreHistory | undefined> {
        return await this.storeHistoryRepository.remove(storeHistory);
    }
}
