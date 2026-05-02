#!/bin/sh

# Wait for MongoDB to be ready
for i in $(seq 1 30); do
  if npm run create-admin; then
    echo "Admin created or already exists"
    break
  fi
  echo "Waiting for database... ($i/30)"
  sleep 1
done

# Start the application
npm start
