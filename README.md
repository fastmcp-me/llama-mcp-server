# LibreModel MCP Server 🤖

A Model Context Protocol (MCP) server that bridges Claude Desktop with your local LLM instance running via llama-server.

## Features

- 💬 **Full conversation support** with Local Model through Claude Desktop
- 🎛️ **Complete parameter control** (temperature, max_tokens, top_p, top_k)
- ✅ **Health monitoring** and server status checks
- 🧪 **Built-in testing tools** for different capabilities
- 📊 **Performance metrics** and token usage tracking
- 🔧 **Easy configuration** via environment variables

## Quick Start

    npm install # LibreModel MCP Server 🤖

A Model Context Protocol (MCP) server that bridges Claude Desktop with your local LLM instance running via llama-server.

## Features

- 💬 **Full conversation support** with LibreModel through Claude Desktop
- 🎛️ **Complete parameter control** (temperature, max_tokens, top_p, top_k)
- ✅ **Health monitoring** and server status checks
- 🧪 **Built-in testing tools** for different capabilities
- 📊 **Performance metrics** and token usage tracking
- 🔧 **Easy configuration** via environment variables

## Quick Start

### 1. Install Dependencies

```bash
cd llama-mcp
npm install
```

### 2. Build the Server

```bash
npm run build
```

### 3. Start Your LibreModel

Make sure llama-server is running with your model:

```bash
./llama-server -m lm37.gguf -c 2048 --port 8080
```

### 4. Configure Claude Desktop

Add this to your Claude Desktop configuration (`~/.config/claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "libremodel": {
      "command": "node",
      "args": ["/home/jerr/llama-mcp/dist/index.js"]
    }
  }
}
```

### 5. Restart Claude Desktop

Claude will now have access to LibreModel through MCP!

## Usage

Once configured, you can use these tools in Claude Desktop:

### 💬 `chat` - Main conversation tool
```
Use the chat tool to ask LibreModel: "What is your name and what can you do?"
```

### 🧪 `quick_test` - Test LibreModel capabilities  
```
Run a quick_test with type "creative" to see if LibreModel can write poetry
```

### 🏥 `health_check` - Monitor server status
```
Use health_check to see if LibreModel is running properly
```

## Configuration

Set environment variables to customize behavior:

```bash
export LLAMA_SERVER_URL="http://localhost:8080"  # Default llama-server URL
```

## Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `chat` | Converse with MOdel | `message`, `temperature`, `max_tokens`, `top_p`, `top_k`, `system_prompt` |
| `quick_test` | Run predefined capability tests | `test_type` (hello/math/creative/knowledge) |
| `health_check` | Check server health and status | None |

## Resources

- **Configuration**: View current server settings
- **Instructions**: Detailed usage guide and setup instructions

## Development

```bash
# Install dependencies
npm install # LibreModel MCP Server 🤖

A Model Context Protocol (MCP) server that bridges Claude Desktop with your local LLM instance running via llama-server.

## Features

- 💬 **Full conversation support** with LibreModel through Claude Desktop
- 🎛️ **Complete parameter control** (temperature, max_tokens, top_p, top_k)
- ✅ **Health monitoring** and server status checks
- 🧪 **Built-in testing tools** for different capabilities
- 📊 **Performance metrics** and token usage tracking
- 🔧 **Easy configuration** via environment variables

## Quick Start

### 1. Install Dependencies

```bash
cd llama-mcp
npm install
```

### 2. Build the Server

```bash
npm run build
```

### 3. Start Your LibreModel

Make sure llama-server is running with your model:

```bash
./llama-server -m lm37.gguf -c 2048 --port 8080
```

### 4. Configure Claude Desktop

Add this to your Claude Desktop configuration (`~/.config/claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "libremodel": {
      "command": "node",
      "args": ["/home/jerr/llama-mcp/dist/index.js"]
    }
  }
}
```

### 5. Restart Claude Desktop

Claude will now have access to LibreModel through MCP!

## Usage

Once configured, you can use these tools in Claude Desktop:

### 💬 `chat` - Main conversation tool
```
Use the chat tool to ask LibreModel: "What is your name and what can you do?"
```

### 🧪 `quick_test` - Test LibreModel capabilities  
```
Run a quick_test with type "creative" to see if LibreModel can write poetry
```

### 🏥 `health_check` - Monitor server status
```
Use health_check to see if LibreModel is running properly
```

## Configuration

Set environment variables to customize behavior:

```bash
export LLAMA_SERVER_URL="http://localhost:8080"  # Default llama-server URL
```

## Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `chat` | Converse with MOdel | `message`, `temperature`, `max_tokens`, `top_p`, `top_k`, `system_prompt` |
| `quick_test` | Run predefined capability tests | `test_type` (hello/math/creative/knowledge) |
| `health_check` | Check server health and status | None |

## Resources

- **Configuration**: View current server settings
- **Instructions**: Detailed usage guide and setup instructions

## Development

```bash
# Install dependencies
npm install openconstruct/llama-mcp-server


# Development mode (auto-rebuild)
npm run dev

# Build for production
npm run build

# Start the server directly
npm start
```

## Architecture

```
Claude Desktop ←→ LLama MCP Server ←→ llama-server API ←→ Local Model
```

The MCP server acts as a bridge, translating MCP protocol messages into llama-server API calls and formatting responses for Claude Desktop.

## Troubleshooting

**"Cannot reach LLama server"**
- Ensure llama-server is running on the configured port
- Check that the model is loaded and responding
- Verify firewall/network settings

**"Tool not found in Claude Desktop"**
- Restart Claude Desktop after configuration changes
- Check that the path to `index.js` is correct and absolute
- Verify the MCP server builds without errors

**Poor response quality**
- Adjust temperature and sampling parameters
- Try different system prompts

## License

CC0-1.0 - Public Domain. Use freely!

---

Built with ❤️ for open-source AI and the LibreModel project. by Claude Sonnet4


# Development mode (auto-rebuild)
npm run dev

# Build for production
npm run build

# Start the server directly
npm start
```

## Architecture

```
Claude Desktop ←→ LLama MCP Server ←→ llama-server API ←→ Local Model
```

The MCP server acts as a bridge, translating MCP protocol messages into llama-server API calls and formatting responses for Claude Desktop.

## Troubleshooting

**"Cannot reach LLama server"**
- Ensure llama-server is running on the configured port
- Check that the model is loaded and responding
- Verify firewall/network settings

**"Tool not found in Claude Desktop"**
- Restart Claude Desktop after configuration changes
- Check that the path to `index.js` is correct and absolute
- Verify the MCP server builds without errors

**Poor response quality**
- Adjust temperature and sampling parameters
- Try different system prompts

## License

CC0-1.0 - Public Domain. Use freely!

---

Built with ❤️ for open-source AI and the LibreModel project. by Claude Sonnet4

### 1. Install Dependencies

```bash
cd llama-mcp
npm install
```

### 2. Build the Server

```bash
npm run build
```

### 3. Start Your LibreModel

Make sure llama-server is running with your model:

```bash
./llama-server -m lm37.gguf -c 2048 --port 8080
```

### 4. Configure Claude Desktop

Add this to your Claude Desktop configuration (`~/.config/claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "libremodel": {
      "command": "node",
      "args": ["/home/jerr/llama-mcp/dist/index.js"]
    }
  }
}
```

### 5. Restart Claude Desktop

Claude will now have access to LibreModel through MCP!

## Usage

Once configured, you can use these tools in Claude Desktop:

### 💬 `chat` - Main conversation tool
```
Use the chat tool to ask LibreModel: "What is your name and what can you do?"
```

### 🧪 `quick_test` - Test LibreModel capabilities  
```
Run a quick_test with type "creative" to see if LibreModel can write poetry
```

### 🏥 `health_check` - Monitor server status
```
Use health_check to see if LibreModel is running properly
```

## Configuration

Set environment variables to customize behavior:

```bash
export LLAMA_SERVER_URL="http://localhost:8080"  # Default llama-server URL
```

## Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `chat` | Converse with MOdel | `message`, `temperature`, `max_tokens`, `top_p`, `top_k`, `system_prompt` |
| `quick_test` | Run predefined capability tests | `test_type` (hello/math/creative/knowledge) |
| `health_check` | Check server health and status | None |

## Resources

- **Configuration**: View current server settings
- **Instructions**: Detailed usage guide and setup instructions

## Development

```bash
# Install dependencies
npm install

# Development mode (auto-rebuild)
npm run dev

# Build for production
npm run build

# Start the server directly
npm start
```

## Architecture

```
Claude Desktop ←→ LLama MCP Server ←→ llama-server API ←→ Local Model
```

The MCP server acts as a bridge, translating MCP protocol messages into llama-server API calls and formatting responses for Claude Desktop.

## Troubleshooting

**"Cannot reach LLama server"**
- Ensure llama-server is running on the configured port
- Check that the model is loaded and responding
- Verify firewall/network settings

**"Tool not found in Claude Desktop"**
- Restart Claude Desktop after configuration changes
- Check that the path to `index.js` is correct and absolute
- Verify the MCP server builds without errors

**Poor response quality**
- Adjust temperature and sampling parameters
- Try different system prompts

## License

CC0-1.0 - Public Domain. Use freely!

---

Built with ❤️ for open-source AI and the LibreModel project. by Claude Sonnet4

