import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ValidationException } from 'src/feature/shared/errorHandling/validation.exception';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        let jwt = request.headers.authorization;
        if(jwt == null || jwt == undefined) {
            throw new ValidationException(["invalidRequest"]);
        }
        let TokenArray = jwt.split(" ");
        let decodeToken = this.jwtService.decode(TokenArray[1]);
        return this.matchRoles(roles, decodeToken);
    }
    matchRoles(roles: string[], decodeToken: any): boolean {
        if (decodeToken == null || !roles.includes(decodeToken.role)) {
            throw new ValidationException(["invalidUser"]);
        }
        return true;
    }



}
