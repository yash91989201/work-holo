export interface Connection {
  id: string;
  userId: string;
  rooms: Set<string>;
  send: (message: unknown) => void;
}

export class ConnectionRegistry {
  private readonly connections = new Map<string, Connection>();
  private readonly roomMembers = new Map<string, Set<string>>();

  register(connection: Connection): void {
    this.connections.set(connection.id, connection);
  }

  unregister(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      for (const room of connection.rooms) {
        this.leaveRoom(connectionId, room);
      }
      this.connections.delete(connectionId);
    }
  }

  getConnection(connectionId: string): Connection | undefined {
    return this.connections.get(connectionId);
  }

  joinRoom(connectionId: string, room: string): boolean {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      return false;
    }

    connection.rooms.add(room);

    if (!this.roomMembers.has(room)) {
      this.roomMembers.set(room, new Set());
    }

    const members = this.roomMembers.get(room);
    if (members) {
      members.add(connectionId);
    }

    return true;
  }

  leaveRoom(connectionId: string, room: string): boolean {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      return false;
    }

    connection.rooms.delete(room);

    const members = this.roomMembers.get(room);
    if (members) {
      members.delete(connectionId);

      if (members.size === 0) {
        this.roomMembers.delete(room);
      }
    }

    return true;
  }

  getRoomMembers(room: string): Connection[] {
    const memberIds = this.roomMembers.get(room);
    if (!memberIds) {
      return [];
    }

    const members: Connection[] = [];
    for (const id of memberIds) {
      const connection = this.connections.get(id);
      if (connection) {
        members.push(connection);
      }
    }

    return members;
  }

  isInRoom(connectionId: string, room: string): boolean {
    const connection = this.connections.get(connectionId);
    return connection?.rooms.has(room) ?? false;
  }
}
