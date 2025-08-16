#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

interface LlamaServerConfig {
  url: string;
  defaultTemperature: number;
  defaultMaxTokens: number;
  defaultTopP: number;
  defaultTopK: number;
  stopSequences: string[];
}

interface LlamaCompletionRequest {
  prompt: string;
  temperature: number;
  n_predict: number;
  top_p: number;
  top_k: number;
  stop: string[];
  stream: boolean;
}

interface LlamaCompletionResponse {
  content: string;
  stop: boolean;
  model: string;
  tokens_predicted: number;
  tokens_evaluated: number;
  generation_settings: any;
  prompt: string;
  truncated: boolean;
  stopped_eos: boolean;
  stopped_word: boolean;
  stopped_limit: boolean;
  stopping_word: string;
  tokens_cached: number;
  timings: any;
}

class LibreModelMCPServer {
  private server: McpServer;
  private config: LlamaServerConfig;

  constructor() {
    this.server = new McpServer({
      name: "libremodel-mcp-server",
      version: "1.0.0"
    });

    this.config = {
      url: process.env.LLAMA_SERVER_URL || "http://localhost:8080",
      defaultTemperature: 0.7,
      defaultMaxTokens: 512,
      defaultTopP: 0.95,
      defaultTopK: 40,
      stopSequences: ["Human:", "\nHuman:", "User:", "\nUser:", "<|user|>"]
    };

    this.setupTools();
    this.setupResources();
  }

  private setupTools() {
    // Main chat tool
    this.server.registerTool("chat", {
      title: "Chat with LibreModel",
      description: "Have a conversation with LibreModel (Gigi)",
      inputSchema: {
        message: z.string().describe("Your message to LibreModel"),
        temperature: z.number().min(0.0).max(2.0).default(this.config.defaultTemperature).describe("Sampling temperature (0.0-2.0)"),
        max_tokens: z.number().min(1).max(2048).default(this.config.defaultMaxTokens).describe("Maximum tokens to generate"),
        top_p: z.number().min(0.0).max(1.0).default(this.config.defaultTopP).describe("Nucleus sampling parameter"),
        top_k: z.number().min(1).default(this.config.defaultTopK).describe("Top-k sampling parameter"),
        system_prompt: z.string().default("").describe("Optional system prompt to prefix the conversation")
      }
    }, async (args) => {
      try {
        const response = await this.callLlamaServer({
          message: args.message,
          temperature: args.temperature || this.config.defaultTemperature,
          max_tokens: args.max_tokens || this.config.defaultMaxTokens,
          top_p: args.top_p || this.config.defaultTopP,
          top_k: args.top_k || this.config.defaultTopK,
          system_prompt: args.system_prompt || ""
        });

        return {
          content: [
            {
              type: "text",
              text: `**LibreModel (Gigi) responds:**\n\n${response.content}\n\n---\n*Tokens: ${response.tokens_predicted} | Model: ${response.model || "LibreModel"}*`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text", 
              text: `**Error communicating with LibreModel:**\n${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    });

    // Quick test tool
    this.server.registerTool("quick_test", {
      title: "Quick LibreModel Test",
      description: "Run a quick test to see if LibreModel is responding",
      inputSchema: {
        test_type: z.enum(["hello", "math", "creative", "knowledge"]).default("hello").describe("Type of test to run")
      }
    }, async (args) => {
      const testPrompts = {
        hello: "Hello! Can you introduce yourself?",
        math: "What is 15 + 27?",
        creative: "Write a short haiku about artificial intelligence.",
        knowledge: "What is the capital of France?"
      };

      const testPrompt = testPrompts[args.test_type as keyof typeof testPrompts] || testPrompts.hello;

      try {
        const response = await this.callLlamaServer({
          message: testPrompt,
          temperature: 0.7,
          max_tokens: 256,
          top_p: 0.95,
          top_k: 40,
          system_prompt: ""
        });

        return {
          content: [
            {
              type: "text",
              text: `**${args.test_type} test result:**\n\n**Prompt:** ${testPrompt}\n\n**LibreModel Response:**\n${response.content}\n\n**Performance:**\n- Tokens generated: ${response.tokens_predicted}\n- Tokens evaluated: ${response.tokens_evaluated}\n- Success: ✅`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `**${args.test_type} test failed:**\n${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    });

    // Server health check
    this.server.registerTool("health_check", {
      title: "Check LibreModel Server Health",
      description: "Check if the llama-server is running and responsive",
      inputSchema: {}
    }, async () => {
      try {
        // Create abort controller for timeout
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), 5000);

        const healthResponse = await fetch(`${this.config.url}/health`, {
          method: "GET",
          signal: abortController.signal
        });
        
        clearTimeout(timeoutId);

        const isHealthy = healthResponse.ok;
        const status = healthResponse.status;

        // Try to get server props if available
        let serverInfo = "No additional info available";
        try {
          const propsResponse = await fetch(`${this.config.url}/props`);
          if (propsResponse.ok) {
            const props = await propsResponse.json();
            serverInfo = JSON.stringify(props, null, 2);
          }
        } catch (e) {
          // Props endpoint might not exist, that's OK
        }

        return {
          content: [
            {
              type: "text",
              text: `**LibreModel Server Health Check:**\n\n**Status:** ${isHealthy ? "✅ Healthy" : "❌ Unhealthy"}\n**HTTP Status:** ${status}\n**Server URL:** ${this.config.url}\n\n**Server Information:**\n\`\`\`json\n${serverInfo}\n\`\`\``
            }
          ]
        };
      } catch (error) {
        const errorMessage = error instanceof Error && error.name === 'AbortError' 
          ? 'Request timed out after 5 seconds'
          : error instanceof Error ? error.message : String(error);
          
        return {
          content: [
            {
              type: "text",
              text: `**Health check failed:**\n❌ Cannot reach LibreModel server at ${this.config.url}\n\n**Error:** ${errorMessage}\n\n**Troubleshooting:**\n- Is llama-server running?\n- Is it listening on ${this.config.url}?\n- Check firewall/network settings`
            }
          ],
          isError: true
        };
      }
    });
  }

  private setupResources() {
    // Server configuration resource
    this.server.registerResource(
      "config",
      "libremodel://config",
      {
        title: "LibreModel MCP Server Configuration",
        description: "Current server configuration and settings",
        mimeType: "application/json"
      },
      async () => ({
        contents: [
          {
            uri: "libremodel://config", 
            text: JSON.stringify(this.config, null, 2),
            mimeType: "application/json"
          }
        ]
      })
    );

    // Usage instructions resource
    this.server.registerResource(
      "instructions",
      "libremodel://instructions",
      {
        title: "LibreModel MCP Usage Instructions",
        description: "How to use this MCP server with LibreModel",
        mimeType: "text/markdown"
      },
      async () => ({
        contents: [
          {
            uri: "libremodel://instructions",
            text: `# LibreModel MCP Server

This MCP server provides a bridge between Claude Desktop and your local LibreModel (Gigi) instance running via llama-server.

## Available Tools

### \`chat\`
Main tool for conversing with LibreModel. Supports full parameter control.

**Parameters:**
- \`message\` (required): Your message to LibreModel
- \`temperature\`: Sampling temperature (0.0-2.0, default: 0.7)
- \`max_tokens\`: Maximum tokens to generate (1-2048, default: 512)
- \`top_p\`: Nucleus sampling (0.0-1.0, default: 0.95)
- \`top_k\`: Top-k sampling (default: 40)
- \`system_prompt\`: Optional system prompt prefix

### \`quick_test\`
Run predefined tests to check LibreModel's capabilities.

**Test types:** hello, math, creative, knowledge

### \`health_check\`
Check if your llama-server is running and responsive.

## Setup

1. Make sure llama-server is running: \`./llama-server -m your_model.gguf -c 2048 --port 8080\`
2. Configure Claude Desktop to use this MCP server
3. Start chatting with LibreModel through Claude!

## Current Configuration

- Server URL: ${this.config.url}
- Default Temperature: ${this.config.defaultTemperature}
- Default Max Tokens: ${this.config.defaultMaxTokens}

Made with ❤️ for open-source AI!`,
            mimeType: "text/markdown"
          }
        ]
      })
    );
  }

  private async callLlamaServer(params: {
    message: string;
    temperature: number;
    max_tokens: number;
    top_p: number;
    top_k: number;
    system_prompt: string;
  }): Promise<LlamaCompletionResponse> {
    const prompt = params.system_prompt 
      ? `${params.system_prompt}\n\nHuman: ${params.message}\n\nAssistant:`
      : `Human: ${params.message}\n\nAssistant:`;

    const requestBody: LlamaCompletionRequest = {
      prompt,
      temperature: params.temperature,
      n_predict: params.max_tokens,
      top_p: params.top_p,
      top_k: params.top_k,
      stop: this.config.stopSequences,
      stream: false
    };

    const response = await fetch(`${this.config.url}/completion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as LlamaCompletionResponse;
    
    if (!data.content) {
      throw new Error("No content in response from llama-server");
    }

    return data;
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error("🚀 LibreModel MCP Server started successfully!");
    console.error(`📡 Connected to llama-server at: ${this.config.url}`);
    console.error("💬 Ready to bridge Claude Desktop ↔ LibreModel!");
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('\n🛑 Shutting down LibreModel MCP Server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('\n🛑 Shutting down LibreModel MCP Server...');
  process.exit(0);
});

// Start the server
const server = new LibreModelMCPServer();
server.start().catch(error => {
  console.error('💥 Failed to start LibreModel MCP Server:', error);
  process.exit(1);
});
