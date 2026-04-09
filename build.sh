#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install backend dependencies
pip install -r requirements.txt

# Build frontend
cd frontend
npm install
npm run build
cd ..
