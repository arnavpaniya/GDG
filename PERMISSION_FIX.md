# Permission Fix for Backend

## Issue
```
sh: /Users/arnavpaniya/GDG/backend/node_modules/.bin/nodemon: Permission denied
```

## Quick Solutions

### Solution 1: Use Node Instead of Nodemon (Fastest)

```bash
cd backend
npm run dev:node
```

This runs the server with plain Node.js (no auto-reload, but works immediately).

### Solution 2: Fix Nodemon Permissions

```bash
cd backend
chmod +x node_modules/.bin/nodemon
npm run dev
```

### Solution 3: Reinstall Node Modules

```bash
cd backend
rm -rf node_modules
npm install
npm run dev
```

### Solution 4: Use npx

```bash
cd backend
npx nodemon server.js
```

### Solution 5: Global Nodemon

```bash
# Install nodemon globally
npm install -g nodemon

# Run from backend directory
cd backend
nodemon server.js
```

## Recommended: Use Solution 1

For immediate testing, use:
```bash
cd backend
npm run dev:node
```

The server will start on port 5000. You won't have auto-reload, but it will work perfectly for testing the integration.

## Why This Happens

This is a common macOS permission issue with npm packages. The nodemon binary doesn't have execute permissions after installation.

## After Fixing

Once the backend is running, you should see:
```
🚀  Nyaya AI Backend running on http://localhost:5000
   Environment : development
```

Then proceed to start the ML service and frontend!
