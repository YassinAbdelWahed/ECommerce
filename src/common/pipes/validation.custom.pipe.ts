import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { issue } from "node_modules/zod/v4/core/util.cjs";
import { ZodType } from "zod";


@Injectable()
export class CustomValidationPipe implements PipeTransform {

    constructor(private schema: ZodType) { }

    transform(value: any, metadata: ArgumentMetadata) {

        console.log({ value, metadata })

        const { error, success } = this.schema.safeParse(value);
        if (!success) {
            throw new BadRequestException({
                message: "validation error",
                cause: {
                    issues: error.issues.map((issue) => {
                        return { path: issue.path, message: issue.message }
                    })
                }
            })
        }

        return value;

    }
}