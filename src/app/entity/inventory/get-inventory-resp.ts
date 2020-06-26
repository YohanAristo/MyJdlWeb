import { BaseResponse } from '../common/base-response';

export class GetInventoryResp extends BaseResponse{
    kode_barang: string;
    nama_barang: string;
    kategori_barang: string;
    jumlah_barang: number;
    satuan: string;
    harga_barang: number;
    habis_pakai: string;
    keterangan: string;
}
