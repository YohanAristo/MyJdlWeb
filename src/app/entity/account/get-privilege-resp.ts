import { BaseResponse } from '../common/base-response';

export class GetPrivilegeResp extends BaseResponse{
    app_id: string;
    hak_akses: string;
    nip: string;
}
