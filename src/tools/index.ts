import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Config } from '../config.js';
import { registerDocTools } from './docs.js';
import { registerStudentTools } from './students.js';
import { registerClubTools } from './clubs.js';
import { registerProjectTools } from './projects.js';
import { registerNeisTools } from './neis.js';
import { registerOauthTools } from './oauth.js';

export function registerAllTools(server: McpServer, config: Config): void {
  registerDocTools(server, config);
  registerOauthTools(server, config);
  registerStudentTools(server, config);
  registerClubTools(server, config);
  registerProjectTools(server, config);
  registerNeisTools(server, config);
}
