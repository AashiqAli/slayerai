module.exports = {
  apps: [{
    name: 'discord-bot',
    script: 'src/index.js',
    instances: 1,
    autorestart: true,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    merge_logs: true,
    // Restart on crash
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    // Auto restart on file changes
    watch: ['src'],
    watch_delay: 1000,
    ignore_watch: ['node_modules', 'logs', 'data', '.git']
  }]
};

