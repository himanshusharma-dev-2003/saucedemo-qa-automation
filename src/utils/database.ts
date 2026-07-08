import * as mysql from 'mysql2/promise';
import { databaseConfig } from '../config/databaseConfig';

export interface IDatabase {
  connect(): Promise<void>;
  executeQuery(query: string, params?: any[]): Promise<any[]>;
  disconnect(): Promise<void>;
}

export class MySQLDatabase implements IDatabase {
  private connection: mysql.Connection | null = null;

  async connect(): Promise<void> {
    try {
      this.connection = await mysql.createConnection({
        host: databaseConfig.host,
        port: databaseConfig.port,
        user: databaseConfig.user,
        password: databaseConfig.password,
        database: databaseConfig.database,
      });
      console.log('✅ Connected to MySQL database');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async executeQuery(query: string, params: any[] = []): Promise<any[]> {
    if (!this.connection) {
      throw new Error('Database not connected. Call connect() first.');
    }
    try {
      const [rows] = await this.connection.execute(query, params);
      // MySQL returns rows as RowDataPacket[], casting to generic any[] for JSON
      return rows as any[];
    } catch (error) {
      console.error('❌ Query execution failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
      console.log('✅ Disconnected from MySQL database');
    }
  }
}

/**
 * Mock database implementation for use when testing without a real backend database.
 */
export class MockDatabase implements IDatabase {
  async connect(): Promise<void> {
    console.log('✅ Connected to MOCK database');
  }

  async executeQuery(query: string, params: any[] = []): Promise<any[]> {
    console.log(`Executing MOCK query: ${query} with params:`, params);
    
    // Simulate query returning order details
    if (query.includes('FROM orders') && params.length > 0) {
      const orderId = params[0];
      return [
        {
          order_id: orderId,
          customer_name: 'standard_user',
          total_amount: 32.39, // Match the typical SauceDemo total for the backpack
          order_status: 'PROCESSING'
        }
      ];
    }

    return [];
  }

  async disconnect(): Promise<void> {
    console.log('✅ Disconnected from MOCK database');
  }
}

/**
 * Factory that returns the appropriate database implementation based on env config.
 */
export const DatabaseFactory = (): IDatabase => {
  if (databaseConfig.host === 'mock') {
    return new MockDatabase();
  }
  return new MySQLDatabase();
};
