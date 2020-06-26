import { BaseResponse } from '../common/base-response';
import { ListInventory } from './list-inventory';

export class GetInventoryRespList extends BaseResponse{
    end_of_file: string;
    list_inventory: [
        ListInventory
    ]
}
