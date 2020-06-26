import { BaseResponse } from '../common/base-response';
import { ListReimburseFilter } from './list-reimburse-filter';

export class GetReimburseSummaryResp extends BaseResponse{
    unfinished_count: number;
    unpaid_count: number;
    unsent_count: number;
    unpaid_list: [
        ListReimburseFilter
    ];
    unsent_list: [
        ListReimburseFilter
    ]
}
