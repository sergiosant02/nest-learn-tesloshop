import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageWsService } from './message-ws.service';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
  ) {}

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client);
    console.log('Client disconnected', client.id);
    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClientsId(),
    );
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.Authorization as string;
    try {
      const payload = this.jwtService.verify(token);
      await this.messageWsService.registerclient(client, payload.id);
      this.wss.emit(
        'clients-updated',
        this.messageWsService.getConnectedClientsId(),
      );
    } catch (error) {
      client.disconnect();
      return;
    }
  }

  getConnectedClients() {
    return Object.keys(this.messageWsService.getConnectedClients()).length;
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: any) {
    this.wss.emit('message-from-server', {
      id: client.id,
      fullName:
        this.messageWsService.getConnectedClients()[client.id].user.fullname,
      message: payload.message,
    });
  }
}
