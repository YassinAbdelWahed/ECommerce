import { Injectable } from "@nestjs/common"
import { IUser } from "src/common"

@Injectable()
export class UserService {
    constructor() { }

    allUsers(): IUser[] {

        return [{ id: 2, username: "yassin", email: "yassinmohmed67@gmail.com", password: "12345" }]
    }

}