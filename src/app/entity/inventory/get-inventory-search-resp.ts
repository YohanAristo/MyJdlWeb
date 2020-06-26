import { BaseResponse } from '../common/base-response';
import { ListInventorySearch } from './list-inventory-search';

export class GetInventorySearchRespList extends BaseResponse{
    list_search_suggestion : [
        ListInventorySearch
    ]
}
