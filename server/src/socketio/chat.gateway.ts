import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: '*'
    },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
    ) {}

    afterInit(server: Server) {
        console.log(`Server initialized`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Client connected: ${client.id}`);
        const authHeader = client.handshake.headers['authorization'];

        if (authHeader) {
            try {
                // Giả sử token có định dạng "Bearer <token>"
                const token = authHeader.split(' ')[1];
                const decoded = this.jwtService.verify(token, {
                    secret: this.configService.get('JWT_SECRET'),
                });
                client.data = decoded; // Lưu dữ liệu người dùng vào socket
            } catch (error) {
                console.log(error);
                client.emit('error', {
                    message: 'Unauthorized',
                });
                client.disconnect();
            }
        } else {
            client.emit('error', {
                message: 'Unauthorized',
            });
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

}
