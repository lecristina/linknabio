#!/bin/bash

# Script para gerar NEXTAUTH_SECRET
echo "Gerando NEXTAUTH_SECRET..."
SECRET=$(openssl rand -base64 32)
echo ""
echo "Adicione esta linha ao seu .env.local:"
echo "NEXTAUTH_SECRET=$SECRET"
echo ""

