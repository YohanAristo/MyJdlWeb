import { BaseResponse } from '../common/base-response';
import { ListReimburse } from './list-reimburse';

export class GetFilterReimburseResp extends BaseResponse{
    list_reimburse: [
        ListReimburse
    ]
}
