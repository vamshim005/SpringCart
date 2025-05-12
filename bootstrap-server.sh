#!/bin/bash
set -e

# Update and install base tools
apt update && apt -y upgrade
apt install -y curl git ufw fail2ban docker.io docker-compose nginx certbot python3-certbot-nginx

# Add swap
fallocate -l 1G /swapfile && chmod 600 /swapfile
mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Firewall & SSH hardening
ufw allow OpenSSH
ufw allow 80,443/tcp
ufw --force enable
sed -i 's/^#Port 22/Port 2222/' /etc/ssh/sshd_config
systemctl reload sshd

# Add a new sudo user (replace 'ubuntu' with your username)
useradd -m -s /bin/bash ubuntu
usermod -aG sudo ubuntu
usermod -aG docker ubuntu
echo "ubuntu:changeme" | chpasswd

echo "Setup complete. Please log in as 'ubuntu' on port 2222 and continue." 