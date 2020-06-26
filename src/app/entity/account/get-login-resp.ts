import { BaseResponse } from '../common/base-response';

export class GetLoginResp extends BaseResponse{
    email:string;
    nama: string;
    nip: string;
}
