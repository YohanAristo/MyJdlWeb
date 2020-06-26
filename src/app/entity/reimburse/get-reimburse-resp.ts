import { BaseResponse } from '../common/base-response';

export class GetReimburseResp extends BaseResponse{
    created_date: string;
    img_id: [ string ];
    item: string;
    keterangan: string;
    lunas_date: string;
    nama: string;
    nip: string;
    nominal: number;
    pk_id: string;
    sent_date: string;
}
