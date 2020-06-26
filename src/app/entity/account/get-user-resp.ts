import { BaseResponse } from '../common/base-response';
import { User } from './user';

export class GetUserResp extends BaseResponse{
    user: [
        User
    ]
}
