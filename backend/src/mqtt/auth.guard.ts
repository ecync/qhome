import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly configService: ConfigService) {}

	canActivate(context: ExecutionContext): boolean {
		// Only guard HTTP requests; allow others (e.g., MQTT, WebSocket)
		if (context.getType() !== 'http') {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const headers = request.headers || {};

		const expectedUser = this.configService.get<string>('API_USERNAME');
		const expectedPass = this.configService.get<string>('API_PASSWORD');

		if (!expectedUser || !expectedPass) {
			throw new UnauthorizedException('API credentials not configured');
		}

		// Header names are case-insensitive; Express lowercases keys.
		const headerUser: string | undefined = headers['x-username'] as string | undefined;
		// Support possible typo 'x-passsword' in addition to 'x-password'
		const headerPass: string | undefined = (headers['x-password'] || headers['x-passsword']) as string | undefined;

		if (!headerUser || !headerPass) {
			throw new UnauthorizedException('Missing X-USERNAME or X-PASSWORD');
		}

		if (headerUser !== expectedUser || headerPass !== expectedPass) {
			throw new UnauthorizedException('Invalid credentials');
		}

		return true;
	}
}

