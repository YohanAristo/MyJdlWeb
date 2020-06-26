import { BaseResponse } from '../common/base-response';
import { PrivilegeList } from './privilege-list';

export class GetPrivilegeByNipResp extends BaseResponse{
    privilege_list:[
        PrivilegeList
    ]
}
