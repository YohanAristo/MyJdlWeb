import { BaseResponse } from '../common/base-response';
import { PrivilegeList } from './privilege-list';

export class GetLoginRespV2 extends BaseResponse{
    email: string;
    nama: string;
    nip: string;
    privilege_list: [
        PrivilegeList
    ]
}
